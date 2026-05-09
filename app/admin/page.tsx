'use client';

import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { PipelineLog, Article } from '@/types';
import { formatDateFull } from '@/lib/utils';
import { Play, RefreshCw, Check, X } from 'lucide-react';
import { runPipelineAction } from './actions';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      // Fetch logs
      const { data: logsData } = await supabaseAdmin.from('pipeline_logs').select('*').order('run_at', { ascending: false }).limit(20);
      if (logsData) setLogs(logsData);

      // Fetch articles
      const { data: articlesData } = await supabaseAdmin.from('articles').select('*').order('created_at', { ascending: false }).limit(20);
      if (articlesData) setArticles(articlesData);

      // Fetch stats
      const { count: totalCount } = await supabaseAdmin.from('articles').select('*', { count: 'exact', head: true });
      const { count: publishedCount } = await supabaseAdmin
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');
      const { count: draftCount } = await supabaseAdmin
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      setStats({
        totalArticles: totalCount || 0,
        publishedArticles: publishedCount || 0,
        draftArticles: draftCount || 0,
      });
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

  const publishArticle = async (id: string) => {
    try {
      await supabaseAdmin.from('articles').update({ status: 'published', published_at: new Date().toISOString() }).eq('id', id);
      fetchData();
    } catch (error) {
      alert('Error publishing article');
    }
  };

  const rejectArticle = async (id: string) => {
    try {
      await supabaseAdmin.from('articles').update({ status: 'rejected' }).eq('id', id);
      fetchData();
    } catch (error) {
      alert('Error rejecting article');
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
                className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-4 flex justify-between items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary truncate">{article.title}</p>
                  <p className="text-sm text-text-muted">
                    {article.status} • {article.category}
                  </p>
                </div>
                {article.status === 'draft' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => publishArticle(article.id)}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all"
                      title="Publish"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => rejectArticle(article.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                      title="Reject"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
