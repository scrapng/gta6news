export type ArticleCategory = 'news' | 'gameplay' | 'story' | 'leaks' | 'community' | 'analysis';
export type ArticleStatus = 'draft' | 'published' | 'rejected';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  tags: string[];
  cover_image: string | null;
  source_urls: string[];
  author: string;
  status: ArticleStatus;
  seo_title: string | null;
  seo_description: string | null;
  reading_time: number;
  views: number;
  created_at: string;
  published_at: string | null;
  updated_at: string;
}

export interface CreateArticleInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  tags: string[];
  cover_image?: string;
  source_urls: string[];
  seo_title?: string;
  seo_description?: string;
  reading_time: number;
  status?: ArticleStatus;
  published_at?: string | null;
}

export interface PipelineLog {
  id: string;
  run_at: string;
  articles_searched: number;
  articles_generated: number;
  articles_published: number;
  errors: string[];
  duration_ms: number;
}

export interface SearchResult {
  title: string;
  content: string;
  url: string;
  source: string;
}

export interface GenerateArticleResponse {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  tags: string[];
  seo_title: string;
  seo_description: string;
}

// Comment & Reactions Types
export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';
export type BanType = 'email' | 'ip' | 'both';
export type AutomodRuleType = 'spam_keyword' | 'profanity' | 'link_detection';

export interface Comment {
  id: string;
  article_id: string;
  parent_comment_id: string | null;
  author_name: string;
  author_email: string;
  author_email_hash: string;
  content: string;
  status: CommentStatus;
  author_ip: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
  approved_by?: string;
  rejection_reason?: string;
  replies?: Comment[];
  reactions?: ReactionData[];
}

export interface ReactionData {
  emoji: string;
  count: number;
  hasUserReacted?: boolean;
}

export interface Reaction {
  id: string;
  comment_id: string;
  reaction_emoji: string;
  author_ip: string;
  created_at: string;
  updated_at: string;
}

export interface BannedUser {
  id: string;
  ban_type: BanType;
  banned_value: string;
  reason: string;
  banned_at: string;
  banned_by?: string;
  expires_at?: string;
}

export interface AutomodRule {
  id: string;
  rule_type: AutomodRuleType;
  pattern: string;
  action: 'flag' | 'reject' | 'require_approval';
  enabled: boolean;
  severity: number;
  created_at: string;
  updated_at: string;
}

export interface AutomodViolation {
  id: string;
  comment_id: string;
  rule_id: string;
  rule_type: AutomodRuleType;
  matched_pattern: string;
  confidence: number;
  detected_at: string;
}

export interface SubmitCommentInput {
  article_id: string;
  parent_comment_id?: string;
  author_name: string;
  author_email: string;
  content: string;
}

export interface AutomodConfig {
  rate_limit_per_ip: number;
  rate_limit_window_minutes: number;
  profanity_filter_enabled: boolean;
  link_detection_enabled: boolean;
  auto_approve_if_pass_automod: boolean;
  require_gravatar: boolean;
}
