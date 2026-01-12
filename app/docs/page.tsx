// app/docs/page.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft, Search, Zap, SlidersHorizontal, Upload, BookOpen, Code, Terminal } from 'lucide-react';
import { Card } from '@/components/ui';

// ─────────────────────────────────────────────────────────────────────────────
// Documentation Content
// ─────────────────────────────────────────────────────────────────────────────

const searchTips = [
  {
    title: 'Basic Search',
    description: 'Simply type your query and press Enter. NextSearch will find the most relevant documents.',
    example: 'coronavirus treatment',
  },
  {
    title: 'Multi-word Queries',
    description: 'Use multiple words to narrow down results. All words are considered for relevance.',
    example: 'vaccine efficacy trials',
  },
  {
    title: 'Exact Phrases',
    description: 'The search considers word proximity for better matching of related terms.',
    example: 'respiratory syndrome',
  },
  {
    title: 'Result Count',
    description: 'Use the advanced options slider to adjust how many results to retrieve (1-1000).',
    example: 'Set K=50 for faster results',
  },
];

const features = [
  {
    icon: Search,
    title: 'Ranked Retrieval',
    description: 'Results are ranked using BM25 algorithm combined with custom scoring factors including recency and document quality.',
  },
  {
    icon: Zap,
    title: 'Autocomplete',
    description: 'As you type, suggestions appear based on common queries and indexed terms. Use arrow keys to navigate and Enter to select.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Sorting Options',
    description: 'Sort results by relevancy (default), newest publication date, or oldest publication date.',
  },
  {
    icon: Upload,
    title: 'Document Upload',
    description: 'Add new CORD-19 document slices to the index. Upload a properly structured ZIP file to expand the searchable corpus.',
  },
];

const architecture = [
  {
    title: 'Lexicon',
    description: 'A vocabulary of all unique terms in the corpus with their document frequencies.',
  },
  {
    title: 'Forward Index',
    description: 'Maps each document to its constituent terms and their positions.',
  },
  {
    title: 'Inverted Index',
    description: 'Maps each term to the list of documents containing it, enabling fast lookups.',
  },
  {
    title: 'Barrel Partitioning',
    description: 'Index is divided into barrels for parallel processing and efficient memory usage.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title }: { icon: typeof Search; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
        <Icon size={24} className="text-indigo-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Search</span>
          </Link>
          
          <Link href="/" className="text-xl font-bold">
            <span className="gradient-text">Next</span>
            <span className="text-white">Search</span>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down opacity-0" style={{ animationDelay: '100ms' }}>
              <span className="gradient-text">Documentation</span>
            </h1>
            <p className="text-xl text-gray-400 animate-blur-in opacity-0" style={{ animationDelay: '300ms' }}>
              Learn how to use NextSearch effectively
            </p>
          </div>

          {/* Quick Start */}
          <section className="mb-12 animate-fade-in-left opacity-0" style={{ animationDelay: '400ms' }}>
            <SectionHeader icon={Terminal} title="Quick Start" />
            <Card padding="lg">
              <ol className="space-y-4 text-gray-300">
                <li className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <p className="font-medium text-white">Enter your search query</p>
                    <p className="text-sm text-gray-400">Type keywords related to the documents you&apos;re looking for</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <p className="font-medium text-white">Press Enter or select a suggestion</p>
                    <p className="text-sm text-gray-400">Use the autocomplete dropdown for faster searching</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <p className="font-medium text-white">Browse and sort results</p>
                    <p className="text-sm text-gray-400">Click on any result to view the original document</p>
                  </div>
                </li>
              </ol>
            </Card>
          </section>

          {/* Search Tips */}
          <section className="mb-12 animate-fade-in-right opacity-0" style={{ animationDelay: '600ms' }}>
            <SectionHeader icon={BookOpen} title="Search Tips" />
            <div className="grid gap-4">
              {searchTips.map((tip, idx) => (
                <Card key={idx} padding="md" className={`animate-slide-up-fade opacity-0`} style={{ animationDelay: `${700 + idx * 100}ms` }}>
                  <h3 className="font-semibold text-white mb-1">{tip.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{tip.description}</p>
                  <code className="text-xs bg-white/5 px-2 py-1 rounded text-indigo-300">
                    {tip.example}
                  </code>
                </Card>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="mb-12 animate-fade-in-left opacity-0" style={{ animationDelay: '1100ms' }}>
            <SectionHeader icon={Zap} title="Features" />
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card key={idx} padding="md" className={`animate-scale-in opacity-0`} style={{ animationDelay: `${1200 + idx * 100}ms` }}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 p-2 rounded-lg bg-white/5">
                        <Icon size={20} className="text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Architecture */}
          <section className="mb-12 animate-fade-in-right opacity-0" style={{ animationDelay: '1600ms' }}>
            <SectionHeader icon={Code} title="How It Works" />
            <Card padding="lg" className="animate-blur-in opacity-0" style={{ animationDelay: '1700ms' }}>
              <p className="text-gray-400 mb-6">
                NextSearch uses a three-tier indexing architecture for efficient document retrieval:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {architecture.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-xl bg-white/5 animate-slide-up-fade opacity-0`} style={{ animationDelay: `${1800 + idx * 100}ms` }}>
                    <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* API Info */}
          <section className="animate-fade-in-down opacity-0" style={{ animationDelay: '2200ms' }}>
            <SectionHeader icon={Terminal} title="API Endpoints" />
            <Card padding="lg" className="animate-blur-in opacity-0" style={{ animationDelay: '2300ms' }}>
              <div className="space-y-4 font-mono text-sm">
                <div className="p-3 rounded-lg bg-white/5 animate-fade-in-left opacity-0" style={{ animationDelay: '2400ms' }}>
                  <span className="text-green-400">GET</span>{' '}
                  <span className="text-gray-300">/search?q=query&k=100</span>
                  <p className="text-gray-500 mt-1 font-sans text-xs">Search for documents</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 animate-fade-in-left opacity-0" style={{ animationDelay: '2500ms' }}>
                  <span className="text-green-400">GET</span>{' '}
                  <span className="text-gray-300">/suggest?q=query&k=5</span>
                  <p className="text-gray-500 mt-1 font-sans text-xs">Get autocomplete suggestions</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 animate-fade-in-left opacity-0" style={{ animationDelay: '2600ms' }}>
                  <span className="text-yellow-400">POST</span>{' '}
                  <span className="text-gray-300">/add_document</span>
                  <p className="text-gray-500 mt-1 font-sans text-xs">Upload a CORD-19 slice</p>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>© 2026 NextSearch. Built with ❤️ at NUST.</p>
      </footer>
    </div>
  );
}
