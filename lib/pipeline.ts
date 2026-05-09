import { supabaseAdmin } from './supabase';
import { anthropic, MODEL } from './anthropic';
import { searchMultipleQueries } from './tavily';
import { Article, CreateArticleInput, GenerateArticleResponse, SearchResult } from '@/types';
import { createSlug, calculateReadingTime } from './utils';

const SEARCH_QUERIES = [
  'GTA 6 latest news today',
  'Grand Theft Auto VI newest updates 2026',
  'GTA 6 fun facts trivia',
  'GTA 6 development secrets behind the scenes',
  'GTA 6 Rockstar Games announcements',
  'GTA VI interesting details features',
  'GTA 6 Vice City new information',
  'Grand Theft Auto 6 gameplay secrets',
  'GTA 6 characters Lucia Jason',
  'GTA 6 world map discoveries',
];

const SYSTEM_PROMPT = `Jesteś doświadczonym redaktorem portalu GTA6News — największego polskiego serwisu o GTA 6.

WAŻNE: Dzisiaj jest MAJ 2026. Grand Theft Auto VI premiery MIAŁ 19 listopada 2026 r. na PS5 i Xbox Series X|S.
Jeśli artykuł mówi o spekulacjach na temat daty premiery 2025 - to informacja nieaktualna. GTA VI jest już dostępne.

Twoja rola: Tworzymy artykuły o NAJNOWSZYCH WIADOMOŚCIACH i CIEKAWOSTKACH dotyczących GTA 6.

Piszesz po POLSKU. Twoje artykuły są:
- Wciągające, napisane z pasją gracza
- Skupione na NOWYCH wiadomościach ze świata GTA 6
- Zawierające CIEKAWE FAKTY, TRIVIA i INFORMACJE NA TEMAT GRY
- Wolne od dosłownego kopiowania źródeł (zawsze parafrazuj!)
- Nasycone kontekstem, analizą i ekscytującymi szczegółami
- Zoptymalizowane pod SEO (naturalne użycie słów kluczowych)
- Długie (700-900 słów) i wartościowe dla gracza

RODZAJE TREŚCI, KTÓRE PISZEMY:
- NAJNOWSZE NEWSY: Ogłoszenia Rockstara, aktualizacje rozwojowe, premiery
- FUN FACTS: Ciekawe fakty o grze, easter eggi, szczegóły rozwojowe
- GAMEPLAY: Nowe funkcje, mechaniki, rozgrywka
- ŚWIAT GRY: Vice City, postacie, locations, lore
- CIEKAWOSTKI: Historia rozwoju, inspiracje, behind-the-scenes

Struktura artykułu:
1. Chwytliwy lead (2-3 zdania) - zapalaj zainteresowanie!
2. Główna treść z śródtytułami H2/H3 - szczegóły i kontekst
3. Analiza lub ciekawe powiązania - dodaj wartość
4. Podsumowanie - call-to-action

KATEGORIE: news, gameplay, story, leaks, community, analysis

⚠️ WAŻNE: Zwróć POPRAWNY, WAŻNY JSON bez błędów:
- Wszystkie znaki specjalne w stringach muszą być poprawnie escaped
- Brak znaków sterujących wewnątrz stringów
- Brak trailing commas
- Wszystkie cudzysłowy muszą być escaped jako \"
- Estructura: {
    "title": "...",
    "slug": "...",
    "excerpt": "...",
    "content": "...",
    "category": "...",
    "tags": [...],
    "seo_title": "...",
    "seo_description": "..."
  }`;

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
    max_tokens: 4000,
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

  let generated: GenerateArticleResponse;
  try {
    generated = JSON.parse(jsonText) as GenerateArticleResponse;
  } catch (parseError) {
    // Log the problematic JSON for debugging
    console.error('JSON parsing failed. Response length:', jsonText.length);
    console.error('First 500 chars:', jsonText.substring(0, 500));
    console.error('Last 500 chars:', jsonText.substring(Math.max(0, jsonText.length - 500)));
    throw new Error(`Failed to parse Claude response as JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
  }

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
        console.log(`Generated article: "${generated.title}" (${generated.content.length} chars)`);

        // Validate content length
        const wordCount = generated.content.split(/\s+/).length;
        console.log(`Article word count: ${wordCount} words (min required: 500)`);
        if (wordCount < 500) {
          errors.push(`Article "${generated.title}" too short (${wordCount} words)`);
          continue;
        }

        // Get image
        console.log(`Fetching image for article "${generated.title}"...`);
        const imageUrl = await getImageFromUnsplash(generated.category === 'story' ? 'Vice City neon' : 'GTA');

        // Create article data
        const generatedSlug = createSlug(generated.title); // Always generate from title for consistency
        const articleData: CreateArticleInput = {
          title: generated.title,
          slug: generatedSlug, // Use generated slug, not Claude's
          excerpt: generated.excerpt,
          content: generated.content,
          category: generated.category,
          tags: generated.tags,
          cover_image: imageUrl || undefined,
          source_urls: sources.map((s) => s.url),
          seo_title: generated.seo_title,
          seo_description: generated.seo_description,
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
