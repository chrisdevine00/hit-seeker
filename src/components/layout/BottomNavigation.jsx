import React from 'react';
import { Plus, Gem, Spade, GlassWater, Map } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useSlots } from '../../context/SlotsContext';
import { hapticSelection, hapticMedium } from '../../lib/haptics';
import { TAB_IDS } from '../../constants';

// Tab navigation configuration
const NAV_TABS = [
  { id: TAB_IDS.HUNT, icon: Gem, label: 'Slots' },
  { id: TAB_IDS.VP, icon: Spade, label: 'Video Poker' },
  { id: TAB_IDS.BLOODIES, icon: GlassWater, label: 'Bloodies' },
  { id: TAB_IDS.TRIP, icon: Map, label: 'Trip' }
];

/**
 * BottomNavigation - Mobile bottom nav bar with FAB
 * Includes tab buttons and floating action button for adding spots
 */
export function BottomNavigation() {
  const {
    activeTab,
    setActiveTab,
    animatingTab,
    setAnimatingTab,
    setSelectedCasino,
    leftHandedMode,
    setShowSpotter,
    setSpotterData,
  } = useUI();
  const { setSelectedMachine } = useSlots();

  const handleTabChange = (tabId) => {
    hapticSelection();
    if (activeTab !== tabId) {
      setAnimatingTab(tabId);
    }
    setActiveTab(tabId);
    setSelectedMachine(null);
    setSelectedCasino(null);
  };

  const handleAddSpot = () => {
    hapticMedium();
    setSpotterData({ type: 'slot' });
    setShowSpotter(true);
  };

  // FAB spacer JSX - inlined to avoid component-during-render issue
  const fabSpacer = (
    <div className="flex flex-col items-center py-2 px-5 relative">
      <div className="w-[32px] h-[22px]" />
      <span className="text-xs mt-1 font-medium opacity-0">Add</span>
      <button
        onClick={handleAddSpot}
        className="absolute -top-7 left-1/2 -translate-x-1/2"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4a855] to-amber-600 flex items-center justify-center shadow-lg shadow-[#d4a855]/30">
          <Plus size={32} className="text-black" strokeWidth={2.5} />
        </div>
      </button>
    </div>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-[#333] px-4 py-2 md:hidden">
      {/* SVG gradient definitions for tab icons */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="nav-tab-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4a855" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="liquid-fill-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="45%" stopColor="transparent" />
            <stop offset="50%" stopColor="#d4a855" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex justify-around items-end max-w-md mx-auto relative">
        {/* FAB spacer - first position if left-handed */}
        {leftHandedMode && fabSpacer}

        {/* All nav tabs */}
        {NAV_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className="flex flex-col items-center py-2 px-3"
          >
            <tab.icon
              size={22}
              className={animatingTab === tab.id ? 'animate-nav-pop' : ''}
              onAnimationEnd={() => setAnimatingTab(null)}
              stroke={activeTab === tab.id ? 'url(#nav-tab-gradient)' : '#aaaaaa'}
              fill={activeTab === tab.id && tab.id === 'bloodies' ? 'url(#liquid-fill-gradient)' : 'none'}
            />
            <span className={`text-xs mt-1 font-medium ${
              activeTab === tab.id ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 bg-clip-text text-transparent' : 'text-[#aaaaaa]'
            }`}>{tab.label}</span>
          </button>
        ))}

        {/* FAB spacer - last position if right-handed (default) */}
        {!leftHandedMode && fabSpacer}
      </div>
    </nav>
  );
}
