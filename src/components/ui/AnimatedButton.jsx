import React, { useState } from 'react';

export function AnimatedButton({ onClick, className = '', children, ...props }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    setIsAnimating(true);
    onClick?.(e);
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
