'use client';

import { useState, useEffect } from 'react';
import { CommentStatus } from '@/types';
import {
  getCommentsForModerationAction,
  getCommentStatsAction,
  searchCommentsAction,
} from '@/app/admin/comments-actions';
import CommentModerationCard from './CommentModerationCard';
import { Search, MessageSquare, Clock, Ban, Trash2 } from 'lucide-react';

type TabType = 'pending' | 'approved' | 'rejected' | 'spam';

export default function AdminCommentsModeration() {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [comments, setComments] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, spam: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const limit = 20;

  const loadStats = async () => {
    const result = await getCommentStatsAction();
    setStats(result);
  };

  const loadComments = async (tab: TabType, offset = 0) => {
    setIsLoading(true);
    let result;

    if (searchQuery.trim()) {
      result = await searchCommentsAction(searchQuery, tab === 'pending' ? 'pending' : tab, limit, offset);
    } else {
      result = await getCommentsForModerationAction(tab, limit, offset);
    }

    setComments(result.comments || []);
    setTotal(result.total || 0);
    setPage(offset / limit);
    setIsLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadComments(activeTab, 0);
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadComments(activeTab, 0);
  };

  const handleRefresh = () => {
    loadStats();
    loadComments(activeTab, page * limit);
  };

  const tabs: { id: TabType; label: string; count: number; icon: React.ReactNode }[] = [
    { id: 'pending', label: 'Oczekujące', count: stats.pending, icon: <Clock size={18} /> },
    { id: 'approved', label: 'Zatwierdzone', count: stats.approved, icon: <MessageSquare size={18} /> },
    { id: 'rejected', label: 'Odrzucone', count: stats.rejected, icon: <Ban size={18} /> },
    { id: 'spam', label: 'Spam', count: stats.spam, icon: <Trash2 size={18} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-2 text-text-primary">Moderacja Komentarzy</h2>
        <p className="text-text-muted">Razem: {stats.total} komentarzy</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-3 text-accent-neon-cyan" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj po autorze, emailu, treści..."
            className="w-full pl-11 pr-4 py-3 bg-bg-secondary/50 border border-accent-neon-cyan/30 hover:border-accent-neon-cyan/50 rounded-lg text-text-primary placeholder-text-muted focus:border-accent-neon-cyan focus:outline-none focus:shadow-glow-cyan transition-all"
          />
        </div>
        <button
          type="submit"
          className="group px-6 py-3 bg-gradient-magenta-cyan hover:shadow-glow-magenta text-bg-primary font-bold rounded-lg transition-all"
        >
          🔍 Szukaj
        </button>
      </form>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-accent-neon-magenta/20 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap font-semibold ${
              activeTab === tab.id
                ? 'border-accent-neon-magenta text-accent-neon-magenta shadow-glow-magenta'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <span className="group-hover:scale-125 transition-transform">{tab.icon}</span>
            {tab.label}
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
              activeTab === tab.id
                ? 'bg-accent-neon-magenta/20 text-accent-neon-magenta'
                : 'bg-bg-secondary text-text-muted'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 rounded-full border-3 border-accent-neon-cyan/20 border-t-accent-neon-cyan animate-spin mb-4" />
              <p className="text-text-muted font-medium">Ładowanie komentarzy...</p>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-accent-neon-cyan/5 to-accent-neon-magenta/5 rounded-xl border border-accent-neon-cyan/20">
            <MessageSquare size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
            <p className="text-text-muted text-lg font-medium">Brak komentarzy do wyświetlenia</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentModerationCard
              key={comment.id}
              comment={comment}
              onAction={handleRefresh}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex gap-3 justify-center pt-8">
          <button
            onClick={() => loadComments(activeTab, Math.max(0, page - 1) * limit)}
            disabled={page === 0}
            className="group px-6 py-3 bg-bg-secondary/60 hover:bg-bg-secondary border border-accent-neon-cyan/20 hover:border-accent-neon-cyan text-text-primary hover:text-accent-neon-cyan rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
          >
            ← Poprzednia
          </button>
          <span className="px-4 py-3 text-text-muted text-sm font-medium bg-bg-secondary/30 rounded-lg border border-accent-neon-magenta/10">
            Strona <span className="text-accent-neon-magenta font-bold">{page + 1}</span> z <span className="text-accent-neon-cyan font-bold">{Math.ceil(total / limit)}</span>
          </span>
          <button
            onClick={() => loadComments(activeTab, (page + 1) * limit)}
            disabled={page >= Math.ceil(total / limit) - 1}
            className="group px-6 py-3 bg-bg-secondary/60 hover:bg-bg-secondary border border-accent-neon-cyan/20 hover:border-accent-neon-cyan text-text-primary hover:text-accent-neon-cyan rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
          >
            Następna →
          </button>
        </div>
      )}
    </div>
  );
}
