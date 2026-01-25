# NextSearch Component Documentation

**Generated:** January 25, 2026  
**Project:** nextsearch-web

This document provides comprehensive documentation for all components in the NextSearch application, organized by directory.

---

## Table of Contents

1. [Core Components](#core-components)
2. [UI Components](#ui-components)
3. [Search Components](#search-components)
4. [Stats Page Components](#stats-page-components)

---

## Core Components

### 1. AddDocumentModal

**File:** [components/AddDocumentModal.tsx](components/AddDocumentModal.tsx)

**Purpose:** Modal dialog for uploading and indexing CORD-19 dataset slices (ZIP files).

#### Props

```typescript
interface AddDocumentModalProps {
  show: boolean;           // Whether the modal is visible
  onClose: () => void;     // Callback when modal should close
}
```

#### Key Features

- **File Upload:** Accepts `.zip` files containing CORD-19 document slices
- **Validation:** Validates file type (must be .zip)
- **Progress Feedback:** Shows loading state during indexing
- **Success/Error States:** Displays formatted results or error messages
- **File Size Display:** Shows human-readable file size in the UI
- **Automatic Cleanup:** Resets state after successful upload

#### State Management

- `file: File | null` - Selected file
- `loading: boolean` - Upload/indexing in progress
- `error: string | null` - Error message
- `success: string | null` - Success message with indexing stats

#### UI Components

- **FileInput:** Custom file input with styled label
- **FormActions:** Close and upload buttons

#### API Integration

- Calls `apiAddCordSlice(file)` from `@/lib/api`
- Returns: `{ docs_indexed, segment, reloaded, total_time_ms }`

---

### 2. AIOverview

**File:** [components/AIOverview.tsx](components/AIOverview.tsx)

**Purpose:** Displays an AI-generated overview/summary of the search query with markdown rendering.

#### Props

```typescript
interface AIOverviewProps {
  overview: AIOverviewResponse | null;    // AI overview data
  loading: boolean;                       // Loading state
  error: string | null;                   // Error message
  hrRef?: React.RefObject<HTMLHRElement>; // Optional scroll reference
  remainingRequests?: number;             // Remaining AI requests
  isRateLimited?: boolean;                // Rate limit exceeded flag
}
```

#### Key Features

- **Markdown Rendering:** Uses ReactMarkdown with remark-gfm for GFM support
- **Smart Truncation:** Truncates long content intelligently at horizontal rules
- **Expand/Collapse:** Show more/less functionality for long overviews
- **Loading Skeleton:** Animated placeholder while loading
- **Error Handling:** Graceful error display with specific messages
- **Rate Limit Display:** Shows remaining requests when low
- **Smooth Animations:** Fade-in animations and smooth scrolling

#### State Management

- `isExpanded: boolean` - Whether full content is shown

#### Smart Truncation Logic

- Maximum preview length: 500 characters
- Finds horizontal rules (`---`) as natural break points
- Falls back to character limit if no suitable break found

#### Markdown Styling

- Custom prose styling with responsive text sizes
- Green accent colors for links and code
- Glassmorphism card design
- Custom components for headings, paragraphs, lists, code blocks

---

### 3. FeedbackModal

**File:** [components/FeedbackModal.tsx](components/FeedbackModal.tsx)

**Purpose:** Modal for submitting user feedback, with options for anonymous or replyable feedback.

#### Props

```typescript
interface FeedbackModalProps {
  isOpen: boolean;         // Whether modal is open
  onClose: () => void;     // Close callback
}
```

#### Key Features

- **Feedback Types:**
  - Anonymous: No email required
  - Replyable: Email required for response
- **Form Validation:** Validates message and email (if replyable)
- **API Integration:** Posts to `/api/feedback`
- **Success State:** Shows confirmation message after submission
- **Auto-cleanup:** Resets form state after modal closes
- **Responsive Design:** Adapts button layout for mobile/desktop

#### State Management

- `feedbackType: 'anonymous' | 'replyable'` - Selected feedback type
- `message: string` - Feedback message
- `email: string` - User email (for replyable)
- `isSubmitting: boolean` - Submission in progress
- `submitStatus: 'idle' | 'success' | 'error'` - Submission status
- `errorMessage: string` - Error message

#### API Payload

```typescript
{
  message: string;
  email: string | null;
  type: 'anonymous' | 'replyable';
}
```

---

### 4. Footer

**File:** [components/Footer.tsx](components/Footer.tsx)

**Purpose:** Universal footer with scroll-to-top, feedback, GitHub, and LinkedIn links.

#### Props

```typescript
interface FooterProps {
  showScrollToTop?: boolean;  // Show scroll-to-top button (default: false)
}
```

#### Key Features

- **Conditional Scroll-to-Top:** Only visible in post-search view when scrolled > 300px
- **Feedback Button:** Opens feedback modal
- **Social Links:** GitHub and LinkedIn with hover animations
- **Copyright Link:** Links to LICENSE file
- **Lenis Integration:** Uses Lenis smooth scrolling when available
- **Responsive Layout:** Adapts for mobile/desktop
- **Icon Animations:** Scale and rotate effects on hover

#### State Management

- `showScrollTop: boolean` - Scroll-to-top button visibility
- `isFeedbackModalOpen: boolean` - Feedback modal state

#### Scroll Detection

- Listens to window scroll events
- Shows button after 300px scroll
- Smooth scrolls to top using Lenis or fallback

---

### 5. RecentSearches

**File:** [components/RecentSearches.tsx](components/RecentSearches.tsx)

**Purpose:** Displays a list of recent searches with ability to re-run or remove them.

#### Props

```typescript
interface RecentSearchesProps {
  searches: RecentSearch[];           // List of recent searches
  onSelect: (query: string) => void;  // Callback when search is clicked
  onRemove: (query: string) => void;  // Callback when search is removed
  onClear: () => void;                // Callback to clear all history
}
```

#### Type Definitions

```typescript
interface RecentSearch {
  query: string;
  timestamp: number;
  resultCount?: number;
}
```

#### Key Features

- **Maximum Display:** Shows up to 5 most recent searches
- **Result Count:** Displays number of results if available
- **Hover Effects:** Shows delete button on hover (group-hover)
- **Clear All:** Bulk delete button with trash icon
- **Card Layout:** Glassmorphism card with dividers
- **Empty State:** Returns null when no searches

---

### 6. SearchBar

**File:** [components/SearchBar.tsx](components/SearchBar.tsx)

**Purpose:** Main search input with autocomplete suggestions and voice search integration.

#### Props

```typescript
interface SearchBarProps {
  query: string;                            // Current search query
  k: number;                                // Number of results parameter
  loading: boolean;                         // Search in progress
  recentSearches?: RecentSearch[];          // Recent search history
  onChangeQuery: (query: string) => void;   // Query change callback
  onChangeK: (k: number) => void;          // K parameter change callback
  onSubmit: (query: string) => void;        // Search submission callback
  onDeleteSuggestion?: (query: string) => void; // Delete suggestion callback
}
```

#### Key Features

- **Autocomplete:** Debounced suggestion fetching
- **Keyboard Navigation:** Arrow keys to navigate suggestions
- **Recent Searches:** Shows history in suggestions
- **Voice Search:** Integrated voice input button
- **Loading Indicator:** Spinner during search
- **Smooth Animations:** Scale-in/out animations for dropdown
- **Mobile Responsive:** Adaptive padding and font sizes
- **Glow Border:** Visual feedback on focus

#### Hooks Used

- `useSuggestions`: Manages suggestions, keyboard nav, and focus

#### Keyboard Shortcuts

- **Enter:** Submit search or select suggestion
- **Arrow Up/Down:** Navigate suggestions
- **Escape:** Close suggestions

#### Sub-components

- **SuggestionsDropdown:** Dropdown list with icons and delete buttons
- **LoadingIndicator:** Search progress spinner

---

### 7. SearchFilters

**File:** [components/SearchFilters.tsx](components/SearchFilters.tsx)

**Purpose:** Advanced search filters for date range, authors, and document type.

#### Props

```typescript
interface SearchFiltersProps {
  filters: SearchFiltersState;          // Current filter state
  onChange: (filters: SearchFiltersState) => void; // Filter change callback
  onApply: () => void;                 // Apply filters callback
  onReset: () => void;                 // Reset filters callback
}

interface SearchFiltersState {
  dateFrom: string;                    // Start date (ISO string)
  dateTo: string;                      // End date (ISO string)
  authors: string;                     // Author name filter
  documentType: 'all' | 'pdf' | 'pmc'; // Document type filter
}
```

#### Key Features

- **Collapsible Panel:** Toggle button with active indicator
- **Date Filters:** From/To date inputs
- **Author Search:** Free-text author name input
- **Document Type:** Select dropdown (All, PDF, PMC)
- **Active Indicator:** Green dot when filters applied
- **Auto-close on Scroll:** Panel closes when user scrolls
- **Reset Option:** Clear all filters button
- **Grid Layout:** Responsive 4-column grid

#### Default Filters

```typescript
const defaultFilters = {
  dateFrom: '',
  dateTo: '',
  authors: '',
  documentType: 'all'
};
```

---

### 8. SearchResults

**File:** [components/SearchResults.tsx](components/SearchResults.tsx)

**Purpose:** Paginated display of search results with language filtering.

#### Props

```typescript
interface SearchResultsProps {
  results: SearchResult[];              // Array of search results
  pageSize?: number;                    // Results per page (default: 10)
  showNonEnglish?: boolean;            // Show non-English results
  isVisited?: (url: string) => boolean; // Check if URL visited
  markVisited?: (url: string, title: string) => void; // Mark URL as visited
}
```

#### Key Features

- **Pagination:** Client-side pagination with configurable page size
- **Language Filtering:** Filters non-English results by title
- **Visited Links:** Marks previously visited results
- **Smooth Scrolling:** Auto-scroll to top on page change
- **Staggered Animation:** Cards animate in with delays
- **Empty States:** Shows count of hidden non-English results
- **Auto-reset:** Returns to page 1 when results change

#### State Management

- `page: number` - Current page (1-indexed)

#### Language Detection

- Uses `isResultTitleEnglish()` utility function
- Filters results based on `showNonEnglish` prop

---

### 9. ServerDownPage

**File:** [components/ServerDownPage.tsx](components/ServerDownPage.tsx)

**Purpose:** Error page displayed when backend server is unavailable.

#### Props

None (standalone page component)

#### Key Features

- **Full-page Layout:** Centered error message with gradient background
- **Status Icon:** Red warning triangle SVG
- **Retry Button:** Reloads the page
- **Timestamp:** Client-side timestamp (avoids hydration mismatch)
- **Glassmorphism:** Backdrop blur effect
- **Responsive Design:** Adapts for mobile/desktop

#### State Management

- `timestamp: string` - Error occurrence timestamp

---

### 10. SettingsMenu

**File:** [components/SettingsMenu.tsx](components/SettingsMenu.tsx)

**Purpose:** Dropdown menu for managing search history, site history, and admin access.

#### Props

```typescript
interface SettingsMenuProps {
  recentSearches: RecentSearch[];         // Recent searches
  onRemoveSearch: (query: string) => void; // Remove search callback
  onClearHistory: () => void;             // Clear all searches
  onSelectSearch?: (query: string) => void; // Re-run search callback
  visitedLinks: VisitedLink[];            // Visited site links
  onRemoveVisited: (url: string) => void; // Remove visited link
  onClearVisitedLinks: () => void;        // Clear all visited links
}
```

#### Key Features

- **Three Modals:**
  1. **Search History:** Manage recent searches
  2. **Site History:** Manage visited links
  3. **Admin Access:** Authentication for admin features
- **Dropdown Menu:** Click-outside and ESC to close
- **Animations:** Scale-in/out animations
- **Admin Auth:** 1-hour session tokens stored in localStorage
- **Timestamp Formatting:** Human-readable time ago
- **Mobile Responsive:** Icon sizes adapt for mobile

#### Sub-components

1. **SearchHistoryModal:**
   - List of searches with timestamps
   - Click to re-run search
   - Individual and bulk delete

2. **SiteHistoryModal:**
   - List of visited URLs with titles
   - Click to open in new tab
   - URL formatting for display

3. **AdminAccessModal:**
   - Password input for authentication
   - Session status display
   - Logout functionality

#### Admin Authentication

- Token stored: `nextsearch-admin-token`
- Expiry stored: `nextsearch-admin-token-expiry`
- Session duration: 1 hour
- API endpoints: `/api/admin/login`, `/api/admin/logout`

---

### 11. SiteHistory

**File:** [components/SiteHistory.tsx](components/SiteHistory.tsx)

**Purpose:** Displays a list of visited sites (alternative to modal in SettingsMenu).

#### Props

```typescript
interface SiteHistoryProps {
  visitedLinks: VisitedLink[];           // List of visited sites
  onRemove: (url: string) => void;       // Remove site callback
  onClear: () => void;                   // Clear all history callback
}
```

#### Type Definitions

```typescript
interface VisitedLink {
  url: string;
  title?: string;
  timestamp: number;
}
```

#### Key Features

- **Maximum Display:** Shows up to 10 most recent sites
- **External Links:** Opens in new tab with icon
- **URL Formatting:** Truncates long URLs intelligently
- **Clear All:** Bulk delete button
- **Empty State:** Returns null when no history

---

### 12. SmoothScrollProvider

**File:** [components/SmoothScrollProvider.tsx](components/SmoothScrollProvider.tsx)

**Purpose:** Global smooth scrolling provider using Lenis library.

#### Props

```typescript
{
  children: React.ReactNode;  // App content
}
```

#### Key Features

- **Lenis Integration:** Momentum-based smooth scrolling
- **Global Instance:** Exposed on `window.lenis` for programmatic scrolling
- **Customized Easing:** Custom easing function for smooth deceleration
- **Vertical Only:** Configured for vertical scrolling
- **Auto-cleanup:** Destroys instance on unmount

#### Configuration

```typescript
{
  duration: 0.8,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false
}
```

---

### 13. VoiceSearchButton

**File:** [components/VoiceSearchButton.tsx](components/VoiceSearchButton.tsx)

**Purpose:** Voice search button with speech recognition modal.

#### Props

```typescript
interface VoiceSearchButtonProps {
  onVoiceResult: (text: string) => void;  // Callback with transcribed text
  disabled?: boolean;                     // Disable voice search
}
```

#### Key Features

- **Web Speech API:** Uses browser's speech recognition
- **Browser Support Detection:** Checks for API availability
- **Real-time Transcription:** Shows interim and final results
- **Modal Overlay:** Full-screen modal during listening
- **Animated Microphone:** Pulsing animation while listening
- **Error Handling:** Specific messages for different errors
- **Auto-submit:** Submits search when speech finalized
- **Mobile Responsive:** Adaptive sizing

#### State Management

- `isListening: boolean` - Recording state
- `isSupported: boolean` - Browser support
- `transcript: string` - Transcribed text
- `error: string | null` - Error message

#### Speech Recognition Errors

- `no-speech`: No speech detected
- `audio-capture`: No microphone found
- `not-allowed`: Microphone access denied
- Generic fallback for other errors

#### Sub-components

- **VoiceSearchModal:** Full-screen listening UI with pulsing animation

---

## UI Components

### 1. Alert

**File:** [components/ui/Alert.tsx](components/ui/Alert.tsx)

**Purpose:** Status message display component with color variants.

#### Props

```typescript
interface AlertProps {
  variant: 'error' | 'success' | 'warning' | 'info';
  children: ReactNode;           // Alert content
  className?: string;            // Additional CSS classes
}
```

#### Variants

- **error:** Red background/border/text
- **success:** Green background/border/text
- **warning:** Yellow background/border/text
- **info:** Blue background/border/text

#### Styling

- Semi-transparent backgrounds with alpha channels
- Border matching variant color
- Rounded corners with padding
- Fade-in animation
- Role="alert" for accessibility

---

### 2. Button

**File:** [components/ui/Button.tsx](components/ui/Button.tsx)

**Purpose:** Versatile button component with multiple variants and states.

#### Props

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;             // Show spinner
  leftIcon?: ReactNode;          // Icon before text
  rightIcon?: ReactNode;         // Icon after text
  fullWidth?: boolean;           // Full width button
}
```

#### Variants

- **primary:** Green gradient background
- **secondary:** Border with hover background
- **ghost:** Transparent with hover background
- **danger:** Red background for destructive actions

#### Sizes

- **sm:** `px-2.5 py-1.5 text-xs` (responsive)
- **md:** `px-3 py-1.5 text-xs` (responsive)
- **lg:** `px-4 py-2 text-sm` (responsive)

#### Features

- Gradient backgrounds for primary/danger
- Loading spinner replaces left icon
- Disabled state (opacity 50%)
- Focus outline removed (custom focus styles)
- Responsive padding and text sizes
- Smooth transitions (300ms)

---

### 3. Card

**File:** [components/ui/Card.tsx](components/ui/Card.tsx)

**Purpose:** Glassmorphism card container with optional hover effects.

#### Props

```typescript
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;            // Enable hover glow effect
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}
```

#### Padding Options

- **none:** No padding
- **sm:** `p-3`
- **md:** `p-4`
- **lg:** `p-5`

#### Features

- Glassmorphism effect (`.glass-card` class)
- Optional hover effect (`.card-hover` class)
- Rounded corners (rounded-2xl)
- Backdrop blur
- Border with low opacity

---

### 4. Dropdown

**File:** [components/ui/Dropdown.tsx](components/ui/Dropdown.tsx)

**Purpose:** Select dropdown with keyboard navigation and animations.

#### Props

```typescript
interface DropdownProps<T> {
  value: T;                       // Current selection
  options: DropdownOption<T>[];   // Available options
  onChange: (value: T) => void;   // Selection callback
  label?: string;                 // Label prefix
  className?: string;             // Additional classes
}

interface DropdownOption<T> {
  value: T;
  label: string;
}
```

#### Features

- **Auto-close:** Click outside, ESC, or scroll
- **Animations:** Scale-in/out transitions
- **Keyboard Navigation:** ESC to close
- **Current Selection:** Highlighted with green background
- **Chevron Icon:** Rotates when open
- **Hover Effects:** Green gradient on hover
- **Accessible:** ARIA attributes (expanded, haspopup, listbox)

---

### 5. Input

**File:** [components/ui/Input.tsx](components/ui/Input.tsx)

**Purpose:** Styled text input with icon support and glow effects.

#### Props

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;          // Icon on left
  rightIcon?: ReactNode;         // Icon on right
  glowBorder?: boolean;          // Enable glow effect
  error?: boolean;               // Error state
  fullWidth?: boolean;           // Full width (default: true)
}
```

#### Features

- **Icon Support:** Left and right icons with absolute positioning
- **Glow Border:** Optional animated glow effect
- **Error State:** Red border when error prop is true
- **Focus States:** Ring and border color changes
- **Backdrop Blur:** Glassmorphism effect
- **Responsive:** Adaptive padding for icons

---

### 6. Modal

**File:** [components/ui/Modal.tsx](components/ui/Modal.tsx)

**Purpose:** Centered modal dialog with backdrop blur and animations.

#### Props

```typescript
interface ModalProps {
  show: boolean;                 // Visibility state
  onClose: () => void;          // Close callback
  title?: ReactNode;            // Modal title
  children: ReactNode;          // Modal content
  maxWidth?: string;            // Max width class (default: 'max-w-195')
  preventClose?: boolean;       // Prevent closing (e.g., during loading)
}
```

#### Features

- **Portal Rendering:** Renders to document.body
- **Backdrop Click:** Closes on backdrop click
- **ESC Key:** Closes on Escape key
- **Body Scroll Lock:** Prevents scrolling when open
- **Animations:** Fade-in/out for backdrop, scale-in/out for dialog
- **SSR Safe:** Checks for mounting before rendering
- **Close Button:** X button in header
- **Responsive:** Adapts for mobile with max-height

---

### 7. Spinner

**File:** [components/ui/Spinner.tsx](components/ui/Spinner.tsx)

**Purpose:** Loading spinner with consistent styling.

#### Props

```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'white';
  className?: string;
}
```

#### Sizes

- **sm:** `w-4 h-4 border-2`
- **md:** `w-6 h-6 border-2`
- **lg:** `w-8 h-8 border-3`

#### Colors

- **green:** `border-green-500` with transparent top
- **white:** `border-white` with transparent top

#### Features

- Circular spinner with rotating animation
- Transparent top border for spinning effect
- ARIA role="status" and label="Loading"

---

## Search Components

### 1. AISummaryPanel

**File:** [components/search/AISummaryPanel.tsx](components/search/AISummaryPanel.tsx)

**Purpose:** Slide-in side panel displaying AI-generated summary for a search result.

#### Props

```typescript
interface AISummaryPanelProps {
  show: boolean;                 // Panel visibility
  onClose: () => void;          // Close callback
  result: SearchResult;         // Result to summarize
}
```

#### Key Features

- **Slide-in Animation:** Animates from right side
- **AI Summary Fetch:** Calls `getResultSummary(cord_uid)` API
- **Markdown Rendering:** ReactMarkdown with remark-gfm
- **Rate Limiting:** Integrates with `useAIRateLimit` hook
- **Cache Detection:** Doesn't count cached responses against rate limit
- **Error Handling:** Shows error with retry option
- **Loading State:** Spinner with message
- **Portal Rendering:** Renders to document.body
- **Scroll Prevention:** Prevents body scroll, disables Lenis
- **ESC to Close:** Keyboard shortcut

#### State Management

- `loading: boolean` - Fetching summary
- `summary: string | null` - AI-generated summary
- `error: string | null` - Error message
- `isClosing: boolean` - Animation state

#### Special Error Handling

- `NO_ABSTRACT_AVAILABLE`: Special message and no retry option
- Generic errors: Show retry button

---

### 2. ExternalLinkIcon

**File:** [components/search/ExternalLinkIcon.tsx](components/search/ExternalLinkIcon.tsx)

**Purpose:** Simple SVG icon for external links.

#### Props

```typescript
interface ExternalLinkIconProps {
  size?: number;               // Icon size (default: 14)
  className?: string;          // CSS classes
}
```

#### Features

- SVG icon with customizable size
- Lucide-style stroke design
- `aria-hidden` for accessibility
- Inherits color from parent

---

### 3. Pagination

**File:** [components/search/Pagination.tsx](components/search/Pagination.tsx)

**Purpose:** Pagination controls for navigating through search results.

#### Props

```typescript
interface PaginationProps {
  currentPage: number;          // Current page (1-indexed)
  totalPages: number;           // Total page count
  onPageChange: (page: number) => void;  // Page change callback
  maxButtons?: number;          // Max page buttons (default: 10)
}
```

#### Key Features

- **Smart Button Display:**
  - Shows 10 buttons on desktop
  - Shows 5 buttons on mobile
  - Centers around current page
- **Navigation:**
  - First page: «
  - Previous: ‹
  - Page numbers: 1, 2, 3...
  - Next: ›
  - Last page: »
- **Active State:** Green gradient for current page
- **Disabled State:** Grayed out when at boundaries
- **Page Counter:** "Page X of Y" display
- **Responsive:** Adapts button count and sizing
- **Auto-hide:** Returns null if only 1 page

---

### 4. ResultCard

**File:** [components/search/ResultCard.tsx](components/search/ResultCard.tsx)

**Purpose:** Individual search result card with favicon, title, and links.

#### Props

```typescript
interface ResultCardProps {
  result: SearchResult;                    // Result data
  index?: number;                          // Animation delay index
  isVisited?: boolean;                     // Visited status
  onVisit?: (url: string, title: string) => void;  // Visit callback
}
```

#### Key Features

- **Favicon Display:** Fetches and shows site favicon
- **Visited Badge:** Green "Recently viewed" badge
- **Staggered Animation:** Delay based on index (60ms * index)
- **Byline Formatting:** Author, date, journal info
- **External Link Button:** "View at domain.com"
- **AI Summary Button:** Opens AISummaryPanel
- **Error Handling:** Hides favicon on load error
- **Glassmorphism:** Card with hover effect
- **Responsive Layout:** Adapts for mobile/desktop

#### Domain Extraction

- Uses `safeHostname()` utility
- Displays shortened domain name in button

#### Sub-components

- Integrates `AISummaryPanel` for AI summaries

---

## Stats Page Components

### 1. BarChart

**File:** [app/stats/components/BarChart.tsx](app/stats/components/BarChart.tsx)

**Purpose:** Horizontal bar chart for displaying metric comparisons.

#### Props

```typescript
interface BarChartProps {
  label: string;                          // Chart title
  data: Array<{
    label: string;
    value: number;
    color: string;                        // CSS color or gradient
  }>;
  maxValue?: number;                      // Override max value
}
```

#### Key Features

- **Horizontal Bars:** Width based on percentage of max
- **Value Display:** Shows count and percentage
- **Gradient Support:** Handles CSS gradients in color prop
- **Empty State:** "No data available yet" message
- **Animated Bars:** 1-second duration transitions
- **Label Positioning:**
  - Inside bar if > 15% width
  - Outside bar if ≤ 15% width
- **Responsive:** Adapts for mobile
- **Min Width:** 2% minimum for visibility

---

### 2. ChartCard

**File:** [app/stats/components/ChartCard.tsx](app/stats/components/ChartCard.tsx)

**Purpose:** Enhanced cache hit rate display with progress bar and statistics.

#### Props

```typescript
interface ChartCardProps {
  label: string;                          // Card title
  percentage: number;                     // Hit rate (0-1)
  hits: number;                           // Cache hits count
  misses: number;                         // Cache misses count
  color: 'emerald' | 'blue' | 'violet';   // Color theme
}
```

#### Key Features

- **Gradient Progress Bar:** Animated gradient fill
- **Pulsing Indicator:** Animated dot by percentage
- **Total Requests:** Shows sum of hits and misses
- **Legend Grid:** 2-column grid with hit/miss details
- **Icon Integration:** Checkmark for hits, X for misses
- **Percentage Breakdown:** Shows percentage for each category
- **Color Themes:**
  - Emerald: Default cache
  - Blue: Alternative theme
  - Violet: Alternative theme
- **Glow Effects:** Colored shadows matching theme

---

### 3. DonutChart

**File:** [app/stats/components/DonutChart.tsx](app/stats/components/DonutChart.tsx)

**Purpose:** Circular donut chart for cache hit rate visualization.

#### Props

```typescript
interface DonutChartProps {
  label: string;
  percentage: number;
  hits: number;
  misses: number;
  color: 'emerald' | 'blue' | 'violet';
}
```

#### Key Features

- **SVG Donut:** Circular progress indicator
- **Center Text:** Large percentage display
- **Animated Arc:** 1-second transition
- **Stats List:** Hit/miss breakdown below chart
- **Color Themes:** Matches ChartCard colors
- **Calculations:**
  - Circle circumference: `2 * π * radius`
  - Offset for percentage: `circumference * (1 - percentage)`
- **Rounded Caps:** Smooth line endings

#### SVG Configuration

- Size: 160px
- Stroke width: 12px
- Radius: Calculated for proper fit
- Rotation: -90° for top start position

---

### 4. FeedbackCard

**File:** [app/stats/components/FeedbackCard.tsx](app/stats/components/FeedbackCard.tsx)

**Purpose:** Display individual feedback entry with styling based on type.

#### Props

```typescript
interface FeedbackCardProps {
  feedback: FeedbackEntry;        // Feedback data
  index: number;                  // Card number
}

interface FeedbackEntry {
  message: string;
  email?: string;
  type: 'anonymous' | 'replyable';
  timestamp: string;              // ISO date string
}
```

#### Key Features

- **Type-based Styling:**
  - Replyable: Green border and background
  - Anonymous: Gray border and background
- **Avatar Display:**
  - Replyable: First letter of email
  - Anonymous: Index number (#1, #2, etc.)
- **Timestamp:** Human-readable "time ago" format
- **Email Badge:** Shows email for replyable feedback
- **Icons:** Mail icon for replyable type
- **Word Wrap:** Handles long messages
- **Responsive:** Adapts for mobile/desktop

#### Utilities Used

- `formatDistanceToNow()` for timestamps

---

### 5. MetricCard

**File:** [app/stats/components/MetricCard.tsx](app/stats/components/MetricCard.tsx)

**Purpose:** Display single metric with trend indicator.

#### Props

```typescript
interface MetricCardProps {
  label: string;                          // Metric name
  value: string;                          // Metric value (formatted)
  subtitle?: string;                      // Additional info
  trend?: 'positive' | 'negative' | 'neutral';
  large?: boolean;                        // Larger value display
}
```

#### Key Features

- **Trend Indicators:**
  - Positive: Up arrow, emerald colors
  - Negative: Down arrow, red colors
  - Neutral: Bar chart icon, slate colors
- **Size Options:**
  - Normal: 3xl font size
  - Large: 5xl font size
- **Tabular Numbers:** Consistent digit spacing
- **Subtitle Display:** Optional additional information
- **Color Coding:**
  - Border and background match trend
  - Hover effects enhance colors

---

### 6. QuotaCard

**File:** [app/stats/components/QuotaCard.tsx](app/stats/components/QuotaCard.tsx)

**Purpose:** Display API quota usage with animated progress bar.

#### Props

```typescript
interface QuotaCardProps {
  remaining: number;              // Remaining calls
  consumed: number;               // Consumed calls
}
```

#### Key Features

- **Dual Display:**
  - Top: Remaining calls and usage percentage
  - Bottom: 3-column breakdown (Total, Consumed, Remaining)
- **Color-coded Progress:**
  - < 50% used: Green (emerald)
  - 50-80% used: Yellow (amber)
  - > 80% used: Red
- **Animated Bar:**
  - Gradient fill
  - Pulsing overlay
  - 700ms transition duration
- **Percentage Inside Bar:** Shows if > 10% width
- **Visual Separator:** Gradient line above stats grid
- **Responsive Numbers:** Locale-formatted thousands

#### Color Logic

```typescript
if (usedPercentage < 50) return 'emerald';
if (usedPercentage < 80) return 'amber';
return 'red';
```

---

## Component Dependencies

### Shared Dependencies

Most components use these common dependencies:

- **React:** Core library (useState, useEffect, useCallback, etc.)
- **Lucide React:** Icon library
- **@/lib/utils:** Utility functions (cn, formatters, etc.)
- **@/lib/types:** TypeScript type definitions
- **@/lib/api:** API integration functions

### UI Component Pattern

All UI components follow these patterns:

1. **TypeScript:** Fully typed with interfaces
2. **Forwarded Refs:** Support ref forwarding where applicable
3. **Variants:** Multiple style variants
4. **Responsive:** Mobile-first responsive design
5. **Animations:** Smooth transitions (200-300ms)
6. **Accessibility:** ARIA attributes and semantic HTML

### Animation Classes

Common animation classes used:

- `animate-fade-in`: Fade in effect
- `animate-fade-out`: Fade out effect
- `animate-scale-in`: Scale up animation
- `animate-scale-out`: Scale down animation
- `animate-fade-in-up`: Slide up with fade
- `animate-pulse`: Pulsing effect
- `animate-spin`: Rotating spinner

### Styling Pattern

All components use:

- **Tailwind CSS:** Utility-first CSS framework
- **Glassmorphism:** Backdrop blur effects
- **Dark Theme:** Dark backgrounds with light text
- **Green Accent:** Primary color (#10b981 / green-500)
- **Responsive Breakpoints:** sm (640px), md (768px), lg (1024px)

---

## State Management Patterns

### Local State

Components use React hooks for state:

- `useState`: Component-level state
- `useRef`: DOM references and mutable values
- `useEffect`: Side effects and lifecycle
- `useCallback`: Memoized callbacks

### Custom Hooks

Several components use custom hooks:

- `useRecentSearches`: Search history management
- `useSuggestions`: Autocomplete suggestions
- `useVisitedLinks`: Link visit tracking
- `useAIRateLimit`: AI request rate limiting
- `useAdminAccess`: Admin authentication

### Props vs State

- **Props:** Data passed from parent (queries, results, callbacks)
- **State:** Local UI state (modals, loading, errors, animations)

---

## Styling Guidelines

### Color Palette

- **Background:** Black (#000000) to dark gray (#1a1a1a)
- **Surfaces:** White with 5% opacity (white/5)
- **Borders:** White with 10-20% opacity
- **Text Primary:** White (#ffffff)
- **Text Secondary:** Gray 300-400 (#d1d5db, #9ca3af)
- **Accent:** Green 400-600 (#34d399, #10b981, #059669)
- **Error:** Red 400-500 (#f87171, #ef4444)
- **Warning:** Yellow/Amber 400-500

### Typography

- **Font Family:** Inter (loaded via Geist font)
- **Headings:** Bold, white/90 opacity
- **Body:** Regular, gray-300
- **Code:** Monospace, green-300, bg white/5

### Spacing

- **Card Padding:** p-3 (sm), p-4 (md), p-5 (lg)
- **Button Padding:** px-3 py-2 (base), responsive variants
- **Gap Between Elements:** gap-2, gap-3, gap-4
- **Margin Top:** mt-3, mt-4, mt-5, mt-6

### Border Radius

- **Small:** rounded-lg (0.5rem)
- **Medium:** rounded-xl (0.75rem)
- **Large:** rounded-2xl (1rem)
- **Full:** rounded-full (9999px)

---

## Accessibility Features

### Semantic HTML

- `<button>` for clickable elements
- `<nav>` for navigation
- `<main>` for main content
- `<article>` for result cards

### ARIA Attributes

- `role="dialog"` for modals
- `role="alert"` for alerts
- `aria-label` for icon buttons
- `aria-expanded` for dropdowns
- `aria-current` for pagination

### Keyboard Navigation

- **Tab:** Navigate between interactive elements
- **Enter:** Activate buttons, submit forms
- **Escape:** Close modals and dropdowns
- **Arrow Keys:** Navigate suggestions

### Screen Reader Support

- Alternative text for images
- Descriptive button labels
- Status messages for loading states
- Hidden icons with `aria-hidden`

---

## Performance Optimizations

### React Optimizations

- `useMemo`: Memoize expensive calculations
- `useCallback`: Prevent unnecessary re-renders
- `React.memo`: Memoize components (where beneficial)

### Lazy Loading

- Next.js Image component for optimized images
- Portal rendering for modals (avoids layout shifts)

### Debouncing

- Search input: Debounced API calls
- Suggestions: Debounced fetching

### Animation Performance

- CSS transforms (scale, translate) for 60fps
- `will-change` for animated elements
- GPU acceleration with transform3d

---

## Testing Recommendations

### Unit Tests

Test each component in isolation:

1. **Props:** Verify all props are respected
2. **State:** Test state changes and side effects
3. **Events:** Test callbacks and user interactions
4. **Rendering:** Test conditional rendering
5. **Accessibility:** Test ARIA attributes and keyboard nav

### Integration Tests

Test component interactions:

1. **Search Flow:** Query → Results → Pagination
2. **Modal Flow:** Open → Interact → Close
3. **Settings Flow:** Open → Modify → Save

### E2E Tests

Test full user journeys:

1. Search for documents
2. View results and navigate pages
3. Open AI summary
4. Submit feedback
5. View site history

---

## Future Enhancements

### Potential Improvements

1. **Virtualization:** Virtual scrolling for large result sets
2. **Infinite Scroll:** Alternative to pagination
3. **Keyboard Shortcuts:** Global shortcuts (Cmd+K for search)
4. **Theme Toggle:** Light/dark mode switching
5. **Customization:** User preferences for layout
6. **Export:** Export search results to CSV/JSON
7. **Advanced Filters:** More filter options
8. **Search History:** Search across history
9. **Saved Searches:** Bookmark favorite searches
10. **Notifications:** Toast notifications for actions

### Component Additions

1. **Tooltip:** Hover tooltips for info
2. **Badge:** Status badges for counts
3. **Tabs:** Tabbed navigation
4. **Accordion:** Collapsible sections
5. **Drawer:** Slide-out panel (alternative to modal)
6. **Select:** Multi-select dropdown
7. **DatePicker:** Calendar date picker
8. **Table:** Data table with sorting

---

## Conclusion

This documentation covers all 30+ components in the NextSearch application. Each component is designed with:

- **Modularity:** Self-contained and reusable
- **Accessibility:** WCAG compliant
- **Performance:** Optimized for speed
- **Responsiveness:** Mobile-first design
- **Maintainability:** Clean code with TypeScript

For implementation details, refer to the individual component files in the codebase.

---

**Last Updated:** January 25, 2026
