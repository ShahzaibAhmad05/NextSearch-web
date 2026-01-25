# NextSearch Frontend

A modern, production-ready search engine interface built with Next.js 15, TypeScript, and Tailwind CSS. Features intelligent search with AI-powered overviews, real-time suggestions, advanced filtering, and comprehensive analytics.

## Overview

NextSearch provides a fast, intuitive search experience with enterprise-grade features including AI-generated summaries, voice search, multi-language support, and admin capabilities. Built on Next.js App Router architecture with server-side rendering and optimized client-side state management.

## Core Features

### Search Experience
- **Real-time Autocomplete**: Instant suggestions with 180ms debounce optimization
- **AI Overview**: GPT-powered summaries of search results with rate limiting
- **Voice Search**: Browser-based speech recognition with language selection
- **Smart Filtering**: Language, date range, and domain filters with URL persistence
- **Advanced Sorting**: Relevancy, date, alphabetical, domain sorting
- **Pagination**: Configurable results per page (10-100 items)
- **Recent Searches**: Client-side search history with quick access
- **Visited Links**: Visual indicators for previously viewed results

### User Interface
- **Glassmorphism Design**: Modern frosted-glass aesthetic with backdrop blur
- **Responsive Layout**: Mobile-first design with optimized tablet/desktop views
- **Smooth Scrolling**: Lenis-powered smooth scroll with momentum
- **Loading States**: Skeleton screens and progressive loading
- **Error Handling**: User-friendly error messages with retry mechanisms
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Admin & Analytics
- **Protected Admin Routes**: JWT-based authentication system
- **Statistics Dashboard**: Real-time metrics with interactive charts
- **Document Management**: Add/index documents via admin interface
- **Feedback System**: User feedback collection with API integration
- **Health Monitoring**: Backend health checks with fallback UI

### Advanced Capabilities
- **Result Caching**: Smart caching with cache indicators
- **Non-English Filtering**: Toggle non-English content visibility
- **Markdown Rendering**: Rich content display with GitHub Flavored Markdown
- **URL State Sync**: Deep-linkable searches with query parameters
- **Site History**: Per-domain result history tracking

## Technology Stack

### Core Framework
- **Next.js 15.3.4**: React framework with App Router
- **React 18.3**: UI library with concurrent features
- **TypeScript 5.6**: Static type checking

### Styling & UI
- **Tailwind CSS 4.1**: Utility-first CSS framework
- **PostCSS**: CSS processing pipeline
- **Lucide React**: Lightweight icon library (560+ icons)

### Content & Interaction
- **Lenis 1.3**: Smooth scroll library
- **React Markdown**: Markdown rendering with remark-gfm support

### Development Tools
- **ESLint 9**: Linting with React hooks rules
- **TypeScript ESLint**: TypeScript-specific linting
- **Autoprefixer**: CSS vendor prefixing

## Project Architecture

### Directory Structure

```
nextsearch-web/
├── app/                          # Next.js App Router
│   ├── (home)/                   # Home page grouped route
│   │   ├── components/           # Search UI components
│   │   │   ├── Navbar.tsx        # Main navigation
│   │   │   ├── PreSearchView.tsx # Landing page
│   │   │   ├── PostSearchView.tsx# Results view
│   │   │   └── AdvancedPopover.tsx # Filter controls
│   │   ├── utils/                # Home-specific utilities
│   │   └── types.ts              # Home page types
│   ├── about/                    # About page
│   ├── stats/                    # Analytics dashboard
│   │   └── components/           # Chart components
│   ├── api/                      # API routes
│   │   ├── admin/                # Admin endpoints
│   │   │   ├── login/            # Authentication
│   │   │   ├── logout/           # Session management
│   │   │   ├── verify/           # Token verification
│   │   │   └── example-protected-route/
│   │   └── feedback/             # User feedback
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main search page
│   └── HealthCheckWrapper.tsx    # Backend health monitor
│
├── components/                   # Shared React components
│   ├── ui/                       # Reusable UI primitives
│   │   ├── Alert.tsx             # Alert/notification
│   │   ├── Button.tsx            # Button variants
│   │   ├── Card.tsx              # Container cards
│   │   ├── Dropdown.tsx          # Dropdown menus
│   │   ├── Input.tsx             # Form inputs
│   │   ├── Modal.tsx             # Dialog modals
│   │   └── Spinner.tsx           # Loading spinners
│   ├── search/                   # Search-specific components
│   │   ├── AISummaryPanel.tsx    # AI overview display
│   │   ├── Pagination.tsx        # Result pagination
│   │   ├── ResultCard.tsx        # Individual result
│   │   └── ExternalLinkIcon.tsx  # Link indicator
│   ├── SearchBar.tsx             # Main search input
│   ├── SearchResults.tsx         # Results list
│   ├── SearchFilters.tsx         # Filter controls
│   ├── AIOverview.tsx            # AI summary component
│   ├── RecentSearches.tsx        # Search history
│   ├── SiteHistory.tsx           # Domain-specific history
│   ├── SettingsMenu.tsx          # User settings
│   ├── AddDocumentModal.tsx      # Admin document form
│   ├── FeedbackModal.tsx         # User feedback form
│   ├── VoiceSearchButton.tsx     # Speech recognition
│   ├── Footer.tsx                # Page footer
│   ├── ServerDownPage.tsx        # Error fallback
│   └── SmoothScrollProvider.tsx  # Scroll context
│
├── hooks/                        # Custom React hooks
│   ├── useSearch.ts              # Search state management
│   ├── useSuggestions.ts         # Autocomplete logic
│   ├── useAIOverview.ts          # AI summary fetching
│   ├── useAIRateLimit.ts         # Rate limit tracking
│   ├── useRecentSearches.ts      # Search history
│   ├── useVisitedLinks.ts        # Link tracking
│   ├── useAdminAccess.ts         # Auth state
│   ├── useDebounce.ts            # Debounce utility
│   └── useClickOutside.ts        # Outside click detection
│
├── lib/                          # Core utilities
│   ├── services/                 # API service layer
│   │   ├── search.ts             # Search API
│   │   ├── ai.ts                 # AI API
│   │   ├── admin.ts              # Admin API
│   │   ├── stats.ts              # Analytics API
│   │   ├── document.ts           # Document API
│   │   ├── health.ts             # Health check API
│   │   └── utils.ts              # Service utilities
│   ├── types/                    # TypeScript definitions
│   │   ├── search.ts             # Search types
│   │   ├── ai.ts                 # AI types
│   │   ├── stats.ts              # Analytics types
│   │   ├── document.ts           # Document types
│   │   ├── components.ts         # Component types
│   │   ├── errors.ts             # Error types
│   │   └── shared.ts             # Shared types
│   ├── utils/                    # Helper functions
│   │   ├── formatting.ts         # Text formatting
│   │   ├── date.ts               # Date utilities
│   │   ├── url.ts                # URL manipulation
│   │   ├── language.ts           # Language detection
│   │   └── classnames.ts         # CSS class utilities
│   ├── auth/                     # Authentication
│   ├── api.ts                    # API client
│   ├── constants.ts              # App constants
│   ├── types.ts                  # Shared types
│   └── utils.ts                  # Utility functions
│
├── documentation/                # Developer docs
│   ├── COMPONENT_DOCUMENTATION.md
│   ├── HOOKS_DOCUMENTATION.md
│   ├── LIBRARY_DOCUMENTATION.md
│   └── README.md
│
├── public/                       # Static assets
│   └── images/                   # Image files
│       └── team/                 # Team photos
│
├── .env.local                    # Environment variables
├── next.config.ts                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.mjs            # PostCSS configuration
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.js              # ESLint configuration
└── package.json                  # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager
- Backend API running (default: http://localhost:8080)

### Installation

1. Clone the repository and navigate to the project:
```bash
git clone <repository-url>
cd nextsearch-web
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE=http://localhost:8080
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=securepassword
```

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_BASE` | Backend API URL | Yes | - |
| `NEXT_PUBLIC_ADMIN_USERNAME` | Admin username | No | - |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Admin password | No | - |

### Search Configuration

Edit `lib/constants.ts`:

```typescript
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,           // Min chars for suggestions
  SUGGESTION_DEBOUNCE_MS: 180,   // Suggestion delay
  MAX_SUGGESTIONS: 5,             // Max autocomplete items
  DEFAULT_K: 100,                 // Default result count
  MIN_K: 1,                       // Minimum results
  MAX_K: 1000,                    // Maximum results
  DEFAULT_PAGE_SIZE: 10,          // Items per page
};
```

## Key Components

### Search Flow
1. **SearchBar**: Handles input, voice search, suggestions
2. **SearchFilters**: Manages filters (language, date, domain)
3. **SearchResults**: Displays paginated results with metadata
4. **AIOverview**: Fetches and displays AI-generated summaries
5. **Pagination**: Handles result navigation

### State Management
- URL parameters sync search state for shareable links
- Local storage for recent searches and visited links
- React context for smooth scroll provider
- Custom hooks encapsulate complex state logic

### API Integration
- Centralized API client in `lib/api.ts`
- Service layer pattern in `lib/services/`
- Type-safe request/response handling
- Error boundary and retry logic

## Development

### Scripts
```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style
- TypeScript strict mode enabled
- ESLint with React hooks rules
- Consistent file naming (PascalCase for components)
- Functional components with hooks
- Export types alongside implementations

### Adding a New Component

1. Create component file in `components/`:
```tsx
// components/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export const MyComponent = ({ title }: MyComponentProps) => {
  return <div>{title}</div>;
};
```

2. Export from `components/index.ts`:
```typescript
export { MyComponent } from './MyComponent';
```

3. Import where needed:
```typescript
import { MyComponent } from '@/components';
```

## API Endpoints

### Search
- `GET /search` - Search with query, filters, pagination
- `GET /suggest` - Autocomplete suggestions

### AI Overview
- `POST /ai/overview` - Generate AI summary for query

### Admin
- `POST /api/admin/login` - Authenticate
- `POST /api/admin/logout` - End session
- `GET /api/admin/verify` - Check auth status
- `POST /document/add` - Index new document

### Analytics
- `GET /stats` - System statistics
- `POST /api/feedback` - Submit user feedback

### Health
- `GET /health` - Backend health status

## Performance Optimizations

- **Code Splitting**: Automatic route-based splitting via Next.js
- **Image Optimization**: Next.js Image component with lazy loading
- **Debouncing**: Optimized input handling (180ms suggestions, 350ms k changes)
- **Memoization**: useMemo/useCallback for expensive computations
- **Client-side Caching**: Local storage for searches and visited links
- **Server Components**: Static pages rendered on server
- **Dynamic Imports**: Lazy load heavy components (modals, charts)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible indicators
- Screen reader friendly error messages
- Color contrast WCAG AA compliant

## Contributing

1. Follow existing code structure and naming conventions
2. Write TypeScript with proper type annotations
3. Test changes across different viewport sizes
4. Update documentation for new features
5. Run `npm run lint` before committing

## Documentation

Comprehensive documentation available in `/documentation`:
- **COMPONENT_DOCUMENTATION.md** - Component API reference
- **HOOKS_DOCUMENTATION.md** - Custom hooks guide
- **LIBRARY_DOCUMENTATION.md** - Utility functions reference

Admin documentation:
- **ADMIN_IMPLEMENTATION_SUMMARY.md** - Admin system overview
- **ADMIN_QUICK_REFERENCE.md** - Quick admin guide
- **BACKEND_ADMIN_API.md** - Backend API reference

## License

See LICENSE file for details.

## Support

For issues, questions, or contributions, please open an issue in the repository.



