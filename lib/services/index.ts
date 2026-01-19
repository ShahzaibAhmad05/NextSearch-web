// lib/services/index.ts

/**
 * Centralized service exports
 */

// Search APIs
export { search, suggest } from './search';

// Document APIs
export { addCordSlice } from './document';

// AI APIs
export { getAIOverview, getResultSummary } from './ai';

// Admin APIs
export { login, logout, verifyToken, getAdminToken } from './admin';
export type { LoginRequest, LoginResponse, VerifyResponse } from './admin';

// Stats APIs
export { getStats } from './stats';
export type { StatsResponse } from './stats';

// Health APIs
export { checkBackendHealth } from './health';
export type { HealthCheckResponse } from './health';

// Utilities (for internal use)
export { buildUrl, isNetworkError, parseResponseBody, formatErrorMessage } from './utils';
