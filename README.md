# NextSearch Web

A modern search engine frontend built with Next.js 15, React 18, and TypeScript. Gives fast, intelligent search with AI-powered summaries, real-time autocomplete, voice input, and comprehensive filtering options.

## Tech Stack
 
- **Next.js 15.3.4** with App Router
- **React 18.3**
- **TypeScript 5.6**
- **Tailwind CSS 4.1**
- Lenis for smooth scrolling
- React Markdown with GitHub Flavored Markdown
- Lucide React icons

## Local Setup

**Prerequisites**
- Node.js 20.x+
- Backend API running at http://localhost:8080

**Installation**

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

**Environment Variables**

Create a `.env` file in the root directory with the following:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8080
NEXT_PUBLIC_ENSURE_BACKEND_RUNNING=true 
```

**Run Development Server**

```bash
npm run dev
```

Open http://localhost:3000 in your browser to view.
