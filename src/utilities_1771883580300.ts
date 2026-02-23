/**
 * Utilities Module
 * A collection of general-purpose utility functions for common tasks.
 * No external library dependencies.
 */

/**
 * Formats a number as a currency string with the specified locale and currency.
 * @param amount - The numeric amount to format
 * @param currency - The ISO 4217 currency code (e.g., 'USD', 'EUR', 'GBP')
 * @param locale - The locale string (e.g., 'en-US', 'de-DE', 'fr-FR')
 * @returns A formatted currency string
 * @example
 * formatCurrency(1234.56, 'USD', 'en-US')
 * // Returns: '$1,234.56'
 */
function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    // Fallback for invalid currency codes
    return `${amount.toFixed(2)} ${currency}`;
  }
}

/**
 * Debounces a function to prevent it from being called too frequently.
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds before the function is called
 * @returns A debounced version of the function
 * @example
 * const debouncedSearch = debounce((query) => console.log(query), 300);
 * debouncedSearch('hello');
 * debouncedSearch('hello world'); // Only this call will execute after 300ms
 */
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, or empty object).
 * @param value - The value to check
 * @returns True if the value is empty, false otherwise
 * @example
 * isEmpty(null) // Returns: true
 * isEmpty('') // Returns: true
 * isEmpty([]) // Returns: true
 * isEmpty({}) // Returns: true
 * isEmpty('hello') // Returns: false
 */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

/**
 * Deep clones an object or array