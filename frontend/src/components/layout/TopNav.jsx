import { NavLink } from 'react-router-dom';
import { ConnectionBadge } from './ConnectionBadge.jsx';
import { Compass, Trophy, Shield } from 'lucide-react';
import './TopNav.css';

/**
 * @param {{ playerName: string|null, onSwitchPlayer?: () => void, onClearPlayer?: () => void }} props
 */
export function TopNav({ playerName, onSwitchPlayer, onClearPlayer }) {
  const handleSwitch = onSwitchPlayer || onClearPlayer;
  return (
    <header className="topnav" role="banner">
      <div className="topnav__inner">
        <NavLink to="/" className="topnav__brand" aria-label="Quest Board Home">
          <Compass size={20} aria-hidden="true" />
          <span className="topnav__title">Quest Board</span>
        </NavLink>

        <nav className="topnav__links" aria-label="Main navigation">
          {playerName && (
            <NavLink to="/play" className="topnav__link">
              <Compass size={16} aria-hidden="true" />
              <span>Play</span>
            </NavLink>
          )}
          <NavLink to="/leaderboard" className="topnav__link">
            <Trophy size={16} aria-hidden="true" />
            <span>Standings</span>
          </NavLink>
          <NavLink to="/admin" className="topnav__link">
            <Shield size={16} aria-hidden="true" />
            <span>Admin</span>
          </NavLink>
        </nav>

        <div className="topnav__right">
          <ConnectionBadge />
          {playerName && (
            <button
              className="topnav__switch"
              onClick={handleSwitch}
              aria-label="Switch player"
            >
              {playerName}
              <span className="topnav__switch-icon" aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
