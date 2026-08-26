/**
 * lib/utils.ts
 *
 * Utility functions for the application.
 */

/**
 * cn - className concatenation utility
 * Combines multiple class strings, filtering falsy values.
 * Mirrors the behavior of clsx/classnames without an extra dependency.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
