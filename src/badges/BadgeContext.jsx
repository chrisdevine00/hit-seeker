/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { BLOODY_BADGES, SLOT_BADGES, VP_BADGES, TRIP_BADGES } from './definitions';
import { checkBloodyBadges, checkSlotBadges, checkVPBadges, checkTripBadges } from './checkers';
import { STORAGE_KEYS } from '../constants';

const BadgeContext = createContext(null);

export function BadgeProvider({ children }) {
  // Bloodies state (stored in localStorage)
  const [bloodies, setBloodies] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BLOODIES);
    return saved ? JSON.parse(saved) : [];
  });

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

  // Track if initial load is complete (skip unlock celebrations on first load)
  const isInitializedRef = useRef(false);

  // Save bloodies to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOODIES, JSON.stringify(bloodies));
  }, [bloodies]);

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

  // Compute bloody badges when bloodies change
  useEffect(() => {
    const newEarned = checkBloodyBadges(bloodies);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derived state from bloodies
    setEarnedBadges(prev => ({ ...prev, bloody: newEarned }));
  }, [bloodies]);

  // Detect new badge unlocks for all domains
  useEffect(() => {
    // Skip unlock celebrations on initial load
    if (!isInitializedRef.current) {
      // Mark as initialized after a short delay to allow all initial badge computations
      const timer = setTimeout(() => {
        isInitializedRef.current = true;
      }, 1000);
      // Always update prevEarnedRef to current state (fixes stale closure issue)
      prevEarnedRef.current = earnedBadges;
      return () => clearTimeout(timer);
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
        if (!prevDomain.has(badgeId)) {
          const badge = badges.find(b => b.id === badgeId);
          if (badge) newlyEarned.push(badge);
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

  // Add a bloody
  const addBloody = useCallback((bloodyData) => {
    const newBloody = {
      id: Date.now().toString(),
      ...bloodyData,
      timestamp: bloodyData.timestamp || new Date().toISOString(),
    };
    setBloodies(prev => [...prev, newBloody]);
    return newBloody;
  }, []);

  // Update slot badges from slot notes
  const updateSlotBadges = useCallback((slotNotes, photos = {}) => {
    const newEarned = checkSlotBadges(slotNotes, photos);
    setEarnedBadges(prev => ({ ...prev, slot: newEarned }));
  }, []);

  // Update VP badges from VP notes
  const updateVPBadges = useCallback((vpNotes, photos = {}) => {
    const newEarned = checkVPBadges(vpNotes, photos);
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
    // Bloodies data
    bloodies,
    addBloody,

    // Badge update methods
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
