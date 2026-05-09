'use client';

import { Comment } from '@/types';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  articleId: string;
  onReplyAdded: () => void;
  depth?: number;
}

export default function CommentList({ comments, articleId, onReplyAdded, depth = 0 }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          articleId={articleId}
          onReplyAdded={onReplyAdded}
          depth={depth}
        />
      ))}
    </div>
  );
}
