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

  const CountdownBox = ({ value, label, color }: { value: number; label: string; color: 'magenta' | 'cyan' | 'orange' | 'lime' }) => {
    const colorMap = {
      magenta: { bg: 'bg-accent-neon-magenta/10', border: 'border-accent-neon-magenta/40', text: 'text-accent-neon-magenta', hover: 'hover:border-accent-neon-magenta/80 hover:shadow-neon-magenta', glow: 'group-hover:neon-glow-magenta' },
      cyan: { bg: 'bg-accent-neon-cyan/10', border: 'border-accent-neon-cyan/40', text: 'text-accent-neon-cyan', hover: 'hover:border-accent-neon-cyan/80 hover:shadow-neon-cyan', glow: 'group-hover:neon-glow-cyan' },
      orange: { bg: 'bg-accent-neon-orange/10', border: 'border-accent-neon-orange/40', text: 'text-accent-neon-orange', hover: 'hover:border-accent-neon-orange/80 hover:shadow-neon-orange', glow: 'group-hover:neon-glow-orange' },
      lime: { bg: 'bg-accent-neon-lime/10', border: 'border-accent-neon-lime/40', text: 'text-accent-neon-lime', hover: 'hover:border-accent-neon-lime/80 hover:shadow-neon-lime', glow: 'group-hover:neon-glow-lime' },
    };

    const colors = colorMap[color];

    return (
      <div className="group flex flex-col items-center gap-3">
        <div className={`relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-xl border-2 ${colors.bg} ${colors.border} ${colors.hover} backdrop-blur-sm flex items-center justify-center transition-all duration-300`}>
          {/* Background gradient pulse */}
          <div className={`absolute inset-0 rounded-lg bg-gradient-to-br from-${color}-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

          {/* Number */}
          <span className={`text-4xl sm:text-5xl md:text-6xl font-display font-black ${colors.text} relative z-10 animate-pulse-slow`}>
            {String(value).padStart(2, '0')}
          </span>

          {/* Glow effect on hover */}
          <div className={`absolute inset-0 rounded-lg opacity-0 ${colors.glow} transition-all duration-300`} />
        </div>
        <span className={`text-xs sm:text-sm font-mono font-bold ${colors.text} uppercase tracking-widest`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-dark border-y border-accent-neon-magenta/20">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent-neon-magenta/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-neon-cyan/5 rounded-full filter blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent-neon-magenta/10 border border-accent-neon-magenta/30">
            <span className="text-xs font-mono text-accent-neon-magenta font-bold uppercase tracking-widest">
              ▶ GTA VI Available Now
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-6 uppercase-tracking">
            <span className="text-transparent bg-clip-text bg-gradient-miami">Dostępna na konsolach</span>
          </h2>

          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            <span className="text-accent-neon-cyan font-semibold">19 listopada 2026</span> • PS5 & Xbox Series X|S
          </p>
        </div>

        {/* Countdown Grid - Responsive 2x2 to 4x1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20 justify-items-center">
          <CountdownBox value={timeLeft.days} label="Dni" color="magenta" />
          <CountdownBox value={timeLeft.hours} label="Godziny" color="cyan" />
          <CountdownBox value={timeLeft.minutes} label="Minuty" color="orange" />
          <CountdownBox value={timeLeft.seconds} label="Sekundy" color="lime" />
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto text-center p-8 md:p-10 rounded-2xl border border-accent-neon-magenta/20 bg-accent-neon-magenta/5 backdrop-blur-sm">
          <h3 className="text-xl md:text-2xl font-display font-bold mb-4 text-text-primary">
            Nie chcesz <span className="text-accent-neon-cyan">nic</span> przegapić?
          </h3>
          <p className="text-text-secondary mb-6 text-sm md:text-base">
            Subskrybuj nasze artykuły i bądź na bieżąco z najnowszymi wiadomościami o GTA VI!
          </p>
          <button className="btn-primary uppercase-tight text-sm md:text-base px-6 md:px-8 py-3 md:py-4">
            Subskrybuj Teraz
          </button>
        </div>
      </div>
    </section>
  );
};

export default Countdown;
