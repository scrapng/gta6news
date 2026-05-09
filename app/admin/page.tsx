'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PipelineLog, Article } from '@/types';
import { formatDateFull } from '@/lib/utils';
import { Play, RefreshCw, BarChart3, FileText, MessageSquare, Settings, Image as ImageIcon } from 'lucide-react';
import { runPipelineAction, fetchAdminDataAction } from './actions';
import AdminArticleActions from '@/components/AdminArticleActions';
import AdminCommentsModeration from '@/components/admin/AdminCommentsModeration';
import AdminAutomodSettings from '@/components/admin/AdminAutomodSettings';

type AdminTab = 'dashboard' | 'articles' | 'comments' | 'automod';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [logs, setLogs] = useState<PipelineLog[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setIsAuthenticated(true);
      setPassword('');
      fetchData();
    } else {
      alert('Invalid password');
    }
  };

  const fetchData = async () => {
    try {
      const result = await fetchAdminDataAction();
      if (result.success) {
        setLogs(result.logs);
        setArticles(result.articles);
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const runPipeline = async () => {
    setIsLoading(true);
    try {
      const result = await runPipelineAction();
      if (result.success) {
        alert(`Generated ${result.articles.length} article(s)`);
        fetchData();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error running pipeline: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-bg-card p-8 rounded-lg border border-accent-neon-pink/20">
          <h1 className="text-3xl font-display font-bold mb-6 text-accent-neon-pink">Admin Panel</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-bg-secondary border border-accent-neon-pink/30 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-neon-pink mb-4"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-accent-neon-pink hover:bg-accent-neon-cyan text-bg-primary font-bold rounded-lg transition-all"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-8 text-accent-neon-pink">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-accent-neon-pink/20 overflow-x-auto mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-accent-neon-pink text-accent-neon-pink'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <BarChart3 size={18} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'articles'
                ? 'border-accent-neon-pink text-accent-neon-pink'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <FileText size={18} />
            Articles
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'comments'
                ? 'border-accent-neon-pink text-accent-neon-pink'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <MessageSquare size={18} />
            Comments
          </button>

          <button
            onClick={() => setActiveTab('automod')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'automod'
                ? 'border-accent-neon-pink text-accent-neon-pink'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <Settings size={18} />
            Automod Settings
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Total Articles</p>
            <p className="text-3xl font-display font-bold text-accent-neon-pink">{stats.totalArticles}</p>
          </div>
          <div className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Published</p>
            <p className="text-3xl font-display font-bold text-green-400">{stats.publishedArticles}</p>
          </div>
          <div className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-6">
            <p className="text-text-muted text-sm mb-2">Drafts</p>
            <p className="text-3xl font-display font-bold text-yellow-400">{stats.draftArticles}</p>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={runPipeline}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-accent-neon-pink hover:bg-accent-neon-cyan text-bg-primary font-bold rounded-lg transition-all mb-8 disabled:opacity-50"
        >
          {isLoading ? <RefreshCw className="animate-spin" /> : <Play />}
          {isLoading ? 'Running...' : 'Run Pipeline'}
        </button>

        {/* Recent Logs */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold mb-4 text-text-primary">Recent Runs</h2>
          <div className="bg-bg-card border border-accent-neon-pink/20 rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-secondary border-b border-accent-neon-pink/20">
                <tr>
                  <th className="px-4 py-3 text-left text-accent-neon-pink">Date</th>
                  <th className="px-4 py-3 text-left text-accent-neon-pink">Searched</th>
                  <th className="px-4 py-3 text-left text-accent-neon-pink">Generated</th>
                  <th className="px-4 py-3 text-left text-accent-neon-pink">Published</th>
                  <th className="px-4 py-3 text-left text-accent-neon-pink">Duration</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-accent-neon-pink/10 hover:bg-bg-secondary/50">
                    <td className="px-4 py-3">{formatDateFull(log.run_at)}</td>
                    <td className="px-4 py-3">{log.articles_searched}</td>
                    <td className="px-4 py-3">{log.articles_generated}</td>
                    <td className="px-4 py-3">{log.articles_published}</td>
                    <td className="px-4 py-3">{log.duration_ms}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

            {/* Recent Articles */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-4 text-text-primary">Recent Articles</h2>
              <div className="space-y-3">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-4"
                  >
                    <div className="flex gap-4 mb-3">
                      {/* Article Cover Image */}
                      {article.cover_image ? (
                        <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={article.cover_image}
                            alt={article.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 flex-shrink-0 rounded bg-bg-secondary flex items-center justify-center">
                          <ImageIcon size={24} className="text-text-muted" />
                        </div>
                      )}
                      {/* Article Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary truncate">{article.title}</p>
                        <p className="text-sm text-text-muted">
                          {article.status} • {article.category}
                        </p>
                        {/* Image Attribution Info */}
                        {article.cover_image && (
                          <div className="text-xs text-text-secondary mt-1 space-y-0.5">
                            {article.image_source && (
                              <p>📷 Source: <span className="capitalize">{article.image_source}</span></p>
                            )}
                            {article.image_photographer_name && (
                              <p>By: {article.image_photographer_name}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <AdminArticleActions article={article} onRefresh={fetchData} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 text-text-primary">All Articles</h2>
            <div className="space-y-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-4"
                >
                  <div className="flex gap-4 mb-3">
                    {/* Article Cover Image */}
                    {article.cover_image ? (
                      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={article.cover_image}
                          alt={article.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 flex-shrink-0 rounded bg-bg-secondary flex items-center justify-center">
                        <ImageIcon size={24} className="text-text-muted" />
                      </div>
                    )}
                    {/* Article Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary truncate">{article.title}</p>
                      <p className="text-sm text-text-muted">
                        {article.status} • {article.category}
                      </p>
                      {/* Image Attribution Info */}
                      {article.cover_image && (
                        <div className="text-xs text-text-secondary mt-1 space-y-0.5">
                          {article.image_source && (
                            <p>📷 Source: <span className="capitalize">{article.image_source}</span></p>
                          )}
                          {article.image_photographer_name && (
                            <p>By: {article.image_photographer_name}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <AdminArticleActions article={article} onRefresh={fetchData} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <AdminCommentsModeration />
        )}

        {/* Automod Settings Tab */}
        {activeTab === 'automod' && (
          <AdminAutomodSettings />
        )}
      </div>
    </div>
  );
}
