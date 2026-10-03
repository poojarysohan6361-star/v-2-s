import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePlayer } from './hooks/usePlayer.js';
import { TopNav } from './components/layout/TopNav.jsx';
import { EntryPage } from './pages/EntryPage.jsx';
import { PlayPage } from './pages/PlayPage.jsx';
import { LeaderboardPage } from './pages/LeaderboardPage.jsx';
import { RulesPage } from './pages/RulesPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import './styles/tokens.css';
import './styles/base.css';
import './components/ui/buttons.css';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 5000,
    },
  },
});

function AppContent() {
  const { playerName, setPlayerName, clearPlayer } = usePlayer();

  return (
    <div className="app">
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Persistent Navigation */}
      <TopNav playerName={playerName} onClearPlayer={clearPlayer} />

      {/* Page Content */}
      <div className="app__content">
        <Routes>
          <Route
            path="/"
            element={
              playerName ? (
                <Navigate to="/play" replace />
              ) : (
                <EntryPage onSetPlayer={setPlayerName} />
              )
            }
          />
          <Route
            path="/play"
            element={<PlayPage playerName={playerName} />}
          />
          <Route
            path="/leaderboard"
            element={<LeaderboardPage currentPlayerName={playerName} />}
          />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
