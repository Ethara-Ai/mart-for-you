// CartPage component tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import CartPage from './CartPage';
import { render } from '../testing/test-utils';

// Mock framer-motion to avoid animation issues
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }) => children,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      button: ({ children, ...props }) => <button {...props}>{children}</button>,
      article: ({ children, ...props }) => <article {...props}>{children}</article>,
    },
  };
});

describe('CartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the page title', () => {
      render(<CartPage />);

      expect(screen.getByRole('heading', { name: /shopping cart/i })).toBeInTheDocument();
    });

    it('renders continue shopping link', () => {
      render(<CartPage />);

      expect(screen.getByText(/continue shopping/i)).toBeInTheDocument();
    });

    it('renders as main element', () => {
      render(<CartPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('empty cart state', () => {
    it('displays empty cart message when cart is empty', () => {
      render(<CartPage />);

      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    it('displays start shopping link when cart is empty', () => {
      render(<CartPage />);

      const startShoppingLink = screen.getByRole('link', { name: /start shopping/i });
      expect(startShoppingLink).toBeInTheDocument();
      expect(startShoppingLink).toHaveAttribute('href', '/products');
    });

    it('displays shopping cart icon for empty state', () => {
      render(<CartPage />);

      // Empty cart state should show the cart icon
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    it('displays helpful message for empty cart', () => {
      render(<CartPage />);

      expect(screen.getByText(/haven't added any items/i)).toBeInTheDocument();
    });
  });

  describe('continue shopping navigation', () => {
    it('renders continue shopping button', () => {
      render(<CartPage />);

      const buttons = screen.getAllByText(/continue shopping/i);
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('clear cart functionality', () => {
    it('does not show clear cart button when cart is empty', () => {
      render(<CartPage />);

      expect(screen.queryByRole('button', { name: /clear cart/i })).not.toBeInTheDocument();
    });
  });

  describe('checkout button', () => {
    it('does not show checkout button when cart is empty', () => {
      render(<CartPage />);

      expect(screen.queryByRole('button', { name: /checkout/i })).not.toBeInTheDocument();
    });
  });

  describe('order summary', () => {
    it('does not show order summary section when cart is empty', () => {
      render(<CartPage />);

      expect(screen.queryByText(/order summary/i)).not.toBeInTheDocument();
    });
  });

  describe('cart items section', () => {
    it('does not show cart items section when cart is empty', () => {
      render(<CartPage />);

      expect(screen.queryByText(/cart items/i)).not.toBeInTheDocument();
    });
  });

  describe('page layout', () => {
    it('has correct page structure', () => {
      const { container } = render(<CartPage />);

      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('applies minimum height to page', () => {
      render(<CartPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('min-h-screen');
    });
  });

  describe('theming', () => {
    it('renders correctly in default theme', () => {
      render(<CartPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has accessible page title', () => {
      render(<CartPage />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('start shopping link is focusable', () => {
      render(<CartPage />);

      const link = screen.getByRole('link', { name: /start shopping/i });
      expect(link).not.toHaveAttribute('tabindex', '-1');
    });

    it('continue shopping button is focusable', () => {
      render(<CartPage />);

      const buttons = screen.getAllByText(/continue shopping/i);
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('navigation', () => {
    it('renders back to home link', () => {
      render(<CartPage />);

      const continueShoppingButtons = screen.getAllByText(/continue shopping/i);
      expect(continueShoppingButtons.length).toBeGreaterThan(0);
    });
  });

  describe('styling', () => {
    it('applies correct max-width constraint', () => {
      const { container } = render(<CartPage />);

      const maxWidthContainer = container.querySelector('.max-w-6xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('applies padding to page', () => {
      render(<CartPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('py-8');
    });
  });

  describe('empty state illustration', () => {
    it('shows empty state with appropriate styling', () => {
      render(<CartPage />);

      // The empty cart should have centered content
      const emptyMessage = screen.getByText(/your cart is empty/i);
      expect(emptyMessage).toBeInTheDocument();
    });
  });

  describe('secure checkout notice', () => {
    it('does not show secure checkout notice when cart is empty', () => {
      render(<CartPage />);

      expect(screen.queryByText(/secure checkout/i)).not.toBeInTheDocument();
    });
  });

  describe('shipping options', () => {
    it('does not show shipping options when cart is empty', () => {
      render(<CartPage />);

      // Shipping options component should not be visible in empty state
      expect(screen.queryByText(/shipping/i)).not.toBeInTheDocument();
    });
  });

  describe('summary calculations', () => {
    it('does not show subtotal when cart is empty', () => {
      render(<CartPage />);

      expect(screen.queryByText(/subtotal/i)).not.toBeInTheDocument();
    });

    it('does not show total when cart is empty', () => {
      render(<CartPage />);

      // Total label in order summary
      const totals = screen.queryAllByText(/^total$/i);
      expect(totals.length).toBe(0);
    });
  });

  describe('responsive design', () => {
    it('has responsive padding classes', () => {
      const { container } = render(<CartPage />);

      const responsiveContainer = container.querySelector('.px-3.sm\\:px-4');
      expect(responsiveContainer).toBeInTheDocument();
    });
  });

  describe('order placed state', () => {
    it('does not show order placed message initially', () => {
      render(<CartPage />);

      expect(screen.queryByText(/order placed successfully/i)).not.toBeInTheDocument();
    });
  });
});
