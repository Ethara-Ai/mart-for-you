import { ThemeProvider } from './ThemeContext';
import { CartProvider } from './CartContext';
import { ToastProvider } from './ToastContext';
import { ProfileProvider } from './ProfileContext';

/**
 * AppProvider - Combines all context providers for the application
 *
 * This component wraps the app with all necessary context providers
 * in the correct order to ensure proper dependency resolution.
 *
 * Provider Order (outer to inner):
 * 1. ThemeProvider - Theme/dark mode state (no dependencies)
 * 2. ToastProvider - Toast notifications (no dependencies)
 * 3. ProfileProvider - User profile state (no dependencies)
 * 4. CartProvider - Shopping cart state (may use toasts)
 */
function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ProfileProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ProfileProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default AppProvider;
