'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { createSlug } from '@/lib/utils';
import { runAutomod, hashEmail, getAutomodConfig, getGravatarUrl } from '@/lib/automod';
import { Comment, SubmitCommentInput } from '@/types';
import { headers } from 'next/headers';

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

// Comment Actions

export async function submitCommentAction(input: SubmitCommentInput) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Get IP address from request headers
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
               headersList.get('x-real-ip') ||
               '0.0.0.0';
    const userAgent = headersList.get('user-agent') || undefined;

    // Validate input
    if (!input.author_name?.trim() || input.author_name.length > 100) {
      return { success: false, error: 'Invalid author name (1-100 characters)' };
    }

    if (!input.author_email?.trim() || input.author_email.length > 200) {
      return { success: false, error: 'Invalid email address' };
    }

    if (!input.content?.trim() || input.content.length < 1 || input.content.length > 5000) {
      return { success: false, error: 'Comment must be 1-5000 characters' };
    }

    // Get automod config
    const config = await getAutomodConfig();

    // Run automod checks
    const automodResult = await runAutomod(input.content, input.author_email, ip, config);

    if (automodResult.status === 'rejected') {
      return { success: false, error: 'Your comment was rejected due to policy violation', status: 'rejected' };
    }

    // Hash email
    const emailHash = hashEmail(input.author_email);

    // Save comment
    const { data: comment, error: insertError } = await supabaseAdmin
      .from('comments')
      .insert([
        {
          article_id: input.article_id,
          parent_comment_id: input.parent_comment_id || null,
          author_name: input.author_name.trim(),
          author_email: input.author_email.toLowerCase().trim(),
          author_email_hash: emailHash,
          content: input.content.trim(),
          status: automodResult.status,
          author_ip: ip,
          user_agent: userAgent,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting comment:', insertError);
      return { success: false, error: 'Failed to save comment' };
    }

    return {
      success: true,
      comment,
      status: automodResult.status,
      message: automodResult.status === 'approved' ? 'Comment posted!' : 'Comment submitted for review',
    };
  } catch (error) {
    console.error('Error in submitCommentAction:', error);
    return { success: false, error: 'Failed to submit comment' };
  }
}

export async function getCommentsForArticleAction(articleId: string, parentId?: string | null) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const parentFilter = parentId ? { parent_comment_id: parentId } : { parent_comment_id: null };

    const { data: comments, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .eq('status', 'approved')
      .match(parentFilter)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    if (!comments || comments.length === 0) {
      return [];
    }

    // Get reactions for each comment
    const { data: reactionsData } = await supabaseAdmin
      .from('reactions')
      .select('comment_id, reaction_emoji')
      .in(
        'comment_id',
        comments.map((c) => c.id)
      );

    // Group reactions by comment_id and emoji
    const reactionsMap = new Map<string, Map<string, number>>();
    reactionsData?.forEach((reaction) => {
      if (!reactionsMap.has(reaction.comment_id)) {
        reactionsMap.set(reaction.comment_id, new Map());
      }
      const emojiMap = reactionsMap.get(reaction.comment_id)!;
      emojiMap.set(reaction.reaction_emoji, (emojiMap.get(reaction.reaction_emoji) || 0) + 1);
    });

    // Transform comments to include reactions
    const commentsWithReactions: Comment[] = comments.map((comment) => ({
      ...comment,
      reactions: Array.from(reactionsMap.get(comment.id)?.entries() || []).map(([emoji, count]) => ({
        emoji,
        count,
      })),
    }));

    return commentsWithReactions;
  } catch (error) {
    console.error('Error in getCommentsForArticleAction:', error);
    return [];
  }
}

export async function getRepliesForCommentAction(parentId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data: replies, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .eq('parent_comment_id', parentId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching replies:', error);
      return [];
    }

    return replies || [];
  } catch (error) {
    console.error('Error in getRepliesForCommentAction:', error);
    return [];
  }
}

export async function addReactionAction(commentId: string, emoji: string) {
  try {
    // Validate emoji (1-10 chars)
    if (!emoji || emoji.length > 10) {
      return { success: false, error: 'Invalid emoji' };
    }

    // Get IP from headers
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
               headersList.get('x-real-ip') ||
               '0.0.0.0';

    const supabaseAdmin = getSupabaseAdmin();

    // Try to insert reaction
    const { error } = await supabaseAdmin
      .from('reactions')
      .insert([
        {
          comment_id: commentId,
          reaction_emoji: emoji,
          author_ip: ip,
        },
      ])
      .single();

    // If unique constraint violation, reaction already exists - treat as success
    if (error && error.code === '23505') {
      return { success: true, message: 'Reaction already added' };
    }

    if (error) {
      console.error('Error adding reaction:', error);
      return { success: false, error: 'Failed to add reaction' };
    }

    return { success: true, message: 'Reaction added' };
  } catch (error) {
    console.error('Error in addReactionAction:', error);
    return { success: false, error: 'Failed to add reaction' };
  }
}

export async function removeReactionAction(commentId: string, emoji: string) {
  try {
    // Get IP from headers
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
               headersList.get('x-real-ip') ||
               '0.0.0.0';

    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from('reactions')
      .delete()
      .match({
        comment_id: commentId,
        reaction_emoji: emoji,
        author_ip: ip,
      });

    if (error) {
      console.error('Error removing reaction:', error);
      return { success: false, error: 'Failed to remove reaction' };
    }

    return { success: true, message: 'Reaction removed' };
  } catch (error) {
    console.error('Error in removeReactionAction:', error);
    return { success: false, error: 'Failed to remove reaction' };
  }
}
