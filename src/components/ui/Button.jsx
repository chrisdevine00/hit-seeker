import React, { useState } from 'react';
import { hapticLight } from '../../lib/haptics';

const variants = {
  primary: 'bg-gradient-to-r from-[#d4a855] to-amber-600 hover:from-[#c49745] hover:to-amber-500 text-black font-semibold shadow-lg shadow-[#d4a855]/20',
  secondary: 'bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] border border-[#333]',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold',
  danger: 'bg-red-600 hover:bg-red-500 text-white font-semibold',
  'danger-subtle': 'bg-red-600/20 hover:bg-red-600/30 text-red-400',
  ghost: 'text-[#aaa] hover:text-white hover:bg-[#1a1a1a]',
  link: 'text-[#d4a855] hover:text-[#c49745]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded',
  md: 'px-4 py-2 rounded',
  lg: 'px-6 py-3 rounded text-base',
  xl: 'px-8 py-4 rounded text-lg',
};

// Variants that should have the press+bounce animation
const animatedVariants = ['primary', 'success', 'danger', 'danger-subtle'];

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  onClick,
  animate = true,
  ...props
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const shouldAnimate = animate && animatedVariants.includes(variant);

  const handleClick = (e) => {
    try { hapticLight(); } catch (err) { /* ignore haptic errors */ }
    if (shouldAnimate) {
      setIsAnimating(true);
    }
    // Call onClick immediately - animation is visual only
    onClick?.(e);
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
