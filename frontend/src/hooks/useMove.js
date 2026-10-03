/**
 * Quest Board — useMove hook
 *
 * Mutation for POST /api/move.
 * No automatic retry — state-changing actions must not be retried.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postMove } from '../api/endpoints.js';

/**
 * @param {string|null} playerName
 */
export function useMove(playerName) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!playerName) throw new Error('No player name');
      return postMove(playerName);
    },
    retry: false,
    onSuccess: () => {
      // Invalidate player state after a successful move
      queryClient.invalidateQueries({ queryKey: ['playerState', playerName] });
    },
  });
}
