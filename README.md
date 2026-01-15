# NextSearch - Web Frontend

A modern, scalable search engine frontend built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

## Features

- ⚡ Fast search with real-time autocomplete
- 📊 Statistics dashboard with index metrics
- 📚 Documentation for search tips and API
- 👥 About page with team information
- 🔍 Recent search history
- 🎨 Dark mode glassmorphism UI

## Getting Started

1. Make sure you're in the frontend directory:

```bash
cd NextSearch-web
```

2. Create a `.env.local` file with your API endpoint:

```bash
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
NextSearch-web/
├── app/              # Next.js App Router pages
│   ├── about/        # About/Team page
│   ├── docs/         # Documentation page
│   ├── stats/        # Statistics page
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home/Search page
├── components/       # React components
│   ├── ui/           # Reusable UI components
│   └── search/       # Search-related components
├── hooks/            # Custom React hooks
├── lib/              # Utilities, types, API client
└── public/           # Static assets
```

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS
- **Lucide React** - Icon library


DO NOT TOUCH!
I'm going to use azure openAI and deploy and get the keys in this format in .env file:

AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_MODEL=gpt-5.2-chat

Assume I have




