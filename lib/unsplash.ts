import { openai, MODEL } from './openai';

export interface UnsplashImageMetadata {
  url: string | null;
  photographerName: string;
  photographerUrl: string | null;
  imageSourceUrl: string | null;
  source: 'unsplash' | 'internal';
}

const UNSPLASH_API_BASE = 'https://api.unsplash.com';
const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

/**
 * Fetch image metadata from Unsplash with photographer attribution
 */
export async function getImageFromUnsplash(query: string): Promise<UnsplashImageMetadata> {
  if (!unsplashKey) {
    console.warn('UNSPLASH_ACCESS_KEY not set, using placeholder');
    return {
      url: null,
      photographerName: 'GTA6News',
      photographerUrl: null,
      imageSourceUrl: null,
      source: 'internal',
    };
  }

  try {
    // Try primary search query
    let response = await fetchUnsplashImage(query);

    // If no results, try fallback searches
    if (!response) {
      const fallbackQueries = [
        'GTA 6 gaming',
        'video game neon',
        'gaming screenshot',
        'neon city lights',
        'futuristic game',
      ];

      for (const fallbackQuery of fallbackQueries) {
        response = await fetchUnsplashImage(fallbackQuery);
        if (response) break;
      }
    }

    // If still no results, return placeholder
    if (!response) {
      return {
        url: null,
        photographerName: 'GTA6News',
        photographerUrl: null,
        imageSourceUrl: null,
        source: 'internal',
      };
    }

    return response;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return {
      url: null,
      photographerName: 'GTA6News',
      photographerUrl: null,
      imageSourceUrl: null,
      source: 'internal',
    };
  }
}

/**
 * Internal function to fetch a single image from Unsplash
 */
async function fetchUnsplashImage(query: string): Promise<UnsplashImageMetadata | null> {
  try {
    const response = await fetch(
      `${UNSPLASH_API_BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${unsplashKey}`
    );

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const image = data.results[0];

    // Validate required fields
    if (!image.urls?.regular || !image.user?.name) {
      console.warn('Unsplash image missing required fields');
      return null;
    }

    return {
      url: image.urls.regular,
      photographerName: image.user.name || 'Unknown Photographer',
      photographerUrl: image.user.links?.html || null,
      imageSourceUrl: image.links?.html || null,
      source: 'unsplash',
    };
  } catch (error) {
    console.error('Error in fetchUnsplashImage:', error);
    return null;
  }
}

/**
 * Generate image search queries using Claude AI based on article content
 */
export async function generateImageSearchQueries(title: string, content: string, category: string): Promise<string[]> {
  try {
    const prompt = `Based on this GTA 6 article, generate 3 specific image search queries for Unsplash.
These should match the article topic and help find relevant gaming/GTA-related images.

Article Title: ${title}
Category: ${category}
Content Preview: ${content.substring(0, 300)}...

Return ONLY a JSON array of 3 search query strings, no other text.
Example: ["GTA 6 Vice City gameplay", "neon gaming aesthetic", "futuristic city lights"]`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      max_completion_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = response.choices[0]?.message?.content;
    if (!textContent) {
      throw new Error('Unexpected empty response from OpenAI');
    }

    let jsonText = textContent.trim();
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const queries = JSON.parse(jsonText) as string[];

    // Validate we got an array of strings
    if (!Array.isArray(queries) || !queries.every((q) => typeof q === 'string')) {
      throw new Error('Invalid response format from OpenAI');
    }

    return queries.slice(0, 3); // Ensure max 3 queries
  } catch (error) {
    console.error('Error generating image search queries:', error);
    // Return default fallback queries
    return ['GTA 6', 'gaming', 'neon city'];
  }
}

/**
 * Format image credit for display
 */
export function formatImageCredit(metadata: UnsplashImageMetadata): string {
  if (metadata.source === 'internal') {
    return 'GTA6News';
  }

  if (!metadata.photographerName) {
    return `Photo from ${metadata.source}`;
  }

  return `Photo by ${metadata.photographerName}`;
}

/**
 * Get full image attribution HTML
 */
export function getImageAttributionHTML(metadata: UnsplashImageMetadata): string {
  if (metadata.source === 'internal') {
    return '<span>Image by GTA6News</span>';
  }

  if (!metadata.photographerUrl || !metadata.imageSourceUrl) {
    return `<span>Photo by ${metadata.photographerName}</span>`;
  }

  return `<a href="${metadata.photographerUrl}" target="_blank" rel="noopener noreferrer">
    Photo by ${metadata.photographerName}
  </a> on <a href="${metadata.imageSourceUrl}" target="_blank" rel="noopener noreferrer">
    Unsplash
  </a>`;
}
