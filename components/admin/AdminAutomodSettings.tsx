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
    return <div className="text-center py-8 text-text-muted">Ładowanie ustawień...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Settings size={28} className="text-accent-neon-pink" />
          <h2 className="text-2xl font-display font-bold text-text-primary">Ustawienia Automod</h2>
        </div>
        <p className="text-text-muted">Skonfiguruj reguły automatycznej moderacji komentarzy</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-900/20 text-green-400 border border-green-500/30'
              : 'bg-red-900/20 text-red-400 border border-red-500/30'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Settings */}
      <div className="space-y-4">
        {/* Rate Limiting */}
        <div className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-6">
          <h3 className="font-display font-bold text-text-primary mb-4">Ograniczenie Frecuencji</h3>
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
        <div className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-6">
          <h3 className="font-display font-bold text-text-primary mb-4">Filtry Zawartości</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.profanity_filter_enabled}
                onChange={(e) => handleToggle('profanity_filter_enabled', e.target.checked)}
                disabled={isSaving}
                className="w-4 h-4 rounded border-accent-neon-pink/30"
              />
              <div>
                <p className="text-text-primary font-semibold">Filtr Wulgaryzmów</p>
                <p className="text-xs text-text-muted">Blokuj komentarze zawierające wulgaryzmy</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.link_detection_enabled}
                onChange={(e) => handleToggle('link_detection_enabled', e.target.checked)}
                disabled={isSaving}
                className="w-4 h-4 rounded border-accent-neon-pink/30"
              />
              <div>
                <p className="text-text-primary font-semibold">Detekcja Linków</p>
                <p className="text-xs text-text-muted">Flaguj komentarze zawierające linki (wymagają zatwierdzenia)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Auto-approve */}
        <div className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-6">
          <h3 className="font-display font-bold text-text-primary mb-4">Zatwierdzanie</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.auto_approve_if_pass_automod}
              onChange={(e) => handleToggle('auto_approve_if_pass_automod', e.target.checked)}
              disabled={isSaving}
              className="w-4 h-4 rounded border-accent-neon-pink/30"
            />
            <div>
              <p className="text-text-primary font-semibold">Automatyczne Zatwierdzanie</p>
              <p className="text-xs text-text-muted">Automatycznie zatwierdź komentarze, które przejdą wszystkie filtry</p>
            </div>
          </label>
        </div>

        {/* Gravatar */}
        <div className="bg-bg-card border border-accent-neon-pink/20 rounded-lg p-6">
          <h3 className="font-display font-bold text-text-primary mb-4">Avatary</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.require_gravatar}
              onChange={(e) => handleToggle('require_gravatar', e.target.checked)}
              disabled={isSaving}
              className="w-4 h-4 rounded border-accent-neon-pink/30"
            />
            <div>
              <p className="text-text-primary font-semibold">Pokaż Gravatar</p>
              <p className="text-xs text-text-muted">Wyświetl avatary Gravatar dla autorów komentarzy</p>
            </div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-2">
        <button
          onClick={loadSettings}
          className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-bg-primary border border-accent-neon-pink/30 text-text-primary rounded-lg transition-colors"
        >
          Przywróć domyślne
        </button>
      </div>
    </div>
  );
}
