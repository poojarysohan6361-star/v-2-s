/**
 * Quest Board — useTileLog hook
 *
 * Caches discovered tile types in localStorage per player.
 * Key: qb.tiles.<playerName>
 * Format: { [tileNumber]: { type, ...extra } }
 */
import { useCallback, useMemo } from 'react';

const PREFIX = 'qb.tiles.';

/**
 * @param {string|null} playerName
 */
export function useTileLog(playerName) {
  /**
   * Read the full cache for the current player.
   * @returns {Record<number, { type: string }>}
   */
  const readCache = useCallback(() => {
    if (!playerName) return {};
    try {
      const raw = localStorage.getItem(`${PREFIX}${playerName}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, [playerName]);

  /**
   * Write a tile entry to the cache.
   * @param {number} tileNumber
   * @param {{ type: string, [key: string]: any }} data
   */
  const writeTile = useCallback((tileNumber, data) => {
    if (!playerName) return;
    try {
      const cache = readCache();
      cache[tileNumber] = data;
      localStorage.setItem(`${PREFIX}${playerName}`, JSON.stringify(cache));
    } catch {
      // localStorage might be full or blocked
    }
  }, [playerName, readCache]);

  /**
   * Get cached type for a specific tile.
   * @param {number} tileNumber
   * @returns {{ type: string } | null}
   */
  const getTile = useCallback((tileNumber) => {
    const cache = readCache();
    return cache[tileNumber] || null;
  }, [readCache]);

  /**
   * Clear the cache for the current player.
   */
  const clearCache = useCallback(() => {
    if (!playerName) return;
    try {
      localStorage.removeItem(`${PREFIX}${playerName}`);
    } catch {
      // ignore
    }
  }, [playerName]);

  return useMemo(() => ({
    readCache,
    writeTile,
    getTile,
    clearCache
  }), [readCache, writeTile, getTile, clearCache]);
}
