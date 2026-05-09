'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Strona Główna' },
    { href: '/artykuly', label: 'Artykuły' },
    { href: '/kategorie/gameplay', label: 'Gameplay' },
    { href: '/kategorie/story', label: 'Historia' },
    { href: '/kategorie/leaks', label: 'Leaki' },
    { href: '/kategorie/analysis', label: 'Analiza' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-effect-stronger border-b border-accent-neon-magenta/30 shadow-lg'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className="text-2xl md:text-3xl font-display font-black uppercase tracking-widest">
              <span className="text-gradient-magenta">GTA</span>
              <span className="text-accent-neon-cyan">6</span>
            </div>
            <span className="text-xs font-mono text-accent-neon-orange font-bold uppercase tracking-wider group-hover:text-accent-neon-magenta transition-colors">
              NEWS
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 lg:gap-12 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold uppercase tracking-wide transition-all duration-300 group ${
                  isActive(link.href)
                    ? 'text-accent-neon-magenta'
                    : 'text-text-secondary hover:text-accent-neon-magenta'
                }`}
              >
                {link.label}
                {/* Active indicator line */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-magenta-cyan transition-all duration-300 ${
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Link
              href="/artykuly"
              className="btn-primary text-xs md:text-sm py-2 px-4 md:px-6"
            >
              Czytaj
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-accent-neon-magenta hover:text-accent-neon-cyan hover:bg-accent-neon-magenta/10 transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-6 border-t border-accent-neon-magenta/20 animate-slide-in-down">
            <div className="flex flex-col gap-1 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
                    isActive(link.href)
                      ? 'bg-accent-neon-magenta/20 text-accent-neon-magenta border border-accent-neon-magenta/30'
                      : 'text-text-secondary hover:text-accent-neon-magenta hover:bg-accent-neon-magenta/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link
              href="/artykuly"
              className="block w-full mt-4 btn-primary text-center text-sm py-3"
              onClick={() => setIsOpen(false)}
            >
              Czytaj Artykuły
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
