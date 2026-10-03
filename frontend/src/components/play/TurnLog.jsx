import { ScrollText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import './TurnLog.css';

/**
 * @param {Object} props
 * @param {{ text: string, type: string }[]} props.entries
 */
export function TurnLog({ entries }) {
  const [open, setOpen] = useState(false);

  if (!entries || entries.length === 0) return null;

  return (
    <div className="turn-log">
      <button
        className="turn-log__toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="turn-log-list"
      >
        <ScrollText size={14} aria-hidden="true" />
        <span>Turn Log ({entries.length})</span>
        {open ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
      </button>

      {open && (
        <ol id="turn-log-list" className="turn-log__list" aria-label="Recent turn events">
          {entries.map((entry, i) => (
            <li key={i} className={`turn-log__entry turn-log__entry--${entry.type}`}>
              {entry.text}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
