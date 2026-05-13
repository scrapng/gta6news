import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import Countdown from '@/components/Countdown';
import NewsletterCTA from '@/components/NewsletterCTA';
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
      <NewsletterCTA />

      {/* Featured Article - Premium Section */}
      {featuredArticle?.cover_image && (
        <section className="w-full py-16 md:py-24 relative border-b border-accent-neon-magenta/20">
          {/* Background accents */}
          <div className="absolute inset-0 -z-10 bg-gradient-dark" />
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-neon-magenta/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-neon-cyan/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section label */}
            <div className="inline-block mb-8 px-4 py-2 rounded-full bg-accent-neon-magenta/10 border border-accent-neon-magenta/30">
              <span className="text-xs font-semibold text-accent-neon-magenta uppercase tracking-widest">
                ⭐ Artykuł wyróżniony
              </span>
            </div>

            <Link href={`/artykuly/${featuredArticle.slug}`}>
              <div className="group cursor-pointer">
                {/* Featured image with enhanced effects */}
                <div className="relative w-full h-72 md:h-[500px] overflow-hidden rounded-2xl mb-6 shadow-2xl shadow-accent-neon-magenta/30">
                  <Image
                    src={featuredArticle.cover_image}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    priority
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-accent-neon-magenta/0 group-hover:bg-accent-neon-magenta/20 transition-all duration-300" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                    <h3 className="text-3xl md:text-5xl font-display font-black text-text-primary group-hover:text-accent-neon-cyan transition-colors duration-300 line-clamp-3 leading-tight drop-shadow-lg">
                      {featuredArticle.title}
                    </h3>
                  </div>
                </div>

                {/* Image credit */}
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
    </>
  );
}
