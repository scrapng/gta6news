'use client';

import { useState } from 'react';
import { subscribeToNewsletterAction } from '@/app/(site)/actions';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-r from-accent-neon-magenta/10 to-accent-neon-cyan/10 border-y border-accent-neon-magenta/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Mail size={24} className="text-accent-neon-magenta" />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
            Nie przegap żadnych newsów
          </h2>
        </div>
        <p className="text-text-secondary mb-8">
          Zapisz się na nasz newsletter i otrzymuj codziennie najnowsze artykuły o GTA VI prosto do skrzynki odbiorczej.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3 flex-col sm:flex-row items-stretch sm:items-center">
            <input
              type="email"
              placeholder="Twój email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 sm:py-3 bg-bg-card border border-accent-neon-magenta/30 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-neon-magenta focus:shadow-lg focus:shadow-accent-neon-magenta/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 sm:py-3 bg-accent-neon-magenta hover:bg-accent-neon-cyan active:scale-95 text-bg-primary font-display font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent-neon-magenta/30 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-base sm:text-sm font-semibold"
            >
              {isLoading ? 'Wysyłanie...' : 'Subskrybuj'}
            </button>
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                message.type === 'success'
                  ? 'bg-accent-neon-lime/20 text-accent-neon-lime border border-accent-neon-lime/40'
                  : 'bg-accent-neon-magenta/20 text-accent-neon-magenta border border-accent-neon-magenta/40'
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
      </div>
    </section>
  );
}
