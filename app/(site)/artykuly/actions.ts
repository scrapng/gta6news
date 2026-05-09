'use server';

import { getSupabaseAdmin } from '@/lib/supabase';

export async function getArticleBySlugAction(slug: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getArticleBySlugAction:', error);
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
