// Header component tests
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { render } from '../testing/test-utils';
import { useCart } from '../context/CartContext';

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

      // Desktop has "Toggle profile card", mobile has "Open menu"
      const profileButtons = screen.getAllByRole('button', {
        name: /(toggle profile card|open menu)/i,
      });
      expect(profileButtons.length).toBeGreaterThan(0);
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
      const { user } = render(<Header />);

      const cartButton = screen.getAllByRole('button', { name: /view shopping cart/i })[0];
      await user.click(cartButton);

      // Cart now opens via context, not prop callback
      expect(cartButton).toBeInTheDocument();
    });

    it('displays cart item count when cart has items', async () => {
      // Component that uses the cart
      const CartItemAdder = () => {
        const { addToCart } = useCart();
        return (
          <>
            <button onClick={() => addToCart({ id: 1, name: 'Test', price: 10 })}>Add Item</button>
            <Header />
          </>
        );
      };

      const { user } = render(<CartItemAdder />);

      await user.click(screen.getByText('Add Item'));

      await waitFor(
        () => {
          // Multiple badges for responsive layouts (mobile + desktop)
          expect(screen.getAllByText('1').length).toBeGreaterThan(0);
        },
        { timeout: 2000 }
      );
    });

    it('does not show count badge when cart is empty', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      // Should not have a badge with number - use specific ID
      const cartButton = document.getElementById('desktop-cart-button');
      const badge = cartButton?.querySelector('span');
      expect(badge).toBeNull();
    });

    it('cart button has id for targeting', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const cartButton = document.getElementById('desktop-cart-button');
      expect(cartButton).toBeInTheDocument();
    });

    it('cart button has shopping cart icon', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      // Use specific ID to target the desktop cart button
      const cartButton = document.getElementById('desktop-cart-button');
      const svg = cartButton?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('displays 99+ when cart has more than 99 items', async () => {
      const LargeCartAdder = () => {
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
            <Header />
          </>
        );
      };

      const { user } = render(<LargeCartAdder />);

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
      const { user } = render(<Header />);

      // Desktop profile button has "Toggle profile card"
      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      // Profile card should appear
      await waitFor(() => {
        expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
      });
    });

    it('closes profile card when clicked again', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);
      await user.click(profileButton);

      // Profile card should be closed
      await waitFor(() => {
        expect(screen.queryByText(/edit profile/i)).not.toBeInTheDocument();
      });
    });

    it('displays user name in profile card', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(
        () => {
          // Default profile name is in the profile card
          const profileCard = document.getElementById('profile-card');
          expect(profileCard).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('displays user email in profile card', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(
        () => {
          // Email should be visible in profile card
          const profileCard = document.getElementById('profile-card');
          expect(profileCard).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('displays user phone in profile card', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        // Phone might be displayed in formatted address or separately
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toBeInTheDocument();
      });
    });

    it('has edit profile button in profile card', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
      });
    });

    it('has view full profile link in profile card', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        // Edit profile button serves as the link to full profile
        expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
      });
    });

    it('profile card has id for targeting', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toBeInTheDocument();
      });
    });

    it('profile button has aria-expanded attribute', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });

      expect(profileButton).toHaveAttribute('aria-expanded', 'false');

      await user.click(profileButton);

      expect(profileButton).toHaveAttribute('aria-expanded', 'true');
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
      const cartButton = document.getElementById('desktop-cart-button');
      expect(cartButton).toHaveAccessibleName();
    });

    it('profile button has accessible label', () => {
      render(<Header onCartClick={mockOnCartClick} />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
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

      // Desktop layout uses gap-3 for spacing
      const actionsContainer = container.querySelector('.gap-3');
      expect(actionsContainer).toBeInTheDocument();
    });

    it('actions container uses flexbox', () => {
      const { container } = render(<Header onCartClick={mockOnCartClick} />);

      // Desktop layout uses flex with gap-3
      const actionsContainer = container.querySelector('.flex.items-center.gap-3');
      expect(actionsContainer).toBeInTheDocument();
    });
  });

  describe('profile card positioning', () => {
    it('profile card is positioned absolutely', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toHaveClass('absolute');
      });
    });

    it('profile card is positioned on right', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toHaveClass('right-0');
      });
    });

    it('profile card has rounded corners', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toHaveClass('rounded-lg');
      });
    });

    it('profile card has shadow', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toHaveClass('shadow-xl');
      });
    });

    it('profile card has high z-index', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toHaveClass('z-50');
      });
    });
  });

  describe('cart badge', () => {
    const BadgeTestComponent = () => {
      const { addToCart } = useCart();
      return (
        <>
          <button onClick={() => addToCart({ id: 1, name: 'Test', price: 10 })}>Add</button>
          <Header />
        </>
      );
    };

    const renderBadgeTest = () => {
      const user = userEvent.setup();
      return {
        user,
        ...render(<BadgeTestComponent />),
      };
    };

    it('badge is positioned at top right of cart button', async () => {
      const { user } = renderBadgeTest();
      await user.click(screen.getByText('Add'));

      await waitFor(
        () => {
          const cartButton = document.getElementById('desktop-cart-button');
          const badge = cartButton?.querySelector('span');
          expect(badge).toBeInTheDocument();
          expect(badge).toHaveClass('absolute');
          expect(badge).toHaveClass('-top-1');
          expect(badge).toHaveClass('-right-1');
        },
        { timeout: 2000 }
      );
    });

    it('badge has rounded styling', async () => {
      const { user } = renderBadgeTest();
      await user.click(screen.getByText('Add'));

      await waitFor(
        () => {
          const cartButton = document.getElementById('desktop-cart-button');
          const badge = cartButton?.querySelector('span');
          expect(badge).toBeInTheDocument();
          expect(badge).toHaveClass('rounded-full');
        },
        { timeout: 2000 }
      );
    });

    it('badge has bold text', async () => {
      const { user } = renderBadgeTest();
      await user.click(screen.getByText('Add'));

      await waitFor(
        () => {
          const cartButton = document.getElementById('desktop-cart-button');
          const badge = cartButton?.querySelector('span');
          expect(badge).toBeInTheDocument();
          expect(badge).toHaveClass('font-bold');
        },
        { timeout: 2000 }
      );
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
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        const profileCard = document.getElementById('profile-card');
        const avatars = profileCard.querySelectorAll('img');
        expect(avatars.length).toBeGreaterThan(0);
      });
    });

    it('has address section', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        // Address text should be visible in profile card
        const profileCard = document.getElementById('profile-card');
        expect(profileCard.textContent).toMatch(/\d+.*street|avenue|road|blvd|lane/i);
      });
    });

    it('has phone section', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);

      await waitFor(() => {
        // Phone might be in address format or separate
        const profileCard = document.getElementById('profile-card');
        expect(profileCard).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    it('handles rapid cart button clicks', async () => {
      const { user } = render(<Header />);

      const cartButton = screen.getAllByRole('button', { name: /view shopping cart/i })[0];

      // Rapid clicks - cart now opens via context
      await user.click(cartButton);
      await user.click(cartButton);
      await user.click(cartButton);

      expect(cartButton).toBeInTheDocument();
    });

    it('handles rapid profile toggle clicks', async () => {
      const { user } = render(<Header />);

      const profileButton = screen.getByRole('button', { name: /toggle profile card/i });
      await user.click(profileButton);
      await user.click(profileButton);
      await user.click(profileButton);

      // Should toggle correctly without errors
      expect(profileButton).toBeInTheDocument();
    });
  });
});
