/**
 * Quest Board — useAnswer hook
 *
 * Mutation for POST /api/answer.
 * No automatic retry.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postAnswer } from '../api/endpoints.js';

/**
 * @param {string|null} playerName
 */
export function useAnswer(playerName) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (/** @type {boolean} */ answer) => {
      if (!playerName) throw new Error('No player name');
      return postAnswer(playerName, answer);
    },
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerState', playerName] });
    },
  });
}
