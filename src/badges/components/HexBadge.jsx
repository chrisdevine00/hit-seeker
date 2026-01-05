import React from 'react';
import { Lock } from 'lucide-react';
import { BADGE_COLORS } from '../definitions/badgeColors';
import { BADGE_ICONS } from '../definitions/badgeIcons';

// Hexagon Badge Component
export function HexBadge({ badge, earned, size = 'medium', onClick }) {
  const sizes = {
    small: { outer: 'w-16 h-[70px]', inner: 'w-12 h-[53px]', iconSize: 20 },
    medium: { outer: 'w-20 h-[88px]', inner: 'w-16 h-[70px]', iconSize: 28 },
    large: { outer: 'w-28 h-[123px]', inner: 'w-24 h-[105px]', iconSize: 40 },
  };

  const s = sizes[size];
  const colors = earned ? BADGE_COLORS[badge.color] : { outline: 'from-gray-600 to-gray-800', fill: 'from-gray-800/50 to-gray-900/50' };

  // Get the icon component from the map
  const IconComponent = BADGE_ICONS[badge.icon];

  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
      {/* Outer hexagon (border) */}
      <div
        className={`${s.outer} bg-gradient-to-b ${colors.outline} flex items-center justify-center transition-all ${earned ? 'opacity-100' : 'opacity-40'}`}
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      >
        {/* Inner hexagon (fill) */}
        <div
          className={`${s.inner} bg-gradient-to-b ${colors.fill} flex items-center justify-center`}
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
          {earned ? (
            IconComponent ? <IconComponent size={s.iconSize} className="text-white" /> : <span className="text-white">{badge.icon}</span>
          ) : (
            <Lock size={s.iconSize - 4} className="text-gray-600" />
          )}
        </div>
      </div>
      <span className={`text-xs mt-2 text-center ${earned ? 'text-white' : 'text-gray-500'} max-w-[80px]`}>
        {badge.name}
      </span>
    </div>
  );
}
