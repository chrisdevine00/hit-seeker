/* eslint-disable react-refresh/only-export-components */
/**
 * DebugContext - Development and testing utilities
 * Handles debug mode state, geo simulation, and badge previewing
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useUI } from './UIContext';
import { hapticMedium } from '../lib/haptics';

const DebugContext = createContext(null);

// Test badges for previewing effects - organized by domain and tier
const TEST_BADGES = {
  // By tier (slot domain)
  'common': { id: 'test-common', name: 'First Spot', description: 'Log your first slot spot', icon: 'target', color: 'amber', effect: 'none', tier: 'common', domain: 'slot' },
  'uncommon': { id: 'test-uncommon', name: 'Sharp Eye', description: 'Log 10 slot spots', icon: 'eye', color: 'amber', effect: 'confetti', tier: 'uncommon', domain: 'slot' },
  'rare': { id: 'test-rare', name: 'Quarter Century', description: 'Log 25 slot spots', icon: 'hash', color: 'gold', effect: 'confetti', tier: 'rare', domain: 'slot' },
  'epic': { id: 'test-epic', name: 'Half Ton', description: 'Log 50 slot spots', icon: 'trophy', color: 'gold', effect: 'confetti', tier: 'epic', domain: 'slot' },
  'legendary': { id: 'test-legendary', name: 'Centurion', description: 'Log 100 slot spots', icon: 'crown', color: 'gold', effect: 'explode', tier: 'legendary', domain: 'slot' },
  // By domain
  'slot': { id: 'test-slot', name: 'Golden Eye', description: 'Mark 25 spots as Playable', icon: 'sparkles', color: 'gold', effect: 'confetti', tier: 'epic', domain: 'slot' },
  'vp': { id: 'test-vp', name: 'Holy Grail', description: 'Find a 100%+ return table', icon: 'gem', color: 'green', effect: 'confetti', tier: 'epic', domain: 'vp' },
  'bloody': { id: 'test-bloody', name: 'Strip Crawler', description: '5 different Strip casinos', icon: 'dices', color: 'red', effect: 'confetti', tier: 'epic', domain: 'bloody' },
  'trip': { id: 'test-trip', name: 'Vegas Regular', description: 'Trip in consecutive months', icon: 'calendar-check', color: 'emerald', effect: 'confetti', tier: 'epic', domain: 'trip' },
  // Spicy badge (fire effect)
  'spicy': { id: 'test-spicy', name: 'First Flame', description: 'Log your first spicy bloody', icon: 'flame', color: 'red', effect: 'fire', tier: 'common', domain: 'bloody' },
};

export function DebugProvider({ children }) {
  const { devModeEnabled, toggleDevMode } = useUI();

  // =============================================================================
  // DEBUG STATE
  // =============================================================================

  // Debug mode for testing check-in flows
  // Options: 'near-casino' | 'not-near' | 'error' | null
  const [debugGeoMode, setDebugGeoMode] = useState(null);

  // Debug menu visibility
  const [showDebugMenu, setShowDebugMenu] = useState(false);

  // Strategy validator modal
  const [showStrategyValidator, setShowStrategyValidator] = useState(false);

  // Badge preview state
  const [previewBadges, setPreviewBadges] = useState([]);

  // =============================================================================
  // DEBUG ACTIONS
  // =============================================================================

  const handlePreviewBadge = useCallback((badgeKey) => {
    console.log('Preview badge triggered:', badgeKey, TEST_BADGES[badgeKey]);
    setShowDebugMenu(false);
    const badge = TEST_BADGES[badgeKey];
    if (badge) {
      setPreviewBadges([badge]);
    }
  }, []);

  const clearPreviewBadges = useCallback(() => {
    setPreviewBadges([]);
  }, []);

  // Toggle dev mode with haptic feedback and close menu when disabling
  const handleToggleDevMode = useCallback(() => {
    toggleDevMode();
    if (devModeEnabled) setShowDebugMenu(false);
    hapticMedium();
  }, [devModeEnabled, toggleDevMode]);

  const openDebugMenu = useCallback(() => {
    setShowDebugMenu(true);
  }, []);

  const closeDebugMenu = useCallback(() => {
    setShowDebugMenu(false);
  }, []);

  const openStrategyValidator = useCallback(() => {
    setShowStrategyValidator(true);
  }, []);

  const closeStrategyValidator = useCallback(() => {
    setShowStrategyValidator(false);
  }, []);

  // Simulated geolocation for testing
  const simulateGeolocation = useCallback((mode) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mode === 'near-casino') {
          // Simulate being at Bellagio
          resolve({ coords: { latitude: 36.1129, longitude: -115.1765 } });
        } else if (mode === 'not-near') {
          // Simulate being far from any casino
          resolve({ coords: { latitude: 40.7128, longitude: -74.0060 } }); // NYC
        } else if (mode === 'error') {
          reject(new Error('Geolocation error'));
        }
      }, 800); // Simulate network delay
    });
  }, []);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================
  const value = {
    // State
    debugGeoMode,
    setDebugGeoMode,
    showDebugMenu,
    setShowDebugMenu,
    showStrategyValidator,
    setShowStrategyValidator,
    previewBadges,
    setPreviewBadges,

    // Actions
    handlePreviewBadge,
    clearPreviewBadges,
    handleToggleDevMode,
    openDebugMenu,
    closeDebugMenu,
    openStrategyValidator,
    closeStrategyValidator,
    simulateGeolocation,

    // Constants
    TEST_BADGES,
  };

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
}
