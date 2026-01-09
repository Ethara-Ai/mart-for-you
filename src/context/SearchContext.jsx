import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchContext } from './searchContextValue';
import { ROUTES } from '../constants';

/**
 * SearchProvider - Search state management
 *
 * Provides search functionality including search term state,
 * navigation to products page on search, and search clearing.
 * All values are memoized to prevent unnecessary re-renders.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function SearchProvider({ children }) {
  const [searchTerm, setSearchTermState] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handle search term change
   * @param {string} value - New search term
   */
  const setSearchTerm = useCallback((value) => {
    setSearchTermState(value);
  }, []);

  /**
   * Handle search submit
   * Navigates to products page if not already there
   */
  const onSearchSubmit = useCallback(() => {
    // Navigate to products page if not already there
    if (location.pathname !== ROUTES.HOME && location.pathname !== ROUTES.PRODUCTS) {
      navigate(ROUTES.PRODUCTS);
    }
  }, [location.pathname, navigate]);

  /**
   * Clear search term
   */
  const clearSearch = useCallback(() => {
    setSearchTermState('');
  }, []);

  /**
   * Check if search is active
   */
  const isSearchActive = useMemo(() => searchTerm.trim().length > 0, [searchTerm]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      onSearchSubmit,
      clearSearch,
      isSearchActive,
    }),
    [searchTerm, setSearchTerm, onSearchSubmit, clearSearch, isSearchActive]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export default SearchProvider;
