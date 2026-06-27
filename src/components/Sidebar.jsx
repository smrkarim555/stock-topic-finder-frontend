import { LayoutDashboard, Search, Bookmark, History, Key, Settings, Info, Zap, CalendarDays, Globe } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'topic-finder', label: 'Topic Finder', icon: Search },
  { id: 'market-analyzer', label: 'Market Analyzer', icon: Globe },
  { id: 'seasonal-events', label: 'Seasonal Events', icon: CalendarDays },
  { id: 'saved-topics', label: 'Saved Topics', icon: Bookmark },
  { id: 'history', label: 'History', icon: History },
  { id: 'api-settings', label: 'API Settings', icon: Key },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About', icon: Info },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { settings } = useSettings();

  return (
    <aside className="w-[248px] min-h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 bottom-0 z-10">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm leading-tight">Stock Topic Finder</div>
            <div className="text-xs text-gray-400 leading-tight mt-0.5">Find profitable topics</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className={`sidebar-item ${activePage === id ? 'active' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon size={17} />
            <span>{label}</span>
          </div>
        ))}
      </nav>

      {/* API Status Card */}
      <div className="px-3 pb-4">
        <div className="card p-3.5">
          <div className="flex items-center gap-2 mb-2.5">
            <div className={`w-2 h-2 rounded-full ${settings?.has_api_key ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-xs font-semibold text-gray-600">API Status</span>
          </div>
          <div className={`text-xs font-medium mb-1 ${settings?.has_api_key ? 'text-green-600' : 'text-gray-400'}`}>
            {settings?.has_api_key ? '● Connected' : '○ Not connected'}
          </div>
          <div className="text-xs font-semibold text-gray-700 mb-0.5">Groq API</div>
          <div className="text-xs text-gray-400 font-mono mb-3 truncate">
            {settings?.has_api_key ? settings.masked_key : 'No key set'}
          </div>
          <button
            onClick={() => onNavigate('api-settings')}
            className="w-full text-xs py-1.5 px-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors font-medium"
          >
            {settings?.has_api_key ? 'Change API Key' : 'Add API Key'}
          </button>
        </div>
      </div>
    </aside>
  );
}
