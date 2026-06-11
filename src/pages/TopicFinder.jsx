import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Download, Bookmark, BookmarkCheck, TrendingUp, TrendingDown, ChevronDown, Info, Sparkles, X } from 'lucide-react';
import { searchTopics, saveTopic } from '../lib/api';
import Sparkline from '../components/Sparkline';
import DemandBars from '../components/DemandBars';
import { useAppPrefs } from '../hooks/useSettings';

const examples = ['coffee', 'food', 'business', 'technology', 'nature', 'health'];

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-gray-100 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

function CompetitionBadge({ value }) {
  const cfg = {
    Low: 'bg-green-50 text-green-700 border border-green-200',
    Medium: 'bg-amber-50 text-amber-700 border border-amber-200',
    High: 'bg-red-50 text-red-700 border border-red-200',
  }[value] || 'bg-gray-100 text-gray-600';
  return <span className={`badge ${cfg}`}>{value}</span>;
}

function TypeBadge({ value }) {
  const cfg = value === 'Main Topic'
    ? 'bg-primary-50 text-primary border border-primary-200'
    : 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  return <span className={`badge ${cfg}`}>{value}</span>;
}

function ScoreBadge({ score }) {
  const cls = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-white text-xs font-bold ${cls}`}>
      {score}
    </span>
  );
}

// Generate Ideas Panel shown below clicked row
function GenerateIdeasPanel({ topic, onClose, onSearch }) {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState(null);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    setIdeas(null);
    try {
      const data = await searchTopics({ keyword: topic.topic });
      setIdeas(data.topics.slice(0, 6));
    } catch (e) {
      setError('Failed to generate ideas. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr>
      <td colSpan={8} className="px-0 py-0">
        <div className="mx-4 my-2 bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-800">Generate Ideas</span>
                <span className="text-xs text-gray-400 ml-2">based on "{topic.topic}"</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white transition-colors">
              <X size={15} />
            </button>
          </div>

          {!ideas && !loading && (
            <div className="flex items-center gap-3">
              <p className="text-xs text-gray-500 flex-1">
                Click to discover related sub-topics and niche ideas for <strong>{topic.topic}</strong> with AI.
              </p>
              <button
                onClick={generate}
                className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
              >
                <Sparkles size={13} /> Generate Ideas
              </button>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 py-2">
              <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="text-xs text-gray-500">Finding related topics for "{topic.topic}"...</span>
            </div>
          )}

          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

          {ideas && ideas.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2 font-medium">Related ideas — click any to search:</p>
              <div className="flex flex-wrap gap-2">
                {ideas.map((idea) => (
                  <button
                    key={idea.id}
                    onClick={() => { onClose(); onSearch(idea.topic); }}
                    className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-lg text-xs text-gray-700 hover:text-primary transition-all shadow-sm group"
                  >
                    <span className="font-medium">{idea.topic}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold text-white ${idea.opportunity_score >= 80 ? 'bg-green-500' : idea.opportunity_score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}>
                      {idea.opportunity_score}
                    </span>
                    <Search size={10} className="text-gray-300 group-hover:text-primary" />
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={generate} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <Sparkles size={11} /> Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function TopicFinder({ onSaveSuccess, initialKeyword = '' }) {
  const { prefs } = useAppPrefs();
  const [keyword, setKeyword] = useState(initialKeyword);

  useEffect(() => {
    if (initialKeyword && initialKeyword.trim()) {
      handleSearch(initialKeyword);
    }
  }, []);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState(new Set());
  const [savingId, setSavingId] = useState(null);
  const [filters, setFilters] = useState({ topic_type: 'all', category: 'all', country: 'worldwide', time_range: 'past_12_months' });
  const [showFilters, setShowFilters] = useState(false);
  const [exportMsg, setExportMsg] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSearch = async (kw) => {
    const q = kw || keyword;
    if (!q.trim()) return;
    setKeyword(q);
    setLoading(true);
    setError('');
    setResults(null);
    setSavedIds(new Set());
    setExpandedRow(null);
    setActiveFilter('All');
    try {
      const data = await searchTopics({ keyword: q.trim(), ...filters, max_results: prefs.resultsCount });
      setResults(data);
    } catch (e) {
      setError('Failed to fetch topics. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (topic) => {
    setSavingId(topic.id);
    try {
      await saveTopic({ ...topic, keyword: results?.keyword });
      setSavedIds(prev => new Set([...prev, topic.id]));
      onSaveSuccess?.();
    } catch (e) {
      if (e?.response?.status === 409) setSavedIds(prev => new Set([...prev, topic.id]));
    } finally {
      setSavingId(null);
    }
  };

  const exportCSV = () => {
    if (!results) return;
    const rows = [['Topic', 'Type', 'Demand', 'Competition', 'Trend %', 'Opportunity Score']];
    results.topics.forEach(t => rows.push([t.topic, t.type, t.demand, t.competition, t.trend_percent, t.opportunity_score]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `stock_topics_${results.keyword}.csv`;
    a.click();
    setExportMsg('CSV exported!');
    setTimeout(() => setExportMsg(''), 2000);
  };

  const exportTXT = () => {
    if (!results) return;
    const txt = results.topics.map(t => `${t.topic} | ${t.type} | Demand: ${t.demand} | Competition: ${t.competition} | Trend: ${t.trend_percent}% | Score: ${t.opportunity_score}`).join('\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `stock_topics_${results.keyword}.txt`;
    a.click();
    setExportMsg('TXT exported!');
    setTimeout(() => setExportMsg(''), 2000);
  };

  const filteredTopics = results?.topics?.filter(t => {
    if (activeFilter === 'All') return true;
    return t.type === activeFilter;
  }) || [];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Topic Finder</h1>
        <p className="text-sm text-gray-500">Search topics and get data from Google Trends to find low competition, high potential ideas.</p>
      </div>

      {/* Search Bar */}
      <div className="card p-4 mb-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-10"
              placeholder="Enter keyword... (e.g. coffee, food, business)"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="btn-primary" onClick={() => handleSearch()} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Searching...
              </span>
            ) : (
              <><Search size={15} />Search</>
            )}
          </button>
          <button className="btn-secondary" onClick={() => setShowFilters(v => !v)}>
            <SlidersHorizontal size={15} />Filters
            <ChevronDown size={13} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Example keywords */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-400">Try:</span>
          {examples.map(ex => (
            <button key={ex} onClick={() => handleSearch(ex)}
              className="text-xs px-2.5 py-1 bg-gray-50 hover:bg-primary-50 hover:text-primary border border-gray-200 rounded-full transition-colors">
              {ex}
            </button>
          ))}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Topic Type</label>
              <select className="select" value={filters.topic_type} onChange={e => setFilters(f => ({ ...f, topic_type: e.target.value }))}>
                <option value="all">All</option>
                <option value="main">Main Topic</option>
                <option value="sub">Sub Topic</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Category</label>
              <select className="select" value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
                <option value="all">All</option>
                <option value="business">Business</option>
                <option value="nature">Nature</option>
                <option value="food">Food & Drink</option>
                <option value="technology">Technology</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Country</label>
              <select className="select" value={filters.country} onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}>
                <option value="worldwide">Worldwide</option>
                <option value="us">United States</option>
                <option value="gb">United Kingdom</option>
                <option value="de">Germany</option>
                <option value="jp">Japan</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Time Range</label>
              <select className="select" value={filters.time_range} onChange={e => setFilters(f => ({ ...f, time_range: e.target.value }))}>
                <option value="past_12_months">Past 12 months</option>
                <option value="past_3_months">Past 3 months</option>
                <option value="past_month">Past month</option>
                <option value="past_week">Past week</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Filter row (always visible after search) */}
      {results && (
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {['All', 'Main Topic', 'Sub Topic'].map(t => (
            <button
              key={t}
              onClick={() => setActiveFilter(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${activeFilter === t ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:bg-primary-50 hover:text-primary hover:border-primary-200'}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      {/* Results */}
      {(loading || results) && (
        <div className="card overflow-hidden">
          {/* Results header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              {results ? (
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-gray-800 text-sm">
                    Results for <span className="text-primary">"{results.keyword}"</span>
                  </h2>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                    {filteredTopics.length} results found
                  </span>
                </div>
              ) : (
                <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
              )}
            </div>
            {results && (
              <div className="flex items-center gap-2">
                {exportMsg && <span className="text-xs text-green-600 font-medium">{exportMsg}</span>}
                <button className="btn-secondary text-xs py-1.5" onClick={exportCSV}>
                  <Download size={13} />CSV
                </button>
                <button className="btn-secondary text-xs py-1.5" onClick={exportTXT}>
                  <Download size={13} />TXT
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 w-10">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Topic</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">
                    <span className="flex items-center gap-1">Demand <span className="text-gray-300">(Google Trends)</span></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">
                    <span className="flex items-center gap-1">Competition <Info size={11} className="text-gray-300" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">
                    <span className="flex items-center gap-1">Trend <span className="text-gray-300">(Past 12 Months)</span></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">
                    <span className="flex items-center gap-1">Opportunity Score <Info size={11} className="text-gray-300" /></span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && [...Array(8)].map((_, i) => <SkeletonRow key={i} />)}
                {filteredTopics.map((topic) => (
                  <>
                    <tr
                      key={topic.id}
                      onClick={() => setExpandedRow(expandedRow === topic.id ? null : topic.id)}
                      className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer ${expandedRow === topic.id ? 'bg-primary-50/30' : ''}`}
                    >
                      <td className="px-4 py-3.5 text-xs text-gray-400 font-medium">{topic.id}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-800">{topic.topic}</span>
                          {expandedRow === topic.id
                            ? <ChevronDown size={13} className="text-primary rotate-180 transition-transform" />
                            : <ChevronDown size={13} className="text-gray-300 group-hover:text-gray-400 transition-all" />
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><TypeBadge value={topic.type} /></td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <DemandBars demand={topic.demand} />
                          <span className="text-sm text-gray-600">{topic.demand}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><CompetitionBadge value={topic.competition} /></td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {topic.trend_percent >= 0
                            ? <TrendingUp size={13} className="text-green-500" />
                            : <TrendingDown size={13} className="text-red-500" />
                          }
                          <span className={`text-sm font-semibold ${topic.trend_percent >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {topic.trend_percent >= 0 ? '+' : ''}{topic.trend_percent}%
                          </span>
                          <Sparkline trend={topic.trend_percent} />
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <ScoreBadge score={topic.opportunity_score} />
                      </td>
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleSave(topic)}
                          disabled={savedIds.has(topic.id) || savingId === topic.id}
                          className={`p-2 rounded-lg transition-all ${savedIds.has(topic.id)
                            ? 'text-primary bg-primary-50 cursor-default'
                            : 'text-gray-400 hover:text-primary hover:bg-primary-50'
                          }`}
                          title={savedIds.has(topic.id) ? 'Saved' : 'Save topic'}
                        >
                          {savedIds.has(topic.id)
                            ? <BookmarkCheck size={16} />
                            : savingId === topic.id
                              ? <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                              : <Bookmark size={16} />
                          }
                        </button>
                      </td>
                    </tr>
                    {expandedRow === topic.id && (
                      <GenerateIdeasPanel
                        key={`panel-${topic.id}`}
                        topic={topic}
                        onClose={() => setExpandedRow(null)}
                        onSearch={handleSearch}
                      />
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          {results && (
            <div className="px-5 py-3.5 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-600">Demand</span>
                <span className="flex items-center gap-1"><DemandBars demand="High" /> High</span>
                <span className="flex items-center gap-1"><DemandBars demand="Medium" /> Medium</span>
                <span className="flex items-center gap-1"><DemandBars demand="Low" /> Low</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-600">Competition</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Low</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Medium</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> High</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !results && !error && (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-primary" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-2">Search for a topic to get started</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">Enter a keyword above to discover high-potential Adobe Stock topics with demand, competition, and trend data.</p>
        </div>
      )}
    </div>
  );
}
