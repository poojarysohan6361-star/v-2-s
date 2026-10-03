import { Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './WinScreen.css';

/**
 * @param {Object} props
 * @param {number} props.finalScore
 * @param {string} props.message
 */
export function WinScreen({ finalScore, message }) {
  return (
    <div className="win-screen" role="alert" aria-label="Quest completed">
      <div className="win-screen__trophy">
        <Trophy size={48} aria-hidden="true" />
      </div>
      <h2 className="win-screen__title">Quest Complete!</h2>
      <p className="win-screen__message">{message}</p>
      <p className="win-screen__score">
        Final Score: <span className="tabular-nums">{finalScore}</span>
      </p>
      <Link to="/leaderboard" className="btn btn--primary win-screen__link">
        <Trophy size={16} aria-hidden="true" />
        View Standings
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
