import { useMemo } from 'react';
import Fuse from 'fuse.js';

/**
 * Custom hook for fuzzy searching with Fuse.js
 * Handles typos, partial matches, and misspellings
 *
 * @param {Array} items - Array of items to search through
 * @param {Array} keys - Array of keys to search on (e.g., ['name', 'shortName'])
 * @param {string} query - Search query string
 * @param {Object} options - Optional Fuse.js options override
 * @returns {Array} - Filtered array of matching items
 */
export function useFuzzySearch(items, keys, query, options = {}) {
  // Create Fuse instance with sensible defaults for typo tolerance
  const fuse = useMemo(() => {
    if (!items || items.length === 0) return null;

    return new Fuse(items, {
      keys,
      threshold: 0.4, // 0 = exact match, 1 = match anything (0.4 is good for typos)
      distance: 100, // How far to search for matches
      minMatchCharLength: 2, // Minimum characters before matching
      includeScore: true,
      ignoreLocation: true, // Don't penalize matches that aren't at the start
      ...options,
    });
  }, [items, keys, options]);

  // Perform search and return results
  const results = useMemo(() => {
    // If no query, return all items
    if (!query || query.trim().length === 0) {
      return items || [];
    }

    // If no fuse instance, return empty
    if (!fuse) return [];

    // Perform fuzzy search and extract items from results
    const searchResults = fuse.search(query.trim());
    return searchResults.map(result => result.item);
  }, [fuse, query, items]);

  return results;
}

/**
 * Simple fuzzy filter function (non-hook version)
 * Use this when you need fuzzy filtering outside of React components
 * or when you need more control over when filtering happens
 *
 * @param {Array} items - Array of items to search through
 * @param {Array} keys - Array of keys to search on
 * @param {string} query - Search query string
 * @param {Object} options - Optional Fuse.js options override
 * @returns {Array} - Filtered array of matching items
 */
export function fuzzyFilter(items, keys, query, options = {}) {
  if (!items || items.length === 0) return [];
  if (!query || query.trim().length === 0) return items;

  const fuse = new Fuse(items, {
    keys,
    threshold: 0.4,
    distance: 100,
    minMatchCharLength: 2,
    includeScore: true,
    ignoreLocation: true,
    ...options,
  });

  const results = fuse.search(query.trim());
  return results.map(result => result.item);
}

/**
 * Create a reusable Fuse instance for performance
 * Use this when searching the same dataset multiple times
 *
 * @param {Array} items - Array of items to search through
 * @param {Array} keys - Array of keys to search on
 * @param {Object} options - Optional Fuse.js options override
 * @returns {Function} - Search function that takes a query and returns results
 */
export function createFuzzySearcher(items, keys, options = {}) {
  const fuse = new Fuse(items, {
    keys,
    threshold: 0.4,
    distance: 100,
    minMatchCharLength: 2,
    includeScore: true,
    ignoreLocation: true,
    ...options,
  });

  return (query) => {
    if (!query || query.trim().length === 0) return items;
    const results = fuse.search(query.trim());
    return results.map(result => result.item);
  };
}
