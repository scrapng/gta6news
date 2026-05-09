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
      className="absolute bottom-full right-0 mb-3 bg-gradient-to-br from-bg-card/90 to-bg-secondary/60 border border-accent-neon-magenta/40 rounded-xl shadow-2xl shadow-accent-neon-magenta/20 p-4 z-50 backdrop-blur-sm"
    >
      {/* Preset Reactions */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {PRESET_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="text-2xl hover:scale-150 transition-transform hover:bg-accent-neon-magenta/30 p-2 rounded-lg cursor-pointer active:scale-90"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Custom Emoji Input */}
      <div className="border-t border-accent-neon-magenta/20 pt-3">
        {showCustomInput ? (
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customEmoji}
              onChange={(e) => setCustomEmoji(e.target.value)}
              placeholder="Emoji..."
              maxLength={10}
              autoFocus
              className="flex-1 px-3 py-2 bg-bg-secondary/70 border border-accent-neon-magenta/30 rounded-lg text-sm focus:outline-none focus:border-accent-neon-magenta focus:shadow-glow-magenta transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-magenta-cyan hover:shadow-glow-magenta text-bg-primary rounded-lg text-xs font-bold transition-all"
            >
              OK
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full px-2 py-2 text-xs text-text-muted hover:text-accent-neon-cyan text-center font-semibold transition-colors"
          >
            + Własny emoji
          </button>
        )}
      </div>
    </div>
  );
}
