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
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/GTA-6-Hero.webp)',
        }}
      />

      {/* Enhanced animated background with sophisticated gradients */}
      <div className="absolute inset-0 -z-10">
        {/* Base dark background with opacity for image visibility */}
        <div className="absolute inset-0 bg-bg-primary/85" />

        {/* Animated gradient orbs with better positioning */}
        <div className="absolute inset-0 opacity-20">
          {/* Top left - Magenta */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent-neon-magenta rounded-full mix-blend-screen filter blur-[120px] animate-pulse-slow" />

          {/* Top right - Cyan */}
          <div className="absolute -top-20 -right-60 w-[500px] h-[500px] bg-accent-neon-cyan rounded-full mix-blend-screen filter blur-[140px] animate-pulse-slow" style={{animationDelay: '0.5s'}} />

          {/* Bottom center - Orange */}
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-neon-orange rounded-full mix-blend-screen filter blur-[120px] animate-pulse-slow" style={{animationDelay: '1s'}} />

          {/* Middle right - Lime accent */}
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-accent-neon-lime rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse-slow" style={{animationDelay: '1.5s'}} />
        </div>

        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-miami opacity-3" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 0, 110, 0.05) 25%, rgba(255, 0, 110, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 110, 0.05) 75%, rgba(255, 0, 110, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 110, 0.05) 25%, rgba(255, 0, 110, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 110, 0.05) 75%, rgba(255, 0, 110, 0.05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 md:py-12 lg:py-16">
        {/* Badge - Enhanced */}
        <div
          className={`inline-block mb-12 transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <span className="px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-neon-magenta/15 to-accent-neon-cyan/15 border border-accent-neon-magenta/40 text-accent-neon-magenta text-xs font-semibold mono uppercase tracking-widest shadow-lg shadow-accent-neon-magenta/20">
            🎮 Wkrótce dostępna • PS5 & Xbox Series X|S
          </span>
        </div>

        {/* Main Title - Spectacular */}
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black mb-10 leading-tight transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <span className="block">
            <span className="text-accent-neon-magenta animate-glitch uppercase-tracking drop-shadow-lg" style={{textShadow: '0 0 30px rgba(255, 0, 110, 0.3)'}}>
              GTA
            </span>
          </span>
          <span className="block mt-2 bg-gradient-miami bg-clip-text text-transparent uppercase-tracking drop-shadow-lg">
            6 NEWS
          </span>
        </h1>

        {/* Subtitle - Premium typography */}
        <p
          className={`text-base sm:text-lg md:text-xl text-text-primary mb-6 max-w-3xl mx-auto leading-relaxed font-medium transition-all duration-1000 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          Twoje źródło <span className="text-accent-neon-cyan font-bold">informacji</span> o<br className="hidden sm:block" /> <span className="text-accent-neon-magenta font-bold">Grand Theft Auto VI</span>
        </p>

        <p
          className={`text-xs md:text-sm text-text-secondary mb-12 transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          Najnowsze artykuły • Wciągające newsy • Gruntowna analiza
        </p>

        {/* CTA Buttons - Premium styling */}
        <div
          className={`flex gap-4 justify-center flex-wrap transition-all duration-1000 delay-400 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <Link
            href="/artykuly"
            className="group btn-base btn-primary uppercase-tight text-base px-8 py-3.5 shadow-lg shadow-accent-neon-magenta/40 hover:shadow-neon-magenta relative overflow-hidden"
          >
            <span className="relative z-10 font-bold">Czytaj Artykuły</span>
            <div className="absolute inset-0 bg-gradient-magenta-cyan opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          </Link>

          <Link
            href="#"
            className="group btn-base btn-secondary uppercase-tight text-base px-8 py-3.5 shadow-lg shadow-accent-neon-magenta/20 hover:shadow-neon-magenta border-2"
          >
            <span className="font-bold">Śledź Premierę</span>
          </Link>
        </div>

        {/* Live stats section - Premium cards */}
        <div
          className={`mt-24 grid grid-cols-3 gap-6 md:gap-10 transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {[
            { value: '1000+', label: 'Artykułów', color: 'magenta' },
            { value: '50K+', label: 'Czytelników', color: 'cyan' },
            { value: '24/7', label: 'Wiadomości', color: 'orange' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`group p-6 md:p-8 rounded-2xl gradient-border transition-all duration-300 hover:scale-105 cursor-default`}
              style={{
                background: stat.color === 'magenta'
                  ? 'linear-gradient(135deg, rgba(255, 0, 110, 0.08), rgba(255, 0, 110, 0.02))'
                  : stat.color === 'cyan'
                  ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.08), rgba(0, 245, 255, 0.02))'
                  : 'linear-gradient(135deg, rgba(255, 107, 53, 0.08), rgba(255, 107, 53, 0.02))',
                boxShadow: stat.color === 'magenta'
                  ? '0 0 30px rgba(255, 0, 110, 0.2)'
                  : stat.color === 'cyan'
                  ? '0 0 30px rgba(0, 245, 255, 0.2)'
                  : '0 0 30px rgba(255, 107, 53, 0.2)',
              }}
            >
              <div
                className={`text-4xl md:text-5xl font-display font-black mb-3 ${
                  stat.color === 'magenta' ? 'text-accent-neon-magenta' :
                  stat.color === 'cyan' ? 'text-accent-neon-cyan' :
                  'text-accent-neon-orange'
                }`}
              >
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-text-muted uppercase tracking-widest font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator - Minimal and elegant */}
        <div
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs text-text-muted uppercase tracking-widest font-semibold">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-accent-neon-magenta/50 rounded-full flex justify-center hover:border-accent-neon-magenta transition-colors hover:shadow-glow-magenta">
              <ArrowDown size={18} className="text-accent-neon-magenta animate-bounce mt-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
