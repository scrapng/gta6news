'use server';

import { getSupabaseAdmin } from '@/lib/supabase';

export async function getArticleBySlugAction(slug: string) {
  try {
    console.log(`[Server Action] Fetching article with slug: ${slug}`);
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('[Server Action] Supabase error:', error);
      return null;
    }

    console.log(`[Server Action] Article found: ${data?.title}`);
    return data;
  } catch (error) {
    console.error('[Server Action] Error in getArticleBySlugAction:', error);
    return null;
  }
}

export async function getRelatedArticlesAction(category: string, slug: string, limit: number = 3) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .neq('slug', slug)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching related articles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRelatedArticlesAction:', error);
    return [];
  }
}
