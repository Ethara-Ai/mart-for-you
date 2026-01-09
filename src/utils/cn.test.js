/**
 * Tests for cn (classNames) utility function
 */
import { describe, it, expect } from 'vitest';
import { cn, withBase, merge } from './cn';

describe('cn utility', () => {
  describe('basic functionality', () => {
    it('returns empty string for no arguments', () => {
      expect(cn()).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(cn(undefined)).toBe('');
    });

    it('returns empty string for null', () => {
      expect(cn(null)).toBe('');
    });

    it('returns empty string for false', () => {
      expect(cn(false)).toBe('');
    });

    it('returns single class name', () => {
      expect(cn('foo')).toBe('foo');
    });

    it('joins multiple class names with space', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('joins three or more class names', () => {
      expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
    });
  });

  describe('falsy value handling', () => {
    it('filters out false values', () => {
      expect(cn('foo', false, 'bar')).toBe('foo bar');
    });

    it('filters out null values', () => {
      expect(cn('foo', null, 'bar')).toBe('foo bar');
    });

    it('filters out undefined values', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar');
    });

    it('filters out empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });

    it('filters out zero', () => {
      expect(cn('foo', 0, 'bar')).toBe('foo bar');
    });

    it('handles all falsy values mixed', () => {
      expect(cn('foo', false, null, undefined, '', 0, 'bar')).toBe('foo bar');
    });
  });

  describe('conditional expressions', () => {
    it('includes class when condition is true', () => {
      const isActive = true;
      expect(cn('base', isActive && 'active')).toBe('base active');
    });

    it('excludes class when condition is false', () => {
      const isActive = false;
      expect(cn('base', isActive && 'active')).toBe('base');
    });

    it('handles ternary expressions', () => {
      const isActive = true;
      expect(cn('base', isActive ? 'active' : 'inactive')).toBe('base active');
    });

    it('handles complex conditionals', () => {
      const isActive = true;
      const isDisabled = false;
      const hasError = true;
      expect(cn('base', isActive && 'active', isDisabled && 'disabled', hasError && 'error')).toBe(
        'base active error'
      );
    });
  });

  describe('object syntax', () => {
    it('includes keys with truthy values', () => {
      expect(cn({ active: true, disabled: false })).toBe('active');
    });

    it('includes multiple truthy keys', () => {
      expect(cn({ foo: true, bar: true, baz: false })).toBe('foo bar');
    });

    it('handles empty object', () => {
      expect(cn({})).toBe('');
    });

    it('handles object with all false values', () => {
      expect(cn({ foo: false, bar: false })).toBe('');
    });

    it('combines string and object syntax', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active');
    });

    it('handles truthy non-boolean values', () => {
      expect(cn({ foo: 1, bar: 'yes', baz: 0, qux: '' })).toBe('foo bar');
    });
  });

  describe('array syntax', () => {
    it('flattens array of strings', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('handles nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
    });

    it('filters falsy values in arrays', () => {
      expect(cn(['foo', false, 'bar', null])).toBe('foo bar');
    });

    it('combines arrays with other types', () => {
      expect(cn('base', ['foo', 'bar'], { active: true })).toBe('base foo bar active');
    });

    it('handles empty array', () => {
      expect(cn([])).toBe('');
    });
  });

  describe('complex combinations', () => {
    it('handles mixed types', () => {
      const isActive = true;
      expect(cn('base', ['class1', 'class2'], { active: isActive }, isActive && 'highlight')).toBe(
        'base class1 class2 active highlight'
      );
    });

    it('handles deeply nested structures', () => {
      expect(cn(['a', ['b', ['c', 'd']]])).toBe('a b c d');
    });

    it('handles real-world button example', () => {
      const variant = 'primary';
      const size = 'lg';
      const isDisabled = false;
      const isLoading = true;

      expect(
        cn(
          'btn',
          variant === 'primary' && 'btn-primary',
          variant === 'secondary' && 'btn-secondary',
          size === 'sm' && 'btn-sm',
          size === 'lg' && 'btn-lg',
          { disabled: isDisabled, loading: isLoading }
        )
      ).toBe('btn btn-primary btn-lg loading');
    });

    it('handles Tailwind-like class composition', () => {
      const darkMode = true;
      expect(
        cn(
          'px-4 py-2 rounded',
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
          'hover:opacity-80'
        )
      ).toBe('px-4 py-2 rounded bg-gray-800 text-white hover:opacity-80');
    });
  });

  describe('edge cases', () => {
    it('preserves whitespace in class names', () => {
      expect(cn('  foo  ')).toBe('  foo  ');
    });

    it('handles numeric-like strings', () => {
      expect(cn('123', '456')).toBe('123 456');
    });

    it('handles special characters in class names', () => {
      expect(cn('hover:bg-blue-500', 'md:text-lg')).toBe('hover:bg-blue-500 md:text-lg');
    });

    it('handles very long class lists', () => {
      const classes = Array.from({ length: 100 }, (_, i) => `class-${i}`);
      const result = cn(...classes);
      expect(result.split(' ')).toHaveLength(100);
    });
  });
});

describe('withBase utility', () => {
  it('creates a function that prepends base class', () => {
    const button = withBase('btn');
    expect(button('primary')).toBe('btn primary');
  });

  it('handles multiple additional classes', () => {
    const button = withBase('btn');
    expect(button('primary', 'large')).toBe('btn primary large');
  });

  it('handles conditional classes', () => {
    const button = withBase('btn');
    const isActive = true;
    expect(button('primary', isActive && 'active')).toBe('btn primary active');
  });

  it('handles object syntax', () => {
    const card = withBase('card');
    expect(card({ elevated: true, bordered: false })).toBe('card elevated');
  });

  it('returns only base when no additional classes', () => {
    const button = withBase('btn');
    expect(button()).toBe('btn');
  });

  it('handles empty base', () => {
    const noBase = withBase('');
    expect(noBase('foo', 'bar')).toBe('foo bar');
  });
});

describe('merge utility', () => {
  it('merges class strings', () => {
    expect(merge('foo bar', 'baz qux')).toBe('foo bar baz qux');
  });

  it('removes duplicate classes', () => {
    expect(merge('foo bar', 'bar baz')).toBe('foo bar baz');
  });

  it('handles empty strings', () => {
    expect(merge('foo', '', 'bar')).toBe('foo bar');
  });

  it('handles null and undefined', () => {
    expect(merge('foo', null, undefined, 'bar')).toBe('foo bar');
  });

  it('handles Tailwind utility class overrides', () => {
    // The last occurrence should win for same prefix
    const result = merge('p-4', 'p-6');
    expect(result).toContain('p-6');
    expect(result).not.toContain('p-4');
  });

  it('preserves different utility classes', () => {
    const result = merge('p-4 m-2', 'text-red');
    expect(result).toContain('m-2');
    expect(result).toContain('text-red');
  });
});
