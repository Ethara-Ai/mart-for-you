// CartContext tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { ThemeProvider } from './ThemeContext';
import { ToastProvider } from './ToastContext';

// Wrapper component with all necessary providers
const wrapper = ({ children }) => (
  <ThemeProvider>
    <ToastProvider>
      <CartProvider>{children}</CartProvider>
    </ToastProvider>
  </ThemeProvider>
);

// Mock product data
const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 99.99,
  image: 'https://example.com/image.jpg',
  description: 'A test product',
  category: 'electronics',
  onSale: false,
};

const mockSaleProduct = {
  id: 2,
  name: 'Sale Product',
  price: 149.99,
  salePrice: 99.99,
  image: 'https://example.com/sale.jpg',
  description: 'A sale product',
  category: 'fashion',
  onSale: true,
};

const mockProduct3 = {
  id: 3,
  name: 'Another Product',
  price: 49.99,
  image: 'https://example.com/another.jpg',
  description: 'Another test product',
  category: 'home',
  onSale: false,
};

describe('CartContext', () => {
  describe('useCart hook', () => {
    it('throws error when used outside CartProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCart());
      }).toThrow('useCart must be used within a CartProvider');

      consoleSpy.mockRestore();
    });

    it('provides cart context when used within CartProvider', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.cartItems).toEqual([]);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.cartTotal).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('adds a new item to the cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0]).toEqual({
        ...mockProduct,
        quantity: 1,
      });
    });

    it('increases quantity when adding existing item', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(2);
    });

    it('adds multiple different items to cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockSaleProduct);
        result.current.addToCart(mockProduct3);
      });

      expect(result.current.cartItems).toHaveLength(3);
    });

    it('handles adding sale product correctly', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockSaleProduct);
      });

      expect(result.current.cartItems[0].onSale).toBe(true);
      expect(result.current.cartItems[0].salePrice).toBe(99.99);
    });
  });

  describe('removeFromCart', () => {
    it('removes an item from the cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockSaleProduct);
      });

      expect(result.current.cartItems).toHaveLength(2);

      act(() => {
        result.current.removeFromCart(mockProduct.id);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].id).toBe(mockSaleProduct.id);
    });

    it('does nothing when removing non-existent item', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.removeFromCart(999);
      });

      expect(result.current.cartItems).toHaveLength(1);
    });

    it('handles removing from empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.removeFromCart(1);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe('updateQuantity', () => {
    it('updates item quantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, 5);
      });

      expect(result.current.cartItems[0].quantity).toBe(5);
    });

    it('removes item when quantity set below 1', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, 0);
      });

      // Item should be removed from cart
      expect(result.current.cartItems).toHaveLength(0);
    });

    it('removes item when quantity set to negative values', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, -5);
      });

      // Item should be removed from cart
      expect(result.current.cartItems).toHaveLength(0);
    });

    it('handles updating non-existent item', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(999, 5);
      });

      expect(result.current.cartItems[0].quantity).toBe(1);
    });

    it('clamps quantity to stock limit', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, 100);
      });

      // Quantity is clamped to stock limit (default: 10)
      expect(result.current.cartItems[0].quantity).toBe(10);
    });
  });

  describe('clearCart', () => {
    it('removes all items from cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockSaleProduct);
        result.current.addToCart(mockProduct3);
      });

      expect(result.current.cartItems).toHaveLength(3);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
      expect(result.current.totalItems).toBe(0);
      expect(result.current.cartTotal).toBe(0);
    });

    it('handles clearing empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe('totalItems', () => {
    it('calculates total items correctly', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockSaleProduct);
      });

      expect(result.current.totalItems).toBe(3);
    });

    it('returns 0 for empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.totalItems).toBe(0);
    });

    it('updates when quantity changes', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.totalItems).toBe(1);

      act(() => {
        result.current.updateQuantity(mockProduct.id, 5);
      });

      expect(result.current.totalItems).toBe(5);
    });
  });

  describe('cartTotal', () => {
    it('calculates cart total for regular items', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.cartTotal).toBe(99.99);
    });

    it('uses sale price for sale items', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockSaleProduct);
      });

      // Should use salePrice (99.99) not regular price (149.99)
      expect(result.current.cartTotal).toBe(99.99);
    });

    it('calculates total for multiple items', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct); // 99.99
        result.current.addToCart(mockSaleProduct); // 99.99 (sale price)
      });

      expect(result.current.cartTotal).toBeCloseTo(199.98, 2);
    });

    it('calculates total with quantities', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.updateQuantity(mockProduct.id, 3);
      });

      expect(result.current.cartTotal).toBeCloseTo(299.97, 2);
    });

    it('returns 0 for empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.cartTotal).toBe(0);
    });
  });

  describe('selectedShipping', () => {
    it('defaults to standard shipping', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.selectedShipping).toBe('standard');
    });

    it('allows changing shipping option', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.setSelectedShipping('express');
      });

      expect(result.current.selectedShipping).toBe('express');
    });

    it('can set to free shipping', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.setSelectedShipping('free');
      });

      expect(result.current.selectedShipping).toBe('free');
    });
  });

  describe('getShippingCost', () => {
    it('returns correct cost for standard shipping', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const cost = result.current.getShippingCost();
      expect(cost).toBe(4.99);
    });

    it('returns 0 for free shipping', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.setSelectedShipping('free');
      });

      const cost = result.current.getShippingCost();
      expect(cost).toBe(0);
    });

    it('returns correct cost for express shipping', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.setSelectedShipping('express');
      });

      const cost = result.current.getShippingCost();
      expect(cost).toBe(9.99);
    });
  });

  describe('getTotal', () => {
    it('calculates total with shipping', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct); // 99.99
      });

      // Default is standard shipping (4.99)
      const total = result.current.getTotal();
      expect(total).toBeCloseTo(104.98, 2);
    });

    it('calculates total with free shipping', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.setSelectedShipping('free');
      });

      const total = result.current.getTotal();
      expect(total).toBe(99.99);
    });

    it('calculates total with express shipping', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct); // 99.99
        result.current.setSelectedShipping('express'); // 9.99
      });

      const total = result.current.getTotal();
      expect(total).toBeCloseTo(109.98, 2);
    });

    it('returns only shipping for empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      const total = result.current.getTotal();
      expect(total).toBe(4.99); // Standard shipping default
    });
  });

  describe('isInCart', () => {
    it('returns true when item is in cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.isInCart(mockProduct.id)).toBe(true);
    });

    it('returns false when item is not in cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.isInCart(mockProduct.id)).toBe(false);
    });

    it('returns false after item is removed', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.isInCart(mockProduct.id)).toBe(true);

      act(() => {
        result.current.removeFromCart(mockProduct.id);
      });

      expect(result.current.isInCart(mockProduct.id)).toBe(false);
    });
  });

  describe('getItemQuantity', () => {
    it('returns correct quantity for item in cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct);
      });

      expect(result.current.getItemQuantity(mockProduct.id)).toBe(3);
    });

    it('returns 0 for item not in cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.getItemQuantity(999)).toBe(0);
    });

    it('returns updated quantity after updateQuantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.updateQuantity(mockProduct.id, 10);
      });

      expect(result.current.getItemQuantity(mockProduct.id)).toBe(10);
    });
  });

  describe('handleCheckout', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('sets orderPlaced to true after checkout completes', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      // Initially orderPlaced should be false
      expect(result.current.orderPlaced).toBe(false);

      let checkoutPromise;
      act(() => {
        checkoutPromise = result.current.handleCheckout();
      });

      // During checkout, isCheckingOut should be true
      expect(result.current.isCheckingOut).toBe(true);

      // Fast-forward timers to complete the async checkout
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await checkoutPromise;
      });

      // After checkout completes, orderPlaced should be true
      expect(result.current.orderPlaced).toBe(true);
      expect(result.current.orderNumber).not.toBeNull();
      expect(result.current.isCheckingOut).toBe(false);
    });

    it('clears cart immediately after checkout', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockSaleProduct);
      });

      expect(result.current.cartItems).toHaveLength(2);

      let checkoutPromise;
      act(() => {
        checkoutPromise = result.current.handleCheckout();
      });

      await act(async () => {
        vi.advanceTimersByTime(1000);
        await checkoutPromise;
      });

      // Cart is cleared after checkout completes
      expect(result.current.cartItems).toHaveLength(0);
      expect(result.current.orderPlaced).toBe(true);
      expect(result.current.orderNumber).not.toBeNull();
    });

    it('returns success result with order ID', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      let checkoutResult;
      let checkoutPromise;
      act(() => {
        checkoutPromise = result.current.handleCheckout();
      });

      await act(async () => {
        vi.advanceTimersByTime(3000);
        checkoutResult = await checkoutPromise;
      });

      expect(checkoutResult.success).toBe(true);
      expect(checkoutResult.orderId).toBeDefined();
      // Order ID is now a string in format "ORD-YYYYMMDD-XXXXXX"
      expect(typeof checkoutResult.orderId).toBe('string');
      expect(checkoutResult.orderId).toMatch(/^ORD-\d{8}-[A-Z0-9]{6}$/);
    });

    it('generates unique order numbers', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });
      const orderNumbers = [];

      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.addToCart(mockProduct);
        });

        let checkoutPromise;
        act(() => {
          checkoutPromise = result.current.handleCheckout();
        });

        const orderNum = result.current.orderNumber;
        orderNumbers.push(orderNum);

        await act(async () => {
          vi.advanceTimersByTime(3000);
          await checkoutPromise;
        });
      }

      // Most order numbers should be unique (random generation)
      const uniqueNumbers = new Set(orderNumbers);
      expect(uniqueNumbers.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('shippingOptions', () => {
    it('provides shipping options array', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      expect(result.current.shippingOptions).toBeDefined();
      expect(Array.isArray(result.current.shippingOptions)).toBe(true);
      expect(result.current.shippingOptions.length).toBeGreaterThan(0);
    });

    it('shipping options have required properties', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      result.current.shippingOptions.forEach((option) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('name');
        expect(option).toHaveProperty('price');
        expect(option).toHaveProperty('estimatedDelivery');
      });
    });
  });

  describe('complex cart operations', () => {
    it('handles multiple operations in sequence', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      // Add items
      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockSaleProduct);
        result.current.addToCart(mockProduct3);
      });

      expect(result.current.totalItems).toBe(3);

      // Update quantities
      act(() => {
        result.current.updateQuantity(mockProduct.id, 2);
        result.current.updateQuantity(mockSaleProduct.id, 3);
      });

      expect(result.current.totalItems).toBe(6);

      // Remove one item
      act(() => {
        result.current.removeFromCart(mockProduct3.id);
      });

      expect(result.current.cartItems).toHaveLength(2);
      expect(result.current.totalItems).toBe(5);

      // Verify total (2 * 99.99 + 3 * 99.99 = 499.95)
      expect(result.current.cartTotal).toBeCloseTo(499.95, 2);
    });

    it('maintains cart state consistency', () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct);
        result.current.updateQuantity(mockProduct.id, 5);
        result.current.addToCart(mockProduct);
      });

      // After adding twice, updating to 5, and adding once more = 6
      expect(result.current.getItemQuantity(mockProduct.id)).toBe(6);
      expect(result.current.totalItems).toBe(6);
      expect(result.current.cartTotal).toBeCloseTo(599.94, 2);
    });
  });
});
