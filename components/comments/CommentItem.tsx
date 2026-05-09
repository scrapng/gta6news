'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/types';
import { getRepliesForCommentAction } from '@/app/(site)/artykuly/actions';
import { formatDate } from '@/lib/utils';
import { getGravatarUrl } from '@/lib/automod';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import ReactionsDisplay from './ReactionsDisplay';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

interface CommentItemProps {
  comment: Comment;
  articleId: string;
  onReplyAdded: () => void;
  depth?: number;
}

export default function CommentItem({ comment, articleId, onReplyAdded, depth = 0 }: CommentItemProps) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const maxDepth = 3; // Limit nesting depth

  const loadReplies = async () => {
    if (replies.length > 0) {
      setShowReplies(!showReplies);
      return;
    }

    setIsLoadingReplies(true);
    const loaded = await getRepliesForCommentAction(comment.id);
    setReplies(loaded);
    setShowReplies(true);
    setIsLoadingReplies(false);
  };

  const handleReplyAdded = () => {
    setShowReplyForm(false);
    onReplyAdded();
    loadReplies();
  };

  const marginLeft = depth > 0 ? `ml-${Math.min(depth, 3) * 4}` : '';
  const gravatarUrl = getGravatarUrl(comment.author_email);

  return (
    <div className={`${marginLeft} space-y-4`}>
      {/* Comment Card */}
      <div className="bg-gradient-to-br from-bg-card/60 to-bg-card/40 border border-accent-neon-magenta/25 hover:border-accent-neon-magenta/50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-accent-neon-magenta/10">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Image
              src={gravatarUrl}
              alt={comment.author_name}
              width={44}
              height={44}
              className="rounded-full border-2 border-accent-neon-cyan/40 hover:border-accent-neon-cyan transition-colors"
            />
          </div>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h4 className="font-display font-bold text-text-primary text-base">{comment.author_name}</h4>
              <time className="text-xs text-text-muted bg-accent-neon-magenta/10 px-2 py-1 rounded">{formatDate(comment.created_at)}</time>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-text-primary text-sm leading-relaxed mb-4 whitespace-pre-wrap break-words">{comment.content}</p>

        {/* Reactions */}
        {comment.reactions && comment.reactions.length > 0 && (
          <div className="mb-4">
            <ReactionsDisplay comment={comment} articleId={articleId} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-6 text-xs">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="group flex items-center gap-2 text-text-muted hover:text-accent-neon-magenta transition-colors font-medium"
          >
            <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
            Odpowiedź
          </button>

          {replies.length > 0 && (
            <button
              onClick={loadReplies}
              disabled={isLoadingReplies}
              className="group flex items-center gap-2 text-text-muted hover:text-accent-neon-cyan transition-colors font-medium disabled:opacity-50"
            >
              {showReplies ? <ChevronUp size={16} className="group-hover:scale-110 transition-transform" /> : <ChevronDown size={16} className="group-hover:scale-110 transition-transform" />}
              {replies.length} {replies.length === 1 ? 'odpowiedź' : 'odpowiedzi'}
            </button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && depth < maxDepth && (
        <div className="ml-4 md:ml-8">
          <CommentForm
            articleId={articleId}
            parentCommentId={comment.id}
            onCommentAdded={handleReplyAdded}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <div className="ml-4 md:ml-8 mt-4 space-y-4 border-l-2 border-gradient-to-b from-accent-neon-cyan/30 to-accent-neon-magenta/30 pl-5">
          <CommentList comments={replies} articleId={articleId} onReplyAdded={handleReplyAdded} depth={depth + 1} />
        </div>
      )}
    </div>
  );
}
