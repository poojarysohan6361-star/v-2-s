/**
 * Quest Board — API Client
 *
 * Single fetch wrapper. Every API call goes through here.
 * The API base URL comes from VITE_API_BASE_URL env var.
 * Admin key is attached ONLY to admin requests via the adminKey parameter.
 */

import { ApiError, parseApiError, networkError } from './errors.js';

/** Default request timeout in ms */
const TIMEOUT_MS = 10_000;

/**
 * Resolve the API base URL.
 * - In dev, fall back to localhost:3001 if not configured.
 * - In production, require explicit configuration.
 * @returns {string}
 */
function getBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured) {
    return configured.replace(/\/+$/, '');
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }
  throw new ApiError('API base URL is not configured', 0, false);
}

/**
 * Core fetch wrapper.
 *
 * @param {string} path - API path starting with /
 * @param {Object} [options]
 * @param {'GET'|'POST'} [options.method='GET']
 * @param {Object} [options.body]
 * @param {string} [options.adminKey] - Attached as X-API-Key header
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<any>}
 * @throws {ApiError}
 */
export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, adminKey, signal: externalSignal } = options;

  const url = `${getBaseUrl()}${path}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // Combine external signal with our timeout signal
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort());
  }

  /** @type {HeadersInit} */
  const headers = { 'Content-Type': 'application/json' };
  if (adminKey) {
    headers['X-API-Key'] = adminKey;
  }

  /** @type {RequestInit} */
  const init = {
    method,
    headers,
    signal: controller.signal,
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, init);

    if (!response.ok) {
      throw await parseApiError(response);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw networkError(err);
  } finally {
    clearTimeout(timeoutId);
  }
}
