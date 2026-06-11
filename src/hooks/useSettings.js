import { useState, useEffect } from 'react';
import { getSettings } from '../lib/api';

const STORAGE_KEY = 'stock_topic_finder_prefs';

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch { setSettings({ has_api_key: false, masked_key: '' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);
  return { settings, loading, refresh };
}

export function useAppPrefs() {
  const defaults = { resultsCount: 20, autoSave: true, defaultCountry: 'worldwide' };

  const load = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch { return defaults; }
  };

  const [prefs, setPrefs] = useState(load);

  const update = (newPrefs) => {
    const merged = { ...prefs, ...newPrefs };
    setPrefs(merged);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch {}
  };

  return { prefs, update };
}
