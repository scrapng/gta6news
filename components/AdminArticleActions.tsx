'use client';

import { useState } from 'react';
import { Article } from '@/types';
import { publishArticleAction, rejectArticleAction, hideArticleAction, deleteArticleAction, updateArticleAction } from '@/app/admin/actions';
import { Edit, Trash2, Eye, EyeOff, Check, X } from 'lucide-react';

interface AdminArticleActionsProps {
  article: Article;
  onRefresh: () => void;
}

export default function AdminArticleActions({ article, onRefresh }: AdminArticleActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    title: article.title,
    excerpt: article.excerpt,
    seo_title: article.seo_title || '',
    seo_description: article.seo_description || '',
  });

  const handlePublish = async () => {
    const result = await publishArticleAction(article.id);
    if (result.success) {
      alert('Article published!');
      onRefresh();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleReject = async () => {
    const result = await rejectArticleAction(article.id);
    if (result.success) {
      alert('Article rejected!');
      onRefresh();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleHide = async () => {
    const result = await hideArticleAction(article.id);
    if (result.success) {
      alert('Article hidden!');
      onRefresh();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteArticleAction(article.id);
    setIsDeleting(false);

    if (result.success) {
      alert('Article deleted!');
      onRefresh();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleSaveEdit = async () => {
    const result = await updateArticleAction(article.id, editData);
    if (result.success) {
      alert('Article updated!');
      setIsEditing(false);
      onRefresh();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-gradient-to-br from-bg-card/60 to-bg-card/40 border border-accent-neon-magenta/30 rounded-xl p-6 space-y-5 mb-4 shadow-lg shadow-accent-neon-magenta/10">
        <h4 className="font-display font-bold text-xl bg-gradient-to-r from-accent-neon-magenta to-accent-neon-cyan bg-clip-text text-transparent">✏️ Edit Article</h4>

        <div>
          <label className="text-sm font-semibold text-text-secondary block mb-3">Title</label>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-4 py-3 bg-bg-secondary/50 border border-accent-neon-magenta/20 hover:border-accent-neon-magenta/40 rounded-lg text-text-primary focus:border-accent-neon-magenta focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-text-secondary block mb-3">Excerpt</label>
          <textarea
            value={editData.excerpt}
            onChange={(e) => setEditData({ ...editData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-bg-secondary/50 border border-accent-neon-magenta/20 hover:border-accent-neon-magenta/40 rounded-lg text-text-primary focus:border-accent-neon-magenta focus:outline-none transition-all resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-text-secondary block mb-3">SEO Title</label>
          <input
            type="text"
            value={editData.seo_title}
            onChange={(e) => setEditData({ ...editData, seo_title: e.target.value })}
            className="w-full px-4 py-3 bg-bg-secondary/50 border border-accent-neon-magenta/20 hover:border-accent-neon-magenta/40 rounded-lg text-text-primary focus:border-accent-neon-magenta focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-text-secondary block mb-3">SEO Description</label>
          <textarea
            value={editData.seo_description}
            onChange={(e) => setEditData({ ...editData, seo_description: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 bg-bg-secondary/50 border border-accent-neon-magenta/20 hover:border-accent-neon-magenta/40 rounded-lg text-text-primary focus:border-accent-neon-magenta focus:outline-none transition-all resize-none"
          />
        </div>

        <div className="flex gap-3 pt-3">
          <button
            onClick={handleSaveEdit}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-accent-neon-lime/20 to-green-500/20 border border-accent-neon-lime/40 hover:border-accent-neon-lime text-accent-neon-lime hover:shadow-glow-cyan font-bold rounded-lg transition-all"
          >
            ✓ Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 px-4 py-3 bg-bg-secondary/50 hover:bg-bg-secondary border border-accent-neon-magenta/30 hover:border-accent-neon-magenta text-text-primary font-bold rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={() => setIsEditing(true)}
        className="group p-2.5 bg-accent-neon-cyan/20 hover:bg-accent-neon-cyan/30 text-accent-neon-cyan rounded-lg transition-all border border-accent-neon-cyan/30 hover:border-accent-neon-cyan hover:shadow-glow-cyan"
        title="Edit"
      >
        <Edit size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      {article.status === 'draft' && (
        <button
          onClick={handlePublish}
          className="group p-2.5 bg-accent-neon-lime/20 hover:bg-accent-neon-lime/30 text-accent-neon-lime rounded-lg transition-all border border-accent-neon-lime/30 hover:border-accent-neon-lime hover:shadow-glow-cyan"
          title="Publish"
        >
          <Check size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      {article.status === 'published' && (
        <button
          onClick={handleHide}
          className="group p-2.5 bg-accent-neon-orange/20 hover:bg-accent-neon-orange/30 text-accent-neon-orange rounded-lg transition-all border border-accent-neon-orange/30 hover:border-accent-neon-orange hover:shadow-glow-cyan"
          title="Hide (make draft)"
        >
          <EyeOff size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      {article.status === 'draft' && (
        <button
          onClick={handleReject}
          className="group p-2.5 bg-accent-neon-pink/20 hover:bg-accent-neon-pink/30 text-accent-neon-pink rounded-lg transition-all border border-accent-neon-pink/30 hover:border-accent-neon-pink hover:shadow-glow-magenta"
          title="Reject"
        >
          <X size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      )}

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="group p-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-lg transition-all border border-red-600/30 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete permanently"
      >
        <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
