import { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, Search } from 'lucide-react';
import { getHistory, clearHistory } from '../lib/api';

export default function History({ onNavigate }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const d = await getHistory(); setHistory(d.history || []); }
    catch { setHistory([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleClear = async () => {
    if (!confirm('Clear all search history?')) return;
    await clearHistory();
    setHistory([]);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Search History</h1>
          <p className="text-sm text-gray-500">All your past keyword searches.</p>
        </div>
        {history.length > 0 && (
          <button className="btn-secondary text-xs py-2 hover:text-red-500 hover:border-red-200" onClick={handleClear}>
            <Trash2 size={13} /> Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div className="card p-10 text-center text-sm text-gray-400 animate-pulse">Loading...</div>
      ) : history.length === 0 ? (
        <div className="card p-16 text-center">
          <HistoryIcon size={32} className="text-gray-200 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-600 mb-1">No history yet</h3>
          <p className="text-sm text-gray-400 mb-4">Your search history will appear here.</p>
          <button className="btn-primary text-xs py-2" onClick={() => onNavigate('topic-finder')}>
            <Search size={13} /> Start Searching
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">{history.length} searches</span>
          </div>
          <div className="divide-y divide-gray-50">
            {history.map((h, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Search size={13} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800 capitalize">{h.keyword}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{new Date(h.searched_at).toLocaleString()}</div>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                  {h.results_count} results
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
