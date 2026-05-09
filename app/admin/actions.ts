'use server';

import { runPipeline } from '@/lib/pipeline';

export async function runPipelineAction() {
  try {
    console.log('Starting pipeline from admin action...');
    const articles = await runPipeline(1, true); // Generate 1 article, auto-publish

    console.log(`Pipeline completed: generated ${articles.length} articles`);

    return {
      success: true,
      articles: articles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        status: a.status,
      })),
      error: null,
      message: `Generated ${articles.length} article(s)`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Pipeline action error:', errorMessage);

    return {
      success: false,
      articles: [],
      error: errorMessage,
      message: null,
    };
  }
}
