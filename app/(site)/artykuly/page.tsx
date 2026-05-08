import type { Metadata } from 'next';
import ArticleGrid from '@/components/ArticleGrid';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Wszystkie artykuły - GTA6News',
  description: 'Przeczytaj wszystkie artykuły o Grand Theft Auto VI na portalu GTA6News.',
};

async function getArticles(limit: number = 30) {
  try {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);

    return data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function ArtykulyPage() {
  const articles = await getArticles(30);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="w-full py-16 bg-gradient-to-b from-bg-secondary to-bg-primary border-b border-accent-neon-pink/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-accent-neon-pink">WSZYSTKIE</span> ARTYKUŁY
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Odkryj wszystkie artykuły, newsy i analizy o Grand Theft Auto VI. Czytaj najnowsze informacje ze świata GTA.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <ArticleGrid articles={articles} />
      ) : (
        <div className="w-full py-20 text-center">
          <p className="text-text-secondary text-lg">Brak artykułów. Wróć później!</p>
        </div>
      )}
    </div>
  );
}
