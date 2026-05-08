-- GTA6News Portal - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor to set up the database schema

-- Create articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('news', 'gameplay', 'story', 'leaks', 'community', 'analysis')),
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  source_urls TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'AI Redakcja GTA6News',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'rejected')),
  seo_title TEXT,
  seo_description TEXT,
  reading_time INTEGER,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for articles
CREATE INDEX articles_status_idx ON articles(status);
CREATE INDEX articles_category_idx ON articles(category);
CREATE INDEX articles_published_at_idx ON articles(published_at DESC);
CREATE INDEX articles_slug_idx ON articles(slug);

-- Create pipeline_logs table
CREATE TABLE pipeline_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  run_at TIMESTAMPTZ DEFAULT NOW(),
  articles_searched INTEGER DEFAULT 0,
  articles_generated INTEGER DEFAULT 0,
  articles_published INTEGER DEFAULT 0,
  errors TEXT[],
  duration_ms INTEGER
);

-- Create indexes for pipeline_logs
CREATE INDEX pipeline_logs_run_at_idx ON pipeline_logs(run_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published articles
CREATE POLICY "Published articles are readable by everyone" ON articles
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Pipeline logs are only readable by authenticated users" ON pipeline_logs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policies for service role (unrestricted)
CREATE POLICY "Service role can do anything on articles" ON articles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on pipeline_logs" ON pipeline_logs
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
