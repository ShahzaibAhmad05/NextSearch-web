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

// Utilities (for internal use)
export { buildUrl, isNetworkError, parseResponseBody, formatErrorMessage } from './utils';
