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

  const boxes = [
    { value: timeLeft.days, label: 'Dni', color: '#FF9FBE' },
    { value: timeLeft.hours, label: 'Godziny', color: '#7FD8E8' },
    { value: timeLeft.minutes, label: 'Minuty', color: '#FFB77D' },
    { value: timeLeft.seconds, label: 'Sekundy', color: '#C8E8AA' },
  ];

  return (
    <section className="relative w-full py-24 md:py-32 border-y border-[#FF9FBE]/20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E27] to-[#1A1F3A]" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#FF9FBE]/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-[#7FD8E8]/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

        {/* Badge */}
        <div className="mb-8 px-4 py-2 rounded-full bg-[#FF9FBE]/10 border border-[#FF9FBE]/30">
          <span className="text-xs font-mono text-[#FF9FBE] font-bold uppercase tracking-widest">
            ▶ Premiera GTA VI
          </span>
        </div>

        {/* Title */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-wider mb-6 text-white" style={{ textShadow: '0 0 40px rgba(255,159,190,0.3)' }}>
          Wkrótce na konsolach
        </h2>

        {/* Date */}
        <p className="text-lg text-white/60 mb-16 md:mb-20">
          <span className="text-[#7FD8E8] font-semibold">19 listopada 2026</span>
          <span className="mx-3 text-white/30">•</span>
          <span>PS5 & Xbox Series X|S</span>
        </p>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full mb-20 md:mb-24">
          {boxes.map(({ value, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-4">
              <div
                className="w-full aspect-square max-w-[160px] rounded-2xl border-2 flex items-center justify-center backdrop-blur-sm transition-all duration-300"
                style={{
                  borderColor: `${color}50`,
                  backgroundColor: `${color}0D`,
                  boxShadow: `0 0 20px ${color}15`,
                }}
              >
                <span
                  className="text-5xl sm:text-6xl md:text-7xl font-display font-black"
                  style={{ color }}
                >
                  {String(value).padStart(2, '0')}
                </span>
              </div>
              <span
                className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest"
                style={{ color }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="w-full max-w-2xl mx-auto p-8 md:p-10 rounded-2xl border border-[#FF9FBE]/20 bg-[#FF9FBE]/5 backdrop-blur-sm">
          <h3 className="text-xl md:text-2xl font-display font-bold mb-4 text-white">
            Nie chcesz <span style={{ color: '#7FD8E8' }}>nic</span> przegapić?
          </h3>
          <p className="text-white/50 mb-8 text-sm md:text-base leading-relaxed">
            Subskrybuj nasze artykuły i bądź na bieżąco z najnowszymi wiadomościami o GTA VI!
          </p>
          <button
            className="px-8 py-3.5 font-display font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300"
            style={{
              backgroundColor: '#FF9FBE',
              color: '#0A0E27',
            }}
          >
            Subskrybuj Teraz
          </button>
        </div>

      </div>
    </section>
  );
};

export default Countdown;
