import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchContext } from './searchContextValue';

// Re-export SearchContext for convenience
export { SearchContext };

// Search Provider Component
export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle search change
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Handle search submit
  const handleSearchSubmit = useCallback(() => {
    // Navigate to products page if not already there
    if (location.pathname !== '/home' && location.pathname !== '/products') {
      navigate('/products');
    }
  }, [location.pathname, navigate]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Context value
  const value = {
    searchTerm,
    setSearchTerm: handleSearchChange,
    onSearchSubmit: handleSearchSubmit,
    clearSearch,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
