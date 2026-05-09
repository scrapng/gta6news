'use client';

import { Share2 } from 'lucide-react';

interface ArticleShareButtonsProps {
  title: string;
}

export default function ArticleShareButtons({ title }: ArticleShareButtonsProps) {
  const handleShare = () => {
    const text = `${title} - GTA6News`;
    const url = window.location.href;
    navigator.share?.({ title: text, url });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link skopiowany do schowka!');
  };

  return (
    <div className="flex gap-3 mb-12">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-4 py-2 border border-accent-neon-pink/30 hover:border-accent-neon-pink text-accent-neon-pink hover:text-accent-neon-cyan rounded-lg transition-all"
      >
        <Share2 size={16} />
        Udostępnij
      </button>
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 px-4 py-2 border border-accent-neon-pink/30 hover:border-accent-neon-pink text-accent-neon-pink hover:text-accent-neon-cyan rounded-lg transition-all"
      >
        Kopiuj link
      </button>
    </div>
  );
}
