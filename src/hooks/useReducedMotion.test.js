// useReducedMotion hook tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  let mockMatchMedia;
  let mockMediaQueryList;
  let changeHandler;

  let changeHandlers;

  beforeEach(() => {
    changeHandlers = [];
    // Create mock MediaQueryList
    mockMediaQueryList = {
      matches: false,
      addEventListener: vi.fn((event, handler) => {
        changeHandler = handler;
        changeHandlers.push(handler);
      }),
      removeEventListener: vi.fn(),
      addListener: vi.fn((handler) => {
        changeHandler = handler;
        changeHandlers.push(handler);
      }),
      removeListener: vi.fn(),
    };

    // Mock window.matchMedia
    mockMatchMedia = vi.fn().mockReturnValue(mockMediaQueryList);
    window.matchMedia = mockMatchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('returns false when reduced motion is not preferred', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);
    });

    it('returns true when reduced motion is preferred', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(true);
    });

    it('queries the correct media feature', () => {
      renderHook(() => useReducedMotion());

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
  });

  describe('preference changes', () => {
    it('updates state when preference changes to true', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);

      // Simulate preference change
      act(() => {
        changeHandler({ matches: true });
      });

      expect(result.current).toBe(true);
    });

    it('updates state when preference changes to false', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(true);

      // Simulate preference change
      act(() => {
        changeHandler({ matches: false });
      });

      expect(result.current).toBe(false);
    });

    it('handles multiple preference changes', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);

      act(() => {
        changeHandler({ matches: true });
      });
      expect(result.current).toBe(true);

      act(() => {
        changeHandler({ matches: false });
      });
      expect(result.current).toBe(false);

      act(() => {
        changeHandler({ matches: true });
      });
      expect(result.current).toBe(true);
    });
  });

  describe('event listener management', () => {
    it('adds event listener on mount with modern API', () => {
      renderHook(() => useReducedMotion());

      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('removes event listener on unmount with modern API', () => {
      const { unmount } = renderHook(() => useReducedMotion());

      unmount();

      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('uses legacy API when addEventListener is not available', () => {
      mockMediaQueryList.addEventListener = undefined;
      mockMediaQueryList.removeEventListener = undefined;

      renderHook(() => useReducedMotion());

      expect(mockMediaQueryList.addListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('removes listener with legacy API on unmount', () => {
      mockMediaQueryList.addEventListener = undefined;
      mockMediaQueryList.removeEventListener = undefined;

      const { unmount } = renderHook(() => useReducedMotion());

      unmount();

      expect(mockMediaQueryList.removeListener).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('SSR safety', () => {
    it('hook initializer handles matchMedia correctly', () => {
      // The hook should use matchMedia on initialization
      const { result } = renderHook(() => useReducedMotion());

      // Should return a boolean value
      expect(typeof result.current).toBe('boolean');
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('handles matchMedia returning different values', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(true);
    });
  });

  describe('return value', () => {
    it('returns a boolean', () => {
      const { result } = renderHook(() => useReducedMotion());

      expect(typeof result.current).toBe('boolean');
    });

    it('returns consistent value on rerender without changes', () => {
      mockMediaQueryList.matches = false;

      const { result, rerender } = renderHook(() => useReducedMotion());

      const firstValue = result.current;
      rerender();
      const secondValue = result.current;

      expect(firstValue).toBe(secondValue);
      expect(result.current).toBe(false);
    });
  });

  describe('hook behavior', () => {
    it('does not cause unnecessary rerenders', () => {
      mockMediaQueryList.matches = false;
      let renderCount = 0;

      const { rerender } = renderHook(() => {
        renderCount++;
        return useReducedMotion();
      });

      expect(renderCount).toBe(1);

      // Rerender without state change
      rerender();
      expect(renderCount).toBe(2);

      // State change should cause additional render
      act(() => {
        changeHandler({ matches: true });
      });
      expect(renderCount).toBe(3);
    });

    it('can be used in multiple components simultaneously', () => {
      mockMediaQueryList.matches = false;

      const { result: result1 } = renderHook(() => useReducedMotion());
      const { result: result2 } = renderHook(() => useReducedMotion());

      expect(result1.current).toBe(false);
      expect(result2.current).toBe(false);

      // Both should update when preference changes
      // Trigger all registered handlers to simulate browser behavior
      act(() => {
        changeHandlers.forEach((handler) => handler({ matches: true }));
      });

      expect(result1.current).toBe(true);
      expect(result2.current).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles null matchMedia result', () => {
      window.matchMedia = vi.fn().mockReturnValue(null);

      expect(() => {
        renderHook(() => useReducedMotion());
      }).not.toThrow();
    });

    it('handles matchMedia returning undefined matches', () => {
      mockMediaQueryList.matches = undefined;

      const { result } = renderHook(() => useReducedMotion());

      // Should default to false for undefined
      expect(result.current).toBe(false);
    });
  });
});
