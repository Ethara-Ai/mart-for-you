/**
 * Tests for useDebouncedValue hooks
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebouncedValue, useDebouncedCallback, useDebouncedState } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic functionality', () => {
    it('returns initial value immediately', () => {
      const { result } = renderHook(() => useDebouncedValue('initial', 300));

      expect(result.current).toBe('initial');
    });

    it('does not update immediately when value changes', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      expect(result.current).toBe('initial');
    });

    it('updates value after delay', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe('updated');
    });

    it('resets timer when value changes during delay', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'first' });

      act(() => {
        vi.advanceTimersByTime(150);
      });

      rerender({ value: 'second' });

      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Still should be 'initial' because timer reset
      expect(result.current).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Now should be 'second'
      expect(result.current).toBe('second');
    });

    it('uses only the latest value when rapidly changing', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'first' });
      rerender({ value: 'second' });
      rerender({ value: 'third' });
      rerender({ value: 'final' });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe('final');
    });
  });

  describe('different value types', () => {
    it('handles string values', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
        initialProps: { value: 'hello' },
      });

      rerender({ value: 'world' });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current).toBe('world');
    });

    it('handles number values', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
        initialProps: { value: 0 },
      });

      rerender({ value: 42 });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current).toBe(42);
    });

    it('handles object values', () => {
      const initialObj = { name: 'John' };
      const updatedObj = { name: 'Jane' };

      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
        initialProps: { value: initialObj },
      });

      rerender({ value: updatedObj });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current).toEqual(updatedObj);
    });

    it('handles array values', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
        initialProps: { value: [1, 2] },
      });

      rerender({ value: [1, 2, 3] });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current).toEqual([1, 2, 3]);
    });

    it('handles boolean values', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
        initialProps: { value: false },
      });

      rerender({ value: true });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current).toBe(true);
    });

    it('handles null values', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: null });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current).toBe(null);
    });

    it('handles undefined values', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: undefined });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current).toBe(undefined);
    });
  });

  describe('delay parameter', () => {
    it('uses default delay when not specified', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      // Default is 300ms (ANIMATION.DEBOUNCE_DELAY)
      act(() => {
        vi.advanceTimersByTime(299);
      });

      expect(result.current).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(result.current).toBe('updated');
    });

    it('respects custom delay', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(result.current).toBe('updated');
    });

    it('handles zero delay', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 0), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current).toBe('updated');
    });

    it('handles very long delay', () => {
      const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 10000), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        vi.advanceTimersByTime(9999);
      });

      expect(result.current).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(result.current).toBe('updated');
    });
  });

  describe('cleanup', () => {
    it('clears timer on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('does not update after unmount', () => {
      const { result, unmount, rerender } = renderHook(
        ({ value }) => useDebouncedValue(value, 300),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });

      unmount();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Result should still be 'initial' (no update after unmount)
      expect(result.current).toBe('initial');
    });
  });
});

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic functionality', () => {
    it('returns an object with callback, cancel, and flush', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(fn, 300));

      expect(result.current).toHaveProperty('callback');
      expect(result.current).toHaveProperty('cancel');
      expect(result.current).toHaveProperty('flush');
      expect(typeof result.current.callback).toBe('function');
      expect(typeof result.current.cancel).toBe('function');
      expect(typeof result.current.flush).toBe('function');
    });

    it('debounces callback execution', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(fn, 300));

      act(() => {
        result.current.callback();
      });

      expect(fn).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('only executes once for rapid calls', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(fn, 300));

      act(() => {
        result.current.callback();
        result.current.callback();
        result.current.callback();
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('passes arguments to the callback', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(fn, 300));

      act(() => {
        result.current.callback('arg1', 'arg2', 123);
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });

    it('uses latest arguments', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(fn, 300));

      act(() => {
        result.current.callback('first');
        result.current.callback('second');
        result.current.callback('third');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(fn).toHaveBeenCalledWith('third');
    });
  });

  describe('cancel method', () => {
    it('prevents callback execution', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(fn, 300));

      act(() => {
        result.current.callback();
      });

      act(() => {
        result.current.cancel();
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('can be called multiple times safely', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(fn, 300));

      act(() => {
        result.current.callback();
        result.current.cancel();
        result.current.cancel();
        result.current.cancel();
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('allows new calls after cancel', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(fn, 300));

      act(() => {
        result.current.callback('first');
        result.current.cancel();
        result.current.callback('second');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(fn).toHaveBeenCalledWith('second');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('flush method', () => {
    it('immediately executes pending callback', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(fn, 300));

      act(() => {
        result.current.callback('test');
      });

      expect(fn).not.toHaveBeenCalled();

      act(() => {
        result.current.flush();
      });

      expect(fn).toHaveBeenCalledWith('test');
    });

    it('does nothing when no pending call', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(fn, 300));

      act(() => {
        result.current.flush();
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('prevents subsequent timer-based execution', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(fn, 300));

      act(() => {
        result.current.callback();
        result.current.flush();
      });

      expect(fn).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('callback updates', () => {
    it('uses the latest callback reference', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();

      const { result, rerender } = renderHook(({ fn }) => useDebouncedCallback(fn, 300), {
        initialProps: { fn: fn1 },
      });

      act(() => {
        result.current.callback();
      });

      rerender({ fn: fn2 });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(fn1).not.toHaveBeenCalled();
      expect(fn2).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('clears timer on unmount', () => {
      const fn = vi.fn();
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { result, unmount } = renderHook(() => useDebouncedCallback(fn, 300));

      act(() => {
        result.current.callback();
      });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});

describe('useDebouncedState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic functionality', () => {
    it('returns array with immediate value, debounced value, and setter', () => {
      const { result } = renderHook(() => useDebouncedState('initial', 300));

      expect(Array.isArray(result.current)).toBe(true);
      expect(result.current).toHaveLength(3);
      expect(result.current[0]).toBe('initial'); // immediate value
      expect(result.current[1]).toBe('initial'); // debounced value
      expect(typeof result.current[2]).toBe('function'); // setter
    });

    it('immediate value updates synchronously', () => {
      const { result } = renderHook(() => useDebouncedState('initial', 300));

      act(() => {
        result.current[2]('updated');
      });

      expect(result.current[0]).toBe('updated');
    });

    it('debounced value updates after delay', () => {
      const { result } = renderHook(() => useDebouncedState('initial', 300));

      act(() => {
        result.current[2]('updated');
      });

      expect(result.current[1]).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current[1]).toBe('updated');
    });
  });

  describe('typing simulation', () => {
    it('handles search input pattern', () => {
      const { result } = renderHook(() => useDebouncedState('', 300));

      // Simulate typing "hello"
      act(() => {
        result.current[2]('h');
      });

      expect(result.current[0]).toBe('h');
      expect(result.current[1]).toBe('');

      act(() => {
        result.current[2]('he');
        result.current[2]('hel');
        result.current[2]('hell');
        result.current[2]('hello');
      });

      expect(result.current[0]).toBe('hello');
      expect(result.current[1]).toBe('');

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current[0]).toBe('hello');
      expect(result.current[1]).toBe('hello');
    });
  });

  describe('different initial values', () => {
    it('handles empty string initial value', () => {
      const { result } = renderHook(() => useDebouncedState('', 100));

      expect(result.current[0]).toBe('');
      expect(result.current[1]).toBe('');
    });

    it('handles number initial value', () => {
      const { result } = renderHook(() => useDebouncedState(0, 100));

      expect(result.current[0]).toBe(0);
      expect(result.current[1]).toBe(0);

      act(() => {
        result.current[2](42);
      });

      expect(result.current[0]).toBe(42);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current[1]).toBe(42);
    });

    it('handles object initial value', () => {
      const initial = { query: '', filters: [] };
      const { result } = renderHook(() => useDebouncedState(initial, 100));

      expect(result.current[0]).toEqual(initial);

      const updated = { query: 'test', filters: ['a'] };
      act(() => {
        result.current[2](updated);
      });

      expect(result.current[0]).toEqual(updated);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current[1]).toEqual(updated);
    });
  });

  describe('delay handling', () => {
    it('uses default delay', () => {
      const { result } = renderHook(() => useDebouncedState('initial'));

      act(() => {
        result.current[2]('updated');
      });

      // Default is 300ms
      act(() => {
        vi.advanceTimersByTime(299);
      });

      expect(result.current[1]).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(result.current[1]).toBe('updated');
    });

    it('respects custom delay', () => {
      const { result } = renderHook(() => useDebouncedState('initial', 1000));

      act(() => {
        result.current[2]('updated');
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current[1]).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current[1]).toBe('updated');
    });
  });
});

describe('integration tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('useDebouncedValue works with search input scenario', () => {
    const searchResults = vi.fn();

    const { result, rerender } = renderHook(
      ({ searchTerm }) => {
        const debouncedTerm = useDebouncedValue(searchTerm, 300);

        // Simulate effect that searches when debouncedTerm changes
        if (debouncedTerm) {
          searchResults(debouncedTerm);
        }

        return debouncedTerm;
      },
      { initialProps: { searchTerm: '' } }
    );

    // User starts typing
    rerender({ searchTerm: 'r' });
    rerender({ searchTerm: 're' });
    rerender({ searchTerm: 'rea' });
    rerender({ searchTerm: 'reac' });
    rerender({ searchTerm: 'react' });

    // No search should have happened yet
    expect(searchResults).not.toHaveBeenCalled();

    // User stops typing, wait for debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now search should happen with final value
    expect(result.current).toBe('react');
    expect(searchResults).toHaveBeenCalledWith('react');
    expect(searchResults).toHaveBeenCalledTimes(1);
  });

  it('multiple debounced values can be used independently', () => {
    const { result } = renderHook(() => {
      const value1 = useDebouncedValue('a', 100);
      const value2 = useDebouncedValue('x', 200);
      return { value1, value2 };
    });

    expect(result.current.value1).toBe('a');
    expect(result.current.value2).toBe('x');
  });
});
