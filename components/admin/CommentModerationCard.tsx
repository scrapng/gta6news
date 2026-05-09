'use client';

import { useState } from 'react';
import { Comment } from '@/types';
import {
  approveCommentAction,
  rejectCommentAction,
  deleteCommentAction,
  banUserAction,
} from '@/app/admin/comments-actions';
import { formatDate } from '@/lib/utils';
import { Check, X, Trash2, Ban } from 'lucide-react';

interface CommentModerationCardProps {
  comment: Comment;
  onAction: () => void;
}

export default function CommentModerationCard({ comment, onAction }: CommentModerationCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showBanForm, setShowBanForm] = useState(false);
  const [banDays, setBanDays] = useState(7);

  const handleApprove = async () => {
    setIsProcessing(true);
    const result = await approveCommentAction(comment.id);
    if (result.success) {
      onAction();
    } else {
      alert('Błąd: ' + result.error);
    }
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Podaj powód odrzucenia');
      return;
    }
    setIsProcessing(true);
    const result = await rejectCommentAction(comment.id, rejectReason);
    if (result.success) {
      setShowRejectForm(false);
      setRejectReason('');
      onAction();
    } else {
      alert('Błąd: ' + result.error);
    }
    setIsProcessing(false);
  };

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć ten komentarz?')) return;
    setIsProcessing(true);
    const result = await deleteCommentAction(comment.id);
    if (result.success) {
      onAction();
    } else {
      alert('Błąd: ' + result.error);
    }
    setIsProcessing(false);
  };

  const handleBan = async () => {
    setIsProcessing(true);
    const result = await banUserAction('email', comment.author_email, `Spam/spam content`, banDays);
    if (result.success) {
      setShowBanForm(false);
      alert('Użytkownik został zablokowany');
      onAction();
    } else {
      alert('Błąd: ' + result.error);
    }
    setIsProcessing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-900/20 text-red-400 border-red-500/30';
      case 'spam':
        return 'bg-orange-900/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-bg-card/60 to-bg-card/40 border border-accent-neon-magenta/25 hover:border-accent-neon-magenta/50 rounded-xl p-5 space-y-4 transition-all duration-300 hover:shadow-lg hover:shadow-accent-neon-magenta/10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h4 className="font-display font-bold text-text-primary">{comment.author_name}</h4>
            <span className={`text-xs px-3 py-1.5 rounded-full border font-semibold ${getStatusColor(comment.status)}`}>{comment.status.toUpperCase()}</span>
          </div>
          <p className="text-xs text-text-muted font-mono">{comment.author_email}</p>
          <p className="text-xs text-text-muted font-mono">IP: {comment.author_ip}</p>
          <time className="text-xs text-text-muted block mt-2">{formatDate(comment.created_at)}</time>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-r from-accent-neon-cyan/10 to-accent-neon-magenta/10 border border-accent-neon-cyan/20 rounded-lg p-4">
        <p className="text-sm text-text-primary whitespace-pre-wrap break-words">{comment.content}</p>
      </div>

      {/* Rejection Reason */}
      {comment.rejection_reason && (
        <div className="bg-red-900/20 border border-red-500/40 rounded-lg p-3">
          <p className="text-xs text-red-300">
            <span className="font-bold">⚠️ Powód odrzucenia:</span> {comment.rejection_reason}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap pt-2">
        {comment.status === 'pending' && (
          <>
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="group flex items-center gap-2 px-4 py-2 bg-accent-neon-lime/20 hover:bg-accent-neon-lime/30 text-accent-neon-lime border border-accent-neon-lime/40 hover:border-accent-neon-lime rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            >
              <Check size={18} className="group-hover:scale-110 transition-transform" />
              Zatwierdź
            </button>
            <button
              onClick={() => setShowRejectForm(!showRejectForm)}
              disabled={isProcessing}
              className="group flex items-center gap-2 px-4 py-2 bg-accent-neon-pink/20 hover:bg-accent-neon-pink/30 text-accent-neon-pink border border-accent-neon-pink/40 hover:border-accent-neon-pink rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            >
              <X size={18} className="group-hover:scale-110 transition-transform" />
              Odrzuć
            </button>
          </>
        )}

        <button
          onClick={handleDelete}
          disabled={isProcessing}
          className="group flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-600/40 hover:border-red-600 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
        >
          <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
          Usuń
        </button>

        <button
          onClick={() => setShowBanForm(!showBanForm)}
          disabled={isProcessing}
          className="group flex items-center gap-2 px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-600/40 hover:border-orange-600 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
        >
          <Ban size={18} className="group-hover:scale-110 transition-transform" />
          Zablokuj
        </button>
      </div>

      {/* Reject Form */}
      {showRejectForm && (
        <div className="space-y-3 bg-gradient-to-br from-bg-secondary/40 to-bg-secondary/20 p-4 rounded-lg border border-accent-neon-pink/20">
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Powód odrzucenia..."
            maxLength={200}
            rows={2}
            className="w-full px-3 py-2 bg-bg-secondary/50 border border-accent-neon-pink/30 focus:border-accent-neon-pink rounded-lg text-sm text-text-primary focus:outline-none focus:shadow-glow-magenta transition-all"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-accent-neon-pink/20 to-red-600/20 border border-accent-neon-pink/40 hover:border-accent-neon-pink text-accent-neon-pink hover:shadow-glow-magenta rounded-lg text-sm font-bold transition-all disabled:opacity-50"
            >
              Potwierdź
            </button>
            <button
              onClick={() => {
                setShowRejectForm(false);
                setRejectReason('');
              }}
              className="flex-1 px-4 py-2 bg-bg-secondary/50 hover:bg-bg-secondary border border-accent-neon-magenta/30 hover:border-accent-neon-magenta text-text-primary rounded-lg text-sm font-bold transition-all"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Ban Form */}
      {showBanForm && (
        <div className="space-y-3 bg-gradient-to-br from-bg-secondary/40 to-bg-secondary/20 p-4 rounded-lg border border-orange-600/20">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-2">Blokada na ile dni? (0 = na zawsze)</label>
            <input
              type="number"
              value={banDays}
              onChange={(e) => setBanDays(parseInt(e.target.value) || 0)}
              min="0"
              max="365"
              className="w-full px-3 py-2 bg-bg-secondary/50 border border-orange-600/30 focus:border-orange-600 rounded-lg text-sm text-text-primary focus:outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBan}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-600/40 hover:border-orange-600 text-orange-400 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
            >
              Zablokuj
            </button>
            <button
              onClick={() => setShowBanForm(false)}
              className="flex-1 px-4 py-2 bg-bg-secondary/50 hover:bg-bg-secondary border border-orange-600/30 hover:border-orange-600 text-text-primary rounded-lg text-sm font-bold transition-all"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
