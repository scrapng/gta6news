'use client';

import { useState, useEffect, useRef } from 'react';

interface ReactionsPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const PRESET_REACTIONS = ['👍', '👎', '😂', '🔥', '❤️', '🤔', '🎮', '🚀', '👌', '💯'];

export default function ReactionsPicker({ onSelect, onClose }: ReactionsPickerProps) {
  const [customEmoji, setCustomEmoji] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmoji.trim()) {
      onSelect(customEmoji.trim());
      setCustomEmoji('');
      setShowCustomInput(false);
    }
  };

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full right-0 mb-2 bg-bg-card border border-accent-neon-pink/30 rounded-lg shadow-lg p-3 z-50"
    >
      {/* Preset Reactions */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {PRESET_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="text-xl hover:scale-125 transition-transform hover:bg-accent-neon-pink/20 p-1 rounded"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Custom Emoji Input */}
      <div className="border-t border-accent-neon-pink/15 pt-2">
        {showCustomInput ? (
          <form onSubmit={handleCustomSubmit} className="flex gap-1">
            <input
              type="text"
              value={customEmoji}
              onChange={(e) => setCustomEmoji(e.target.value)}
              placeholder="Emoji..."
              maxLength={10}
              autoFocus
              className="flex-1 px-2 py-1 bg-bg-secondary border border-accent-neon-pink/30 rounded text-sm focus:outline-none focus:border-accent-neon-pink"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-accent-neon-pink hover:bg-accent-neon-cyan text-bg-primary rounded text-xs font-bold"
            >
              OK
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full px-2 py-1 text-xs text-text-muted hover:text-accent-neon-pink text-center"
          >
            + Własny emoji
          </button>
        )}
      </div>
    </div>
  );
}
