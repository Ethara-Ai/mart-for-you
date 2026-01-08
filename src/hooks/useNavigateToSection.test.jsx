// useNavigateToSection hook tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigateToSection } from './useNavigateToSection';
import { ANIMATION } from '../constants';

// Mock navigate function
const mockNavigate = vi.fn();

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper wrapper
function Wrapper({ children }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('useNavigateToSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock window.scrollTo
    window.scrollTo = vi.fn();

    // Mock scrollIntoView on elements
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('hook initialization', () => {
    it('returns a function', () => {
      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      expect(typeof result.current).toBe('function');
    });

    it('returns stable function reference', () => {
      const { result, rerender } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      const firstRef = result.current;
      rerender();
      const secondRef = result.current;

      expect(firstRef).toBe(secondRef);
    });
  });

  describe('navigation', () => {
    it('calls navigate with the provided path', () => {
      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/home');
      });

      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    it('navigates to different paths', () => {
      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/products');
      });

      expect(mockNavigate).toHaveBeenCalledWith('/products');

      act(() => {
        result.current('/cart');
      });

      expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });

    it('handles paths with query parameters', () => {
      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/products?category=electronics');
      });

      expect(mockNavigate).toHaveBeenCalledWith('/products?category=electronics');
    });
  });

  describe('section scrolling', () => {
    it('scrolls to section by ID after navigation delay', () => {
      const mockElement = document.createElement('div');
      mockElement.scrollIntoView = vi.fn();
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/home', 'hero-section');
      });

      // Before timeout
      expect(mockElement.scrollIntoView).not.toHaveBeenCalled();

      // After timeout
      act(() => {
        vi.advanceTimersByTime(ANIMATION.NAVIGATION_SCROLL_DELAY);
      });

      expect(document.getElementById).toHaveBeenCalledWith('hero-section');
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('scrolls to top when section ID is not provided', () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null);

      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/home');
      });

      act(() => {
        vi.advanceTimersByTime(ANIMATION.NAVIGATION_SCROLL_DELAY);
      });

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('scrolls to top when section element is not found', () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null);

      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/home', 'non-existent-section');
      });

      act(() => {
        vi.advanceTimersByTime(ANIMATION.NAVIGATION_SCROLL_DELAY);
      });

      expect(document.getElementById).toHaveBeenCalledWith('non-existent-section');
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  describe('onBeforeNavigate callback', () => {
    it('executes callback before navigation', () => {
      const mockCallback = vi.fn();
      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/home', null, { onBeforeNavigate: mockCallback });
      });

      expect(mockCallback).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledBefore(mockNavigate);
    });

    it('does not throw if callback is not provided', () => {
      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      expect(() => {
        act(() => {
          result.current('/home', null, {});
        });
      }).not.toThrow();
    });

    it('does not execute if callback is not a function', () => {
      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      expect(() => {
        act(() => {
          result.current('/home', null, { onBeforeNavigate: 'not a function' });
        });
      }).not.toThrow();

      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe('scroll behavior option', () => {
    it('uses smooth scroll by default', () => {
      const mockElement = document.createElement('div');
      mockElement.scrollIntoView = vi.fn();
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/home', 'section');
      });

      act(() => {
        vi.advanceTimersByTime(ANIMATION.NAVIGATION_SCROLL_DELAY);
      });

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('uses custom scroll behavior when provided', () => {
      const mockElement = document.createElement('div');
      mockElement.scrollIntoView = vi.fn();
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/home', 'section', { behavior: 'auto' });
      });

      act(() => {
        vi.advanceTimersByTime(ANIMATION.NAVIGATION_SCROLL_DELAY);
      });

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'start',
      });
    });

    it('uses custom behavior for scrollTo fallback', () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null);

      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/home', null, { behavior: 'instant' });
      });

      act(() => {
        vi.advanceTimersByTime(ANIMATION.NAVIGATION_SCROLL_DELAY);
      });

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'instant',
      });
    });
  });

  describe('combined options', () => {
    it('handles all options together', () => {
      const mockCallback = vi.fn();
      const mockElement = document.createElement('div');
      mockElement.scrollIntoView = vi.fn();
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/products', 'products-section', {
          onBeforeNavigate: mockCallback,
          behavior: 'auto',
        });
      });

      // Callback should be called first
      expect(mockCallback).toHaveBeenCalled();

      // Navigation should occur
      expect(mockNavigate).toHaveBeenCalledWith('/products');

      // After delay, scroll should happen
      act(() => {
        vi.advanceTimersByTime(ANIMATION.NAVIGATION_SCROLL_DELAY);
      });

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'start',
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty path', () => {
      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('');
      });

      expect(mockNavigate).toHaveBeenCalledWith('');
    });

    it('handles empty options object', () => {
      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      expect(() => {
        act(() => {
          result.current('/home', 'section', {});
        });
      }).not.toThrow();
    });

    it('handles undefined options', () => {
      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      expect(() => {
        act(() => {
          result.current('/home', 'section', undefined);
        });
      }).not.toThrow();
    });

    it('handles null sectionId', () => {
      vi.spyOn(document, 'getElementById');

      const { result } = renderHook(() => useNavigateToSection(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current('/home', null);
      });

      act(() => {
        vi.advanceTimersByTime(ANIMATION.NAVIGATION_SCROLL_DELAY);
      });

      // Should not call getElementById with null
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });
});
