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
    <div className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-semibold text-text-primary">{comment.author_name}</h4>
            <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(comment.status)}`}>{comment.status}</span>
          </div>
          <p className="text-xs text-text-muted">{comment.author_email}</p>
          <p className="text-xs text-text-muted">IP: {comment.author_ip}</p>
          <time className="text-xs text-text-muted block mt-1">{formatDate(comment.created_at)}</time>
        </div>
      </div>

      {/* Content */}
      <div className="bg-bg-secondary/50 rounded p-3">
        <p className="text-sm text-text-primary whitespace-pre-wrap break-words">{comment.content}</p>
      </div>

      {/* Rejection Reason */}
      {comment.rejection_reason && (
        <div className="bg-red-900/20 border border-red-500/30 rounded p-2">
          <p className="text-xs text-red-400">
            <span className="font-bold">Powód odrzucenia:</span> {comment.rejection_reason}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {comment.status === 'pending' && (
          <>
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded text-sm transition-colors disabled:opacity-50"
            >
              <Check size={16} />
              Zatwierdź
            </button>
            <button
              onClick={() => setShowRejectForm(!showRejectForm)}
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-sm transition-colors disabled:opacity-50"
            >
              <X size={16} />
              Odrzuć
            </button>
          </>
        )}

        <button
          onClick={handleDelete}
          disabled={isProcessing}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-700/20 hover:bg-red-700/30 text-red-500 rounded text-sm transition-colors disabled:opacity-50"
        >
          <Trash2 size={16} />
          Usuń
        </button>

        <button
          onClick={() => setShowBanForm(!showBanForm)}
          disabled={isProcessing}
          className="flex items-center gap-1 px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded text-sm transition-colors disabled:opacity-50"
        >
          <Ban size={16} />
          Zablokuj
        </button>
      </div>

      {/* Reject Form */}
      {showRejectForm && (
        <div className="space-y-2 bg-bg-secondary/30 p-3 rounded">
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Powód odrzucenia..."
            maxLength={200}
            rows={2}
            className="w-full px-2 py-1.5 bg-bg-secondary border border-accent-neon-pink/30 rounded text-sm text-text-primary focus:outline-none focus:border-accent-neon-pink"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold transition-colors disabled:opacity-50"
            >
              Potwierdź
            </button>
            <button
              onClick={() => {
                setShowRejectForm(false);
                setRejectReason('');
              }}
              className="px-3 py-1 bg-bg-secondary hover:bg-bg-primary border border-accent-neon-pink/30 text-text-primary rounded text-sm transition-colors"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Ban Form */}
      {showBanForm && (
        <div className="space-y-2 bg-bg-secondary/30 p-3 rounded">
          <div>
            <label className="block text-xs text-text-secondary mb-1">Blokada na ile dni? (0 = na zawsze)</label>
            <input
              type="number"
              value={banDays}
              onChange={(e) => setBanDays(parseInt(e.target.value) || 0)}
              min="0"
              max="365"
              className="w-full px-2 py-1.5 bg-bg-secondary border border-accent-neon-pink/30 rounded text-sm text-text-primary focus:outline-none focus:border-accent-neon-pink"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBan}
              disabled={isProcessing}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-bold transition-colors disabled:opacity-50"
            >
              Zablokuj
            </button>
            <button
              onClick={() => setShowBanForm(false)}
              className="px-3 py-1 bg-bg-secondary hover:bg-bg-primary border border-accent-neon-pink/30 text-text-primary rounded text-sm transition-colors"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
