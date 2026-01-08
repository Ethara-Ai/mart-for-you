/* eslint-disable react-refresh/only-export-components */
// Test utilities and render helpers with provider wrappers
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { ProfileProvider } from '../context/ProfileContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import { SearchProvider } from '../context/SearchContext';
import { FilterProvider } from '../context/FilterContext';

/**
 * AllProviders - Wraps children with all application context providers
 * Used for testing components that require access to multiple contexts
 */
function AllProviders({ children }) {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

/**
 * MemoryRouterProviders - Wraps children with all providers using MemoryRouter
 * Useful for testing navigation and route-specific behavior
 */
function MemoryRouterProviders({ children, initialEntries = ['/'] }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
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
    </MemoryRouter>
  );
}

/**
 * ThemeOnlyProvider - Wraps children with only the ThemeProvider
 * Useful for testing theme-related functionality in isolation
 */
function ThemeOnlyProvider({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

/**
 * CartOnlyProvider - Wraps children with Cart and Theme providers
 * Useful for testing cart-related functionality
 */
function CartOnlyProvider({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>{children}</CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

/**
 * ProfileOnlyProvider - Wraps children with Profile and Theme providers
 * Useful for testing profile-related functionality
 */
function ProfileOnlyProvider({ children }) {
  return (
    <ThemeProvider>
      <ProfileProvider>{children}</ProfileProvider>
    </ThemeProvider>
  );
}

/**
 * ToastOnlyProvider - Wraps children with Toast and Theme providers
 * Useful for testing toast notification functionality
 */
function ToastOnlyProvider({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}

/**
 * Custom render function that wraps component with all providers
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Render options
 * @returns {Object} Render result plus user event instance
 */
function customRender(ui, options = {}) {
  const { wrapper: Wrapper = AllProviders, ...renderOptions } = options;

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Render with MemoryRouter for testing navigation
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Render options including initialEntries for router
 * @returns {Object} Render result plus user event instance
 */
function renderWithMemoryRouter(ui, { initialEntries = ['/'], ...options } = {}) {
  const Wrapper = ({ children }) => (
    <MemoryRouterProviders initialEntries={initialEntries}>{children}</MemoryRouterProviders>
  );

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}

/**
 * Render with only theme provider
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Render options
 * @returns {Object} Render result plus user event instance
 */
function renderWithTheme(ui, options = {}) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: ThemeOnlyProvider, ...options }),
  };
}

/**
 * Render with cart context
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Render options
 * @returns {Object} Render result plus user event instance
 */
function renderWithCart(ui, options = {}) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: CartOnlyProvider, ...options }),
  };
}

/**
 * Render with profile context
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Render options
 * @returns {Object} Render result plus user event instance
 */
function renderWithProfile(ui, options = {}) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: ProfileOnlyProvider, ...options }),
  };
}

/**
 * Render with toast context
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Render options
 * @returns {Object} Render result plus user event instance
 */
function renderWithToast(ui, options = {}) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: ToastOnlyProvider, ...options }),
  };
}

// Mock product data for testing
export const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 99.99,
  image: 'https://example.com/image.jpg',
  description: 'A test product description',
  category: 'electronics',
  onSale: false,
};

export const mockSaleProduct = {
  id: 2,
  name: 'Sale Product',
  price: 149.99,
  salePrice: 99.99,
  image: 'https://example.com/sale-image.jpg',
  description: 'A product on sale',
  category: 'fashion',
  onSale: true,
};

export const mockCartItem = {
  ...mockProduct,
  quantity: 2,
};

export const mockSaleCartItem = {
  ...mockSaleProduct,
  quantity: 1,
};

export const mockProducts = [
  mockProduct,
  mockSaleProduct,
  {
    id: 3,
    name: 'Home Product',
    price: 49.99,
    image: 'https://example.com/home.jpg',
    description: 'A home category product',
    category: 'home',
    onSale: false,
  },
  {
    id: 4,
    name: 'Beauty Product',
    price: 29.99,
    image: 'https://example.com/beauty.jpg',
    description: 'A beauty category product',
    category: 'beauty',
    onSale: false,
  },
];

export const mockUserProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  address: '123 Test Street',
  city: 'Test City',
  state: 'TS',
  zip: '12345',
  country: 'USA',
  phone: '1234567890',
  avatar: 'https://example.com/avatar.jpg',
};

export const mockShippingOptions = [
  {
    id: 'free',
    name: 'Free Shipping',
    price: 0,
    estimatedDelivery: '7-10 business days',
  },
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 4.99,
    estimatedDelivery: '3-5 business days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 9.99,
    estimatedDelivery: '1-2 business days',
  },
];

// Utility function to wait for async operations
export const waitForAsync = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility function to create a mock function that resolves after a delay
export const createDelayedMock = (returnValue, delay = 100) =>
  vi.fn(() => new Promise((resolve) => setTimeout(() => resolve(returnValue), delay)));

/**
 * Filter out framer-motion specific props that shouldn't be passed to DOM elements.
 * Use this helper when mocking framer-motion in tests.
 *
 * @param {Object} props - Props object that may contain framer-motion animation props
 * @returns {Object} Props object with animation props removed
 *
 * @example
 * vi.mock('framer-motion', async () => {
 *   const actual = await vi.importActual('framer-motion');
 *   return {
 *     ...actual,
 *     motion: {
 *       div: ({ children, ...props }) => <div {...filterMotionProps(props)}>{children}</div>,
 *     },
 *   };
 * });
 */
export const filterMotionProps = (props) => {
  const {
    initial,
    animate,
    exit,
    transition,
    whileHover,
    whileTap,
    whileFocus,
    whileDrag,
    whileInView,
    variants,
    layoutId,
    layout,
    drag,
    dragConstraints,
    dragElastic,
    dragMomentum,
    dragTransition,
    onAnimationStart,
    onAnimationComplete,
    onDragStart,
    onDragEnd,
    onDrag,
    ...rest
  } = props;
  return rest;
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { userEvent };

// Export custom render as the default render
export { customRender as render };
export {
  renderWithMemoryRouter,
  renderWithTheme,
  renderWithCart,
  renderWithProfile,
  renderWithToast,
  AllProviders,
  MemoryRouterProviders,
  ThemeOnlyProvider,
  CartOnlyProvider,
  ProfileOnlyProvider,
  ToastOnlyProvider,
};
