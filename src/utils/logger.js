/* eslint-disable no-console */
/**
 * Logger Utility
 *
 * A structured logging utility that provides consistent logging
 * across the application with environment-aware behavior.
 *
 * Features:
 * - Multiple log levels (debug, info, warn, error)
 * - Environment-aware (suppresses logs in production)
 * - Structured log format with timestamps
 * - Support for metadata and context
 * - Easy integration with external logging services
 */

/**
 * Log levels enum
 */
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  SILENT: 4,
};

/**
 * Log level names for display
 */
const LOG_LEVEL_NAMES = {
  [LOG_LEVELS.DEBUG]: 'DEBUG',
  [LOG_LEVELS.INFO]: 'INFO',
  [LOG_LEVELS.WARN]: 'WARN',
  [LOG_LEVELS.ERROR]: 'ERROR',
};

/**
 * Log level colors for console output
 */
const LOG_LEVEL_COLORS = {
  [LOG_LEVELS.DEBUG]: '#9CA3AF', // gray
  [LOG_LEVELS.INFO]: '#3B82F6', // blue
  [LOG_LEVELS.WARN]: '#F59E0B', // amber
  [LOG_LEVELS.ERROR]: '#EF4444', // red
};

/**
 * Determine if we're in development mode
 */
function isDevelopment() {
  try {
    return import.meta.env?.DEV ?? process.env.NODE_ENV === 'development';
  } catch {
    return false;
  }
}

/**
 * Get the current log level based on environment
 */
function getDefaultLogLevel() {
  if (isDevelopment()) {
    return LOG_LEVELS.DEBUG;
  }
  return LOG_LEVELS.ERROR; // Only errors in production
}

/**
 * Format timestamp for log output
 * @returns {string} Formatted timestamp
 */
function formatTimestamp() {
  return new Date().toISOString();
}

/**
 * Format log message with metadata
 * @param {string} level - Log level name
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 * @returns {Object} Formatted log object
 */
function formatLogEntry(level, message, meta = {}) {
  return {
    timestamp: formatTimestamp(),
    level,
    message,
    ...meta,
  };
}

/**
 * Logger class for structured logging
 */
class Logger {
  constructor(options = {}) {
    this.logLevel = options.logLevel ?? getDefaultLogLevel();
    this.prefix = options.prefix ?? '[Mart]';
    this.enableConsole = options.enableConsole ?? true;
    this.handlers = options.handlers ?? [];
  }

  /**
   * Set the log level
   * @param {number} level - Log level from LOG_LEVELS
   */
  setLogLevel(level) {
    this.logLevel = level;
  }

  /**
   * Add a custom log handler (for external services)
   * @param {Function} handler - Handler function (logEntry) => void
   */
  addHandler(handler) {
    if (typeof handler === 'function') {
      this.handlers.push(handler);
    }
  }

  /**
   * Remove a custom log handler
   * @param {Function} handler - Handler to remove
   */
  removeHandler(handler) {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  /**
   * Internal log method
   * @param {number} level - Log level
   * @param {string} message - Log message
   * @param {Object} meta - Additional metadata
   */
  _log(level, message, meta = {}) {
    // Skip if below current log level
    if (level < this.logLevel) {
      return;
    }

    const levelName = LOG_LEVEL_NAMES[level];
    const logEntry = formatLogEntry(levelName, message, meta);

    // Console output
    if (this.enableConsole) {
      this._consoleLog(level, logEntry);
    }

    // Call custom handlers
    this.handlers.forEach((handler) => {
      try {
        handler(logEntry);
      } catch {
        // Silently fail - don't break app due to logging issues
      }
    });
  }

  /**
   * Output to console with styling
   * @param {number} level - Log level
   * @param {Object} logEntry - Formatted log entry
   */
  _consoleLog(level, logEntry) {
    const color = LOG_LEVEL_COLORS[level];
    const { timestamp, level: levelName, message, ...meta } = logEntry;
    const prefix = `%c${this.prefix} [${levelName}]`;
    const style = `color: ${color}; font-weight: bold;`;

    const hasMeta = Object.keys(meta).length > 0;

    switch (level) {
      case LOG_LEVELS.DEBUG:
        if (hasMeta) {
          console.debug(prefix, style, message, meta);
        } else {
          console.debug(prefix, style, message);
        }
        break;
      case LOG_LEVELS.INFO:
        if (hasMeta) {
          console.info(prefix, style, message, meta);
        } else {
          console.info(prefix, style, message);
        }
        break;
      case LOG_LEVELS.WARN:
        if (hasMeta) {
          console.warn(prefix, style, message, meta);
        } else {
          console.warn(prefix, style, message);
        }
        break;
      case LOG_LEVELS.ERROR:
        if (hasMeta) {
          console.error(prefix, style, message, meta);
        } else {
          console.error(prefix, style, message);
        }
        break;
      default:
        if (hasMeta) {
          console.log(prefix, style, message, meta);
        } else {
          console.log(prefix, style, message);
        }
    }
  }

  /**
   * Log a debug message
   * @param {string} message - Log message
   * @param {Object} [meta] - Additional metadata
   */
  debug(message, meta) {
    this._log(LOG_LEVELS.DEBUG, message, meta);
  }

  /**
   * Log an info message
   * @param {string} message - Log message
   * @param {Object} [meta] - Additional metadata
   */
  info(message, meta) {
    this._log(LOG_LEVELS.INFO, message, meta);
  }

  /**
   * Log a warning message
   * @param {string} message - Log message
   * @param {Object} [meta] - Additional metadata
   */
  warn(message, meta) {
    this._log(LOG_LEVELS.WARN, message, meta);
  }

  /**
   * Log an error message
   * @param {string} message - Log message
   * @param {Object|Error} [meta] - Additional metadata or Error object
   */
  error(message, meta) {
    // Handle Error objects specially
    if (meta instanceof Error) {
      this._log(LOG_LEVELS.ERROR, message, {
        error: meta.message,
        stack: meta.stack,
        name: meta.name,
      });
    } else {
      this._log(LOG_LEVELS.ERROR, message, meta);
    }
  }

  /**
   * Create a child logger with a specific context
   * @param {string} context - Context name (e.g., component name)
   * @returns {Object} Child logger with context
   */
  child(context) {
    const parent = this;
    return {
      debug: (message, meta) => parent.debug(message, { context, ...meta }),
      info: (message, meta) => parent.info(message, { context, ...meta }),
      warn: (message, meta) => parent.warn(message, { context, ...meta }),
      error: (message, meta) => parent.error(message, { context, ...meta }),
    };
  }

  /**
   * Log performance timing
   * @param {string} label - Timing label
   * @param {number} startTime - Start time from performance.now()
   */
  timing(label, startTime) {
    const duration = performance.now() - startTime;
    this.debug(`⏱ ${label}`, { duration: `${duration.toFixed(2)}ms` });
  }

  /**
   * Create a performance timer
   * @param {string} label - Timer label
   * @returns {Function} Function to call when operation completes
   */
  startTimer(label) {
    const startTime = performance.now();
    return () => this.timing(label, startTime);
  }

  /**
   * Log a group of related messages
   * @param {string} label - Group label
   * @param {Function} fn - Function containing log calls
   */
  group(label, fn) {
    if (this.logLevel > LOG_LEVELS.DEBUG) {
      fn();
      return;
    }

    console.group(`${this.prefix} ${label}`);
    try {
      fn();
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Log a table of data
   * @param {Array|Object} data - Data to display as table
   * @param {string} [label] - Optional label
   */
  table(data, label) {
    if (this.logLevel > LOG_LEVELS.DEBUG) {
      return;
    }

    if (label) {
      this.debug(label);
    }
    console.table(data);
  }
}

// Create singleton instance
const logger = new Logger();

// Export singleton and class for custom instances
export { Logger };
export default logger;

/**
 * Convenience functions for direct import
 */
export const debug = (message, meta) => logger.debug(message, meta);
export const info = (message, meta) => logger.info(message, meta);
export const warn = (message, meta) => logger.warn(message, meta);
export const error = (message, meta) => logger.error(message, meta);

/**
 * Create a context-specific logger
 * @param {string} context - Context name
 * @returns {Object} Logger with context
 *
 * @example
 * const log = createLogger('CartContext');
 * log.info('Item added to cart', { productId: 123 });
 */
export function createLogger(context) {
  return logger.child(context);
}
