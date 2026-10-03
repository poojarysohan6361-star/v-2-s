/**
 * Quest Board — API Endpoints
 *
 * Thin wrappers around apiFetch for each backend endpoint.
 * No component should construct API URLs directly.
 */

import { apiFetch } from './client.js';

/* ── Health ── */

/** @returns {Promise<import('./types.js').HealthResponse>} */
export function fetchHealth() {
  return apiFetch('/api/health');
}

/* ── Move ── */

/**
 * @param {string} playerName
 * @returns {Promise<import('./types.js').MoveResponse>}
 */
export function postMove(playerName) {
  return apiFetch('/api/move', {
    method: 'POST',
    body: { playerName },
  });
}

/**
 * @param {string} playerName
 * @returns {Promise<import('./types.js').PlayerState>}
 */
export function fetchPlayerState(playerName) {
  const encoded = encodeURIComponent(playerName);
  return apiFetch(`/api/move/state/${encoded}`);
}

/* ── Answer ── */

/**
 * @param {string} playerName
 * @param {boolean} answer
 * @returns {Promise<import('./types.js').AnswerResponse>}
 */
export function postAnswer(playerName, answer) {
  return apiFetch('/api/answer', {
    method: 'POST',
    body: { playerName, answer },
  });
}

/* ── Leaderboard ── */

/** @returns {Promise<import('./types.js').LeaderboardResponse>} */
export function fetchLeaderboard() {
  return apiFetch('/api/leaderboard');
}

/* ── Admin ── */

/**
 * @param {string} adminKey
 * @returns {Promise<import('./types.js').AdminDashboardResponse>}
 */
export function fetchAdminDashboard(adminKey) {
  return apiFetch('/api/admin/dashboard', { adminKey });
}

/**
 * @param {string} adminKey
 * @returns {Promise<import('./types.js').ForceEndResponse>}
 */
export function postForceEnd(adminKey) {
  return apiFetch('/api/admin/force-end', {
    method: 'POST',
    adminKey,
  });
}
