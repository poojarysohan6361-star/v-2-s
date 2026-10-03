/**
 * Quest Board — usePlayer hook
 *
 * Manages the player name in localStorage (qb.playerName).
 */
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'qb.playerName';

/**
 * @returns {{ playerName: string|null, setPlayerName: (name: string) => void, clearPlayer: () => void }}
 */
export function usePlayer() {
  const [playerName, setPlayerNameState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const setPlayerName = useCallback((/** @type {string} */ name) => {
    const trimmed = name.trim();
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      // ignore
    }
    setPlayerNameState(trimmed);
  }, []);

  const clearPlayer = useCallback(() => {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) {
        // Also clear tile cache for this player
        localStorage.removeItem(`qb.tiles.${current}`);
      }
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setPlayerNameState(null);
  }, []);

  return { playerName, setPlayerName, clearPlayer };
}
