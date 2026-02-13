# NextSearch Web

A modern search engine frontend built with Next.js 15, React 18, and TypeScript. Delivers fast, intelligent search with AI-powered summaries, real-time autocomplete, voice input, and comprehensive filtering options.

## Features

**Core Search**
- Real-time autocomplete with 180ms debounce
- AI-generated overview summaries for search results
- Voice search with multi-language support
- Advanced filters: language, date range, domain, sorting
- Configurable pagination (10-100 results per page)
- Search history and visited link tracking
- Deep-linkable searches via URL parameters

**User Experience**
- Glassmorphism UI with smooth scrolling (Lenis)
- Responsive mobile-first design
- Skeleton loading states
- Accessible keyboard navigation
- Error boundaries with retry mechanisms
- Markdown rendering for rich content

**Admin & Analytics**
- JWT-protected admin routes
- Real-time statistics dashboard
- Document indexing interface
- User feedback collection
- Backend health monitoring

## Tech Stack

**Framework & Language**
- Next.js 15.3.4 with App Router
- React 18.3
- TypeScript 5.6

**Styling**
- Tailwind CSS 4.1
- PostCSS with Autoprefixer
- Lucide React icons

**Libraries**
- Lenis for smooth scrolling
- React Markdown with GitHub Flavored Markdown
- ESLint 9 with TypeScript support

## Quick Start

**Prerequisites**
- Node.js 20.x+
- Backend API at http://localhost:8080

**Installation**

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API URL and admin credentials

# Start development server
npm run dev
```

Open http://localhost:3000

**Production Build**

```bash
npm run build
npm start
```

## Environment Variables

```env
NEXT_PUBLIC_API_BASE=http://localhost:8080      # Backend API URL (required)
NEXT_PUBLIC_ADMIN_USERNAME=admin                # Admin username (optional)
NEXT_PUBLIC_ADMIN_PASSWORD=securepassword       # Admin password (optional)
```

## Project Structure

```
app/
├── (home)/               # Main search page with components
│   ├── components/       # Navbar, PreSearchView, PostSearchView, AdvancedPopover
│   ├── utils/            # Home-specific utilities
│   └── types.ts          # Type definitions
├── about/                # About page
├── stats/                # Analytics dashboard with charts
├── api/                  # API routes (admin, feedback)
│   ├── admin/            # Authentication endpoints
│   └── feedback/         # User feedback endpoint
├── layout.tsx            # Root layout
└── page.tsx              # Main entry point

components/
├── ui/                   # Reusable primitives (Button, Input, Modal, etc.)
├── search/               # Search components (AISummaryPanel, Pagination, ResultCard)
├── SearchBar.tsx         # Main search input with voice
├── SearchResults.tsx     # Results list
├── SearchFilters.tsx     # Filter controls
├── AIOverview.tsx        # AI summary display
├── RecentSearches.tsx    # Search history
├── AddDocumentModal.tsx  # Admin document form
├── FeedbackModal.tsx     # Feedback form
└── Footer.tsx            # Page footer

hooks/
├── useSearch.ts          # Search state and logic
├── useSuggestions.ts     # Autocomplete
├── useAIOverview.ts      # AI summary fetching
├── useRecentSearches.ts  # Search history management
├── useVisitedLinks.ts    # Link tracking
├── useAdminAccess.ts     # Authentication state
└── useDebounce.ts        # Input debouncing

lib/
├── services/             # API service layer
│   ├── search.ts         # Search API calls
│   ├── ai.ts             # AI API calls
│   ├── admin.ts          # Admin API calls
│   ├── stats.ts          # Analytics API calls
│   └── health.ts         # Health check API
├── types/                # TypeScript definitions
│   ├── search.ts         # Search types
│   ├── ai.ts             # AI types
│   ├── stats.ts          # Analytics types
│   └── shared.ts         # Shared types
├── utils/                # Helper functions
│   ├── formatting.ts     # Text utilities
│   ├── date.ts           # Date formatting
│   ├── url.ts            # URL manipulation
│   └── language.ts       # Language detection
├── api.ts                # Centralized API client
├── constants.ts          # App configuration
└── auth/                 # Authentication utilities
```

## Configuration

Edit `lib/constants.ts` to customize search behavior:

```typescript
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,           // Min chars for autocomplete
  SUGGESTION_DEBOUNCE_MS: 180,   // Autocomplete delay
  MAX_SUGGESTIONS: 5,             // Max autocomplete results
  DEFAULT_K: 100,                 // Default result count
  DEFAULT_PAGE_SIZE: 10,          // Results per page
};
```

## API Integration

**Search**
- `GET /search` - Main search endpoint
- `GET /suggest` - Autocomplete suggestions

**AI**
- `POST /ai/overview` - Generate AI summary

**Admin**
- `POST /api/admin/login` - Authentication
- `POST /api/admin/verify` - Token verification
- `POST /document/add` - Index documents

**Analytics**
- `GET /stats` - System statistics
- `POST /api/feedback` - User feedback

**Health**
- `GET /health` - Backend status

## Development

**Commands**
```bash
npm run dev      # Development server on port 3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

**Code Standards**
- TypeScript strict mode
- Functional components with hooks
- PascalCase for components
- Type-safe API calls
- ESLint with React hooks rules

**Adding Components**

```tsx
// components/NewComponent.tsx
interface NewComponentProps {
  title: string;
  onClick?: () => void;
}

export function NewComponent({ title, onClick }: NewComponentProps) {
  return (
    <button onClick={onClick} className="btn">
      {title}
    </button>
  );
}
```

## Architecture Patterns

**State Management**
- URL params for shareable search state
- Local storage for user preferences
- Custom hooks for complex logic
- React Context for global state

**API Layer**
- Service pattern in `lib/services/`
- Centralized error handling
- Type-safe requests and responses
- Automatic retry logic

**Component Structure**
- UI primitives in `components/ui/`
- Feature components in feature folders
- Shared components at root level
- Co-located types with components

## Performance

- Route-based code splitting
- Image optimization with Next.js Image
- Debounced input handlers (180ms)
- Client-side result caching
- Server-side rendering for static pages
- Dynamic imports for heavy components
- Memoization for expensive computations

## Accessibility

- Semantic HTML5
- ARIA labels on interactive elements
- Keyboard navigation
- Focus indicators
- Screen reader support
- WCAG AA color contrast

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

