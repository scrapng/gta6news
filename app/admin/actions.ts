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

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to run pipeline');
    }

    return {
      success: true,
      articles: result.articles,
      message: `Generated ${result.articles.length} article(s)`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
