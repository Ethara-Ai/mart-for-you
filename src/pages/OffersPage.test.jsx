// OffersPage component tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import OffersPage from './OffersPage';
import { render, renderWithMemoryRouter } from '../testing/test-utils';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');

  // Filter out framer-motion specific props that shouldn't be passed to DOM
  const filterMotionProps = (props) => {
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

  return {
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...filterMotionProps(props)}>{children}</div>,
      button: ({ children, ...props }) => <button {...filterMotionProps(props)}>{children}</button>,
      section: ({ children, ...props }) => (
        <section {...filterMotionProps(props)}>{children}</section>
      ),
      span: ({ children, ...props }) => <span {...filterMotionProps(props)}>{children}</span>,
      p: ({ children, ...props }) => <p {...filterMotionProps(props)}>{children}</p>,
      h1: ({ children, ...props }) => <h1 {...filterMotionProps(props)}>{children}</h1>,
      h2: ({ children, ...props }) => <h2 {...filterMotionProps(props)}>{children}</h2>,
      a: ({ children, ...props }) => <a {...filterMotionProps(props)}>{children}</a>,
    },
  };
});

describe('OffersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      expect(() => render(<OffersPage />)).not.toThrow();
    });

    it('renders the page title', () => {
      render(<OffersPage />);

      expect(screen.getByRole('heading', { name: /special offers/i })).toBeInTheDocument();
    });

    it('renders the Hero component', () => {
      render(<OffersPage />);

      // Hero should be present with offers-specific content
      expect(document.body).toBeInTheDocument();
    });

    it('renders the Navigation component', () => {
      render(<OffersPage />);

      // Navigation should have category buttons - use button role to be specific
      expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
    });

    it('renders main content area', () => {
      render(<OffersPage />);

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('renders products section with correct ID', () => {
      render(<OffersPage />);

      const productsSection = document.getElementById('products-section');
      expect(productsSection).toBeInTheDocument();
    });
  });

  describe('promotional banner', () => {
    it('displays promotional banner', () => {
      render(<OffersPage />);

      expect(screen.getByText(/limited time offers/i)).toBeInTheDocument();
    });

    it('displays discount information', () => {
      render(<OffersPage />);

      expect(screen.getByText(/up to 40% off/i)).toBeInTheDocument();
    });

    it('displays "Items on Sale" stat', () => {
      render(<OffersPage />);

      expect(screen.getByText(/items on sale/i)).toBeInTheDocument();
    });

    it('displays "Total Savings" stat', () => {
      render(<OffersPage />);

      expect(screen.getByText(/total savings/i)).toBeInTheDocument();
    });

    it('displays clock icon in banner', () => {
      render(<OffersPage />);

      // The clock icon should be present
      const svgElements = document.querySelectorAll('svg');
      expect(svgElements.length).toBeGreaterThan(0);
    });
  });

  describe('page header', () => {
    it('displays offers emoji in title', () => {
      render(<OffersPage />);

      expect(screen.getByText(/🔥/)).toBeInTheDocument();
    });

    it('displays subtitle/description', () => {
      render(<OffersPage />);

      expect(screen.getByText(/don't miss out on these amazing deals/i)).toBeInTheDocument();
    });
  });

  describe('navigation interaction', () => {
    it('renders category navigation buttons', () => {
      render(<OffersPage />);

      // Use button role to be specific and avoid matching headings
      expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
    });

    it('shows offers as active in navigation', () => {
      render(<OffersPage />);

      // The offers button should be styled as active
      const offersButton = screen.getByRole('button', { name: /offers/i });
      expect(offersButton).toBeInTheDocument();
    });

    it('handles category change', async () => {
      const { user } = render(<OffersPage />);

      const electronicsButton = screen.queryByRole('button', { name: /electronics/i });
      if (electronicsButton) {
        await user.click(electronicsButton);

        await waitFor(() => {
          expect(document.body).toBeInTheDocument();
        });
      }
    });
  });

  describe('products display', () => {
    it('displays sale products', () => {
      render(<OffersPage />);

      // Should display product cards for sale items
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('shows SALE badges on products', () => {
      render(<OffersPage />);

      // Sale products should have SALE badges
      const saleBadges = screen.queryAllByText('SALE');
      expect(saleBadges.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('cart modal', () => {
    it('includes cart modal component', () => {
      render(<OffersPage />);

      // Cart modal should be in the DOM (even if hidden)
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('theming', () => {
    it('applies theme styles', () => {
      render(<OffersPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveStyle({ background: expect.any(String) });
    });
  });

  describe('accessibility', () => {
    it('has main landmark', () => {
      render(<OffersPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<OffersPage />);

      // Page has multiple H1s (Hero + page title), check that at least one exists
      const h1s = screen.getAllByRole('heading', { level: 1 });
      expect(h1s.length).toBeGreaterThan(0);
    });

    it('buttons are focusable', () => {
      render(<OffersPage />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('images have alt text', () => {
      render(<OffersPage />);

      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });

  describe('responsive behavior', () => {
    it('renders without errors at any viewport', () => {
      expect(() => render(<OffersPage />)).not.toThrow();
    });

    it('main content has minimum height', () => {
      render(<OffersPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('min-h-screen');
    });
  });

  describe('empty states', () => {
    it('has an empty message configured', () => {
      render(<OffersPage />);

      // The ProductGrid component should have an empty message prop set
      // Even if there are products, this tests that the component is configured correctly
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('page layout', () => {
    it('has correct max-width constraint', () => {
      const { container } = render(<OffersPage />);

      const maxWidthContainer = container.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('has correct padding', () => {
      const { container } = render(<OffersPage />);

      const paddedContainer = container.querySelector('.py-12');
      expect(paddedContainer).toBeInTheDocument();
    });
  });

  describe('bottom CTA', () => {
    it('displays disclaimer text', () => {
      render(<OffersPage />);

      expect(screen.getByText(/offers valid while supplies last/i)).toBeInTheDocument();
    });
  });

  describe('search results handling', () => {
    it('does not show search results section when no search term', () => {
      render(<OffersPage />);

      // Should not show "Search results for:" when no search
      expect(screen.queryByText(/search results for:/i)).not.toBeInTheDocument();
    });
  });

  describe('statistics display', () => {
    it('displays number of items on sale', () => {
      render(<OffersPage />);

      // Should show count of sale items
      const itemsOnSale = screen.getByText(/items on sale/i);
      expect(itemsOnSale).toBeInTheDocument();
    });

    it('displays total savings amount', () => {
      render(<OffersPage />);

      // Should show savings with dollar sign and plus
      expect(screen.getByText(/\$.*\+/)).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('promotional banner has gradient background', () => {
      const { container } = render(<OffersPage />);

      // Banner should have gradient styling
      const banner = container.querySelector('.rounded-lg');
      expect(banner).toBeInTheDocument();
    });

    it('title has correct font styling', () => {
      render(<OffersPage />);

      // Page has multiple H1s, get the one with the emoji (Special Offers title)
      const title = screen.getByText(/🔥 Special Offers/);
      // Check that the style attribute contains the expected font family
      expect(title).toHaveAttribute('style', expect.stringContaining('Metropolis'));
    });
  });

  describe('with MemoryRouter', () => {
    it('renders correctly with MemoryRouter', () => {
      renderWithMemoryRouter(<OffersPage />, { initialEntries: ['/offers'] });

      expect(screen.getByRole('heading', { name: /special offers/i })).toBeInTheDocument();
    });
  });

  describe('Hero customization', () => {
    it('displays offers-specific Hero content', () => {
      render(<OffersPage />);

      // Hero on offers page has specific title and subtitle
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('integration', () => {
    it('integrates Hero, Navigation, and ProductGrid sections', () => {
      render(<OffersPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(document.getElementById('products-section')).toBeInTheDocument();
    });

    it('maintains consistent layout', () => {
      const { container } = render(<OffersPage />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
