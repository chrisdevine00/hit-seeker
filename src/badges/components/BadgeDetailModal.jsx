import React, { useEffect } from 'react';
import { Lock, Check } from 'lucide-react';
import { BADGE_COLORS } from '../definitions/badgeColors';
import { BADGE_ICONS } from '../definitions/badgeIcons';
import { Button } from '../../components/ui';

// Badge Detail Modal
export function BadgeDetailModal({ badge, earned, onClose }) {
  // Escape key to close
  useEffect(() => {
    if (!badge) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [badge, onClose]);

  if (!badge) return null;

  const colors = earned ? BADGE_COLORS[badge.color] : { outline: 'from-gray-600 to-gray-800', fill: 'from-gray-800/50 to-gray-900/50' };
  const IconComponent = BADGE_ICONS[badge.icon];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
        {/* Large hexagon badge */}
        <div
          className={`w-32 h-[140px] bg-gradient-to-b ${colors.outline} flex items-center justify-center mx-auto mb-4 ${earned ? '' : 'opacity-40'}`}
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
          <div
            className={`w-28 h-[123px] bg-gradient-to-b ${colors.fill} flex items-center justify-center`}
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
          >
            {earned ? (
              IconComponent ? <IconComponent size={48} className="text-white" /> : null
            ) : (
              <Lock size={32} className="text-gray-600" />
            )}
          </div>
        </div>

        <h2 className={`text-2xl font-bold mb-2 ${earned ? 'text-white' : 'text-gray-500'}`}>
          {badge.name}
        </h2>
        <p className={`${earned ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
          {badge.description}
        </p>
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
          earned ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' : 'bg-gray-800 text-gray-500 border border-gray-700'
        }`}>
          {earned ? <><Check size={12} /> Unlocked</> : 'Locked'}
        </span>

        <Button
          onClick={onClose}
          variant="secondary"
          className="mx-auto mt-6"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
