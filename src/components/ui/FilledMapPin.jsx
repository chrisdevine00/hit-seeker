import React from 'react';

export function FilledMapPin({ size = 16, className = '', holeColor = '#161616' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="currentColor" />
      <circle cx="12" cy="10" r="4" fill={holeColor} stroke="none" />
    </svg>
  );
}
