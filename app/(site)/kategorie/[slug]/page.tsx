import type { Metadata } from 'next';
import ArticleGrid from '@/components/ArticleGrid';
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

      {/* Articles Grid */}
      {articles && articles.length > 0 ? (
        <ArticleGrid articles={articles} />
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
