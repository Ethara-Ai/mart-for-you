import { ThemeProvider } from './ThemeContext';
import { CartProvider } from './cart';
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
 * 4. CartProvider - Shopping cart state (combines CartItems, CartTotals, CartUI, Checkout)
 * 5. SearchProvider - Search state (requires Router context - must be inside HashRouter)
 * 6. FilterProvider - Filter state (requires Router context - must be inside HashRouter)
 *
 * Cart Context Architecture:
 * The CartProvider now uses split contexts internally for better performance:
 * - CartItemsContext: Cart items CRUD operations
 * - CartTotalsContext: Cart totals and shipping calculations
 * - CartUIContext: Cart modal UI state
 * - CheckoutContext: Checkout flow management
 *
 * Components can use the combined `useCart()` hook for convenience,
 * or individual hooks (`useCartItems`, `useCartTotals`, `useCartUI`, `useCheckout`)
 * for better performance when they only need specific data.
 *
 * IMPORTANT: AppProvider must be used inside a Router context (e.g., HashRouter)
 * because SearchProvider and FilterProvider use router hooks.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 *
 * @example
 * // In App.jsx
 * function App() {
 *   return (
 *     <HashRouter>
 *       <AppProvider>
 *         <AppRoutes />
 *       </AppProvider>
 *     </HashRouter>
 *   );
 * }
 *
 * @example
 * // Using combined cart hook
 * const { cartItems, addToCart, isCartOpen, handleCheckout } = useCart();
 *
 * @example
 * // Using individual hooks for better performance
 * const { addToCart, isInCart } = useCartItems();
 * const { isCartOpen, openCart } = useCartUI();
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
