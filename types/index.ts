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
