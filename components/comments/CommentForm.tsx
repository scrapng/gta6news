'use client';

import { useState } from 'react';
import { submitCommentAction } from '@/app/(site)/artykuly/actions';
import { Send } from 'lucide-react';

interface CommentFormProps {
  articleId: string;
  parentCommentId?: string;
  onCommentAdded: () => void;
  onCancel?: () => void;
}

export default function CommentForm({ articleId, parentCommentId, onCommentAdded, onCancel }: CommentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Submit comment (IP and user agent are captured server-side from headers)
      const response = await submitCommentAction({
        article_id: articleId,
        parent_comment_id: parentCommentId,
        author_name: name,
        author_email: email,
        content,
      });

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Komentarz dodany!',
        });
        setName('');
        setEmail('');
        setContent('');
        setTimeout(() => {
          onCommentAdded();
          setMessage(null);
        }, 1500);
      } else {
        setMessage({
          type: 'error',
          text: response.error || 'Błąd podczas dodawania komentarza',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Błąd serwera. Spróbuj ponownie.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-bg-card/50 to-bg-card/30 border border-accent-neon-magenta/30 rounded-2xl p-8 space-y-6 shadow-lg shadow-accent-neon-magenta/10 backdrop-blur-sm">
      <h3 className="text-xl font-display font-bold bg-gradient-to-r from-accent-neon-magenta to-accent-neon-cyan bg-clip-text text-transparent">
        {parentCommentId ? '↳ Dodaj odpowiedź' : '💬 Dodaj komentarz'}
      </h3>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-text-secondary mb-3">Imię *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Twoje imię"
          required
          maxLength={100}
          className="w-full px-4 py-3 bg-bg-secondary/50 border border-accent-neon-magenta/20 hover:border-accent-neon-magenta/40 rounded-lg text-text-primary placeholder-text-muted focus:border-accent-neon-magenta focus:outline-none focus:shadow-glow-magenta transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-text-secondary mb-3">Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="twój@email.com"
          required
          className="w-full px-4 py-3 bg-bg-secondary/50 border border-accent-neon-magenta/20 hover:border-accent-neon-magenta/40 rounded-lg text-text-primary placeholder-text-muted focus:border-accent-neon-magenta focus:outline-none focus:shadow-glow-magenta transition-all"
        />
        <p className="text-xs text-text-muted mt-2">Email nie będzie publicznie widoczny</p>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold text-text-secondary mb-3">
          Komentarz <span className="text-accent-neon-cyan">*</span> ({content.length}/5000)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Podziel się swoją opinią..."
          required
          maxLength={5000}
          rows={4}
          className="w-full px-4 py-3 bg-bg-secondary/50 border border-accent-neon-magenta/20 hover:border-accent-neon-magenta/40 rounded-lg text-text-primary placeholder-text-muted focus:border-accent-neon-magenta focus:outline-none focus:shadow-glow-magenta transition-all resize-none"
        />
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-green-900/30 text-green-300 border border-green-500/40' : 'bg-red-900/30 text-red-300 border border-red-500/40'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !name || !email || !content}
          className="group flex items-center gap-2 flex-1 px-6 py-3 bg-gradient-magenta-cyan hover:shadow-glow-magenta text-bg-primary font-display font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} className="group-hover:scale-110 transition-transform" />
          {isSubmitting ? 'Wysyłanie...' : 'Wyślij'}
        </button>
        {parentCommentId && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-bg-secondary/50 hover:bg-bg-secondary border border-accent-neon-magenta/30 hover:border-accent-neon-magenta text-text-primary font-bold rounded-lg transition-all"
          >
            Anuluj
          </button>
        )}
      </div>
    </form>
  );
}
