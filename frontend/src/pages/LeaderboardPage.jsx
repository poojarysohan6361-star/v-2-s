import { useLeaderboard } from '../hooks/useLeaderboard.js';
import { Crown, Medal, RefreshCw, Trophy, User } from 'lucide-react';
import './LeaderboardPage.css';

/**
 * @param {Object} props
 * @param {string|null} [props.currentPlayerName]
 */
export function LeaderboardPage({ currentPlayerName }) {
  const { data, isLoading, isError, refetch, isRefetching } = useLeaderboard();

  const entries = data?.leaderboard || [];

  return (
    <main className="leaderboard-page" id="main-content">
      <div className="leaderboard-page__container">
        <header className="leaderboard-page__header">
          <div className="leaderboard-page__title-group">
            <Trophy size={32} className="leaderboard-page__icon" aria-hidden="true" />
            <div>
              <h1 className="leaderboard-page__title">Leaderboard</h1>
              <p className="leaderboard-page__subtitle">
                Rankings update live as adventurers cross the board
              </p>
            </div>
          </div>
          <button
            className="btn btn--secondary btn--sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            aria-label="Refresh leaderboard"
          >
            <RefreshCw
              size={16}
              className={isRefetching ? 'spin-icon' : ''}
              aria-hidden="true"
            />
            {isRefetching ? 'Refreshing…' : 'Refresh'}
          </button>
        </header>

        {isLoading ? (
          <div className="leaderboard-page__loading">
            <RefreshCw size={28} className="spin-icon" aria-hidden="true" />
            <p>Loading rankings…</p>
          </div>
        ) : isError ? (
          <div className="leaderboard-page__error" role="alert">
            <p>Failed to load leaderboard data.</p>
            <button className="btn btn--primary btn--sm" onClick={() => refetch()}>
              Try Again
            </button>
          </div>
        ) : entries.length === 0 ? (
          <div className="leaderboard-page__empty">
            <User size={36} aria-hidden="true" />
            <p>No adventurers have set foot on the board yet.</p>
          </div>
        ) : (
          <div className="leaderboard-page__table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th scope="col" className="col-rank">Rank</th>
                  <th scope="col" className="col-player">Player</th>
                  <th scope="col" className="col-tile">Tile</th>
                  <th scope="col" className="col-score">Score</th>
                  <th scope="col" className="col-status">Status</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrent = currentPlayerName && entry.playerName === currentPlayerName;

                  return (
                    <tr
                      key={entry.playerName}
                      className={`leaderboard-row ${isCurrent ? 'leaderboard-row--current' : ''}`}
                    >
                      <td className="col-rank">
                        {rank === 1 ? (
                          <span className="rank-badge rank-1" title="1st Place">
                            <Crown size={18} aria-hidden="true" /> #1
                          </span>
                        ) : rank === 2 ? (
                          <span className="rank-badge rank-2" title="2nd Place">
                            <Medal size={16} aria-hidden="true" /> #2
                          </span>
                        ) : rank === 3 ? (
                          <span className="rank-badge rank-3" title="3rd Place">
                            <Medal size={16} aria-hidden="true" /> #3
                          </span>
                        ) : (
                          <span className="rank-number">#{rank}</span>
                        )}
                      </td>
                      <td className="col-player">
                        <span className="player-name">
                          {entry.playerName}
                          {isCurrent && (
                            <span className="you-badge" aria-label="You"> (You)</span>
                          )}
                        </span>
                      </td>
                      <td className="col-tile">
                        <span className="tile-pill">Tile {entry.currentTile ?? entry.tile ?? 1}</span>
                      </td>
                      <td className="col-score">
                        <span className="score-val">{entry.score} pts</span>
                      </td>
                      <td className="col-status">
                        <span className={`status-pill status-pill--${entry.status || 'active'}`}>
                          {entry.status === 'finished' ? 'Finished' : 'In Progress'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
