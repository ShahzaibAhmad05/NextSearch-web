// lib/utils/classnames.ts

/**
 * Utility for conditionally joining classNames together.
 * Filters out falsy values and joins remaining classes with a space.
 *
 * @example
 * cn('base-class', isActive && 'active', hasError && 'error')
 * // => 'base-class active' (if isActive is true, hasError is false)
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}
