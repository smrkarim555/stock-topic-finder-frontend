import { Settings as SettingsIcon, Info, Globe, Zap } from 'lucide-react';
import { useAppPrefs } from '../hooks/useSettings';

export function SettingsPage() {
  const { prefs, update } = useAppPrefs();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-500">Application preferences and configuration.</p>
      </div>
      <div className="max-w-xl">
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <SettingsIcon size={15} className="text-primary" /> Preferences
          </h2>

          {/* Results Count */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <div className="text-sm font-medium text-gray-700">Default Results Count</div>
              <div className="text-xs text-gray-400 mt-0.5">Number of topics to generate per search</div>
            </div>
            <select
              className="select text-xs"
              value={prefs.resultsCount}
              onChange={e => update({ resultsCount: Number(e.target.value) })}
            >
              <option value={10}>10 topics</option>
              <option value={20}>20 topics</option>
              <option value={30}>30 topics</option>
              <option value={50}>50 topics</option>
            </select>
          </div>

          {/* Auto-save toggle */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <div className="text-sm font-medium text-gray-700">Auto-save searches to history</div>
              <div className="text-xs text-gray-400 mt-0.5">Automatically log all searches</div>
            </div>
            <button
              onClick={() => update({ autoSave: !prefs.autoSave })}
              className={`w-9 h-5 rounded-full relative transition-colors ${prefs.autoSave ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 shadow transition-all ${prefs.autoSave ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Default country */}
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-medium text-gray-700">Default country filter</div>
              <div className="text-xs text-gray-400 mt-0.5">Country for Google Trends data</div>
            </div>
            <select
              className="select text-xs"
              value={prefs.defaultCountry}
              onChange={e => update({ defaultCountry: e.target.value })}
            >
              <option value="worldwide">Worldwide</option>
              <option value="us">United States</option>
              <option value="gb">United Kingdom</option>
              <option value="de">Germany</option>
              <option value="jp">Japan</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3 px-1">✓ Settings save automatically</p>
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">About</h1>
        <p className="text-sm text-gray-500">Information about Stock Topic Finder.</p>
      </div>
      <div className="max-w-xl space-y-4">
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Zap size={22} className="text-white" fill="white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Stock Topic Finder</h2>
              <div className="text-xs text-gray-400">Version 1.0.0 · Adobe Stock Tool</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Stock Topic Finder helps Adobe Stock contributors discover profitable, low-competition content topics using AI-powered analysis and Google Trends data.
          </p>
          <div className="space-y-3">
            {[
              { icon: Zap, label: 'AI Engine', value: 'Groq (llama-3.3-70b)' },
              { icon: Globe, label: 'Trend Data', value: 'Google Trends API' },
              { icon: Info, label: 'Frontend', value: 'React + Vite + Tailwind CSS' },
              { icon: Info, label: 'Backend', value: 'Python FastAPI + SQLite' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Icon size={13} className="text-gray-300" />{label}</span>
                <span className="font-medium text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5 bg-gray-50/50">
          <p className="text-xs text-gray-400 leading-relaxed">
            Built for Adobe Stock contributors to maximize earnings by identifying high-demand, low-competition topics before investing time in content creation.
          </p>
        </div>
      </div>
    </div>
  );
}
