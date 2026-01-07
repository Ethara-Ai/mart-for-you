// ProductGrid component tests
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import ProductGrid from './ProductGrid';
import { render, mockProduct, mockSaleProduct, mockProducts } from '../../testing/test-utils';

describe('ProductGrid', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<ProductGrid products={[]} />);

      expect(document.body).toBeInTheDocument();
    });

    it('renders products when provided', () => {
      render(<ProductGrid products={[mockProduct]} />);

      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    });

    it('renders multiple products', () => {
      render(<ProductGrid products={mockProducts} />);

      mockProducts.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });

    it('renders ProductCard for each product', () => {
      render(<ProductGrid products={mockProducts} />);

      const addToCartButtons = screen.getAllByRole('button', { name: /add.*cart/i });
      expect(addToCartButtons.length).toBe(mockProducts.length);
    });
  });

  describe('empty state', () => {
    it('displays empty state when products array is empty', () => {
      render(<ProductGrid products={[]} />);

      expect(screen.getByText('No products found')).toBeInTheDocument();
    });

    it('displays custom empty message when provided', () => {
      render(<ProductGrid products={[]} emptyMessage="No items available" />);

      expect(screen.getByText('No items available')).toBeInTheDocument();
    });

    it('displays helper text in empty state', () => {
      render(<ProductGrid products={[]} />);

      expect(screen.getByText(/try adjusting your search or filters/i)).toBeInTheDocument();
    });

    it('displays empty icon in empty state', () => {
      const { container } = render(<ProductGrid products={[]} />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('empty state is centered', () => {
      const { container } = render(<ProductGrid products={[]} />);

      const emptyContainer = container.querySelector('.text-center');
      expect(emptyContainer).toBeInTheDocument();
    });

    it('empty state has vertical padding', () => {
      const { container } = render(<ProductGrid products={[]} />);

      const emptyContainer = container.querySelector('.py-16');
      expect(emptyContainer).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('displays loading skeletons when loading is true', () => {
      const { container } = render(<ProductGrid products={[]} loading={true} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders 8 skeleton items when loading', () => {
      const { container } = render(<ProductGrid products={[]} loading={true} />);

      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(8);
    });

    it('does not show empty state when loading', () => {
      render(<ProductGrid products={[]} loading={true} />);

      expect(screen.queryByText('No products found')).not.toBeInTheDocument();
    });

    it('does not show products when loading', () => {
      render(<ProductGrid products={[mockProduct]} loading={true} />);

      expect(screen.queryByText(mockProduct.name)).not.toBeInTheDocument();
    });

    it('skeleton has image placeholder', () => {
      const { container } = render(<ProductGrid products={[]} loading={true} />);

      const imagePlaceholder = container.querySelector('.h-64.w-full');
      expect(imagePlaceholder).toBeInTheDocument();
    });

    it('skeleton has content placeholders', () => {
      const { container } = render(<ProductGrid products={[]} loading={true} />);

      const contentArea = container.querySelector('.p-4.space-y-3');
      expect(contentArea).toBeInTheDocument();
    });

    it('loading defaults to false', () => {
      render(<ProductGrid products={[mockProduct]} />);

      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    });
  });

  describe('grid layout', () => {
    it('has grid layout class', () => {
      const { container } = render(<ProductGrid products={mockProducts} />);

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('has responsive grid columns by default', () => {
      const { container } = render(<ProductGrid products={mockProducts} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('sm:grid-cols-2');
      expect(grid).toHaveClass('md:grid-cols-3');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });

    it('has gap between grid items', () => {
      const { container } = render(<ProductGrid products={mockProducts} />);

      const grid = container.querySelector('.gap-8');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('custom columns prop', () => {
    it('applies custom columns when specified', () => {
      const { container } = render(<ProductGrid products={mockProducts} columns={3} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-3');
    });

    it('does not apply responsive classes when custom columns specified', () => {
      const { container } = render(<ProductGrid products={mockProducts} columns={2} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-2');
      expect(grid).not.toHaveClass('sm:grid-cols-2');
    });
  });

  describe('className prop', () => {
    it('applies additional className to grid', () => {
      const { container } = render(
        <ProductGrid products={mockProducts} className="custom-class" />,
      );

      const grid = container.querySelector('.custom-class');
      expect(grid).toBeInTheDocument();
    });

    it('preserves grid classes with custom className', () => {
      const { container } = render(
        <ProductGrid products={mockProducts} className="custom-class" />,
      );

      const grid = container.querySelector('.grid.custom-class');
      expect(grid).toBeInTheDocument();
    });

    it('works with empty className', () => {
      const { container } = render(<ProductGrid products={mockProducts} className="" />);

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('applies multiple custom classes', () => {
      const { container } = render(
        <ProductGrid products={mockProducts} className="class-one class-two" />,
      );

      const grid = container.querySelector('.class-one.class-two');
      expect(grid).toBeInTheDocument();
    });

    it('applies className to empty state container', () => {
      const { container } = render(<ProductGrid products={[]} className="custom-empty-class" />);

      const emptyContainer = container.querySelector('.custom-empty-class');
      expect(emptyContainer).toBeInTheDocument();
    });

    it('applies className to loading state container', () => {
      const { container } = render(
        <ProductGrid products={[]} loading={true} className="custom-loading-class" />,
      );

      const loadingContainer = container.querySelector('.custom-loading-class');
      expect(loadingContainer).toBeInTheDocument();
    });
  });

  describe('onAddToCart handler', () => {
    it('passes onAddToCart to ProductCard components', async () => {
      const mockOnAddToCart = vi.fn();
      const { user } = render(
        <ProductGrid products={[mockProduct]} onAddToCart={mockOnAddToCart} />,
      );

      const addButton = screen.getByRole('button', { name: /add.*cart/i });
      await user.click(addButton);

      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    it('calls onAddToCart for correct product', async () => {
      const mockOnAddToCart = vi.fn();
      const { user } = render(
        <ProductGrid products={mockProducts} onAddToCart={mockOnAddToCart} />,
      );

      const addButtons = screen.getAllByRole('button', { name: /add.*cart/i });
      await user.click(addButtons[1]); // Click second product's button

      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProducts[1]);
    });

    it('works without onAddToCart (uses default cart behavior)', async () => {
      const { user } = render(<ProductGrid products={[mockProduct]} />);

      const addButton = screen.getByRole('button', { name: /add.*cart/i });
      await user.click(addButton);

      // Should not throw error
      expect(addButton).toBeInTheDocument();
    });
  });

  describe('products prop', () => {
    it('defaults to empty array', () => {
      render(<ProductGrid />);

      expect(screen.getByText('No products found')).toBeInTheDocument();
    });

    it('handles undefined products gracefully', () => {
      render(<ProductGrid products={undefined} />);

      expect(screen.getByText('No products found')).toBeInTheDocument();
    });

    it('renders sale products correctly', () => {
      render(<ProductGrid products={[mockSaleProduct]} />);

      expect(screen.getByText(mockSaleProduct.name)).toBeInTheDocument();
      expect(screen.getByText('SALE')).toBeInTheDocument();
    });

    it('renders mix of regular and sale products', () => {
      render(<ProductGrid products={[mockProduct, mockSaleProduct]} />);

      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
      expect(screen.getByText(mockSaleProduct.name)).toBeInTheDocument();
    });
  });

  describe('emptyMessage prop', () => {
    it('displays default empty message', () => {
      render(<ProductGrid products={[]} />);

      expect(screen.getByText('No products found')).toBeInTheDocument();
    });

    it('displays custom empty message', () => {
      render(<ProductGrid products={[]} emptyMessage="No results for your search" />);

      expect(screen.getByText('No results for your search')).toBeInTheDocument();
    });

    it('handles long empty messages', () => {
      const longMessage =
        'This is a very long empty message that should still display correctly in the empty state';
      render(<ProductGrid products={[]} emptyMessage={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles empty message with special characters', () => {
      render(<ProductGrid products={[]} emptyMessage="No results! Try again?" />);

      expect(screen.getByText('No results! Try again?')).toBeInTheDocument();
    });
  });

  describe('product rendering', () => {
    it('renders product images', () => {
      render(<ProductGrid products={[mockProduct]} />);

      const image = screen.getByAltText(mockProduct.name);
      expect(image).toBeInTheDocument();
    });

    it('renders product descriptions', () => {
      render(<ProductGrid products={[mockProduct]} />);

      expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    });

    it('renders product prices', () => {
      render(<ProductGrid products={[mockProduct]} />);

      expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    });

    it('renders product categories', () => {
      render(<ProductGrid products={[mockProduct]} />);

      expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('product cards have accessible add to cart buttons', () => {
      render(<ProductGrid products={[mockProduct]} />);

      const button = screen.getByRole('button', { name: /add.*cart/i });
      expect(button).toHaveAccessibleName();
    });

    it('product images have alt text', () => {
      render(<ProductGrid products={mockProducts} />);

      mockProducts.forEach((product) => {
        const image = screen.getByAltText(product.name);
        expect(image).toBeInTheDocument();
      });
    });

    it('empty state message is visible', () => {
      render(<ProductGrid products={[]} />);

      expect(screen.getByText('No products found')).toBeVisible();
    });
  });

  describe('skeleton styling', () => {
    it('skeletons have rounded corners', () => {
      const { container } = render(<ProductGrid products={[]} loading={true} />);

      const skeleton = container.querySelector('.rounded-lg');
      expect(skeleton).toBeInTheDocument();
    });

    it('skeletons have overflow hidden', () => {
      const { container } = render(<ProductGrid products={[]} loading={true} />);

      const skeleton = container.querySelector('.overflow-hidden');
      expect(skeleton).toBeInTheDocument();
    });

    it('skeleton placeholders have correct height', () => {
      const { container } = render(<ProductGrid products={[]} loading={true} />);

      const imagePlaceholder = container.querySelector('.h-64');
      expect(imagePlaceholder).toBeInTheDocument();
    });
  });

  describe('empty state styling', () => {
    it('empty state has icon container with rounded full', () => {
      const { container } = render(<ProductGrid products={[]} />);

      const iconContainer = container.querySelector(
        '.rounded-full.flex.items-center.justify-center',
      );
      expect(iconContainer).toBeInTheDocument();
    });

    it('empty state title has proper styling', () => {
      render(<ProductGrid products={[]} />);

      const title = screen.getByText('No products found');
      expect(title).toHaveClass('text-xl');
      expect(title).toHaveClass('font-medium');
    });

    it('empty state has margin bottom on title', () => {
      render(<ProductGrid products={[]} />);

      const title = screen.getByText('No products found');
      expect(title).toHaveClass('mb-2');
    });
  });

  describe('theme integration', () => {
    it('renders correctly with theme provider', () => {
      render(<ProductGrid products={mockProducts} />);

      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    });

    it('skeleton items have inline styles for background', () => {
      const { container } = render(<ProductGrid products={[]} loading={true} />);

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toHaveAttribute('style');
    });

    it('empty state elements have inline styles', () => {
      const { container } = render(<ProductGrid products={[]} />);

      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toHaveAttribute('style');
    });
  });

  describe('edge cases', () => {
    it('handles single product', () => {
      render(<ProductGrid products={[mockProduct]} />);

      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    });

    it('handles large number of products', () => {
      const manyProducts = Array(20)
        .fill(null)
        .map((_, i) => ({
          ...mockProduct,
          id: i + 1,
          name: `Product ${i + 1}`,
        }));

      render(<ProductGrid products={manyProducts} />);

      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 20')).toBeInTheDocument();
    });

    it('handles products with same names', () => {
      const duplicateProducts = [
        { ...mockProduct, id: 1 },
        { ...mockProduct, id: 2 },
      ];

      render(<ProductGrid products={duplicateProducts} />);

      const productNames = screen.getAllByText(mockProduct.name);
      expect(productNames.length).toBe(2);
    });

    it('re-renders when products change', () => {
      const { rerender } = render(<ProductGrid products={[mockProduct]} />);

      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();

      rerender(<ProductGrid products={[mockSaleProduct]} />);

      expect(screen.getByText(mockSaleProduct.name)).toBeInTheDocument();
      // Due to AnimatePresence, the old product might still be exiting
      // Just verify the new product is rendered
    });

    it('switches from loading to products correctly', () => {
      const { rerender } = render(<ProductGrid products={[]} loading={true} />);

      expect(screen.queryByText(mockProduct.name)).not.toBeInTheDocument();

      rerender(<ProductGrid products={[mockProduct]} loading={false} />);

      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    });

    it('switches from products to empty correctly', () => {
      const { rerender } = render(<ProductGrid products={[mockProduct]} />);

      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();

      rerender(<ProductGrid products={[]} />);

      expect(screen.getByText('No products found')).toBeInTheDocument();
    });
  });

  describe('animation wrapper', () => {
    it('wraps products in AnimatePresence', () => {
      const { container } = render(<ProductGrid products={mockProducts} />);

      // Products should be rendered inside the grid
      const grid = container.querySelector('.grid');
      expect(grid.children.length).toBe(mockProducts.length);
    });
  });

  describe('product keys', () => {
    it('uses product id as key', () => {
      const productsWithIds = [
        { ...mockProduct, id: 100 },
        { ...mockProduct, id: 200, name: 'Another Product' },
      ];

      render(<ProductGrid products={productsWithIds} />);

      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
      expect(screen.getByText('Another Product')).toBeInTheDocument();
    });
  });

  describe('combined states', () => {
    it('loading takes precedence over empty state', () => {
      render(<ProductGrid products={[]} loading={true} emptyMessage="Custom empty" />);

      expect(screen.queryByText('Custom empty')).not.toBeInTheDocument();
    });

    it('loading takes precedence over products', () => {
      render(<ProductGrid products={mockProducts} loading={true} />);

      expect(screen.queryByText(mockProduct.name)).not.toBeInTheDocument();
    });
  });
});
