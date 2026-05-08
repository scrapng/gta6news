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
    <section className="w-full py-12 md:py-20 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-12 text-text-primary">
            <span className="text-accent-neon-pink">{title.split(' ')[0]}</span>
            {title.split(' ').slice(1).join(' ')}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {showViewMore && (
          <div className="text-center">
            <a
              href={viewMoreHref}
              className="inline-block px-8 py-3 border-2 border-accent-neon-pink hover:border-accent-neon-cyan text-accent-neon-pink hover:text-accent-neon-cyan font-display font-bold rounded-lg transition-all duration-300 hover:shadow-glow-pink"
            >
              Przejdź do wszystkich artykułów →
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleGrid;
