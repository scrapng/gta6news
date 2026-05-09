import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'O nas - GTA6News',
  description: 'Dowiedz się więcej o portalu GTA6News, naszej misji i polityce dotyczącej zdjęć.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="w-full py-16 bg-gradient-to-b from-bg-secondary to-bg-primary border-b border-accent-neon-pink/15">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-accent-neon-pink">O NAS</h1>
          <p className="text-text-secondary text-lg">Poznaj portal GTA6News i sprawdź naszą politykę dotyczącą atrybuacji zdjęć.</p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-display font-bold mb-6 text-text-primary">
              <span className="text-accent-neon-pink">O</span> PORTALU GTA6NEWS
            </h2>
            <div className="prose prose-invert max-w-none space-y-4 text-text-secondary">
              <p>
                GTA6News to największy polski portal poświęcony Grand Theft Auto VI. Dostarczamy najnowsze wiadomości, artykuły, analizy i ciekawostki dotyczące gry.
              </p>
              <p>
                Naszą misją jest utrzymywanie polskiej społeczności graczy na bieżąco z najświeższymi informacjami o GTA VI oraz tworzenie wartościowej, angażującej treści dla fanów serii.
              </p>
            </div>
          </div>

          {/* Image Attribution Section */}
          <div className="mb-12 bg-bg-card/40 border border-accent-neon-pink/15 rounded-lg p-8">
            <h2 className="text-3xl font-display font-bold mb-6 text-text-primary">
              <span className="text-accent-neon-pink">ATRYBUACJA</span> ZDJĘĆ
            </h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                Portal GTA6News wykorzystuje wysokiej jakości zdjęcia z serwisu{' '}
                <Link
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-neon-pink hover:text-accent-neon-cyan underline inline-flex items-center gap-1"
                >
                  Unsplash <ExternalLink size={14} />
                </Link>
                . Wszystkie zdjęcia używane w artykułach są dostępne na warunkach licencji Unsplash.
              </p>

              <h3 className="text-xl font-display font-bold text-text-primary mt-6 mb-3">Licencja Unsplash</h3>
              <p>
                Zdjęcia z Unsplash są udostępniane na licencji Unsplash License, która pozwala na darmowe używanie zdjęć zarówno w projektach komercyjnych jak i osobistych bez pytania o pozwolenie lub wysyłania podziękowania (chociaż są doceniane!).
              </p>

              <h3 className="text-xl font-display font-bold text-text-primary mt-6 mb-3">Atrybuacja Fotografów</h3>
              <p>
                Szanujemy pracę fotografów. Pod każdym zdjęciem w artykułach znajduje się informacja o fotografie oraz link do jego profilu na Unsplash. Ponadto:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Każde zdjęcie ma przypisanego fotografa w metadanych artykułu</li>
                <li>Informacja o fotografie jest wyświetlana pod obrazem w każdym artykule</li>
                <li>Dane fotografów są przechowywane w naszej bazie danych dla zgodności z wymogami prawymi</li>
                <li>Każde zdjęcie jest linkowane do jego oryginalnego źródła na Unsplash</li>
              </ul>

              <h3 className="text-xl font-display font-bold text-text-primary mt-6 mb-3">Struktura Danych Zdjęć</h3>
              <p>
                Dla każdego zdjęcia przechowujemy:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-semibold">URL zdjęcia</span> - pełny adres obrazu na Unsplash CDN</li>
                <li><span className="font-semibold">Imię i nazwisko fotografa</span> - autor oryginalnego zdjęcia</li>
                <li><span className="font-semibold">Profil fotografa</span> - link do profilu fotografa na Unsplash</li>
                <li><span className="font-semibold">Źródło zdjęcia</span> - link do zdjęcia na Unsplash</li>
                <li><span className="font-semibold">Typ źródła</span> - informacja czy pochodzi z Unsplash czy źródła wewnętrznego</li>
              </ul>

              <h3 className="text-xl font-display font-bold text-text-primary mt-6 mb-3">Szanowanie Praw Autorskich</h3>
              <p>
                Wszystkie zdjęcia używane na portalu GTA6News są wyłącznie ze źródeł umożliwiających ich legalną i etyczną użytkowanie:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>✓ Wszystkie zdjęcia pochodzą z Unsplash (bezpłatnie i legalnie dostępne)</li>
                <li>✓ Każde zdjęcie jest prawidłowo atrybucjonowane fotografowi</li>
                <li>✓ Prawa autorskie fotografów są respektowane</li>
                <li>✓ Dane fotografów są przechowywane w bazie danych dla audytu i zgodności</li>
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-bg-card/40 border border-accent-neon-pink/15 rounded-lg p-8">
            <h2 className="text-3xl font-display font-bold mb-6 text-text-primary">
              <span className="text-accent-neon-pink">KONTAKT</span>
            </h2>
            <p className="text-text-secondary mb-4">
              Jeśli masz pytania dotyczące naszej polityki zdjęć, atrybuacji lub dowolne inne zapytania, skontaktuj się z nami.
            </p>
            <p className="text-text-secondary">
              <span className="text-accent-neon-pink">Email:</span> support@gta6news.pl
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
