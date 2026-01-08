import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ANIMATION } from '../constants';

/**
 * useNavigateToSection - Custom hook for navigating to a page and scrolling to a section
 *
 * Encapsulates the common pattern of navigating to a route and then
 * smoothly scrolling to a specific section on that page.
 *
 * @returns {Function} navigateToSection - Function to navigate and scroll
 *
 * @example
 * const navigateToSection = useNavigateToSection();
 * navigateToSection('/home', 'hero-section');
 */
export function useNavigateToSection() {
  const navigate = useNavigate();

  /**
   * Navigate to a path and scroll to a section
   * @param {string} path - The route path to navigate to
   * @param {string} [sectionId] - Optional section ID to scroll to
   * @param {Object} [options] - Optional configuration
   * @param {Function} [options.onBeforeNavigate] - Callback before navigation
   * @param {ScrollBehavior} [options.behavior='smooth'] - Scroll behavior
   */
  const navigateToSection = useCallback(
    (path, sectionId, options = {}) => {
      const { onBeforeNavigate, behavior = 'smooth' } = options;

      // Execute callback before navigation if provided
      if (onBeforeNavigate && typeof onBeforeNavigate === 'function') {
        onBeforeNavigate();
      }

      navigate(path);

      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        if (sectionId) {
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior, block: 'start' });
            return;
          }
        }
        // Fallback to top of page
        window.scrollTo({ top: 0, behavior });
      }, ANIMATION.NAVIGATION_SCROLL_DELAY);
    },
    [navigate],
  );

  return navigateToSection;
}

export default useNavigateToSection;
