/**
 * Storage Abstraction Layer
 * Provides a consistent API for localStorage with JSON parsing and error handling
 */

/**
 * Get a value from localStorage
 * @param {string} key - The storage key
 * @param {*} defaultValue - Default value if key doesn't exist or parsing fails
 * @returns {*} The parsed value or defaultValue
 */
export function storageGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    // Handle boolean strings stored as plain text (backwards compatibility)
    if (item === 'true') return true;
    if (item === 'false') return false;
    // Try to parse as JSON, fall back to raw value
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Set a value in localStorage
 * @param {string} key - The storage key
 * @param {*} value - The value to store (will be JSON stringified)
 */
export function storageSet(key, value) {
  try {
    // Store booleans as 'true'/'false' for backwards compatibility
    if (typeof value === 'boolean') {
      localStorage.setItem(key, value.toString());
    } else if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

/**
 * Remove a value from localStorage
 * @param {string} key - The storage key to remove
 */
export function storageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

/**
 * Storage object for convenient access
 */
export const storage = {
  get: storageGet,
  set: storageSet,
  remove: storageRemove,
};
