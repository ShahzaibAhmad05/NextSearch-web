# Library Code Documentation

Comprehensive documentation for all library code in the nextsearch-web project.

---

## Table of Contents

1. [Core Library Files](#core-library-files)
   - [lib/api.ts](#libapits)
   - [lib/constants.ts](#libconstantsts)
   - [lib/types.ts](#libtypests)
   - [lib/utils.ts](#libutilsts)
2. [Services Layer (lib/services/)](#services-layer)
   - [admin.ts](#libservicesadmints)
   - [ai.ts](#libservicesaits)
   - [document.ts](#libservicesdocumentts)
   - [health.ts](#libserviceshealthts)
   - [search.ts](#libservicessearchts)
   - [stats.ts](#libservicesstatsts)
   - [utils.ts](#libservicesutilsts)
   - [index.ts](#libservicesindexts)
3. [Type Definitions (lib/types/)](#type-definitions)
   - [ai.ts](#libtypesaits)
   - [components.ts](#libtypescomponentsts)
   - [document.ts](#libtypesdocumentts)
   - [errors.ts](#libtypeserrorsts)
   - [search.ts](#libtypessearchts)
   - [shared.ts](#libtypessharedts)
   - [stats.ts](#libtypesstatsts)
   - [index.ts](#libtypesindexts)
4. [Utility Functions (lib/utils/)](#utility-functions)
   - [classnames.ts](#libutilsclassnamests)
   - [date.ts](#libutilsdatets)
   - [formatting.ts](#libutilsformattingts)
   - [language.ts](#libutilslanguagets)
   - [url.ts](#libutilsurlts)
   - [index.ts](#libutilsindexts)
5. [Home Page Utils (app/(home)/utils/)](#home-page-utils)
   - [clampK.ts](#apphomeutilsclampkts)
   - [index.ts](#apphomeutilsindexts)
6. [Home Page Types (app/(home)/)](#home-page-types)
   - [types.ts](#apphometypests)

---

## Core Library Files

### lib/api.ts

**Purpose:** Re-export all API functions from the new modular structure for backward compatibility.

**Exports:**
- `search` - Search for documents
- `suggest` - Get autocomplete suggestions
- `addCordSlice` - Upload and index documents
- `getAIOverview` - Get AI-generated search overview
- `getResultSummary` - Get AI-generated result summary

**Dependencies:**
- `./services/index` - All service functions

**Implementation Details:**
This is a compatibility layer that maintains the old import structure while the actual implementations have been moved to the services directory. Allows existing code to continue importing from `lib/api.ts` without breaking changes.

---

### lib/constants.ts

**Purpose:** Application-wide constants for configuration and settings.

**Exports:**

#### SEARCH_CONFIG
Configuration for search functionality:
```typescript
{
  MIN_QUERY_LENGTH: 2,              // Minimum query length for suggestions
  SUGGESTION_DEBOUNCE_MS: 180,       // Debounce delay for suggestions
  MAX_SUGGESTIONS: 5,                // Maximum suggestions to display
  DEFAULT_K: 100,                    // Default number of results
  MIN_K: 1,                          // Minimum value for k
  MAX_K: 1000,                       // Maximum value for k
  K_CHANGE_DEBOUNCE_MS: 350,         // Debounce for k changes
  DEFAULT_PAGE_SIZE: 10,             // Results per page
}
```

#### UI_CONFIG
Configuration for UI behavior:
```typescript
{
  BLUR_DELAY_MS: 120,                // Delay before closing dropdown
  STAGGER_DELAY_MS: 60,              // Animation stagger delay
  NAVBAR_HEIGHT: 54,                 // Fixed navbar height
}
```

#### SORT_OPTIONS
Available sort options:
```typescript
['Relevancy', 'Publish Date (Newest)', 'Publish Date (Oldest)']
```

#### SortOption Type
```typescript
type SortOption = 'Relevancy' | 'Publish Date (Newest)' | 'Publish Date (Oldest)'
```

#### API_CONFIG
API configuration:
```typescript
{
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080',
  ENDPOINTS: {
    SEARCH: '/api/search',
    SUGGEST: '/api/suggest',
    ADD_DOCUMENT: '/api/add_document',
    AI_OVERVIEW: '/api/ai_overview',
    AI_SUMMARY: '/api/ai_summary',
    STATS: '/api/stats',
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_LOGOUT: '/api/admin/logout',
    ADMIN_VERIFY: '/api/admin/verify',
  }
}
```

#### VALIDATION
Validation patterns and rules:
```typescript
{
  YEAR_PATTERN: /\b(19\d{2}|20\d{2}|21\d{2})\b/,  // Extract year
  ALLOWED_EXTENSIONS: ['.zip'],                    // Allowed file types
  ALLOWED_MIME_TYPES: ['application/zip'],         // Allowed MIME types
}
```

**Implementation Details:**
- All constants are exported as `const` for immutability
- Uses TypeScript `as const` for literal types
- Centralizes magic numbers and configuration values
- Provides single source of truth for app-wide settings

---

### lib/types.ts

**Purpose:** Re-export all types from the new modular structure for backward compatibility.

**Exports:**
- `SearchResult` - Single search result
- `SearchResponse` - Search API response
- `SuggestResponse` - Suggest API response
- `AIOverviewResponse` - AI overview API response
- `ResultSummaryResponse` - AI summary API response
- `AddDocumentResponse` - Add document API response
- `SearchBarProps` - SearchBar component props
- `FeedbackModalProps` - FeedbackModal component props
- `AddDocumentModalProps` - AddDocumentModal component props
- `SearchResultsProps` - SearchResults component props
- `RecentSearch` - Recent search item
- `ApiError` - Custom error class

**Dependencies:**
- `./types/index` - All type definitions

**Implementation Details:**
Compatibility layer for type imports, allowing existing code to continue importing types from `lib/types.ts`.

---

### lib/utils.ts

**Purpose:** Re-export all utilities from the new modular structure for backward compatibility.

**Exports:**
- `cn` - Classname utility
- `formatByline` - Format author and year
- `formatFileSize` - Format bytes to human-readable
- `formatDuration` - Format milliseconds
- `safeHostname` - Extract hostname from URL
- `faviconUrl` - Generate favicon URL
- `publishTimeToMs` - Parse ISO date to milliseconds

**Dependencies:**
- `./utils/index` - All utility functions

**Implementation Details:**
Compatibility layer for utility function imports.

---

## Services Layer

### lib/services/admin.ts

**Purpose:** Admin authentication service functions for managing JWT tokens and admin access.

**Constants:**
- `ADMIN_TOKEN_KEY = 'nextsearch-admin-token'` - LocalStorage key for token
- `ADMIN_TOKEN_EXPIRY_KEY = 'nextsearch-admin-token-expiry'` - LocalStorage key for expiry
- `TOKEN_EXPIRY_TIME = 60 * 60 * 1000` - 1 hour token lifetime

**Types:**

#### LoginRequest
```typescript
interface LoginRequest {
  password: string;
}
```

#### LoginResponse
```typescript
interface LoginResponse {
  token: string;          // JWT token
  expires_in: number;     // Expiry in seconds
}
```

#### VerifyResponse
```typescript
interface VerifyResponse {
  valid: boolean;         // Token validity
  expires_at?: number;    // Expiry timestamp in ms
}
```

**Functions:**

#### login(password: string): Promise<LoginResponse>
Authenticate with admin password and receive JWT token.

**Parameters:**
- `password` - Admin password

**Returns:** Login response with JWT token

**Throws:** `ApiError` on authentication failure

**Implementation:**
- Makes POST request to `/api/admin/login`
- Stores token and expiry in localStorage
- Triggers storage event for cross-tab synchronization
- Returns 401/403 for invalid credentials

#### logout(): Promise<void>
Logout and clear stored token.

**Returns:** Promise that resolves when complete

**Implementation:**
- Clears token from localStorage first
- Triggers storage event
- Notifies backend (non-blocking)
- Doesn't throw on backend errors

#### verifyToken(): Promise<VerifyResponse>
Verify if the current token is still valid on the backend.

**Returns:** Verification response with validity status

**Throws:** `ApiError` on network failure

**Implementation:**
- Checks local expiry first
- Makes GET request to `/api/admin/verify`
- Updates expiry if server provides new value
- Clears invalid tokens automatically

#### getAdminToken(): string | null
Get the current admin token if available and not expired.

**Returns:** JWT token or null

**Implementation:**
- Checks localStorage for token and expiry
- Validates expiry time
- Auto-clears expired tokens
- Returns null if not authenticated

#### verifyAdmin(): Promise<boolean>
Verify if user is authenticated as admin.

**Returns:** true if authenticated, false otherwise

**Implementation:**
- Wraps `verifyToken()` with error handling
- Returns boolean for simple auth checks

**Dependencies:**
- `../constants` - API_CONFIG
- `../types` - ApiError
- `./utils` - buildUrl, isNetworkError

---

### lib/services/ai.ts

**Purpose:** AI-related service functions for AI overviews and summaries.

**Functions:**

#### getAIOverview(query: string, signal?: AbortSignal): Promise<AIOverviewResponse>
Get an AI-generated overview for a search query.

**Parameters:**
- `query` - Search query string
- `signal` - Optional AbortSignal for cancellation

**Returns:** AI overview response with generated summary

**Throws:** `ApiError` on failure, `AbortError` if cancelled

**Implementation:**
- Makes GET request to `/api/ai_overview`
- Includes admin token if available (for unlimited quota)
- Supports request cancellation via AbortSignal
- Returns cached results when available

#### getResultSummary(cordUid: string, signal?: AbortSignal): Promise<ResultSummaryResponse>
Get an AI-generated summary for a specific search result.

**Parameters:**
- `cordUid` - CORD-19 unique identifier
- `signal` - Optional AbortSignal for cancellation

**Returns:** Result summary response with AI summary in Markdown

**Throws:** `ApiError` on failure, `AbortError` if cancelled

**Implementation:**
- Makes GET request to `/api/ai_summary`
- Includes admin token if available
- Handles "NO_ABSTRACT_AVAILABLE" error specially
- Parses JSON error responses for detailed messages
- Returns cached results when available

**Dependencies:**
- `../constants` - API_CONFIG
- `../types` - ApiError, AIOverviewResponse, ResultSummaryResponse
- `./utils` - buildUrl, isNetworkError
- `./admin` - getAdminToken

---

### lib/services/document.ts

**Purpose:** Document management service functions for uploading and indexing documents.

**Functions:**

#### addCordSlice(cordSliceZip: File, signal?: AbortSignal): Promise<AddDocumentResponse>
Upload and index a CORD-19 slice zip file.

**Parameters:**
- `cordSliceZip` - The zip file to upload
- `signal` - Optional AbortSignal for cancellation

**Returns:** Add document response with indexing statistics

**Throws:** `ApiError` on failure

**Implementation:**
- Creates multipart/form-data with file
- Makes POST request to `/api/add_document`
- Includes admin token if available
- Provides detailed error messages from backend
- Returns indexing statistics (docs_indexed, processing_time_ms, etc.)

**Dependencies:**
- `../constants` - API_CONFIG
- `../types` - ApiError, AddDocumentResponse
- `./utils` - buildUrl, parseResponseBody, formatErrorMessage, isNetworkError
- `./admin` - getAdminToken

---

### lib/services/health.ts

**Purpose:** Health check service for backend availability monitoring.

**Types:**

#### HealthCheckResponse
```typescript
interface HealthCheckResponse {
  ok: boolean;        // Health status
  segments: number;   // Number of loaded index segments
}
```

**Functions:**

#### getHealthEndpoint(): string
Get the health check endpoint URL from environment variables.

**Returns:** Full health endpoint URL

**Throws:** Error if NEXT_PUBLIC_API_BASE is not set

#### checkBackendHealth(): Promise<boolean>
Check if the backend is healthy and ready to serve requests.

**Returns:** true if backend is healthy, false otherwise

**Implementation:**
- Makes GET request to `/api/health`
- 5-second timeout using AbortController
- Uses `cache: 'no-store'` to avoid caching
- Validates response has `ok: true` and `segments > 0`
- Logs all checks and results to console
- Returns false on any error (timeout, network, parse, etc.)

**Dependencies:**
- None (uses only built-in fetch and environment variables)

---

### lib/services/search.ts

**Purpose:** Search-related service functions for document search and suggestions.

**Functions:**

#### search(query: string, k: number): Promise<SearchResponse>
Search for documents matching a query.

**Parameters:**
- `query` - Search query string
- `k` - Maximum number of results to return

**Returns:** Search response with results array

**Throws:** `ApiError` on failure

**Implementation:**
- Makes GET request to `/api/search`
- Passes query and k as URL parameters
- Returns comprehensive search metadata (timing, cache info, etc.)
- May include AI overview in response

#### suggest(query: string, k: number, signal?: AbortSignal): Promise<SuggestResponse>
Get autocomplete suggestions for a query prefix.

**Parameters:**
- `query` - Query prefix to get suggestions for
- `k` - Maximum number of suggestions to return
- `signal` - Optional AbortSignal for cancellation

**Returns:** Suggest response with suggestions array

**Throws:** `ApiError` on failure, `AbortError` if cancelled

**Implementation:**
- Makes GET request to `/api/suggest`
- Supports request cancellation
- Returns array of suggestion strings
- Used for autocomplete functionality

**Dependencies:**
- `../constants` - API_CONFIG
- `../types` - ApiError, SearchResponse, SuggestResponse
- `./utils` - buildUrl

---

### lib/services/stats.ts

**Purpose:** Statistics service functions for admin dashboard metrics.

**Re-exports:**
- `StatsResponse` - Type for stats response

**Functions:**

#### getStats(signal?: AbortSignal): Promise<StatsResponse>
Fetch statistics from the backend (requires admin authentication).

**Parameters:**
- `signal` - Optional AbortSignal for cancellation

**Returns:** Statistics response with system metrics

**Throws:** 
- `ApiError` with status 401 if not authenticated
- `ApiError` with status 403 if token is invalid/expired
- `ApiError` on other failures
- `AbortError` if cancelled

**Implementation:**
- Requires admin token (throws 401 if not available)
- Makes GET request to `/api/stats`
- Includes Authorization header with Bearer token
- Returns comprehensive metrics:
  - Search statistics and cache rates
  - AI overview/summary statistics
  - API quota information
  - Feedback metrics
- Handles 401/403 specially for authentication errors

**Dependencies:**
- `../constants` - API_CONFIG
- `../types` - ApiError
- `../types/stats` - StatsResponse
- `./utils` - buildUrl, isNetworkError
- `./admin` - getAdminToken

---

### lib/services/utils.ts

**Purpose:** Internal service utilities for API calls and error handling.

**Functions:**

#### isNetworkError(err: unknown): boolean
Check if an error is a network-related fetch error.

**Parameters:**
- `err` - Error to check

**Returns:** true if network error, false otherwise

**Implementation:**
- Checks if error is TypeError with "failed to fetch" message
- Case-insensitive matching
- Used to provide better error messages

#### parseResponseBody(res: Response): Promise<unknown>
Safely parse JSON from a response, falling back to text.

**Parameters:**
- `res` - Response object

**Returns:** Parsed JSON or text string

**Implementation:**
- Checks Content-Type header
- Attempts JSON parsing for application/json
- Falls back to text parsing
- Attempts to parse text as JSON if needed
- Returns raw text if JSON parsing fails

#### buildUrl(endpoint: string, params?: Record<string, string>): string
Build a full URL for an API endpoint.

**Parameters:**
- `endpoint` - API endpoint path
- `params` - Optional query parameters

**Returns:** Full URL string

**Implementation:**
- Uses API_CONFIG.BASE_URL from constants
- Handles browser and server environments
- Properly encodes query parameters
- Returns absolute URL

#### formatErrorMessage(payload: unknown, fallbackStatus: number): string
Format error message from API response.

**Parameters:**
- `payload` - Response payload
- `fallbackStatus` - HTTP status code

**Returns:** Formatted error message

**Implementation:**
- Returns string payload directly
- Extracts `error` field from object payloads
- Appends `details` if available
- Falls back to generic message with status code

**Dependencies:**
- `../constants` - API_CONFIG
- `../types` - ApiError

---

### lib/services/index.ts

**Purpose:** Centralized service exports for clean imports.

**Exports:**

**Search APIs:**
- `search` - Document search
- `suggest` - Autocomplete suggestions

**Document APIs:**
- `addCordSlice` - Upload and index documents

**AI APIs:**
- `getAIOverview` - AI search overview
- `getResultSummary` - AI result summary

**Admin APIs:**
- `login` - Admin authentication
- `logout` - Admin logout
- `verifyToken` - Token verification
- `getAdminToken` - Get current token

**Stats APIs:**
- `getStats` - Fetch system statistics

**Health APIs:**
- `checkBackendHealth` - Health check

**Utilities (for internal use):**
- `buildUrl` - URL builder
- `isNetworkError` - Network error detection
- `parseResponseBody` - Response parsing
- `formatErrorMessage` - Error formatting

**Types:**
- `LoginRequest`
- `LoginResponse`
- `VerifyResponse`
- `StatsResponse`
- `HealthCheckResponse`

**Dependencies:**
- `./search`
- `./document`
- `./ai`
- `./admin`
- `./stats`
- `./health`
- `./utils`

---

## Type Definitions

### lib/types/ai.ts

**Purpose:** AI-related type definitions for API responses.

**Types:**

#### AIOverviewResponse
Response from the AI overview API endpoint.

```typescript
interface AIOverviewResponse {
  cached?: boolean;           // Served from cache
  query: string;              // Executed query
  overview: string;           // AI-generated overview
  model: string;              // AI model used
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

#### ResultSummaryResponse
Response from the AI summary API endpoint.

```typescript
interface ResultSummaryResponse {
  cached: boolean;            // Served from cache
  cord_uid: string;           // CORD-19 identifier
  summary: string;            // AI summary in Markdown
}
```

**Dependencies:** None

---

### lib/types/components.ts

**Purpose:** Component prop type definitions.

**Types:**

#### SearchBarProps
Props for the SearchBar component.

```typescript
interface SearchBarProps {
  query: string;                              // Current search query
  k: number;                                  // Number of results
  loading: boolean;                           // Search in progress
  recentSearches?: string[];                  // Recent queries
  onChangeQuery: (query: string) => void;     // Query change handler
  onChangeK: (k: number) => void;             // K value change handler
  onSubmit: (queryOverride?: string) => void; // Submit handler
  onDeleteSuggestion?: (query: string) => void; // Delete suggestion
}
```

#### FeedbackModalProps
Props for the FeedbackModal component.

```typescript
interface FeedbackModalProps {
  show: boolean;          // Modal visibility
  onClose: () => void;    // Close handler
}
```

#### AddDocumentModalProps
Props for the AddDocumentModal component.

```typescript
interface AddDocumentModalProps {
  show: boolean;          // Modal visibility
  onClose: () => void;    // Close handler
}
```

#### SearchResultsProps
Props for the SearchResults component.

```typescript
interface SearchResultsProps {
  results: SearchResult[];                    // Results to display
  pageSize?: number;                          // Results per page
  showNonEnglish?: boolean;                   // Show non-English results
  isVisited?: (url: string) => boolean;       // Check if visited
  markVisited?: (url: string, title?: string) => void; // Mark as visited
}
```

**Dependencies:**
- `./search` - SearchResult type

---

### lib/types/document.ts

**Purpose:** Document management type definitions.

**Types:**

#### AddDocumentResponse
Response from the add_document API endpoint.

```typescript
interface AddDocumentResponse {
  success: boolean;             // Success status
  message?: string;             // Optional message
  docId?: number;               // Document ID
  processing_time_ms?: number;  // Processing time
  total_time_ms?: number;       // Total time
  docs_indexed?: number;        // Number indexed
  segment?: string;             // Segment name
  reloaded?: boolean;           // Index reloaded
}
```

**Dependencies:** None

---

### lib/types/errors.ts

**Purpose:** Error-related type definitions.

**Classes:**

#### ApiError
Custom API error class extending Error.

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  )
}
```

**Properties:**
- `message` - Error message
- `statusCode` - HTTP status code (optional)
- `details` - Additional error details (optional)
- `name` - Always "ApiError"

**Implementation:**
- Extends native Error class
- Adds HTTP status code and details
- Used throughout services layer for API errors

**Dependencies:** None

---

### lib/types/search.ts

**Purpose:** Search-related type definitions.

**Types:**

#### SearchResult
A single search result from the backend.

```typescript
interface SearchResult {
  docId: number;          // Internal document ID
  score: number;          // Relevance score
  title: string;          // Document title
  segment: string;        // Index segment
  cord_uid: string;       // CORD-19 UID
  json_relpath: string;   // Relative JSON path
  url?: string;           // Paper URL (optional)
  publish_time?: string;  // ISO date (optional)
  author?: string;        // Author name(s) (optional)
}
```

#### SearchResponse
Response from the search API endpoint.

```typescript
interface SearchResponse {
  query: string;                // Executed query
  k?: number;                   // Results requested
  segments?: number;            // Segments searched
  search_time_ms?: number;      // Search time
  total_time_ms?: number;       // Total time
  found?: number;               // Total matches
  cached?: boolean;             // From cache
  cache_lookup_ms?: number;     // Cache lookup time
  results: SearchResult[];      // Results array
  ai_overview?: {               // Optional AI overview
    query: string;
    overview: string;
    model: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}
```

#### SuggestResponse
Response from the suggest API endpoint.

```typescript
interface SuggestResponse {
  query: string;              // Query prefix
  limit?: number;             // Max suggestions
  suggestions: string[];      // Suggestion array
}
```

**Dependencies:** None

---

### lib/types/shared.ts

**Purpose:** Shared types used across multiple parts of the application.

**Types:**

#### RecentSearch
Recent search entry stored in local state/storage.

```typescript
interface RecentSearch {
  query: string;           // Search query
  timestamp: number;       // When searched (ms)
  resultCount?: number;    // Number of results (optional)
}
```

#### VisitedLink
Visited link entry for tracking clicked results.

```typescript
interface VisitedLink {
  url: string;            // Visited URL
  timestamp: number;      // When visited (ms)
  title?: string;         // Result title (optional)
}
```

**Dependencies:** None

---

### lib/types/stats.ts

**Purpose:** Stats-related type definitions for admin dashboard.

**Types:**

#### FeedbackEntry
Feedback entry from the backend.

```typescript
interface FeedbackEntry {
  type: string;           // 'anonymous' | 'replyable'
  email: string | null;   // Email if replyable
  message: string;        // Feedback message
  timestamp: string;      // ISO date string
}
```

#### StatsResponse
Stats response from the /api/stats endpoint.

```typescript
interface StatsResponse {
  // Search metrics
  total_searches: number;
  search_cache_hits: number;
  search_cache_hit_rate: number;

  // AI Overview metrics
  ai_overview_calls: number;
  ai_overview_cache_hits: number;
  ai_overview_cache_hit_rate: number;

  // AI Summary metrics
  ai_summary_calls: number;
  ai_summary_cache_hits: number;
  ai_summary_cache_hit_rate: number;

  // AI API quota
  ai_api_calls_remaining: number;
  ai_api_calls_used: number;

  // Feedback metrics
  total_feedback_count: number;
  last_10_feedback: FeedbackEntry[];
}
```

**Dependencies:** None

---

### lib/types/index.ts

**Purpose:** Centralized type exports for clean imports.

**Exports:**

**Search types:**
- `SearchResult`
- `SearchResponse`
- `SuggestResponse`

**AI types:**
- `AIOverviewResponse`
- `ResultSummaryResponse`

**Document types:**
- `AddDocumentResponse`

**Error types:**
- `ApiError` (class)

**Component types:**
- `SearchBarProps`
- `FeedbackModalProps`
- `AddDocumentModalProps`
- `SearchResultsProps`

**Shared types:**
- `RecentSearch`
- `VisitedLink`

**Stats types:**
- `StatsResponse`
- `FeedbackEntry`

**Dependencies:**
- `./search`
- `./ai`
- `./document`
- `./errors`
- `./components`
- `./shared`
- `./stats`

---

## Utility Functions

### lib/utils/classnames.ts

**Purpose:** Utility for conditionally joining classNames together.

**Functions:**

#### cn(...classes: (string | boolean | undefined | null)[]): string
Filters out falsy values and joins remaining classes with a space.

**Parameters:**
- `...classes` - Variable number of class values (strings or conditionals)

**Returns:** Joined class string

**Example:**
```typescript
cn('base-class', isActive && 'active', hasError && 'error')
// => 'base-class active' (if isActive is true, hasError is false)
```

**Implementation:**
- Filters out falsy values (false, null, undefined)
- Joins remaining strings with spaces
- Useful for conditional className generation

**Dependencies:** None

---

### lib/utils/date.ts

**Purpose:** Date-related utilities for parsing and formatting.

**Functions:**

#### publishTimeToMs(iso?: string): number
Parse publish_time to milliseconds timestamp.

**Parameters:**
- `iso` - ISO date string (optional)

**Returns:** Timestamp in milliseconds, or NaN if invalid

**Implementation:**
- Uses Date.parse() for parsing
- Returns NaN for invalid or missing dates
- Handles edge cases gracefully

#### formatDistanceToNow(date: Date): string
Format a date as a human-readable relative time string.

**Parameters:**
- `date` - Date object to format

**Returns:** Relative time string (e.g., "2 minutes ago")

**Implementation:**
- Calculates time difference from now
- Returns appropriate units (seconds, minutes, hours, days, months, years)
- Uses singular/plural forms correctly
- Returns "just now" for < 1 second

**Examples:**
- "just now" (< 1 second)
- "5 seconds ago"
- "1 minute ago"
- "3 hours ago"
- "5 days ago"
- "2 months ago"
- "1 year ago"

**Dependencies:** None

---

### lib/utils/formatting.ts

**Purpose:** Formatting utilities for display values.

**Functions:**

#### formatByline(result: SearchResult): string
Format the byline for a search result (author + year).

**Parameters:**
- `result` - Search result object

**Returns:** Formatted byline string

**Implementation:**
- Extracts author (uses "—" if missing)
- Extracts year from publish_time using YEAR_PATTERN regex
- Returns "Author (Year)" or just "Author" if no year
- Handles null/undefined/empty values

**Examples:**
- "John Doe (2020)"
- "Jane Smith"
- "—" (no author or date)

#### formatFileSize(bytes: number): string
Format file size in human-readable format.

**Parameters:**
- `bytes` - File size in bytes

**Returns:** Formatted size string

**Implementation:**
- Returns bytes for < 1 KB
- Returns KB for < 1 MB
- Returns MB for >= 1 MB
- Rounds to 1 decimal place for MB

**Examples:**
- "512 B"
- "15 KB"
- "2.5 MB"

#### formatDuration(ms: number): string
Format milliseconds duration for display.

**Parameters:**
- `ms` - Duration in milliseconds

**Returns:** Formatted duration string

**Implementation:**
- Returns milliseconds for < 1000 ms
- Returns seconds for >= 1000 ms
- 2 decimal places precision

**Examples:**
- "45.23 ms"
- "2.50 s"

**Dependencies:**
- `../types` - SearchResult
- `../constants` - VALIDATION.YEAR_PATTERN

---

### lib/utils/language.ts

**Purpose:** Language detection utilities for filtering non-English content.

**Functions:**

#### isEnglish(text: string): boolean
Detects if the given text is primarily in English.

**Parameters:**
- `text` - Text to analyze

**Returns:** true if English, false otherwise

**Implementation:**
- Returns true for empty text (avoid filtering)
- Checks for non-Latin characters (CJK, Arabic, Cyrillic, etc.)
- Rejects if > 5% non-Latin characters
- Checks for extended Latin characters (accents)
- Rejects if > 10% extended Latin characters
- Uses Unicode ranges for detection:
  - `\u0400-\u04FF` - Cyrillic
  - `\u0600-\u06FF` - Arabic
  - `\u0E00-\u0E7F` - Thai
  - `\u1100-\u11FF` - Hangul
  - `\u3040-\u309F` - Hiragana
  - `\u30A0-\u30FF` - Katakana
  - `\u4E00-\u9FFF` - CJK Unified Ideographs
  - `\uAC00-\uD7AF` - Hangul Syllables
  - `À-ÖØ-öø-ÿ` - Extended Latin

**Algorithm:**
1. Check if text is empty → return true
2. Calculate non-Latin character ratio
3. If > 5% non-Latin → return false
4. Calculate extended Latin ratio
5. If > 10% extended Latin → return false
6. Otherwise → return true (basic Latin = English)

#### isResultTitleEnglish(title: string): boolean
Checks if a search result title is in English.

**Parameters:**
- `title` - Search result title

**Returns:** true if English, false otherwise

**Implementation:**
- Wrapper around `isEnglish()`
- Provides semantic clarity for result filtering

**Dependencies:** None

---

### lib/utils/url.ts

**Purpose:** URL-related utilities for parsing and generating URLs.

**Functions:**

#### safeHostname(url?: string): string
Extract hostname from a URL, removing 'www.' prefix.

**Parameters:**
- `url` - URL string (optional)

**Returns:** Hostname without 'www.' prefix, or empty string/original URL if invalid

**Implementation:**
- Returns empty string for missing URL
- Uses URL constructor for parsing
- Removes 'www.' prefix with regex
- Returns original URL on parse error

**Examples:**
- `"https://www.example.com/path"` → `"example.com"`
- `"https://subdomain.example.com"` → `"subdomain.example.com"`
- `"invalid"` → `"invalid"`

#### faviconUrl(url?: string): string | null
Generate a Google favicon URL for a given website URL.

**Parameters:**
- `url` - Website URL (optional)

**Returns:** Google favicon URL, or null if invalid

**Implementation:**
- Returns null for missing URL
- Uses URL constructor for parsing
- Generates Google S2 favicon URL with 64px size
- Returns null on parse error

**Example:**
```typescript
faviconUrl("https://www.example.com")
// => "https://www.google.com/s2/favicons?domain=www.example.com&sz=64"
```

**Dependencies:** None

---

### lib/utils/index.ts

**Purpose:** Centralized utility exports for clean imports.

**Exports:**

**Classname utilities:**
- `cn` - Conditional classname joining

**Formatting utilities:**
- `formatByline` - Author and year formatting
- `formatFileSize` - File size formatting
- `formatDuration` - Duration formatting

**URL utilities:**
- `safeHostname` - Hostname extraction
- `faviconUrl` - Favicon URL generation

**Date utilities:**
- `publishTimeToMs` - ISO date to milliseconds

**Language utilities:**
- `isEnglish` - English language detection
- `isResultTitleEnglish` - Result title language check

**Dependencies:**
- `./classnames`
- `./formatting`
- `./url`
- `./date`
- `./language`

---

## Home Page Utils

### app/(home)/utils/clampK.ts

**Purpose:** Utility to clamp the k value (number of search results) to valid range.

**Functions:**

#### clampK(v: number): number
Clamp k value to valid range defined in SEARCH_CONFIG.

**Parameters:**
- `v` - K value to clamp

**Returns:** Clamped k value within valid range

**Implementation:**
- Returns DEFAULT_K (100) for NaN values
- Truncates to integer with Math.trunc()
- Clamps to MIN_K (1) minimum
- Clamps to MAX_K (1000) maximum

**Example:**
```typescript
clampK(0)     // => 1
clampK(500)   // => 500
clampK(2000)  // => 1000
clampK(NaN)   // => 100
clampK(5.7)   // => 5
```

**Dependencies:**
- `@/lib/constants` - SEARCH_CONFIG

---

### app/(home)/utils/index.ts

**Purpose:** Re-export home page utilities.

**Exports:**
- `clampK` - K value clamping function

**Dependencies:**
- `./clampK`

---

## Home Page Types

### app/(home)/types.ts

**Purpose:** Re-export shared types for use in home page components.

**Exports:**
- `RecentSearch` - Recent search type from lib/types

**Dependencies:**
- `@/lib/types` - RecentSearch

**Implementation Details:**
Simple re-export to maintain clean import paths in home page components.

---

## Architecture Overview

### Modular Structure
The library is organized into clear, focused modules:

```
lib/
├── Core re-exports (api.ts, types.ts, utils.ts, constants.ts)
├── services/        - API call implementations
├── types/           - TypeScript type definitions
└── utils/           - Pure utility functions
```

### Design Patterns

#### Separation of Concerns
- **Services**: API communication logic
- **Types**: Data structures and contracts
- **Utils**: Pure transformation functions
- **Constants**: Configuration values

#### Backward Compatibility
All core files (api.ts, types.ts, utils.ts) maintain backward compatibility by re-exporting from modular structure.

#### Error Handling
- Custom `ApiError` class for API errors
- `isNetworkError()` utility for network detection
- Comprehensive error messages with status codes
- Graceful fallbacks for missing data

#### Type Safety
- Full TypeScript coverage
- Explicit interfaces for all API responses
- Discriminated unions where appropriate
- Readonly types for constants

### Key Relationships

#### Service Dependencies
```
services/admin.ts
└── services/utils.ts → constants, types

services/ai.ts
├── services/utils.ts → constants, types
└── services/admin.ts (for token)

services/document.ts
├── services/utils.ts → constants, types
└── services/admin.ts (for token)

services/stats.ts
├── services/utils.ts → constants, types
└── services/admin.ts (for token)

services/search.ts
└── services/utils.ts → constants, types

services/health.ts
└── (no dependencies)
```

#### Type Dependencies
```
types/components.ts
└── types/search.ts (SearchResult)

types/index.ts
└── All type modules
```

#### Utility Dependencies
```
utils/formatting.ts
├── types/search.ts (SearchResult)
└── constants (VALIDATION)

utils/index.ts
└── All utility modules
```

### Authentication Flow

1. **Login**: `login()` → Store token + expiry → Trigger storage event
2. **Token Access**: `getAdminToken()` → Check expiry → Return token or null
3. **Verification**: `verifyToken()` → Backend check → Update expiry or clear
4. **Usage**: Services check `getAdminToken()` → Include Authorization header if available
5. **Logout**: `logout()` → Clear storage → Notify backend → Trigger event

### Caching Strategy

Multiple layers of caching:
- **Search results**: Backend cache with `cached` flag
- **AI overviews**: Backend cache with `cached` flag  
- **AI summaries**: Backend cache with `cached` flag
- **Tokens**: LocalStorage with expiry checking

### Best Practices

#### API Calls
- Always use AbortSignal for cancellable requests
- Include admin token for authenticated endpoints
- Handle network errors with `isNetworkError()`
- Provide detailed error messages

#### Type Definitions
- Use optional properties for nullable fields
- Document complex types with JSDoc
- Export types alongside functions
- Keep types close to their usage

#### Utilities
- Keep functions pure and side-effect free
- Handle edge cases (null, undefined, empty)
- Provide clear examples in comments
- Test with various inputs

---

## Usage Examples

### Basic Search
```typescript
import { search } from '@/lib/api';
import { SearchResponse } from '@/lib/types';

const response: SearchResponse = await search('covid-19 vaccine', 100);
console.log(response.results);
```

### Admin Authentication
```typescript
import { login, getAdminToken, logout } from '@/lib/services/admin';

// Login
await login('admin-password');

// Check token
const token = getAdminToken();
if (token) {
  console.log('Authenticated');
}

// Logout
await logout();
```

### AI Overview
```typescript
import { getAIOverview } from '@/lib/api';

const controller = new AbortController();
const overview = await getAIOverview('machine learning', controller.signal);
console.log(overview.overview);
```

### Formatting Utilities
```typescript
import { formatByline, formatFileSize, formatDuration } from '@/lib/utils';

console.log(formatByline(result));        // "John Doe (2020)"
console.log(formatFileSize(1024 * 500)); // "500 KB"
console.log(formatDuration(1234));       // "1234.00 ms"
```

### Language Detection
```typescript
import { isEnglish } from '@/lib/utils';

console.log(isEnglish('Hello World'));           // true
console.log(isEnglish('你好世界'));              // false
console.log(isEnglish('Bonjour le monde'));     // false (>10% accents)
```

### Constants Usage
```typescript
import { SEARCH_CONFIG, API_CONFIG } from '@/lib/constants';

const maxResults = SEARCH_CONFIG.MAX_K;           // 1000
const endpoint = API_CONFIG.ENDPOINTS.SEARCH;     // '/api/search'
```

---

## Summary

This library provides a comprehensive, type-safe, and well-organized foundation for the nextsearch-web application:

- **30+ files** across services, types, and utilities
- **Full TypeScript coverage** with detailed interfaces
- **Modular architecture** with clear separation of concerns
- **Backward compatibility** through re-export layers
- **Comprehensive error handling** with custom error types
- **Admin authentication** with JWT tokens and expiry management
- **AI integration** with caching and rate limiting support
- **Health monitoring** for backend availability
- **Language detection** for filtering non-English content
- **Formatting utilities** for display consistency
- **URL helpers** for safe hostname and favicon handling
- **Date utilities** for relative time formatting

The library follows best practices for maintainability, testability, and developer experience.
