-- Comments System Database Schema
-- Run this in Supabase SQL Editor

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL CHECK (char_length(author_name) >= 1 AND char_length(author_name) <= 100),
  author_email TEXT NOT NULL,
  author_email_hash TEXT NOT NULL, -- SHA-256 hash for privacy
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 5000),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  author_ip TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,

  -- Constraints
  CONSTRAINT valid_email CHECK (author_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_article_status ON comments(article_id, status) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_comments_article_date ON comments(article_id, created_at DESC) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_email_hash ON comments(author_email_hash);
CREATE INDEX IF NOT EXISTS idx_comments_ip ON comments(author_ip);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at DESC);

-- Reactions Table
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  reaction_emoji TEXT NOT NULL CHECK (char_length(reaction_emoji) >= 1 AND char_length(reaction_emoji) <= 10),
  author_ip TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate reactions from same IP per emoji per comment
  UNIQUE(comment_id, reaction_emoji, author_ip)
);

-- Indexes for reactions
CREATE INDEX IF NOT EXISTS idx_reactions_comment ON reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_reactions_emoji ON reactions(reaction_emoji);
CREATE INDEX IF NOT EXISTS idx_reactions_created ON reactions(created_at DESC);

-- Banned Users/IPs Table
CREATE TABLE IF NOT EXISTS banned_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ban_type TEXT NOT NULL CHECK (ban_type IN ('email', 'ip', 'both')),
  banned_value TEXT NOT NULL,
  reason TEXT NOT NULL,
  banned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  banned_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,

  -- Prevent duplicates
  UNIQUE(ban_type, banned_value)
);

-- Indexes for banned users
CREATE INDEX IF NOT EXISTS idx_banned_users_value ON banned_users(banned_value);
CREATE INDEX IF NOT EXISTS idx_banned_users_expires ON banned_users(expires_at) WHERE expires_at IS NOT NULL;

-- Automod Rules Table
CREATE TABLE IF NOT EXISTS automod_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type TEXT NOT NULL CHECK (rule_type IN ('spam_keyword', 'profanity', 'link_detection')),
  pattern TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT 'flag' CHECK (action IN ('flag', 'reject', 'require_approval')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  severity INTEGER NOT NULL DEFAULT 1 CHECK (severity >= 1 AND severity <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for automod rules
CREATE INDEX IF NOT EXISTS idx_automod_rules_type_enabled ON automod_rules(rule_type, enabled);

-- Automod Settings Table
CREATE TABLE IF NOT EXISTS automod_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default automod settings
INSERT INTO automod_settings (setting_key, setting_value, description) VALUES
  ('rate_limit_per_ip', '10', 'Max comments per hour per IP'),
  ('rate_limit_window_minutes', '60', 'Rate limit time window in minutes'),
  ('profanity_filter_enabled', 'true', 'Enable profanity detection'),
  ('link_detection_enabled', 'true', 'Detect links in comments'),
  ('auto_approve_if_pass_automod', 'true', 'Auto-approve comments that pass automod'),
  ('require_gravatar', 'true', 'Show Gravatar for authors')
ON CONFLICT (setting_key) DO NOTHING;

-- Automod Violations Log (optional, for analytics)
CREATE TABLE IF NOT EXISTS automod_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  rule_id UUID NOT NULL REFERENCES automod_rules(id) ON DELETE SET NULL,
  rule_type TEXT NOT NULL,
  matched_pattern TEXT NOT NULL,
  confidence FLOAT NOT NULL DEFAULT 0.5,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for violations
CREATE INDEX IF NOT EXISTS idx_automod_violations_comment ON automod_violations(comment_id);
CREATE INDEX IF NOT EXISTS idx_automod_violations_rule ON automod_violations(rule_id);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE automod_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automod_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE automod_violations ENABLE ROW LEVEL SECURITY;

-- Comments: Public can read approved comments
CREATE POLICY comments_read_approved ON comments
  FOR SELECT
  USING (status = 'approved');

-- Comments: Service role can do anything
CREATE POLICY comments_service_role ON comments
  FOR ALL
  USING (auth.uid() IS NULL OR current_setting('role') = 'authenticated');

-- Reactions: Public can read all reactions
CREATE POLICY reactions_read_all ON reactions
  FOR SELECT
  USING (true);

-- Reactions: Service role can do anything
CREATE POLICY reactions_service_role ON reactions
  FOR ALL
  USING (auth.uid() IS NULL);

-- Banned users: Only visible to authenticated/service role
CREATE POLICY banned_users_read_authenticated ON banned_users
  FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY banned_users_admin_all ON banned_users
  FOR ALL
  USING (auth.role() = 'service_role');

-- Automod rules: Service role only
CREATE POLICY automod_rules_service_role ON automod_rules
  FOR ALL
  USING (auth.role() = 'service_role');

-- Automod settings: Service role only
CREATE POLICY automod_settings_service_role ON automod_settings
  FOR ALL
  USING (auth.role() = 'service_role');

-- Automod violations: Service role only
CREATE POLICY automod_violations_service_role ON automod_violations
  FOR ALL
  USING (auth.role() = 'service_role');
