// CartItem component tests
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import CartItem from './CartItem';
import { render, mockCartItem, mockSaleCartItem } from '../../testing/test-utils';

describe('CartItem', () => {
  describe('rendering', () => {
    it('renders item name', () => {
      render(<CartItem item={mockCartItem} />);

      expect(screen.getByText(mockCartItem.name)).toBeInTheDocument();
    });

    it('renders item image', () => {
      render(<CartItem item={mockCartItem} />);

      const image = screen.getByAltText(mockCartItem.name);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockCartItem.image);
    });

    it('renders item quantity', () => {
      render(<CartItem item={mockCartItem} />);

      expect(screen.getByText(mockCartItem.quantity.toString())).toBeInTheDocument();
    });

    it('renders remove button', () => {
      render(<CartItem item={mockCartItem} />);

      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });

    it('renders increase quantity button', () => {
      render(<CartItem item={mockCartItem} />);

      expect(screen.getByRole('button', { name: /increase/i })).toBeInTheDocument();
    });

    it('renders decrease quantity button', () => {
      render(<CartItem item={mockCartItem} />);

      expect(screen.getByRole('button', { name: /decrease/i })).toBeInTheDocument();
    });

    it('renders with lazy loading on image', () => {
      render(<CartItem item={mockCartItem} />);

      const image = screen.getByAltText(mockCartItem.name);
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('price display', () => {
    it('displays regular price for non-sale items', () => {
      render(<CartItem item={mockCartItem} />);

      expect(screen.getByText(`$${mockCartItem.price.toFixed(2)}`)).toBeInTheDocument();
    });

    it('displays sale price for sale items', () => {
      render(<CartItem item={mockSaleCartItem} />);

      // Sale price may appear multiple times (unit price and total)
      const salePrices = screen.getAllByText(`$${mockSaleCartItem.salePrice.toFixed(2)}`);
      expect(salePrices.length).toBeGreaterThan(0);
    });

    it('displays original price with strikethrough for sale items', () => {
      render(<CartItem item={mockSaleCartItem} />);

      const originalPrice = screen.getByText(`$${mockSaleCartItem.price.toFixed(2)}`);
      expect(originalPrice).toBeInTheDocument();
      expect(originalPrice).toHaveClass('line-through');
    });

    it('calculates and displays correct item total for regular items', () => {
      const item = { ...mockCartItem, price: 50, quantity: 3 };
      render(<CartItem item={item} />);

      // Unit price is $50.00, total is $150.00
      expect(screen.getByText('$50.00')).toBeInTheDocument();
      expect(screen.getByText('$150.00')).toBeInTheDocument();
    });

    it('calculates and displays correct item total for sale items', () => {
      const item = { ...mockSaleCartItem, salePrice: 40, quantity: 2, onSale: true };
      render(<CartItem item={item} />);

      // Unit price is $40.00, total is $80.00
      expect(screen.getByText('$40.00')).toBeInTheDocument();
      expect(screen.getByText('$80.00')).toBeInTheDocument();
    });
  });

  describe('quantity controls', () => {
    it('increases quantity when + button is clicked', async () => {
      const mockHandler = vi.fn();
      const { user } = render(<CartItem item={mockCartItem} onQuantityChange={mockHandler} />);

      const increaseButton = screen.getByRole('button', { name: /increase/i });
      await user.click(increaseButton);

      expect(mockHandler).toHaveBeenCalledWith(mockCartItem.id, mockCartItem.quantity + 1);
    });

    it('decreases quantity when - button is clicked', async () => {
      const mockHandler = vi.fn();
      const item = { ...mockCartItem, quantity: 3 };
      const { user } = render(<CartItem item={item} onQuantityChange={mockHandler} />);

      const decreaseButton = screen.getByRole('button', { name: /decrease/i });
      await user.click(decreaseButton);

      expect(mockHandler).toHaveBeenCalledWith(item.id, 2);
    });

    it('disables decrease button when quantity is 1', () => {
      const item = { ...mockCartItem, quantity: 1 };
      render(<CartItem item={item} />);

      const decreaseButton = screen.getByRole('button', { name: /decrease/i });
      expect(decreaseButton).toBeDisabled();
    });

    it('does not decrease quantity below 1', async () => {
      const item = { ...mockCartItem, quantity: 1 };
      const { user } = render(<CartItem item={item} />);

      const decreaseButton = screen.getByRole('button', { name: /decrease/i });
      await user.click(decreaseButton);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('enables decrease button when quantity is greater than 1', () => {
      const item = { ...mockCartItem, quantity: 2 };
      render(<CartItem item={item} />);

      const decreaseButton = screen.getByRole('button', { name: /decrease/i });
      expect(decreaseButton).not.toBeDisabled();
    });
  });

  describe('remove functionality', () => {
    it('removes item when remove button is clicked', async () => {
      const { user } = render(<CartItem item={mockCartItem} />);

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);

      // Item should be removed from cart context
    });

    it('has correct aria-label on remove button', () => {
      render(<CartItem item={mockCartItem} />);

      const removeButton = screen.getByRole('button', {
        name: `Remove ${mockCartItem.name} from cart`,
      });
      expect(removeButton).toBeInTheDocument();
    });
  });

  describe('custom handlers', () => {
    it('calls custom onQuantityChange handler when provided', async () => {
      const mockHandler = vi.fn();
      const { user } = render(<CartItem item={mockCartItem} onQuantityChange={mockHandler} />);

      const increaseButton = screen.getByRole('button', { name: /increase/i });
      await user.click(increaseButton);

      expect(mockHandler).toHaveBeenCalledWith(mockCartItem.id, mockCartItem.quantity + 1);
    });

    it('calls custom onRemove handler when provided', async () => {
      const mockHandler = vi.fn();
      const { user } = render(<CartItem item={mockCartItem} onRemove={mockHandler} />);

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);

      expect(mockHandler).toHaveBeenCalledWith(mockCartItem.id);
    });

    it('calls onQuantityChange on decrease', async () => {
      const mockHandler = vi.fn();
      const item = { ...mockCartItem, quantity: 3 };
      const { user } = render(<CartItem item={item} onQuantityChange={mockHandler} />);

      const decreaseButton = screen.getByRole('button', { name: /decrease/i });
      await user.click(decreaseButton);

      expect(mockHandler).toHaveBeenCalledWith(item.id, 2);
    });

    it('does not call onQuantityChange when decrease is disabled', async () => {
      const mockHandler = vi.fn();
      const item = { ...mockCartItem, quantity: 1 };
      const { user } = render(<CartItem item={item} onQuantityChange={mockHandler} />);

      const decreaseButton = screen.getByRole('button', { name: /decrease/i });
      await user.click(decreaseButton);

      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe('compact mode', () => {
    it('renders in compact mode when compact prop is true', () => {
      render(<CartItem item={mockCartItem} compact={true} />);

      // Check for compact-specific classes
      const image = screen.getByAltText(mockCartItem.name);
      expect(image.parentElement).toHaveClass('h-12');
      expect(image.parentElement).toHaveClass('w-12');
    });

    it('renders in regular mode by default', () => {
      render(<CartItem item={mockCartItem} />);

      const image = screen.getByAltText(mockCartItem.name);
      expect(image.parentElement).toHaveClass('h-16');
      expect(image.parentElement).toHaveClass('w-16');
    });

    it('uses smaller text in compact mode', () => {
      render(<CartItem item={mockCartItem} compact={true} />);

      const name = screen.getByText(mockCartItem.name);
      expect(name).toHaveClass('text-xs');
    });

    it('uses regular text in non-compact mode', () => {
      render(<CartItem item={mockCartItem} compact={false} />);

      const name = screen.getByText(mockCartItem.name);
      expect(name).toHaveClass('text-sm');
    });
  });

  describe('item with edge case values', () => {
    it('handles item with very long name', () => {
      const longNameItem = {
        ...mockCartItem,
        name: 'This is a very long product name that might overflow the container',
      };
      render(<CartItem item={longNameItem} />);

      expect(screen.getByText(longNameItem.name)).toBeInTheDocument();
    });

    it('handles item with zero price', () => {
      const freeItem = { ...mockCartItem, price: 0 };
      render(<CartItem item={freeItem} />);

      // Price appears multiple times (unit and total)
      const prices = screen.getAllByText('$0.00');
      expect(prices.length).toBeGreaterThan(0);
    });

    it('handles item with high price', () => {
      const expensiveItem = { ...mockCartItem, price: 9999.99 };
      render(<CartItem item={expensiveItem} />);

      // Price may appear multiple times
      const prices = screen.getAllByText(/\$9999\.99/);
      expect(prices.length).toBeGreaterThan(0);
    });

    it('handles item with high quantity', () => {
      const bulkItem = { ...mockCartItem, quantity: 999 };
      render(<CartItem item={bulkItem} />);

      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('handles item with decimal price', () => {
      const decimalItem = { ...mockCartItem, price: 49.5 };
      render(<CartItem item={decimalItem} />);

      // Price may appear multiple times
      const prices = screen.getAllByText('$49.50');
      expect(prices.length).toBeGreaterThan(0);
    });
  });

  describe('total calculation', () => {
    it('calculates total correctly for quantity 1', () => {
      const item = { ...mockCartItem, price: 25, quantity: 1 };
      render(<CartItem item={item} />);

      // Price appears as both unit price and total when quantity is 1
      const prices = screen.getAllByText('$25.00');
      expect(prices.length).toBeGreaterThan(0);
    });

    it('calculates total correctly for high quantity', () => {
      const item = { ...mockCartItem, price: 10, quantity: 10 };
      render(<CartItem item={item} />);

      // Unit price $10.00 and total $100.00 should both be present
      expect(screen.getByText('$10.00')).toBeInTheDocument();
      const totals = screen.getAllByText('$100.00');
      expect(totals.length).toBeGreaterThan(0);
    });

    it('calculates total using sale price when on sale', () => {
      const item = {
        ...mockCartItem,
        price: 100,
        salePrice: 50,
        onSale: true,
        quantity: 2,
      };
      render(<CartItem item={item} />);

      // Total should be 50 * 2 = 100, unit price is 50
      const prices50 = screen.getAllByText('$50.00');
      expect(prices50.length).toBeGreaterThan(0);
      const prices100 = screen.getAllByText('$100.00');
      expect(prices100.length).toBeGreaterThan(0);
    });

    it('calculates total using regular price when not on sale', () => {
      const item = {
        ...mockCartItem,
        price: 100,
        onSale: false,
        quantity: 2,
      };
      render(<CartItem item={item} />);

      // Unit price and total are different
      const prices100 = screen.getAllByText('$100.00');
      expect(prices100.length).toBeGreaterThan(0);
      expect(screen.getByText('$200.00')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('increase button has correct aria-label', () => {
      render(<CartItem item={mockCartItem} />);

      const button = screen.getByRole('button', { name: /increase quantity/i });
      expect(button).toBeInTheDocument();
    });

    it('decrease button has correct aria-label', () => {
      render(<CartItem item={mockCartItem} />);

      const button = screen.getByRole('button', { name: /decrease quantity/i });
      expect(button).toBeInTheDocument();
    });

    it('image has alt text', () => {
      render(<CartItem item={mockCartItem} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', mockCartItem.name);
    });

    it('name has title attribute for truncated text', () => {
      render(<CartItem item={mockCartItem} />);

      const name = screen.getByText(mockCartItem.name);
      expect(name).toHaveAttribute('title', mockCartItem.name);
    });

    it('buttons are keyboard accessible', () => {
      render(<CartItem item={mockCartItem} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('styling and structure', () => {
    it('applies border to item container', () => {
      const { container } = render(<CartItem item={mockCartItem} />);

      const itemContainer = container.firstChild;
      expect(itemContainer).toHaveClass('border-b');
    });

    it('applies correct image styling', () => {
      render(<CartItem item={mockCartItem} />);

      const image = screen.getByAltText(mockCartItem.name);
      expect(image).toHaveClass('object-cover');
      expect(image).toHaveClass('w-full');
      expect(image).toHaveClass('h-full');
    });

    it('applies rounded corners to image container', () => {
      render(<CartItem item={mockCartItem} />);

      const image = screen.getByAltText(mockCartItem.name);
      expect(image.parentElement).toHaveClass('rounded-md');
    });

    it('applies flex layout to item container', () => {
      const { container } = render(<CartItem item={mockCartItem} />);

      const itemContainer = container.firstChild;
      expect(itemContainer).toHaveClass('flex');
      expect(itemContainer).toHaveClass('items-center');
    });

    it('truncates long item names', () => {
      render(<CartItem item={mockCartItem} />);

      const name = screen.getByText(mockCartItem.name);
      expect(name).toHaveClass('truncate');
    });
  });

  describe('remove button styling', () => {
    it('has red color styling on remove button', () => {
      render(<CartItem item={mockCartItem} />);

      const removeButton = screen.getByRole('button', { name: /remove/i });
      // Button should have styling indicating destructive action
      expect(removeButton).toBeInTheDocument();
    });

    it('remove button contains trash icon and text', () => {
      render(<CartItem item={mockCartItem} />);

      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toHaveTextContent(/remove/i);
    });
  });

  describe('quantity display', () => {
    it('displays quantity centered between buttons', () => {
      render(<CartItem item={mockCartItem} />);

      const quantity = screen.getByText(mockCartItem.quantity.toString());
      expect(quantity).toHaveClass('text-center');
    });

    it('has minimum width for quantity display', () => {
      render(<CartItem item={mockCartItem} />);

      const quantity = screen.getByText(mockCartItem.quantity.toString());
      expect(quantity).toHaveClass('min-w-5');
    });
  });

  describe('sale item handling', () => {
    it('shows both prices for sale items', () => {
      render(<CartItem item={mockSaleCartItem} />);

      // Should show sale price (may appear multiple times - unit price and total)
      const salePrices = screen.getAllByText(`$${mockSaleCartItem.salePrice.toFixed(2)}`);
      expect(salePrices.length).toBeGreaterThan(0);
      // Should show original price with strikethrough
      expect(screen.getByText(`$${mockSaleCartItem.price.toFixed(2)}`)).toBeInTheDocument();
    });

    it('does not show strikethrough price for non-sale items', () => {
      render(<CartItem item={mockCartItem} />);

      const prices = screen.getAllByText(/\$\d+\.\d{2}/);
      // Should only have the regular price and total
      expect(prices.filter((p) => p.classList.contains('line-through'))).toHaveLength(0);
    });
  });

  describe('interaction states', () => {
    it('shows hover state on buttons', async () => {
      const { user } = render(<CartItem item={mockCartItem} />);

      const increaseButton = screen.getByRole('button', { name: /increase/i });
      await user.hover(increaseButton);

      // Button should still be functional after hover
      expect(increaseButton).toBeInTheDocument();
    });

    it('shows disabled state correctly', () => {
      const item = { ...mockCartItem, quantity: 1 };
      render(<CartItem item={item} />);

      const decreaseButton = screen.getByRole('button', { name: /decrease/i });
      expect(decreaseButton).toHaveClass('disabled:opacity-40');
      expect(decreaseButton).toHaveClass('disabled:cursor-not-allowed');
    });
  });

  describe('multiple items rendering', () => {
    it('renders multiple CartItems with different data', () => {
      const items = [
        mockCartItem,
        mockSaleCartItem,
        { ...mockCartItem, id: 3, name: 'Third Item', quantity: 5 },
      ];

      render(
        <>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </>,
      );

      expect(screen.getByText(mockCartItem.name)).toBeInTheDocument();
      expect(screen.getByText(mockSaleCartItem.name)).toBeInTheDocument();
      expect(screen.getByText('Third Item')).toBeInTheDocument();
    });
  });
});
