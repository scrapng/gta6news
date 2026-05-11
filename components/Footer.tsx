import Link from 'next/link';
import { Mail, MessageCircle, Code2 } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Nawigacja',
      links: [
        { label: 'Strona główna', href: '/' },
        { label: 'Artykuły', href: '/artykuly' },
        { label: 'Kategorie', href: '/artykuly?filter=all' },
        { label: 'O nas', href: '/o-nas' },
      ],
    },
    {
      title: 'Kategorie',
      links: [
        { label: 'Gameplay', href: '/kategorie/gameplay' },
        { label: 'Historia', href: '/kategorie/story' },
        { label: 'Leaki', href: '/kategorie/leaks' },
        { label: 'Analiza', href: '/kategorie/analysis' },
      ],
    },
    {
      title: 'Zasoby',
      links: [
        { label: 'Atrybuacja zdjęć', href: '/o-nas#atrybuacja-zdjęć' },
        { label: 'Panel admina', href: '/admin' },
        { label: 'Kontakt', href: '#' },
      ],
    },
  ];

  return (
    <footer className="w-full bg-bg-secondary border-t border-accent-neon-magenta/20 mt-24 md:mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="text-3xl md:text-4xl font-display font-black uppercase tracking-widest">
                <span className="text-gradient-magenta">GTA</span>
                <span className="text-accent-neon-cyan">6</span>
              </h3>
              <span className="text-sm font-mono text-accent-neon-orange font-bold uppercase tracking-wider">
                NEWS
              </span>
            </div>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6">
              Największy polski portal poświęcony <span className="text-accent-neon-cyan">Grand Theft Auto VI</span>. Najnowsze wiadomości, artykuły, analizy i ciekawostki.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { icon: MessageCircle, label: 'Twitter', href: '#' },
                { icon: Code2, label: 'GitHub', href: '#' },
                { icon: Mail, label: 'Email', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2.5 rounded-lg bg-accent-neon-magenta/10 text-accent-neon-magenta hover:bg-accent-neon-magenta/20 hover:text-accent-neon-cyan transition-all duration-300 group"
                  aria-label={label}
                  title={label}
                >
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-bold text-text-primary mb-6 uppercase tracking-wider text-sm">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-text-secondary text-sm hover:text-accent-neon-magenta transition-colors duration-300 group inline-flex items-center gap-2"
                    >
                      <span className="w-0 h-0.5 bg-gradient-magenta-cyan group-hover:w-2 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-accent-neon-magenta/30 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-text-muted">
          <div>
            <p>
              © 2025-2026 <span className="text-accent-neon-magenta font-semibold">GTA6News</span>. Wszystkie prawa zastrzeżone.
            </p>
            <p className="mt-2 text-xs text-text-muted/70">
              Built by <Link href="https://scrl.online" target="_blank" rel="noopener noreferrer" className="text-accent-neon-cyan hover:text-accent-neon-magenta transition-colors font-semibold">SCRL by TomsoN</Link>
            </p>
          </div>
          <p>
            Grand Theft Auto jest znakiem towarowym <span className="text-accent-neon-cyan font-semibold">Rockstar Games</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
