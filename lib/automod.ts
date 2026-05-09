import crypto from 'crypto';
import { getSupabaseAdmin } from './supabase';
import { AutomodConfig, CommentStatus } from '@/types';

// Common spam keywords in Polish and English
const DEFAULT_SPAM_KEYWORDS = [
  'viagra', 'cialis', 'casino', 'poker', 'lottery', 'win money',
  'bitcoin', 'crypto', 'forex', 'mlm', 'drop shipping',
  'click here', 'buy now', 'limited offer', 'act now',
  'weight loss', 'fat burner', 'muscle gain', 'steroids',
  'xxx', 'adult', 'porn', '18+',
];

// Common profanity in Polish
const DEFAULT_PROFANITY_WORDS = [
  'kurwa', 'jebać', 'pierdolić', 'suka', 'chuj', 'gówno',
  'penis', 'vagina', 'fuck', 'shit', 'ass', 'bitch',
];

// Link regex - matches URLs
const LINK_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

/**
 * Hash email address for privacy
 */
export function hashEmail(email: string): string {
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex');
}

/**
 * Check if email or IP is banned
 */
export async function isBanned(email: string, ip: string): Promise<boolean> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const emailHash = hashEmail(email);

    const { data } = await supabaseAdmin
      .from('banned_users')
      .select('id')
      .or(`and(ban_type.eq.email,banned_value.eq.${emailHash}),and(ban_type.eq.ip,banned_value.eq.${ip}),and(ban_type.eq.both,or(banned_value.eq.${emailHash},banned_value.eq.${ip}))`)
      .limit(1);

    return !!(data && data.length > 0);
  } catch (error) {
    console.error('Error checking ban status:', error);
    return false;
  }
}

/**
 * Check rate limit for IP
 */
export async function checkRateLimit(ip: string, config: AutomodConfig): Promise<boolean> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const windowMinutes = config.rate_limit_window_minutes;
    const limit = config.rate_limit_per_ip;

    const { count } = await supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('author_ip', ip)
      .eq('status', 'approved')
      .gt('created_at', new Date(Date.now() - windowMinutes * 60 * 1000).toISOString());

    return (count || 0) < limit;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return true; // Allow if check fails
  }
}

/**
 * Check if content contains links
 */
export function hasLinks(content: string): boolean {
  return LINK_REGEX.test(content);
}

/**
 * Check if content contains spam keywords
 */
export async function checkSpamKeywords(content: string): Promise<{ hasSpam: boolean; matchedKeywords: string[] }> {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Get spam keywords from database
    const { data: spamRules } = await supabaseAdmin
      .from('automod_rules')
      .select('pattern')
      .eq('rule_type', 'spam_keyword')
      .eq('enabled', true);

    const keywords = spamRules?.map((r) => r.pattern) || DEFAULT_SPAM_KEYWORDS;
    const contentLower = content.toLowerCase();
    const matched: string[] = [];

    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(contentLower)) {
        matched.push(keyword);
      }
    }

    return {
      hasSpam: matched.length > 0,
      matchedKeywords: matched,
    };
  } catch (error) {
    console.error('Error checking spam keywords:', error);
    return { hasSpam: false, matchedKeywords: [] };
  }
}

/**
 * Check if content contains profanity
 */
export async function checkProfanity(content: string, enabled: boolean): Promise<{ hasProfanity: boolean; matchedWords: string[] }> {
  if (!enabled) {
    return { hasProfanity: false, matchedWords: [] };
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    // Get profanity words from database
    const { data: profanityRules } = await supabaseAdmin
      .from('automod_rules')
      .select('pattern')
      .eq('rule_type', 'profanity')
      .eq('enabled', true);

    const words = profanityRules?.map((r) => r.pattern) || DEFAULT_PROFANITY_WORDS;
    const contentLower = content.toLowerCase();
    const matched: string[] = [];

    for (const word of words) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(contentLower)) {
        matched.push(word);
      }
    }

    return {
      hasProfanity: matched.length > 0,
      matchedWords: matched,
    };
  } catch (error) {
    console.error('Error checking profanity:', error);
    return { hasProfanity: false, matchedWords: [] };
  }
}

/**
 * Run full automod checks on comment content
 */
export async function runAutomod(
  content: string,
  email: string,
  ip: string,
  config: AutomodConfig
): Promise<{
  status: CommentStatus;
  violations: { type: string; severity: number; details: string }[];
}> {
  const violations: { type: string; severity: number; details: string }[] = [];
  let shouldReject = false;
  let shouldRequireApproval = false;

  // Check if banned
  const banned = await isBanned(email, ip);
  if (banned) {
    return {
      status: 'rejected',
      violations: [{ type: 'banned_user', severity: 5, details: 'User or IP is banned' }],
    };
  }

  // Check rate limit
  const passedRateLimit = await checkRateLimit(ip, config);
  if (!passedRateLimit) {
    violations.push({ type: 'rate_limit', severity: 3, details: `Exceeded ${config.rate_limit_per_ip} comments per hour` });
    shouldRequireApproval = true;
  }

  // Check spam keywords
  const spam = await checkSpamKeywords(content);
  if (spam.hasSpam) {
    violations.push({ type: 'spam_keywords', severity: 4, details: `Matched keywords: ${spam.matchedKeywords.join(', ')}` });
    shouldReject = true;
  }

  // Check profanity
  const profanity = await checkProfanity(content, config.profanity_filter_enabled);
  if (profanity.hasProfanity) {
    violations.push({ type: 'profanity', severity: 2, details: `Matched words: ${profanity.matchedWords.join(', ')}` });
    shouldRequireApproval = true;
  }

  // Check links
  if (config.link_detection_enabled && hasLinks(content)) {
    violations.push({ type: 'link_detected', severity: 1, details: 'Comment contains links' });
    shouldRequireApproval = true;
  }

  // Determine final status
  let status: CommentStatus = 'pending';
  if (shouldReject) {
    status = 'rejected';
  } else if (violations.length === 0 && config.auto_approve_if_pass_automod) {
    status = 'approved';
  } else if (shouldRequireApproval || violations.length > 0) {
    status = 'pending';
  } else if (config.auto_approve_if_pass_automod) {
    status = 'approved';
  }

  return { status, violations };
}

/**
 * Get current automod configuration
 */
export async function getAutomodConfig(): Promise<AutomodConfig> {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data } = await supabaseAdmin.from('automod_settings').select('setting_key, setting_value');

    const config: AutomodConfig = {
      rate_limit_per_ip: 10,
      rate_limit_window_minutes: 60,
      profanity_filter_enabled: true,
      link_detection_enabled: true,
      auto_approve_if_pass_automod: true,
      require_gravatar: true,
    };

    if (data) {
      data.forEach((row) => {
        if (row.setting_key === 'rate_limit_per_ip') {
          config.rate_limit_per_ip = parseInt(row.setting_value);
        } else if (row.setting_key === 'rate_limit_window_minutes') {
          config.rate_limit_window_minutes = parseInt(row.setting_value);
        } else if (row.setting_key === 'profanity_filter_enabled') {
          config.profanity_filter_enabled = row.setting_value === 'true';
        } else if (row.setting_key === 'link_detection_enabled') {
          config.link_detection_enabled = row.setting_value === 'true';
        } else if (row.setting_key === 'auto_approve_if_pass_automod') {
          config.auto_approve_if_pass_automod = row.setting_value === 'true';
        } else if (row.setting_key === 'require_gravatar') {
          config.require_gravatar = row.setting_value === 'true';
        }
      });
    }

    return config;
  } catch (error) {
    console.error('Error getting automod config:', error);
    // Return defaults if error
    return {
      rate_limit_per_ip: 10,
      rate_limit_window_minutes: 60,
      profanity_filter_enabled: true,
      link_detection_enabled: true,
      auto_approve_if_pass_automod: true,
      require_gravatar: true,
    };
  }
}

/**
 * Get Gravatar URL for email
 */
export function getGravatarUrl(email: string, size: number = 48): string {
  const hash = hashEmail(email);
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}
