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
      <div className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-4 space-y-4 mb-4">
        <h4 className="font-bold text-accent-neon-pink">Edit Article</h4>

        <div>
          <label className="text-sm text-text-secondary block mb-2">Title</label>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 bg-bg-secondary border border-accent-neon-pink/30 rounded text-text-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary block mb-2">Excerpt</label>
          <textarea
            value={editData.excerpt}
            onChange={(e) => setEditData({ ...editData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 bg-bg-secondary border border-accent-neon-pink/30 rounded text-text-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary block mb-2">SEO Title</label>
          <input
            type="text"
            value={editData.seo_title}
            onChange={(e) => setEditData({ ...editData, seo_title: e.target.value })}
            className="w-full px-3 py-2 bg-bg-secondary border border-accent-neon-pink/30 rounded text-text-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary block mb-2">SEO Description</label>
          <textarea
            value={editData.seo_description}
            onChange={(e) => setEditData({ ...editData, seo_description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-bg-secondary border border-accent-neon-pink/30 rounded text-text-primary"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSaveEdit}
            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-all"
          >
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 px-3 py-2 bg-bg-secondary hover:bg-bg-primary border border-accent-neon-pink/30 text-text-primary rounded transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setIsEditing(true)}
        className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-all"
        title="Edit"
      >
        <Edit size={18} />
      </button>

      {article.status === 'draft' && (
        <button
          onClick={handlePublish}
          className="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-all"
          title="Publish"
        >
          <Check size={18} />
        </button>
      )}

      {article.status === 'published' && (
        <button
          onClick={handleHide}
          className="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition-all"
          title="Hide (make draft)"
        >
          <EyeOff size={18} />
        </button>
      )}

      {article.status === 'draft' && (
        <button
          onClick={handleReject}
          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all"
          title="Reject"
        >
          <X size={18} />
        </button>
      )}

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 bg-red-700/20 hover:bg-red-700/30 text-red-500 rounded-lg transition-all disabled:opacity-50"
        title="Delete permanently"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
