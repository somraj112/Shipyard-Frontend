/**
 * Shipyard API Client
 *
 * Centralized functions for communicating with the Shipyard Backend API.
 * All API calls go through these functions to maintain a single source
 * of truth for endpoint URLs, error handling, and auth headers.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * Generic fetch wrapper with error handling.
 */
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Health check — GET /api/health
 */
export async function getHealthStatus() {
  return apiFetch<{ status: string; service: string; timestamp: string }>('/health');
}

/**
 * Detailed health — GET /api/health/detailed
 */
export async function getDetailedHealth() {
  return apiFetch<{
    status: string;
    service: string;
    timestamp: string;
    uptime: number;
    memory: { heapUsed: string; heapTotal: string; rss: string };
    version: string;
  }>('/health/detailed');
}
