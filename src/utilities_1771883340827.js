/**
 * Utilities Module
 * A collection of useful utility functions for common programming tasks
 */

/**
 * Deep clones an object or array to create a completely independent copy
 * @param {*} obj - The object or array to clone
 * @returns {*} A deep copy of the input object/array
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 * cloned.b.c = 3; // Does not affect original
 */
function deepClone(obj) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle Array
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }

  // Handle Object
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Debounces a function to prevent it from being called too frequently
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds before executing the function
 * @returns {Function} A debounced version of the function
 * @example
 * const debouncedSearch = debounce(searchFunction, 300);
 * // Function will only execute 300ms after the last call
 */
function debounce(func, delay) {
  let timeoutId = null;

  return function debounced(...args) {
    // Clear the previous timeout if it exists
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout to execute the function
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttles a function to be called at most once per specified interval
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds between calls
 * @returns {Function} A throttled version of the function
 */
function throttle(func, limit) {
  let isExecuting = false;
  let lastRun = 0;

  return function throttled(...args) {
    const now = Date.now();

    if (!isExecuting && now - lastRun > limit) {
      func.apply(this, args);
      lastRun = now;
      isExecuting = true;

      setTimeout(() => {
        isExecuting = false;
      }, limit);
    }
  };
}

/**
 * Memoizes a function to cache its results based on arguments
 * @param {Function} func - The function to memoize
 * @returns {Function} A memoized version of the function
 */
function memoize(func) {
  const cache = new Map();