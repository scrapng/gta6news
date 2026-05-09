'use client';

import { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced animated background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-dark">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-40 w-80 h-80 bg-accent-neon-magenta rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-accent-neon-cyan rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent-neon-orange rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow delay-1000" />
        </div>

        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-miami opacity-5" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Badge */}
        <div
          className={`inline-block mb-8 transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <span className="px-4 py-2 rounded-full bg-accent-neon-magenta/10 border border-accent-neon-magenta/30 text-accent-neon-magenta text-sm font-mono uppercase tracking-widest">
            ▶ Gra już dostępna
          </span>
        </div>

        {/* Main Title with Enhanced Glitch Effect */}
        <h1
          className={`text-5xl sm:text-6xl md:text-8xl xl:text-9xl font-display font-black mb-6 leading-tight transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <span className="inline-block">
            <span className="text-accent-neon-magenta animate-glitch uppercase-tracking">GTA</span>
          </span>
          <br />
          <span className="inline-block text-transparent bg-clip-text bg-gradient-miami uppercase-tracking">
            6 NEWS
          </span>
        </h1>

        {/* Subtitle with improved styling */}
        <p
          className={`text-lg sm:text-xl md:text-2xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          Twoje źródło <span className="text-accent-neon-cyan">informacji</span> o Grand Theft Auto VI
        </p>

        <p
          className={`text-sm md:text-base text-text-muted mb-12 transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          Najnowsze artykuły, newsy, analiza i ciekawostki
        </p>

        {/* CTA Buttons with enhanced styling */}
        <div
          className={`flex gap-4 justify-center flex-wrap transition-all duration-1000 delay-400 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <Link
            href="/artykuly"
            className="group btn-base btn-primary uppercase-tight relative overflow-hidden"
          >
            <span className="relative z-10">Czytaj Artykuły</span>
            <div className="absolute inset-0 bg-gradient-magenta-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="#"
            className="group btn-base btn-secondary uppercase-tight hover:border-accent-neon-cyan"
          >
            <span>Śledź Premierę</span>
          </Link>
        </div>

        {/* Live stats section */}
        <div
          className={`mt-20 grid grid-cols-3 gap-4 md:gap-8 transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="group p-4 md:p-6 rounded-lg neon-border hover:neon-border card-hover">
            <div className="text-3xl md:text-4xl font-display font-black text-accent-neon-magenta mb-2">
              1000+
            </div>
            <div className="text-xs md:text-sm text-text-muted uppercase tracking-wider">
              Artykułów
            </div>
          </div>

          <div className="group p-4 md:p-6 rounded-lg neon-border hover:neon-border card-hover">
            <div className="text-3xl md:text-4xl font-display font-black text-accent-neon-cyan mb-2">
              50K+
            </div>
            <div className="text-xs md:text-sm text-text-muted uppercase tracking-wider">
              Czytelników
            </div>
          </div>

          <div className="group p-4 md:p-6 rounded-lg neon-border hover:neon-border card-hover">
            <div className="text-3xl md:text-4xl font-display font-black text-accent-neon-orange mb-2">
              24/7
            </div>
            <div className="text-xs md:text-sm text-text-muted uppercase tracking-wider">
              Wiadomości
            </div>
          </div>
        </div>

        {/* Scroll indicator - enhanced */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-text-muted uppercase tracking-wider">Scroll</span>
            <div className="w-6 h-10 border-2 border-accent-neon-magenta/40 rounded-full flex justify-center hover:border-accent-neon-magenta transition-colors">
              <ArrowDown size={20} className="text-accent-neon-magenta animate-bounce mt-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
