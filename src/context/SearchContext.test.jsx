// SearchContext tests
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SearchProvider } from './SearchContext';
import { useSearch } from './index';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

// Helper wrapper for testing
const createWrapper = (initialEntries = ['/']) =>
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <SearchProvider>{children}</SearchProvider>
      </MemoryRouter>
    );
  };

describe('SearchContext', () => {
  describe('useSearch hook', () => {
    it('throws error when used outside SearchProvider', () => {
      // Suppress console error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useSearch(), {
          wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
        });
      }).toThrow('useSearch must be used within a SearchProvider');

      consoleSpy.mockRestore();
    });

    it('provides search context when used within SearchProvider', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('searchTerm');
      expect(result.current).toHaveProperty('setSearchTerm');
      expect(result.current).toHaveProperty('onSearchSubmit');
      expect(result.current).toHaveProperty('clearSearch');
      expect(result.current).toHaveProperty('isSearchActive');
    });
  });

  describe('searchTerm', () => {
    it('initializes with empty string', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      expect(result.current.searchTerm).toBe('');
    });

    it('updates when setSearchTerm is called', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('test query');
      });

      expect(result.current.searchTerm).toBe('test query');
    });

    it('handles empty string update', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('initial');
      });

      act(() => {
        result.current.setSearchTerm('');
      });

      expect(result.current.searchTerm).toBe('');
    });

    it('handles special characters in search term', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('test@#$%');
      });

      expect(result.current.searchTerm).toBe('test@#$%');
    });

    it('handles unicode characters', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('日本語テスト');
      });

      expect(result.current.searchTerm).toBe('日本語テスト');
    });
  });

  describe('clearSearch', () => {
    it('clears the search term', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('test query');
      });

      expect(result.current.searchTerm).toBe('test query');

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchTerm).toBe('');
    });

    it('works when search term is already empty', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      expect(result.current.searchTerm).toBe('');

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchTerm).toBe('');
    });
  });

  describe('isSearchActive', () => {
    it('returns false when search term is empty', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSearchActive).toBe(false);
    });

    it('returns false when search term is only whitespace', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('   ');
      });

      expect(result.current.isSearchActive).toBe(false);
    });

    it('returns true when search term has content', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('test');
      });

      expect(result.current.isSearchActive).toBe(true);
    });

    it('returns true when search term has content with leading/trailing spaces', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('  test  ');
      });

      expect(result.current.isSearchActive).toBe(true);
    });

    it('becomes false after clearSearch', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('test');
      });

      expect(result.current.isSearchActive).toBe(true);

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.isSearchActive).toBe(false);
    });
  });

  describe('onSearchSubmit', () => {
    it('is a function', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.onSearchSubmit).toBe('function');
    });

    it('can be called without throwing', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/home']),
      });

      expect(() => {
        act(() => {
          result.current.onSearchSubmit();
        });
      }).not.toThrow();
    });

    it('can be called from products page', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/products']),
      });

      expect(() => {
        act(() => {
          result.current.onSearchSubmit();
        });
      }).not.toThrow();
    });
  });

  describe('context value stability', () => {
    it('setSearchTerm function is stable', () => {
      const { result, rerender } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      const setSearchTerm1 = result.current.setSearchTerm;

      rerender();

      const setSearchTerm2 = result.current.setSearchTerm;

      expect(setSearchTerm1).toBe(setSearchTerm2);
    });

    it('clearSearch function is stable', () => {
      const { result, rerender } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      const clearSearch1 = result.current.clearSearch;

      rerender();

      const clearSearch2 = result.current.clearSearch;

      expect(clearSearch1).toBe(clearSearch2);
    });

    it('onSearchSubmit function is stable when pathname unchanged', () => {
      const { result, rerender } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/home']),
      });

      const onSearchSubmit1 = result.current.onSearchSubmit;

      rerender();

      const onSearchSubmit2 = result.current.onSearchSubmit;

      expect(onSearchSubmit1).toBe(onSearchSubmit2);
    });
  });

  describe('multiple updates', () => {
    it('handles rapid updates correctly', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('a');
        result.current.setSearchTerm('ab');
        result.current.setSearchTerm('abc');
      });

      expect(result.current.searchTerm).toBe('abc');
    });

    it('maintains correct state after clear and set', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('first');
      });

      act(() => {
        result.current.clearSearch();
      });

      act(() => {
        result.current.setSearchTerm('second');
      });

      expect(result.current.searchTerm).toBe('second');
    });
  });

  describe('edge cases', () => {
    it('handles very long search terms', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      const longTerm = 'a'.repeat(1000);

      act(() => {
        result.current.setSearchTerm(longTerm);
      });

      expect(result.current.searchTerm).toBe(longTerm);
    });

    it('handles newline characters', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('line1\nline2');
      });

      expect(result.current.searchTerm).toBe('line1\nline2');
    });

    it('handles tab characters', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSearchTerm('col1\tcol2');
      });

      expect(result.current.searchTerm).toBe('col1\tcol2');
    });
  });
});
