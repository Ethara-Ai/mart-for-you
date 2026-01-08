import { useContext } from 'react';
import { SearchContext, SearchProvider } from './SearchContext';

// Context exports - only export providers and hooks (not context objects) to avoid Fast Refresh warnings
export { ThemeProvider, useTheme } from './ThemeContext';
export { CartProvider, useCart } from './CartContext';
export { ToastProvider, useToast } from './ToastContext';
export { ProfileProvider, useProfile } from './ProfileContext';
export { SearchProvider };

// Custom hook to use search context (defined here to avoid Fast Refresh warning)
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

// Combined provider component for wrapping the app
export { default as AppProvider } from './AppProvider';
