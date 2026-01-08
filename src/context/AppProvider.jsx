import { ThemeProvider } from './ThemeContext';
import { CartProvider } from './CartContext';
import { ToastProvider } from './ToastContext';
import { ProfileProvider } from './ProfileContext';
import { SearchProvider } from './SearchContext';
import { FilterProvider } from './FilterContext';

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
 * 5. SearchProvider - Search state (requires Router context - must be inside BrowserRouter)
 * 6. FilterProvider - Filter state (requires Router context - must be inside BrowserRouter)
 *
 * IMPORTANT: AppProvider must be used inside a Router context (e.g., BrowserRouter)
 * because SearchProvider and FilterProvider use router hooks.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 *
 * @example
 * // In App.jsx
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <AppProvider>
 *         <AppRoutes />
 *       </AppProvider>
 *     </BrowserRouter>
 *   );
 * }
 */
function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ProfileProvider>
          <CartProvider>
            <SearchProvider>
              <FilterProvider>{children}</FilterProvider>
            </SearchProvider>
          </CartProvider>
        </ProfileProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default AppProvider;
