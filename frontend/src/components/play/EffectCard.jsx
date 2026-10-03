import { TILE_TYPE_META, ENCOUNTER_LABELS } from '../../config/rulesMirror.js';
import { Gem, Sparkles, Swords, Shield, Crown } from 'lucide-react';
import './EffectCard.css';

const ICON_MAP = {
  treasure: Gem,
  portal: Sparkles,
  encounter: Swords,
  checkpoint: Shield,
  final_checkpoint: Crown,
};

/**
 * Displays the result of landing on a tile.
 * @param {Object} props
 * @param {import('../../api/types.js').TileEffect} props.effect
 * @param {() => void} props.onDismiss
 */
export function EffectCard({ effect, onDismiss }) {
  if (!effect) return null;

  const meta = TILE_TYPE_META[effect.type];
  const Icon = ICON_MAP[effect.type] || Shield;

  return (
    <div className={`effect-card effect-card--${effect.type}`} role="alert">
      <div className="effect-card__header">
        <Icon size={20} aria-hidden="true" />
        <h3 className="effect-card__title">{meta?.label || effect.type}</h3>
        <span className="effect-card__tile tabular-nums">Tile {effect.tileNumber}</span>
      </div>

      <div className="effect-card__body">
        {effect.type === 'treasure' && (
          <p className="effect-card__text">
            Found treasure! <span className="effect-card__delta effect-card__delta--pos tabular-nums">+{effect.scoreDelta}</span> points
          </p>
        )}

        {effect.type === 'portal' && (
          <p className="effect-card__text">
            Portal activated — moved {effect.direction}!
          </p>
        )}

        {effect.type === 'encounter' && (
          <p className="effect-card__text">
            {ENCOUNTER_LABELS[effect.encounterType] || 'Unknown encounter'}
            {effect.scoreDelta !== 0 && (
              <span className={`effect-card__delta ${effect.scoreDelta > 0 ? 'effect-card__delta--pos' : 'effect-card__delta--neg'} tabular-nums`}>
                {' '}{effect.scoreDelta > 0 ? '+' : ''}{effect.scoreDelta}
              </span>
            )}
          </p>
        )}

        {effect.type === 'checkpoint' && (
          <p className="effect-card__text">Safe checkpoint reached.</p>
        )}
      </div>

      {effect.type !== 'question' && effect.type !== 'final_checkpoint' && (
        <button className="effect-card__dismiss btn btn--secondary" onClick={onDismiss}>
          Continue
        </button>
      )}
    </div>
  );
}
