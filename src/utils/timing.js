/**
 * Timing utilities
 *
 * Provides debounce and throttle functions for rate-limiting
 * function calls, useful for search inputs, scroll handlers, etc.
 */

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time
 * the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {Object} [options] - Optional configuration
 * @param {boolean} [options.leading=false] - Invoke on the leading edge
 * @param {boolean} [options.trailing=true] - Invoke on the trailing edge
 * @returns {Function} The debounced function with a cancel method
 *
 * @example
 * // Basic usage - search input
 * const debouncedSearch = debounce((term) => {
 *   fetchSearchResults(term);
 * }, 300);
 *
 * // With leading edge
 * const debouncedClick = debounce(handleClick, 500, { leading: true, trailing: false });
 *
 * // Cancel pending calls
 * debouncedSearch.cancel();
 */
export function debounce(func, wait, options = {}) {
  const { leading = false, trailing = true } = options;

  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;
  let result = undefined;
  let lastCallTime = null;
  let lastInvokeTime = 0;

  // Ensure wait is a positive number
  const waitMs = Math.max(0, wait) || 0;

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = null;
    lastThis = null;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);

    return result;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = lastCallTime === null ? 0 : time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, or we've hit the wait time
    return (
      lastCallTime === null ||
      timeSinceLastCall >= waitMs ||
      timeSinceLastCall < 0 ||
      timeSinceLastInvoke >= waitMs
    );
  }

  function trailingEdge(time) {
    timeoutId = null;

    // Only invoke if we have lastArgs which means func has been debounced
    // at least once
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    lastArgs = null;
    lastThis = null;
    return result;
  }

  function timerExpired() {
    const time = Date.now();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    // Restart the timer
    const timeSinceLastCall = time - lastCallTime;
    const timeRemaining = waitMs - timeSinceLastCall;

    timeoutId = setTimeout(timerExpired, timeRemaining);
  }

  function leadingEdge(time) {
    // Reset lastInvokeTime for trailing edge check
    lastInvokeTime = time;

    // Start the timer for the trailing edge
    timeoutId = setTimeout(timerExpired, waitMs);

    // Invoke on leading edge if configured
    return leading ? invokeFunc(time) : result;
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(time);
      }

      // Handle edge case where both leading and trailing are true
      if (leading) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(timerExpired, waitMs);
        return invokeFunc(time);
      }
    }

    // Always restart the timer on each call (standard debounce behavior)
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(timerExpired, waitMs);

    return result;
  }

  /**
   * Cancel any pending invocation
   */
  debounced.cancel = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    lastArgs = null;
    lastThis = null;
    lastCallTime = null;
    lastInvokeTime = 0;
    timeoutId = null;
  };

  /**
   * Immediately invoke if there's a pending call
   */
  debounced.flush = function () {
    if (timeoutId === null) {
      return undefined;
    }

    return trailingEdge(Date.now());
  };

  /**
   * Check if there's a pending invocation
   * @returns {boolean}
   */
  debounced.pending = function () {
    return timeoutId !== null;
  };

  return debounced;
}

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every specified wait milliseconds.
 *
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @param {Object} [options] - Optional configuration
 * @param {boolean} [options.leading=true] - Invoke on the leading edge
 * @param {boolean} [options.trailing=true] - Invoke on the trailing edge
 * @returns {Function} The throttled function with cancel method
 *
 * @example
 * // Basic usage - scroll handler
 * const throttledScroll = throttle(() => {
 *   updateScrollPosition();
 * }, 100);
 *
 * window.addEventListener('scroll', throttledScroll);
 *
 * // Cleanup
 * window.removeEventListener('scroll', throttledScroll);
 * throttledScroll.cancel();
 */
export function throttle(func, wait, options = {}) {
  const { leading = true, trailing = true } = options;

  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;
  let result = null;
  let lastInvokeTime = 0;

  // Ensure wait is a positive number
  const waitMs = Math.max(0, wait) || 0;

  function invokeFunc() {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = null;
    lastThis = null;
    lastInvokeTime = Date.now();
    result = func.apply(thisArg, args);

    return result;
  }

  function trailingEdge() {
    timeoutId = null;

    if (trailing && lastArgs) {
      return invokeFunc();
    }

    lastArgs = null;
    lastThis = null;
    return result;
  }

  function remainingWait(time) {
    const timeSinceLastInvoke = time - lastInvokeTime;
    return waitMs - timeSinceLastInvoke;
  }

  function shouldInvoke(time) {
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastInvokeTime === 0 || // First call
      timeSinceLastInvoke >= waitMs || // Wait time has passed
      timeSinceLastInvoke < 0 // Clock was moved backwards
    );
  }

  function throttled(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;

    if (isInvoking) {
      if (timeoutId === null) {
        // First call or after trailing edge
        if (leading) {
          lastInvokeTime = time;
          if (trailing) {
            timeoutId = setTimeout(trailingEdge, waitMs);
          }
          return invokeFunc();
        } else {
          lastInvokeTime = time;
          timeoutId = setTimeout(trailingEdge, waitMs);
          return result;
        }
      }
    }

    // Set up trailing edge timer if not already set
    if (timeoutId === null && trailing) {
      timeoutId = setTimeout(trailingEdge, remainingWait(time));
    }

    return result;
  }

  /**
   * Cancel any pending invocation
   */
  throttled.cancel = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    lastArgs = null;
    lastThis = null;
    lastInvokeTime = 0;
    timeoutId = null;
  };

  /**
   * Immediately invoke if there's a pending call
   */
  throttled.flush = function () {
    if (timeoutId === null) {
      return result;
    }

    return trailingEdge();
  };

  /**
   * Check if there's a pending invocation
   * @returns {boolean}
   */
  throttled.pending = function () {
    return timeoutId !== null;
  };

  return throttled;
}

/**
 * Creates a function that delays invocation until after the current
 * call stack has cleared (using setTimeout with 0ms delay).
 *
 * @param {Function} func - The function to defer
 * @returns {Function} The deferred function
 *
 * @example
 * const deferredLog = defer((msg) => console.log(msg));
 * deferredLog('This logs after current execution');
 * console.log('This logs first');
 */
export function defer(func) {
  return function deferred(...args) {
    return setTimeout(() => func.apply(this, args), 0);
  };
}

/**
 * Creates a promise that resolves after the specified delay.
 *
 * @param {number} ms - The number of milliseconds to wait
 * @returns {Promise<void>} A promise that resolves after the delay
 *
 * @example
 * // In an async function
 * await sleep(1000);
 * console.log('One second has passed');
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a function after a delay, returning a cancel function.
 *
 * @param {Function} func - The function to execute
 * @param {number} delay - The delay in milliseconds
 * @returns {{ cancel: Function }} Object with cancel method
 *
 * @example
 * const delayed = delayedCall(() => console.log('Hello'), 1000);
 * // Cancel before execution
 * delayed.cancel();
 */
export function delayedCall(func, delay) {
  const timeoutId = setTimeout(func, delay);

  return {
    cancel: () => clearTimeout(timeoutId),
  };
}

export default {
  debounce,
  throttle,
  defer,
  sleep,
  delayedCall,
};
