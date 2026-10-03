import { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import './Dice.css';

/**
 * @param {Object} props
 * @param {number|null} props.value - The settled dice value (1-6), or null when idle
 * @param {boolean} props.isRolling - Whether the dice is currently tumbling
 */
export function Dice({ value, isRolling }) {
  const reduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value || 1);
  const intervalRef = useRef(null);

  // Tumble animation: cycle through random values while rolling
  useEffect(() => {
    if (isRolling && !reduced) {
      intervalRef.current = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 80);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (value) setDisplayValue(value);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRolling, value, reduced]);

  // Dot positions for each face
  const dots = getDots(displayValue);

  return (
    <div
      className={`dice ${isRolling && !reduced ? 'dice--rolling' : ''}`}
      role="img"
      aria-label={isRolling ? 'Rolling dice' : `Dice showing ${displayValue}`}
    >
      <div className="dice__face">
        {dots.map((pos, i) => (
          <span
            key={i}
            className="dice__dot"
            style={{ gridArea: pos }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Returns grid area names for dot positions on a d6 face.
 * @param {number} n
 * @returns {string[]}
 */
function getDots(n) {
  switch (n) {
    case 1: return ['cc'];
    case 2: return ['tr', 'bl'];
    case 3: return ['tr', 'cc', 'bl'];
    case 4: return ['tl', 'tr', 'bl', 'br'];
    case 5: return ['tl', 'tr', 'cc', 'bl', 'br'];
    case 6: return ['tl', 'tr', 'ml', 'mr', 'bl', 'br'];
    default: return ['cc'];
  }
}
