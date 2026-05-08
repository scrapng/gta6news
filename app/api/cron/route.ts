import { NextRequest, NextResponse } from 'next/server';
import { runPipeline } from '@/lib/pipeline';

export async function GET(request: NextRequest) {
  try {
    // Verify the secret from the Authorization header
    const authHeader = request.headers.get('Authorization');
    const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

    if (!authHeader || authHeader !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run the pipeline
    console.log('[CRON] Starting pipeline run...');
    const articles = await runPipeline(1, true); // Generate 1 article, auto-publish

    return NextResponse.json(
      {
        success: true,
        message: `Generated and published ${articles.length} article(s)`,
        articles: articles.map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[CRON] Pipeline error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
