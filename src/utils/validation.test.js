/**
 * Tests for validation utilities
 */
import { describe, it, expect } from 'vitest';
import {
  validateProduct,
  validateCartItem,
  validateProfile,
  validateShippingOption,
  validateCart,
  validateSearchTerm,
  sanitizeString,
} from './validation';

describe('Validation Utilities', () => {
  describe('validateProduct', () => {
    const validProduct = {
      id: 1,
      name: 'Test Product',
      price: 19.99,
      image: 'https://example.com/image.jpg',
      description: 'A test product description',
      category: 'electronics',
    };

    it('returns valid for a complete valid product', () => {
      const result = validateProduct(validProduct);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns invalid for null input', () => {
      const result = validateProduct(null);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Product must be an object');
    });

    it('returns invalid for undefined input', () => {
      const result = validateProduct(undefined);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Product must be an object');
    });

    it('returns invalid for non-object input', () => {
      expect(validateProduct('string').valid).toBe(false);
      expect(validateProduct(123).valid).toBe(false);
      expect(validateProduct([]).valid).toBe(false);
    });

    describe('id validation', () => {
      it('requires id to be present', () => {
        const product = { ...validProduct };
        delete product.id;

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Product ID is required');
      });

      it('rejects null id', () => {
        const product = { ...validProduct, id: null };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Product ID is required');
      });

      it('accepts numeric id', () => {
        const product = { ...validProduct, id: 123 };

        expect(validateProduct(product).valid).toBe(true);
      });

      it('accepts string id', () => {
        const product = { ...validProduct, id: 'abc-123' };

        expect(validateProduct(product).valid).toBe(true);
      });

      it('accepts zero as id', () => {
        const product = { ...validProduct, id: 0 };

        expect(validateProduct(product).valid).toBe(true);
      });
    });

    describe('name validation', () => {
      it('requires name to be a non-empty string', () => {
        const product = { ...validProduct, name: '' };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Product name must be a non-empty string');
      });

      it('rejects whitespace-only name', () => {
        const product = { ...validProduct, name: '   ' };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
      });

      it('rejects null name', () => {
        const product = { ...validProduct, name: null };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
      });

      it('rejects numeric name', () => {
        const product = { ...validProduct, name: 123 };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
      });
    });

    describe('price validation', () => {
      it('requires price to be a positive number', () => {
        const product = { ...validProduct, price: 0 };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Product price must be a positive number');
      });

      it('rejects negative price', () => {
        const product = { ...validProduct, price: -10 };

        expect(validateProduct(product).valid).toBe(false);
      });

      it('rejects NaN price', () => {
        const product = { ...validProduct, price: NaN };

        expect(validateProduct(product).valid).toBe(false);
      });

      it('rejects string price', () => {
        const product = { ...validProduct, price: '19.99' };

        expect(validateProduct(product).valid).toBe(false);
      });

      it('accepts decimal prices', () => {
        const product = { ...validProduct, price: 0.01 };

        expect(validateProduct(product).valid).toBe(true);
      });
    });

    describe('image validation', () => {
      it('requires image URL', () => {
        const product = { ...validProduct, image: '' };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Product image URL is required');
      });

      it('requires valid URL format', () => {
        const product = { ...validProduct, image: 'not-a-url' };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Product image must be a valid URL');
      });

      it('accepts valid http URL', () => {
        const product = { ...validProduct, image: 'http://example.com/image.jpg' };

        expect(validateProduct(product).valid).toBe(true);
      });

      it('accepts valid https URL', () => {
        const product = { ...validProduct, image: 'https://example.com/image.jpg' };

        expect(validateProduct(product).valid).toBe(true);
      });

      it('accepts data URLs', () => {
        const product = { ...validProduct, image: 'data:image/png;base64,abc123' };

        expect(validateProduct(product).valid).toBe(true);
      });
    });

    describe('description validation', () => {
      it('requires description to be non-empty', () => {
        const product = { ...validProduct, description: '' };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Product description is required');
      });
    });

    describe('category validation', () => {
      it('requires category to be non-empty', () => {
        const product = { ...validProduct, category: '' };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Product category is required');
      });

      it('requires category to be valid', () => {
        const product = { ...validProduct, category: 'invalid-category' };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Product category must be one of');
      });

      it('accepts valid categories', () => {
        const validCategories = ['electronics', 'fashion', 'home', 'beauty', 'sports', 'food', 'books', 'toys'];

        validCategories.forEach((category) => {
          const product = { ...validProduct, category };
          expect(validateProduct(product).valid).toBe(true);
        });
      });
    });

    describe('onSale validation', () => {
      it('accepts valid onSale boolean', () => {
        const product = { ...validProduct, onSale: true, salePrice: 14.99 };

        expect(validateProduct(product).valid).toBe(true);
      });

      it('rejects non-boolean onSale', () => {
        const product = { ...validProduct, onSale: 'yes' };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Product onSale must be a boolean');
      });

      it('requires salePrice when onSale is true', () => {
        const product = { ...validProduct, onSale: true };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Sale price is required when product is on sale');
      });

      it('requires salePrice to be less than regular price', () => {
        const product = { ...validProduct, onSale: true, salePrice: 29.99 };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Sale price must be less than regular price');
      });
    });

    describe('stock validation', () => {
      it('accepts valid stock number', () => {
        const product = { ...validProduct, stock: 10 };

        expect(validateProduct(product).valid).toBe(true);
      });

      it('accepts zero stock', () => {
        const product = { ...validProduct, stock: 0 };

        expect(validateProduct(product).valid).toBe(true);
      });

      it('rejects negative stock', () => {
        const product = { ...validProduct, stock: -5 };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Product stock must be a non-negative number');
      });
    });

    describe('weight validation', () => {
      it('accepts valid weight string', () => {
        const product = { ...validProduct, weight: '500g' };

        expect(validateProduct(product).valid).toBe(true);
      });

      it('rejects empty weight when provided', () => {
        const product = { ...validProduct, weight: '' };

        const result = validateProduct(product);

        expect(result.valid).toBe(false);
      });
    });

    it('collects multiple errors', () => {
      const product = {
        // missing id
        name: '', // empty
        price: -10, // negative
        image: 'invalid', // not a URL
        description: '', // empty
        category: 'invalid', // invalid category
      };

      const result = validateProduct(product);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('validateCartItem', () => {
    const validCartItem = {
      id: 1,
      name: 'Test Product',
      price: 19.99,
      image: 'https://example.com/image.jpg',
      description: 'A test product',
      category: 'electronics',
      quantity: 2,
    };

    it('returns valid for a complete valid cart item', () => {
      const result = validateCartItem(validCartItem);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('inherits product validation', () => {
      const item = { ...validCartItem, name: '' };

      const result = validateCartItem(item);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Product name must be a non-empty string');
    });

    describe('quantity validation', () => {
      it('requires quantity to be a positive integer', () => {
        const item = { ...validCartItem, quantity: 0 };

        const result = validateCartItem(item);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Cart item quantity must be a positive integer');
      });

      it('rejects negative quantity', () => {
        const item = { ...validCartItem, quantity: -1 };

        expect(validateCartItem(item).valid).toBe(false);
      });

      it('rejects non-integer quantity', () => {
        const item = { ...validCartItem, quantity: 2.5 };

        expect(validateCartItem(item).valid).toBe(false);
      });

      it('rejects string quantity', () => {
        const item = { ...validCartItem, quantity: '2' };

        expect(validateCartItem(item).valid).toBe(false);
      });
    });

    describe('stock limit validation', () => {
      it('validates quantity against stock', () => {
        const item = { ...validCartItem, stock: 5, quantity: 10 };

        const result = validateCartItem(item);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Cart item quantity cannot exceed available stock');
      });

      it('accepts quantity equal to stock', () => {
        const item = { ...validCartItem, stock: 5, quantity: 5 };

        expect(validateCartItem(item).valid).toBe(true);
      });

      it('accepts quantity less than stock', () => {
        const item = { ...validCartItem, stock: 10, quantity: 5 };

        expect(validateCartItem(item).valid).toBe(true);
      });
    });
  });

  describe('validateProfile', () => {
    const validProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      phone: '1234567890',
      avatar: 'https://example.com/avatar.jpg',
    };

    it('returns valid for a complete valid profile', () => {
      const result = validateProfile(validProfile);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns invalid for null input', () => {
      const result = validateProfile(null);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Profile must be an object');
    });

    describe('firstName validation', () => {
      it('requires firstName to be non-empty', () => {
        const profile = { ...validProfile, firstName: '' };

        const result = validateProfile(profile);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('First name is required');
      });

      it('limits firstName to 50 characters', () => {
        const profile = { ...validProfile, firstName: 'a'.repeat(51) };

        const result = validateProfile(profile);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('First name must be 50 characters or less');
      });

      it('accepts firstName at max length', () => {
        const profile = { ...validProfile, firstName: 'a'.repeat(50) };

        expect(validateProfile(profile).valid).toBe(true);
      });
    });

    describe('lastName validation', () => {
      it('requires lastName to be non-empty', () => {
        const profile = { ...validProfile, lastName: '' };

        const result = validateProfile(profile);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Last name is required');
      });

      it('limits lastName to 50 characters', () => {
        const profile = { ...validProfile, lastName: 'a'.repeat(51) };

        const result = validateProfile(profile);

        expect(result.valid).toBe(false);
      });
    });

    describe('email validation', () => {
      it('requires email to be non-empty', () => {
        const profile = { ...validProfile, email: '' };

        const result = validateProfile(profile);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Email is required');
      });

      it('requires valid email format', () => {
        const profile = { ...validProfile, email: 'invalid-email' };

        const result = validateProfile(profile);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Email must be a valid email address');
      });

      it('accepts valid email formats', () => {
        const validEmails = [
          'test@example.com',
          'user.name@domain.org',
          'user+tag@example.co.uk',
        ];

        validEmails.forEach((email) => {
          const profile = { ...validProfile, email };
          expect(validateProfile(profile).valid).toBe(true);
        });
      });
    });

    describe('phone validation', () => {
      it('accepts valid phone numbers', () => {
        const validPhones = ['1234567890', '123-456-7890', '+1 (123) 456-7890'];

        validPhones.forEach((phone) => {
          const profile = { ...validProfile, phone };
          expect(validateProfile(profile).valid).toBe(true);
        });
      });

      it('rejects invalid phone numbers', () => {
        const profile = { ...validProfile, phone: 'abc' };

        const result = validateProfile(profile);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Phone must be a valid phone number');
      });

      it('accepts empty phone (optional)', () => {
        const profile = { ...validProfile, phone: '' };

        expect(validateProfile(profile).valid).toBe(true);
      });
    });

    describe('avatar validation', () => {
      it('accepts valid avatar URL', () => {
        const profile = { ...validProfile, avatar: 'https://example.com/avatar.png' };

        expect(validateProfile(profile).valid).toBe(true);
      });

      it('rejects invalid avatar URL', () => {
        const profile = { ...validProfile, avatar: 'not-a-url' };

        const result = validateProfile(profile);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Avatar must be a valid URL');
      });

      it('accepts empty avatar (optional)', () => {
        const profile = { ...validProfile, avatar: '' };

        expect(validateProfile(profile).valid).toBe(true);
      });
    });

    describe('ZIP code validation', () => {
      it('accepts valid ZIP codes', () => {
        const validZips = ['10001', '10001-1234', 'SW1A 1AA'];

        validZips.forEach((zip) => {
          const profile = { ...validProfile, zip };
          expect(validateProfile(profile).valid).toBe(true);
        });
      });

      it('rejects invalid ZIP codes', () => {
        const profile = { ...validProfile, zip: 'invalid zip code format!!!' };

        const result = validateProfile(profile);

        expect(result.valid).toBe(false);
      });
    });

    describe('requireAllFields option', () => {
      it('requires all fields when option is true', () => {
        const profile = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        const result = validateProfile(profile, { requireAllFields: true });

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Address is required');
      });

      it('allows optional fields when option is false', () => {
        const profile = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        };

        const result = validateProfile(profile, { requireAllFields: false });

        expect(result.valid).toBe(true);
      });
    });
  });

  describe('validateShippingOption', () => {
    const validShipping = {
      id: 'standard',
      name: 'Standard Shipping',
      price: 5.99,
      estimatedDelivery: '3-5 business days',
    };

    it('returns valid for a complete valid shipping option', () => {
      const result = validateShippingOption(validShipping);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns invalid for null input', () => {
      const result = validateShippingOption(null);

      expect(result.valid).toBe(false);
    });

    it('requires id', () => {
      const shipping = { ...validShipping, id: '' };

      const result = validateShippingOption(shipping);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Shipping option ID is required');
    });

    it('requires name', () => {
      const shipping = { ...validShipping, name: '' };

      const result = validateShippingOption(shipping);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Shipping option name is required');
    });

    it('requires non-negative price', () => {
      const shipping = { ...validShipping, price: -5 };

      const result = validateShippingOption(shipping);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Shipping option price must be a non-negative number');
    });

    it('accepts zero price (free shipping)', () => {
      const shipping = { ...validShipping, price: 0 };

      expect(validateShippingOption(shipping).valid).toBe(true);
    });

    it('requires estimatedDelivery', () => {
      const shipping = { ...validShipping, estimatedDelivery: '' };

      const result = validateShippingOption(shipping);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Shipping option estimated delivery is required');
    });
  });

  describe('validateCart', () => {
    const validItem = {
      id: 1,
      name: 'Test Product',
      price: 19.99,
      image: 'https://example.com/image.jpg',
      description: 'A test product',
      category: 'electronics',
      quantity: 2,
    };

    it('returns valid for empty cart', () => {
      const result = validateCart([]);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns valid for cart with valid items', () => {
      const cart = [validItem, { ...validItem, id: 2 }];

      const result = validateCart(cart);

      expect(result.valid).toBe(true);
    });

    it('returns invalid for non-array input', () => {
      const result = validateCart('not an array');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Cart must be an array');
    });

    it('validates each cart item', () => {
      const cart = [
        validItem,
        { ...validItem, id: 2, quantity: -1 }, // Invalid quantity
      ];

      const result = validateCart(cart);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Item 2'))).toBe(true);
    });

    it('detects duplicate product IDs', () => {
      const cart = [
        validItem,
        { ...validItem }, // Same ID
      ];

      const result = validateCart(cart);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('duplicate'))).toBe(true);
    });

    it('includes item index in error messages', () => {
      const cart = [
        validItem,
        { ...validItem, id: 2, name: '' }, // Invalid name
      ];

      const result = validateCart(cart);

      expect(result.errors.some((e) => e.startsWith('Item 2:'))).toBe(true);
    });
  });

  describe('validateSearchTerm', () => {
    it('returns valid for normal search term', () => {
      const result = validateSearchTerm('test search');

      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('test search');
    });

    it('returns invalid for non-string input', () => {
      const result = validateSearchTerm(123);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Search term must be a string');
    });

    it('sanitizes dangerous characters', () => {
      const result = validateSearchTerm('<script>alert("xss")</script>');

      expect(result.sanitized).not.toContain('<');
      expect(result.sanitized).not.toContain('>');
    });

    it('returns invalid for search terms over 100 characters', () => {
      const longTerm = 'a'.repeat(101);

      const result = validateSearchTerm(longTerm);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Search term must be 100 characters or less');
    });

    it('truncates long search terms in sanitized output', () => {
      const longTerm = 'a'.repeat(150);

      const result = validateSearchTerm(longTerm);

      expect(result.sanitized).toHaveLength(100);
    });

    it('accepts empty string', () => {
      const result = validateSearchTerm('');

      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('');
    });

    it('trims whitespace', () => {
      const result = validateSearchTerm('  test  ');

      expect(result.sanitized).toBe('test');
    });
  });

  describe('sanitizeString', () => {
    it('returns empty string for non-string input', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
      expect(sanitizeString(123)).toBe('');
      expect(sanitizeString({})).toBe('');
    });

    it('removes angle brackets', () => {
      expect(sanitizeString('<script>')).toBe('script');
      expect(sanitizeString('test<>test')).toBe('testtest');
    });

    it('removes javascript: protocol', () => {
      expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)');
      expect(sanitizeString('JAVASCRIPT:alert(1)')).toBe('alert(1)');
    });

    it('removes event handlers', () => {
      expect(sanitizeString('onclick=alert(1)')).toBe('alert(1)');
      expect(sanitizeString('onmouseover=alert(1)')).toBe('alert(1)');
    });

    it('trims whitespace', () => {
      expect(sanitizeString('  test  ')).toBe('test');
    });

    it('preserves normal text', () => {
      expect(sanitizeString('Hello, World!')).toBe('Hello, World!');
    });

    it('handles multiple sanitizations', () => {
      const input = '<script>javascript:onclick=alert("xss")</script>';
      const result = sanitizeString(input);

      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('onclick=');
    });
  });

  describe('integration tests', () => {
    it('validates a complete e-commerce checkout scenario', () => {
      const cart = [
        {
          id: 1,
          name: 'Wireless Headphones',
          price: 79.99,
          image: 'https://example.com/headphones.jpg',
          description: 'Premium wireless headphones',
          category: 'electronics',
          quantity: 1,
        },
        {
          id: 2,
          name: 'Phone Case',
          price: 19.99,
          image: 'https://example.com/case.jpg',
          description: 'Protective phone case',
          category: 'electronics',
          quantity: 2,
        },
      ];

      const profile = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'USA',
        phone: '555-123-4567',
      };

      const shipping = {
        id: 'express',
        name: 'Express Shipping',
        price: 12.99,
        estimatedDelivery: '1-2 business days',
      };

      expect(validateCart(cart).valid).toBe(true);
      expect(validateProfile(profile).valid).toBe(true);
      expect(validateShippingOption(shipping).valid).toBe(true);
    });

    it('handles product validation within cart context', () => {
      // Create a product that passes product validation
      const product = {
        id: 1,
        name: 'Test',
        price: 10,
        image: 'https://example.com/test.jpg',
        description: 'Test product',
        category: 'electronics',
      };

      expect(validateProduct(product).valid).toBe(true);

      // Same product as cart item needs quantity
      const cartItem = { ...product, quantity: 1 };
      expect(validateCartItem(cartItem).valid).toBe(true);

      // Cart with the item
      expect(validateCart([cartItem]).valid).toBe(true);
    });
  });
});
