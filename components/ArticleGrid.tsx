import { Article } from '@/types';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  title?: string;
  showViewMore?: boolean;
  viewMoreHref?: string;
}

const ArticleGrid = ({
  articles,
  title,
  showViewMore,
  viewMoreHref = '/artykuly',
}: ArticleGridProps) => {
  return (
    <section className="w-full py-16 md:py-28 relative">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-dark" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-accent-neon-magenta/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title - Enhanced */}
        {title && (
          <div className="mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4 text-text-primary">
              <span className="text-transparent bg-clip-text bg-gradient-magenta-cyan">{title.split(' ')[0]}</span>{' '}
              <span className="text-text-primary uppercase-tracking">{title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-magenta-cyan rounded-full" />
          </div>
        )}

        {/* Article Grid - Responsive and elegant */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {articles.map((article, index) => (
            <div
              key={article.id}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              className="animate-fade-in-up"
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>

        {/* View More Button - Premium */}
        {showViewMore && (
          <div className="text-center">
            <a
              href={viewMoreHref}
              className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-magenta-cyan text-bg-primary font-display font-bold uppercase tracking-wide rounded-lg transition-all duration-300 hover:shadow-neon-magenta hover:scale-105 group"
            >
              <span>Przejdź do wszystkich artykułów</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleGrid;
