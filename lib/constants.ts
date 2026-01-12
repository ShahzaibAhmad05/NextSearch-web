// lib/constants.ts

/**
 * Application-wide constants
 * Centralized configuration for magic numbers, defaults, and settings
 */

// ─────────────────────────────────────────────────────────────────────────────
// Search Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const SEARCH_CONFIG = {
  /** Minimum query length before suggestions are fetched */
  MIN_QUERY_LENGTH: 2,

  /** Debounce delay for search suggestions (ms) */
  SUGGESTION_DEBOUNCE_MS: 180,

  /** Maximum number of suggestions to display */
  MAX_SUGGESTIONS: 5,

  /** Default number of results to fetch */
  DEFAULT_K: 100,

  /** Minimum allowed value for k */
  MIN_K: 1,

  /** Maximum allowed value for k */
  MAX_K: 1000,

  /** Debounce delay for k changes triggering re-search (ms) */
  K_CHANGE_DEBOUNCE_MS: 350,

  /** Default page size for pagination */
  DEFAULT_PAGE_SIZE: 10,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// UI Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const UI_CONFIG = {
  /** Delay before closing dropdown on blur (ms) - allows click events to fire */
  BLUR_DELAY_MS: 120,

  /** Animation stagger delay for list items (ms) */
  STAGGER_DELAY_MS: 60,

  /** Fixed navbar height for scroll offset calculations */
  NAVBAR_HEIGHT: 54,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Sort Options
// ─────────────────────────────────────────────────────────────────────────────

export const SORT_OPTIONS = [
  'Relevancy',
  'Publish Date (Newest)',
  'Publish Date (Oldest)',
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

// ─────────────────────────────────────────────────────────────────────────────
// API Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const API_CONFIG = {
  /** Base URL for API endpoints */
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE ?? '/api',

  /** API endpoints */
  ENDPOINTS: {
    SEARCH: '/search',
    SUGGEST: '/suggest',
    ADD_DOCUMENT: '/add_document',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Validation Patterns
// ─────────────────────────────────────────────────────────────────────────────

export const VALIDATION = {
  /** Regex to extract year from date string */
  YEAR_PATTERN: /\b(19\d{2}|20\d{2}|21\d{2})\b/,

  /** Allowed file extensions for document upload */
  ALLOWED_EXTENSIONS: ['.zip'] as const,

  /** Allowed MIME types for document upload */
  ALLOWED_MIME_TYPES: ['application/zip'] as const,
} as const;
