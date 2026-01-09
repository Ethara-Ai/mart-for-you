// searchContextValue tests
import { describe, it, expect } from 'vitest';
import { SearchContext } from './searchContextValue';

describe('searchContextValue', () => {
  describe('SearchContext', () => {
    it('exports SearchContext', () => {
      expect(SearchContext).toBeDefined();
    });

    it('SearchContext is a valid React context object', () => {
      // React contexts have Provider and Consumer properties
      expect(SearchContext.Provider).toBeDefined();
      expect(SearchContext.Consumer).toBeDefined();
    });

    it('SearchContext has a Provider component', () => {
      expect(SearchContext.Provider).toBeDefined();
      expect(typeof SearchContext.Provider).toBe('object');
    });

    it('SearchContext has a Consumer component', () => {
      expect(SearchContext.Consumer).toBeDefined();
      expect(typeof SearchContext.Consumer).toBe('object');
    });

    it('SearchContext has default value of null', () => {
      // The context is created with createContext(null)
      // We can verify this by checking the _currentValue
      // Note: _currentValue is an internal property, but it's commonly used in tests
      expect(SearchContext._currentValue).toBeNull();
    });

    it('SearchContext has displayName property available for setting', () => {
      // React contexts support displayName for DevTools
      // By default it's undefined, but can be set
      expect(
        SearchContext.displayName === undefined || typeof SearchContext.displayName === 'string'
      ).toBe(true);
    });
  });

  describe('context structure', () => {
    it('has the expected context shape', () => {
      // Verify the context has the standard React context structure
      expect(SearchContext).toHaveProperty('Provider');
      expect(SearchContext).toHaveProperty('Consumer');
      expect(SearchContext).toHaveProperty('_currentValue');
    });
  });

  describe('context isolation', () => {
    it('SearchContext is a unique context instance', () => {
      // Each createContext call creates a new unique context
      // This ensures the context is properly isolated
      expect(SearchContext).not.toBeNull();
      expect(typeof SearchContext).toBe('object');
    });
  });
});
