'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types';
import { formatDate, truncate } from '@/lib/utils';
import { Calendar, Clock, Tag } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  news: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  gameplay: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  story: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  leaks: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  community: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  analysis: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  const categoryColor = categoryColors[article.category] || categoryColors.news;

  return (
    <Link href={`/artykuly/${article.slug}`}>
      <div className="h-full neon-border rounded-lg overflow-hidden bg-bg-card/40 hover:bg-bg-card/80 transition-all duration-300 group cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-b from-bg-secondary to-bg-primary overflow-hidden">
          {article.cover_image ? (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-neon opacity-20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-card/80" />

          {/* Category Badge */}
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-mono font-semibold ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}>
            {article.category.toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          {/* Title */}
          <h3 className="text-lg md:text-xl font-display font-bold mb-2 text-text-primary group-hover:text-accent-neon-pink transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
            {truncate(article.excerpt, 120)}
          </p>

          {/* Meta */}
          <div className="flex gap-4 text-xs font-mono text-text-muted mb-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(article.published_at || article.created_at)}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {article.reading_time} min
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {article.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent-neon-purple/10 text-accent-purple rounded border border-accent-purple/30"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More */}
          <div className="pt-4 border-t border-accent-neon-pink/15 text-accent-neon-pink group-hover:text-accent-neon-cyan transition-colors duration-300 text-sm font-semibold">
            Czytaj dalej →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
