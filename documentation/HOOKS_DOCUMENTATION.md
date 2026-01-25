# NextSearch Custom Hooks Documentation

Comprehensive documentation for all custom React hooks in the NextSearch web application.

---

## Table of Contents

1. [useAdminAccess](#useadminaccess)
2. [useAIOverview](#useaioverview)
3. [useAIRateLimit](#useairatelimit)
4. [useClickOutside](#useclickoutside)
5. [useDebounce](#usedebounce)
6. [useRecentSearches](#userecentsearches)
7. [useSearch](#usesearch)
8. [useSuggestions](#usesuggestions)
9. [useVisitedLinks](#usevisitedlinks)

---

## useAdminAccess

### File Path
[hooks/useAdminAccess.ts](hooks/useAdminAccess.ts)

### Purpose
Manages admin authentication state by checking JWT token validity stored in localStorage. Provides real-time authentication status monitoring with automatic expiry detection.

### Hook Signature
```typescript
function useAdminAccess(): boolean
```

### Parameters
None

### Return Value
- **Type**: `boolean`
- **Description**: `true` if user is authenticated with a valid, non-expired JWT token; `false` otherwise

### Internal State
- `isAuthenticated` (boolean): Current authentication status

### Storage Keys
- `nextsearch-admin-token`: Stores JWT token
- `nextsearch-admin-token-expiry`: Stores token expiration timestamp

### Side Effects
1. **On mount**: Checks localStorage for valid token
2. **Storage listener**: Monitors localStorage changes from other tabs/windows
3. **Interval check**: Validates token expiry every 60 seconds
4. **Cleanup**: Removes expired tokens from localStorage

### Dependencies
- React: `useState`, `useEffect`
- Browser APIs: `localStorage`, `window.addEventListener`

### Usage Example
```typescript
import { useAdminAccess } from '@/hooks';

function AdminDashboard() {
  const isAuthenticated = useAdminAccess();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  return <Dashboard />;
}
```

### Related Utilities
- `getAdminToken()`: Standalone function to retrieve current admin token
  ```typescript
  function getAdminToken(): string | null
  ```

### Notes
- Automatically cleans up expired tokens
- Syncs authentication state across multiple browser tabs
- Checks expiry every minute to ensure timely logout

---

## useAIOverview

### File Path
[hooks/useAIOverview.ts](hooks/useAIOverview.ts)

### Purpose
Manages AI-powered overview generation for search queries. Handles async loading, request cancellation, rate limiting, and caching detection.

### Hook Signature
```typescript
function useAIOverview(): UseAIOverviewReturn
```

### Parameters
None

### Return Value (UseAIOverviewReturn)
```typescript
interface UseAIOverviewReturn {
  overview: AIOverviewResponse | null;      // The AI overview data
  loading: boolean;                         // Loading state
  error: string | null;                     // Error message if request failed
  fetchOverview: (query: string) => Promise<void>;  // Fetch AI overview
  setOverview: (data: AIOverviewResponse | null) => void;  // Set data directly
  reset: () => void;                        // Reset all state
  isRateLimited: boolean;                   // Rate limit exceeded
  remainingRequests: number;                // Remaining requests available
}
```

### Internal State
- `overview`: Current AI overview response data
- `loading`: Async operation in progress
- `error`: Error message from failed requests
- `abortControllerRef`: Reference to AbortController for cancelling stale requests

### Side Effects
1. **Request cancellation**: Aborts previous requests when new ones are initiated
2. **Rate limit tracking**: Increments counter only for non-cached responses
3. **Error handling**: Ignores abort errors, displays other errors

### Dependencies
- React: `useCallback`, `useRef`, `useState`
- Internal hooks: `useAIRateLimit`
- API: `getAIOverview` from `@/lib/api`
- Types: `AIOverviewResponse` from `@/lib/types`

### Usage Example
```typescript
import { useAIOverview } from '@/hooks';

function SearchPage() {
  const { 
    overview, 
    loading, 
    error, 
    fetchOverview,
    isRateLimited,
    remainingRequests 
  } = useAIOverview();
  
  const handleSearch = async (query: string) => {
    if (!isRateLimited) {
      await fetchOverview(query);
    }
  };
  
  return (
    <div>
      {loading && <Spinner />}
      {error && <Alert type="error">{error}</Alert>}
      {overview && <AIOverviewPanel data={overview} />}
      {isRateLimited && (
        <Alert>Rate limit reached. Try again later.</Alert>
      )}
      <p>Remaining requests: {remainingRequests}</p>
    </div>
  );
}
```

### Related Hooks
- [useAIRateLimit](#useairatelimit): Rate limiting functionality
- [useSearch](#usesearch): Main search functionality

### Notes
- Automatically cancels outdated requests to prevent race conditions
- Only counts non-cached responses against rate limit
- Rate limit applies to unauthorized users only

---

## useAIRateLimit

### File Path
[hooks/useAIRateLimit.ts](hooks/useAIRateLimit.ts)

### Purpose
Implements client-side rate limiting for AI API requests using localStorage. Limits users to 10 AI requests per 24-hour period.

### Hook Signature
```typescript
function useAIRateLimit(): UseAIRateLimitReturn
```

### Parameters
None

### Return Value (UseAIRateLimitReturn)
```typescript
interface UseAIRateLimitReturn {
  requestCount: number;           // Current number of requests made
  isLimitExceeded: boolean;       // Whether rate limit is exceeded
  incrementCount: () => void;     // Increment the request counter
  resetCount: () => void;         // Reset the counter
  remainingRequests: number;      // Remaining requests (0-10)
}
```

### Internal State
- `requestCount`: Number of AI requests made within current 24-hour window

### Storage Keys
- `ai_request_count`: Stores request count
- `ai_request_timestamp`: Stores timestamp of first request in current window

### Configuration
- **Max requests**: 10
- **Window duration**: 24 hours (86,400,000 ms)

### Side Effects
1. **On mount**: Loads count from localStorage and checks for expiry
2. **Auto-expiry**: Resets counter after 24 hours
3. **Persistence**: Saves count and timestamp to localStorage on each increment

### Dependencies
- React: `useState`, `useEffect`, `useCallback`
- Browser APIs: `localStorage`

### Usage Example
```typescript
import { useAIRateLimit } from '@/hooks';

function AIFeature() {
  const { 
    requestCount, 
    isLimitExceeded, 
    incrementCount,
    remainingRequests 
  } = useAIRateLimit();
  
  const handleAIRequest = async () => {
    if (isLimitExceeded) {
      alert('Rate limit exceeded. Try again tomorrow.');
      return;
    }
    
    // Make AI request
    const response = await fetchAI();
    
    // Only increment if response was not cached
    if (!response.cached) {
      incrementCount();
    }
  };
  
  return (
    <div>
      <p>Requests used: {requestCount}/10</p>
      <p>Remaining: {remainingRequests}</p>
      <Button 
        onClick={handleAIRequest}
        disabled={isLimitExceeded}
      >
        Generate AI Overview
      </Button>
    </div>
  );
}
```

### Related Hooks
- [useAIOverview](#useaioverview): Uses this hook for rate limiting

### Notes
- Client-side only; can be circumvented by clearing localStorage
- 24-hour window resets automatically based on initial timestamp
- Counter persists across browser sessions

---

## useClickOutside

### File Path
[hooks/useClickOutside.ts](hooks/useClickOutside.ts)

### Purpose
Detects clicks outside a specified element and triggers a callback. Useful for closing dropdowns, modals, and popovers. Also handles Escape key for accessibility.

### Hook Signature
```typescript
function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void,
  enabled?: boolean
): RefObject<T | null>
```

### Parameters
- **callback** (`() => void`): Function to call when clicking outside
- **enabled** (`boolean`, optional): Whether the listener is active (default: `true`)

### Return Value
- **Type**: `RefObject<T | null>`
- **Description**: A ref to attach to the element to monitor

### Internal State
- `ref`: Reference to the monitored element
- `callbackRef`: Stable reference to callback function

### Side Effects
1. **Click detection**: Listens to `mousedown` events on document
2. **Keyboard handling**: Listens to `keydown` for Escape key
3. **Conditional listener**: Only active when `enabled` is `true`
4. **Cleanup**: Removes event listeners on unmount or when disabled

### Dependencies
- React: `useEffect`, `useRef`
- Types: `RefObject`
- Browser APIs: `document.addEventListener`

### Usage Example
```typescript
import { useClickOutside } from '@/hooks';

function Dropdown({ isOpen, onClose }) {
  const dropdownRef = useClickOutside(onClose, isOpen);
  
  if (!isOpen) return null;
  
  return (
    <div ref={dropdownRef} className="dropdown">
      <ul>
        <li>Option 1</li>
        <li>Option 2</li>
        <li>Option 3</li>
      </ul>
    </div>
  );
}

// Advanced: Multiple refs
function Modal({ isOpen, onClose }) {
  const modalRef = useClickOutside<HTMLDivElement>(onClose, isOpen);
  
  return isOpen ? (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-content">
        <h2>Modal Title</h2>
        <p>Content here...</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  ) : null;
}
```

### Related Hooks
- [useSuggestions](#usesuggestions): Uses blur handling for suggestions

### Notes
- Uses `mousedown` instead of `click` for immediate feedback
- Automatically handles Escape key press
- Callback ref prevents unnecessary re-renders
- Can be conditionally enabled/disabled

---

## useDebounce

### File Path
[hooks/useDebounce.ts](hooks/useDebounce.ts)

### Purpose
Provides two debouncing utilities: one for debouncing callback functions and another for debouncing values. Prevents excessive function calls during rapid user input.

### Hook Signatures

#### useDebounce (Function)
```typescript
function useDebounce<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number
): T
```

#### useDebouncedValue (Value)
```typescript
function useDebouncedValue<T>(
  value: T,
  delay: number
): T
```

### Parameters

#### useDebounce
- **callback** (`T`): The function to debounce
- **delay** (`number`): Delay in milliseconds

#### useDebouncedValue
- **value** (`T`): The value to debounce
- **delay** (`number`): Delay in milliseconds

### Return Values

#### useDebounce
- **Type**: `T` (same signature as input function)
- **Description**: Debounced version of the callback

#### useDebouncedValue
- **Type**: `T` (same type as input value)
- **Description**: Debounced value that updates after delay

### Internal State

#### useDebounce
- `timeoutRef`: Reference to current timeout
- `callbackRef`: Stable reference to callback

#### useDebouncedValue
- `debouncedValue`: The delayed value state

### Side Effects
1. **Timeout management**: Creates and clears timeouts
2. **Cleanup**: Clears pending timeouts on unmount
3. **Ref updates**: Keeps callback reference current

### Dependencies
- React: `useEffect`, `useRef`, `useState`
- Browser APIs: `window.setTimeout`, `window.clearTimeout`

### Usage Examples

#### Debouncing Functions
```typescript
import { useDebounce } from '@/hooks';

function SearchBar() {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useDebounce((searchQuery: string) => {
    console.log('Searching for:', searchQuery);
    fetchResults(searchQuery);
  }, 300);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return <input value={query} onChange={handleChange} />;
}
```

#### Debouncing Values
```typescript
import { useDebouncedValue } from '@/hooks';

function AutoSave({ content }) {
  const debouncedContent = useDebouncedValue(content, 1000);
  
  useEffect(() => {
    if (debouncedContent) {
      saveToServer(debouncedContent);
    }
  }, [debouncedContent]);
  
  return <p>Auto-saving...</p>;
}
```

#### API Request Debouncing
```typescript
function SuggestionInput() {
  const [input, setInput] = useState('');
  const debouncedInput = useDebouncedValue(input, 500);
  
  useEffect(() => {
    if (debouncedInput.length >= 3) {
      fetchSuggestions(debouncedInput);
    }
  }, [debouncedInput]);
  
  return (
    <input 
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type to search..."
    />
  );
}
```

### Related Hooks
- [useSuggestions](#usesuggestions): Uses debouncing for suggestion fetching
- [useSearch](#usesearch): Uses debouncing for k-value changes

### Notes
- `useDebounce` is for debouncing functions (events, callbacks)
- `useDebouncedValue` is for debouncing state values
- Each new call resets the timer
- Cleanup prevents memory leaks

---

## useRecentSearches

### File Path
[hooks/useRecentSearches.ts](hooks/useRecentSearches.ts)

### Purpose
Manages recent search history in localStorage. Tracks up to 10 recent searches with timestamps and optional result counts.

### Hook Signature
```typescript
function useRecentSearches(): UseRecentSearchesReturn
```

### Parameters
None

### Return Value (UseRecentSearchesReturn)
```typescript
interface UseRecentSearchesReturn {
  recentSearches: RecentSearch[];                      // List of recent searches
  addSearch: (query: string, resultCount?: number) => void;  // Add new search
  removeSearch: (query: string) => void;               // Remove specific search
  clearHistory: () => void;                            // Clear all history
}
```

### Types
```typescript
interface RecentSearch {
  query: string;           // The search query
  timestamp: number;       // When search was made
  resultCount?: number;    // Number of results (optional)
}
```

### Internal State
- `recentSearches`: Array of recent search objects
- `isInitialized`: Prevents premature localStorage writes

### Storage Keys
- `nextsearch-recent-searches`: Stores array of RecentSearch objects

### Configuration
- **Maximum searches**: 10
- **Storage format**: JSON array

### Side Effects
1. **On mount**: Loads history from localStorage
2. **On update**: Saves to localStorage after initialization
3. **Deduplication**: Moves existing queries to top when re-searched
4. **Trimming**: Limits to most recent 10 searches

### Dependencies
- React: `useState`, `useEffect`, `useCallback`
- Types: `RecentSearch` from `@/lib/types`
- Browser APIs: `localStorage`

### Usage Example
```typescript
import { useRecentSearches } from '@/hooks';

function SearchPage() {
  const {
    recentSearches,
    addSearch,
    removeSearch,
    clearHistory
  } = useRecentSearches();
  
  const handleSearch = async (query: string) => {
    const results = await searchAPI(query);
    // Add to history with result count
    addSearch(query, results.found);
  };
  
  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      
      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <h3>Recent Searches</h3>
          <button onClick={clearHistory}>Clear All</button>
          <ul>
            {recentSearches.map((search) => (
              <li key={search.timestamp}>
                <span onClick={() => handleSearch(search.query)}>
                  {search.query}
                </span>
                {search.resultCount && (
                  <span className="count">
                    ({search.resultCount} results)
                  </span>
                )}
                <button onClick={() => removeSearch(search.query)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Related Hooks
- [useSuggestions](#usesuggestions): Integrates recent searches into suggestions
- [useSearch](#usesearch): Tracks search queries

### Notes
- Case-insensitive duplicate detection
- Most recent searches appear first
- Automatically handles localStorage errors (quota, disabled)
- Re-searching moves query to top of list

---

## useSearch

### File Path
[hooks/useSearch.ts](hooks/useSearch.ts)

### Purpose
Comprehensive hook that manages the complete search state and logic. Handles query submission, pagination (k parameter), sorting, auto-refresh on parameter changes, and performance tracking.

### Hook Signature
```typescript
function useSearch(options?: UseSearchOptions): UseSearchReturn
```

### Parameters (UseSearchOptions)
```typescript
interface UseSearchOptions {
  initialQuery?: string;    // Initial query string (default: '')
  initialK?: number;        // Initial number of results (default: 10)
}
```

### Return Value (UseSearchReturn)
```typescript
interface UseSearchReturn {
  // State
  query: string;                      // Current search query
  k: number;                          // Number of results to fetch
  results: SearchResult[];            // Raw search results
  loading: boolean;                   // Loading state
  error: string | null;               // Error message
  found: number | undefined;          // Total results found
  backendTotalMs: number | null;      // Backend response time
  hasSearched: boolean;               // Whether any search has been performed
  sortBy: SortOption;                 // Current sort option
  
  // Derived
  sortedResults: SearchResult[];      // Results sorted by sortBy
  status: string;                     // Status message for UI
  
  // Actions
  setQuery: (query: string) => void;         // Update query
  setK: (k: number) => void;                 // Update k (clamped)
  setSortBy: (sort: SortOption) => void;     // Update sort option
  submit: () => Promise<void>;               // Submit search
  reset: () => void;                         // Reset all state
}
```

### Types
```typescript
type SortOption = 'Relevancy' | 'Publish Date (Newest)' | 'Publish Date (Oldest)';
```

### Internal State
- `query`: Search query string
- `k`: Number of results (clamped between MIN_K and MAX_K)
- `results`: Array of search result objects
- `loading`: Async operation state
- `error`: Error message from API
- `found`: Total number of results available
- `backendTotalMs`: Backend processing time
- `hasSearched`: First search completed flag
- `sortBy`: Current sorting preference
- `prevKRef`: Tracks previous k value for auto-refresh detection

### Side Effects
1. **K-value auto-refresh**: Debounced search when k changes (300ms delay)
2. **Result clamping**: Ensures k stays within valid range (1-100)
3. **Sort computation**: Memoized sorting based on publish dates

### Dependencies
- React: `useCallback`, `useEffect`, `useMemo`, `useRef`, `useState`
- API: `search` from `@/lib/api`
- Constants: `SEARCH_CONFIG`, `SortOption` from `@/lib/constants`
- Utils: `publishTimeToMs` from `@/lib/utils`
- Types: `SearchResult` from `@/lib/types`

### Usage Example
```typescript
import { useSearch } from '@/hooks';

function SearchPage() {
  const {
    query,
    k,
    results,
    sortedResults,
    loading,
    error,
    status,
    sortBy,
    hasSearched,
    setQuery,
    setK,
    setSortBy,
    submit,
    reset
  } = useSearch({
    initialQuery: '',
    initialK: 10
  });
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submit();
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
        <button type="submit" disabled={loading || !query.trim()}>
          Search
        </button>
      </form>
      
      {hasSearched && (
        <>
          <div className="controls">
            <label>
              Results per page:
              <input
                type="number"
                value={k}
                onChange={(e) => setK(parseInt(e.target.value, 10))}
                min={1}
                max={100}
              />
            </label>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option>Relevancy</option>
              <option>Publish Date (Newest)</option>
              <option>Publish Date (Oldest)</option>
            </select>
            
            <button onClick={reset}>Clear</button>
          </div>
          
          <p className="status">{status}</p>
          
          {error && <Alert type="error">{error}</Alert>}
          
          {loading && <Spinner />}
          
          <div className="results">
            {sortedResults.map((result, i) => (
              <ResultCard key={i} result={result} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

### Configuration (from SEARCH_CONFIG)
- **MIN_K**: 1
- **MAX_K**: 100
- **DEFAULT_K**: 10
- **K_CHANGE_DEBOUNCE_MS**: 300

### Related Hooks
- [useRecentSearches](#userecentsearches): Tracks search history
- [useSuggestions](#usesuggestions): Provides query suggestions
- [useAIOverview](#useaioverview): Generates AI overviews for searches

### Notes
- Auto-refreshes results when k changes (after debounce)
- Sorts results client-side for date-based sorting
- Tracks backend performance metrics
- Handles invalid publish dates gracefully
- Validates and clamps k value automatically

---

## useSuggestions

### File Path
[hooks/useSuggestions.ts](hooks/useSuggestions.ts)

### Purpose
Manages autocomplete suggestions with keyboard navigation. Merges API suggestions with recent searches, handles debouncing, focus/blur events, and provides full keyboard accessibility.

### Hook Signature
```typescript
function useSuggestions(options: UseSuggestionsOptions): UseSuggestionsReturn
```

### Parameters (UseSuggestionsOptions)
```typescript
interface UseSuggestionsOptions {
  query: string;                       // Current query string
  recentSearches?: string[];           // Recent searches to merge
  maxSuggestions?: number;             // Max suggestions (default: 10)
  debounceMs?: number;                 // Debounce delay (default: 300)
  minQueryLength?: number;             // Min query length (default: 2)
  onBeforeClose?: () => void;          // Pre-close callback for animations
  closeDelayMs?: number;               // Close delay (default: 200)
}
```

### Return Value (UseSuggestionsReturn)
```typescript
interface UseSuggestionsReturn {
  suggestions: SuggestionItem[];               // Merged suggestions
  isOpen: boolean;                             // Dropdown open state
  activeIndex: number;                         // Highlighted index (-1 = none)
  isLoading: boolean;                          // Fetching state
  setOpen: (open: boolean) => void;            // Control open state
  setActiveIndex: (index: number) => void;     // Control active index
  pickSuggestion: (value: string) => string;   // Select and close
  handleKeyDown: (e: KeyboardEvent) => string | null;  // Keyboard navigation
  handleFocus: () => void;                     // Input focus handler
  handleBlur: () => void;                      // Input blur handler
  reset: () => void;                           // Reset all state
}
```

### Types
```typescript
interface SuggestionItem {
  text: string;        // Suggestion text
  isRecent: boolean;   // From recent searches or API
}
```

### Internal State
- `apiSuggestions`: Suggestions fetched from API
- `suggestions`: Merged array of suggestions with type info
- `isOpen`: Dropdown visibility state
- `activeIndex`: Currently highlighted suggestion (-1 for none)
- `isLoading`: API request in progress
- `isActiveRef`: Tracks input focus state
- `abortRef`: AbortController for cancelling requests
- `blurTimerRef`: Timer for delayed dropdown closing

### Side Effects
1. **Suggestion merging**: Combines recent searches and API suggestions
2. **Debounced fetching**: Fetches API suggestions after debounce delay
3. **Request cancellation**: Aborts stale API requests
4. **Focus/blur handling**: Manages dropdown visibility based on focus
5. **Keyboard navigation**: Handles arrow keys, Enter, and Escape
6. **Animation support**: Delays closing for exit animations

### Dependencies
- React: `useCallback`, `useEffect`, `useRef`, `useState`
- Types: `KeyboardEvent`
- API: `suggest` from `@/lib/api`
- Constants: `SEARCH_CONFIG`, `UI_CONFIG` from `@/lib/constants`

### Behavior

#### Suggestion Merging Logic
1. **Empty query**: Shows all recent searches
2. **Query < minQueryLength**: No API call, only matching recent searches
3. **Query >= minQueryLength**: API suggestions + matching recent searches
4. **Deduplication**: Removes duplicates (case-insensitive)
5. **Limit**: Caps total suggestions at `maxSuggestions`

#### Keyboard Navigation
- **ArrowDown**: Move to next suggestion (wraps to first)
- **ArrowUp**: Move to previous suggestion (wraps to last)
- **Enter**: Select active suggestion or submit current query
- **Escape**: Close dropdown

### Usage Example
```typescript
import { useSuggestions } from '@/hooks';
import { useRecentSearches } from '@/hooks';

function SearchBar() {
  const [query, setQuery] = useState('');
  const { recentSearches } = useRecentSearches();
  
  const {
    suggestions,
    isOpen,
    activeIndex,
    isLoading,
    pickSuggestion,
    handleKeyDown,
    handleFocus,
    handleBlur
  } = useSuggestions({
    query,
    recentSearches: recentSearches.map(s => s.query),
    maxSuggestions: 10,
    debounceMs: 300,
    minQueryLength: 2
  });
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const selected = handleKeyDown(e);
    if (selected !== null) {
      if (e.key === 'Enter') {
        // User selected a suggestion or pressed Enter
        if (selected) {
          setQuery(selected);
          performSearch(selected);
        } else if (query.trim()) {
          performSearch(query);
        }
      }
    }
  };
  
  const handleSuggestionClick = (text: string) => {
    const value = pickSuggestion(text);
    setQuery(value);
    performSearch(value);
  };
  
  return (
    <div className="search-container">
      <input
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search..."
      />
      
      {isOpen && (
        <ul className="suggestions-dropdown">
          {isLoading && <li className="loading">Loading...</li>}
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={index === activeIndex ? 'active' : ''}
              onMouseDown={() => handleSuggestionClick(suggestion.text)}
            >
              {suggestion.isRecent && <span className="icon">🕒</span>}
              {suggestion.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Advanced Usage with Animations
```typescript
function AnimatedSearchBar() {
  const [query, setQuery] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  
  const {
    suggestions,
    isOpen,
    activeIndex,
    handleKeyDown,
    handleFocus,
    handleBlur,
    pickSuggestion
  } = useSuggestions({
    query,
    recentSearches: [],
    onBeforeClose: () => setIsClosing(true),
    closeDelayMs: 300  // Match CSS animation duration
  });
  
  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isOpen && (
        <ul className={`suggestions ${isClosing ? 'fade-out' : 'fade-in'}`}>
          {suggestions.map((s, i) => (
            <li key={i} className={i === activeIndex ? 'active' : ''}>
              {s.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Configuration Defaults
- **maxSuggestions**: 10 (from `SEARCH_CONFIG.MAX_SUGGESTIONS`)
- **debounceMs**: 300 (from `SEARCH_CONFIG.SUGGESTION_DEBOUNCE_MS`)
- **minQueryLength**: 2 (from `SEARCH_CONFIG.MIN_QUERY_LENGTH`)
- **closeDelayMs**: 200
- **blurDelayMs**: From `UI_CONFIG.BLUR_DELAY_MS`

### Related Hooks
- [useRecentSearches](#userecentsearches): Provides recent searches for suggestions
- [useDebounce](#usedebounce): Pattern used for debouncing API calls

### Notes
- Uses `mousedown` instead of `click` to prevent blur race conditions
- Automatically cancels stale API requests
- Supports exit animations via callbacks
- Handles focus state across tabs
- Keyboard navigation is circular (wraps around)
- Recent searches shown immediately on empty query

---

## useVisitedLinks

### File Path
[hooks/useVisitedLinks.ts](hooks/useVisitedLinks.ts)

### Purpose
Tracks which search result links users have visited. Stores visit history in localStorage with timestamps and optional titles. Automatically expires entries after 3 days.

### Hook Signature
```typescript
function useVisitedLinks(): UseVisitedLinksReturn
```

### Parameters
None

### Return Value (UseVisitedLinksReturn)
```typescript
interface UseVisitedLinksReturn {
  visitedUrls: Set<string>;                         // Set for O(1) lookups
  visitedLinks: VisitedLink[];                      // Full link metadata
  isVisited: (url: string) => boolean;              // Check if visited
  markVisited: (url: string, title?: string) => void;  // Mark URL as visited
  removeVisited: (url: string) => void;             // Remove from history
  clearHistory: () => void;                         // Clear all history
}
```

### Types
```typescript
interface VisitedLink {
  url: string;         // The visited URL
  timestamp: number;   // When link was visited (ms)
  title?: string;      // Document title (optional)
}
```

### Internal State
- `visitedLinks`: Array of visited link objects with metadata
- `visitedUrls`: Set of URLs for fast lookup
- `hasLoadedRef`: Prevents premature localStorage writes

### Storage Keys
- `nextsearch-visited-links`: Stores array of VisitedLink objects

### Configuration
- **Maximum links**: 100
- **Expiration time**: 3 days (259,200,000 ms)
- **Storage format**: JSON array

### Side Effects
1. **On mount**: Loads and filters expired entries from localStorage
2. **On update**: Saves to localStorage after initialization
3. **Auto-expiry**: Removes links older than 3 days on load
4. **Deduplication**: Updates timestamp when revisiting
5. **Synchronization**: Updates both array and Set together

### Dependencies
- React: `useState`, `useEffect`, `useCallback`, `useRef`
- Browser APIs: `localStorage`

### Usage Example
```typescript
import { useVisitedLinks } from '@/hooks';

function SearchResults({ results }) {
  const {
    visitedUrls,
    visitedLinks,
    isVisited,
    markVisited,
    clearHistory
  } = useVisitedLinks();
  
  const handleLinkClick = (url: string, title: string) => {
    markVisited(url, title);
    // Open link
    window.open(url, '_blank');
  };
  
  return (
    <div>
      <button onClick={clearHistory}>
        Clear Visit History
      </button>
      
      <div className="results">
        {results.map((result) => (
          <div
            key={result.url}
            className={isVisited(result.url) ? 'visited' : ''}
          >
            <a
              href={result.url}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(result.url, result.title);
              }}
            >
              {result.title}
            </a>
            {isVisited(result.url) && (
              <span className="badge">Visited</span>
            )}
          </div>
        ))}
      </div>
      
      {/* Show visit history */}
      <div className="history">
        <h3>Recently Visited ({visitedLinks.length})</h3>
        {visitedLinks.slice(0, 10).map((link) => (
          <div key={link.url}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.title || link.url}
            </a>
            <span className="timestamp">
              {new Date(link.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Styling Visited Links
```typescript
function ResultCard({ result }) {
  const { isVisited } = useVisitedLinks();
  const visited = isVisited(result.url);
  
  return (
    <div className={`result-card ${visited ? 'visited' : ''}`}>
      <a 
        href={result.url}
        style={{ 
          color: visited ? '#609' : '#1a0dab',
          textDecoration: visited ? 'line-through' : 'none'
        }}
      >
        {result.title}
      </a>
    </div>
  );
}
```

### Privacy-Conscious Implementation
```typescript
function PrivacySettings() {
  const { visitedLinks, clearHistory } = useVisitedLinks();
  
  return (
    <div className="privacy-settings">
      <h3>Privacy Settings</h3>
      <p>
        You have visited {visitedLinks.length} links. 
        Links are automatically deleted after 3 days.
      </p>
      <button onClick={clearHistory}>
        Clear All Visit History
      </button>
      <p className="note">
        This data is stored locally and never sent to servers.
      </p>
    </div>
  );
}
```

### Related Hooks
- [useSearch](#usesearch): Provides search results that can be marked as visited

### Notes
- Automatically expires entries after 3 days
- Uses Set for O(1) lookup performance
- Stores both array (for ordering) and Set (for lookups)
- Handles localStorage errors gracefully
- Privacy-focused: data stays in browser
- Updates timestamp when revisiting URLs
- Most recently visited links appear first

---

## Summary Table

| Hook | Purpose | Key Features | Storage |
|------|---------|--------------|---------|
| **useAdminAccess** | Admin authentication | JWT validation, auto-expiry, cross-tab sync | localStorage |
| **useAIOverview** | AI overview generation | Rate limiting, request cancellation, caching | None |
| **useAIRateLimit** | Rate limit AI requests | 10 requests/24h, auto-expiry | localStorage |
| **useClickOutside** | Detect outside clicks | Escape key support, conditional enabling | None |
| **useDebounce** | Debounce functions/values | Timeout management, two variants | None |
| **useRecentSearches** | Search history | Max 10 searches, deduplication | localStorage |
| **useSearch** | Complete search logic | Sorting, pagination, auto-refresh | None |
| **useSuggestions** | Autocomplete suggestions | Keyboard nav, API + recent merge | None |
| **useVisitedLinks** | Track visited links | Auto-expiry (3 days), max 100 links | localStorage |

---

## Common Patterns

### localStorage Management
Several hooks use localStorage with similar patterns:
- **Load on mount** with error handling
- **Save after initialization** to prevent race conditions
- **Automatic expiry** based on timestamps
- **Graceful degradation** when localStorage is unavailable

### Request Cancellation
Hooks that make async requests use AbortController:
- [useAIOverview](#useaioverview)
- [useSuggestions](#usesuggestions)

### Debouncing
Multiple hooks implement or use debouncing:
- [useDebounce](#usedebounce) - Core implementation
- [useSearch](#usesearch) - k-value changes
- [useSuggestions](#usesuggestions) - API calls

### Ref Patterns
Hooks use refs for:
- **Callback stability**: Prevent useEffect dependency changes
- **Mutable state**: Track focus, abort controllers
- **DOM references**: Element monitoring

---

## Integration Example

Complete example showing multiple hooks working together:

```typescript
import {
  useSearch,
  useSuggestions,
  useRecentSearches,
  useVisitedLinks,
  useAIOverview,
  useClickOutside
} from '@/hooks';

function SearchPage() {
  // Core search functionality
  const {
    query,
    setQuery,
    submit,
    sortedResults,
    loading,
    status,
    hasSearched
  } = useSearch();
  
  // Search history
  const {
    recentSearches,
    addSearch,
    clearHistory
  } = useRecentSearches();
  
  // Autocomplete
  const {
    suggestions,
    isOpen,
    activeIndex,
    handleKeyDown,
    handleFocus,
    handleBlur,
    pickSuggestion
  } = useSuggestions({
    query,
    recentSearches: recentSearches.map(s => s.query),
    maxSuggestions: 8
  });
  
  // AI overview
  const {
    overview,
    loading: aiLoading,
    fetchOverview,
    isRateLimited
  } = useAIOverview();
  
  // Visited links tracking
  const { isVisited, markVisited } = useVisitedLinks();
  
  // Dropdown click-outside handling
  const dropdownRef = useClickOutside(() => {
    // Close suggestions when clicking outside
  }, isOpen);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submit();
    addSearch(query, sortedResults.length);
    
    if (!isRateLimited) {
      await fetchOverview(query);
    }
  };
  
  const handleSuggestionClick = (text: string) => {
    const value = pickSuggestion(text);
    setQuery(value);
    submit();
  };
  
  return (
    <div className="search-page">
      {/* Search Input */}
      <form onSubmit={handleSubmit}>
        <div className="search-container" ref={dropdownRef}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search..."
          />
          
          {/* Suggestions Dropdown */}
          {isOpen && (
            <ul className="suggestions">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className={i === activeIndex ? 'active' : ''}
                  onMouseDown={() => handleSuggestionClick(s.text)}
                >
                  {s.isRecent && '🕒 '}
                  {s.text}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <button type="submit" disabled={loading || !query.trim()}>
          Search
        </button>
      </form>
      
      {/* Recent Searches */}
      {recentSearches.length > 0 && !hasSearched && (
        <div className="recent">
          <h3>Recent Searches</h3>
          <button onClick={clearHistory}>Clear</button>
          {recentSearches.slice(0, 5).map((s) => (
            <button
              key={s.timestamp}
              onClick={() => {
                setQuery(s.query);
                submit();
              }}
            >
              {s.query}
            </button>
          ))}
        </div>
      )}
      
      {/* AI Overview */}
      {hasSearched && !aiLoading && overview && (
        <div className="ai-overview">
          <h3>AI Overview</h3>
          <p>{overview.summary}</p>
        </div>
      )}
      
      {/* Search Results */}
      {hasSearched && (
        <>
          <p className="status">{status}</p>
          <div className="results">
            {sortedResults.map((result, i) => (
              <div
                key={i}
                className={`result ${isVisited(result.url) ? 'visited' : ''}`}
              >
                <a
                  href={result.url}
                  onClick={() => markVisited(result.url, result.title)}
                >
                  {result.title}
                </a>
                {isVisited(result.url) && <span>✓ Visited</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

---

## Best Practices

### Performance
- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive computations
- Implement request cancellation for async operations
- Debounce frequent operations (typing, resizing)

### Error Handling
- Wrap localStorage operations in try-catch
- Handle AbortError separately from other errors
- Provide meaningful error messages to users
- Gracefully degrade when features unavailable

### Accessibility
- Support keyboard navigation (arrows, Enter, Escape)
- Handle focus/blur properly for dropdowns
- Provide visual feedback for active elements
- Use semantic HTML with ARIA attributes

### State Management
- Keep hooks focused on single responsibility
- Use refs for values that don't need re-renders
- Initialize from localStorage before rendering
- Prevent localStorage writes before initialization

### Testing
- Mock localStorage in tests
- Test error conditions (quota exceeded, disabled)
- Verify cleanup functions are called
- Test keyboard navigation edge cases

---

## Troubleshooting

### Common Issues

#### Suggestions not showing
- Check `minQueryLength` threshold
- Verify API endpoint is working
- Check browser console for errors
- Ensure `isActiveRef` is true on focus

#### localStorage not persisting
- Check browser storage quota
- Verify localStorage is enabled
- Look for JSON parse errors
- Check for circular reference issues

#### Rate limiting not working
- Verify timestamps are being saved
- Check expiry calculation (24 hours)
- Ensure `incrementCount` is called correctly
- Look for multiple hook instances

#### Keyboard navigation issues
- Verify event handlers are attached
- Check for event.preventDefault() calls
- Ensure activeIndex is within bounds
- Test with different keyboard layouts

---

## Version History

- **v1.0.0** - Initial implementation of all 9 hooks
- Comprehensive localStorage management
- Full keyboard navigation support
- Rate limiting and caching features
- Cross-tab synchronization for admin auth

---

## Contributing

When adding new hooks:
1. Follow existing patterns for consistency
2. Add comprehensive TypeScript types
3. Include JSDoc comments
4. Handle errors gracefully
5. Write usage examples
6. Update this documentation
7. Test with edge cases

---

## License

MIT License - See LICENSE file for details
