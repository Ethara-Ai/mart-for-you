import { useState, useEffect } from 'react';

/**
 * useReducedMotion - Custom hook to detect user's reduced motion preference
 *
 * Returns true if the user has enabled "reduce motion" in their OS settings.
 * This is important for accessibility - users with vestibular disorders may
 * experience discomfort with animations.
 *
 * @returns {boolean} True if user prefers reduced motion
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 *
 * // Use in framer-motion
 * <motion.div
 *   initial={prefersReducedMotion ? false : { opacity: 0 }}
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
 * />
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') {
      return false;
    }
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    return mediaQuery?.matches ?? false;
  });

  useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Handle null mediaQuery result
    if (!mediaQuery) {
      return;
    }

    // Handler for preference changes
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    // Listen for changes
    // Use addEventListener for modern browsers, addListener for older ones
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

export default useReducedMotion;
