// Header component tests
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { render } from '../testing/test-utils';
import { CartProvider, useCart } from '../context/CartContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import { ProfileProvider } from '../context/ProfileContext';

describe('Header', () => {
  const mockOnCartClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      expect(document.body).toBeInTheDocument();
    });

    it('renders logo', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      // MART logo text should be present (multiple instances for responsive layouts)
      expect(screen.getAllByText('M').length).toBeGreaterThan(0);
      expect(screen.getAllByText('A').length).toBeGreaterThan(0);
      expect(screen.getAllByText('R').length).toBeGreaterThan(0);
      expect(screen.getAllByText('T').length).toBeGreaterThan(0);
    });

    it('renders dark mode toggle button', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const darkModeButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
      expect(darkModeButton).toBeInTheDocument();
    });

    it('renders profile photo button', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      expect(profileButton).toBeInTheDocument();
    });

    it('renders cart button', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      // Multiple cart buttons for responsive layouts (mobile + desktop)
      const cartButtons = screen.getAllByRole('button', { name: /view shopping cart/i });
      expect(cartButtons.length).toBeGreaterThan(0);
    });

    it('renders profile image', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const profileImages = screen.getAllByAltText('User profile');
      expect(profileImages.length).toBeGreaterThan(0);
    });
  });

  describe('dark mode toggle', () => {
    it('toggles dark mode when clicked', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const darkModeButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
      const initialLabel = darkModeButton.getAttribute('aria-label');

      await user.click(darkModeButton);

      const newLabel = darkModeButton.getAttribute('aria-label');
      expect(newLabel).not.toBe(initialLabel);
    });

    it('dark mode button has correct icon', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const darkModeButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
      const svg = darkModeButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('dark mode button has hover scale transform', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const darkModeButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
      expect(darkModeButton).toHaveClass('hover:scale-105');
    });

    it('dark mode button has active scale transform', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const darkModeButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
      expect(darkModeButton).toHaveClass('active:scale-95');
    });
  });

  describe('cart button', () => {
    it('calls onCartClick when clicked', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      // Use specific ID to target the desktop cart button
      const cartButton = document.getElementById('header-cart-button');
      await user.click(cartButton);

      expect(mockOnCartClick).toHaveBeenCalledTimes(1);
    });

    it('displays cart item count when cart has items', async () => {
      // Component that uses the cart
      const CartItemAdder = ({ onCartClick }) => {
        const { addToCart } = useCart();
        return (
          <>
            <button onClick={() => addToCart({ id: 1, name: 'Test', price: 10 })}>Add Item</button>
            <Header onCartClick={onCartClick} />
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
                  <CartItemAdder onCartClick={mockOnCartClick} />
                </CartProvider>
              </ProfileProvider>
            </ToastProvider>
          </ThemeProvider>
        </BrowserRouter>
      );

      await user.click(screen.getByText('Add Item'));

      await waitFor(() => {
        // Multiple badges for responsive layouts (mobile + desktop)
        expect(screen.getAllByText('1').length).toBeGreaterThan(0);
      });
    });

    it('does not show count badge when cart is empty', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      // Should not have a badge with number - use specific ID
      const cartButton = document.getElementById('header-cart-button');
      const badge = cartButton.querySelector('span');
      expect(badge).not.toBeInTheDocument();
    });

    it('cart button has id for targeting', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const cartButton = document.getElementById('header-cart-button');
      expect(cartButton).toBeInTheDocument();
    });

    it('cart button has shopping cart icon', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      // Use specific ID to target the desktop cart button
      const cartButton = document.getElementById('header-cart-button');
      const svg = cartButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('displays 99+ when cart has more than 99 items', async () => {
      const LargeCartAdder = ({ onCartClick }) => {
        const { addToCart, updateQuantity } = useCart();
        const [added, setAdded] = React.useState(false);
        const addItem = () => {
          addToCart({ id: 1, name: 'Test', price: 10, stock: 200 });
          setAdded(true);
        };
        const setLargeQuantity = () => {
          updateQuantity(1, 100);
        };
        return (
          <>
            <button onClick={addItem}>Add Item</button>
            {added && <button onClick={setLargeQuantity}>Set Quantity</button>}
            <Header onCartClick={onCartClick} />
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
                  <LargeCartAdder onCartClick={mockOnCartClick} />
                </CartProvider>
              </ProfileProvider>
            </ToastProvider>
          </ThemeProvider>
        </BrowserRouter>
      );

      // First add the item
      await user.click(screen.getByText('Add Item'));

      // Wait for Set Quantity button to appear, then click it
      const setQuantityBtn = await screen.findByText('Set Quantity');
      await user.click(setQuantityBtn);

      // Multiple badges for responsive layouts (mobile + desktop)
      const badges = await screen.findAllByText('99+', {}, { timeout: 2000 });
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('profile button and card', () => {
    it('opens profile card when profile button is clicked', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText('Address:')).toBeInTheDocument();
      });
    });

    it('closes profile card when clicked again', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText('Address:')).toBeInTheDocument();
      });

      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.queryByText('Address:')).not.toBeInTheDocument();
      });
    });

    it('displays user name in profile card', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        // Default profile name
        expect(screen.getByText('Vanshika Juneja')).toBeInTheDocument();
      });
    });

    it('displays user email in profile card', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText('vanshika@example.com')).toBeInTheDocument();
      });
    });

    it('displays user phone in profile card', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText('9876543210')).toBeInTheDocument();
      });
    });

    it('has edit profile button in profile card', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
      });
    });

    it('has view full profile link in profile card', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText('View Full Profile')).toBeInTheDocument();
      });
    });

    it('profile button has aria-expanded attribute', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      expect(profileButton).toHaveAttribute('aria-expanded');
    });

    it('profile button has id for targeting', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = document.getElementById('profile-photo-button');
      expect(profileButton).toBeInTheDocument();
    });

    it('profile card has id for targeting', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toBeInTheDocument();
      });
    });
  });

  describe('logo click', () => {
    it('logo is clickable', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      // Find the logo container which should be clickable (multiple for responsive layouts)
      const mElements = screen.getAllByText('M');
      const logoContainer = mElements[0].closest('div[class*="cursor-pointer"]');
      expect(logoContainer).toBeInTheDocument();
    });
  });

  describe('header styling', () => {
    it('header is sticky', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const header = document.querySelector('header');
      expect(header).toHaveClass('sticky');
    });

    it('header is at top', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const header = document.querySelector('header');
      expect(header).toHaveClass('top-0');
    });

    it('header has high z-index', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const header = document.querySelector('header');
      expect(header).toHaveClass('z-60');
    });

    it('header has shadow', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const header = document.querySelector('header');
      expect(header).toHaveClass('shadow-xs');
    });

    it('header has max-width container', () => {
      const { container } = render(<Header onCartClick={mockOnCartClick} />);

      const maxWidthContainer = container.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('header content is horizontally padded', () => {
      const { container } = render(<Header onCartClick={mockOnCartClick} />);

      const paddedContainer = container.querySelector('.px-4');
      expect(paddedContainer).toBeInTheDocument();
    });

    it('header uses flexbox for layout', () => {
      const { container } = render(<Header onCartClick={mockOnCartClick} />);

      const flexContainer = container.querySelector('.flex.justify-between');
      expect(flexContainer).toBeInTheDocument();
    });

    it('header has fixed height', () => {
      const { container } = render(<Header onCartClick={mockOnCartClick} />);

      const heightContainer = container.querySelector('.h-16');
      expect(heightContainer).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('all buttons are keyboard accessible', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('dark mode toggle has accessible label', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const darkModeButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
      expect(darkModeButton).toHaveAccessibleName();
    });

    it('cart button has accessible label with item count', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      // Multiple cart buttons for responsive layouts - use specific ID
      const cartButton = document.getElementById('header-cart-button');
      expect(cartButton).toHaveAccessibleName();
    });

    it('profile button has accessible label', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      expect(profileButton).toHaveAccessibleName();
    });

    it('profile images have alt text', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const images = screen.getAllByAltText('User profile');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });

  describe('button styling', () => {
    it('buttons have rounded full styling', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const darkModeButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
      expect(darkModeButton).toHaveClass('rounded-full');
    });

    it('buttons have cursor pointer', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const darkModeButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
      expect(darkModeButton).toHaveClass('cursor-pointer');
    });

    it('buttons have transition effects', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const darkModeButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
      expect(darkModeButton).toHaveClass('transition-colors');
    });

    it('buttons have fixed dimensions', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const darkModeButton = screen.getByRole('button', { name: /switch to (dark|light) mode/i });
      expect(darkModeButton).toHaveClass('w-10');
      expect(darkModeButton).toHaveClass('h-10');
    });
  });

  describe('actions container', () => {
    it('actions are spaced correctly', () => {
      const { container } = render(<Header onCartClick={mockOnCartClick} />);

      // Desktop layout uses space-x-3
      const actionsContainer = container.querySelector('.space-x-3');
      expect(actionsContainer).toBeInTheDocument();
    });

    it('actions container uses flexbox', () => {
      const { container } = render(<Header onCartClick={mockOnCartClick} />);

      // Desktop layout uses flex with space-x-3
      const actionsContainer = container.querySelector('.flex.items-center.space-x-3');
      expect(actionsContainer).toBeInTheDocument();
    });
  });

  describe('profile card positioning', () => {
    it('profile card is positioned absolutely', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toHaveClass('absolute');
      });
    });

    it('profile card is positioned on right', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toHaveClass('right-0');
      });
    });

    it('profile card has shadow', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toHaveClass('shadow-lg');
      });
    });

    it('profile card has rounded corners', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toHaveClass('rounded-lg');
      });
    });

    it('profile card has high z-index', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toHaveClass('z-100');
      });
    });
  });

  describe('cart badge', () => {
    const BadgeTestComponent = ({ onCartClick }) => {
      const { addToCart } = useCart();
      return (
        <>
          <button onClick={() => addToCart({ id: 1, name: 'Test', price: 10 })}>Add</button>
          <Header onCartClick={onCartClick} />
        </>
      );
    };

    const renderBadgeTest = (onCartClick) => {
      const user = userEvent.setup();
      return {
        user,
        ...rtlRender(
          <BrowserRouter>
            <ThemeProvider>
              <ToastProvider>
                <ProfileProvider>
                  <CartProvider>
                    <BadgeTestComponent onCartClick={onCartClick} />
                  </CartProvider>
                </ProfileProvider>
              </ToastProvider>
            </ThemeProvider>
          </BrowserRouter>
        ),
      };
    };

    it('badge is positioned at top right of cart button', async () => {
      const { user } = renderBadgeTest(mockOnCartClick);
      await user.click(screen.getByText('Add'));

      await waitFor(() => {
        const cartButton = document.getElementById('header-cart-button');
        const badge = cartButton.querySelector('span');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('absolute');
        expect(badge).toHaveClass('-top-1');
        expect(badge).toHaveClass('-right-1');
      });
    });

    it('badge has rounded styling', async () => {
      const { user } = renderBadgeTest(mockOnCartClick);
      await user.click(screen.getByText('Add'));

      await waitFor(() => {
        const cartButton = document.getElementById('header-cart-button');
        const badge = cartButton.querySelector('span');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('rounded-full');
      });
    });

    it('badge has bold text', async () => {
      const { user } = renderBadgeTest(mockOnCartClick);
      await user.click(screen.getByText('Add'));

      await waitFor(() => {
        const cartButton = document.getElementById('header-cart-button');
        const badge = cartButton.querySelector('span');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('font-bold');
      });
    });
  });

  describe('responsive behavior', () => {
    it('has responsive padding', () => {
      const { container } = render(<Header onCartClick={mockOnCartClick} />);

      const responsiveContainer = container.querySelector('.sm\\:px-4');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('has large screen padding', () => {
      const { container } = render(<Header onCartClick={mockOnCartClick} />);

      const lgContainer = container.querySelector('.px-2');
      expect(lgContainer).toBeInTheDocument();
    });
  });

  describe('profile card content sections', () => {
    it('has user info section with avatar', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        const avatarInCard = profileCard.querySelector('img');
        expect(avatarInCard).toBeInTheDocument();
      });
    });

    it('has address section', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText('Address:')).toBeInTheDocument();
      });
    });

    it('has phone section', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText('Phone:')).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    it('handles rapid cart button clicks', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      // Use specific ID to target the desktop cart button
      const cartButton = document.getElementById('header-cart-button');
      await user.click(cartButton);
      await user.click(cartButton);
      await user.click(cartButton);

      expect(mockOnCartClick).toHaveBeenCalledTimes(3);
    });

    it('handles rapid profile toggle clicks', async () => {
      const { user } = render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /view profile/i });
      await user.click(profileButton);
      await user.click(profileButton);
      await user.click(profileButton);

      // Should toggle correctly without errors
      expect(profileButton).toBeInTheDocument();
    });
  });
});
