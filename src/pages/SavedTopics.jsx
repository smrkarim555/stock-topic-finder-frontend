import { useState, useEffect } from 'react';
import { Bookmark, Trash2, Download, TrendingUp, TrendingDown, Search } from 'lucide-react';
import { getSavedTopics, deleteSavedTopic } from '../lib/api';

export default function SavedTopics({ onSearchTopic }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const d = await getSavedTopics(); setTopics(d.topics || []); }
    catch { setTopics([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteSavedTopic(id);
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  const exportCSV = () => {
    const rows = [['Topic','Type','Demand','Competition','Trend %','Score','Keyword','Saved At']];
    topics.forEach(t => rows.push([t.topic, t.type, t.demand, t.competition, t.trend_percent, t.opportunity_score, t.keyword, t.saved_at]));
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'saved_topics.csv'; a.click();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Saved Topics</h1>
          <p className="text-sm text-gray-500">Your bookmarked topics for Adobe Stock uploads.</p>
        </div>
        {topics.length > 0 && (
          <button className="btn-secondary text-xs py-2" onClick={exportCSV}>
            <Download size={13} /> Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="card p-10 text-center text-sm text-gray-400 animate-pulse">Loading...</div>
      ) : topics.length === 0 ? (
        <div className="card p-16 text-center">
          <Bookmark size={32} className="text-gray-200 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-600 mb-1">No saved topics yet</h3>
          <p className="text-sm text-gray-400">Bookmark topics from the Topic Finder to save them here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">{topics.length} saved topics</span>
            {onSearchTopic && (
              <span className="text-xs text-gray-400">Click any topic row to search related ideas</span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  {['Topic','Type','Demand','Competition','Trend','Score','Search Keyword','Saved',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topics.map(t => (
                  <tr
                    key={t.id}
                    onClick={() => onSearchTopic && onSearchTopic(t.topic)}
                    className="border-b border-gray-50 hover:bg-primary-50/30 transition-colors group cursor-pointer"
                    title={`Click to search "${t.topic}" in Topic Finder`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800 max-w-xs truncate">{t.topic}</span>
                        <Search size={11} className="text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`badge ${t.type === 'Main Topic' ? 'bg-primary-50 text-primary border border-primary-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>{t.type}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{t.demand}</td>
                    <td className="px-4 py-3.5">
                      <span className={`badge ${t.competition === 'Low' ? 'bg-green-50 text-green-700 border border-green-200' : t.competition === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{t.competition}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-semibold flex items-center gap-1 ${t.trend_percent >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {t.trend_percent >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                        {t.trend_percent >= 0 ? '+' : ''}{t.trend_percent}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold ${t.opportunity_score >= 80 ? 'bg-green-500' : t.opportunity_score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}>{t.opportunity_score}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">{t.keyword || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">{new Date(t.saved_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5" onClick={(e) => handleDelete(e, t.id)}>
                      <button className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
