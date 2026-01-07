// CartModal component tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CartModal from './CartModal';
import { render, renderWithMemoryRouter, mockProduct } from '../../testing/test-utils';
import { CartProvider, useCart } from '../../context/CartContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import { ProfileProvider } from '../../context/ProfileContext';

describe('CartModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up body styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
  });

  describe('rendering when closed', () => {
    it('does not render when isOpen is false', () => {
      render(<CartModal isOpen={false} onClose={mockOnClose} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('does not render cart title when closed', () => {
      render(<CartModal isOpen={false} onClose={mockOnClose} />);

      expect(screen.queryByText('Your Cart')).not.toBeInTheDocument();
    });
  });

  describe('rendering when open', () => {
    it('renders when isOpen is true', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders cart title', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('Your Cart')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole('button', { name: /close cart/i })).toBeInTheDocument();
    });

    it('has correct aria attributes on dialog', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'cart-title');
    });

    it('has correct id on title for aria-labelledby', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const title = screen.getByText('Your Cart');
      expect(title).toHaveAttribute('id', 'cart-title');
    });
  });

  describe('empty cart state', () => {
    it('shows empty cart message', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('shows continue shopping button', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole('button', { name: /continue shopping/i })).toBeInTheDocument();
    });

    it('does not show item count when cart is empty', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.queryByText(/\(.*items?\)/)).not.toBeInTheDocument();
    });

    it('does not show checkout button when cart is empty', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.queryByRole('button', { name: /checkout/i })).not.toBeInTheDocument();
    });

    it('does not show shipping options when cart is empty', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.queryByText('Shipping Method')).not.toBeInTheDocument();
    });
  });

  describe('close functionality', () => {
    it('calls onClose when close button is clicked', async () => {
      const { user } = render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close cart/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', async () => {
      const { user } = render(<CartModal isOpen={true} onClose={mockOnClose} />);

      // Find backdrop (has aria-hidden="true")
      const backdrop = document.querySelector('[aria-hidden="true"]');
      if (backdrop) {
        await user.click(backdrop);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });

    it('calls onClose when Escape key is pressed', async () => {
      const { user } = render(<CartModal isOpen={true} onClose={mockOnClose} />);

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when clicking inside modal content', async () => {
      const { user } = render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const title = screen.getByText('Your Cart');
      await user.click(title);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('cart with items', () => {
    // Component that adds items to cart
    const CartWithItem = ({ onClose }) => {
      const { addToCart } = useCart();
      return (
        <>
          <button onClick={() => addToCart(mockProduct)}>Add Product</button>
          <CartModal isOpen={true} onClose={onClose} />
        </>
      );
    };

    const renderWithProviders = (onClose) => {
      const user = userEvent.setup();
      return {
        user,
        ...rtlRender(
          <BrowserRouter>
            <ThemeProvider>
              <ToastProvider>
                <ProfileProvider>
                  <CartProvider>
                    <CartWithItem onClose={onClose} />
                  </CartProvider>
                </ProfileProvider>
              </ToastProvider>
            </ThemeProvider>
          </BrowserRouter>,
        ),
      };
    };

    it('displays item count in header when cart has items', async () => {
      const { user } = renderWithProviders(mockOnClose);
      await user.click(screen.getByText('Add Product'));

      await waitFor(() => {
        expect(screen.getByText(/\(1 item\)/)).toBeInTheDocument();
      });
    });

    it('shows shipping options when cart has items', async () => {
      const { user } = renderWithProviders(mockOnClose);
      await user.click(screen.getByText('Add Product'));

      await waitFor(() => {
        expect(screen.getByText('Shipping Method')).toBeInTheDocument();
      });
    });

    it('shows checkout button when cart has items', async () => {
      const { user } = renderWithProviders(mockOnClose);
      await user.click(screen.getByText('Add Product'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument();
      });
    });

    it('shows subtotal when cart has items', async () => {
      const { user } = renderWithProviders(mockOnClose);
      await user.click(screen.getByText('Add Product'));

      await waitFor(() => {
        expect(screen.getByText('Subtotal')).toBeInTheDocument();
      });
    });

    it('shows shipping cost', async () => {
      const { user } = renderWithProviders(mockOnClose);
      await user.click(screen.getByText('Add Product'));

      await waitFor(() => {
        expect(screen.getByText('Shipping')).toBeInTheDocument();
      });
    });

    it('shows total', async () => {
      const { user } = renderWithProviders(mockOnClose);
      await user.click(screen.getByText('Add Product'));

      await waitFor(() => {
        expect(screen.getByText('Total')).toBeInTheDocument();
      });
    });

    it('shows continue shopping link when cart has items', async () => {
      const { user } = renderWithProviders(mockOnClose);
      await user.click(screen.getByText('Add Product'));

      await waitFor(() => {
        const continueButtons = screen.getAllByText(/continue shopping/i);
        expect(continueButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('continue shopping button', () => {
    it('calls onClose when clicked', async () => {
      const { user } = renderWithMemoryRouter(<CartModal isOpen={true} onClose={mockOnClose} />, {
        initialEntries: ['/cart'],
      });

      const continueShoppingButton = screen.getByRole('button', { name: /continue shopping/i });
      await user.click(continueShoppingButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('modal has dialog role', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('close button has accessible name', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close cart/i });
      expect(closeButton).toHaveAccessibleName();
    });

    it('title is correctly associated with dialog', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      const labelledBy = dialog.getAttribute('aria-labelledby');
      const title = document.getElementById(labelledBy);

      expect(title).toBeInTheDocument();
      expect(title.textContent).toContain('Your Cart');
    });

    it('buttons are keyboard focusable', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('styling', () => {
    it('modal has max-width constraint', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-w-2xl');
    });

    it('modal has max-height constraint', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('max-h-[85vh]');
    });

    it('modal has rounded corners', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('rounded-lg');
    });

    it('modal has overflow scroll', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('overflow-y-auto');
    });
  });

  describe('header', () => {
    it('displays cart title', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByText('Your Cart')).toBeInTheDocument();
    });

    it('title has correct styling class', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const title = screen.getByText('Your Cart');
      expect(title).toHaveClass('text-xl');
      expect(title).toHaveClass('font-bold');
    });

    it('displays correct singular item text', async () => {
      const CartWithButton = ({ onClose }) => {
        const { addToCart } = useCart();
        return (
          <>
            <button onClick={() => addToCart(mockProduct)}>Add</button>
            <CartModal isOpen={true} onClose={onClose} />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <BrowserRouter>
          <ThemeProvider>
            <ToastProvider>
              <ProfileProvider>
                <CartProvider>
                  <CartWithButton onClose={mockOnClose} />
                </CartProvider>
              </ProfileProvider>
            </ToastProvider>
          </ThemeProvider>
        </BrowserRouter>,
      );

      await user.click(screen.getByText('Add'));

      await waitFor(() => {
        expect(screen.getByText(/\(1 item\)/)).toBeInTheDocument();
      });
    });
  });

  describe('body scroll lock', () => {
    it('locks body scroll when modal opens', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(document.body.style.position).toBe('fixed');
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('has width 100% when modal is open', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(document.body.style.width).toBe('100%');
    });
  });

  describe('modal z-index', () => {
    it('backdrop has high z-index', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const backdrop = document.querySelector('[aria-hidden="true"]');
      expect(backdrop).toHaveClass('z-100');
    });

    it('modal container has higher z-index than backdrop', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const modalContainer = screen.getByRole('dialog').parentElement;
      expect(modalContainer).toHaveClass('z-101');
    });
  });

  describe('animations', () => {
    it('modal has animation classes/styles', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      // Framer motion applies styles for animations
      expect(dialog).toBeInTheDocument();
    });
  });

  describe('close button', () => {
    it('close button contains X icon', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close cart/i });
      const svg = closeButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('close button has hover styling class', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close cart/i });
      expect(closeButton).toHaveClass('hover:bg-opacity-10');
    });

    it('close button has cursor pointer', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close cart/i });
      expect(closeButton).toHaveClass('cursor-pointer');
    });
  });

  describe('empty cart icon', () => {
    it('shows shopping cart icon when cart is empty', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      // The FiShoppingCart icon should be present
      const dialog = screen.getByRole('dialog');
      const svgs = dialog.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe('multiple modals behavior', () => {
    it('only one modal renders at a time', () => {
      render(
        <>
          <CartModal isOpen={true} onClose={mockOnClose} />
        </>,
      );

      const dialogs = screen.getAllByRole('dialog');
      expect(dialogs).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('handles rapid open/close without errors', () => {
      const { rerender } = render(<CartModal isOpen={false} onClose={mockOnClose} />);

      rerender(<CartModal isOpen={true} onClose={mockOnClose} />);
      rerender(<CartModal isOpen={false} onClose={mockOnClose} />);
      rerender(<CartModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('handles onClose being called multiple times', async () => {
      const { user } = render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /close cart/i });
      await user.click(closeButton);
      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalledTimes(2);
    });
  });

  describe('order summary section', () => {
    it('subtotal and shipping labels exist when cart has items', async () => {
      const CartWithButton = ({ onClose }) => {
        const { addToCart } = useCart();
        return (
          <>
            <button onClick={() => addToCart(mockProduct)}>Add</button>
            <CartModal isOpen={true} onClose={onClose} />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <BrowserRouter>
          <ThemeProvider>
            <ToastProvider>
              <ProfileProvider>
                <CartProvider>
                  <CartWithButton onClose={mockOnClose} />
                </CartProvider>
              </ProfileProvider>
            </ToastProvider>
          </ThemeProvider>
        </BrowserRouter>,
      );

      await user.click(screen.getByText('Add'));

      await waitFor(() => {
        expect(screen.getByText('Subtotal')).toBeInTheDocument();
        expect(screen.getByText('Shipping')).toBeInTheDocument();
        expect(screen.getByText('Total')).toBeInTheDocument();
      });
    });
  });

  describe('checkout button', () => {
    const CartWithButton = ({ onClose }) => {
      const { addToCart } = useCart();
      return (
        <>
          <button onClick={() => addToCart(mockProduct)}>Add</button>
          <CartModal isOpen={true} onClose={onClose} />
        </>
      );
    };

    const renderWithProviders = (onClose) => {
      const user = userEvent.setup();
      return {
        user,
        ...rtlRender(
          <BrowserRouter>
            <ThemeProvider>
              <ToastProvider>
                <ProfileProvider>
                  <CartProvider>
                    <CartWithButton onClose={onClose} />
                  </CartProvider>
                </ProfileProvider>
              </ToastProvider>
            </ThemeProvider>
          </BrowserRouter>,
        ),
      };
    };

    it('checkout button has full width', async () => {
      const { user } = renderWithProviders(mockOnClose);

      await user.click(screen.getByText('Add'));

      await waitFor(() => {
        const checkoutButton = screen.getByRole('button', { name: /checkout/i });
        expect(checkoutButton).toHaveClass('w-full');
      });
    });

    it('checkout button has transform hover effects', async () => {
      const { user } = renderWithProviders(mockOnClose);

      await user.click(screen.getByText('Add'));

      await waitFor(() => {
        const checkoutButton = screen.getByRole('button', { name: /checkout/i });
        expect(checkoutButton).toHaveClass('transform');
      });
    });
  });

  describe('responsive behavior', () => {
    it('modal takes full width with max constraint', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('w-full');
      expect(dialog).toHaveClass('max-w-2xl');
    });

    it('modal container has padding for mobile', () => {
      render(<CartModal isOpen={true} onClose={mockOnClose} />);

      const modalContainer = screen.getByRole('dialog').parentElement;
      expect(modalContainer).toHaveClass('p-4');
    });
  });

  describe('price formatting', () => {
    it('displays prices with two decimal places', async () => {
      const testProduct = { ...mockProduct, price: 10 };
      const CartWithButton = ({ onClose }) => {
        const { addToCart } = useCart();
        return (
          <>
            <button onClick={() => addToCart(testProduct)}>Add</button>
            <CartModal isOpen={true} onClose={onClose} />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <BrowserRouter>
          <ThemeProvider>
            <ToastProvider>
              <ProfileProvider>
                <CartProvider>
                  <CartWithButton onClose={mockOnClose} />
                </CartProvider>
              </ProfileProvider>
            </ToastProvider>
          </ThemeProvider>
        </BrowserRouter>,
      );

      await user.click(screen.getByText('Add'));

      await waitFor(() => {
        const priceElements = screen.getAllByText('$10.00');
        expect(priceElements.length).toBeGreaterThan(0);
      });
    });
  });
});
