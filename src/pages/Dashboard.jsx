import { useState, useEffect } from 'react';
import { Search, Bookmark, TrendingUp, Clock, ArrowRight, Zap } from 'lucide-react';
import { getSavedTopics, getHistory } from '../lib/api';

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  const [saved, setSaved] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getSavedTopics().then(d => setSaved(d.topics || [])).catch(() => {});
    getHistory().then(d => setHistory(d.history || [])).catch(() => {});
  }, []);

  const topScored = [...saved].sort((a, b) => b.opportunity_score - a.opportunity_score).slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your Stock Topic Finder activity.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Search} label="Total Searches" value={history.length} color="text-primary" bg="bg-primary-50" />
        <StatCard icon={Bookmark} label="Saved Topics" value={saved.length} color="text-green-600" bg="bg-green-50" />
        <StatCard icon={TrendingUp} label="High Score Topics" value={saved.filter(s => s.opportunity_score >= 80).length} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={Clock} label="Recent Searches" value={history.slice(0, 7).length} color="text-blue-600" bg="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Searches */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm">Recent Searches</h2>
            <button onClick={() => onNavigate('history')} className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {history.slice(0, 6).length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No searches yet</div>
            ) : history.slice(0, 6).map((h, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Search size={12} className="text-gray-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 capitalize">{h.keyword}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{h.results_count} results</span>
                  <span className="text-xs text-gray-400">{new Date(h.searched_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Saved Topics */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm">Top Saved Topics</h2>
            <button onClick={() => onNavigate('saved-topics')} className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {topScored.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No saved topics yet</div>
            ) : topScored.map((t, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-700 truncate">{t.topic}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.keyword} · {t.type}</div>
                </div>
                <div className={`ml-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${t.opportunity_score >= 80 ? 'bg-green-500' : t.opportunity_score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}>
                  {t.opportunity_score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick start */}
      {history.length === 0 && (
        <div className="mt-4 card p-6 bg-gradient-to-br from-primary-50 to-white border border-primary-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">Get started with Stock Topic Finder</h3>
              <p className="text-sm text-gray-500 mb-3">Find profitable Adobe Stock topics with AI-powered analysis. Search for a keyword to see demand, competition, and opportunity scores.</p>
              <button onClick={() => onNavigate('topic-finder')} className="btn-primary text-xs py-2">
                <Search size={13} /> Start Searching
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
