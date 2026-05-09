'use client';

import { useState } from 'react';
import { Comment } from '@/types';
import { addReactionAction, removeReactionAction } from '@/app/(site)/artykuly/actions';
import ReactionsPicker from './ReactionsPicker';
import { SmilePlus } from 'lucide-react';

interface ReactionsDisplayProps {
  comment: Comment;
  articleId: string;
}

export default function ReactionsDisplay({ comment, articleId }: ReactionsDisplayProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reactions, setReactions] = useState(comment.reactions || []);
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());

  const handleAddReaction = async (emoji: string) => {
    setIsLoading(true);
    const result = await addReactionAction(comment.id, emoji);

    if (result.success) {
      // Update local reactions
      const existing = reactions.find((r) => r.emoji === emoji);
      if (existing) {
        setReactions(reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r)));
      } else {
        setReactions([...reactions, { emoji, count: 1 }]);
      }
      setUserReactions((prev) => new Set([...prev, emoji]));
      setShowPicker(false);
    }
    setIsLoading(false);
  };

  const handleRemoveReaction = async (emoji: string) => {
    setIsLoading(true);
    const result = await removeReactionAction(comment.id, emoji);

    if (result.success) {
      setReactions(
        reactions
          .map((r) => (r.emoji === emoji ? { ...r, count: Math.max(0, r.count - 1) } : r))
          .filter((r) => r.count > 0)
      );
      setUserReactions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(emoji);
        return newSet;
      });
    }
    setIsLoading(false);
  };

  const toggleReaction = (emoji: string) => {
    if (userReactions.has(emoji)) {
      handleRemoveReaction(emoji);
    } else {
      handleAddReaction(emoji);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Existing Reactions */}
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          onClick={() => toggleReaction(reaction.emoji)}
          disabled={isLoading}
          className={`px-2 py-1 rounded-full text-sm transition-all ${
            userReactions.has(reaction.emoji)
              ? 'bg-accent-neon-pink/30 border border-accent-neon-pink hover:bg-accent-neon-pink/50'
              : 'bg-bg-secondary border border-accent-neon-pink/15 hover:bg-bg-secondary/80'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={`${reaction.count} ${reaction.emoji}`}
        >
          <span>{reaction.emoji}</span>
          <span className="ml-1 text-text-muted text-xs">{reaction.count}</span>
        </button>
      ))}

      {/* Add Reaction Button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          disabled={isLoading}
          className="p-1.5 rounded-full bg-bg-secondary border border-accent-neon-pink/15 hover:bg-accent-neon-pink/20 transition-colors disabled:opacity-50"
          title="Dodaj reaction"
        >
          <SmilePlus size={18} className="text-accent-neon-pink" />
        </button>

        {/* Emoji Picker */}
        {showPicker && <ReactionsPicker onSelect={handleAddReaction} onClose={() => setShowPicker(false)} />}
      </div>
    </div>
  );
}
