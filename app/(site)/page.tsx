import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import Countdown from '@/components/Countdown';
import ArticleGrid from '@/components/ArticleGrid';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'GTA6News - Twoje źródło informacji o GTA VI',
  description: 'Najnowsze artykuły, newsy, gameplay i plotki o Grand Theft Auto VI. Ponieważ GTA VI zmieni graczy na zawsze.',
};

async function getArticles(limit: number = 9) {
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

export default async function Home() {
  const articles = await getArticles(9);

  return (
    <>
      <HeroSection />
      <Countdown />
      <ArticleGrid
        articles={articles}
        title="Najnowsze Artykuły"
        showViewMore={articles.length >= 9}
        viewMoreHref="/artykuly"
      />

      {/* Newsletter Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-r from-accent-neon-pink/10 to-accent-neon-cyan/10 border-y border-accent-neon-pink/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-text-primary">
            Nie przegap żadnych newsów
          </h2>
          <p className="text-text-secondary mb-8">
            Zapisz się na nasz newsletter i otrzymuj codziennie najnowsze artykuły o GTA VI prosto do skrzynki odbiorczej.
          </p>
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Twój email"
              className="flex-1 px-4 py-3 bg-bg-card border border-accent-neon-pink/30 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-neon-pink focus:shadow-glow-pink transition-all"
            />
            <button className="px-6 py-3 bg-accent-neon-pink hover:bg-accent-neon-cyan text-bg-primary font-display font-bold rounded-lg transition-all duration-300 hover:shadow-glow-pink whitespace-nowrap">
              Subskrybuj
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
