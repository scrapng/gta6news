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
    <form onSubmit={handleSubmit} className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-display font-bold text-accent-neon-pink">
        {parentCommentId ? 'Dodaj odpowiedź' : 'Dodaj komentarz'}
      </h3>

      {/* Name */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">Imię *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Twoje imię"
          required
          maxLength={100}
          className="w-full px-4 py-2 bg-bg-secondary border border-accent-neon-pink/30 rounded-lg text-text-primary placeholder-text-muted focus:border-accent-neon-pink focus:outline-none transition-colors"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="twój@email.com"
          required
          className="w-full px-4 py-2 bg-bg-secondary border border-accent-neon-pink/30 rounded-lg text-text-primary placeholder-text-muted focus:border-accent-neon-pink focus:outline-none transition-colors"
        />
        <p className="text-xs text-text-muted mt-1">Email nie będzie publicznie widoczny</p>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm text-text-secondary mb-2">Komentarz * ({content.length}/5000)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Podziel się swoją opinią..."
          required
          maxLength={5000}
          rows={4}
          className="w-full px-4 py-2 bg-bg-secondary border border-accent-neon-pink/30 rounded-lg text-text-primary placeholder-text-muted focus:border-accent-neon-pink focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-500/30' : 'bg-red-900/20 text-red-400 border border-red-500/30'
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
          className="flex items-center gap-2 flex-1 px-4 py-2 bg-accent-neon-pink hover:bg-accent-neon-cyan text-bg-primary font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          {isSubmitting ? 'Wysyłanie...' : 'Wyślij'}
        </button>
        {parentCommentId && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-bg-secondary hover:bg-bg-primary border border-accent-neon-pink/30 text-text-primary font-bold rounded-lg transition-colors"
          >
            Anuluj
          </button>
        )}
      </div>
    </form>
  );
}
