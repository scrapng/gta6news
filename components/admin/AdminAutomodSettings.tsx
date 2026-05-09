'use client';

import { useEffect, useState } from 'react';
import { AutomodConfig } from '@/types';
import {
  getAutomodSettingsAction,
  updateAutomodSettingAction,
} from '@/app/admin/comments-actions';
import { Settings, Save } from 'lucide-react';

export default function AdminAutomodSettings() {
  const [config, setConfig] = useState<AutomodConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const result = await getAutomodSettingsAction();
    setConfig(result);
  };

  const handleToggle = async (key: keyof Omit<AutomodConfig, 'rate_limit_per_ip' | 'rate_limit_window_minutes'>, value: boolean) => {
    if (!config) return;

    setIsSaving(true);
    const result = await updateAutomodSettingAction(key, value ? 'true' : 'false');

    if (result.success) {
      setConfig({ ...config, [key]: value });
      setMessage({ type: 'success', text: 'Ustawienie zapisane' });
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage({ type: 'error', text: 'Błąd: ' + result.error });
    }
    setIsSaving(false);
  };

  const handleNumberChange = async (key: string, value: number) => {
    if (!config) return;

    setIsSaving(true);
    const result = await updateAutomodSettingAction(key, value.toString());

    if (result.success) {
      setConfig({
        ...config,
        [key === 'rate_limit_per_ip' ? 'rate_limit_per_ip' : 'rate_limit_window_minutes']: value,
      });
      setMessage({ type: 'success', text: 'Ustawienie zapisane' });
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage({ type: 'error', text: 'Błąd: ' + result.error });
    }
    setIsSaving(false);
  };

  if (!config) {
    return <div className="text-center py-16">
      <div className="inline-block">
        <div className="w-12 h-12 rounded-full border-3 border-accent-neon-cyan/20 border-t-accent-neon-cyan animate-spin mb-4" />
        <p className="text-text-muted font-medium">Ładowanie ustawień...</p>
      </div>
    </div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-lg bg-accent-neon-magenta/10 border border-accent-neon-magenta/30">
            <Settings size={28} className="text-accent-neon-magenta" />
          </div>
          <h2 className="text-3xl font-display font-black text-text-primary">Ustawienia Automod</h2>
        </div>
        <p className="text-text-muted text-lg">Skonfiguruj reguły automatycznej moderacji komentarzy</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-900/30 text-green-300 border border-green-500/40'
              : 'bg-red-900/30 text-red-300 border border-red-500/40'
          }`}
        >
          {message.type === 'success' ? '✓' : '✗'} {message.text}
        </div>
      )}

      {/* Settings */}
      <div className="space-y-6">
        {/* Rate Limiting */}
        <div className="bg-gradient-to-br from-bg-card/60 to-bg-card/40 border border-accent-neon-cyan/30 rounded-xl p-6 shadow-lg shadow-accent-neon-cyan/10">
          <h3 className="font-display font-bold text-2xl mb-6 text-text-primary">⚡ Ograniczenie Frecuencji</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Max komentarzy na IP: {config.rate_limit_per_ip}
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={config.rate_limit_per_ip}
                onChange={(e) => handleNumberChange('rate_limit_per_ip', parseInt(e.target.value))}
                disabled={isSaving}
                className="w-full"
              />
              <p className="text-xs text-text-muted mt-1">Maksymalna liczba komentarzy na jedną IP w oknie czasowym</p>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Okno czasowe: {config.rate_limit_window_minutes} minut
              </label>
              <input
                type="range"
                min="1"
                max="180"
                step="5"
                value={config.rate_limit_window_minutes}
                onChange={(e) => handleNumberChange('rate_limit_window_minutes', parseInt(e.target.value))}
                disabled={isSaving}
                className="w-full"
              />
              <p className="text-xs text-text-muted mt-1">Rozpiętość czasowa dla ograniczenia częstości</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-bg-card/60 to-bg-card/40 border border-accent-neon-magenta/30 rounded-xl p-6 shadow-lg shadow-accent-neon-magenta/10">
          <h3 className="font-display font-bold text-2xl mb-6 text-text-primary">🔍 Filtry Zawartości</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-4 cursor-pointer p-4 bg-accent-neon-magenta/10 border border-accent-neon-magenta/20 rounded-lg hover:border-accent-neon-magenta/40 transition-all">
              <input
                type="checkbox"
                checked={config.profanity_filter_enabled}
                onChange={(e) => handleToggle('profanity_filter_enabled', e.target.checked)}
                disabled={isSaving}
                className="w-5 h-5 rounded border-2 border-accent-neon-magenta accent-accent-neon-magenta cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-text-primary font-semibold font-display">🚫 Filtr Wulgaryzmów</p>
                <p className="text-xs text-text-muted">Blokuj komentarze zawierające wulgaryzmy</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${config.profanity_filter_enabled ? 'bg-green-500/20 text-green-300' : 'bg-bg-secondary text-text-muted'}`}>
                {config.profanity_filter_enabled ? 'Włączony' : 'Wyłączony'}
              </span>
            </label>

            <label className="flex items-center gap-4 cursor-pointer p-4 bg-accent-neon-cyan/10 border border-accent-neon-cyan/20 rounded-lg hover:border-accent-neon-cyan/40 transition-all">
              <input
                type="checkbox"
                checked={config.link_detection_enabled}
                onChange={(e) => handleToggle('link_detection_enabled', e.target.checked)}
                disabled={isSaving}
                className="w-5 h-5 rounded border-2 border-accent-neon-cyan accent-accent-neon-cyan cursor-pointer"
              />
              <div className="flex-1">
                <p className="text-text-primary font-semibold font-display">🔗 Detekcja Linków</p>
                <p className="text-xs text-text-muted">Flaguj komentarze zawierające linki (wymagają zatwierdzenia)</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${config.link_detection_enabled ? 'bg-green-500/20 text-green-300' : 'bg-bg-secondary text-text-muted'}`}>
                {config.link_detection_enabled ? 'Włączony' : 'Wyłączony'}
              </span>
            </label>
          </div>
        </div>

        {/* Auto-approve */}
        <div className="bg-gradient-to-br from-bg-card/60 to-bg-card/40 border border-accent-neon-lime/30 rounded-xl p-6 shadow-lg shadow-accent-neon-lime/10">
          <h3 className="font-display font-bold text-2xl mb-6 text-text-primary">✓ Zatwierdzanie</h3>
          <label className="flex items-center gap-4 cursor-pointer p-4 bg-accent-neon-lime/10 border border-accent-neon-lime/20 rounded-lg hover:border-accent-neon-lime/40 transition-all">
            <input
              type="checkbox"
              checked={config.auto_approve_if_pass_automod}
              onChange={(e) => handleToggle('auto_approve_if_pass_automod', e.target.checked)}
              disabled={isSaving}
              className="w-5 h-5 rounded border-2 border-accent-neon-lime accent-accent-neon-lime cursor-pointer"
            />
            <div className="flex-1">
              <p className="text-text-primary font-semibold font-display">Automatyczne Zatwierdzanie</p>
              <p className="text-xs text-text-muted">Automatycznie zatwierdź komentarze, które przejdą wszystkie filtry</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${config.auto_approve_if_pass_automod ? 'bg-green-500/20 text-green-300' : 'bg-bg-secondary text-text-muted'}`}>
              {config.auto_approve_if_pass_automod ? 'Włączony' : 'Wyłączony'}
            </span>
          </label>
        </div>

        {/* Gravatar */}
        <div className="bg-gradient-to-br from-bg-card/60 to-bg-card/40 border border-accent-neon-orange/30 rounded-xl p-6 shadow-lg shadow-accent-neon-orange/10">
          <h3 className="font-display font-bold text-2xl mb-6 text-text-primary">👤 Avatary</h3>
          <label className="flex items-center gap-4 cursor-pointer p-4 bg-accent-neon-orange/10 border border-accent-neon-orange/20 rounded-lg hover:border-accent-neon-orange/40 transition-all">
            <input
              type="checkbox"
              checked={config.require_gravatar}
              onChange={(e) => handleToggle('require_gravatar', e.target.checked)}
              disabled={isSaving}
              className="w-5 h-5 rounded border-2 border-accent-neon-orange accent-accent-neon-orange cursor-pointer"
            />
            <div className="flex-1">
              <p className="text-text-primary font-semibold font-display">Pokaż Gravatar</p>
              <p className="text-xs text-text-muted">Wyświetl avatary Gravatar dla autorów komentarzy</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${config.require_gravatar ? 'bg-green-500/20 text-green-300' : 'bg-bg-secondary text-text-muted'}`}>
              {config.require_gravatar ? 'Włączony' : 'Wyłączony'}
            </span>
          </label>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex gap-3 pt-6">
        <button
          onClick={loadSettings}
          className="group flex items-center gap-2 px-6 py-3 bg-bg-secondary/60 hover:bg-bg-secondary border border-accent-neon-cyan/20 hover:border-accent-neon-cyan text-text-primary hover:text-accent-neon-cyan rounded-lg font-semibold transition-all"
        >
          <span className="group-hover:scale-110 transition-transform">↻</span>
          Przywróć domyślne
        </button>
      </div>
    </div>
  );
}
