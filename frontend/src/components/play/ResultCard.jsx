import { Check, X, ArrowLeft, ArrowRight } from 'lucide-react';
import './ResultCard.css';

/**
 * @param {Object} props
 * @param {import('../../api/types.js').AnswerResponse} props.result
 * @param {() => void} props.onDismiss
 */
export function ResultCard({ result, onDismiss }) {
  if (!result) return null;

  const isCorrect = result.outcome === 'correct';

  return (
    <div className={`result-card ${isCorrect ? 'result-card--correct' : 'result-card--wrong'}`} role="alert">
      <div className="result-card__header">
        {isCorrect ? <Check size={24} aria-hidden="true" /> : <X size={24} aria-hidden="true" />}
        <h3 className="result-card__title">
          {isCorrect ? 'Correct!' : 'Wrong'}
        </h3>
      </div>

      <div className="result-card__body">
        {result.scoreDelta != null && (
          <p className="result-card__score tabular-nums">
            <span className={isCorrect ? 'result-card__delta--pos' : 'result-card__delta--neg'}>
              {result.scoreDelta > 0 ? '+' : ''}{result.scoreDelta}
            </span>
            {' '}points → {result.newScore}
          </p>
        )}

        {result.moveBack != null && (
          <p className="result-card__move">
            <ArrowLeft size={14} aria-hidden="true" /> Moved back {result.moveBack} tiles
          </p>
        )}

        {result.bonusForward != null && (
          <p className="result-card__move result-card__move--fwd">
            <ArrowRight size={14} aria-hidden="true" /> Bonus: moved forward {result.bonusForward} tiles
          </p>
        )}
      </div>

      <button className="btn btn--secondary result-card__dismiss" onClick={onDismiss}>
        Continue
      </button>
    </div>
  );
}
