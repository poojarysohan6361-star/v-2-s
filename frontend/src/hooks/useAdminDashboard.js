/**
 * Quest Board — useAdminDashboard hook
 *
 * Polls every 5 seconds while visible.
 * Uses sessionStorage admin key.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchAdminDashboard } from '../api/endpoints.js';

/**
 * @param {string|null} adminKey
 */
export function useAdminDashboard(adminKey) {
  return useQuery({
    queryKey: ['adminDashboard', adminKey],
    queryFn: () => {
      if (!adminKey) throw new Error('No admin key');
      return fetchAdminDashboard(adminKey);
    },
    enabled: !!adminKey,
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 3000,
  });
}
