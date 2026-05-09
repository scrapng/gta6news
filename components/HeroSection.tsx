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
      {/* GTA6 Hero Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/GTA-6-Hero.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Subtle neon color tints */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#FF006E] opacity-10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#00F5FF] opacity-10 blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center gap-6">

        {/* Badge */}
        <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <span className="inline-block px-4 py-2 rounded-full border border-[#FF006E]/50 bg-[#FF006E]/10 text-[#FF006E] text-xs font-semibold uppercase tracking-widest">
            🎮 Wkrótce dostępna • PS5 & Xbox Series X|S
          </span>
        </div>

        {/* Main Title */}
        <div className={`transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-black font-display leading-none">
            <span className="block text-7xl sm:text-8xl md:text-9xl text-[#FF006E]" style={{ textShadow: '0 0 40px rgba(255,0,110,0.5)' }}>
              GTA
            </span>
            <span className="block text-6xl sm:text-7xl md:text-8xl text-white" style={{ textShadow: '0 0 40px rgba(0,245,255,0.3)' }}>
              6 NEWS
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed font-medium">
            Twoje źródło <span className="text-[#00F5FF] font-bold">informacji</span> o{' '}
            <span className="text-[#FF006E] font-bold">Grand Theft Auto VI</span>
          </p>
          <p className="mt-3 text-sm text-white/50 tracking-wider">
            Najnowsze artykuły • Wciągające newsy • Gruntowna analiza
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={`flex gap-4 justify-center flex-wrap transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/artykuly"
            className="px-8 py-3.5 bg-[#FF006E] hover:bg-[#FF006E]/80 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,110,0.6)] uppercase tracking-wide text-sm"
          >
            Czytaj Artykuły
          </Link>
          <Link
            href="#"
            className="px-8 py-3.5 bg-transparent border-2 border-white/40 hover:border-[#00F5FF] text-white hover:text-[#00F5FF] font-bold rounded-lg transition-all duration-300 uppercase tracking-wide text-sm"
          >
            Śledź Premierę
          </Link>
        </div>

        {/* Stats */}
        <div className={`mt-6 grid grid-cols-3 gap-4 md:gap-8 w-full max-w-lg transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { value: '1000+', label: 'Artykułów', color: '#FF006E' },
            { value: '50K+', label: 'Czytelników', color: '#00F5FF' },
            { value: '24/7', label: 'Wiadomości', color: '#FF6B35' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black font-display" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}60` }}>
                {stat.value}
              </div>
              <div className="text-xs text-white/50 uppercase tracking-widest mt-1 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/40 uppercase tracking-widest">Scroll</span>
          <ArrowDown size={16} className="text-[#FF006E] animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
