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
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-2.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj po autorze, emailu, treści..."
            className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-accent-neon-pink/30 rounded-lg text-text-primary placeholder-text-muted focus:border-accent-neon-pink focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-accent-neon-pink hover:bg-accent-neon-cyan text-bg-primary font-bold rounded-lg transition-all"
        >
          Szukaj
        </button>
      </form>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-accent-neon-pink/20 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-accent-neon-pink text-accent-neon-pink'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className="text-xs bg-bg-secondary px-2 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-text-muted">Ładowanie komentarzy...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-bg-secondary/30 rounded-lg border border-accent-neon-pink/10">
            <p className="text-text-muted">Brak komentarzy do wyświetlenia</p>
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
        <div className="flex gap-2 justify-center pt-4">
          <button
            onClick={() => loadComments(activeTab, Math.max(0, page - 1) * limit)}
            disabled={page === 0}
            className="px-4 py-2 bg-bg-secondary hover:bg-accent-neon-pink/20 text-text-primary rounded-lg disabled:opacity-50 transition-colors"
          >
            ← Poprzednia
          </button>
          <span className="px-4 py-2 text-text-muted text-sm">
            Strona {page + 1} z {Math.ceil(total / limit)}
          </span>
          <button
            onClick={() => loadComments(activeTab, (page + 1) * limit)}
            disabled={page >= Math.ceil(total / limit) - 1}
            className="px-4 py-2 bg-bg-secondary hover:bg-accent-neon-pink/20 text-text-primary rounded-lg disabled:opacity-50 transition-colors"
          >
            Następna →
          </button>
        </div>
      )}
    </div>
  );
}
