import { useContext } from 'react';
import { SearchContext, SearchProvider } from './SearchContext';

// Context exports
export { ThemeProvider, useTheme, default as ThemeContext } from './ThemeContext';
export { CartProvider, useCart, default as CartContext } from './CartContext';
export { ToastProvider, useToast, default as ToastContext } from './ToastContext';
export { ProfileProvider, useProfile, default as ProfileContext } from './ProfileContext';
export { SearchProvider, SearchContext };

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
