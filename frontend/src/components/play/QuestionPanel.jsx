import { useState } from 'react';
import { QUESTION_STAKES } from '../../config/rulesMirror.js';
import { HOST_MESSAGE, getQuestion } from '../../config/questionSource.js';
import { HelpCircle, Crown, Check, X, SkipForward } from 'lucide-react';
import './QuestionPanel.css';

/**
 * @param {Object} props
 * @param {string} props.difficulty
 * @param {number} props.tileNumber
 * @param {boolean} props.isSubmitting
 * @param {(answer: boolean) => void} props.onAnswer
 * @param {{ text?: string, options?: string[] }} [props.question] - Future: server-provided question
 */
export function QuestionPanel({ difficulty, tileNumber, isSubmitting, onAnswer, question: questionProp }) {
  const [confirming, setConfirming] = useState(/** @type {null|'correct'|'wrong'|'skip'} */ (null));
  const stakes = QUESTION_STAKES[difficulty] || QUESTION_STAKES.easy;
  const isFinal = difficulty === 'final';
  const Icon = isFinal ? Crown : HelpCircle;

  // Try to get question from questionSource (returns null for current backend)
  const question = questionProp || getQuestion({ difficulty, tileNumber });

  const handleAction = (/** @type {'correct'|'wrong'|'skip'} */ action) => {
    if (confirming === action) {
      // Confirmed — submit
      setConfirming(null);
      if (action === 'correct') onAnswer(true);
      else onAnswer(false); // wrong & skip both send false
    } else {
      setConfirming(action);
    }
  };

  const cancel = () => setConfirming(null);

  return (
    <div className="question-panel" role="region" aria-label="Question panel">
      <div className="question-panel__header">
        <Icon size={20} className="question-panel__icon" aria-hidden="true" />
        <h3 className="question-panel__title">
          {isFinal ? 'The Final Trial' : `${stakes.label} Question`}
        </h3>
        <span className="question-panel__tile tabular-nums">Tile {tileNumber}</span>
      </div>

      <div className="question-panel__stakes">
        <span className="question-panel__stake question-panel__stake--pos">
          <Check size={14} aria-hidden="true" /> {stakes.correct}
        </span>
        <span className="question-panel__stake question-panel__stake--neg">
          <X size={14} aria-hidden="true" /> {stakes.wrong}
        </span>
      </div>

      {difficulty === 'hard' && (
        <p className="question-panel__note">
          Wrong answers on hard questions may also move you back.
        </p>
      )}

      <div className="question-panel__host">
        {question?.text ? (
          <p className="question-panel__question-text">{question.text}</p>
        ) : (
          <p className="question-panel__host-msg">{HOST_MESSAGE}</p>
        )}
      </div>

      {question?.options && (
        <div className="question-panel__options">
          {question.options.map((opt, i) => (
            <button key={i} className="btn btn--secondary question-panel__option" disabled>
              {opt}
            </button>
          ))}
        </div>
      )}

      <div className="question-panel__actions">
        <button
          className="btn btn--primary"
          onClick={() => handleAction('correct')}
          onBlur={() => confirming === 'correct' && cancel()}
          disabled={isSubmitting}
          aria-label={confirming === 'correct' ? 'Confirm correct answer' : 'Mark as correct'}
        >
          <Check size={16} aria-hidden="true" />
          {confirming === 'correct' ? 'Confirm Correct' : 'Correct'}
        </button>

        <button
          className="btn btn--danger"
          onClick={() => handleAction('wrong')}
          onBlur={() => confirming === 'wrong' && cancel()}
          disabled={isSubmitting}
          aria-label={confirming === 'wrong' ? 'Confirm wrong answer' : 'Mark as wrong'}
        >
          <X size={16} aria-hidden="true" />
          {confirming === 'wrong' ? 'Confirm Wrong' : 'Wrong'}
        </button>

        {!isFinal && (
          <button
            className="btn btn--secondary"
            onClick={() => handleAction('skip')}
            onBlur={() => confirming === 'skip' && cancel()}
            disabled={isSubmitting}
            aria-label={confirming === 'skip' ? 'Confirm skip' : 'Skip question'}
          >
            <SkipForward size={16} aria-hidden="true" />
            {confirming === 'skip' ? 'Confirm Skip' : 'Skip'}
          </button>
        )}
      </div>

      {confirming && (
        <p className="question-panel__confirm-hint" role="status">
          Press again to confirm, or click elsewhere to cancel.
        </p>
      )}
    </div>
  );
}
