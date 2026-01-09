/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { BLOODY_BADGES, SLOT_BADGES, VP_BADGES, TRIP_BADGES } from './definitions';
import { checkBloodyBadges, checkSlotBadges, checkVPBadges, checkTripBadges } from './checkers';
import { STORAGE_KEYS } from '../constants';

const BadgeContext = createContext(null);

export function BadgeProvider({ children }) {
  // Load earned badges from localStorage
  const loadEarnedBadges = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EARNED_BADGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          bloody: new Set(parsed.bloody || []),
          slot: new Set(parsed.slot || []),
          vp: new Set(parsed.vp || []),
          trip: new Set(parsed.trip || []),
        };
      }
    } catch (e) {
      console.error('Failed to load earned badges:', e);
    }
    return {
      bloody: new Set(),
      slot: new Set(),
      vp: new Set(),
      trip: new Set(),
    };
  };

  // Track earned badges for each domain
  const [earnedBadges, setEarnedBadges] = useState(loadEarnedBadges);

  // Queue of badges to show unlock modal for
  const [unlockQueue, setUnlockQueue] = useState([]);

  // Previous earned badges for detecting new unlocks - initialize from storage
  const prevEarnedRef = useRef(loadEarnedBadges());

  // Track mount time for initialization window (set on first effect run)
  const mountTimeRef = useRef(null);

  // Track badges that have been queued/celebrated this session (prevents duplicates)
  const celebratedThisSessionRef = useRef(new Set());

  // Set mount time on first render (in effect to avoid impure function in render)
  useEffect(() => {
    if (mountTimeRef.current === null) {
      mountTimeRef.current = Date.now();
    }
  }, []);

  // Save earned badges to localStorage
  useEffect(() => {
    const toSave = {
      bloody: Array.from(earnedBadges.bloody || []),
      slot: Array.from(earnedBadges.slot || []),
      vp: Array.from(earnedBadges.vp || []),
      trip: Array.from(earnedBadges.trip || []),
    };
    localStorage.setItem(STORAGE_KEYS.EARNED_BADGES, JSON.stringify(toSave));
  }, [earnedBadges]);

  // Detect new badge unlocks for all domains
  useEffect(() => {
    // Skip unlock celebrations during initialization window (3 seconds after mount)
    // This allows all data sources (notes, trips, bloodies) to load before detecting changes
    const mountTime = mountTimeRef.current;

    // If mountTime not set yet, we're still initializing
    if (mountTime === null) {
      // Mark all current badges as already celebrated (prevents firing on load)
      Object.values(earnedBadges).forEach(domainSet => {
        if (domainSet) domainSet.forEach(id => celebratedThisSessionRef.current.add(id));
      });
      prevEarnedRef.current = earnedBadges;
      return;
    }

    const timeSinceMount = Date.now() - mountTime;
    const isInitializing = timeSinceMount < 3000;

    if (isInitializing) {
      // During initialization, mark all badges as celebrated and sync refs
      Object.values(earnedBadges).forEach(domainSet => {
        if (domainSet) domainSet.forEach(id => celebratedThisSessionRef.current.add(id));
      });
      prevEarnedRef.current = earnedBadges;
      return;
    }

    const newlyEarned = [];
    const domainBadges = {
      bloody: BLOODY_BADGES,
      slot: SLOT_BADGES,
      vp: VP_BADGES,
      trip: TRIP_BADGES,
    };

    // Check all domains for new badges
    Object.entries(domainBadges).forEach(([domain, badges]) => {
      const prevDomain = prevEarnedRef.current[domain] || new Set();
      const currentDomain = earnedBadges[domain] || new Set();

      currentDomain.forEach(badgeId => {
        // Skip if already celebrated this session (prevents duplicates)
        if (celebratedThisSessionRef.current.has(badgeId)) {
          return;
        }

        if (!prevDomain.has(badgeId)) {
          const badge = badges.find(b => b.id === badgeId);
          if (badge) {
            newlyEarned.push(badge);
            // Mark as celebrated to prevent duplicates
            celebratedThisSessionRef.current.add(badgeId);
          }
        }
      });
    });

    // Add newly earned to unlock queue
    if (newlyEarned.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- queue new badges for celebration
      setUnlockQueue(prev => [...prev, ...newlyEarned]);
    }

    // Update ref
    prevEarnedRef.current = earnedBadges;
  }, [earnedBadges]);

  // Update bloody badges from bloodies data
  const updateBloodyBadges = useCallback((bloodies) => {
    const newEarned = checkBloodyBadges(bloodies);
    setEarnedBadges(prev => ({ ...prev, bloody: newEarned }));
  }, []);

  // Update slot badges from slot notes
  const updateSlotBadges = useCallback((slotNotes) => {
    const newEarned = checkSlotBadges(slotNotes);
    setEarnedBadges(prev => ({ ...prev, slot: newEarned }));
  }, []);

  // Update VP badges from VP notes
  const updateVPBadges = useCallback((vpNotes) => {
    const newEarned = checkVPBadges(vpNotes);
    setEarnedBadges(prev => ({ ...prev, vp: newEarned }));
  }, []);

  // Update trip badges from trip data
  const updateTripBadges = useCallback((trips, tripMembers, checkIns, userId) => {
    const newEarned = checkTripBadges(trips, tripMembers, checkIns, userId);
    setEarnedBadges(prev => ({ ...prev, trip: newEarned }));
  }, []);

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
      case 'bloody':
        return BLOODY_BADGES;
      case 'slot':
        return SLOT_BADGES;
      case 'vp':
        return VP_BADGES;
      case 'trip':
        return TRIP_BADGES;
      default:
        return [];
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
    // Badge update methods
    updateBloodyBadges,
    updateSlotBadges,
    updateVPBadges,
    updateTripBadges,

    // Earned badges by domain
    earnedBadges,

    // Unlock queue
    unlockQueue,
    dismissBadge,
    clearUnlockQueue,

    // Badge utilities
    getBadgesForDomain,
    isBadgeEarned,
    getEarnedCount,
    getTotalCount,
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
