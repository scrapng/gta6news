import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/lib/supabase';
import { formatDate, calculateReadingTime } from '@/lib/utils';
import { ArrowLeft, Share2, Calendar, Clock } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticle(slug: string) {
  try {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    return data;
  } catch {
    return null;
  }
}

async function getRelatedArticles(category: string, slug: string, limit: number = 3) {
  try {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .neq('slug', slug)
      .order('published_at', { ascending: false })
      .limit(limit);

    return data || [];
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Artykuł nie znaleziony - GTA6News',
    };
  }

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: `https://gta6news.pl/artykuly/${article.slug}`,
      images: article.cover_image ? [{ url: article.cover_image }] : [],
      authors: [article.author],
      publishedTime: article.published_at || article.created_at,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.category, slug);

  return (
    <article className="min-h-screen">
      {/* Back Button */}
      <div className="sticky top-16 z-40 bg-bg-primary/80 backdrop-blur-md border-b border-accent-neon-pink/15 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-3">
          <Link
            href="/artykuly"
            className="inline-flex items-center gap-2 text-accent-neon-pink hover:text-accent-neon-cyan transition-colors font-mono text-sm"
          >
            <ArrowLeft size={16} />
            Wróć do artykułów
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {article.cover_image && (
        <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Meta */}
        <div className="flex gap-6 items-center mb-8 flex-wrap text-sm font-mono">
          <span className={`px-3 py-1 rounded-full font-semibold border`}>
            {article.category.toUpperCase()}
          </span>
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar size={16} />
            {formatDate(article.published_at || article.created_at)}
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Clock size={16} />
            {article.reading_time} min czytania
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-text-primary leading-tight">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-text-secondary mb-8 pb-8 border-b border-accent-neon-pink/15">
          {article.excerpt}
        </p>

        {/* Share Buttons */}
        <div className="flex gap-3 mb-12">
          <button
            onClick={() => {
              const text = `${article.title} - GTA6News`;
              const url = window.location.href;
              navigator.share?.({ title: text, url });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-accent-neon-pink/30 hover:border-accent-neon-pink text-accent-neon-pink hover:text-accent-neon-cyan rounded-lg transition-all"
          >
            <Share2 size={16} />
            Udostępnij
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link skopiowany do schowka!');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-accent-neon-pink/30 hover:border-accent-neon-pink text-accent-neon-pink hover:text-accent-neon-cyan rounded-lg transition-all"
          >
            Kopiuj link
          </button>
        </div>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-16">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-display font-bold my-6 text-text-primary" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-display font-bold my-5 text-text-primary" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-display font-bold my-4 text-text-primary" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="my-4 text-text-primary leading-relaxed" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-accent-neon-pink hover:text-accent-neon-cyan underline"
                  {...props}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-accent-neon-pink pl-4 italic my-4 text-text-secondary"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => <ul className="list-disc list-inside my-4" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-4" {...props} />,
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Author */}
        <div className="py-8 border-t border-b border-accent-neon-pink/15 mb-16">
          <p className="text-sm text-text-muted mb-2">Autor:</p>
          <p className="text-lg font-display font-bold text-text-primary">{article.author}</p>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-16">
            <h3 className="text-sm font-display font-bold text-text-secondary mb-4">TAGI</h3>
            <div className="flex gap-3 flex-wrap">
              {article.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/artykuly?tag=${tag}`}
                  className="px-4 py-2 bg-accent-neon-pink/10 border border-accent-neon-pink/30 text-accent-neon-pink hover:bg-accent-neon-pink/20 hover:border-accent-neon-pink/60 rounded-lg transition-all text-sm"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="w-full py-16 md:py-20 bg-gradient-to-b from-transparent to-bg-secondary/30 border-t border-accent-neon-pink/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold mb-8">
              <span className="text-accent-neon-pink">POWIĄZANE</span> ARTYKUŁY
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((art) => (
                <ArticleCard key={art.id} article={art} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
