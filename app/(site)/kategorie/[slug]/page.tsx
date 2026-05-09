import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ArticleGrid from '@/components/ArticleGrid';
import ImageCredit from '@/components/ImageCredit';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const categoryNames: Record<string, string> = {
  news: 'Newsy',
  gameplay: 'Gameplay',
  story: 'Historia',
  leaks: 'Leaki',
  community: 'Społeczność',
  analysis: 'Analiza',
};

async function getArticlesByCategory(category: string) {
  if (!categoryNames[category]) {
    return null;
  }

  try {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(30);

    return data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = categoryNames[slug];

  if (!categoryName) {
    return {
      title: 'Kategoria nie znaleziona - GTA6News',
    };
  }

  return {
    title: `${categoryName} - GTA6News`,
    description: `Przeczytaj wszystkie artykuły z kategorii ${categoryName} na portalu GTA6News.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryName = categoryNames[slug];

  if (!categoryName) {
    notFound();
  }

  const articles = await getArticlesByCategory(slug);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="w-full py-16 bg-gradient-to-b from-bg-secondary to-bg-primary border-b border-accent-neon-pink/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-accent-neon-pink">{categoryName.toUpperCase()}</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Wszystkie artykuły z kategorii {categoryName}. Odkryj najnowsze treści na temat Grand Theft Auto VI.
          </p>
        </div>
      </section>

      {/* Featured Article - Premium Category Section */}
      {articles && articles.length > 0 && articles[0].cover_image && (
        <section className="w-full py-16 md:py-24 relative border-b border-accent-neon-magenta/20">
          {/* Background accents */}
          <div className="absolute inset-0 -z-10 bg-gradient-dark" />
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-neon-cyan/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-neon-orange/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section label */}
            <div className="inline-block mb-8 px-4 py-2 rounded-full bg-accent-neon-cyan/10 border border-accent-neon-cyan/30">
              <span className="text-xs font-semibold text-accent-neon-cyan uppercase tracking-widest">
                ⭐ Polecany artykuł
              </span>
            </div>

            <Link href={`/artykuly/${articles[0].slug}`}>
              <div className="group cursor-pointer">
                {/* Featured image */}
                <div className="relative w-full h-72 md:h-[450px] overflow-hidden rounded-2xl mb-6 shadow-2xl shadow-accent-neon-cyan/20">
                  <Image
                    src={articles[0].cover_image}
                    alt={articles[0].title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    priority
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-accent-neon-cyan/0 group-hover:bg-accent-neon-cyan/20 transition-all duration-300" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                    <h3 className="text-3xl md:text-4xl font-display font-black text-text-primary group-hover:text-accent-neon-magenta transition-colors duration-300 line-clamp-2 leading-tight drop-shadow-lg">
                      {articles[0].title}
                    </h3>
                  </div>
                </div>

                {/* Image credit */}
                <ImageCredit
                  photographerName={articles[0].image_photographer_name}
                  photographerUrl={articles[0].image_photographer_url}
                  imageSourceUrl={articles[0].image_source_url}
                  imageSource={articles[0].image_source}
                  variant="article"
                />
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      {articles && articles.length > 0 ? (
        <ArticleGrid articles={articles.slice(articles[0].cover_image ? 1 : 0)} />
      ) : (
        <div className="w-full py-20 text-center">
          <p className="text-text-secondary text-lg">
            Brak artykułów w kategorii {categoryName}. Wróć później!
          </p>
        </div>
      )}
    </div>
  );
}
