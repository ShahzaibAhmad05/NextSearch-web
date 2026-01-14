// components/SmoothScrollProvider.tsx
'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * Smooth scroll provider using Lenis for momentum-based scrolling.
 * Provides buttery smooth scrolling experience across the entire app.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Expose lenis instance globally for programmatic scrolling
    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis;
    }

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
      if (typeof window !== 'undefined') {
        delete (window as any).lenis;
      }
    };
  }, []);

  return <>{children}</>;
}
