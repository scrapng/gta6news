import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import Countdown from '@/components/Countdown';
import ArticleGrid from '@/components/ArticleGrid';
import ImageCredit from '@/components/ImageCredit';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

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
  const articles = await getArticles(10);
  const featuredArticle = articles[0];
  const gridArticles = articles.slice(featuredArticle?.cover_image ? 1 : 0, 9);

  return (
    <>
      <HeroSection />
      <Countdown />

      {/* Featured Article */}
      {featuredArticle?.cover_image && (
        <section className="w-full py-8 md:py-12 border-b border-accent-neon-pink/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-display font-bold mb-6 text-accent-neon-pink">WYRÓŻNIONY ARTYKUŁ</h2>
            <Link href={`/artykuly/${featuredArticle.slug}`}>
              <div className="group cursor-pointer">
                <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg mb-4">
                  <Image
                    src={featuredArticle.cover_image}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary/80" />
                  <h3 className="absolute bottom-4 left-4 right-4 text-2xl md:text-4xl font-display font-bold text-text-primary group-hover:text-accent-neon-pink transition-colors duration-300 line-clamp-3">
                    {featuredArticle.title}
                  </h3>
                </div>
                <ImageCredit
                  photographerName={featuredArticle.image_photographer_name}
                  photographerUrl={featuredArticle.image_photographer_url}
                  imageSourceUrl={featuredArticle.image_source_url}
                  imageSource={featuredArticle.image_source}
                  variant="article"
                />
              </div>
            </Link>
          </div>
        </section>
      )}

      <ArticleGrid
        articles={gridArticles}
        title="Najnowsze Artykuły"
        showViewMore={articles.length > 9}
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
