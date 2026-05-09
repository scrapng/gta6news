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

      {/* Featured Article */}
      {articles && articles.length > 0 && articles[0].cover_image && (
        <section className="w-full py-8 md:py-12 border-b border-accent-neon-pink/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-display font-bold mb-6 text-accent-neon-pink">POLECANY ARTYKUŁ</h2>
            <Link href={`/artykuly/${articles[0].slug}`}>
              <div className="group cursor-pointer">
                <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg mb-4">
                  <Image
                    src={articles[0].cover_image}
                    alt={articles[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary/80" />
                  <h3 className="absolute bottom-4 left-4 right-4 text-2xl md:text-3xl font-display font-bold text-text-primary group-hover:text-accent-neon-pink transition-colors duration-300 line-clamp-2">
                    {articles[0].title}
                  </h3>
                </div>
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
