/**
 * Quest Board — usePlayerState hook
 *
 * Fetches player state via TanStack Query.
 * 404 is treated as a meaningful state (no active run), not an error.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchPlayerState } from '../api/endpoints.js';
import { ApiError } from '../api/errors.js';

/**
 * @param {string|null} playerName
 * @param {Object} [options]
 * @param {boolean} [options.enabled]
 */
export function usePlayerState(playerName, options = {}) {
  return useQuery({
    queryKey: ['playerState', playerName],
    queryFn: async () => {
      try {
        return await fetchPlayerState(/** @type {string} */ (playerName));
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          // 404 means no active run — return null as a valid state
          return null;
        }
        throw err;
      }
    },
    enabled: !!playerName && options.enabled !== false,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}
