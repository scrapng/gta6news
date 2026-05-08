import { NextRequest, NextResponse } from 'next/server';
import { runPipeline } from '@/lib/pipeline';

export async function POST(request: NextRequest) {
  try {
    // Verify API key from header
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { count = 1, auto_publish = false } = body;

    if (count < 1 || count > 10) {
      return NextResponse.json({ error: 'Count must be between 1 and 10' }, { status: 400 });
    }

    const articles = await runPipeline(count, auto_publish);

    return NextResponse.json(
      {
        success: true,
        articles: articles.map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          category: a.category,
          status: a.status,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
