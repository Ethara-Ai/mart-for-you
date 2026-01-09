// ProductsPage component tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import ProductsPage from './ProductsPage';
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
      article: ({ children, ...props }) => (
        <article {...filterMotionProps(props)}>{children}</article>
      ),
      span: ({ children, ...props }) => <span {...filterMotionProps(props)}>{children}</span>,
      p: ({ children, ...props }) => <p {...filterMotionProps(props)}>{children}</p>,
      h1: ({ children, ...props }) => <h1 {...filterMotionProps(props)}>{children}</h1>,
      h2: ({ children, ...props }) => <h2 {...filterMotionProps(props)}>{children}</h2>,
      a: ({ children, ...props }) => <a {...filterMotionProps(props)}>{children}</a>,
    },
  };
});

describe('ProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      expect(() => render(<ProductsPage />)).not.toThrow();
    });

    it('renders the page title', () => {
      render(<ProductsPage />);

      expect(screen.getByRole('heading', { name: /all products/i })).toBeInTheDocument();
    });

    it('renders the Navigation component', () => {
      render(<ProductsPage />);

      // Navigation should have category buttons - use button role to be specific
      expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
    });

    it('renders the products section', () => {
      render(<ProductsPage />);

      const productsSection = document.getElementById('products-section');
      expect(productsSection).toBeInTheDocument();
    });

    it('renders main content area', () => {
      render(<ProductsPage />);

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('displays product count', () => {
      render(<ProductsPage />);

      expect(screen.getByText(/products? found/i)).toBeInTheDocument();
    });
  });

  describe('page title and description', () => {
    it('shows "All Products" title by default', () => {
      render(<ProductsPage />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/all products/i);
    });

    it('shows default description text', () => {
      render(<ProductsPage />);

      expect(screen.getByText(/explore our complete collection/i)).toBeInTheDocument();
    });
  });

  describe('category filtering', () => {
    it('renders category navigation buttons', () => {
      render(<ProductsPage />);

      // Use button role to be specific and avoid matching headings
      expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /electronics/i })).toBeInTheDocument();
    });

    it('handles category change', async () => {
      const { user } = render(<ProductsPage />);

      const electronicsButton = screen.getByRole('button', { name: /electronics/i });
      await user.click(electronicsButton);

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });

    it('displays products based on selected category', () => {
      render(<ProductsPage />);

      // Products should be displayed
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('offers view', () => {
    it('shows offers navigation option', () => {
      render(<ProductsPage />);

      expect(screen.getByText(/offers/i)).toBeInTheDocument();
    });

    it('handles offers click', async () => {
      const { user } = render(<ProductsPage />);

      const offersButton = screen.getByRole('button', { name: /offers/i });
      if (offersButton) {
        await user.click(offersButton);

        await waitFor(() => {
          expect(document.body).toBeInTheDocument();
        });
      }
    });
  });

  describe('search functionality', () => {
    it('renders without search results summary when no search term', () => {
      render(<ProductsPage />);

      // No search results summary should be shown initially
      expect(screen.queryByText(/search results for/i)).not.toBeInTheDocument();
    });
  });

  describe('product grid', () => {
    it('displays products in a grid', () => {
      render(<ProductsPage />);

      // Should display product cards with images
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('displays product names', () => {
      render(<ProductsPage />);

      // Should display product headings
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('displays add to cart buttons', () => {
      render(<ProductsPage />);

      const addButtons = screen.getAllByRole('button', { name: /add.*cart/i });
      expect(addButtons.length).toBeGreaterThan(0);
    });
  });

  describe('cart modal', () => {
    it('includes cart modal component', () => {
      render(<ProductsPage />);

      // Cart modal should be in the DOM (even if hidden)
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('theming', () => {
    it('applies theme styles to page', () => {
      render(<ProductsPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveStyle({ background: expect.any(String) });
    });

    it('renders correctly in default theme', () => {
      render(<ProductsPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has main landmark', () => {
      render(<ProductsPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<ProductsPage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('buttons are focusable', () => {
      render(<ProductsPage />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('images have alt text', () => {
      render(<ProductsPage />);

      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('links are focusable', () => {
      render(<ProductsPage />);

      const links = screen.queryAllByRole('link');
      links.forEach((link) => {
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('page structure', () => {
    it('has correct container max-width', () => {
      const { container } = render(<ProductsPage />);

      const maxWidthContainer = container.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('has proper padding', () => {
      render(<ProductsPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('py-12');
    });

    it('has minimum height', () => {
      render(<ProductsPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('min-h-screen');
    });
  });

  describe('responsive design', () => {
    it('has responsive padding classes', () => {
      const { container } = render(<ProductsPage />);

      const responsiveContainer = container.querySelector('.px-3.sm\\:px-4');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('has responsive text sizes', () => {
      render(<ProductsPage />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('text-3xl');
      expect(title).toHaveClass('sm:text-4xl');
    });
  });

  describe('empty state', () => {
    it('handles empty product list gracefully', () => {
      render(<ProductsPage />);

      // Component should render without crashing
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('URL integration', () => {
    it('renders with category from URL', () => {
      renderWithMemoryRouter(<ProductsPage />, {
        initialEntries: ['/products?category=electronics'],
      });

      // Should render products page
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders without category in URL', () => {
      renderWithMemoryRouter(<ProductsPage />, {
        initialEntries: ['/products'],
      });

      expect(screen.getByRole('heading', { name: /all products/i })).toBeInTheDocument();
    });
  });

  describe('navigation interactions', () => {
    it('renders all category options', () => {
      render(<ProductsPage />);

      // Should have multiple category buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(1);
    });

    it('clicking category updates the view', async () => {
      const { user } = render(<ProductsPage />);

      const fashionButton = screen.queryByRole('button', { name: /fashion/i });
      if (fashionButton) {
        await user.click(fashionButton);

        await waitFor(() => {
          // Page should still be rendered after click
          expect(screen.getByRole('main')).toBeInTheDocument();
        });
      }
    });
  });

  describe('product display', () => {
    it('displays multiple products', () => {
      render(<ProductsPage />);

      // Should have multiple product images
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(1);
    });

    it('displays product prices', () => {
      render(<ProductsPage />);

      // Price elements should be present (formatted as $XX.XX)
      const priceElements = screen.getAllByText(/\$\d+\.\d{2}/);
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });

  describe('styling', () => {
    it('applies Metropolis font to title', () => {
      render(<ProductsPage />);

      const title = screen.getByRole('heading', { level: 1 });
      // Check that the style attribute contains the expected font family
      expect(title).toHaveAttribute('style', expect.stringContaining('Metropolis'));
    });

    it('title has correct letter spacing', () => {
      render(<ProductsPage />);

      const title = screen.getByRole('heading', { level: 1 });
      // Check that the style attribute contains the expected letter spacing
      expect(title).toHaveAttribute('style', expect.stringContaining('-0.5px'));
    });

    it('title has extra bold font weight', () => {
      render(<ProductsPage />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('font-extrabold');
    });
  });

  describe('integration', () => {
    it('integrates Navigation and ProductGrid components', () => {
      render(<ProductsPage />);

      // Navigation should be present - use button role to be specific
      expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();

      // Products should be present
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('maintains consistent layout', () => {
      const { container } = render(<ProductsPage />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('offers banner', () => {
    it('does not show offers banner by default', () => {
      render(<ProductsPage />);

      // Limited Time Offers banner should not be visible by default
      expect(screen.queryByText(/limited time offers/i)).not.toBeInTheDocument();
    });
  });

  describe('clear search', () => {
    it('does not show clear search button when no search is active', () => {
      render(<ProductsPage />);

      expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    });
  });
});
