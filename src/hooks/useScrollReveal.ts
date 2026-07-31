import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal
 * ──────────────────────────────────────────────────────────────────
 * Detects when a container element enters the viewport using
 * IntersectionObserver, then fires `isVisible = true` exactly once
 * per session (does not re-trigger on scroll-back).
 *
 * @param threshold  Fraction of element that must be visible before
 *                   triggering (0.0 – 1.0). Default 0.2 = 20%.
 */
export function useScrollReveal(threshold = 0.2) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If user prefers reduced motion, mark visible immediately (no animation)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect after first trigger so it never re-fires
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
