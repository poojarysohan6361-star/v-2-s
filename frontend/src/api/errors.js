/**
 * Quest Board — API Error Class
 */

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {boolean} isNetwork
   */
  constructor(message, status = 0, isNetwork = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetwork = isNetwork;
  }
}

/**
 * Parse an error body from the backend.
 * @param {Response} response
 * @returns {Promise<ApiError>}
 */
export async function parseApiError(response) {
  let message = `Request failed (${response.status})`;
  try {
    const body = await response.json();
    if (body && body.error) {
      message = body.error;
    }
  } catch {
    // Response body wasn't JSON — use the generic message
  }
  return new ApiError(message, response.status, false);
}

/**
 * Create a network-level ApiError.
 * @param {Error} err
 * @returns {ApiError}
 */
export function networkError(err) {
  const message = err.name === 'AbortError'
    ? 'Request timed out'
    : "Can't reach the game server";
  return new ApiError(message, 0, true);
}
