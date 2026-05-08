import { supabaseAdmin } from './supabase';
import { anthropic, MODEL } from './anthropic';
import { searchMultipleQueries } from './tavily';
import { Article, CreateArticleInput, GenerateArticleResponse, SearchResult } from '@/types';
import { createSlug, calculateReadingTime } from './utils';

const SEARCH_QUERIES = [
  'GTA 6 news 2025',
  'Grand Theft Auto VI latest updates',
  'GTA 6 gameplay leak',
  'GTA 6 release date Rockstar',
  'GTA 6 Vice City details',
  'GTA 6 Lucia Jason characters',
  'GTA 6 map features',
  'GTA 6 online multiplayer',
];

const SYSTEM_PROMPT = `Jesteś doświadczonym redaktorem portalu GTA6News — największego polskiego serwisu o GTA 6.
Piszesz po POLSKU. Twoje artykuły są:
- Wciągające i napisane z pasją gracza
- Wolne od dosłownego kopiowania źródeł (zawsze parafrazuj!)
- Nasycone kontekstem i analizą, nie tylko suchymi faktami
- Zoptymalizowane pod SEO (naturalne użycie słów kluczowych)
- Długie (800-1200 słów) i wartościowe dla czytelnika

Struktura każdego artykułu:
1. Chwytliwy lead (2-3 zdania)
2. Główna treść z śródtytułami H2/H3
3. Analiza lub opinia redakcji
4. Podsumowanie z call-to-action

Kategoryzuj artykuły jako: news, gameplay, story, leaks, community, analysis
Zawsze zwróć JSON z polami: title, slug, excerpt, content (Markdown), category, tags[], seo_title, seo_description`;

async function deduplicateResults(results: SearchResult[]): Promise<SearchResult[]> {
  if (results.length === 0) return [];

  const { data: existingArticles } = await supabaseAdmin
    .from('articles')
    .select('source_urls')
    .limit(100);

  const usedUrls = new Set<string>();
  existingArticles?.forEach((article: any) => {
    article.source_urls?.forEach((url: string) => {
      usedUrls.add(url);
    });
  });

  return results.filter((result) => !usedUrls.has(result.url));
}

async function generateArticle(sources: SearchResult[]): Promise<GenerateArticleResponse> {
  if (sources.length === 0) {
    throw new Error('No sources provided for article generation');
  }

  const sourceText = sources
    .map((s) => `[${s.title}]: ${s.content}`)
    .join('\n\n');

  const userPrompt = `Na podstawie poniższych źródeł napisz nowy, oryginalny artykuł dla portalu GTA6News.
WAŻNE: Nie kopiuj treści — parafrazuj i dodaj własną analizę.

Źródła:
${sourceText}

Zwróć TYLKO poprawny JSON bez backtick-ów.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  let jsonText = content.text.trim();
  // Remove markdown code blocks if present
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }

  const generated = JSON.parse(jsonText) as GenerateArticleResponse;

  // Validate required fields
  if (!generated.title || !generated.excerpt || !generated.content || !generated.category) {
    throw new Error('Generated article missing required fields');
  }

  // Ensure slug is valid
  if (!generated.slug) {
    generated.slug = createSlug(generated.title);
  }

  return generated;
}

async function getImageFromUnsplash(query: string): Promise<string | null> {
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!unsplashKey) {
    console.warn('UNSPLASH_ACCESS_KEY not set, skipping image fetch');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${unsplashKey}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    return null;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return null;
  }
}

async function saveArticle(articleData: CreateArticleInput): Promise<Article> {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .insert([articleData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save article: ${error.message}`);
  }

  return data;
}

async function logPipelineRun(
  articlesSearched: number,
  articlesGenerated: number,
  articlesPublished: number,
  errors: string[],
  durationMs: number
): Promise<void> {
  const { error } = await supabaseAdmin.from('pipeline_logs').insert([
    {
      articles_searched: articlesSearched,
      articles_generated: articlesGenerated,
      articles_published: articlesPublished,
      errors,
      duration_ms: durationMs,
    },
  ]);

  if (error) {
    console.error('Failed to log pipeline run:', error);
  }
}

export async function runPipeline(count: number = 1, autoPublish: boolean = false): Promise<Article[]> {
  const startTime = Date.now();
  const errors: string[] = [];
  const articles: Article[] = [];

  try {
    // Step 1: Search for news
    console.log('Step 1: Searching for GTA 6 news...');
    const searchResults = await searchMultipleQueries(SEARCH_QUERIES);
    console.log(`Found ${searchResults.length} unique search results`);

    // Step 2: Deduplicate
    console.log('Step 2: Deduplicating results...');
    const deduplicatedResults = await deduplicateResults(searchResults);
    console.log(`${deduplicatedResults.length} results after deduplication`);

    if (deduplicatedResults.length === 0) {
      throw new Error('No new sources found after deduplication');
    }

    // Step 3: Generate articles
    console.log(`Step 3: Generating ${count} article(s)...`);
    for (let i = 0; i < count && i < deduplicatedResults.length; i++) {
      try {
        // Use a chunk of sources for each article
        const sourcesPerArticle = 3;
        const startIndex = i * sourcesPerArticle;
        const endIndex = Math.min(startIndex + sourcesPerArticle, deduplicatedResults.length);
        const sources = deduplicatedResults.slice(startIndex, endIndex);

        console.log(`Generating article ${i + 1}/${count} from sources ${startIndex}-${endIndex}...`);
        const generated = await generateArticle(sources);

        // Validate content length
        const wordCount = generated.content.split(/\s+/).length;
        if (wordCount < 600) {
          errors.push(`Article "${generated.title}" too short (${wordCount} words)`);
          continue;
        }

        // Get image
        console.log(`Fetching image for article "${generated.title}"...`);
        const imageUrl = await getImageFromUnsplash(generated.category === 'story' ? 'Vice City neon' : 'GTA');

        // Create article data
        const articleData: CreateArticleInput = {
          ...generated,
          cover_image: imageUrl || undefined,
          source_urls: sources.map((s) => s.url),
          reading_time: calculateReadingTime(generated.content),
        };

        // Save to database
        console.log(`Saving article "${generated.title}"...`);
        const savedArticle = await saveArticle({
          ...articleData,
          status: autoPublish ? 'published' : 'draft',
          published_at: autoPublish ? new Date().toISOString() : null,
        });

        articles.push(savedArticle);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`Error generating article ${i + 1}:`, msg);
        errors.push(`Article ${i + 1}: ${msg}`);
      }
    }

    // Log the pipeline run
    const durationMs = Date.now() - startTime;
    await logPipelineRun(
      deduplicatedResults.length,
      articles.length,
      articles.filter((a) => a.status === 'published').length,
      errors,
      durationMs
    );

    console.log(`Pipeline completed in ${durationMs}ms. Generated ${articles.length} articles.`);
    return articles;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Pipeline error:', msg);
    errors.push(`Fatal: ${msg}`);

    const durationMs = Date.now() - startTime;
    await logPipelineRun(0, 0, 0, errors, durationMs);

    throw error;
  }
}
