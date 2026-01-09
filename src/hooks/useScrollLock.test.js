// useScrollLock hook tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollLock } from './useScrollLock';

describe('useScrollLock', () => {
  let originalScrollY;
  let originalInnerWidth;
  let _originalClientWidth;
  let _originalBodyStyle;
  let _originalHtmlStyle;

  beforeEach(() => {
    // Store original values
    originalScrollY = window.scrollY;
    originalInnerWidth = window.innerWidth;
    _originalClientWidth = document.documentElement.clientWidth;
    _originalBodyStyle = { ...document.body.style };
    _originalHtmlStyle = { ...document.documentElement.style };

    // Mock window properties
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 100,
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });

    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 1007, // Simulates 17px scrollbar
    });

    // Mock window.scrollTo
    window.scrollTo = vi.fn();

    // Reset styles
    document.body.style.cssText = '';
    document.documentElement.style.cssText = '';
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: originalScrollY,
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth,
    });

    // Reset styles
    document.body.style.cssText = '';
    document.documentElement.style.cssText = '';

    vi.restoreAllMocks();
  });

  describe('when isLocked is false', () => {
    it('does not modify body styles', () => {
      renderHook(() => useScrollLock(false));

      expect(document.body.style.position).toBe('');
      expect(document.body.style.overflow).toBe('');
    });

    it('does not modify html styles', () => {
      renderHook(() => useScrollLock(false));

      expect(document.documentElement.style.overflow).toBe('');
      expect(document.documentElement.style.height).toBe('');
    });

    it('does not call scrollTo', () => {
      renderHook(() => useScrollLock(false));

      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('when isLocked is true', () => {
    it('sets body position to fixed', () => {
      renderHook(() => useScrollLock(true));

      expect(document.body.style.position).toBe('fixed');
    });

    it('sets body overflow to hidden', () => {
      renderHook(() => useScrollLock(true));

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('sets html overflow to hidden', () => {
      renderHook(() => useScrollLock(true));

      expect(document.documentElement.style.overflow).toBe('hidden');
    });

    it('sets html height to 100%', () => {
      renderHook(() => useScrollLock(true));

      expect(document.documentElement.style.height).toBe('100%');
    });

    it('sets body top to negative scroll position', () => {
      renderHook(() => useScrollLock(true));

      expect(document.body.style.top).toBe('-100px');
    });

    it('sets body left to 0', () => {
      renderHook(() => useScrollLock(true));

      expect(document.body.style.left).toBe('0px');
    });

    it('sets body right to 0', () => {
      renderHook(() => useScrollLock(true));

      expect(document.body.style.right).toBe('0px');
    });

    it('sets body bottom to 0', () => {
      renderHook(() => useScrollLock(true));

      expect(document.body.style.bottom).toBe('0px');
    });

    it('sets padding-right to scrollbar width', () => {
      renderHook(() => useScrollLock(true));

      // scrollbarWidth = innerWidth (1024) - clientWidth (1007) = 17
      expect(document.body.style.paddingRight).toBe('17px');
    });
  });

  describe('cleanup on unlock', () => {
    it('resets body position', () => {
      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: true },
      });

      expect(document.body.style.position).toBe('fixed');

      rerender({ locked: false });

      expect(document.body.style.position).toBe('');
    });

    it('resets body overflow', () => {
      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: true },
      });

      expect(document.body.style.overflow).toBe('hidden');

      rerender({ locked: false });

      expect(document.body.style.overflow).toBe('');
    });

    it('resets html overflow', () => {
      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: true },
      });

      expect(document.documentElement.style.overflow).toBe('hidden');

      rerender({ locked: false });

      expect(document.documentElement.style.overflow).toBe('');
    });

    it('resets html height', () => {
      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: true },
      });

      expect(document.documentElement.style.height).toBe('100%');

      rerender({ locked: false });

      expect(document.documentElement.style.height).toBe('');
    });

    it('resets body top', () => {
      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: true },
      });

      rerender({ locked: false });

      expect(document.body.style.top).toBe('');
    });

    it('resets body padding-right', () => {
      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: true },
      });

      rerender({ locked: false });

      expect(document.body.style.paddingRight).toBe('');
    });

    it('restores scroll position', () => {
      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: true },
      });

      rerender({ locked: false });

      expect(window.scrollTo).toHaveBeenCalledWith(0, 100);
    });
  });

  describe('cleanup on unmount', () => {
    it('resets all styles when unmounted while locked', () => {
      const { unmount } = renderHook(() => useScrollLock(true));

      expect(document.body.style.position).toBe('fixed');

      unmount();

      expect(document.body.style.position).toBe('');
      expect(document.body.style.overflow).toBe('');
      expect(document.documentElement.style.overflow).toBe('');
    });

    it('restores scroll position on unmount', () => {
      const { unmount } = renderHook(() => useScrollLock(true));

      unmount();

      expect(window.scrollTo).toHaveBeenCalledWith(0, 100);
    });
  });

  describe('scroll position preservation', () => {
    it('preserves different scroll positions', () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        value: 500,
      });

      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: true },
      });

      expect(document.body.style.top).toBe('-500px');

      rerender({ locked: false });

      expect(window.scrollTo).toHaveBeenCalledWith(0, 500);
    });

    it('handles zero scroll position', () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        value: 0,
      });

      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: true },
      });

      expect(document.body.style.top).toBe('0px');

      rerender({ locked: false });

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('scrollbar width calculation', () => {
    it('handles zero scrollbar width', () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        writable: true,
        configurable: true,
        value: 1024, // Same as innerWidth, no scrollbar
      });

      renderHook(() => useScrollLock(true));

      expect(document.body.style.paddingRight).toBe('0px');
    });

    it('handles different scrollbar widths', () => {
      Object.defineProperty(document.documentElement, 'clientWidth', {
        writable: true,
        configurable: true,
        value: 1009, // 15px scrollbar
      });

      renderHook(() => useScrollLock(true));

      expect(document.body.style.paddingRight).toBe('15px');
    });
  });

  describe('multiple lock/unlock cycles', () => {
    it('handles multiple lock/unlock cycles correctly', () => {
      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: false },
      });

      // First lock
      rerender({ locked: true });
      expect(document.body.style.position).toBe('fixed');

      // First unlock
      rerender({ locked: false });
      expect(document.body.style.position).toBe('');
      expect(window.scrollTo).toHaveBeenCalledTimes(1);

      // Second lock
      rerender({ locked: true });
      expect(document.body.style.position).toBe('fixed');

      // Second unlock
      rerender({ locked: false });
      expect(document.body.style.position).toBe('');
      expect(window.scrollTo).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('handles rapid toggling', () => {
      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: false },
      });

      for (let i = 0; i < 5; i++) {
        rerender({ locked: true });
        rerender({ locked: false });
      }

      expect(document.body.style.position).toBe('');
      expect(window.scrollTo).toHaveBeenCalledTimes(5);
    });

    it('handles staying locked', () => {
      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: true },
      });

      // Re-render with same value
      rerender({ locked: true });
      rerender({ locked: true });

      expect(document.body.style.position).toBe('fixed');
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('handles staying unlocked', () => {
      const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
        initialProps: { locked: false },
      });

      // Re-render with same value
      rerender({ locked: false });
      rerender({ locked: false });

      expect(document.body.style.position).toBe('');
      expect(window.scrollTo).not.toHaveBeenCalled();
    });
  });
});
