'use client';

import { useState, useEffect } from 'react';
import { estimateTimeUntil } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateCountdown = () => {
      const releaseDate = new Date('2026-11-19T00:00:00Z');
      const time = estimateTimeUntil(releaseDate);

      setTimeLeft({
        days: time.days,
        hours: time.hours,
        minutes: time.minutes,
        seconds: time.seconds,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg border-2 border-accent-neon-pink/60 bg-bg-card/50 backdrop-blur-sm flex items-center justify-center hover:border-accent-neon-cyan hover:shadow-glow-pink transition-all duration-300">
        <span className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-accent-neon-pink animate-pulse-slow">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs sm:text-sm font-mono text-text-secondary uppercase tracking-widest">
        {label}
      </span>
    </div>
  );

  return (
    <section className="w-full py-12 md:py-20 bg-gradient-to-b from-bg-secondary/50 to-bg-primary border-t border-b border-accent-neon-pink/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-accent-neon-pink">DO PREMIERY</span>
            <span className="text-text-secondary"> GTA VI</span>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base">
            19 listopada 2026 • PS5 & Xbox Series X|S
          </p>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center">
          <CountdownBox value={timeLeft.days} label="Dni" />
          <CountdownBox value={timeLeft.hours} label="Godziny" />
          <CountdownBox value={timeLeft.minutes} label="Minuty" />
          <CountdownBox value={timeLeft.seconds} label="Sekundy" />
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-text-secondary text-sm mb-4">
            Chcesz być gotowy na premierę? Subskrybuj nasze artykuły!
          </p>
          <button className="px-8 py-3 bg-accent-neon-pink hover:bg-accent-neon-cyan text-bg-primary font-display font-bold rounded-lg transition-all duration-300 hover:shadow-glow-pink">
            Subskrybuj Newsy
          </button>
        </div>
      </div>
    </section>
  );
};

export default Countdown;
