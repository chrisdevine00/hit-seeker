import React, { useState } from 'react';

const variants = {
  primary: 'bg-[#d4a855] hover:bg-[#c49745] text-black font-semibold',
  secondary: 'bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] border border-[#333]',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold',
  danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400',
  ghost: 'text-[#aaa] hover:text-white hover:bg-[#1a1a1a]',
  link: 'text-[#d4a855] hover:text-[#c49745]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded',
  md: 'px-4 py-2 rounded',
  lg: 'px-6 py-3 rounded text-base',
  xl: 'px-8 py-4 rounded-lg text-lg',
};

// Variants that should have the press+bounce animation
const animatedVariants = ['primary', 'success', 'danger'];

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  onClick,
  animate = true,
  delay = 150,
  ...props
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const shouldAnimate = animate && animatedVariants.includes(variant);

  const handleClick = (e) => {
    if (shouldAnimate) {
      setIsAnimating(true);
      setTimeout(() => {
        onClick?.(e);
      }, delay);
    } else {
      onClick?.(e);
    }
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <button
      onClick={handleClick}
      onAnimationEnd={handleAnimationEnd}
      className={`
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${shouldAnimate && isAnimating ? 'animate-flash-pop' : ''}
        transition-colors
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </button>
  );
}
