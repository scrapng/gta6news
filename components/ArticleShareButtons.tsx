'use client';

import { Share2, Copy } from 'lucide-react';

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
    <div className="flex gap-4 mb-12">
      <button
        onClick={handleShare}
        className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-neon-magenta/20 to-accent-neon-pink/20 border border-accent-neon-magenta/40 hover:border-accent-neon-magenta text-accent-neon-magenta hover:text-accent-neon-cyan rounded-lg transition-all duration-300 hover:shadow-glow-magenta font-semibold"
      >
        <Share2 size={18} className="group-hover:scale-110 transition-transform" />
        Udostępnij
      </button>
      <button
        onClick={handleCopyLink}
        className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-neon-cyan/20 to-accent-neon-lime/20 border border-accent-neon-cyan/40 hover:border-accent-neon-cyan text-accent-neon-cyan hover:text-accent-neon-magenta rounded-lg transition-all duration-300 hover:shadow-glow-cyan font-semibold"
      >
        <Copy size={18} className="group-hover:scale-110 transition-transform" />
        Kopiuj link
      </button>
    </div>
  );
}
