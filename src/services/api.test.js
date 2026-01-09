/**
 * Tests for API service layer
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { productsApi, categoriesApi, shippingApi, cartApi, ordersApi, profileApi } from './api';

describe('API Service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('productsApi', () => {
    describe('getAll', () => {
      it('returns paginated products', async () => {
        const promise = productsApi.getAll();
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('total');
        expect(result).toHaveProperty('page');
        expect(result).toHaveProperty('totalPages');
        expect(result).toHaveProperty('hasNextPage');
        expect(result).toHaveProperty('hasPrevPage');
        expect(Array.isArray(result.data)).toBe(true);
      });

      it('returns correct page', async () => {
        const promise = productsApi.getAll({ page: 1, limit: 10 });
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result.page).toBe(1);
        expect(result.data.length).toBeLessThanOrEqual(10);
      });

      it('filters by category', async () => {
        const promise = productsApi.getAll({ category: 'electronics' });
        vi.advanceTimersByTime(200);
        const result = await promise;

        result.data.forEach((product) => {
          expect(product.category).toBe('electronics');
        });
      });

      it('filters by onSale', async () => {
        const promise = productsApi.getAll({ onSale: true });
        vi.advanceTimersByTime(200);
        const result = await promise;

        result.data.forEach((product) => {
          expect(product.onSale).toBe(true);
        });
      });

      it('filters by search term', async () => {
        const promise = productsApi.getAll({ search: 'phone' });
        vi.advanceTimersByTime(200);
        const result = await promise;

        result.data.forEach((product) => {
          const searchableText =
            `${product.name} ${product.description} ${product.category}`.toLowerCase();
          expect(searchableText).toContain('phone');
        });
      });

      it('sorts by name ascending', async () => {
        const promise = productsApi.getAll({ sortBy: 'name', sortOrder: 'asc', limit: 5 });
        vi.advanceTimersByTime(200);
        const result = await promise;

        for (let i = 1; i < result.data.length; i++) {
          expect(result.data[i].name.toLowerCase() >= result.data[i - 1].name.toLowerCase()).toBe(
            true
          );
        }
      });

      it('sorts by name descending', async () => {
        const promise = productsApi.getAll({ sortBy: 'name', sortOrder: 'desc', limit: 5 });
        vi.advanceTimersByTime(200);
        const result = await promise;

        for (let i = 1; i < result.data.length; i++) {
          expect(result.data[i].name.toLowerCase() <= result.data[i - 1].name.toLowerCase()).toBe(
            true
          );
        }
      });

      it('sorts by price', async () => {
        const promise = productsApi.getAll({ sortBy: 'price', sortOrder: 'asc', limit: 5 });
        vi.advanceTimersByTime(200);
        const result = await promise;

        for (let i = 1; i < result.data.length; i++) {
          expect(result.data[i].price >= result.data[i - 1].price).toBe(true);
        }
      });

      it('calculates hasNextPage correctly', async () => {
        const promise = productsApi.getAll({ page: 1, limit: 5 });
        vi.advanceTimersByTime(200);
        const result = await promise;

        if (result.total > 5) {
          expect(result.hasNextPage).toBe(true);
        } else {
          expect(result.hasNextPage).toBe(false);
        }
      });

      it('calculates hasPrevPage correctly', async () => {
        const promise1 = productsApi.getAll({ page: 1 });
        vi.advanceTimersByTime(200);
        const result1 = await promise1;
        expect(result1.hasPrevPage).toBe(false);

        const promise2 = productsApi.getAll({ page: 2 });
        vi.advanceTimersByTime(200);
        const result2 = await promise2;
        expect(result2.hasPrevPage).toBe(true);
      });

      it('returns empty data for page beyond total', async () => {
        const promise = productsApi.getAll({ page: 9999 });
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result.data).toHaveLength(0);
      });
    });

    describe('getById', () => {
      it('returns product by ID', async () => {
        const promise = productsApi.getById(1);
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result).toBeDefined();
        expect(result.id).toBe(1);
      });

      it('returns null for non-existent ID', async () => {
        const promise = productsApi.getById(99999);
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result).toBeNull();
      });

      it('handles string ID', async () => {
        const promise = productsApi.getById('1');
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result).toBeDefined();
        expect(result.id).toBe(1);
      });
    });

    describe('getByCategory', () => {
      it('returns products for category', async () => {
        const promise = productsApi.getByCategory('electronics');
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result.data.length).toBeGreaterThan(0);
        result.data.forEach((product) => {
          expect(product.category).toBe('electronics');
        });
      });

      it('accepts additional options', async () => {
        const promise = productsApi.getByCategory('electronics', { limit: 5 });
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result.data.length).toBeLessThanOrEqual(5);
      });
    });

    describe('getOnSale', () => {
      it('returns only sale products', async () => {
        const promise = productsApi.getOnSale();
        vi.advanceTimersByTime(200);
        const result = await promise;

        result.data.forEach((product) => {
          expect(product.onSale).toBe(true);
        });
      });

      it('accepts additional options', async () => {
        const promise = productsApi.getOnSale({ limit: 3 });
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result.data.length).toBeLessThanOrEqual(3);
      });
    });

    describe('search', () => {
      it('searches products by query', async () => {
        const promise = productsApi.search('wireless');
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(Array.isArray(result.data)).toBe(true);
      });

      it('returns empty array for no matches', async () => {
        const promise = productsApi.search('xyznonexistentproduct123');
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result.data).toHaveLength(0);
      });

      it('search is case-insensitive', async () => {
        const promise1 = productsApi.search('WIRELESS');
        vi.advanceTimersByTime(200);
        const result1 = await promise1;

        const promise2 = productsApi.search('wireless');
        vi.advanceTimersByTime(200);
        const result2 = await promise2;

        expect(result1.total).toBe(result2.total);
      });
    });

    describe('getRelated', () => {
      it('returns related products', async () => {
        const promise = productsApi.getRelated(1);
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(Array.isArray(result)).toBe(true);
      });

      it('excludes the source product', async () => {
        const promise = productsApi.getRelated(1);
        vi.advanceTimersByTime(200);
        const result = await promise;

        result.forEach((product) => {
          expect(product.id).not.toBe(1);
        });
      });

      it('returns products from same category', async () => {
        // First get the source product
        const productPromise = productsApi.getById(1);
        vi.advanceTimersByTime(200);
        const sourceProduct = await productPromise;

        const promise = productsApi.getRelated(1);
        vi.advanceTimersByTime(200);
        const result = await promise;

        result.forEach((product) => {
          expect(product.category).toBe(sourceProduct.category);
        });
      });

      it('respects limit parameter', async () => {
        const promise = productsApi.getRelated(1, 2);
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result.length).toBeLessThanOrEqual(2);
      });

      it('returns empty array for non-existent product', async () => {
        const promise = productsApi.getRelated(99999);
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result).toHaveLength(0);
      });
    });

    describe('validate', () => {
      it('validates a valid product', async () => {
        const validProduct = {
          id: 1,
          name: 'Test Product',
          price: 19.99,
          image: 'https://example.com/image.jpg',
          description: 'A test product',
          category: 'electronics',
        };

        const promise = productsApi.validate(validProduct);
        vi.advanceTimersByTime(100);
        const result = await promise;

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('returns errors for invalid product', async () => {
        const invalidProduct = {
          id: 1,
          name: '',
          price: -10,
          image: 'not-a-url',
          description: '',
          category: 'invalid',
        };

        const promise = productsApi.validate(invalidProduct);
        vi.advanceTimersByTime(100);
        const result = await promise;

        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('categoriesApi', () => {
    describe('getAll', () => {
      it('returns array of categories', async () => {
        const promise = categoriesApi.getAll();
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });

      it('includes expected categories', async () => {
        const promise = categoriesApi.getAll();
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result).toContain('electronics');
        expect(result).toContain('fashion');
      });
    });

    describe('getWithCounts', () => {
      it('returns categories with product counts', async () => {
        const promise = categoriesApi.getWithCounts();
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(Array.isArray(result)).toBe(true);
        result.forEach((item) => {
          expect(item).toHaveProperty('name');
          expect(item).toHaveProperty('count');
          expect(typeof item.count).toBe('number');
        });
      });

      it('counts are non-negative', async () => {
        const promise = categoriesApi.getWithCounts();
        vi.advanceTimersByTime(200);
        const result = await promise;

        result.forEach((item) => {
          expect(item.count).toBeGreaterThanOrEqual(0);
        });
      });
    });
  });

  describe('shippingApi', () => {
    describe('getOptions', () => {
      it('returns array of shipping options', async () => {
        const promise = shippingApi.getOptions();
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });

      it('shipping options have required properties', async () => {
        const promise = shippingApi.getOptions();
        vi.advanceTimersByTime(200);
        const result = await promise;

        result.forEach((option) => {
          expect(option).toHaveProperty('id');
          expect(option).toHaveProperty('name');
          expect(option).toHaveProperty('price');
          expect(option).toHaveProperty('estimatedDelivery');
        });
      });
    });

    describe('getById', () => {
      it('returns shipping option by ID', async () => {
        const promise = shippingApi.getById('standard');
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result).toBeDefined();
        expect(result.id).toBe('standard');
      });

      it('returns null for non-existent ID', async () => {
        const promise = shippingApi.getById('nonexistent');
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result).toBeNull();
      });
    });

    describe('calculateCost', () => {
      it('returns shipping cost', async () => {
        const promise = shippingApi.calculateCost('standard', []);
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result).toHaveProperty('cost');
        expect(result).toHaveProperty('estimatedDelivery');
        expect(typeof result.cost).toBe('number');
      });

      it('throws for invalid shipping option', async () => {
        const promise = shippingApi.calculateCost('invalid', []);
        vi.advanceTimersByTime(200);

        await expect(promise).rejects.toThrow('Invalid shipping option');
      });

      it('returns 0 cost for free shipping', async () => {
        // First get options to find free shipping ID
        const optionsPromise = shippingApi.getOptions();
        vi.advanceTimersByTime(200);
        const options = await optionsPromise;

        const freeOption = options.find((opt) => opt.price === 0);
        if (freeOption) {
          const promise = shippingApi.calculateCost(freeOption.id, []);
          vi.advanceTimersByTime(200);
          const result = await promise;

          expect(result.cost).toBe(0);
        }
      });
    });
  });

  describe('cartApi', () => {
    describe('validate', () => {
      it('validates empty cart', async () => {
        const promise = cartApi.validate([]);
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('validates cart with valid items', async () => {
        const validCart = [
          {
            id: 1,
            name: 'Test Product',
            price: 19.99,
            image: 'https://example.com/image.jpg',
            description: 'A test product',
            category: 'electronics',
            quantity: 2,
          },
        ];

        const promise = cartApi.validate(validCart);
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result.valid).toBe(true);
      });

      it('returns errors for invalid cart items', async () => {
        const invalidCart = [
          {
            id: 1,
            name: '',
            price: -10,
            image: 'invalid',
            description: '',
            category: 'invalid',
            quantity: -1,
          },
        ];

        const promise = cartApi.validate(invalidCart);
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    describe('checkStock', () => {
      it('returns stock availability for cart items', async () => {
        const cartItems = [{ id: 1, quantity: 2 }];

        const promise = cartApi.checkStock(cartItems);
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(Array.isArray(result)).toBe(true);
        result.forEach((item) => {
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('available');
          expect(item).toHaveProperty('maxQuantity');
          expect(item).toHaveProperty('requestedQuantity');
        });
      });

      it('marks available when quantity is within stock', async () => {
        const cartItems = [{ id: 1, quantity: 1 }];

        const promise = cartApi.checkStock(cartItems);
        vi.advanceTimersByTime(200);
        const result = await promise;

        // Most products should have stock > 1
        expect(result[0].available).toBe(true);
      });
    });
  });

  describe('ordersApi', () => {
    describe('create', () => {
      it('creates an order successfully', async () => {
        const orderData = {
          items: [
            {
              id: 1,
              name: 'Test Product',
              price: 19.99,
              image: 'https://example.com/image.jpg',
              description: 'A test product',
              category: 'electronics',
              quantity: 1,
              stock: 10,
            },
          ],
          shipping: {
            id: 'standard',
            estimatedDelivery: '3-5 business days',
          },
          customer: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        };

        const promise = ordersApi.create(orderData);
        await vi.runAllTimersAsync();
        const result = await promise;

        expect(result.success).toBe(true);
        expect(result.orderId).toBeDefined();
        expect(result.message).toBe('Order placed successfully');
      });

      it('fails with invalid cart items', async () => {
        const orderData = {
          items: [
            {
              id: 1,
              name: '', // Invalid
              price: -10, // Invalid
              image: 'invalid',
              description: '',
              category: 'invalid',
              quantity: 1,
            },
          ],
          shipping: {},
          customer: {},
        };

        const promise = ordersApi.create(orderData);
        await vi.runAllTimersAsync();
        const result = await promise;

        expect(result.success).toBe(false);
        expect(result.message).toBe('Cart validation failed');
        expect(result.errors).toBeDefined();
      });

      it('generates unique order IDs', async () => {
        const orderData = {
          items: [
            {
              id: 1,
              name: 'Test Product',
              price: 19.99,
              image: 'https://example.com/image.jpg',
              description: 'A test product',
              category: 'electronics',
              quantity: 1,
              stock: 10,
            },
          ],
          shipping: {},
          customer: {},
        };

        const promise1 = ordersApi.create(orderData);
        await vi.runAllTimersAsync();
        const result1 = await promise1;

        const promise2 = ordersApi.create(orderData);
        await vi.runAllTimersAsync();
        const result2 = await promise2;

        expect(result1.orderId).not.toBe(result2.orderId);
      });

      it('returns estimated delivery from shipping', async () => {
        const orderData = {
          items: [
            {
              id: 1,
              name: 'Test Product',
              price: 19.99,
              image: 'https://example.com/image.jpg',
              description: 'A test product',
              category: 'electronics',
              quantity: 1,
              stock: 10,
            },
          ],
          shipping: {
            estimatedDelivery: '1-2 business days',
          },
          customer: {},
        };

        const promise = ordersApi.create(orderData);
        await vi.runAllTimersAsync();
        const result = await promise;

        expect(result.estimatedDelivery).toBe('1-2 business days');
      });
    });

    describe('getById', () => {
      it('returns null for any order ID (mock implementation)', async () => {
        const promise = ordersApi.getById('ORD-123');
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result).toBeNull();
      });
    });
  });

  describe('profileApi', () => {
    describe('save', () => {
      it('saves valid profile successfully', async () => {
        const profile = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA',
          phone: '1234567890',
        };

        const promise = profileApi.save(profile);
        vi.advanceTimersByTime(300);
        const result = await promise;

        expect(result.success).toBe(true);
        expect(result.message).toBe('Profile saved successfully');
      });

      it('fails for invalid profile', async () => {
        const profile = {
          firstName: '',
          lastName: '',
          email: 'invalid-email',
        };

        const promise = profileApi.save(profile);
        vi.advanceTimersByTime(300);
        const result = await promise;

        expect(result.success).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors.length).toBeGreaterThan(0);
      });

      it('validates email format', async () => {
        const profile = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'not-an-email',
        };

        const promise = profileApi.save(profile);
        vi.advanceTimersByTime(300);
        const result = await promise;

        expect(result.success).toBe(false);
        expect(result.errors).toContain('Email must be a valid email address');
      });
    });

    describe('get', () => {
      it('returns null (mock implementation)', async () => {
        const promise = profileApi.get();
        vi.advanceTimersByTime(200);
        const result = await promise;

        expect(result).toBeNull();
      });
    });
  });

  describe('integration tests', () => {
    it('can fetch products and validate them', async () => {
      // Fetch products
      const productsPromise = productsApi.getAll({ limit: 5 });
      vi.advanceTimersByTime(200);
      const productsResult = await productsPromise;

      expect(productsResult.data.length).toBeGreaterThan(0);

      // Validate each product
      for (const product of productsResult.data) {
        const validatePromise = productsApi.validate(product);
        vi.advanceTimersByTime(100);
        const validateResult = await validatePromise;

        expect(validateResult.valid).toBe(true);
      }
    });

    it('can simulate full checkout flow', async () => {
      // 1. Get products
      const productsPromise = productsApi.getAll({ limit: 2 });
      await vi.runAllTimersAsync();
      const products = await productsPromise;

      // 2. Create cart items
      const cartItems = products.data.map((p) => ({
        ...p,
        quantity: 1,
      }));

      // 3. Validate cart
      const validatePromise = cartApi.validate(cartItems);
      await vi.runAllTimersAsync();
      const validation = await validatePromise;
      expect(validation.valid).toBe(true);

      // 4. Check stock
      const stockPromise = cartApi.checkStock(cartItems);
      await vi.runAllTimersAsync();
      const stockResult = await stockPromise;
      expect(stockResult.every((item) => item.available)).toBe(true);

      // 5. Get shipping options
      const shippingPromise = shippingApi.getOptions();
      await vi.runAllTimersAsync();
      const shipping = await shippingPromise;
      expect(shipping.length).toBeGreaterThan(0);

      // 6. Create order
      const orderPromise = ordersApi.create({
        items: cartItems,
        shipping: shipping[0],
        customer: { name: 'Test', email: 'test@example.com' },
      });
      await vi.runAllTimersAsync();
      const order = await orderPromise;

      expect(order.success).toBe(true);
      expect(order.orderId).toBeDefined();
    });
  });
});
