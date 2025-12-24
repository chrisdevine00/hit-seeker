import React from 'react';

export function DesktopSidebar({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-16 bg-[#0d0d0d] border-r border-[#333] flex-col items-center py-4 z-40">
      {/* Logo */}
      <div className="mb-8">
        <span className="text-[#d4a855] font-bold text-xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
          H
        </span>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-[#d4a855]/20 text-[#d4a855]'
                : 'text-[#aaaaaa] hover:bg-[#1a1a1a] hover:text-white'
            }`}
            title={tab.label}
          >
            <tab.icon size={22} />
          </button>
        ))}
      </div>
    </nav>
  );
}
