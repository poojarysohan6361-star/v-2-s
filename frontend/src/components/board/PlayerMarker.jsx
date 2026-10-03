import { tileCenterPercent } from '../../game/boardGeometry.js';
import './PlayerMarker.css';

/**
 * @param {Object} props
 * @param {number} props.tile
 * @param {string} props.label
 * @param {boolean} [props.isAdmin]
 */
export function PlayerMarker({ tile, label, isAdmin }) {
  const { x, y } = tileCenterPercent(tile);

  return (
    <div
      className={`player-marker ${isAdmin ? 'player-marker--admin' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      role="img"
      aria-label={`${label} is on tile ${tile}`}
    >
      {/* Compass-pin SVG */}
      <svg
        width="20"
        height="24"
        viewBox="0 0 20 24"
        fill="none"
        className="player-marker__pin"
        aria-hidden="true"
      >
        <path
          d="M10 0C4.5 0 0 4.5 0 10c0 7.5 10 14 10 14s10-6.5 10-14C20 4.5 15.5 0 10 0z"
          fill="var(--brass-400)"
        />
        <circle cx="10" cy="10" r="4" fill="var(--ink-950)" />
        <circle cx="10" cy="10" r="2" fill="var(--brass-400)" />
      </svg>
      {isAdmin && (
        <span className="player-marker__label">{label}</span>
      )}
    </div>
  );
}
