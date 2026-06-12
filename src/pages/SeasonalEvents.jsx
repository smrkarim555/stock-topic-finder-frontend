import { useState, useEffect } from 'react';
import { Calendar, Globe, Sparkles, X, Copy, Check, ChevronRight, Clock } from 'lucide-react';

// ─── All events database ───────────────────────────────────────────────────
const ALL_EVENTS = [
  // JANUARY
  { id: 1, name: "New Year", month: 1, day: 1, emoji: "🎆", color: "from-yellow-400 to-orange-500", light: "bg-yellow-50 border-yellow-200 text-yellow-700", countries: ["worldwide"] },
  { id: 2, name: "Martin Luther King Day", month: 1, day: 20, emoji: "✊", color: "from-blue-500 to-blue-700", light: "bg-blue-50 border-blue-200 text-blue-700", countries: ["us"] },
  { id: 3, name: "Chinese New Year", month: 1, day: 29, emoji: "🧧", color: "from-red-500 to-red-700", light: "bg-red-50 border-red-200 text-red-700", countries: ["worldwide", "cn", "sg"] },
  // FEBRUARY
  { id: 4, name: "Valentine's Day", month: 2, day: 14, emoji: "❤️", color: "from-pink-400 to-rose-600", light: "bg-pink-50 border-pink-200 text-pink-700", countries: ["worldwide"] },
  { id: 5, name: "Super Bowl", month: 2, day: 9, emoji: "🏈", color: "from-green-500 to-emerald-700", light: "bg-green-50 border-green-200 text-green-700", countries: ["us"] },
  { id: 6, name: "Presidents Day", month: 2, day: 17, emoji: "🇺🇸", color: "from-blue-400 to-indigo-600", light: "bg-blue-50 border-blue-200 text-blue-700", countries: ["us"] },
  // MARCH
  { id: 7, name: "Women's Day", month: 3, day: 8, emoji: "👩", color: "from-purple-400 to-pink-600", light: "bg-purple-50 border-purple-200 text-purple-700", countries: ["worldwide"] },
  { id: 8, name: "St. Patrick's Day", month: 3, day: 17, emoji: "🍀", color: "from-green-400 to-emerald-600", light: "bg-green-50 border-green-200 text-green-700", countries: ["worldwide", "us", "gb", "ie"] },
  { id: 9, name: "Spring / Nowruz", month: 3, day: 20, emoji: "🌸", color: "from-pink-300 to-rose-500", light: "bg-pink-50 border-pink-200 text-pink-700", countries: ["worldwide"] },
  { id: 10, name: "Holi Festival", month: 3, day: 25, emoji: "🎨", color: "from-fuchsia-400 to-purple-600", light: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700", countries: ["worldwide", "in"] },
  // APRIL
  { id: 11, name: "Easter", month: 4, day: 20, emoji: "🐣", color: "from-yellow-300 to-green-400", light: "bg-yellow-50 border-yellow-200 text-yellow-700", countries: ["worldwide", "us", "gb", "de", "au"] },
  { id: 12, name: "Earth Day", month: 4, day: 22, emoji: "🌍", color: "from-green-400 to-teal-600", light: "bg-green-50 border-green-200 text-green-700", countries: ["worldwide"] },
  { id: 13, name: "Ramadan / Eid Season", month: 4, day: 1, emoji: "🌙", color: "from-indigo-400 to-purple-600", light: "bg-indigo-50 border-indigo-200 text-indigo-700", countries: ["worldwide"] },
  // MAY
  { id: 14, name: "Mother's Day", month: 5, day: 11, emoji: "💐", color: "from-rose-400 to-pink-600", light: "bg-rose-50 border-rose-200 text-rose-700", countries: ["worldwide"] },
  { id: 15, name: "Memorial Day", month: 5, day: 26, emoji: "🇺🇸", color: "from-red-400 to-blue-600", light: "bg-red-50 border-red-200 text-red-700", countries: ["us"] },
  { id: 16, name: "Cinco de Mayo", month: 5, day: 5, emoji: "🌮", color: "from-green-400 to-yellow-500", light: "bg-green-50 border-green-200 text-green-700", countries: ["us", "mx"] },
  // JUNE
  { id: 17, name: "Father's Day", month: 6, day: 15, emoji: "👨", color: "from-blue-400 to-cyan-600", light: "bg-blue-50 border-blue-200 text-blue-700", countries: ["worldwide"] },
  { id: 18, name: "Pride Month", month: 6, day: 1, emoji: "🏳️‍🌈", color: "from-rainbow-start to-rainbow-end", light: "bg-purple-50 border-purple-200 text-purple-700", countries: ["worldwide", "us", "gb"] },
  { id: 19, name: "Summer Solstice", month: 6, day: 21, emoji: "☀️", color: "from-yellow-400 to-orange-500", light: "bg-yellow-50 border-yellow-200 text-yellow-700", countries: ["worldwide"] },
  // JULY
  { id: 20, name: "4th of July", month: 7, day: 4, emoji: "🎇", color: "from-red-500 to-blue-600", light: "bg-red-50 border-red-200 text-red-700", countries: ["us"] },
  { id: 21, name: "Summer Vacation", month: 7, day: 15, emoji: "🏖️", color: "from-cyan-400 to-blue-500", light: "bg-cyan-50 border-cyan-200 text-cyan-700", countries: ["worldwide"] },
  { id: 22, name: "Bastille Day", month: 7, day: 14, emoji: "🥖", color: "from-blue-400 to-red-500", light: "bg-blue-50 border-blue-200 text-blue-700", countries: ["fr"] },
  // AUGUST
  { id: 23, name: "Back to School", month: 8, day: 15, emoji: "🎒", color: "from-orange-400 to-yellow-500", light: "bg-orange-50 border-orange-200 text-orange-700", countries: ["worldwide", "us", "gb"] },
  { id: 24, name: "Independence Day (India)", month: 8, day: 15, emoji: "🇮🇳", color: "from-orange-400 to-green-500", light: "bg-orange-50 border-orange-200 text-orange-700", countries: ["in"] },
  // SEPTEMBER
  { id: 25, name: "Labor Day", month: 9, day: 1, emoji: "👷", color: "from-gray-500 to-gray-700", light: "bg-gray-50 border-gray-200 text-gray-700", countries: ["us", "ca"] },
  { id: 26, name: "Oktoberfest", month: 9, day: 20, emoji: "🍺", color: "from-yellow-400 to-amber-600", light: "bg-yellow-50 border-yellow-200 text-yellow-700", countries: ["worldwide", "de"] },
  { id: 27, name: "Autumn Season", month: 9, day: 22, emoji: "🍂", color: "from-orange-400 to-amber-600", light: "bg-orange-50 border-orange-200 text-orange-700", countries: ["worldwide"] },
  // OCTOBER
  { id: 28, name: "Halloween", month: 10, day: 31, emoji: "🎃", color: "from-orange-500 to-black", light: "bg-orange-50 border-orange-200 text-orange-700", countries: ["worldwide", "us", "gb"] },
  { id: 29, name: "Diwali", month: 10, day: 20, emoji: "🪔", color: "from-yellow-400 to-orange-600", light: "bg-yellow-50 border-yellow-200 text-yellow-700", countries: ["worldwide", "in"] },
  { id: 30, name: "World Mental Health Day", month: 10, day: 10, emoji: "🧠", color: "from-teal-400 to-cyan-600", light: "bg-teal-50 border-teal-200 text-teal-700", countries: ["worldwide"] },
  // NOVEMBER
  { id: 31, name: "Thanksgiving", month: 11, day: 27, emoji: "🦃", color: "from-amber-500 to-orange-600", light: "bg-amber-50 border-amber-200 text-amber-700", countries: ["us", "ca"] },
  { id: 32, name: "Black Friday", month: 11, day: 28, emoji: "🛍️", color: "from-gray-800 to-black", light: "bg-gray-50 border-gray-200 text-gray-700", countries: ["worldwide"] },
  { id: 33, name: "Veterans Day", month: 11, day: 11, emoji: "🎖️", color: "from-red-500 to-blue-600", light: "bg-red-50 border-red-200 text-red-700", countries: ["us"] },
  // DECEMBER
  { id: 34, name: "Christmas", month: 12, day: 25, emoji: "🎄", color: "from-red-500 to-green-600", light: "bg-red-50 border-red-200 text-red-700", countries: ["worldwide"] },
  { id: 35, name: "Hanukkah", month: 12, day: 15, emoji: "🕎", color: "from-blue-400 to-indigo-600", light: "bg-blue-50 border-blue-200 text-blue-700", countries: ["worldwide", "us"] },
  { id: 36, name: "New Year's Eve", month: 12, day: 31, emoji: "🥂", color: "from-yellow-400 to-purple-600", light: "bg-yellow-50 border-yellow-200 text-yellow-700", countries: ["worldwide"] },
  { id: 37, name: "Winter Season", month: 12, day: 1, emoji: "❄️", color: "from-blue-300 to-cyan-500", light: "bg-blue-50 border-blue-200 text-blue-700", countries: ["worldwide"] },
];

const COUNTRIES = [
  { value: "worldwide", label: "🌍 Worldwide" },
  { value: "us", label: "🇺🇸 United States" },
  { value: "gb", label: "🇬🇧 United Kingdom" },
  { value: "au", label: "🇦🇺 Australia" },
  { value: "ca", label: "🇨🇦 Canada" },
  { value: "de", label: "🇩🇪 Germany" },
  { value: "fr", label: "🇫🇷 France" },
  { value: "in", label: "🇮🇳 India" },
  { value: "cn", label: "🇨🇳 China" },
  { value: "sg", label: "🇸🇬 Singapore" },
  { value: "mx", label: "🇲🇽 Mexico" },
  { value: "ie", label: "🇮🇪 Ireland" },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── Days until event ──────────────────────────────────────────────────────
function daysUntil(month, day) {
  const now = new Date();
  const currentYear = now.getFullYear();
  let eventDate = new Date(currentYear, month - 1, day);
  if (eventDate < now) eventDate = new Date(currentYear + 1, month - 1, day);
  return Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
}

// ─── Ideas Panel ───────────────────────────────────────────────────────────
function IdeasPanel({ event, onClose }) {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateIdeas = async () => {
    setLoading(true);
    setError('');
    setIdeas(null);
    try {
      const response = await fetch('https://stock-topic-finder-backend-production.up.railway.app/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: event.name, max_results: 20 }),
      });
      const data = await response.json();
      if (data.topics && data.topics.length > 0) {
        setIdeas(data.topics.slice(0, 20));
      } else {
        setError('No ideas returned. Try again.');
      }
    } catch (e) {
      setError('Failed to generate ideas. Make sure the backend is running and API key is set.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { generateIdeas(); }, []);

  const copyAll = () => {
    if (!ideas) return;
    const text = ideas.map((idea, i) => `${i + 1}. ${idea.topic}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${event.color} p-5 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{event.emoji}</span>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">{event.name}</h2>
              <p className="text-white/80 text-xs mt-0.5">Adobe Stock topic ideas</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin" style={{ borderWidth: 3 }} />
              <p className="text-sm text-gray-500">Generating 20 topic ideas for <strong>{event.name}</strong>...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
              {error}
              <button onClick={generateIdeas} className="ml-3 text-red-600 underline">Retry</button>
            </div>
          )}

          {ideas && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500"><span className="font-semibold text-gray-800">{ideas.length} topics</span> generated for Adobe Stock</p>
                <button onClick={copyAll} className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 font-medium">
                  {copied ? <><Check size={13} className="text-green-500" />Copied!</> : <><Copy size={13} />Copy All</>}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {ideas.map((idea, i) => (
                  <div key={idea.id || i} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 rounded-xl transition-all group cursor-default">
                    <span className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-800 flex-1">{idea.topic}</span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold text-white ${idea.opportunity_score >= 80 ? 'bg-green-500' : idea.opportunity_score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}>
                        {idea.opportunity_score}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${idea.competition === 'Low' ? 'bg-green-50 border-green-200 text-green-700' : idea.competition === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        {idea.competition}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <button onClick={generateIdeas} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <Sparkles size={12} /> Regenerate ideas
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Event Card ────────────────────────────────────────────────────────────
function EventCard({ event, onClick }) {
  const days = daysUntil(event.month, event.day);
  const isThisMonth = event.month === new Date().getMonth() + 1;
  const isSoon = days <= 30;

  return (
    <div
      onClick={() => onClick(event)}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer group hover:-translate-y-0.5"
    >
      {/* Gradient top bar */}
      <div className={`h-2 bg-gradient-to-r ${event.color}`} />

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{event.emoji}</span>
          {isSoon && (
            <span className="text-xs px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-full font-semibold animate-pulse">
              Soon
            </span>
          )}
          {isThisMonth && !isSoon && (
            <span className="text-xs px-2 py-0.5 bg-primary-50 border border-primary-200 text-primary rounded-full font-semibold">
              This Month
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-primary transition-colors">{event.name}</h3>
        <p className="text-xs text-gray-400 mb-3">{MONTH_NAMES[event.month - 1]} {event.day}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={11} />
            <span>{days === 0 ? 'Today!' : days === 1 ? 'Tomorrow!' : `${days} days`}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <Sparkles size={11} />
            <span>Get Ideas</span>
            <ChevronRight size={11} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function SeasonalEvents() {
  const [country, setCountry] = useState('worldwide');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const currentMonth = new Date().getMonth() + 1;

  // Filter events by country & month
  const filteredEvents = ALL_EVENTS
    .filter(e => {
      const countryMatch = country === 'worldwide'
        ? e.countries.includes('worldwide')
        : e.countries.includes(country) || e.countries.includes('worldwide');
      const monthMatch = selectedMonth === 'all' || e.month === parseInt(selectedMonth);
      return countryMatch && monthMatch;
    })
    .sort((a, b) => {
      const da = daysUntil(a.month, a.day);
      const db = daysUntil(b.month, b.day);
      return da - db;
    });

  // Upcoming events (next 60 days)
  const upcomingEvents = ALL_EVENTS
    .filter(e => {
      const days = daysUntil(e.month, e.day);
      const countryMatch = country === 'worldwide'
        ? e.countries.includes('worldwide')
        : e.countries.includes(country) || e.countries.includes('worldwide');
      return days <= 60 && countryMatch;
    })
    .sort((a, b) => daysUntil(a.month, a.day) - daysUntil(b.month, b.day))
    .slice(0, 4);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Seasonal Events</h1>
        <p className="text-sm text-gray-500">Discover upcoming events and generate Adobe Stock topic ideas — auto-updated by date.</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Globe size={12} /> Country</label>
          <select className="select" value={country} onChange={e => setCountry(e.target.value)}>
            {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Calendar size={12} /> Month</label>
          <select className="select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            <option value="all">All Months</option>
            {MONTH_NAMES.map((m, i) => (
              <option key={i + 1} value={i + 1}>{m} {i + 1 === currentMonth ? '(This Month)' : ''}</option>
            ))}
          </select>
        </div>
        <div className="text-xs text-gray-400 self-end pb-2.5">
          Showing <span className="font-semibold text-gray-700">{filteredEvents.length}</span> events
        </div>
      </div>

      {/* Upcoming events highlight */}
      {selectedMonth === 'all' && upcomingEvents.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-xs">🔥</span>
            Coming Up Next 60 Days
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`bg-gradient-to-br ${event.color} p-4 rounded-2xl cursor-pointer hover:scale-105 transition-transform shadow-sm`}
              >
                <div className="text-2xl mb-2">{event.emoji}</div>
                <div className="text-white font-semibold text-sm leading-tight">{event.name}</div>
                <div className="text-white/80 text-xs mt-1">
                  {(() => { const d = daysUntil(event.month, event.day); return d === 0 ? 'Today!' : d === 1 ? 'Tomorrow!' : `${d} days away`; })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month sections */}
      {selectedMonth === 'all' ? (
        MONTH_NAMES.map((monthName, idx) => {
          const monthNum = idx + 1;
          const monthEvents = filteredEvents.filter(e => e.month === monthNum);
          if (monthEvents.length === 0) return null;
          return (
            <div key={monthNum} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-sm font-semibold text-gray-700">{monthName}</h2>
                {monthNum === currentMonth && (
                  <span className="text-xs px-2 py-0.5 bg-primary-50 border border-primary-200 text-primary rounded-full font-semibold">Current Month</span>
                )}
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">{monthEvents.length} events</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {monthEvents.map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} />)}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredEvents.map(event => <EventCard key={event.id} event={event} onClick={setSelectedEvent} />)}
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="card p-16 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="font-semibold text-gray-700 mb-2">No events found</h3>
          <p className="text-sm text-gray-400">Try changing the country or month filter.</p>
        </div>
      )}

      {/* Ideas Panel Modal */}
      {selectedEvent && (
        <IdeasPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
