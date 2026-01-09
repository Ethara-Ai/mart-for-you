import { useContext } from 'react';
import { SearchContext } from './searchContextValue';
import { SearchProvider } from './SearchContext';

// Theme exports
export { ThemeProvider, useTheme } from './ThemeContext';

// Cart exports - using split cart contexts for better performance
export {
  CartProvider,
  useCart,
  // Individual cart hooks for granular access (recommended for performance)
  useCartItems,
  useCartTotals,
  useCartUI,
  useCheckout,
  // Individual providers for custom composition
  CartItemsProvider,
  CartTotalsProvider,
  CartUIProvider,
  CheckoutProvider,
  // Constants
  CHECKOUT_STAGES,
} from './cart';

// Toast exports
export { ToastProvider, useToast } from './ToastContext';

// Profile exports
export { ProfileProvider, useProfile } from './ProfileContext';

// Filter exports
export { FilterProvider, useFilter } from './FilterContext';

// Search exports
export { SearchProvider };

/**
 * useSearch - Custom hook to access search context
 *
 * Defined here to avoid Fast Refresh warning when exporting
 * from the same file as the context object.
 *
 * @returns {Object} Search context value containing:
 *   - searchTerm: string - Current search term
 *   - setSearchTerm: Function - Update search term
 *   - onSearchSubmit: Function - Handle search submission
 *   - clearSearch: Function - Clear search term
 *   - isSearchActive: boolean - Whether search is active
 *
 * @throws {Error} If used outside of SearchProvider
 *
 * @example
 * const { searchTerm, setSearchTerm, clearSearch } = useSearch();
 */
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

// Combined provider component for wrapping the app
export { default as AppProvider } from './AppProvider';
