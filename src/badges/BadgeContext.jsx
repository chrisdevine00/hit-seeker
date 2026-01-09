/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { BLOODY_BADGES, SLOT_BADGES, VP_BADGES, TRIP_BADGES } from './definitions';
import { checkBloodyBadges, checkSlotBadges, checkVPBadges, checkTripBadges } from './checkers';

const BadgeContext = createContext(null);

// Storage key for badges that have had their celebration shown
const CELEBRATED_BADGES_KEY = 'hs_celebrated_badges';

function loadCelebratedBadges() {
  try {
    const saved = localStorage.getItem(CELEBRATED_BADGES_KEY);
    if (saved) {
      return new Set(JSON.parse(saved));
    }
  } catch (e) {
    console.error('Failed to load celebrated badges:', e);
  }
  return new Set();
}

function saveCelebratedBadges(celebrated) {
  try {
    localStorage.setItem(CELEBRATED_BADGES_KEY, JSON.stringify(Array.from(celebrated)));
  } catch (e) {
    console.error('Failed to save celebrated badges:', e);
  }
}

// Domains that need initialization
const BADGE_DOMAINS = ['bloody', 'slot', 'vp', 'trip'];

export function BadgeProvider({ children }) {
  // Earned badges - computed from actual data
  const [earnedBadges, setEarnedBadges] = useState({
    bloody: new Set(),
    slot: new Set(),
    vp: new Set(),
    trip: new Set(),
  });

  // Celebrated badges - persisted
  const celebratedBadgesRef = useRef(loadCelebratedBadges());

  // Track which domains have been initialized (first data load)
  // On first load of each domain, we mark all earned badges as celebrated (silently)
  const initializedDomainsRef = useRef(new Set());

  // Queue of badges to show unlock modal for
  const [unlockQueue, setUnlockQueue] = useState([]);

  // Get badge definition by ID
  const getBadgeById = useCallback((badgeId) => {
    const allBadges = [...BLOODY_BADGES, ...SLOT_BADGES, ...VP_BADGES, ...TRIP_BADGES];
    return allBadges.find(b => b.id === badgeId);
  }, []);

  /**
   * Celebrate new badges - call this AFTER a user action with ONLY the newly earned badges
   * The caller is responsible for computing before/after diff
   */
  const celebrateNewBadges = useCallback((newlyEarnedByDomain) => {
    const badgesToCelebrate = [];

    // Collect all badge objects for the newly earned IDs
    Object.values(newlyEarnedByDomain).forEach(domainSet => {
      if (domainSet && domainSet.size > 0) {
        domainSet.forEach(badgeId => {
          const badge = getBadgeById(badgeId);
          if (badge) {
            badgesToCelebrate.push(badge);
            // Mark as celebrated
            celebratedBadgesRef.current.add(badgeId);
          }
        });
      }
    });

    if (badgesToCelebrate.length > 0) {
      saveCelebratedBadges(celebratedBadgesRef.current);
      setUnlockQueue(prev => [...prev, ...badgesToCelebrate]);
    }

    return badgesToCelebrate;
  }, [getBadgeById]);

  /**
   * Mark badges as celebrated without showing celebration
   * Use this on initial load to prevent mass celebrations
   */
  const markAsCelebrated = useCallback((badgeIds) => {
    badgeIds.forEach(id => celebratedBadgesRef.current.add(id));
    saveCelebratedBadges(celebratedBadgesRef.current);
  }, []);

  /**
   * Mark all currently earned badges as celebrated (for initial load)
   */
  const markAllEarnedAsCelebrated = useCallback(() => {
    Object.values(earnedBadges).forEach(domainSet => {
      if (domainSet) {
        domainSet.forEach(badgeId => {
          celebratedBadgesRef.current.add(badgeId);
        });
      }
    });
    saveCelebratedBadges(celebratedBadgesRef.current);
  }, [earnedBadges]);

  // Helper to mark badges as celebrated on first domain load
  const initializeDomain = useCallback((domain, earnedSet) => {
    if (!initializedDomainsRef.current.has(domain)) {
      initializedDomainsRef.current.add(domain);
      // Mark all currently earned badges as celebrated (silently, no celebration)
      let changed = false;
      earnedSet.forEach(badgeId => {
        if (!celebratedBadgesRef.current.has(badgeId)) {
          celebratedBadgesRef.current.add(badgeId);
          changed = true;
        }
      });
      if (changed) {
        saveCelebratedBadges(celebratedBadgesRef.current);
      }
    }
  }, []);

  // Update bloody badges - returns the new earned set for celebration checking
  const updateBloodyBadges = useCallback((bloodies) => {
    const newEarned = checkBloodyBadges(bloodies);
    // On first load of this domain, mark all earned as celebrated (no celebration)
    initializeDomain('bloody', newEarned);
    setEarnedBadges(prev => ({ ...prev, bloody: newEarned }));
    return newEarned;
  }, [initializeDomain]);

  // Update slot badges
  const updateSlotBadges = useCallback((slotNotes) => {
    const newEarned = checkSlotBadges(slotNotes);
    initializeDomain('slot', newEarned);
    setEarnedBadges(prev => ({ ...prev, slot: newEarned }));
    return newEarned;
  }, [initializeDomain]);

  // Update VP badges
  const updateVPBadges = useCallback((vpNotes) => {
    const newEarned = checkVPBadges(vpNotes);
    initializeDomain('vp', newEarned);
    setEarnedBadges(prev => ({ ...prev, vp: newEarned }));
    return newEarned;
  }, [initializeDomain]);

  // Update trip badges
  const updateTripBadges = useCallback((trips, tripMembers, checkIns, userId) => {
    const newEarned = checkTripBadges(trips, tripMembers, checkIns, userId);
    initializeDomain('trip', newEarned);
    setEarnedBadges(prev => ({ ...prev, trip: newEarned }));
    return newEarned;
  }, [initializeDomain]);

  // Dismiss a badge from unlock queue
  const dismissBadge = useCallback(() => {
    setUnlockQueue(prev => prev.slice(1));
  }, []);

  // Clear unlock queue
  const clearUnlockQueue = useCallback(() => {
    setUnlockQueue([]);
  }, []);

  // Get all badges for a domain
  const getBadgesForDomain = useCallback((domain) => {
    switch (domain) {
      case 'bloody': return BLOODY_BADGES;
      case 'slot': return SLOT_BADGES;
      case 'vp': return VP_BADGES;
      case 'trip': return TRIP_BADGES;
      default: return [];
    }
  }, []);

  // Check if a badge is earned
  const isBadgeEarned = useCallback((badgeId, domain = 'bloody') => {
    return earnedBadges[domain]?.has(badgeId) || false;
  }, [earnedBadges]);

  // Get earned count for a domain
  const getEarnedCount = useCallback((domain) => {
    return earnedBadges[domain]?.size || 0;
  }, [earnedBadges]);

  // Get total count for a domain
  const getTotalCount = useCallback((domain) => {
    return getBadgesForDomain(domain).length;
  }, [getBadgesForDomain]);

  const value = {
    updateBloodyBadges,
    updateSlotBadges,
    updateVPBadges,
    updateTripBadges,
    earnedBadges,
    unlockQueue,
    dismissBadge,
    clearUnlockQueue,
    getBadgesForDomain,
    isBadgeEarned,
    getEarnedCount,
    getTotalCount,
    // New methods for explicit celebration control
    celebrateNewBadges,
    markAsCelebrated,
    markAllEarnedAsCelebrated,
  };

  return (
    <BadgeContext.Provider value={value}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadges() {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('useBadges must be used within a BadgeProvider');
  }
  return context;
}
