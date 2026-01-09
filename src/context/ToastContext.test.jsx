// ToastContext tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext';
import { ThemeProvider } from './ThemeContext';

// Wrapper component with necessary providers
const wrapper = ({ children }) => (
  <ThemeProvider>
    <ToastProvider>{children}</ToastProvider>
  </ThemeProvider>
);

describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useToast hook', () => {
    it('throws error when used outside ToastProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useToast());
      }).toThrow('useToast must be used within a ToastProvider');

      consoleSpy.mockRestore();
    });

    it('provides toast context when used within ToastProvider', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('toasts');
      expect(result.current).toHaveProperty('addToast');
      expect(result.current).toHaveProperty('removeToast');
      expect(result.current).toHaveProperty('clearToasts');
      expect(result.current).toHaveProperty('showSuccess');
      expect(result.current).toHaveProperty('showError');
      expect(result.current).toHaveProperty('showInfo');
    });
  });

  describe('initial state', () => {
    it('has empty toasts array by default', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(result.current.toasts).toEqual([]);
    });

    it('toasts is an array', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(Array.isArray(result.current.toasts)).toBe(true);
    });
  });

  describe('addToast', () => {
    it('adds a toast with default success type', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('Test message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Test message');
      expect(result.current.toasts[0].type).toBe('success');
    });

    it('adds a toast with specified type', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('Error message', 'error');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Error message');
      expect(result.current.toasts[0].type).toBe('error');
    });

    it('adds a toast with info type', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('Info message', 'info');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Info message');
      expect(result.current.toasts[0].type).toBe('info');
    });

    it('generates unique id for each toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('Message 1');
        result.current.addToast('Message 2');
        result.current.addToast('Message 3');
      });

      const ids = result.current.toasts.map((toast) => toast.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
    });

    it('returns the toast id', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let toastId;
      act(() => {
        toastId = result.current.addToast('Test message');
      });

      expect(toastId).toBeDefined();
      expect(typeof toastId).toBe('string');
      expect(result.current.toasts[0].id).toBe(toastId);
    });

    it('adds multiple toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('First toast');
        result.current.addToast('Second toast', 'error');
        result.current.addToast('Third toast', 'info');
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts[0].message).toBe('First toast');
      expect(result.current.toasts[1].message).toBe('Second toast');
      expect(result.current.toasts[2].message).toBe('Third toast');
    });

    it('handles empty message', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('');
    });

    it('handles special characters in message', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      const specialMessage = '<script>alert("XSS")</script> & "quotes" \'apostrophe\'';
      act(() => {
        result.current.addToast(specialMessage);
      });

      expect(result.current.toasts[0].message).toBe(specialMessage);
    });

    it('handles long messages', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      const longMessage = 'A'.repeat(1000);
      act(() => {
        result.current.addToast(longMessage);
      });

      expect(result.current.toasts[0].message).toBe(longMessage);
      expect(result.current.toasts[0].message.length).toBe(1000);
    });

    it('handles unicode characters', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      const unicodeMessage = '🎉 Success! こんにちは 你好 مرحبا';
      act(() => {
        result.current.addToast(unicodeMessage);
      });

      expect(result.current.toasts[0].message).toBe(unicodeMessage);
    });
  });

  describe('removeToast', () => {
    it('removes a toast by id', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let toastId;
      act(() => {
        toastId = result.current.addToast('Test message');
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.removeToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('removes only the specified toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let _firstId, secondId, _thirdId;
      act(() => {
        _firstId = result.current.addToast('First');
        secondId = result.current.addToast('Second');
        _thirdId = result.current.addToast('Third');
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.removeToast(secondId);
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0].message).toBe('First');
      expect(result.current.toasts[1].message).toBe('Third');
    });

    it('does nothing when removing non-existent id', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('Test message');
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.removeToast('non-existent-id');
      });

      expect(result.current.toasts).toHaveLength(1);
    });

    it('handles removing from empty toasts array', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(result.current.toasts).toHaveLength(0);

      act(() => {
        result.current.removeToast('any-id');
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('removes the first toast when there are duplicates', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      const ids = [];
      act(() => {
        ids.push(result.current.addToast('Same message'));
        ids.push(result.current.addToast('Same message'));
        ids.push(result.current.addToast('Same message'));
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.removeToast(ids[0]);
      });

      expect(result.current.toasts).toHaveLength(2);
    });
  });

  describe('clearToasts', () => {
    it('removes all toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('First');
        result.current.addToast('Second');
        result.current.addToast('Third');
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.clearToasts();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('handles clearing empty toasts array', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      expect(result.current.toasts).toHaveLength(0);

      act(() => {
        result.current.clearToasts();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('allows adding new toasts after clearing', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('First batch');
      });

      act(() => {
        result.current.clearToasts();
      });

      act(() => {
        result.current.addToast('Second batch');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Second batch');
    });
  });

  describe('showSuccess', () => {
    it('adds a success toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.showSuccess('Success message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Success message');
      expect(result.current.toasts[0].type).toBe('success');
    });

    it('returns the toast id', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let toastId;
      act(() => {
        toastId = result.current.showSuccess('Success');
      });

      expect(toastId).toBeDefined();
      expect(result.current.toasts[0].id).toBe(toastId);
    });

    it('adds multiple success toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.showSuccess('Success 1');
        result.current.showSuccess('Success 2');
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts.every((t) => t.type === 'success')).toBe(true);
    });
  });

  describe('showError', () => {
    it('adds an error toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.showError('Error message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Error message');
      expect(result.current.toasts[0].type).toBe('error');
    });

    it('returns the toast id', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let toastId;
      act(() => {
        toastId = result.current.showError('Error');
      });

      expect(toastId).toBeDefined();
      expect(result.current.toasts[0].id).toBe(toastId);
    });

    it('adds multiple error toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.showError('Error 1');
        result.current.showError('Error 2');
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts.every((t) => t.type === 'error')).toBe(true);
    });
  });

  describe('showInfo', () => {
    it('adds an info toast', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.showInfo('Info message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('Info message');
      expect(result.current.toasts[0].type).toBe('info');
    });

    it('returns the toast id', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let toastId;
      act(() => {
        toastId = result.current.showInfo('Info');
      });

      expect(toastId).toBeDefined();
      expect(result.current.toasts[0].id).toBe(toastId);
    });

    it('adds multiple info toasts', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.showInfo('Info 1');
        result.current.showInfo('Info 2');
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts.every((t) => t.type === 'info')).toBe(true);
    });
  });

  describe('toast structure', () => {
    it('toast has id, message, and type properties', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('Test', 'success');
      });

      const toast = result.current.toasts[0];
      expect(toast).toHaveProperty('id');
      expect(toast).toHaveProperty('message');
      expect(toast).toHaveProperty('type');
    });

    it('toast id is a string', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('Test');
      });

      expect(typeof result.current.toasts[0].id).toBe('string');
    });

    it('toast id has expected format (toast-timestamp-random)', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('Test');
      });

      const { id } = result.current.toasts[0];
      // Format is: toast-timestamp-randomstring (e.g., "toast-1234567890123-abc123def")
      expect(id).toMatch(/^toast-[0-9]+-[a-z0-9]+$/);
    });
  });

  describe('mixed toast types', () => {
    it('handles multiple toast types simultaneously', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.showSuccess('Success toast');
        result.current.showError('Error toast');
        result.current.showInfo('Info toast');
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[1].type).toBe('error');
      expect(result.current.toasts[2].type).toBe('info');
    });

    it('maintains correct order with mixed methods', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('First', 'success');
        result.current.showError('Second');
        result.current.addToast('Third', 'info');
        result.current.showSuccess('Fourth');
      });

      expect(result.current.toasts).toHaveLength(4);
      expect(result.current.toasts[0].message).toBe('First');
      expect(result.current.toasts[1].message).toBe('Second');
      expect(result.current.toasts[2].message).toBe('Third');
      expect(result.current.toasts[3].message).toBe('Fourth');
    });
  });

  describe('complex operations', () => {
    it('handles add, remove, and clear in sequence', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      // Add toasts
      let firstId;
      act(() => {
        firstId = result.current.addToast('First');
        result.current.addToast('Second');
        result.current.addToast('Third');
      });

      expect(result.current.toasts).toHaveLength(3);

      // Remove one
      act(() => {
        result.current.removeToast(firstId);
      });

      expect(result.current.toasts).toHaveLength(2);

      // Add more
      act(() => {
        result.current.addToast('Fourth');
      });

      expect(result.current.toasts).toHaveLength(3);

      // Clear all
      act(() => {
        result.current.clearToasts();
      });

      expect(result.current.toasts).toHaveLength(0);

      // Add after clear
      act(() => {
        result.current.addToast('New toast');
      });

      expect(result.current.toasts).toHaveLength(1);
    });

    it('handles rapid toast additions (limited by maxToasts)', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      // Add 50 toasts (but only 5 will be kept due to maxToasts default limit)
      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.addToast(`Toast ${i}`);
        }
      });

      // Default maxToasts is 5
      expect(result.current.toasts).toHaveLength(5);
      // Should keep the most recent toasts
      expect(result.current.toasts[0].message).toBe('Toast 45');
      expect(result.current.toasts[4].message).toBe('Toast 49');
    });

    it('handles rapid toast removals', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      const ids = [];
      act(() => {
        // Add 5 toasts (maxToasts limit)
        for (let i = 0; i < 5; i++) {
          ids.push(result.current.addToast(`Toast ${i}`));
        }
      });

      expect(result.current.toasts).toHaveLength(5);

      act(() => {
        ids.forEach((id) => result.current.removeToast(id));
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe('context function types', () => {
    it('addToast is a function', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      expect(typeof result.current.addToast).toBe('function');
    });

    it('removeToast is a function', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      expect(typeof result.current.removeToast).toBe('function');
    });

    it('clearToasts is a function', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      expect(typeof result.current.clearToasts).toBe('function');
    });

    it('showSuccess is a function', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      expect(typeof result.current.showSuccess).toBe('function');
    });

    it('showError is a function', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      expect(typeof result.current.showError).toBe('function');
    });

    it('showInfo is a function', () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      expect(typeof result.current.showInfo).toBe('function');
    });
  });

  describe('custom toast types', () => {
    it('accepts custom type values', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('Custom type', 'warning');
      });

      expect(result.current.toasts[0].type).toBe('warning');
    });

    it('accepts any string as type', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('Test', 'custom-type');
      });

      expect(result.current.toasts[0].type).toBe('custom-type');
    });
  });

  describe('immutability', () => {
    it('does not mutate existing toasts array on add', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      act(() => {
        result.current.addToast('First');
      });

      const firstArray = result.current.toasts;

      act(() => {
        result.current.addToast('Second');
      });

      // Arrays should be different references
      expect(result.current.toasts).not.toBe(firstArray);
    });

    it('does not mutate existing toasts array on remove', () => {
      const { result } = renderHook(() => useToast(), { wrapper });

      let id;
      act(() => {
        id = result.current.addToast('First');
        result.current.addToast('Second');
      });

      const beforeRemove = result.current.toasts;

      act(() => {
        result.current.removeToast(id);
      });

      expect(result.current.toasts).not.toBe(beforeRemove);
    });
  });
});
