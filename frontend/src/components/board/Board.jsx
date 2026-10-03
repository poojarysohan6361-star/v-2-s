import { useMemo } from 'react';
import { getVisualTileOrder } from '../../game/boardGeometry.js';
import { BoardTile } from './BoardTile.jsx';
import { PlayerMarker } from './PlayerMarker.jsx';
import './Board.css';

/**
 * @param {Object} props
 * @param {number} currentTile - Player's current tile
 * @param {number[]} revealedTiles - Tile numbers that have been revealed
 * @param {Record<number, { type: string }>} tileCache - Cached tile type data
 * @param {boolean} [isAdmin] - Admin mode shows all tiles
 * @param {{ tile: number, type: string }[]} [boardLayout] - Full board layout (admin only)
 * @param {{ playerName: string, currentTile: number }[]} [adminPlayers] - All players (admin only)
 */
export function Board({ currentTile, revealedTiles, tileCache, isAdmin, boardLayout, adminPlayers }) {
  const tiles = useMemo(() => getVisualTileOrder(), []);

  const revealedSet = useMemo(() => new Set(revealedTiles || []), [revealedTiles]);

  const adminTypeMap = useMemo(() => {
    if (!boardLayout) return {};
    const map = {};
    boardLayout.forEach(t => { map[t.tile] = t.type; });
    return map;
  }, [boardLayout]);

  return (
    <div className="board" role="list" aria-label="Game board, 30 tiles in serpentine layout">
      <div className="board__grid">
        {tiles.map(tileNum => {
          const isRevealed = isAdmin || revealedSet.has(tileNum);
          const tileType = isAdmin
            ? adminTypeMap[tileNum]
            : tileCache[tileNum]?.type || null;
          const isCurrent = !isAdmin && currentTile === tileNum;

          return (
            <BoardTile
              key={tileNum}
              number={tileNum}
              type={tileType}
              isRevealed={isRevealed}
              isCurrent={isCurrent}
            />
          );
        })}

        {/* Player markers */}
        {isAdmin && adminPlayers ? (
          adminPlayers
            .filter(p => p.status === 'in_progress')
            .map(p => (
              <PlayerMarker key={p.runId} tile={p.currentTile} label={p.playerName} isAdmin />
            ))
        ) : (
          currentTile > 0 && <PlayerMarker tile={currentTile} label="You" />
        )}
      </div>
    </div>
  );
}
