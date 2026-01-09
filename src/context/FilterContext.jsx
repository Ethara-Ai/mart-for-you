import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../constants';

// Create the Filter Context
const FilterContext = createContext(null);

/**
 * FilterProvider - Centralized state management for product filtering
 *
 * Consolidates activeCategory and viewingOffers state that was previously
 * duplicated across App.jsx, HomePage.jsx, and ProductsPage.jsx.
 * Uses URL search params as the source of truth for category to enable
 * deep linking and browser history support.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function FilterProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get category from URL or default to 'all'
  const activeCategory = searchParams.get('category') || CATEGORIES.ALL;

  // Offers state (not persisted in URL for simplicity)
  const [viewingOffers, setViewingOffers] = useState(false);

  /**
   * Set the active category
   * Updates URL params for deep linking support
   * @param {string} category - The category to set
   */
  const setActiveCategory = useCallback(
    (category) => {
      setViewingOffers(false);

      const newParams = new URLSearchParams(searchParams);
      if (category === CATEGORIES.ALL) {
        newParams.delete('category');
      } else {
        newParams.set('category', category);
      }
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  /**
   * Enable offers filter view
   * Resets category to 'all' and enables offers filtering
   */
  const enableOffersView = useCallback(() => {
    setViewingOffers(true);

    // Clear category from URL when viewing offers
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  /**
   * Reset all filters to default state
   */
  const resetFilters = useCallback(() => {
    setViewingOffers(false);

    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  /**
   * Check if any filter is active
   * @returns {boolean} True if category is not 'all' or offers view is active
   */
  const hasActiveFilters = useMemo(
    () => activeCategory !== CATEGORIES.ALL || viewingOffers,
    [activeCategory, viewingOffers]
  );

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      activeCategory,
      viewingOffers,
      setActiveCategory,
      enableOffersView,
      resetFilters,
      hasActiveFilters,
    }),
    [
      activeCategory,
      viewingOffers,
      setActiveCategory,
      enableOffersView,
      resetFilters,
      hasActiveFilters,
    ]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

/**
 * useFilter - Custom hook to access filter context
 *
 * @returns {Object} Filter context value
 * @throws {Error} If used outside of FilterProvider
 *
 * @example
 * const { activeCategory, setActiveCategory, viewingOffers, enableOffersView } = useFilter();
 */
export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}

export default FilterContext;
