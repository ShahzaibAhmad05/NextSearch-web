// app/layout.tsx

import type { Metadata } from 'next';
import type { Viewport } from 'next';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'NextSearch',
  description: 'Search across 1M+ Cord19 research papers',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
