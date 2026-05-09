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
    <div className={`${marginLeft} space-y-2`}>
      {/* Comment Card */}
      <div className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-4 hover:border-accent-neon-pink/40 transition-colors">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Image
              src={gravatarUrl}
              alt={comment.author_name}
              width={40}
              height={40}
              className="rounded-full border border-accent-neon-pink/30"
            />
          </div>

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-text-primary">{comment.author_name}</h4>
              <time className="text-xs text-text-muted">{formatDate(comment.created_at)}</time>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-text-primary text-sm leading-relaxed mb-3 whitespace-pre-wrap break-words">{comment.content}</p>

        {/* Reactions */}
        {comment.reactions && comment.reactions.length > 0 && (
          <div className="mb-3">
            <ReactionsDisplay comment={comment} articleId={articleId} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 text-xs">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1 text-text-muted hover:text-accent-neon-pink transition-colors"
          >
            <MessageSquare size={16} />
            Odpowiedź
          </button>

          {replies.length > 0 && (
            <button
              onClick={loadReplies}
              disabled={isLoadingReplies}
              className="flex items-center gap-1 text-text-muted hover:text-accent-neon-pink transition-colors disabled:opacity-50"
            >
              {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {replies.length} {replies.length === 1 ? 'odpowiedź' : 'odpowiedzi'}
            </button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && depth < maxDepth && (
        <div className="ml-4">
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
        <div className="ml-4 mt-4 space-y-4 border-l-2 border-accent-neon-pink/20 pl-0">
          <CommentList comments={replies} articleId={articleId} onReplyAdded={handleReplyAdded} depth={depth + 1} />
        </div>
      )}
    </div>
  );
}
