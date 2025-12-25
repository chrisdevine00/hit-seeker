import React, { useRef } from 'react';
import { hapticSelection } from '../../lib/haptics';

export function DesktopSidebar({ tabs, activeTab, onTabChange, animatingTab, setAnimatingTab, onLogoLongPress }) {
  const longPressTimer = useRef(null);

  const handleLogoMouseDown = () => {
    if (!onLogoLongPress) return;
    longPressTimer.current = setTimeout(() => {
      onLogoLongPress();
      longPressTimer.current = null;
    }, 800); // 800ms long press
  };

  const handleLogoMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-16 bg-[#0d0d0d] border-r border-[#333] flex-col items-center py-4 z-40">
      {/* Logo - long press to toggle dev mode */}
      <div
        className="mb-8 cursor-pointer select-none"
        onMouseDown={handleLogoMouseDown}
        onMouseUp={handleLogoMouseUp}
        onMouseLeave={handleLogoMouseUp}
      >
        <span className="text-[#d4a855] font-bold text-xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
          H
        </span>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              hapticSelection();
              if (activeTab !== tab.id) {
                setAnimatingTab?.(tab.id);
              }
              onTabChange(tab.id);
            }}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'text-[#d4a855]'
                : 'text-[#aaaaaa] hover:bg-[#1a1a1a] hover:text-white'
            }`}
            title={tab.label}
          >
            <tab.icon
              size={22}
              className={animatingTab === tab.id ? 'animate-nav-pop' : ''}
              onAnimationEnd={() => setAnimatingTab?.(null)}
            />
          </button>
        ))}
      </div>
    </nav>
  );
}
