import Link from 'next/link';
import { Mail, MessageCircle, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-bg-secondary border-t border-accent-neon-pink/15 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-display font-bold text-accent-neon-pink mb-4">
              GTA6<span className="text-accent-neon-cyan">NEWS</span>
            </div>
            <p className="text-text-secondary text-sm">
              Najnowsze wiadomości, artykuły i analiza o Grand Theft Auto VI.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-bold mb-4 text-text-primary">Nawigacja</h4>
            <ul className="space-y-2 text-sm text-text-secondary hover:text-accent-neon-pink transition-colors">
              <li>
                <Link href="/">Strona główna</Link>
              </li>
              <li>
                <Link href="/artykuly">Wszystkie artykuły</Link>
              </li>
              <li>
                <Link href="/kategorie/news">Newsy</Link>
              </li>
              <li>
                <Link href="/admin">Panel admina</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-bold mb-4 text-text-primary">Kategorie</h4>
            <ul className="space-y-2 text-sm text-text-secondary hover:text-accent-neon-pink transition-colors">
              <li>
                <Link href="/kategorie/gameplay">Gameplay</Link>
              </li>
              <li>
                <Link href="/kategorie/story">Historia</Link>
              </li>
              <li>
                <Link href="/kategorie/leaks">Leaki</Link>
              </li>
              <li>
                <Link href="/kategorie/analysis">Analiza</Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-display font-bold mb-4 text-text-primary">Informacje</h4>
            <ul className="space-y-2 text-sm text-text-secondary hover:text-accent-neon-pink transition-colors">
              <li>
                <Link href="/o-nas">O nas</Link>
              </li>
              <li>
                <Link href="/o-nas#atrybuacja-zdjęć">Atrybuacja zdjęć</Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-bold mb-4 text-text-primary">Śledź nas</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-text-secondary hover:text-accent-neon-pink transition-colors"
                aria-label="X (Twitter)"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-accent-neon-pink transition-colors"
                aria-label="GitHub"
              >
                <Code2 size={20} />
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-accent-neon-pink transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-accent-neon-pink/15 pt-8">
          <p className="text-center text-sm text-text-muted">
            © 2025-2026 GTA6News. Wszystkie prawa zastrzeżone. Grand Theft Auto jest znakiem towarowym Rockstar Games.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
