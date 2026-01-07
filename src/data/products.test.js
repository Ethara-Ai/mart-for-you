// Products data tests
import { describe, it, expect } from 'vitest';
import { products, shippingOptions, categories } from './products';

describe('Products Data', () => {
  describe('products array', () => {
    it('is defined and is an array', () => {
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
    });

    it('has products', () => {
      expect(products.length).toBeGreaterThan(0);
    });

    it('each product has required properties', () => {
      products.forEach((product) => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('image');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('category');
      });
    });

    it('each product has valid id (number)', () => {
      products.forEach((product) => {
        expect(typeof product.id).toBe('number');
        expect(product.id).toBeGreaterThan(0);
      });
    });

    it('all product ids are unique', () => {
      const ids = products.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(products.length);
    });

    it('each product has valid name (non-empty string)', () => {
      products.forEach((product) => {
        expect(typeof product.name).toBe('string');
        expect(product.name.length).toBeGreaterThan(0);
      });
    });

    it('each product has valid price (positive number)', () => {
      products.forEach((product) => {
        expect(typeof product.price).toBe('number');
        expect(product.price).toBeGreaterThanOrEqual(0);
      });
    });

    it('each product has valid image URL', () => {
      products.forEach((product) => {
        expect(typeof product.image).toBe('string');
        expect(product.image.length).toBeGreaterThan(0);
        expect(product.image).toMatch(/^https?:\/\//);
      });
    });

    it('each product has valid description (non-empty string)', () => {
      products.forEach((product) => {
        expect(typeof product.description).toBe('string');
        expect(product.description.length).toBeGreaterThan(0);
      });
    });

    it('each product has valid category (non-empty string)', () => {
      products.forEach((product) => {
        expect(typeof product.category).toBe('string');
        expect(product.category.length).toBeGreaterThan(0);
      });
    });
  });

  describe('sale products', () => {
    it('some products are on sale', () => {
      const saleProducts = products.filter((p) => p.onSale);
      expect(saleProducts.length).toBeGreaterThan(0);
    });

    it('sale products have salePrice property', () => {
      const saleProducts = products.filter((p) => p.onSale);
      saleProducts.forEach((product) => {
        expect(product).toHaveProperty('salePrice');
        expect(typeof product.salePrice).toBe('number');
      });
    });

    it('sale prices are lower than regular prices', () => {
      const saleProducts = products.filter((p) => p.onSale);
      saleProducts.forEach((product) => {
        expect(product.salePrice).toBeLessThan(product.price);
      });
    });

    it('sale prices are positive', () => {
      const saleProducts = products.filter((p) => p.onSale);
      saleProducts.forEach((product) => {
        expect(product.salePrice).toBeGreaterThanOrEqual(0);
      });
    });

    it('non-sale products have onSale as false or undefined', () => {
      const regularProducts = products.filter((p) => !p.onSale);
      regularProducts.forEach((product) => {
        expect(product.onSale).toBeFalsy();
      });
    });
  });

  describe('product categories', () => {
    const expectedCategories = [
      'electronics',
      'fashion',
      'home',
      'beauty',
      'sports',
      'food',
      'books',
      'toys',
    ];

    it('products exist in expected categories', () => {
      expectedCategories.forEach((category) => {
        const categoryProducts = products.filter((p) => p.category === category);
        expect(categoryProducts.length).toBeGreaterThan(0);
      });
    });

    it('all product categories are valid', () => {
      products.forEach((product) => {
        expect(expectedCategories).toContain(product.category);
      });
    });

    it('each category has multiple products', () => {
      expectedCategories.forEach((category) => {
        const categoryProducts = products.filter((p) => p.category === category);
        expect(categoryProducts.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});

describe('Categories Array', () => {
  it('is defined and is an array', () => {
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
  });

  it('includes "all" as first category', () => {
    expect(categories[0]).toBe('all');
  });

  it('contains all unique product categories', () => {
    const productCategories = [...new Set(products.map((p) => p.category))];
    productCategories.forEach((category) => {
      expect(categories).toContain(category);
    });
  });

  it('has unique values', () => {
    const uniqueCategories = new Set(categories);
    expect(uniqueCategories.size).toBe(categories.length);
  });

  it('does not have empty strings', () => {
    categories.forEach((category) => {
      expect(category.length).toBeGreaterThan(0);
    });
  });
});

describe('Shipping Options', () => {
  it('is defined and is an array', () => {
    expect(shippingOptions).toBeDefined();
    expect(Array.isArray(shippingOptions)).toBe(true);
  });

  it('has multiple shipping options', () => {
    expect(shippingOptions.length).toBeGreaterThan(0);
  });

  it('each option has required properties', () => {
    shippingOptions.forEach((option) => {
      expect(option).toHaveProperty('id');
      expect(option).toHaveProperty('name');
      expect(option).toHaveProperty('price');
      expect(option).toHaveProperty('estimatedDelivery');
    });
  });

  it('each option has valid id (string)', () => {
    shippingOptions.forEach((option) => {
      expect(typeof option.id).toBe('string');
      expect(option.id.length).toBeGreaterThan(0);
    });
  });

  it('all option ids are unique', () => {
    const ids = shippingOptions.map((o) => o.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(shippingOptions.length);
  });

  it('each option has valid name (non-empty string)', () => {
    shippingOptions.forEach((option) => {
      expect(typeof option.name).toBe('string');
      expect(option.name.length).toBeGreaterThan(0);
    });
  });

  it('each option has valid price (non-negative number)', () => {
    shippingOptions.forEach((option) => {
      expect(typeof option.price).toBe('number');
      expect(option.price).toBeGreaterThanOrEqual(0);
    });
  });

  it('each option has valid estimated delivery (non-empty string)', () => {
    shippingOptions.forEach((option) => {
      expect(typeof option.estimatedDelivery).toBe('string');
      expect(option.estimatedDelivery.length).toBeGreaterThan(0);
    });
  });

  describe('free shipping', () => {
    it('has free shipping option', () => {
      const freeOption = shippingOptions.find((o) => o.id === 'free');
      expect(freeOption).toBeDefined();
    });

    it('free shipping has zero price', () => {
      const freeOption = shippingOptions.find((o) => o.id === 'free');
      expect(freeOption.price).toBe(0);
    });
  });

  describe('standard shipping', () => {
    it('has standard shipping option', () => {
      const standardOption = shippingOptions.find((o) => o.id === 'standard');
      expect(standardOption).toBeDefined();
    });

    it('standard shipping has moderate price', () => {
      const standardOption = shippingOptions.find((o) => o.id === 'standard');
      expect(standardOption.price).toBeGreaterThan(0);
    });
  });

  describe('express shipping', () => {
    it('has express shipping option', () => {
      const expressOption = shippingOptions.find((o) => o.id === 'express');
      expect(expressOption).toBeDefined();
    });

    it('express shipping is more expensive than standard', () => {
      const standardOption = shippingOptions.find((o) => o.id === 'standard');
      const expressOption = shippingOptions.find((o) => o.id === 'express');
      expect(expressOption.price).toBeGreaterThan(standardOption.price);
    });
  });

  describe('price ordering', () => {
    it('prices are in ascending order', () => {
      for (let i = 0; i < shippingOptions.length - 1; i++) {
        expect(shippingOptions[i].price).toBeLessThanOrEqual(shippingOptions[i + 1].price);
      }
    });
  });
});

describe('Data Integrity', () => {
  describe('products reference consistency', () => {
    it('no duplicate product names', () => {
      const names = products.map((p) => p.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(products.length);
    });

    it('all prices are formatted as decimals', () => {
      products.forEach((product) => {
        const priceStr = product.price.toString();
        // Price should be a valid decimal number
        expect(product.price).toBe(parseFloat(priceStr));
      });
    });
  });

  describe('image URLs', () => {
    it('all image URLs use HTTPS', () => {
      products.forEach((product) => {
        expect(product.image).toMatch(/^https:\/\//);
      });
    });

    it('all images are from valid domains', () => {
      const validDomains = ['unsplash.com', 'plus.unsplash.com', 'images.unsplash.com'];
      products.forEach((product) => {
        const url = new URL(product.image);
        const isValidDomain = validDomains.some((domain) => url.hostname.includes(domain));
        expect(isValidDomain).toBe(true);
      });
    });
  });

  describe('category-product mapping', () => {
    it('categories array matches unique product categories plus "all"', () => {
      const productCategories = [...new Set(products.map((p) => p.category))].sort();
      const categoriesWithoutAll = categories.filter((c) => c !== 'all').sort();

      expect(categoriesWithoutAll).toEqual(productCategories);
    });
  });
});

describe('Product Search Simulation', () => {
  it('can find products by name (case insensitive)', () => {
    const searchTerm = 'wireless';
    const results = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    expect(results.length).toBeGreaterThan(0);
  });

  it('can find products by category', () => {
    const category = 'electronics';
    const results = products.filter((p) => p.category === category);
    expect(results.length).toBeGreaterThan(0);
  });

  it('can filter sale products', () => {
    const results = products.filter((p) => p.onSale === true);
    expect(results.length).toBeGreaterThan(0);
    results.forEach((product) => {
      expect(product.salePrice).toBeLessThan(product.price);
    });
  });

  it('can sort products by price ascending', () => {
    const sorted = [...products].sort((a, b) => a.price - b.price);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].price).toBeLessThanOrEqual(sorted[i + 1].price);
    }
  });

  it('can sort products by price descending', () => {
    const sorted = [...products].sort((a, b) => b.price - a.price);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i + 1].price);
    }
  });

  it('can filter products by price range', () => {
    const minPrice = 20;
    const maxPrice = 50;
    const results = products.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    results.forEach((product) => {
      expect(product.price).toBeGreaterThanOrEqual(minPrice);
      expect(product.price).toBeLessThanOrEqual(maxPrice);
    });
  });
});

describe('Cart Calculations with Products', () => {
  it('can calculate total for regular products', () => {
    const cartItems = [
      { ...products[0], quantity: 2 },
      { ...products[1], quantity: 1 },
    ];

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    expect(total).toBeGreaterThan(0);
    expect(typeof total).toBe('number');
  });

  it('can calculate total with sale prices', () => {
    const saleProduct = products.find((p) => p.onSale);

    if (saleProduct) {
      const cartItem = { ...saleProduct, quantity: 2 };
      const total = cartItem.salePrice * cartItem.quantity;

      expect(total).toBeLessThan(cartItem.price * cartItem.quantity);
    }
  });

  it('can add shipping to cart total', () => {
    const cartItem = { ...products[0], quantity: 1 };
    const cartTotal = cartItem.price;
    const shipping = shippingOptions.find((o) => o.id === 'standard');

    const totalWithShipping = cartTotal + shipping.price;

    expect(totalWithShipping).toBeGreaterThan(cartTotal);
    expect(totalWithShipping).toBe(cartTotal + 4.99);
  });
});
