'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { Comment, CommentStatus, BannedUser, AutomodConfig, BanType } from '@/types';
import { getAutomodConfig } from '@/lib/automod';

// Get comments for moderation (with pagination and filtering)
export async function getCommentsForModerationAction(
  status?: CommentStatus | 'all',
  limit = 50,
  offset = 0
) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    let query = supabaseAdmin.from('comments').select('*', { count: 'exact' });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching comments:', error);
      return { comments: [], total: 0, error: error.message };
    }

    return { comments: data || [], total: count || 0 };
  } catch (error) {
    console.error('Error in getCommentsForModerationAction:', error);
    return { comments: [], total: 0, error: String(error) };
  }
}

// Approve comment
export async function approveCommentAction(commentId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from('comments')
      .update({ status: 'approved' })
      .eq('id', commentId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in approveCommentAction:', error);
    return { success: false, error: String(error) };
  }
}

// Reject comment
export async function rejectCommentAction(commentId: string, reason: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from('comments')
      .update({ status: 'rejected', rejection_reason: reason })
      .eq('id', commentId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in rejectCommentAction:', error);
    return { success: false, error: String(error) };
  }
}

// Delete comment
export async function deleteCommentAction(commentId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Delete all reactions and replies first
    await supabaseAdmin.from('reactions').delete().eq('comment_id', commentId);
    await supabaseAdmin.from('comments').delete().eq('parent_comment_id', commentId);

    // Delete the comment itself
    const { error } = await supabaseAdmin.from('comments').delete().eq('id', commentId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteCommentAction:', error);
    return { success: false, error: String(error) };
  }
}

// Ban user
export async function banUserAction(ban_type: BanType, banned_value: string, reason: string, expiryDays?: number) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const expires_at = expiryDays ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString() : null;

    const { error } = await supabaseAdmin
      .from('banned_users')
      .insert([
        {
          ban_type,
          banned_value,
          reason,
          expires_at,
        },
      ])
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in banUserAction:', error);
    return { success: false, error: String(error) };
  }
}

// Unban user
export async function unbanUserAction(bannedUserId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin.from('banned_users').delete().eq('id', bannedUserId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in unbanUserAction:', error);
    return { success: false, error: String(error) };
  }
}

// Get banned users
export async function getBannedUsersAction(limit = 50, offset = 0) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, count, error } = await supabaseAdmin
      .from('banned_users')
      .select('*', { count: 'exact' })
      .order('banned_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return { banned_users: [], total: 0, error: error.message };
    }

    return { banned_users: data || [], total: count || 0 };
  } catch (error) {
    console.error('Error in getBannedUsersAction:', error);
    return { banned_users: [], total: 0, error: String(error) };
  }
}

// Get automod settings
export async function getAutomodSettingsAction(): Promise<AutomodConfig | null> {
  try {
    return await getAutomodConfig();
  } catch (error) {
    console.error('Error in getAutomodSettingsAction:', error);
    return null;
  }
}

// Update automod setting
export async function updateAutomodSettingAction(key: string, value: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { error } = await supabaseAdmin
      .from('automod_settings')
      .update({ setting_value: value })
      .eq('setting_key', key);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateAutomodSettingAction:', error);
    return { success: false, error: String(error) };
  }
}

// Search comments
export async function searchCommentsAction(
  query: string,
  status?: CommentStatus,
  limit = 50,
  offset = 0
) {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    let searchQuery = supabaseAdmin.from('comments').select('*', { count: 'exact' });

    // Search by author name or email
    searchQuery = searchQuery.or(`author_name.ilike.%${query}%,author_email.ilike.%${query}%,content.ilike.%${query}%`);

    if (status) {
      searchQuery = searchQuery.eq('status', status);
    }

    const { data, count, error } = await searchQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return { comments: [], total: 0, error: error.message };
    }

    return { comments: data || [], total: count || 0 };
  } catch (error) {
    console.error('Error in searchCommentsAction:', error);
    return { comments: [], total: 0, error: String(error) };
  }
}

// Get comment statistics
export async function getCommentStatsAction() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { count: total } = await supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact', head: true });

    const { count: pending } = await supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: approved } = await supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { count: rejected } = await supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    const { count: spam } = await supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'spam');

    return {
      total: total || 0,
      pending: pending || 0,
      approved: approved || 0,
      rejected: rejected || 0,
      spam: spam || 0,
    };
  } catch (error) {
    console.error('Error in getCommentStatsAction:', error);
    return { total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 };
  }
}
