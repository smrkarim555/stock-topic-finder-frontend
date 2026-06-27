import { useState } from 'react';
import {
  Search, Globe, ExternalLink, Copy, Check, Sparkles, Target, ListPlus,
  TrendingUp, AlertCircle, Loader2, ArrowRight, ImageOff,
} from 'lucide-react';
import { analyzeMarket } from '../lib/api';

const MARKETS = [
  { id: 'adobe', label: 'Adobe Stock', color: '#FF0000' },
  { id: 'shutterstock', label: 'Shutterstock', color: '#EE2737' },
  { id: 'istock', label: 'iStock', color: '#000000' },
  { id: 'getty', label: 'Getty Images', color: '#3a3a3a' },
  { id: 'freepik', label: 'Freepik', color: '#1273EB' },
  { id: 'pond5', label: 'Pond5', color: '#00C28C' },
];

// Mirrors backend build_market_url() — only used so "Open site" can jump
// straight to the real search results for reference.
function buildClientUrl(marketId, keyword) {
  const kw = keyword.trim();
  if (!kw) return null;
  switch (marketId) {
    case 'adobe':
      return `https://stock.adobe.com/search?k=${encodeURIComponent(kw)}&search_type=usertyped`;
    case 'shutterstock':
      return `https://www.shutterstock.com/search/${encodeURIComponent(kw.replace(/\s+/g, '-'))}`;
    case 'istock':
      return `https://www.istockphoto.com/search/2/image?phrase=${encodeURIComponent(kw)}`;
    case 'getty':
      return `https://www.gettyimages.com/photos/${encodeURIComponent(kw)}`;
    case 'freepik':
      return `https://www.freepik.com/search?format=search&query=${encodeURIComponent(kw)}`;
    case 'pond5':
      return `https://www.pond5.com/search?kw=${encodeURIComponent(kw)}`;
    default:
      return null;
  }
}

const examples = ['saving money', 'business casual attire', 'fitness motivation', 'wedding flowers', 'remote work'];

function DemandBadge({ value }) {
  const cfg = {
    High: 'bg-green-50 text-green-700 border border-green-200',
    Medium: 'bg-amber-50 text-amber-700 border border-amber-200',
    Low: 'bg-gray-100 text-gray-500 border border-gray-200',
  }[value] || 'bg-gray-100 text-gray-600';
  return <span className={`badge ${cfg}`}>{value} demand</span>;
}

function KeywordChip({ keyword, onSearch }) {
  const [copied, setCopied] = useState(false);

  const copy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(keyword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="flex items-center gap-1 pl-3 pr-1.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 group hover:border-primary-200 hover:bg-primary-50/50 transition-colors">
      <span>{keyword}</span>
      <button onClick={copy} title="Copy keyword" className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-white transition-colors">
        {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
      </button>
      <button onClick={() => onSearch(keyword)} title="Hunt this keyword in Topic Finder" className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-white transition-colors">
        <ArrowRight size={11} />
      </button>
    </div>
  );
}

function NicheCard({ niche, onSearch, onCopyAll }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug">{niche.name}</h3>
        <DemandBadge value={niche.demand} />
      </div>
      {niche.rationale && <p className="text-xs text-gray-500 mb-3">{niche.rationale}</p>}

      <p className="text-xs text-gray-400 font-medium mb-2">{niche.keywords.length} long-tail keywords</p>
      <div className="flex flex-wrap gap-1.5 mb-3 max-h-48 overflow-y-auto pr-1">
        {niche.keywords.map((k, i) => (
          <KeywordChip key={i} keyword={k} onSearch={onSearch} />
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <button onClick={() => onSearch(niche.name)} className="btn-primary text-xs py-1.5 px-3">
          <Target size={12} /> Hunt All Keywords for "{niche.name}"
        </button>
        <button onClick={() => onCopyAll(niche)} className="btn-secondary text-xs py-1.5 px-3">
          <ListPlus size={12} /> Copy List
        </button>
      </div>
    </div>
  );
}

export default function MarketAnalyzer({ onSearchTopic }) {
  const [market, setMarket] = useState('adobe');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copyMsg, setCopyMsg] = useState('');

  const activeMarket = MARKETS.find(m => m.id === market) || MARKETS[0];

  const handleAnalyze = async (kw) => {
    const q = (kw ?? keyword).trim();
    if (!q) return;
    setKeyword(q);
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await analyzeMarket({ market, keyword: q });
      setResult(data);
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to analyze this page. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const openSite = () => {
    const url = buildClientUrl(market, keyword);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const flashCopy = (msg) => {
    setCopyMsg(msg);
    setTimeout(() => setCopyMsg(''), 1800);
  };

  const copyNiche = async (niche) => {
    try {
      await navigator.clipboard.writeText(niche.keywords.join('\n'));
      flashCopy(`Copied keywords for "${niche.name}"`);
    } catch {}
  };

  const copyAllKeywords = async () => {
    if (!result) return;
    const all = result.niches.flatMap(n => n.keywords);
    try {
      await navigator.clipboard.writeText(all.join('\n'));
      flashCopy(`Copied ${all.length} keywords`);
    } catch {}
  };

  const totalKeywords = result ? result.niches.reduce((sum, n) => sum + n.keywords.length, 0) : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Market Analyzer</h1>
        <p className="text-sm text-gray-500">Pick a stock marketplace, analyze a search for your keyword, and get profitable niches with ready-to-use long-tail keywords.</p>
      </div>

      {/* Market tabs + search */}
      <div className="card p-4 mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">Marketplace</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {MARKETS.map(m => (
            <button
              key={m.id}
              onClick={() => setMarket(m.id)}
              className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                market === m.id
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: market === m.id ? '#fff' : m.color }} />
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-10"
              placeholder={`Enter a keyword to analyze on ${activeMarket.label}...`}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
            />
          </div>
          <button className="btn-primary" onClick={() => handleAnalyze()} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={15} className="animate-spin" /> Analyzing...
              </span>
            ) : (
              <><Sparkles size={15} /> Analyze This Page</>
            )}
          </button>
          <button className="btn-secondary" onClick={openSite} title={`Open this search on ${activeMarket.label}`} disabled={!keyword.trim()}>
            <ExternalLink size={15} /> Open Site
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-400">Try:</span>
          {examples.map(ex => (
            <button key={ex} onClick={() => handleAnalyze(ex)}
              className="text-xs px-2.5 py-1 bg-gray-50 hover:bg-primary-50 hover:text-primary border border-gray-200 rounded-full transition-colors">
              {ex}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-4" />
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, j) => <div key={j} className="h-6 w-20 bg-gray-100 rounded-lg" />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && result && (
        <>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-800">
                {result.niches.length} niches · {totalKeywords} keywords for "{result.keyword}"
              </span>
              <span className={`badge ${result.fetched_live ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                {result.fetched_live ? 'Live page analyzed' : 'AI-estimated'}
              </span>
              {result.used_ai && (
                <span className="badge bg-primary-50 text-primary border border-primary-200">
                  <TrendingUp size={11} className="inline mr-1" />AI-powered
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {copyMsg && <span className="text-xs text-green-600 font-medium">{copyMsg}</span>}
              <button className="btn-secondary text-xs py-1.5" onClick={copyAllKeywords}>
                <Copy size={13} /> Copy All Keywords
              </button>
            </div>
          </div>

          {!result.fetched_live && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2.5 rounded-lg text-xs mb-4">
              Couldn't pull live signals from {result.market_name} for this search (the site may block automated requests) — showing {result.used_ai ? 'AI-estimated' : 'template-based'} niches for "{result.keyword}" instead.
            </div>
          )}

          {/* Live preview images from the actual marketplace page */}
          {result.preview_images && result.preview_images.length > 0 ? (
            <div className="card p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-600">
                  What's already on {result.market_name} for "{result.keyword}"
                </p>
                <a
                  href={result.page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 whitespace-nowrap"
                >
                  View all on {result.market_name} <ExternalLink size={11} />
                </a>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {result.preview_images.map((src, i) => (
                  <a
                    key={i}
                    href={result.page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50"
                    title={`Open "${result.keyword}" on ${result.market_name}`}
                  >
                    <img
                      src={src}
                      alt={`${result.keyword} preview ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.closest('a').style.display = 'none'; }}
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 text-gray-500 px-4 py-2.5 rounded-lg text-xs mb-4 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <ImageOff size={14} /> Couldn't load preview images directly from {result.market_name} for this search.
              </span>
              <button onClick={openSite} className="text-primary hover:underline flex items-center gap-1 whitespace-nowrap">
                Open Site <ExternalLink size={11} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {result.niches.map(niche => (
              <NicheCard key={niche.id} niche={niche} onSearch={onSearchTopic} onCopyAll={copyNiche} />
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && !result && !error && (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Globe size={24} className="text-primary" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-2">Pick a marketplace and analyze a keyword</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Choose Adobe Stock, Shutterstock, iStock, Getty, Freepik, or Pond5 above, enter a keyword, and click "Analyze This Page" to discover profitable niches and long-tail keywords.
          </p>
        </div>
      )}
    </div>
  );
}
