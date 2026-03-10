// lib/utils/scroll.ts

/**
 * Scroll to top of page using Lenis if available, otherwise fallback to window.scrollTo
 */
export function scrollToTop(smooth: boolean = true) {
  if (typeof window === 'undefined') return;

  // Use Lenis for smooth scrolling if available
  if ((window as any).lenis) {
    (window as any).lenis.scrollTo(0, { duration: 0.8, immediate: !smooth });
  } else {
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  }
}
