import { MapPin, Star } from 'lucide-react';
import './HUD.css';

/**
 * @param {Object} props
 * @param {number} props.score
 * @param {number} props.currentTile
 * @param {string} props.status
 * @param {number|null} [props.scoreDelta]
 */
export function HUD({ score, currentTile, status, scoreDelta }) {
  return (
    <div className="hud" role="status" aria-label="Player status">
      <div className="hud__stat">
        <Star size={16} className="hud__icon hud__icon--score" aria-hidden="true" />
        <span className="hud__label">Score</span>
        <span className="hud__value tabular-nums">
          {score}
          {scoreDelta != null && scoreDelta !== 0 && (
            <span className={`hud__delta ${scoreDelta > 0 ? 'hud__delta--pos' : 'hud__delta--neg'}`}>
              {scoreDelta > 0 ? '+' : ''}{scoreDelta}
            </span>
          )}
        </span>
      </div>
      <div className="hud__stat">
        <MapPin size={16} className="hud__icon hud__icon--tile" aria-hidden="true" />
        <span className="hud__label">Tile</span>
        <span className="hud__value tabular-nums">{currentTile}</span>
      </div>
      <div className="hud__stat hud__stat--status">
        <span className="hud__label">Status</span>
        <span className={`hud__badge hud__badge--${status}`}>
          {status === 'in_progress' ? 'Active' : status}
        </span>
      </div>
    </div>
  );
}
