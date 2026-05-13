'use client';

import { useState, useEffect } from 'react';
import { estimateTimeUntil } from '@/lib/utils';
import { subscribeToNewsletterAction } from '@/app/(site)/actions';
import { AlertCircle, CheckCircle } from 'lucide-react';

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
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'Wpisz swój email' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await subscribeToNewsletterAction(email);

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Dziękujemy za subskrypcję!' });
        setEmail('');
        setTimeout(() => setShowForm(false), 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Coś poszło nie tak. Spróbuj ponownie.' });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage({ type: 'error', text: 'Błąd połączenia. Spróbuj ponownie.' });
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="w-full max-w-2xl mx-auto p-8 md:p-10 rounded-2xl border border-[#FF9FBE]/20 bg-[#FF9FBE]/5 backdrop-blur-sm overflow-hidden transition-all duration-300">
          {!showForm ? (
            <div>
              <h3 className="text-xl md:text-2xl font-display font-bold mb-4 text-white">
                Nie chcesz <span style={{ color: '#7FD8E8' }}>nic</span> przegapić?
              </h3>
              <p className="text-white/50 mb-8 text-sm md:text-base leading-relaxed">
                Subskrybuj nasze artykuły i bądź na bieżąco z najnowszymi wiadomościami o GTA VI!
              </p>
              <button
                onClick={() => {
                  setShowForm(true);
                  setMessage(null);
                }}
                className="w-full sm:w-auto px-8 py-3.5 font-display font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 active:scale-95"
                style={{
                  backgroundColor: '#FF9FBE',
                  color: '#0A0E27',
                }}
              >
                Subskrybuj Teraz
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4 animate-fadeIn">
              <h3 className="text-xl md:text-2xl font-display font-bold text-white">
                Zapisz się na newsletter
              </h3>
              <div className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Twój email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all disabled:opacity-50 backdrop-blur-sm"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3 font-display font-bold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 disabled:opacity-50 active:scale-95"
                  style={{
                    backgroundColor: '#C8E8AA',
                    color: '#0A0E27',
                  }}
                >
                  {isLoading ? 'Wysyłanie...' : 'Subskrybuj'}
                </button>
              </div>

              {message && (
                <div
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    message.type === 'success'
                      ? 'bg-[#C8E8AA]/20 text-[#C8E8AA] border border-[#C8E8AA]/40'
                      : 'bg-[#FF9FBE]/20 text-[#FF9FBE] border border-[#FF9FBE]/40'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}
                  {message.text}
                </div>
              )}
            </form>
          )}
        </div>

      </div>
    </section>
  );
};

export default Countdown;
