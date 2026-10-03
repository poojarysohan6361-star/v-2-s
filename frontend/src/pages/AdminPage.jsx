import { useState, useEffect } from 'react';
import { useAdminDashboard } from '../hooks/useAdminDashboard.js';
import { postForceEnd } from '../api/endpoints.js';
import { Board } from '../components/board/Board.jsx';
import { ShieldAlert, Key, RefreshCw, AlertTriangle, Users, Power, Lock } from 'lucide-react';
import './AdminPage.css';

const SESSION_KEY = 'qb.adminKey';

export function AdminPage() {
  const [adminKey, setAdminKey] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) || '';
    } catch {
      return '';
    }
  });

  const [inputKey, setInputKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [confirmForceEnd, setConfirmForceEnd] = useState(false);
  const [forceEnding, setForceEnding] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const dashboardQuery = useAdminDashboard(adminKey);

  const handleSaveKey = (e) => {
    e.preventDefault();
    const trimmed = inputKey.trim();
    if (!trimmed) {
      setKeyError('Please enter an admin API key.');
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, trimmed);
    } catch {
      // ignore
    }
    setAdminKey(trimmed);
    setKeyError('');
  };

  const handleLogoutAdmin = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setAdminKey('');
    setInputKey('');
  };

  const handleForceEndRuns = async () => {
    if (!adminKey || forceEnding) return;

    setForceEnding(true);
    setActionMessage('');

    try {
      const res = await postForceEnd(adminKey);
      setActionMessage(res.message || 'Successfully ended all active runs.');
      setConfirmForceEnd(false);
      dashboardQuery.refetch();
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setForceEnding(false);
    }
  };

  // If not authenticated via key
  if (!adminKey) {
    return (
      <main className="admin-page admin-page--login" id="main-content">
        <div className="admin-card admin-card--auth">
          <div className="admin-hero">
            <Lock size={36} className="admin-hero-icon" aria-hidden="true" />
            <h1 className="admin-title">Host Controls</h1>
            <p className="admin-subtitle">Enter host API key to access god view & game control</p>
          </div>

          <form onSubmit={handleSaveKey} className="admin-form">
            <label htmlFor="admin-key" className="admin-label">
              Admin API Key
            </label>
            <input
              id="admin-key"
              type="password"
              className="admin-input"
              placeholder="Enter host API key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              autoComplete="off"
              autoFocus
            />
            {keyError && <p className="admin-error" role="alert">{keyError}</p>}
            <button type="submit" className="btn btn--primary btn--full">
              <Key size={18} aria-hidden="true" /> Access Admin Console
            </button>
          </form>
        </div>
      </main>
    );
  }

  const data = dashboardQuery.data;
  const players = data?.players || [];

  return (
    <main className="admin-page" id="main-content">
      <div className="admin-container">
        <header className="admin-header">
          <div className="admin-header__title-group">
            <ShieldAlert size={32} className="admin-header-icon" aria-hidden="true" />
            <div>
              <h1 className="admin-title">Game Master Control Panel</h1>
              <p className="admin-subtitle">Live board monitoring & player management</p>
            </div>
          </div>

          <div className="admin-header__actions">
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => dashboardQuery.refetch()}
              disabled={dashboardQuery.isRefetching}
            >
              <RefreshCw
                size={16}
                className={dashboardQuery.isRefetching ? 'spin-icon' : ''}
                aria-hidden="true"
              />
              Refresh
            </button>
            <button className="btn btn--secondary btn--sm" onClick={handleLogoutAdmin}>
              Exit Admin
            </button>
          </div>
        </header>

        {actionMessage && (
          <div className="admin-banner" role="status">
            <p>{actionMessage}</p>
          </div>
        )}

        {dashboardQuery.isLoading ? (
          <div className="admin-loading">
            <RefreshCw size={28} className="spin-icon" aria-hidden="true" />
            <p>Loading Game Master dashboard…</p>
          </div>
        ) : dashboardQuery.isError ? (
          <div className="admin-card admin-card--error" role="alert">
            <AlertTriangle size={32} aria-hidden="true" />
            <p>{dashboardQuery.error?.message || 'Unauthorized or invalid API key.'}</p>
            <button className="btn btn--secondary btn--sm" onClick={handleLogoutAdmin}>
              Re-enter API Key
            </button>
          </div>
        ) : (
          <div className="admin-grid">
            {/* Left: God View Board */}
            <section className="admin-section">
              <h2 className="admin-section__title">
                God View — All Active Players on Board
              </h2>
              <div className="admin-board-wrapper">
                <Board
                  currentTile={1}
                  playerName="Admin"
                  revealedTiles={{}}
                  allPlayers={players}
                  isAdmin={true}
                />
              </div>
            </section>

            {/* Right: Player Controls & Actions */}
            <section className="admin-section">
              <div className="admin-card admin-card--controls">
                <h2 className="admin-section__title">
                  <Power size={20} aria-hidden="true" /> Host Controls
                </h2>

                <div className="admin-action-box">
                  <h3>End Event / Force End Runs</h3>
                  <p>
                    Ends all current player runs, marking active players as finished.
                  </p>

                  {!confirmForceEnd ? (
                    <button
                      className="btn btn--danger"
                      onClick={() => setConfirmForceEnd(true)}
                    >
                      <Power size={18} aria-hidden="true" /> Force End All Runs
                    </button>
                  ) : (
                    <div className="admin-confirm-box">
                      <p className="admin-confirm-warning">
                        <AlertTriangle size={16} aria-hidden="true" />
                        Are you sure? This cannot be undone!
                      </p>
                      <div className="admin-confirm-btns">
                        <button
                          className="btn btn--danger"
                          onClick={handleForceEndRuns}
                          disabled={forceEnding}
                        >
                          {forceEnding ? 'Ending…' : 'Yes, End All Runs'}
                        </button>
                        <button
                          className="btn btn--secondary"
                          onClick={() => setConfirmForceEnd(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Player List */}
              <div className="admin-card">
                <h2 className="admin-section__title">
                  <Users size={20} aria-hidden="true" /> Active Adventurers ({players.length})
                </h2>

                {players.length === 0 ? (
                  <p className="admin-empty">No active players on the board.</p>
                ) : (
                  <ul className="admin-player-list">
                    {players.map((p) => (
                      <li key={p.playerName} className="admin-player-item">
                        <div className="admin-player-info">
                          <span className="admin-player-name">{p.playerName}</span>
                          <span className="admin-player-stat">
                            Tile {p.currentTile} • {p.score} pts
                          </span>
                        </div>
                        <div className="admin-player-tags">
                          {p.promptAnswer && (
                            <span className="admin-tag admin-tag--pending">Pending Q</span>
                          )}
                          <span className={`admin-tag admin-tag--${p.status || 'active'}`}>
                            {p.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
