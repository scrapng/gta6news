'use server';

import { runPipeline } from '@/lib/pipeline';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function runPipelineAction() {
  try {
    console.log('Starting pipeline from admin action...');
    const articles = await runPipeline(1, true);

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

export async function fetchAdminDataAction() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: logsData } = await supabaseAdmin
      .from('pipeline_logs')
      .select('*')
      .order('run_at', { ascending: false })
      .limit(20);

    const { data: articlesData } = await supabaseAdmin
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    const { count: totalCount } = await supabaseAdmin
      .from('articles')
      .select('*', { count: 'exact', head: true });

    const { count: publishedCount } = await supabaseAdmin
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    const { count: draftCount } = await supabaseAdmin
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft');

    // Calculate total views
    const totalViews = (articlesData || []).reduce((sum, article) => sum + (article.views || 0), 0);

    return {
      success: true,
      logs: logsData || [],
      articles: articlesData || [],
      stats: {
        totalArticles: totalCount || 0,
        publishedArticles: publishedCount || 0,
        draftArticles: draftCount || 0,
        totalViews: totalViews,
      },
    };
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return {
      success: false,
      logs: [],
      articles: [],
      stats: {
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        totalViews: 0,
      },
      error: error instanceof Error ? error.message : 'Failed to fetch data',
    };
  }
}

export async function publishArticleAction(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin
      .from('articles')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', id);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to publish article',
    };
  }
}

export async function rejectArticleAction(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin.from('articles').update({ status: 'rejected' }).eq('id', id);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reject article',
    };
  }
}

export async function hideArticleAction(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin.from('articles').update({ status: 'draft' }).eq('id', id);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to hide article',
    };
  }
}

export async function deleteArticleAction(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin.from('articles').delete().eq('id', id);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete article',
    };
  }
}

export async function updateArticleAction(
  id: string,
  updates: {
    title?: string;
    excerpt?: string;
    content?: string;
    seo_title?: string;
    seo_description?: string;
    cover_image?: string;
    image_photographer_name?: string;
    image_photographer_url?: string;
    image_source?: string;
    image_source_url?: string;
  }
) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin.from('articles').update(updates).eq('id', id);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update article',
    };
  }
}
