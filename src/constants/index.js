/**
 * Application Constants
 * Centralizes magic strings, storage keys, and configuration values
 */

// =============================================================================
// STORAGE KEYS
// =============================================================================
// All localStorage keys used by the application
export const STORAGE_KEYS = {
  ONBOARDED: 'hitseeker_onboarded',
  VIEW_MODE: 'hitseeker_view_mode',
  LEFT_HANDED: 'hitseeker_left_handed',
  HAPTICS: 'hitseeker_haptics',
  DEV_MODE: 'devModeEnabled',
  LAST_TRIP: 'hitSeeker_lastTrip', // Keep original casing for backwards compatibility
  BLOODIES: 'hitseeker_bloodies',
  EARNED_BADGES: 'hitseeker_earned_badges',
};

// =============================================================================
// TAB IDS
// =============================================================================
export const TAB_IDS = {
  HUNT: 'hunt',
  VP: 'vp',
  BLOODIES: 'bloodies',
  TRIP: 'trip',
};

// =============================================================================
// TRIP SUB-TAB IDS
// =============================================================================
export const TRIP_SUB_TAB_IDS = {
  OVERVIEW: 'overview',
  CASINOS: 'casinos',
  NOTES: 'notes',
  TEAM: 'team',
};

// =============================================================================
// SPOT TYPES
// =============================================================================
export const SPOT_TYPES = {
  SLOT: 'slot',
  VP: 'vp',
  BLOODY: 'bloody',
};

// =============================================================================
// VIEW MODES
// =============================================================================
export const VIEW_MODES = {
  CARDS: 'cards',
  LIST: 'list',
};

// =============================================================================
// MACHINE TIERS
// =============================================================================
export const MACHINE_TIERS = {
  TIER_1: 1, // Must Hit By
  TIER_2: 2, // Persistent State
  TIER_3: 3, // Entertainment
};

export const TIER_LABELS = {
  [MACHINE_TIERS.TIER_1]: 'Tier 1 - Must Hit By',
  [MACHINE_TIERS.TIER_2]: 'Tier 2 - Persistent State',
  [MACHINE_TIERS.TIER_3]: 'Tier 3 - Entertainment',
};

// =============================================================================
// TIER COLORS (Tailwind classes)
// =============================================================================
export const TIER_COLORS = {
  [MACHINE_TIERS.TIER_1]: {
    bg: 'bg-emerald-900/40',
    border: 'border-emerald-500',
    text: 'text-emerald-400',
    badge: 'bg-emerald-600',
    badgeOutline: 'border-emerald-500 text-emerald-400 bg-[#0d0d0d]',
  },
  [MACHINE_TIERS.TIER_2]: {
    bg: 'bg-amber-900/40',
    border: 'border-amber-500',
    text: 'text-amber-400',
    badge: 'bg-amber-600',
    badgeOutline: 'border-amber-500 text-amber-400 bg-[#0d0d0d]',
  },
  [MACHINE_TIERS.TIER_3]: {
    bg: 'bg-red-900/40',
    border: 'border-red-500',
    text: 'text-red-400',
    badge: 'bg-red-600',
    badgeOutline: 'border-red-500 text-red-400 bg-[#0d0d0d]',
  },
};

// Default fallback for unknown tiers
export const TIER_COLORS_DEFAULT = {
  bg: 'bg-gray-900/40',
  border: 'border-gray-500',
  text: 'text-gray-400',
  badge: 'bg-gray-600',
  badgeOutline: 'border-gray-500 text-gray-400 bg-[#0d0d0d]',
};

// Helper to get tier colors with fallback
export const getTierColors = (tier) => TIER_COLORS[tier] || TIER_COLORS_DEFAULT;

// =============================================================================
// NAV TABS CONFIGURATION
// =============================================================================
// Note: Icons must be imported where NAV_TABS is used
// This exports just the configuration, icons added at usage site
export const NAV_TAB_CONFIG = [
  { id: TAB_IDS.HUNT, iconName: 'Gem', label: 'Slots' },
  { id: TAB_IDS.VP, iconName: 'Spade', label: 'Video Poker' },
  { id: TAB_IDS.BLOODIES, iconName: 'GlassWater', label: 'Bloodies' },
  { id: TAB_IDS.TRIP, iconName: 'Map', label: 'Trip' },
];

// =============================================================================
// GEO STATUS
// =============================================================================
export const GEO_STATUS = {
  IDLE: 'idle',
  LOCATING: 'locating',
  SUCCESS: 'success',
  ERROR: 'error',
};

// =============================================================================
// APP CONFIG
// =============================================================================
export const APP_CONFIG = {
  DEV_EMAIL: 'christopher.devine@gmail.com',
  DEBOUNCE_MS: 300,
};
