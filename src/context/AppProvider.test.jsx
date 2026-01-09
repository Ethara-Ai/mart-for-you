// AppProvider component tests
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppProvider from './AppProvider';
import { useTheme } from './ThemeContext';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';
import { useProfile } from './ProfileContext';
import { useSearch } from './index';
import { useFilter } from './FilterContext';

// Test component that uses all contexts
function TestConsumer() {
  const theme = useTheme();
  const cart = useCart();
  const toast = useToast();
  const profile = useProfile();
  const search = useSearch();
  const filter = useFilter();

  return (
    <div>
      <span data-testid="theme">{theme.darkMode ? 'dark' : 'light'}</span>
      <span data-testid="cart">{cart.totalItems}</span>
      <span data-testid="toast">
        {typeof toast.showSuccess === 'function' ? 'toast-ready' : 'toast-error'}
      </span>
      <span data-testid="profile">{profile.userProfile ? 'profile-ready' : 'profile-error'}</span>
      <span data-testid="search">
        {typeof search.setSearchTerm === 'function' ? 'search-ready' : 'search-error'}
      </span>
      <span data-testid="filter">{filter.activeCategory}</span>
    </div>
  );
}

// Helper to render with router (required for AppProvider)
function renderWithRouter(ui, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe('AppProvider', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      renderWithRouter(
        <AppProvider>
          <div data-testid="child">Child Content</div>
        </AppProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      renderWithRouter(
        <AppProvider>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </AppProvider>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });

    it('renders without children', () => {
      expect(() => {
        renderWithRouter(<AppProvider />);
      }).not.toThrow();
    });
  });

  describe('context provision', () => {
    it('provides ThemeContext to children', () => {
      renderWithRouter(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('theme')).toBeInTheDocument();
    });

    it('provides CartContext to children', () => {
      renderWithRouter(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('cart')).toHaveTextContent('0');
    });

    it('provides ToastContext to children', () => {
      renderWithRouter(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('toast')).toHaveTextContent('toast-ready');
    });

    it('provides ProfileContext to children', () => {
      renderWithRouter(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('profile')).toHaveTextContent('profile-ready');
    });

    it('provides SearchContext to children', () => {
      renderWithRouter(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('search')).toHaveTextContent('search-ready');
    });

    it('provides FilterContext to children', () => {
      renderWithRouter(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('filter')).toHaveTextContent('all');
    });

    it('provides all contexts simultaneously', () => {
      renderWithRouter(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('theme')).toBeInTheDocument();
      expect(screen.getByTestId('cart')).toBeInTheDocument();
      expect(screen.getByTestId('toast')).toBeInTheDocument();
      expect(screen.getByTestId('profile')).toBeInTheDocument();
      expect(screen.getByTestId('search')).toBeInTheDocument();
      expect(screen.getByTestId('filter')).toBeInTheDocument();
    });
  });

  describe('provider order', () => {
    it('maintains correct provider hierarchy', () => {
      // ThemeProvider should be outermost (no dependencies)
      // CartProvider can use ToastProvider (for notifications)
      // This test ensures the component renders without context errors
      renderWithRouter(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      // If provider order was wrong, we'd get context errors
      expect(screen.getByTestId('theme')).toBeInTheDocument();
      expect(screen.getByTestId('cart')).toBeInTheDocument();
    });
  });

  describe('context interactions', () => {
    it('allows cart operations from within AppProvider', () => {
      function CartTestComponent() {
        const { addToCart, cartItems } = useCart();

        return (
          <div>
            <button onClick={() => addToCart({ id: 1, name: 'Test', price: 10 })}>Add Item</button>
            <span data-testid="cart-count">{cartItems.length}</span>
          </div>
        );
      }

      render(
        <MemoryRouter>
          <AppProvider>
            <CartTestComponent />
          </AppProvider>
        </MemoryRouter>,
        { wrapper: ({ children }) => children }
      );

      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });

    it('allows theme operations from within AppProvider', () => {
      function ThemeTestComponent() {
        const { darkMode, toggleDarkMode } = useTheme();

        return (
          <div>
            <button onClick={toggleDarkMode}>Toggle Theme</button>
            <span data-testid="theme-mode">{darkMode ? 'dark' : 'light'}</span>
          </div>
        );
      }

      renderWithRouter(
        <AppProvider>
          <ThemeTestComponent />
        </AppProvider>
      );

      expect(screen.getByTestId('theme-mode')).toBeInTheDocument();
    });
  });

  describe('nested components', () => {
    it('provides contexts to deeply nested children', () => {
      function Level1({ children }) {
        return <div className="level1">{children}</div>;
      }

      function Level2({ children }) {
        return <div className="level2">{children}</div>;
      }

      function Level3() {
        const { darkMode } = useTheme();
        const { totalItems } = useCart();
        return (
          <div data-testid="nested-consumer">
            Theme: {darkMode ? 'dark' : 'light'}, Items: {totalItems}
          </div>
        );
      }

      renderWithRouter(
        <AppProvider>
          <Level1>
            <Level2>
              <Level3 />
            </Level2>
          </Level1>
        </AppProvider>
      );

      expect(screen.getByTestId('nested-consumer')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('does not throw when rendering', () => {
      expect(() => {
        renderWithRouter(
          <AppProvider>
            <div>Test</div>
          </AppProvider>
        );
      }).not.toThrow();
    });
  });

  describe('with different routes', () => {
    it('works with products route', () => {
      renderWithRouter(
        <AppProvider>
          <TestConsumer />
        </AppProvider>,
        { route: '/products' }
      );

      expect(screen.getByTestId('filter')).toBeInTheDocument();
    });

    it('works with category query param', () => {
      renderWithRouter(
        <AppProvider>
          <TestConsumer />
        </AppProvider>,
        { route: '/products?category=electronics' }
      );

      expect(screen.getByTestId('filter')).toHaveTextContent('electronics');
    });
  });
});
