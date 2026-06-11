import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TopicFinder from './pages/TopicFinder';
import SavedTopics from './pages/SavedTopics';
import History from './pages/History';
import ApiSettings from './pages/ApiSettings';
import { SettingsPage, AboutPage } from './pages/SettingsAbout';

export default function App() {
  const [page, setPage] = useState('topic-finder');
  const [savedCount, setSavedCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');

  const navigateToSearch = (keyword) => {
    setSearchKeyword(keyword);
    setPage('topic-finder');
  };

  const pages = {
    'dashboard': <Dashboard onNavigate={setPage} />,
    'topic-finder': (
      <TopicFinder
        key={searchKeyword}
        initialKeyword={searchKeyword}
        onSaveSuccess={() => setSavedCount(c => c + 1)}
      />
    ),
    'saved-topics': <SavedTopics key={savedCount} onSearchTopic={navigateToSearch} />,
    'history': <History onNavigate={setPage} onSearchTopic={navigateToSearch} />,
    'api-settings': <ApiSettings />,
    'settings': <SettingsPage />,
    'about': <AboutPage />,
  };

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar activePage={page} onNavigate={(p) => { if (p !== 'topic-finder') setSearchKeyword(''); setPage(p); }} />
      <main className="flex-1 ml-[248px] p-8 min-h-screen">
        <div className="max-w-5xl">
          {pages[page] || pages['topic-finder']}
        </div>
      </main>
    </div>
  );
}
