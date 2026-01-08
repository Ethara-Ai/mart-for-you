// FilterContext tests
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FilterProvider, useFilter } from './FilterContext';
import { CATEGORIES } from '../constants';

// Wrapper component with MemoryRouter for testing
const createWrapper = (initialEntries = ['/']) =>
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <FilterProvider>{children}</FilterProvider>
      </MemoryRouter>
    );
  };

describe('FilterContext', () => {
  describe('useFilter hook', () => {
    it('throws error when used outside FilterProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useFilter());
      }).toThrow('useFilter must be used within a FilterProvider');

      consoleSpy.mockRestore();
    });

    it('provides filter context when used within FilterProvider', () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.activeCategory).toBeDefined();
      expect(result.current.viewingOffers).toBeDefined();
      expect(result.current.setActiveCategory).toBeDefined();
      expect(result.current.enableOffersView).toBeDefined();
      expect(result.current.resetFilters).toBeDefined();
      expect(result.current.hasActiveFilters).toBeDefined();
    });
  });

  describe('activeCategory', () => {
    it('defaults to "all" when no category in URL', () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products']),
      });

      expect(result.current.activeCategory).toBe(CATEGORIES.ALL);
    });

    it('reads category from URL search params', () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products?category=electronics']),
      });

      expect(result.current.activeCategory).toBe('electronics');
    });

    it('updates category when setActiveCategory is called', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products']),
      });

      act(() => {
        result.current.setActiveCategory('fashion');
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe('fashion');
      });
    });

    it('clears category from URL when set to "all"', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products?category=electronics']),
      });

      act(() => {
        result.current.setActiveCategory(CATEGORIES.ALL);
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe(CATEGORIES.ALL);
      });
    });
  });

  describe('viewingOffers', () => {
    it('defaults to false', () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      expect(result.current.viewingOffers).toBe(false);
    });

    it('becomes true when enableOffersView is called', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.enableOffersView();
      });

      await waitFor(() => {
        expect(result.current.viewingOffers).toBe(true);
      });
    });

    it('resets to false when setActiveCategory is called', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      // First enable offers
      act(() => {
        result.current.enableOffersView();
      });

      await waitFor(() => {
        expect(result.current.viewingOffers).toBe(true);
      });

      // Then set a category
      act(() => {
        result.current.setActiveCategory('electronics');
      });

      await waitFor(() => {
        expect(result.current.viewingOffers).toBe(false);
      });
    });
  });

  describe('enableOffersView', () => {
    it('sets viewingOffers to true', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.enableOffersView();
      });

      await waitFor(() => {
        expect(result.current.viewingOffers).toBe(true);
      });
    });

    it('clears category from URL when enabling offers', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products?category=electronics']),
      });

      act(() => {
        result.current.enableOffersView();
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe(CATEGORIES.ALL);
      });
    });
  });

  describe('resetFilters', () => {
    it('resets viewingOffers to false', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      // Enable offers first
      act(() => {
        result.current.enableOffersView();
      });

      await waitFor(() => {
        expect(result.current.viewingOffers).toBe(true);
      });

      // Reset filters
      act(() => {
        result.current.resetFilters();
      });

      await waitFor(() => {
        expect(result.current.viewingOffers).toBe(false);
      });
    });

    it('clears category from URL', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products?category=electronics']),
      });

      act(() => {
        result.current.resetFilters();
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe(CATEGORIES.ALL);
      });
    });

    it('resets all filters to default state', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products?category=fashion']),
      });

      // Enable offers
      act(() => {
        result.current.enableOffersView();
      });

      // Reset everything
      act(() => {
        result.current.resetFilters();
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe(CATEGORIES.ALL);
        expect(result.current.viewingOffers).toBe(false);
        expect(result.current.hasActiveFilters).toBe(false);
      });
    });
  });

  describe('hasActiveFilters', () => {
    it('returns false when no filters are active', () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products']),
      });

      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('returns true when category is not "all"', () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products?category=electronics']),
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('returns true when viewing offers', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.enableOffersView();
      });

      await waitFor(() => {
        expect(result.current.hasActiveFilters).toBe(true);
      });
    });

    it('returns true when both category and offers are active', () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products?category=electronics']),
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });
  });

  describe('setActiveCategory', () => {
    it('updates activeCategory correctly', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setActiveCategory('home');
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe('home');
      });
    });

    it('handles all available categories', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      const categories = ['electronics', 'fashion', 'home', 'beauty', 'sports'];

      for (const category of categories) {
        act(() => {
          result.current.setActiveCategory(category);
        });

        await waitFor(() => {
          expect(result.current.activeCategory).toBe(category);
        });
      }
    });

    it('resets viewingOffers when changing category', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      // Enable offers
      act(() => {
        result.current.enableOffersView();
      });

      await waitFor(() => {
        expect(result.current.viewingOffers).toBe(true);
      });

      // Change category
      act(() => {
        result.current.setActiveCategory('electronics');
      });

      await waitFor(() => {
        expect(result.current.viewingOffers).toBe(false);
        expect(result.current.activeCategory).toBe('electronics');
      });
    });
  });

  describe('context value memoization', () => {
    it('provides stable function references', () => {
      const { result, rerender } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      const initialSetActiveCategory = result.current.setActiveCategory;
      const initialEnableOffersView = result.current.enableOffersView;
      const initialResetFilters = result.current.resetFilters;

      rerender();

      // Function references should be stable due to useCallback
      expect(result.current.setActiveCategory).toBe(initialSetActiveCategory);
      expect(result.current.enableOffersView).toBe(initialEnableOffersView);
      expect(result.current.resetFilters).toBe(initialResetFilters);
    });
  });

  describe('URL synchronization', () => {
    it('updates URL when category changes', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products']),
      });

      act(() => {
        result.current.setActiveCategory('electronics');
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe('electronics');
      });
    });

    it('removes category param when set to all', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products?category=electronics']),
      });

      act(() => {
        result.current.setActiveCategory(CATEGORIES.ALL);
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe(CATEGORIES.ALL);
      });
    });

    it('preserves other URL params when changing category', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(['/products?other=param']),
      });

      act(() => {
        result.current.setActiveCategory('fashion');
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe('fashion');
      });
    });
  });

  describe('integration scenarios', () => {
    it('handles rapid filter changes', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      // Rapid changes
      act(() => {
        result.current.setActiveCategory('electronics');
        result.current.setActiveCategory('fashion');
        result.current.setActiveCategory('home');
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe('home');
      });
    });

    it('handles toggle between offers and category views', async () => {
      const { result } = renderHook(() => useFilter(), {
        wrapper: createWrapper(),
      });

      // Set category
      act(() => {
        result.current.setActiveCategory('electronics');
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe('electronics');
        expect(result.current.viewingOffers).toBe(false);
      });

      // Switch to offers
      act(() => {
        result.current.enableOffersView();
      });

      await waitFor(() => {
        expect(result.current.viewingOffers).toBe(true);
        expect(result.current.activeCategory).toBe(CATEGORIES.ALL);
      });

      // Back to category
      act(() => {
        result.current.setActiveCategory('fashion');
      });

      await waitFor(() => {
        expect(result.current.activeCategory).toBe('fashion');
        expect(result.current.viewingOffers).toBe(false);
      });
    });
  });
});
