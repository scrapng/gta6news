'use client';

import { useState } from 'react';
import { subscribeToNewsletterAction } from '@/app/(site)/actions';
import { Mail, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function NewsletterCTA() {
  const [isOpen, setIsOpen] = useState(false);
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
        setTimeout(() => setIsOpen(false), 2000);
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
    <section className="w-full py-12 md:py-16 border-b border-accent-neon-magenta/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`overflow-hidden transition-all duration-500 ease-out ${
            isOpen ? 'max-h-96' : 'max-h-32'
          }`}
        >
          {/* Closed state */}
          <div className="flex flex-col items-center justify-center gap-4 text-center pb-4">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-text-primary">
              NIE CHCESZ <span className="text-accent-neon-cyan">NIC</span> PRZEGAPIĆ?
            </h3>
            <p className="text-text-secondary text-sm md:text-base max-w-xl">
              Subskrybuj nasze artykuły i bądź na bieżąco z najnowszymi wiadomościami o GTA VI!
            </p>
            <button
              onClick={() => {
                setIsOpen(true);
                setMessage(null);
              }}
              className="px-8 py-3 bg-accent-neon-magenta hover:bg-accent-neon-cyan text-bg-primary font-display font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent-neon-magenta/30 active:scale-95 text-base"
            >
              SUBSKRYBUJ TERAZ
            </button>
          </div>

          {/* Open state with form */}
          {isOpen && (
            <div className="pt-4 border-t border-accent-neon-magenta/20 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-display font-bold text-text-primary">Zapisz się na newsletter</h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-accent-neon-magenta/20 rounded transition-colors"
                >
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2 flex-col sm:flex-row">
                  <input
                    type="email"
                    placeholder="Twój email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-bg-card border border-accent-neon-magenta/30 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-neon-magenta focus:shadow-lg focus:shadow-accent-neon-magenta/20 transition-all disabled:opacity-50"
                    autoFocus
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-accent-neon-lime hover:bg-accent-neon-lime/80 text-bg-primary font-display font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
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
          )}
        </div>
      </div>
    </section>
  );
}
