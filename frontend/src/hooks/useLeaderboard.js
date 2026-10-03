/**
 * Quest Board — useLeaderboard hook
 *
 * Polls every 10 seconds while the component is mounted and tab is visible.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard } from '../api/endpoints.js';

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}
