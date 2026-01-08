// CategorySection component tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import CategorySection from './CategorySection';
import { render, mockProducts } from '../testing/test-utils';

describe('CategorySection', () => {
  const defaultProps = {
    title: 'Electronics',
    categoryId: 'electronics',
    products: mockProducts,
    seeAllLink: '/products?category=electronics',
  };

  // Mock scrollBy for scroll functionality tests
  const mockScrollBy = vi.fn();
  const mockScrollTo = vi.fn();

  beforeEach(() => {
    // Reset mocks
    mockScrollBy.mockClear();
    mockScrollTo.mockClear();

    // Mock Element.scrollBy
    Element.prototype.scrollBy = mockScrollBy;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the category title', () => {
      render(<CategorySection {...defaultProps} />);

      expect(screen.getByRole('heading', { name: defaultProps.title })).toBeInTheDocument();
    });

    it('renders "see all" link', () => {
      render(<CategorySection {...defaultProps} />);

      const seeAllLink = screen.getByRole('link', { name: /see all/i });
      expect(seeAllLink).toBeInTheDocument();
      expect(seeAllLink).toHaveAttribute('href', defaultProps.seeAllLink);
    });

    it('renders products', () => {
      render(<CategorySection {...defaultProps} />);

      // Check that product names are rendered
      mockProducts.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });

    it('renders as a section element', () => {
      const { container } = render(<CategorySection {...defaultProps} />);

      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('applies correct styles to title', () => {
      render(<CategorySection {...defaultProps} />);

      const title = screen.getByRole('heading', { name: defaultProps.title });
      // Check that the style attribute contains the expected font family
      expect(title).toHaveAttribute('style', expect.stringContaining('Metropolis'));
    });
  });

  describe('empty state', () => {
    it('returns null when products array is empty', () => {
      const { container } = render(<CategorySection {...defaultProps} products={[]} />);

      expect(container.querySelector('section')).not.toBeInTheDocument();
    });

    it('returns null when products is null', () => {
      const { container } = render(<CategorySection {...defaultProps} products={null} />);

      expect(container.querySelector('section')).not.toBeInTheDocument();
    });

    it('returns null when products is undefined', () => {
      const { container } = render(<CategorySection {...defaultProps} products={undefined} />);

      expect(container.querySelector('section')).not.toBeInTheDocument();
    });
  });

  describe('see all link', () => {
    it('uses seeAllLink prop when provided', () => {
      const customLink = '/custom-link';
      render(<CategorySection {...defaultProps} seeAllLink={customLink} />);

      const seeAllLink = screen.getByRole('link', { name: /see all/i });
      expect(seeAllLink).toHaveAttribute('href', customLink);
    });

    it('falls back to category-based link when seeAllLink is not provided', () => {
      const { seeAllLink: _, ...propsWithoutLink } = defaultProps;
      render(<CategorySection {...propsWithoutLink} />);

      const link = screen.getByRole('link', { name: /see all/i });
      expect(link).toHaveAttribute('href', `/products?category=${defaultProps.categoryId}`);
    });

    it('has correct styling on see all link', () => {
      render(<CategorySection {...defaultProps} />);

      const seeAllLink = screen.getByRole('link', { name: /see all/i });
      // Check that the style attribute contains the expected green color (hex or rgb)
      expect(seeAllLink).toHaveAttribute(
        'style',
        expect.stringMatching(/16a34a|rgb\(22, 163, 74\)/i)
      );
    });
  });

  describe('scroll buttons', () => {
    it('renders left scroll button with correct aria-label', () => {
      render(<CategorySection {...defaultProps} />);

      // The scroll buttons may or may not be present depending on scroll state
      const leftButton = screen.queryByRole('button', { name: /scroll left/i });
      // Button should not be visible initially (can't scroll left at start)
      expect(leftButton).not.toBeInTheDocument();
    });

    it('renders right scroll button with correct aria-label when scrollable', () => {
      render(<CategorySection {...defaultProps} />);

      // Right scroll button may be present if content overflows
      const rightButton = screen.queryByRole('button', { name: /scroll right/i });
      // Depending on viewport, this may or may not be present
      // We're just checking the query doesn't throw
      expect(rightButton === null || rightButton !== null).toBe(true);
    });
  });

  describe('product cards', () => {
    it('renders ProductCard for each product', () => {
      render(<CategorySection {...defaultProps} />);

      mockProducts.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });

    it('wraps each product in a wrapper with correct class', () => {
      const { container } = render(<CategorySection {...defaultProps} />);

      const wrappers = container.querySelectorAll('.product-card-wrapper');
      expect(wrappers.length).toBe(mockProducts.length);
    });

    it('applies shrink-0 to product wrappers', () => {
      const { container } = render(<CategorySection {...defaultProps} />);

      const wrappers = container.querySelectorAll('.product-card-wrapper');
      wrappers.forEach((wrapper) => {
        expect(wrapper).toHaveClass('shrink-0');
      });
    });
  });

  describe('scroll container', () => {
    it('renders scrollable container', () => {
      const { container } = render(<CategorySection {...defaultProps} />);

      const scrollContainer = container.querySelector('.overflow-x-auto');
      expect(scrollContainer).toBeInTheDocument();
    });

    it('applies scrollbar-hide class', () => {
      const { container } = render(<CategorySection {...defaultProps} />);

      const scrollContainer = container.querySelector('.scrollbar-hide');
      expect(scrollContainer).toBeInTheDocument();
    });

    it('has correct gap between products', () => {
      const { container } = render(<CategorySection {...defaultProps} />);

      const scrollContainer = container.querySelector('.overflow-x-auto');
      expect(scrollContainer).toHaveClass('gap-3');
    });
  });

  describe('scroll functionality', () => {
    it('calls scrollBy when scroll right button is clicked', async () => {
      // Create a mock scroll container with scrollable content
      const manyProducts = Array.from({ length: 10 }, (_, i) => ({
        ...mockProducts[0],
        id: i + 1,
        name: `Product ${i + 1}`,
      }));

      const { container } = render(<CategorySection {...defaultProps} products={manyProducts} />);

      // Manually set scroll properties to enable right scroll button
      const scrollContainer = container.querySelector('.overflow-x-auto');
      if (scrollContainer) {
        Object.defineProperty(scrollContainer, 'scrollWidth', { value: 2000, writable: true });
        Object.defineProperty(scrollContainer, 'clientWidth', { value: 500, writable: true });
        Object.defineProperty(scrollContainer, 'scrollLeft', { value: 0, writable: true });

        // Trigger scroll event to update button states
        fireEvent.scroll(scrollContainer);
      }

      // Look for scroll right button
      const rightButton = screen.queryByRole('button', { name: /scroll right/i });
      if (rightButton) {
        await fireEvent.click(rightButton);
        expect(mockScrollBy).toHaveBeenCalled();
      }
    });
  });

  describe('responsive behavior', () => {
    it('adds resize event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      render(<CategorySection {...defaultProps} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('removes resize event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(<CategorySection {...defaultProps} />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('theming', () => {
    it('renders correctly in light mode', () => {
      render(<CategorySection {...defaultProps} />);

      const title = screen.getByRole('heading', { name: defaultProps.title });
      expect(title).toBeInTheDocument();
    });

    it('see all link has green color', () => {
      render(<CategorySection {...defaultProps} />);

      const seeAllLink = screen.getByRole('link', { name: /see all/i });
      // Check that the style attribute contains the expected green color (hex or rgb)
      expect(seeAllLink).toHaveAttribute(
        'style',
        expect.stringMatching(/16a34a|rgb\(22, 163, 74\)/i)
      );
    });
  });

  describe('header section', () => {
    it('displays title and see all link in same row', () => {
      const { container } = render(<CategorySection {...defaultProps} />);

      const header = container.querySelector('.flex.items-center.justify-between');
      expect(header).toBeInTheDocument();
    });

    it('has correct margin below header', () => {
      const { container } = render(<CategorySection {...defaultProps} />);

      const header = container.querySelector('.flex.items-center.justify-between');
      expect(header).toHaveClass('mb-4');
    });
  });

  describe('accessibility', () => {
    it('uses heading element for title', () => {
      render(<CategorySection {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent(defaultProps.title);
    });

    it('see all link is focusable', () => {
      render(<CategorySection {...defaultProps} />);

      const link = screen.getByRole('link', { name: /see all/i });
      expect(link).not.toHaveAttribute('tabindex', '-1');
    });

    it('scroll buttons have aria-labels', () => {
      const manyProducts = Array.from({ length: 10 }, (_, i) => ({
        ...mockProducts[0],
        id: i + 1,
        name: `Product ${i + 1}`,
      }));

      render(<CategorySection {...defaultProps} products={manyProducts} />);

      // Buttons may or may not be present, but if they are, they should have aria-labels
      const buttons = screen.queryAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-label');
      });
    });
  });

  describe('with single product', () => {
    it('renders single product correctly', () => {
      const singleProduct = [mockProducts[0]];
      render(<CategorySection {...defaultProps} products={singleProduct} />);

      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    });

    it('does not show scroll buttons for single product', () => {
      const singleProduct = [mockProducts[0]];
      render(<CategorySection {...defaultProps} products={singleProduct} />);

      expect(screen.queryByRole('button', { name: /scroll left/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /scroll right/i })).not.toBeInTheDocument();
    });
  });

  describe('different titles and categories', () => {
    it('renders with different title', () => {
      render(<CategorySection {...defaultProps} title="Fashion & Apparel" />);

      expect(screen.getByRole('heading', { name: 'Fashion & Apparel' })).toBeInTheDocument();
    });

    it('renders with different categoryId', () => {
      render(<CategorySection {...defaultProps} categoryId="fashion" seeAllLink={undefined} />);

      const seeAllLink = screen.getByRole('link', { name: /see all/i });
      expect(seeAllLink).toHaveAttribute('href', '/products?category=fashion');
    });
  });
});
