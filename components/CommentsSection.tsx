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
    <section className="w-full py-12 md:py-16 border-t border-accent-neon-pink/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle size={28} className="text-accent-neon-pink" />
          <h2 className="text-3xl font-display font-bold text-text-primary">
            Dyskusja
          </h2>
          <span className="text-sm text-text-muted">({commentCount})</span>
        </div>

        {/* Comment Form */}
        <div className="mb-8">
          <CommentForm articleId={articleId} onCommentAdded={loadComments} />
        </div>

        {/* Comments List */}
        <div>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-text-muted">Ładowanie komentarzy...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 bg-bg-secondary/30 rounded-lg border border-accent-neon-pink/10">
              <p className="text-text-muted">Brak komentarzy. Bądź pierwszy do komentowania!</p>
            </div>
          ) : (
            <CommentList comments={comments} articleId={articleId} onReplyAdded={loadComments} />
          )}
        </div>
      </div>
    </section>
  );
}
