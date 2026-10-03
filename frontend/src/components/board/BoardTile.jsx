import { tileToGridCSS } from '../../game/boardGeometry.js';
import { TILE_TYPE_META } from '../../config/rulesMirror.js';
import {
  Flag, HelpCircle, Swords, Gem, Sparkles, Shield, Crown, Eye
} from 'lucide-react';
import './BoardTile.css';

const ICON_MAP = {
  start: Flag,
  question: HelpCircle,
  encounter: Swords,
  treasure: Gem,
  portal: Sparkles,
  checkpoint: Shield,
  final_checkpoint: Crown,
};

/**
 * @param {Object} props
 * @param {number} props.number
 * @param {string|null} props.type
 * @param {boolean} props.isRevealed
 * @param {boolean} props.isCurrent
 */
export function BoardTile({ number, type, isRevealed, isCurrent }) {
  const { gridRow, gridCol } = tileToGridCSS(number);
  const meta = type ? TILE_TYPE_META[type] : null;
  const IconComponent = type ? (ICON_MAP[type] || Eye) : null;

  const ariaLabel = isRevealed && meta
    ? `Tile ${number}, revealed: ${meta.label}`
    : `Tile ${number}, unrevealed`;

  return (
    <div
      role="listitem"
      aria-label={ariaLabel}
      aria-current={isCurrent ? 'step' : undefined}
      className={[
        'board-tile',
        isRevealed ? 'board-tile--revealed' : 'board-tile--hidden',
        isCurrent ? 'board-tile--current' : '',
        type ? `board-tile--${type}` : '',
      ].filter(Boolean).join(' ')}
      style={{ gridRow, gridColumn: gridCol }}
      data-tile={number}
    >
      <span className="board-tile__number tabular-nums">{number}</span>
      {isRevealed && IconComponent && (
        <IconComponent
          size={16}
          className="board-tile__icon"
          aria-hidden="true"
        />
      )}
      {isRevealed && meta && (
        <span className="board-tile__label">{meta.label}</span>
      )}
      {!isRevealed && (
        <div className="board-tile__fog" aria-hidden="true" />
      )}
    </div>
  );
}
