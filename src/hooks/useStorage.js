/**
 * useStorage Hook
 * React hook that syncs state with localStorage
 */
import { useState, useCallback } from 'react';
import { storageGet, storageSet } from '../lib/storage';

/**
 * Hook for managing localStorage-backed state
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {[*, Function]} Tuple of [value, setValue]
 */
export function useStorage(key, defaultValue) {
  // Initialize state from localStorage
  const [storedValue, setStoredValue] = useState(() => {
    return storageGet(key, defaultValue);
  });

  // Wrapped setter that also updates localStorage
  const setValue = useCallback((value) => {
    // Allow value to be a function (like useState)
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    storageSet(key, valueToStore);
  }, [key, storedValue]);

  return [storedValue, setValue];
}
