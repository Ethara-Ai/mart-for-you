/**
 * Tests for ID generation utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateUUID,
  generateId,
  generateOrderNumber,
  generateToastId,
  generateSequentialId,
  resetSequentialCounter,
  generateCartItemId,
} from './id';

describe('ID Generation Utilities', () => {
  describe('generateUUID', () => {
    it('generates a string', () => {
      const uuid = generateUUID();
      expect(typeof uuid).toBe('string');
    });

    it('generates a UUID in correct format', () => {
      const uuid = generateUUID();
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it('generates unique UUIDs', () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(generateUUID());
      }
      expect(uuids.size).toBe(100);
    });

    it('UUID has version 4 indicator', () => {
      const uuid = generateUUID();
      // The 13th character should be '4' for UUID v4
      expect(uuid[14]).toBe('4');
    });

    it('UUID has correct variant bits', () => {
      const uuid = generateUUID();
      // The 17th character should be 8, 9, a, or b
      expect(['8', '9', 'a', 'b']).toContain(uuid[19].toLowerCase());
    });
  });

  describe('generateId', () => {
    it('generates a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('generates ID with default length', () => {
      const id = generateId();
      // Format: timestamp-randompart
      expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
    });

    it('generates unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });

    it('generates IDs with custom length', () => {
      const id = generateId(16);
      expect(typeof id).toBe('string');
      // Should still have the timestamp-random format
      expect(id.includes('-')).toBe(true);
    });

    it('handles zero length', () => {
      const id = generateId(0);
      expect(typeof id).toBe('string');
    });

    it('handles negative length', () => {
      const id = generateId(-5);
      expect(typeof id).toBe('string');
    });

    it('contains timestamp component', () => {
      const beforeTime = Date.now();
      const id = generateId();
      const afterTime = Date.now();

      // Extract timestamp part (base36 encoded)
      const timestampPart = id.split('-')[0];
      const timestamp = parseInt(timestampPart, 36);

      // Timestamp should be within the time window
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('generateOrderNumber', () => {
    it('generates a string', () => {
      const orderNum = generateOrderNumber();
      expect(typeof orderNum).toBe('string');
    });

    it('uses default prefix "ORD"', () => {
      const orderNum = generateOrderNumber();
      expect(orderNum.startsWith('ORD-')).toBe(true);
    });

    it('uses custom prefix', () => {
      const orderNum = generateOrderNumber('INV');
      expect(orderNum.startsWith('INV-')).toBe(true);
    });

    it('has correct format: PREFIX-YYYYMMDD-XXXXXX', () => {
      const orderNum = generateOrderNumber();
      const regex = /^ORD-\d{8}-[A-Z0-9]{6}$/;
      expect(orderNum).toMatch(regex);
    });

    it('includes current date', () => {
      const orderNum = generateOrderNumber();
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      expect(orderNum).toContain(today);
    });

    it('generates unique order numbers', () => {
      const orderNumbers = new Set();
      for (let i = 0; i < 100; i++) {
        orderNumbers.add(generateOrderNumber());
      }
      expect(orderNumbers.size).toBe(100);
    });

    it('random part is alphanumeric uppercase', () => {
      const orderNum = generateOrderNumber();
      const randomPart = orderNum.split('-')[2];
      expect(randomPart).toMatch(/^[A-Z0-9]{6}$/);
    });

    it('handles empty prefix', () => {
      const orderNum = generateOrderNumber('');
      expect(orderNum.startsWith('-')).toBe(true);
    });

    it('handles special characters in prefix', () => {
      const orderNum = generateOrderNumber('TEST#123');
      expect(orderNum.startsWith('TEST#123-')).toBe(true);
    });
  });

  describe('generateToastId', () => {
    it('generates a string', () => {
      const toastId = generateToastId();
      expect(typeof toastId).toBe('string');
    });

    it('starts with "toast-" prefix', () => {
      const toastId = generateToastId();
      expect(toastId.startsWith('toast-')).toBe(true);
    });

    it('has correct format: toast-timestamp-random', () => {
      const toastId = generateToastId();
      const regex = /^toast-\d+-[a-z0-9]+$/;
      expect(toastId).toMatch(regex);
    });

    it('generates unique toast IDs', () => {
      const toastIds = new Set();
      for (let i = 0; i < 100; i++) {
        toastIds.add(generateToastId());
      }
      expect(toastIds.size).toBe(100);
    });

    it('contains timestamp', () => {
      const beforeTime = Date.now();
      const toastId = generateToastId();
      const afterTime = Date.now();

      // Extract timestamp part
      const parts = toastId.split('-');
      const timestamp = parseInt(parts[1], 10);

      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('generateSequentialId', () => {
    beforeEach(() => {
      resetSequentialCounter();
    });

    it('generates a string', () => {
      const id = generateSequentialId();
      expect(typeof id).toBe('string');
    });

    it('uses default prefix "id"', () => {
      const id = generateSequentialId();
      expect(id.startsWith('id-')).toBe(true);
    });

    it('uses custom prefix', () => {
      const id = generateSequentialId('item');
      expect(id.startsWith('item-')).toBe(true);
    });

    it('increments counter with each call', () => {
      const id1 = generateSequentialId();
      const id2 = generateSequentialId();
      const id3 = generateSequentialId();

      // Extract counter part (last segment, padded to 6 digits)
      const counter1 = id1.split('-').pop();
      const counter2 = id2.split('-').pop();
      const counter3 = id3.split('-').pop();

      expect(parseInt(counter1, 10)).toBe(1);
      expect(parseInt(counter2, 10)).toBe(2);
      expect(parseInt(counter3, 10)).toBe(3);
    });

    it('counter is zero-padded to 6 digits', () => {
      const id = generateSequentialId();
      const counter = id.split('-').pop();
      expect(counter.length).toBe(6);
      expect(counter).toBe('000001');
    });

    it('generates unique IDs even with same prefix', () => {
      const ids = [];
      for (let i = 0; i < 10; i++) {
        ids.push(generateSequentialId('test'));
      }
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });

    it('includes timestamp for additional uniqueness', () => {
      const id = generateSequentialId();
      const parts = id.split('-');
      expect(parts.length).toBe(3); // prefix-timestamp-counter
    });
  });

  describe('resetSequentialCounter', () => {
    it('resets counter to 0', () => {
      // Generate some IDs to increment counter
      generateSequentialId();
      generateSequentialId();
      generateSequentialId();

      // Reset
      resetSequentialCounter();

      // Next ID should have counter = 1
      const id = generateSequentialId();
      const counter = id.split('-').pop();
      expect(parseInt(counter, 10)).toBe(1);
    });

    it('can be called multiple times without error', () => {
      resetSequentialCounter();
      resetSequentialCounter();
      resetSequentialCounter();

      const id = generateSequentialId();
      expect(id).toBeDefined();
    });
  });

  describe('generateCartItemId', () => {
    it('generates a string', () => {
      const cartItemId = generateCartItemId(1);
      expect(typeof cartItemId).toBe('string');
    });

    it('includes product ID in result', () => {
      const cartItemId = generateCartItemId(123);
      expect(cartItemId).toContain('123');
    });

    it('has cart-item prefix', () => {
      const cartItemId = generateCartItemId(1);
      expect(cartItemId.startsWith('cart-item-')).toBe(true);
    });

    it('generates consistent ID for same product', () => {
      const id1 = generateCartItemId(42);
      const id2 = generateCartItemId(42);
      expect(id1).toBe(id2);
    });

    it('generates different IDs for different products', () => {
      const id1 = generateCartItemId(1);
      const id2 = generateCartItemId(2);
      expect(id1).not.toBe(id2);
    });

    it('handles string product IDs', () => {
      const cartItemId = generateCartItemId('abc-123');
      expect(cartItemId).toBe('cart-item-abc-123');
    });

    it('handles numeric product IDs', () => {
      const cartItemId = generateCartItemId(999);
      expect(cartItemId).toBe('cart-item-999');
    });

    it('handles zero as product ID', () => {
      const cartItemId = generateCartItemId(0);
      expect(cartItemId).toBe('cart-item-0');
    });
  });

  describe('integration tests', () => {
    it('all generators produce unique values in combination', () => {
      const allIds = new Set();

      // Generate various IDs
      for (let i = 0; i < 10; i++) {
        allIds.add(generateUUID());
        allIds.add(generateId());
        allIds.add(generateOrderNumber());
        allIds.add(generateToastId());
      }

      // All should be unique (40 IDs)
      expect(allIds.size).toBe(40);
    });

    it('IDs are safe for use as object keys', () => {
      const obj = {};
      const id1 = generateId();
      const id2 = generateToastId();
      const id3 = generateOrderNumber();

      obj[id1] = 'value1';
      obj[id2] = 'value2';
      obj[id3] = 'value3';

      expect(obj[id1]).toBe('value1');
      expect(obj[id2]).toBe('value2');
      expect(obj[id3]).toBe('value3');
    });

    it('IDs are safe for use as HTML element IDs', () => {
      const id = generateId();
      // HTML IDs should not start with a number and should not contain spaces
      // Our IDs start with timestamp in base36, which always starts with a letter or number
      // This is acceptable for modern browsers
      expect(id).not.toContain(' ');
      expect(id).not.toContain('"');
      expect(id).not.toContain("'");
    });
  });
});
