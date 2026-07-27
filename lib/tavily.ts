import { SearchResult } from '@/types';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY!;
const TAVILY_API_URL = 'https://api.tavily.com/search';

export async function searchGTA6News(query: string): Promise<SearchResult[]> {
  if (!TAVILY_API_KEY) {
    throw new Error('TAVILY_API_KEY is not set');
  }

  try {
    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        topic: 'news',
        days: 14,
        max_results: 10,
        include_answer: false,
        include_domains: [],
        exclude_domains: [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.results.map((result: any) => ({
      title: result.title,
      content: result.content || result.description,
      url: result.url,
      source: new URL(result.url).hostname,
    }));
  } catch (error) {
    console.error('Error searching GTA6 news:', error);
    throw error;
  }
}

export async function searchMultipleQueries(queries: string[]): Promise<SearchResult[]> {
  const allResults: SearchResult[] = [];
  const seenUrls = new Set<string>();

  for (const query of queries) {
    try {
      const results = await searchGTA6News(query);
      for (const result of results) {
        if (!seenUrls.has(result.url)) {
          seenUrls.add(result.url);
          allResults.push(result);
        }
      }
    } catch (error) {
      console.error(`Error searching for "${query}":`, error);
    }
  }

  return allResults;
}
