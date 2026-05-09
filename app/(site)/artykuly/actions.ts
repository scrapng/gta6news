'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { createSlug } from '@/lib/utils';

export async function getArticleBySlugAction(slug: string) {
  try {
    const normalizedSlug = createSlug(slug);
    console.log(`[Server Action] Fetching article with slug: ${slug} (normalized: ${normalizedSlug})`);
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('slug', normalizedSlug)
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
    const normalizedSlug = createSlug(slug);
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .neq('slug', normalizedSlug)
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
