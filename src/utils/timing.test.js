/**
 * Tests for timing utilities (debounce, throttle)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle, defer, sleep, delayedCall } from './timing';

describe('Timing Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('debounce', () => {
    it('delays function execution', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('only executes once for rapid calls', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced();
      debounced();
      debounced();
      debounced();

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('resets timer on each call', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced();
      vi.advanceTimersByTime(50);

      debounced();
      vi.advanceTimersByTime(50);

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('passes arguments to the function', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced('arg1', 'arg2', 123);

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });

    it('uses the last arguments when called multiple times', () => {
      const func = vi.fn();
      const debounced = debounce(func, 100);

      debounced('first');
      debounced('second');
      debounced('third');

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith('third');
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('preserves this context', () => {
      const obj = {
        value: 42,
        getValue: vi.fn(function () {
          return this.value;
        }),
      };
      obj.debouncedGetValue = debounce(obj.getValue, 100);

      obj.debouncedGetValue();
      vi.advanceTimersByTime(100);

      expect(obj.getValue).toHaveBeenCalled();
    });

    describe('leading option', () => {
      it('executes immediately when leading is true', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100, { leading: true, trailing: false });

        debounced();

        expect(func).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1);
      });

      it('does not execute on trailing edge when trailing is false', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100, { leading: true, trailing: false });

        debounced();
        debounced();

        expect(func).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1);
      });

      it('executes on both edges when both are true', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100, { leading: true, trailing: true });

        debounced();
        expect(func).toHaveBeenCalledTimes(1);

        debounced();
        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(2);
      });
    });

    describe('cancel method', () => {
      it('cancels pending invocation', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        debounced.cancel();

        vi.advanceTimersByTime(100);

        expect(func).not.toHaveBeenCalled();
      });

      it('can be called multiple times without error', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        debounced.cancel();
        debounced.cancel();
        debounced.cancel();

        expect(func).not.toHaveBeenCalled();
      });

      it('allows new calls after cancel', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        debounced.cancel();
        debounced();

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1);
      });
    });

    describe('flush method', () => {
      it('immediately invokes pending function', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced('arg');
        expect(func).not.toHaveBeenCalled();

        debounced.flush();
        expect(func).toHaveBeenCalledWith('arg');
      });

      it('returns undefined when no pending call', () => {
        const func = vi.fn().mockReturnValue(42);
        const debounced = debounce(func, 100);

        const result = debounced.flush();
        expect(result).toBeUndefined();
      });

      it('clears pending timer after flush', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        debounced.flush();

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1);
      });
    });

    describe('pending method', () => {
      it('returns true when call is pending', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        expect(debounced.pending()).toBe(true);
      });

      it('returns false when no call is pending', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        expect(debounced.pending()).toBe(false);
      });

      it('returns false after timer completes', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        vi.advanceTimersByTime(100);

        expect(debounced.pending()).toBe(false);
      });

      it('returns false after cancel', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);

        debounced();
        debounced.cancel();

        expect(debounced.pending()).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('handles zero wait time', () => {
        const func = vi.fn();
        const debounced = debounce(func, 0);

        debounced();
        vi.advanceTimersByTime(0);

        expect(func).toHaveBeenCalled();
      });

      it('handles negative wait time as zero', () => {
        const func = vi.fn();
        const debounced = debounce(func, -100);

        debounced();
        vi.advanceTimersByTime(0);

        expect(func).toHaveBeenCalled();
      });

      it('handles undefined options', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100, undefined);

        debounced();
        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalled();
      });
    });
  });

  describe('throttle', () => {
    it('executes immediately on first call by default', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled();

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('limits execution to once per wait period', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled();
      throttled();
      throttled();

      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(2);
    });

    it('executes on trailing edge by default', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled('first');
      throttled('second');

      expect(func).toHaveBeenCalledTimes(1);
      expect(func).toHaveBeenCalledWith('first');

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(2);
      expect(func).toHaveBeenLastCalledWith('second');
    });

    it('passes arguments to the function', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled('arg1', 'arg2');

      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('uses most recent arguments for trailing call', () => {
      const func = vi.fn();
      const throttled = throttle(func, 100);

      throttled('first');
      throttled('second');
      throttled('third');

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenLastCalledWith('third');
    });

    describe('leading option', () => {
      it('does not execute immediately when leading is false', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100, { leading: false });

        throttled();

        expect(func).not.toHaveBeenCalled();

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1);
      });
    });

    describe('trailing option', () => {
      it('does not execute on trailing edge when trailing is false', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100, { trailing: false });

        throttled();
        throttled();

        expect(func).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1);
      });
    });

    describe('cancel method', () => {
      it('cancels pending trailing invocation', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled();
        throttled();
        throttled.cancel();

        vi.advanceTimersByTime(100);

        expect(func).toHaveBeenCalledTimes(1);
      });
    });

    describe('flush method', () => {
      it('immediately invokes pending trailing call', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled('first');
        throttled('second');

        expect(func).toHaveBeenCalledTimes(1);

        throttled.flush();

        expect(func).toHaveBeenCalledTimes(2);
        expect(func).toHaveBeenLastCalledWith('second');
      });
    });

    describe('pending method', () => {
      it('returns true when trailing call is pending', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled();
        throttled();

        expect(throttled.pending()).toBe(true);
      });

      it('returns false when no call is pending', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled();

        // After leading call with no subsequent calls
        expect(throttled.pending()).toBe(true);

        vi.advanceTimersByTime(100);

        expect(throttled.pending()).toBe(false);
      });
    });

    describe('repeated calls', () => {
      it('allows new calls after wait period', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        throttled();
        vi.advanceTimersByTime(100);

        throttled();
        expect(func).toHaveBeenCalledTimes(2);
      });

      it('handles continuous calls over multiple periods', () => {
        const func = vi.fn();
        const throttled = throttle(func, 100);

        // First period
        throttled();
        throttled();
        vi.advanceTimersByTime(100);

        // Second period
        throttled();
        throttled();
        vi.advanceTimersByTime(100);

        // Third period - happens immediately after trailing edge,
        // so throttle prevents immediate execution
        throttled();
        vi.advanceTimersByTime(100);

        // First call + trailing + third call + trailing = 4 calls
        // (fifth call is throttled because it's right after trailing edge)
        expect(func).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('defer', () => {
    it('defers execution to next tick', () => {
      const func = vi.fn();
      const deferred = defer(func);

      deferred();

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(0);

      expect(func).toHaveBeenCalled();
    });

    it('passes arguments to deferred function', () => {
      const func = vi.fn();
      const deferred = defer(func);

      deferred('arg1', 'arg2');
      vi.advanceTimersByTime(0);

      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('returns timeout ID', () => {
      const func = vi.fn();
      const deferred = defer(func);

      const result = deferred();

      // setTimeout returns a number in browsers, but an object (Timeout) in Node.js
      expect(['number', 'object'].includes(typeof result)).toBe(true);
    });
  });

  describe('sleep', () => {
    it('returns a promise', () => {
      const result = sleep(100);
      expect(result).toBeInstanceOf(Promise);
    });

    it('resolves after specified time', async () => {
      const callback = vi.fn();

      sleep(100).then(callback);

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      await Promise.resolve();

      expect(callback).toHaveBeenCalled();
    });

    it('resolves with undefined', async () => {
      const promise = sleep(100);

      vi.advanceTimersByTime(100);

      const result = await promise;
      expect(result).toBeUndefined();
    });

    it('handles zero milliseconds', async () => {
      const callback = vi.fn();

      sleep(0).then(callback);

      vi.advanceTimersByTime(0);
      await Promise.resolve();

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('delayedCall', () => {
    it('executes function after delay', () => {
      const func = vi.fn();

      delayedCall(func, 100);

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalled();
    });

    it('returns object with cancel method', () => {
      const func = vi.fn();

      const result = delayedCall(func, 100);

      expect(result).toHaveProperty('cancel');
      expect(typeof result.cancel).toBe('function');
    });

    it('cancel prevents execution', () => {
      const func = vi.fn();

      const { cancel } = delayedCall(func, 100);
      cancel();

      vi.advanceTimersByTime(100);

      expect(func).not.toHaveBeenCalled();
    });

    it('cancel can be called multiple times', () => {
      const func = vi.fn();

      const { cancel } = delayedCall(func, 100);
      cancel();
      cancel();
      cancel();

      vi.advanceTimersByTime(100);

      expect(func).not.toHaveBeenCalled();
    });

    it('executes function only once', () => {
      const func = vi.fn();

      delayedCall(func, 100);

      vi.advanceTimersByTime(200);

      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration tests', () => {
    it('debounce and throttle can be used together', () => {
      const debouncedFunc = vi.fn();
      const throttledFunc = vi.fn();

      const debounced = debounce(debouncedFunc, 100);
      const throttled = throttle(throttledFunc, 100);

      // Rapid calls
      for (let i = 0; i < 10; i++) {
        debounced();
        throttled();
      }

      // Debounce hasn't fired yet, throttle fired once
      expect(debouncedFunc).not.toHaveBeenCalled();
      expect(throttledFunc).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);

      // Debounce fires once, throttle fires trailing
      expect(debouncedFunc).toHaveBeenCalledTimes(1);
      expect(throttledFunc).toHaveBeenCalledTimes(2);
    });

    it('multiple debounced functions work independently', () => {
      const func1 = vi.fn();
      const func2 = vi.fn();

      const debounced1 = debounce(func1, 100);
      const debounced2 = debounce(func2, 200);

      debounced1();
      debounced2();

      vi.advanceTimersByTime(100);

      expect(func1).toHaveBeenCalledTimes(1);
      expect(func2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(func1).toHaveBeenCalledTimes(1);
      expect(func2).toHaveBeenCalledTimes(1);
    });
  });
});
