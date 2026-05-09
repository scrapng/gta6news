'use client';

import { useEffect, useState } from 'react';
import { Comment } from '@/types';
import { getCommentsForArticleAction } from '@/app/(site)/artykuly/actions';
import CommentForm from './comments/CommentForm';
import CommentList from './comments/CommentList';
import { MessageCircle } from 'lucide-react';

interface CommentsSectionProps {
  articleId: string;
  slug: string;
}

export default function CommentsSection({ articleId, slug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  const loadComments = async () => {
    setIsLoading(true);
    const loaded = await getCommentsForArticleAction(articleId);
    setComments(loaded);
    setCommentCount(loaded.length);
    setIsLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [articleId]);

  return (
    <section className="w-full py-16 md:py-24 relative border-t border-accent-neon-magenta/20">
      {/* Background accents */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg-primary via-bg-secondary/30 to-bg-primary" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-40 w-80 h-80 bg-accent-neon-magenta/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 rounded-lg bg-accent-neon-cyan/10 border border-accent-neon-cyan/30">
            <MessageCircle size={28} className="text-accent-neon-cyan" />
          </div>
          <div>
            <h2 className="text-4xl font-display font-black text-text-primary">
              Dyskusja
            </h2>
            <p className="text-sm text-text-muted mt-1">{commentCount} komentarz{commentCount !== 1 ? 'y' : ''}</p>
          </div>
        </div>

        {/* Comment Form */}
        <div className="mb-12">
          <CommentForm articleId={articleId} onCommentAdded={loadComments} />
        </div>

        {/* Comments List */}
        <div>
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block">
                <div className="w-12 h-12 rounded-full border-3 border-accent-neon-cyan/20 border-t-accent-neon-cyan animate-spin mb-4" />
                <p className="text-text-muted font-medium">Ładowanie komentarzy...</p>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-accent-neon-cyan/5 to-accent-neon-magenta/5 rounded-xl border border-accent-neon-cyan/20">
              <MessageCircle size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
              <p className="text-text-muted text-lg font-medium">Brak komentarzy. Bądź pierwszy do komentowania!</p>
            </div>
          ) : (
            <CommentList comments={comments} articleId={articleId} onReplyAdded={loadComments} />
          )}
        </div>
      </div>
    </section>
  );
}
