import { XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './RunOverScreen.css';

/**
 * @param {Object} props
 * @param {string} props.playerName
 */
export function RunOverScreen({ playerName }) {
  return (
    <div className="run-over" role="alert" aria-label="Run is over">
      <XCircle size={40} className="run-over__icon" aria-hidden="true" />
      <h2 className="run-over__title">Run Over</h2>
      <p className="run-over__text">
        The run for <strong>{playerName}</strong> has ended.
      </p>
      <Link to="/leaderboard" className="btn btn--secondary run-over__link">
        View Standings
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
