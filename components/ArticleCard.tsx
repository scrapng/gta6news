'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types';
import { formatDate, truncate } from '@/lib/utils';
import { Calendar, Clock, Tag } from 'lucide-react';
import ImageCredit from '@/components/ImageCredit';

interface ArticleCardProps {
  article: Article;
}

const categoryColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  news: { bg: 'bg-accent-ocean-blue/10', text: 'text-accent-ocean-blue', border: 'border-accent-ocean-blue/30', glow: 'neon-glow-cyan' },
  gameplay: { bg: 'bg-accent-neon-lime/10', text: 'text-accent-neon-lime', border: 'border-accent-neon-lime/30', glow: 'neon-glow-lime' },
  story: { bg: 'bg-accent-purple-haze/10', text: 'text-accent-purple-haze', border: 'border-accent-purple-haze/30', glow: 'neon-glow-cyan' },
  leaks: { bg: 'bg-accent-neon-magenta/10', text: 'text-accent-neon-magenta', border: 'border-accent-neon-magenta/30', glow: 'neon-glow-magenta' },
  community: { bg: 'bg-accent-neon-orange/10', text: 'text-accent-neon-orange', border: 'border-accent-neon-orange/30', glow: 'neon-glow-orange' },
  analysis: { bg: 'bg-accent-neon-cyan/10', text: 'text-accent-neon-cyan', border: 'border-accent-neon-cyan/30', glow: 'neon-glow-cyan' },
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  const categoryColor = categoryColors[article.category] || categoryColors.news;

  return (
    <Link href={`/artykuly/${article.slug}`}>
      <div className="h-full rounded-lg overflow-hidden bg-bg-card neon-border transition-all duration-300 group cursor-pointer card-hover-strong">
        {/* Image container */}
        <div className="relative h-48 md:h-56 bg-gradient-dark overflow-hidden">
          {article.cover_image ? (
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-miami opacity-20" />
          )}

          {/* Gradient overlay with magenta tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-card" />
          <div className="absolute inset-0 bg-accent-neon-magenta/5 group-hover:bg-accent-neon-magenta/10 transition-colors duration-300" />

          {/* Category Badge - Enhanced */}
          <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border} transition-all duration-300 group-hover:${categoryColor.glow}`}>
            {article.category}
          </div>

          {/* Image Credit */}
          {article.cover_image && (
            <ImageCredit
              photographerName={article.image_photographer_name}
              photographerUrl={article.image_photographer_url}
              imageSourceUrl={article.image_source_url}
              imageSource={article.image_source}
              variant="card"
            />
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 md:p-6 flex flex-col h-full">
          {/* Title */}
          <h3 className="text-lg md:text-xl font-display font-bold mb-3 text-text-primary group-hover:text-accent-neon-magenta transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-grow">
            {truncate(article.excerpt, 120)}
          </p>

          {/* Meta - Improved styling */}
          <div className="flex gap-4 text-xs font-mono text-text-muted mb-4 pb-4 border-b border-border-light">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-accent-neon-magenta/60" />
              <span>{formatDate(article.published_at || article.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-accent-neon-cyan/60" />
              <span>{article.reading_time} min</span>
            </div>
          </div>

          {/* Tags - Miami neon styling */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {article.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-accent-neon-cyan/10 text-accent-neon-cyan rounded border border-accent-neon-cyan/30 font-mono uppercase tracking-tighter"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More CTA */}
          <div className="mt-auto pt-4 text-accent-neon-magenta group-hover:text-accent-neon-cyan transition-all duration-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <span>Czytaj dalej</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
