/**
 * Tests for useDebouncedSearch hook
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebouncedSearch } from './useDebouncedSearch';

describe('useDebouncedSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('returns all expected properties', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      expect(result.current).toHaveProperty('searchTerm');
      expect(result.current).toHaveProperty('debouncedTerm');
      expect(result.current).toHaveProperty('isSearching');
      expect(result.current).toHaveProperty('hasSearched');
      expect(result.current).toHaveProperty('isSearchActive');
      expect(result.current).toHaveProperty('meetsMinLength');
      expect(result.current).toHaveProperty('setSearchTerm');
      expect(result.current).toHaveProperty('clearSearch');
      expect(result.current).toHaveProperty('searchNow');
      expect(result.current).toHaveProperty('handleChange');
      expect(result.current).toHaveProperty('handleSubmit');
      expect(result.current).toHaveProperty('handleKeyDown');
      expect(result.current).toHaveProperty('inputProps');
    });

    it('initializes with empty search term by default', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      expect(result.current.searchTerm).toBe('');
      expect(result.current.debouncedTerm).toBe('');
    });

    it('initializes with custom initial value', () => {
      const { result } = renderHook(() =>
        useDebouncedSearch({ initialValue: 'test' })
      );

      expect(result.current.searchTerm).toBe('test');
      expect(result.current.debouncedTerm).toBe('test');
    });

    it('isSearching is false initially', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      expect(result.current.isSearching).toBe(false);
    });

    it('hasSearched is false initially', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      expect(result.current.hasSearched).toBe(false);
    });

    it('isSearchActive is false when search term is empty', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      expect(result.current.isSearchActive).toBe(false);
    });
  });

  describe('setSearchTerm', () => {
    it('updates searchTerm immediately', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      act(() => {
        result.current.setSearchTerm('hello');
      });

      expect(result.current.searchTerm).toBe('hello');
    });

    it('does not update debouncedTerm immediately', () => {
      const { result } = renderHook(() => useDebouncedSearch({ delay: 300 }));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      expect(result.current.debouncedTerm).toBe('');
    });

    it('updates debouncedTerm after delay', () => {
      const { result } = renderHook(() => useDebouncedSearch({ delay: 300 }));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.debouncedTerm).toBe('hello');
    });

    it('sets isSearching to true when typing', () => {
      const { result } = renderHook(() => useDebouncedSearch({ delay: 300 }));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      expect(result.current.isSearching).toBe(true);
    });

    it('sets isSearching to false after debounce completes', () => {
      const { result } = renderHook(() => useDebouncedSearch({ delay: 300 }));

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isSearching).toBe(false);
    });

    it('resets timer when search term changes during delay', () => {
      const { result } = renderHook(() => useDebouncedSearch({ delay: 300 }));

      act(() => {
        result.current.setSearchTerm('hel');
      });

      act(() => {
        vi.advanceTimersByTime(150);
      });

      act(() => {
        result.current.setSearchTerm('hello');
      });

      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Should still be empty because timer was reset
      expect(result.current.debouncedTerm).toBe('');

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(result.current.debouncedTerm).toBe('hello');
    });
  });

  describe('onSearch callback', () => {
    it('calls onSearch when debounced term is set', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      expect(onSearch).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onSearch).toHaveBeenCalledWith('test');
      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it('calls onSearch with trimmed value', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      act(() => {
        result.current.setSearchTerm('  test  ');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onSearch).toHaveBeenCalledWith('test');
    });

    it('does not call onSearch when term is below minLength', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch, minLength: 3 })
      );

      act(() => {
        result.current.setSearchTerm('ab');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onSearch).not.toHaveBeenCalled();
    });

    it('calls onSearch when term meets minLength', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch, minLength: 3 })
      );

      act(() => {
        result.current.setSearchTerm('abc');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onSearch).toHaveBeenCalledWith('abc');
    });

    it('sets hasSearched to true after first search', () => {
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch: vi.fn() })
      );

      expect(result.current.hasSearched).toBe(false);

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.hasSearched).toBe(true);
    });
  });

  describe('onClear callback', () => {
    it('calls onClear when search is cleared after searching', () => {
      const onClear = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch: vi.fn(), onClear })
      );

      // First, search for something
      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Then clear
      act(() => {
        result.current.clearSearch();
      });

      expect(onClear).toHaveBeenCalled();
    });
  });

  describe('clearSearch', () => {
    it('clears searchTerm', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchTerm).toBe('');
    });

    it('clears debouncedTerm', () => {
      const { result } = renderHook(() => useDebouncedSearch({ delay: 300 }));

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.debouncedTerm).toBe('');
    });

    it('sets isSearching to false', () => {
      const { result } = renderHook(() => useDebouncedSearch({ delay: 300 }));

      act(() => {
        result.current.setSearchTerm('test');
      });

      expect(result.current.isSearching).toBe(true);

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.isSearching).toBe(false);
    });

    it('sets hasSearched to false', () => {
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch: vi.fn() })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.hasSearched).toBe(true);

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.hasSearched).toBe(false);
    });

    it('cancels pending debounce', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        result.current.clearSearch();
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  describe('searchNow', () => {
    it('immediately triggers search', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        result.current.searchNow();
      });

      expect(onSearch).toHaveBeenCalledWith('test');
    });

    it('updates debouncedTerm immediately', () => {
      const { result } = renderHook(() => useDebouncedSearch({ delay: 300 }));

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        result.current.searchNow();
      });

      expect(result.current.debouncedTerm).toBe('test');
    });

    it('sets isSearching to false', () => {
      const { result } = renderHook(() => useDebouncedSearch({ delay: 300 }));

      act(() => {
        result.current.setSearchTerm('test');
      });

      expect(result.current.isSearching).toBe(true);

      act(() => {
        result.current.searchNow();
      });

      expect(result.current.isSearching).toBe(false);
    });

    it('cancels pending debounce timer', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        result.current.searchNow();
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Should only be called once (from searchNow, not timer)
      expect(onSearch).toHaveBeenCalledTimes(1);
    });

    it('respects minLength requirement', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch, minLength: 3 })
      );

      act(() => {
        result.current.setSearchTerm('ab');
      });

      act(() => {
        result.current.searchNow();
      });

      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  describe('handleChange', () => {
    it('handles event object with target.value', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      act(() => {
        result.current.handleChange({ target: { value: 'test' } });
      });

      expect(result.current.searchTerm).toBe('test');
    });

    it('handles string value directly', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      act(() => {
        result.current.handleChange('direct');
      });

      expect(result.current.searchTerm).toBe('direct');
    });

    it('converts non-string values to empty string', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      act(() => {
        result.current.handleChange(123);
      });

      expect(result.current.searchTerm).toBe('');
    });
  });

  describe('handleSubmit', () => {
    it('prevents default event behavior', () => {
      const preventDefault = vi.fn();
      const { result } = renderHook(() => useDebouncedSearch());

      act(() => {
        result.current.handleSubmit({ preventDefault });
      });

      expect(preventDefault).toHaveBeenCalled();
    });

    it('calls searchNow', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        result.current.handleSubmit({});
      });

      expect(onSearch).toHaveBeenCalledWith('test');
    });

    it('works without event argument', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        result.current.handleSubmit();
      });

      expect(onSearch).toHaveBeenCalledWith('test');
    });
  });

  describe('handleKeyDown', () => {
    it('triggers searchNow on Enter key', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        result.current.handleKeyDown({ key: 'Enter' });
      });

      expect(onSearch).toHaveBeenCalledWith('test');
    });

    it('triggers clearSearch on Escape key', () => {
      const onClear = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch: vi.fn(), onClear })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      act(() => {
        result.current.handleKeyDown({ key: 'Escape' });
      });

      expect(result.current.searchTerm).toBe('');
      expect(onClear).toHaveBeenCalled();
    });

    it('does nothing for other keys', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        result.current.handleKeyDown({ key: 'a' });
      });

      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  describe('inputProps', () => {
    it('provides value property', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      act(() => {
        result.current.setSearchTerm('test');
      });

      expect(result.current.inputProps.value).toBe('test');
    });

    it('provides onChange handler', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      act(() => {
        result.current.inputProps.onChange({ target: { value: 'new' } });
      });

      expect(result.current.searchTerm).toBe('new');
    });

    it('provides onKeyDown handler', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      act(() => {
        result.current.inputProps.onKeyDown({ key: 'Enter' });
      });

      expect(onSearch).toHaveBeenCalled();
    });
  });

  describe('isSearchActive', () => {
    it('is false when searchTerm is empty', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      expect(result.current.isSearchActive).toBe(false);
    });

    it('is false when searchTerm is only whitespace', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      act(() => {
        result.current.setSearchTerm('   ');
      });

      expect(result.current.isSearchActive).toBe(false);
    });

    it('is true when searchTerm has content', () => {
      const { result } = renderHook(() => useDebouncedSearch());

      act(() => {
        result.current.setSearchTerm('test');
      });

      expect(result.current.isSearchActive).toBe(true);
    });
  });

  describe('meetsMinLength', () => {
    it('is true when minLength is 0', () => {
      const { result } = renderHook(() =>
        useDebouncedSearch({ minLength: 0 })
      );

      expect(result.current.meetsMinLength).toBe(true);
    });

    it('is false when term length is below minLength', () => {
      const { result } = renderHook(() =>
        useDebouncedSearch({ minLength: 3 })
      );

      act(() => {
        result.current.setSearchTerm('ab');
      });

      expect(result.current.meetsMinLength).toBe(false);
    });

    it('is true when term length equals minLength', () => {
      const { result } = renderHook(() =>
        useDebouncedSearch({ minLength: 3 })
      );

      act(() => {
        result.current.setSearchTerm('abc');
      });

      expect(result.current.meetsMinLength).toBe(true);
    });

    it('is true when term length exceeds minLength', () => {
      const { result } = renderHook(() =>
        useDebouncedSearch({ minLength: 3 })
      );

      act(() => {
        result.current.setSearchTerm('abcdef');
      });

      expect(result.current.meetsMinLength).toBe(true);
    });

    it('trims whitespace when checking minLength', () => {
      const { result } = renderHook(() =>
        useDebouncedSearch({ minLength: 3 })
      );

      act(() => {
        result.current.setSearchTerm('  ab  ');
      });

      expect(result.current.meetsMinLength).toBe(false);
    });
  });

  describe('default delay', () => {
    it('uses default delay when not specified', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ onSearch })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      // Default is 300ms (ANIMATION.DEBOUNCE_DELAY)
      act(() => {
        vi.advanceTimersByTime(299);
      });

      expect(onSearch).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(onSearch).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('clears timer on unmount', () => {
      const onSearch = vi.fn();
      const { result, unmount } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      act(() => {
        result.current.setSearchTerm('test');
      });

      unmount();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('handles typical search flow', () => {
      const onSearch = vi.fn();
      const onClear = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({
          delay: 300,
          onSearch,
          onClear,
          minLength: 2,
        })
      );

      // User starts typing "react"
      act(() => {
        result.current.setSearchTerm('r');
      });

      expect(result.current.isSearching).toBe(true);
      expect(result.current.isSearchActive).toBe(true);
      expect(result.current.meetsMinLength).toBe(false);

      act(() => {
        result.current.setSearchTerm('re');
      });

      expect(result.current.meetsMinLength).toBe(true);

      act(() => {
        result.current.setSearchTerm('reac');
        result.current.setSearchTerm('react');
      });

      // Still searching (debouncing)
      expect(result.current.isSearching).toBe(true);
      expect(result.current.debouncedTerm).toBe('');

      // User stops typing
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isSearching).toBe(false);
      expect(result.current.debouncedTerm).toBe('react');
      expect(result.current.hasSearched).toBe(true);
      expect(onSearch).toHaveBeenCalledWith('react');

      // User clears search
      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchTerm).toBe('');
      expect(result.current.debouncedTerm).toBe('');
      expect(result.current.hasSearched).toBe(false);
      expect(onClear).toHaveBeenCalled();
    });

    it('handles form submission flow', () => {
      const onSearch = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedSearch({ delay: 300, onSearch })
      );

      // User types and immediately submits
      act(() => {
        result.current.setSearchTerm('quick search');
      });

      act(() => {
        result.current.handleSubmit({ preventDefault: vi.fn() });
      });

      // Should search immediately without waiting for debounce
      expect(onSearch).toHaveBeenCalledWith('quick search');
      expect(result.current.debouncedTerm).toBe('quick search');
    });
  });
});
