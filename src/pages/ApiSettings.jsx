import { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { saveApiKey, deleteApiKey } from '../lib/api';
import { useSettings } from '../hooks/useSettings';

export default function ApiSettings() {
  const { settings, refresh } = useSettings();
  const [input, setInput] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!input.trim()) return;
    setSaving(true);
    setStatus(null);
    try {
      await saveApiKey(input.trim());
      setStatus('success');
      setMsg('API key saved successfully!');
      setInput('');
      refresh();
    } catch {
      setStatus('error');
      setMsg('Failed to save API key. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Remove your API key?')) return;
    await deleteApiKey();
    setStatus('success');
    setMsg('API key removed.');
    refresh();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">API Settings</h1>
        <p className="text-sm text-gray-500">Configure your Groq API key for AI-powered topic generation.</p>
      </div>

      <div className="max-w-xl space-y-4">
        {/* Current Status */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Key size={15} className="text-primary" /> API Key Status
          </h2>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-2.5 h-2.5 rounded-full ${settings?.has_api_key ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm font-medium text-gray-700">
              {settings?.has_api_key ? 'Connected' : 'Not configured'}
            </span>
          </div>
          {settings?.has_api_key && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Groq API Key</div>
                <div className="font-mono text-sm text-gray-700">{settings.masked_key}</div>
              </div>
              <button onClick={handleDelete} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          )}
          {!settings?.has_api_key && (
            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              Without a Groq API key, the app will use mock data for demonstrations.
            </div>
          )}
        </div>

        {/* Add / Update Key */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-1">
            {settings?.has_api_key ? 'Update API Key' : 'Add API Key'}
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Get your free API key from <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">console.groq.com</a>. Keys start with <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">gsk_</code>
          </p>
          <div className="relative mb-3">
            <input
              type={show ? 'text' : 'password'}
              className="input pr-10"
              placeholder="gsk_••••••••••••••••••••••••••••"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <button
              type="button"
              onClick={() => setShow(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <button className="btn-primary w-full justify-center" onClick={handleSave} disabled={saving || !input.trim()}>
            {saving ? 'Saving...' : 'Save API Key'}
          </button>
          {status && (
            <div className={`mt-3 flex items-center gap-2 text-sm p-3 rounded-lg ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {status === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              {msg}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="card p-5 bg-blue-50/50 border-blue-100">
          <h3 className="font-semibold text-gray-700 text-sm mb-2">About Groq API</h3>
          <ul className="text-xs text-gray-500 space-y-1.5">
            <li>• Groq provides ultra-fast LLM inference for topic generation</li>
            <li>• Uses <strong>llama-3.3-70b-versatile</strong> model for Adobe Stock topic ideas</li>
            <li>• Free tier available — no credit card required to start</li>
            <li>• Your API key is stored locally in SQLite on your machine</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
