'use server';

export async function runPipelineAction() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CRON_SECRET || '',
      },
      body: JSON.stringify({ count: 1, auto_publish: true }),
    });

    const text = await response.text();

    if (!response.ok) {
      // Log the actual response for debugging
      console.error('Pipeline API error:', {
        status: response.status,
        statusText: response.statusText,
        response: text.substring(0, 500),
      });

      try {
        const result = JSON.parse(text);
        throw new Error(result.error || 'Failed to run pipeline');
      } catch (e) {
        throw new Error(`Server error (${response.status}): ${text.substring(0, 200)}`);
      }
    }

    const result = JSON.parse(text);

    return {
      success: true,
      articles: result.articles,
      message: `Generated ${result.articles.length} article(s)`,
    };
  } catch (error) {
    console.error('Pipeline action error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
