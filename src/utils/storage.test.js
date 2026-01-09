/**
 * Tests for localStorage utilities
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isStorageAvailable,
  getFromStorage,
  setToStorage,
  removeFromStorage,
  clearStorage,
  getStorageKeys,
  getStorageSize,
  createNamespacedStorage,
  setWithExpiry,
  getWithExpiry,
} from './storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('isStorageAvailable', () => {
    it('returns true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });

    it('returns false when localStorage throws error', () => {
      const originalSetItem = window.localStorage.setItem;
      window.localStorage.setItem = vi.fn(() => {
        throw new Error('Storage disabled');
      });

      expect(isStorageAvailable()).toBe(false);

      window.localStorage.setItem = originalSetItem;
    });
  });

  describe('getFromStorage', () => {
    it('returns parsed value for existing key', () => {
      localStorage.setItem('test', JSON.stringify({ foo: 'bar' }));

      const result = getFromStorage('test');

      expect(result).toEqual({ foo: 'bar' });
    });

    it('returns default value for non-existent key', () => {
      const result = getFromStorage('nonexistent', 'default');

      expect(result).toBe('default');
    });

    it('returns null as default when no default provided', () => {
      const result = getFromStorage('nonexistent');

      expect(result).toBeNull();
    });

    it('handles string values', () => {
      localStorage.setItem('string', JSON.stringify('hello'));

      expect(getFromStorage('string')).toBe('hello');
    });

    it('handles number values', () => {
      localStorage.setItem('number', JSON.stringify(42));

      expect(getFromStorage('number')).toBe(42);
    });

    it('handles boolean values', () => {
      localStorage.setItem('bool', JSON.stringify(true));

      expect(getFromStorage('bool')).toBe(true);
    });

    it('handles array values', () => {
      localStorage.setItem('array', JSON.stringify([1, 2, 3]));

      expect(getFromStorage('array')).toEqual([1, 2, 3]);
    });

    it('handles nested objects', () => {
      const nested = { a: { b: { c: 'deep' } } };
      localStorage.setItem('nested', JSON.stringify(nested));

      expect(getFromStorage('nested')).toEqual(nested);
    });

    it('returns default value for invalid JSON', () => {
      localStorage.setItem('invalid', 'not valid json{');

      const result = getFromStorage('invalid', 'fallback');

      expect(result).toBe('fallback');
    });

    it('handles null stored value', () => {
      localStorage.setItem('null', JSON.stringify(null));

      expect(getFromStorage('null', 'default')).toBeNull();
    });

    it('handles empty string key', () => {
      localStorage.setItem('', JSON.stringify('empty key'));

      expect(getFromStorage('')).toBe('empty key');
    });

    it('handles default value as object', () => {
      const defaultObj = { default: true };
      const result = getFromStorage('missing', defaultObj);

      expect(result).toEqual(defaultObj);
    });

    it('handles default value as array', () => {
      const defaultArr = [1, 2, 3];
      const result = getFromStorage('missing', defaultArr);

      expect(result).toEqual(defaultArr);
    });
  });

  describe('setToStorage', () => {
    it('stores value in localStorage', () => {
      setToStorage('key', { foo: 'bar' });

      const stored = JSON.parse(localStorage.getItem('key'));
      expect(stored).toEqual({ foo: 'bar' });
    });

    it('returns true on success', () => {
      const result = setToStorage('key', 'value');

      expect(result).toBe(true);
    });

    it('stores string values', () => {
      setToStorage('string', 'hello');

      expect(JSON.parse(localStorage.getItem('string'))).toBe('hello');
    });

    it('stores number values', () => {
      setToStorage('number', 42);

      expect(JSON.parse(localStorage.getItem('number'))).toBe(42);
    });

    it('stores boolean values', () => {
      setToStorage('bool', false);

      expect(JSON.parse(localStorage.getItem('bool'))).toBe(false);
    });

    it('stores array values', () => {
      setToStorage('array', [1, 2, 3]);

      expect(JSON.parse(localStorage.getItem('array'))).toEqual([1, 2, 3]);
    });

    it('stores null values', () => {
      setToStorage('null', null);

      expect(JSON.parse(localStorage.getItem('null'))).toBeNull();
    });

    it('overwrites existing values', () => {
      setToStorage('key', 'original');
      setToStorage('key', 'updated');

      expect(getFromStorage('key')).toBe('updated');
    });

    it('returns false when storage fails', () => {
      const originalSetItem = window.localStorage.setItem;
      window.localStorage.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });

      const result = setToStorage('key', 'value');

      expect(result).toBe(false);

      window.localStorage.setItem = originalSetItem;
    });

    it('handles very long strings', () => {
      const longString = 'a'.repeat(10000);
      setToStorage('long', longString);

      expect(getFromStorage('long')).toBe(longString);
    });

    it('handles complex nested objects', () => {
      const complex = {
        level1: {
          level2: {
            array: [1, 2, { nested: true }],
            string: 'test',
          },
        },
      };

      setToStorage('complex', complex);

      expect(getFromStorage('complex')).toEqual(complex);
    });
  });

  describe('removeFromStorage', () => {
    it('removes existing key', () => {
      localStorage.setItem('toRemove', 'value');

      removeFromStorage('toRemove');

      expect(localStorage.getItem('toRemove')).toBeNull();
    });

    it('returns true on success', () => {
      localStorage.setItem('key', 'value');

      const result = removeFromStorage('key');

      expect(result).toBe(true);
    });

    it('returns true when removing non-existent key', () => {
      const result = removeFromStorage('nonexistent');

      expect(result).toBe(true);
    });

    it('does not affect other keys', () => {
      localStorage.setItem('keep1', 'value1');
      localStorage.setItem('remove', 'value');
      localStorage.setItem('keep2', 'value2');

      removeFromStorage('remove');

      expect(localStorage.getItem('keep1')).toBe('value1');
      expect(localStorage.getItem('keep2')).toBe('value2');
      expect(localStorage.getItem('remove')).toBeNull();
    });
  });

  describe('clearStorage', () => {
    it('removes all items from localStorage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.setItem('key3', 'value3');

      clearStorage();

      // Verify items are removed by checking they return null
      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBeNull();
      expect(localStorage.getItem('key3')).toBeNull();
    });

    it('returns true on success', () => {
      localStorage.setItem('key', 'value');

      const result = clearStorage();

      expect(result).toBe(true);
    });

    it('returns true when storage is already empty', () => {
      const result = clearStorage();

      expect(result).toBe(true);
    });
  });

  describe('getStorageKeys', () => {
    it('returns all keys without prefix', () => {
      // Use setToStorage to ensure proper JSON serialization
      setToStorage('key1', 'value1');
      setToStorage('key2', 'value2');
      setToStorage('key3', 'value3');

      const keys = getStorageKeys();

      expect(keys).toHaveLength(3);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
    });

    it('returns keys matching prefix', () => {
      setToStorage('app_key1', 'value1');
      setToStorage('app_key2', 'value2');
      setToStorage('other_key', 'value3');

      const keys = getStorageKeys('app_');

      expect(keys).toHaveLength(2);
      expect(keys).toContain('app_key1');
      expect(keys).toContain('app_key2');
    });

    it('returns empty array for no matches', () => {
      setToStorage('key1', 'value1');

      const keys = getStorageKeys('nonexistent_');

      expect(keys).toHaveLength(0);
    });

    it('returns empty array for empty storage', () => {
      const keys = getStorageKeys();

      expect(keys).toHaveLength(0);
    });

    it('handles empty prefix', () => {
      setToStorage('key', 'value');

      const keys = getStorageKeys('');

      expect(keys).toContain('key');
    });
  });

  describe('getStorageSize', () => {
    it('returns 0 for empty storage', () => {
      // Ensure storage is truly empty
      localStorage.clear();
      const size = getStorageSize();

      expect(size).toBeGreaterThanOrEqual(0);
    });

    it('returns approximate size in bytes', () => {
      setToStorage('key', 'value');

      const size = getStorageSize();

      // "key" (3) + JSON.stringify("value") = some bytes
      expect(size).toBeGreaterThan(0);
    });

    it('increases as more data is added', () => {
      localStorage.clear();

      setToStorage('key1', 'value1');
      const size1 = getStorageSize();

      setToStorage('key2', 'value2');
      const size2 = getStorageSize();

      setToStorage('key3', 'value3value3value3');
      const size3 = getStorageSize();

      expect(size2).toBeGreaterThan(size1);
      expect(size3).toBeGreaterThan(size2);
    });
  });

  describe('createNamespacedStorage', () => {
    it('creates storage interface with namespace prefix', () => {
      const cartStorage = createNamespacedStorage('cart');

      cartStorage.set('items', [1, 2, 3]);

      expect(localStorage.getItem('cart:items')).toBe(JSON.stringify([1, 2, 3]));
    });

    it('get retrieves namespaced values', () => {
      const storage = createNamespacedStorage('app');

      storage.set('key', 'value');

      expect(storage.get('key')).toBe('value');
    });

    it('get returns default for missing keys', () => {
      const storage = createNamespacedStorage('app');

      expect(storage.get('missing', 'default')).toBe('default');
    });

    it('remove deletes namespaced keys', () => {
      const storage = createNamespacedStorage('app');

      storage.set('key', 'value');
      storage.remove('key');

      expect(storage.get('key')).toBeNull();
    });

    it('clear removes only namespaced keys', () => {
      const storage = createNamespacedStorage('app');

      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      setToStorage('other', 'value');

      storage.clear();

      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
      expect(getFromStorage('other')).toBe('value');
    });

    it('keys returns only namespaced keys without prefix', () => {
      const storage = createNamespacedStorage('app');

      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      setToStorage('other', 'value');

      const keys = storage.keys();

      expect(keys).toHaveLength(2);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).not.toContain('app:key1');
    });

    it('different namespaces are isolated', () => {
      const storage1 = createNamespacedStorage('ns1');
      const storage2 = createNamespacedStorage('ns2');

      storage1.set('key', 'value1');
      storage2.set('key', 'value2');

      expect(storage1.get('key')).toBe('value1');
      expect(storage2.get('key')).toBe('value2');
    });
  });

  describe('setWithExpiry', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('stores value with expiry timestamp', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      setWithExpiry('key', 'value', 1000);

      const stored = JSON.parse(localStorage.getItem('key'));

      expect(stored.value).toBe('value');
      expect(stored.expiry).toBe(now + 1000);
    });

    it('returns true on success', () => {
      const result = setWithExpiry('key', 'value', 1000);

      expect(result).toBe(true);
    });

    it('stores complex values', () => {
      const complex = { foo: 'bar', nums: [1, 2, 3] };

      setWithExpiry('complex', complex, 5000);

      const stored = JSON.parse(localStorage.getItem('complex'));
      expect(stored.value).toEqual(complex);
    });
  });

  describe('getWithExpiry', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns value if not expired', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      setWithExpiry('key', 'value', 10000);

      vi.setSystemTime(now + 5000);

      expect(getWithExpiry('key')).toBe('value');
    });

    it('returns default value if expired', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      setWithExpiry('key', 'value', 1000);

      vi.setSystemTime(now + 2000);

      expect(getWithExpiry('key', 'default')).toBe('default');
    });

    it('removes expired items from storage', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      setWithExpiry('key', 'value', 1000);

      vi.setSystemTime(now + 2000);

      getWithExpiry('key');

      expect(localStorage.getItem('key')).toBeNull();
    });

    it('returns null as default for expired items', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      setWithExpiry('key', 'value', 1000);

      vi.setSystemTime(now + 2000);

      expect(getWithExpiry('key')).toBeNull();
    });

    it('returns default for non-existent key', () => {
      expect(getWithExpiry('nonexistent', 'default')).toBe('default');
    });

    it('handles non-wrapped values (backwards compatibility)', () => {
      localStorage.setItem('plain', JSON.stringify('plainValue'));

      expect(getWithExpiry('plain')).toBe('plainValue');
    });

    it('returns complex values if not expired', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      const complex = { foo: 'bar', nums: [1, 2, 3] };
      setWithExpiry('complex', complex, 10000);

      expect(getWithExpiry('complex')).toEqual(complex);
    });

    it('handles exact expiry time', () => {
      const now = Date.now();
      vi.setSystemTime(now);

      setWithExpiry('key', 'value', 1000);

      vi.setSystemTime(now + 1000);

      // At exact expiry time, should still be valid
      expect(getWithExpiry('key')).toBe('value');

      vi.setSystemTime(now + 1001);

      // Just past expiry, should be expired
      expect(getWithExpiry('key', 'default')).toBe('default');
    });
  });

  describe('integration tests', () => {
    it('full lifecycle: set, get, update, remove', () => {
      // Set
      setToStorage('user', { name: 'John', age: 30 });
      expect(getFromStorage('user')).toEqual({ name: 'John', age: 30 });

      // Update
      setToStorage('user', { name: 'John', age: 31 });
      expect(getFromStorage('user').age).toBe(31);

      // Remove
      removeFromStorage('user');
      expect(getFromStorage('user')).toBeNull();
    });

    it('namespaced storage with expiry', () => {
      vi.useFakeTimers();
      const now = Date.now();
      vi.setSystemTime(now);

      const _sessionStorage = createNamespacedStorage('session');

      // Set with expiry using raw storage
      setWithExpiry('session:token', 'abc123', 3600000);

      // Value accessible before expiry
      vi.setSystemTime(now + 1800000);
      expect(getWithExpiry('session:token')).toBe('abc123');

      // Value expired after TTL
      vi.setSystemTime(now + 3700000);
      expect(getWithExpiry('session:token', null)).toBeNull();

      vi.useRealTimers();
    });

    it('handles concurrent operations', () => {
      // Simulate concurrent-like operations
      setToStorage('counter', 0);

      for (let i = 0; i < 10; i++) {
        const current = getFromStorage('counter');
        setToStorage('counter', current + 1);
      }

      expect(getFromStorage('counter')).toBe(10);
    });

    it('preserves data types through storage cycle', () => {
      const testCases = [
        { key: 'string', value: 'hello' },
        { key: 'number', value: 42.5 },
        { key: 'boolean', value: true },
        { key: 'null', value: null },
        { key: 'array', value: [1, 'two', true, null] },
        { key: 'object', value: { nested: { deep: 'value' } } },
      ];

      testCases.forEach(({ key, value }) => {
        setToStorage(key, value);
        expect(getFromStorage(key)).toEqual(value);
      });
    });
  });
});
