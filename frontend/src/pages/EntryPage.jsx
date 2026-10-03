import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerState } from '../hooks/usePlayerState.js';
import { useLeaderboard } from '../hooks/useLeaderboard.js';
import { Compass, ArrowRight } from 'lucide-react';
import './EntryPage.css';

/**
 * @param {Object} props
 * @param {(name: string) => void} props.onSetPlayer
 */
export function EntryPage({ onSetPlayer }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  // Preload leaderboard for finished-player check
  const { data: lbData } = useLeaderboard();

  const trimmed = name.trim();
  const isValid = trimmed.length >= 2 && trimmed.length <= 24;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || checking) return;

    setChecking(true);
    setError('');

    try {
      // Import fetchPlayerState directly to avoid hook usage in handler
      const { fetchPlayerState } = await import('../api/endpoints.js');
      let state = null;
      try {
        state = await fetchPlayerState(trimmed);
      } catch (err) {
        if (err.status !== 404) {
          setError(err.message || 'Could not reach the server');
          setChecking(false);
          return;
        }
        // 404: no active run
      }

      if (state) {
        // Active run exists — go to play
        onSetPlayer(trimmed);
        navigate('/play');
      } else {
        // No active run — check leaderboard for finished player
        const onLeaderboard = lbData?.leaderboard?.some(
          e => e.playerName === trimmed
        );
        if (onLeaderboard) {
          setError('This player has already finished their run.');
          setChecking(false);
          return;
        }
        // New player — go to play (not-started state)
        onSetPlayer(trimmed);
        navigate('/play');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setChecking(false);
    }
  };

  return (
    <main className="entry-page" id="main-content">
      <div className="entry-page__card">
        <div className="entry-page__hero">
          <Compass size={40} className="entry-page__compass" aria-hidden="true" />
          <h1 className="entry-page__title">Quest Board</h1>
          <p className="entry-page__subtitle">
            Roll the dice. Discover hidden tiles. Face the final trial.
          </p>
        </div>

        <form className="entry-page__form" onSubmit={handleSubmit}>
          <label htmlFor="player-name" className="entry-page__label">
            Player Name
          </label>
          <input
            id="player-name"
            type="text"
            className="entry-page__input"
            placeholder="Enter your name (2-24 chars)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            autoComplete="off"
            autoFocus
          />
          {error && (
            <p className="entry-page__error" role="alert">{error}</p>
          )}
          <button
            type="submit"
            className="btn btn--primary btn--lg btn--full"
            disabled={!isValid || checking}
          >
            {checking ? 'Checking…' : 'Enter the Board'}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>

        <p className="entry-page__hint">
          Names are case-sensitive. Your progress saves automatically.
        </p>
      </div>
    </main>
  );
}
