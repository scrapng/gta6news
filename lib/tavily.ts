import { SearchResult } from '@/types';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY!;
const TAVILY_API_URL = 'https://api.tavily.com/search';

async function callTavily(body: Record<string, unknown>): Promise<Response> {
  return fetch(TAVILY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

async function readErrorDetail(response: Response): Promise<string> {
  // response.statusText is unreliable over HTTP/2 (no reason phrases), so
  // read the actual response body to get the real error from Tavily.
  try {
    const bodyText = await response.text();
    return bodyText || response.statusText || 'unknown error';
  } catch {
    return response.statusText || 'unknown error';
  }
}

export async function searchGTA6News(query: string): Promise<SearchResult[]> {
  if (!TAVILY_API_KEY) {
    throw new Error('TAVILY_API_KEY is not set');
  }

  try {
    let response = await callTavily({
      api_key: TAVILY_API_KEY,
      query,
      topic: 'news',
      days: 14,
      max_results: 10,
      include_answer: false,
      include_domains: [],
      exclude_domains: [],
    });

    if (!response.ok) {
      const detail = await readErrorDetail(response);
      console.warn(`Tavily search with topic/days failed (${response.status}): ${detail}. Retrying with basic params...`);

      // Fall back to a plain search in case this account/plan doesn't support
      // the topic/days filters, so article generation keeps working.
      response = await callTavily({
        api_key: TAVILY_API_KEY,
        query,
        max_results: 5,
        include_answer: false,
        include_domains: [],
        exclude_domains: [],
      });

      if (!response.ok) {
        const fallbackDetail = await readErrorDetail(response);
        throw new Error(`Tavily API error (${response.status}): ${fallbackDetail}`);
      }
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
