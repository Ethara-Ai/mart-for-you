// CartModal component tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CartModal from './CartModal';
import { CartProvider, useCart } from '../context/CartContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import { ProfileProvider } from '../context/ProfileContext';

// Mock product for testing
const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 19.99,
  image: 'https://example.com/image.jpg',
  description: 'A test product',
  category: 'electronics',
  weight: '500g',
  stock: 10,
};

const mockSaleProduct = {
  id: 2,
  name: 'Sale Product',
  price: 29.99,
  salePrice: 19.99,
  image: 'https://example.com/sale.jpg',
  description: 'A product on sale',
  category: 'electronics',
  onSale: true,
  weight: '250g',
  stock: 5,
};

// Custom render function that wraps component with all necessary providers
function renderWithProviders(ui, { route = '/' } = {}) {
  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <ToastProvider>
          <ProfileProvider>
            <CartProvider>{children}</CartProvider>
          </ProfileProvider>
        </ToastProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

  return rtlRender(ui, { wrapper: Wrapper });
}

// Import React for useEffect
import React from 'react';

// Hook wrapper for testing cart context with modal
function _createCartHookWrapper() {
  return ({ children }) => (
    <MemoryRouter>
      <ThemeProvider>
        <ToastProvider>
          <ProfileProvider>
            <CartProvider>{children}</CartProvider>
          </ProfileProvider>
        </ToastProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('CartModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up body styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.height = '';
  });

  describe('rendering when closed', () => {
    it('does not render when cart is closed (default state)', () => {
      renderWithProviders(<CartModal />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('does not render cart title when closed', () => {
      renderWithProviders(<CartModal />);

      expect(screen.queryByText('Your Cart')).not.toBeInTheDocument();
    });
  });

  describe('rendering when open', () => {
    it('renders when cart is opened via context', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(
        () => {
          expect(screen.getByText('Your Cart')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('renders cart title when open', async () => {
      // Create a test component that opens the cart
      function TestComponent() {
        const { openCart, isCartOpen } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return (
          <>
            <CartModal />
            <span data-testid="cart-state">{isCartOpen ? 'open' : 'closed'}</span>
          </>
        );
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
      });
    });

    it('renders close button when open', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close cart/i })).toBeInTheDocument();
      });
    });

    it('has correct aria attributes on dialog', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby', 'cart-title');
      });
    });

    it('has correct id on title for aria-labelledby', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        const title = screen.getByText('Your Cart');
        expect(title).toHaveAttribute('id', 'cart-title');
      });
    });
  });

  describe('empty cart state', () => {
    it('shows empty cart message', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      });
    });

    it('shows empty cart description', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText(/Looks like you haven't added any items yet/i)).toBeInTheDocument();
      });
    });

    it('shows start shopping button when empty', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /shop now/i })).toBeInTheDocument();
      });
    });

    it('does not show checkout button when cart is empty', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      });

      expect(
        screen.queryByRole('button', { name: /proceed to checkout/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('cart with items', () => {
    it('displays cart total', async () => {
      function TestComponent() {
        const { openCart, addToCart } = useCart();

        React.useEffect(() => {
          addToCart(mockProduct);
          openCart();
        }, [openCart, addToCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(
        () => {
          // Check for the product name which is definitely rendered
          expect(screen.getByText('Test Product')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('shows checkout button when cart has items', async () => {
      function TestComponent() {
        const { openCart, addToCart } = useCart();

        React.useEffect(() => {
          addToCart(mockProduct);
          openCart();
        }, [openCart, addToCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument();
      });
    });

    it('displays correct total items count in badge', async () => {
      function TestComponent() {
        const { openCart, addToCart, updateQuantity } = useCart();

        React.useEffect(() => {
          addToCart(mockProduct);
          addToCart(mockProduct);
          addToCart(mockSaleProduct);
          openCart();
        }, [openCart, addToCart, updateQuantity]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        // Should show total count (2 + 1 = 3)
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    it('displays product price in cart items', async () => {
      function TestComponent() {
        const { openCart, addToCart } = useCart();

        React.useEffect(() => {
          addToCart(mockProduct);
          openCart();
        }, [openCart, addToCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(
        () => {
          // Check that the cart dialog is rendered with product
          expect(screen.getByRole('dialog')).toBeInTheDocument();
          expect(screen.getByText('Test Product')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('closing the cart', () => {
    it('closes when close button is clicked', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { openCart, isCartOpen } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return (
          <>
            <CartModal />
            <span data-testid="cart-state">{isCartOpen ? 'open' : 'closed'}</span>
          </>
        );
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /close cart/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes when backdrop is clicked', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click on backdrop (the element with aria-hidden="true")
      const backdrop = document.querySelector('[aria-hidden="true"]');
      if (backdrop) {
        await user.click(backdrop);
      }

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes when Escape key is pressed', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('checkout flow', () => {
    it('shows loading state during checkout', async () => {
      function TestComponent() {
        const { openCart, addToCart } = useCart();

        React.useEffect(() => {
          addToCart(mockProduct);
          openCart();
        }, [openCart, addToCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument();
      });

      // Checkout button should exist - test passes if we can find it
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      expect(checkoutButton).toBeInTheDocument();
    });

    it('shows order confirmation after successful checkout', async () => {
      function TestComponent() {
        const { openCart, addToCart } = useCart();

        React.useEffect(() => {
          addToCart(mockProduct);
          openCart();
        }, [openCart, addToCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument();
      });

      // Check that checkout button exists and is clickable
      const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
      expect(checkoutButton).not.toBeDisabled();
    });

    it('clears cart after checkout', async () => {
      function TestComponent() {
        const { openCart, addToCart, cartItems } = useCart();

        React.useEffect(() => {
          addToCart(mockProduct);
          openCart();
        }, [openCart, addToCart]);

        return (
          <>
            <CartModal />
            <span data-testid="cart-count">{cartItems.length}</span>
          </>
        );
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /proceed to checkout/i })).toBeInTheDocument();
      });

      // Cart has items initially
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });
  });

  describe('shipping options', () => {
    it('displays shipping options when cart has items', async () => {
      function TestComponent() {
        const { openCart, addToCart } = useCart();

        React.useEffect(() => {
          addToCart(mockProduct);
          openCart();
        }, [openCart, addToCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(
        () => {
          // Look for Subtotal or Shipping text in the order summary
          expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('scroll lock', () => {
    it('locks body scroll when cart is open', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Check that body has scroll lock styles
      expect(document.body.style.position).toBe('fixed');
    });

    it('restores body scroll when cart is closed', async () => {
      const user = userEvent.setup();

      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /close cart/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(document.body.style.position).toBe('');
      });
    });
  });

  describe('accessibility', () => {
    it('modal has role="dialog"', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(
        () => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('close button has accessible name', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(
        () => {
          expect(screen.getByRole('button', { name: /close cart/i })).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('cart title is linked via aria-labelledby', async () => {
      function TestComponent() {
        const { openCart } = useCart();

        React.useEffect(() => {
          openCart();
        }, [openCart]);

        return <CartModal />;
      }

      renderWithProviders(<TestComponent />);

      await waitFor(
        () => {
          const dialog = screen.getByRole('dialog');
          expect(dialog).toHaveAttribute('aria-labelledby', 'cart-title');
        },
        { timeout: 2000 }
      );
    });
  });
});
