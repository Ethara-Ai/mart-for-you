/**
 * Utility function for conditionally joining class names together.
 *
 * A lightweight alternative to clsx/classnames libraries.
 * Supports strings, arrays, and objects with boolean values.
 *
 * @param {...(string|Object|Array|undefined|null|false)} args - Class names or conditions
 * @returns {string} Combined class names
 *
 * @example
 * // Basic usage
 * cn('foo', 'bar') // => 'foo bar'
 *
 * // With conditionals
 * cn('foo', isActive && 'active', isDisabled && 'disabled')
 * // => 'foo active' (if isActive is true, isDisabled is false)
 *
 * // With objects
 * cn('base', { active: isActive, disabled: isDisabled })
 * // => 'base active' (if isActive is true, isDisabled is false)
 *
 * // With arrays
 * cn('base', ['class1', 'class2'], condition && 'conditional')
 * // => 'base class1 class2 conditional'
 */
export function cn(...args) {
  const classes = [];

  for (const arg of args) {
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === 'string') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      // Recursively process arrays
      const inner = cn(...arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (argType === 'object') {
      // Process objects: { className: booleanCondition }
      for (const [key, value] of Object.entries(arg)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

/**
 * Create a class name builder with a base class that's always included.
 *
 * @param {string} baseClass - The base class that's always applied
 * @returns {Function} A function that accepts additional classes
 *
 * @example
 * const buttonClass = withBase('btn');
 * buttonClass('primary', isLarge && 'btn-lg') // => 'btn primary btn-lg'
 */
export function withBase(baseClass) {
  return (...args) => cn(baseClass, ...args);
}

/**
 * Merge multiple class name strings, removing duplicates.
 * Useful when combining Tailwind classes where order matters.
 *
 * @param {...string} classStrings - Class name strings to merge
 * @returns {string} Merged class names with duplicates removed
 *
 * @example
 * merge('p-4 m-2', 'p-6 text-red') // => 'm-2 p-6 text-red' (p-6 overrides p-4)
 */
export function merge(...classStrings) {
  const allClasses = classStrings
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean);

  // Use a Map to track the last occurrence of each class prefix
  // This helps with Tailwind's utility class overriding
  const classMap = new Map();

  for (const cls of allClasses) {
    // Extract prefix for Tailwind utility classes (e.g., 'p-4' => 'p')
    const prefix = cls.replace(/-[^-]+$/, '');
    classMap.set(prefix, cls);
  }

  return Array.from(classMap.values()).join(' ');
}

export default cn;
