'use client';

import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-neon opacity-10 animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-neon-pink/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-accent-neon-cyan/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Title with Glitch Effect */}
        <h1
          className={`text-5xl sm:text-7xl md:text-8xl font-display font-black mb-6 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-accent-neon-pink animate-glitch">GTA</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-neon">6 NEWS</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-xl sm:text-2xl text-text-secondary mb-12 transition-all duration-1000 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Twoje źródło informacji o Grand Theft Auto VI
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex gap-4 justify-center flex-wrap transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <button className="px-8 py-3 bg-accent-neon-pink hover:bg-accent-neon-cyan text-bg-primary font-display font-bold rounded-lg transition-all duration-300 hover:shadow-glow-pink hover:scale-105">
            Czytaj Artykuły
          </button>
          <button className="px-8 py-3 border-2 border-accent-neon-pink hover:border-accent-neon-cyan text-accent-neon-pink hover:text-accent-neon-cyan font-display font-bold rounded-lg transition-all duration-300 hover:shadow-glow-pink">
            Śledź Premierę
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent-neon-pink/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-accent-neon-pink rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
