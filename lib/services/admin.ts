// lib/services/admin.ts

/**
 * Admin authentication service functions
 */

import { API_CONFIG } from '../constants';
import { ApiError } from '../types';
import { buildUrl, isNetworkError } from './utils';

const ADMIN_TOKEN_KEY = 'nextsearch-admin-token';
const ADMIN_TOKEN_EXPIRY_KEY = 'nextsearch-admin-token-expiry';
/** Token expires after 1 hour (in milliseconds) */
const TOKEN_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour

export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  token: string;
  expires_in: number; // seconds
}

export interface VerifyResponse {
  valid: boolean;
  expires_at?: number; // timestamp in milliseconds
}

/**
 * Login with admin password and receive JWT token
 *
 * @param password - Admin password
 * @returns Login response with JWT token
 * @throws ApiError on failure
 */
export async function login(password: string): Promise<LoginResponse> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.ADMIN_LOGIN);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      if (res.status === 401 || res.status === 403) {
        throw new ApiError(
          'Invalid admin password',
          res.status,
          API_CONFIG.ENDPOINTS.ADMIN_LOGIN
        );
      }
      throw new ApiError(
        `Login failed (${res.status}): ${text}`,
        res.status,
        API_CONFIG.ENDPOINTS.ADMIN_LOGIN
      );
    }

    const data = (await res.json()) as LoginResponse;

    // Store token with expiry (use server's expires_in or default to 1 hour)
    const expiryMs = Date.now() + (data.expires_in ? data.expires_in * 1000 : TOKEN_EXPIRY_TIME);
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    localStorage.setItem(ADMIN_TOKEN_EXPIRY_KEY, expiryMs.toString());

    // Trigger storage event for same-tab detection
    window.dispatchEvent(new Event('storage'));

    return data;
  } catch (err) {
    if (isNetworkError(err)) {
      throw new ApiError(
        'Failed to connect to the backend for admin login.',
        undefined,
        API_CONFIG.ENDPOINTS.ADMIN_LOGIN
      );
    }
    throw err;
  }
}

/**
 * Logout and clear stored token
 *
 * @returns Promise that resolves when logout is complete
 * @throws ApiError on failure
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  // Clear local storage first
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);

  // Trigger storage event for same-tab detection
  window.dispatchEvent(new Event('storage'));

  if (!token) {
    return; // Nothing to logout
  }

  const url = buildUrl(API_CONFIG.ENDPOINTS.ADMIN_LOGOUT);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      // Log but don't throw - local storage already cleared
      console.warn(`Logout failed (${res.status})`);
    }
  } catch (err) {
    // Log but don't throw - local storage already cleared
    console.warn('Failed to notify backend of logout:', err);
  }
}

/**
 * Verify if the current token is still valid on the backend
 *
 * @returns Verification response indicating if token is valid
 * @throws ApiError on failure
 */
export async function verifyToken(): Promise<VerifyResponse> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const expiry = localStorage.getItem(ADMIN_TOKEN_EXPIRY_KEY);

  // Check local expiry first
  if (!token || !expiry || Date.now() >= parseInt(expiry, 10)) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);
    return { valid: false };
  }

  const url = buildUrl(API_CONFIG.ENDPOINTS.ADMIN_VERIFY);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      // Token is invalid on backend
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);
      window.dispatchEvent(new Event('storage'));
      return { valid: false };
    }

    const data = (await res.json()) as VerifyResponse;

    // Update expiry if server provides new expiry time
    if (data.expires_at) {
      localStorage.setItem(ADMIN_TOKEN_EXPIRY_KEY, data.expires_at.toString());
    }

    return data;
  } catch (err) {
    if (isNetworkError(err)) {
      throw new ApiError(
        'Failed to connect to the backend for token verification.',
        undefined,
        API_CONFIG.ENDPOINTS.ADMIN_VERIFY
      );
    }
    throw err;
  }
}

/**
 * Get the current admin token if available and not expired
 *
 * @returns The JWT token or null if not authenticated
 */
export function getAdminToken(): string | null {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const expiry = localStorage.getItem(ADMIN_TOKEN_EXPIRY_KEY);

  if (token && expiry && Date.now() < parseInt(expiry, 10)) {
    return token;
  }

  // Token is expired or doesn't exist
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);
  return null;
}
