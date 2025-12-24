import React, { useState } from 'react';

export function AnimatedButton({ onClick, className = '', children, delay = 150, ...props }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    setIsAnimating(true);
    // Delay the action slightly so the flash animation is visible
    setTimeout(() => {
      onClick?.(e);
    }, delay);
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <button
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      className={`${className} ${isAnimating ? 'animate-flash-pop' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
