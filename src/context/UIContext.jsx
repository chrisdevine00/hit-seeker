/* eslint-disable react-refresh/only-export-components */
/**
 * UIContext - Centralized UI state management
 * Handles navigation, modals, and user preferences
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useStorage } from '../hooks';
import { STORAGE_KEYS, TAB_IDS } from '../constants';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  // =============================================================================
  // NAVIGATION STATE
  // =============================================================================
  const [activeTab, setActiveTab] = useState(TAB_IDS.HUNT);
  const [animatingTab, setAnimatingTab] = useState(null);
  const [tripSubTab, setTripSubTab] = useState('overview');
  const [previousTab, setPreviousTab] = useState(null);
  const [selectedCasino, setSelectedCasino] = useState(null);

  // =============================================================================
  // MODAL STATE
  // =============================================================================
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showSpotter, setShowSpotter] = useState(false);
  const [spotterData, setSpotterData] = useState(null);
  const [showTripSettings, setShowTripSettings] = useState(false);
  const [showTierHelp, setShowTierHelp] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [pendingCheckIn, setPendingCheckIn] = useState(null);

  // Onboarding state
  const [hasOnboarded, setHasOnboarded] = useStorage(STORAGE_KEYS.ONBOARDED, false);
  const [showOnboarding, setShowOnboarding] = useState(!hasOnboarded);
  const [onboardingStep, setOnboardingStep] = useState(1);

  // =============================================================================
  // USER PREFERENCES (persisted)
  // =============================================================================
  const [leftHandedMode, setLeftHandedMode] = useStorage(STORAGE_KEYS.LEFT_HANDED, false);
  const [hapticsEnabled, setHapticsEnabled] = useStorage(STORAGE_KEYS.HAPTICS, true);
  const [devModeEnabled, setDevModeEnabled] = useStorage(STORAGE_KEYS.DEV_MODE, false);

  // =============================================================================
  // NAVIGATION ACTIONS
  // =============================================================================
  const navigateToTab = useCallback((tabId, options = {}) => {
    const { savePrevious = false } = options;
    if (savePrevious) {
      setPreviousTab(activeTab);
    }
    setAnimatingTab(tabId);
    setActiveTab(tabId);
  }, [activeTab]);

  const goBack = useCallback(() => {
    if (previousTab) {
      setActiveTab(previousTab);
      setPreviousTab(null);
    }
  }, [previousTab]);

  // =============================================================================
  // MODAL ACTIONS
  // =============================================================================
  const openSpotter = useCallback((data) => {
    setSpotterData(data);
    setShowSpotter(true);
  }, []);

  const closeSpotter = useCallback(() => {
    setShowSpotter(false);
    setSpotterData(null);
  }, []);

  const openPhotoViewer = useCallback((photo) => {
    setViewingPhoto(photo);
  }, []);

  const closePhotoViewer = useCallback(() => {
    setViewingPhoto(null);
  }, []);

  const completeOnboarding = useCallback(() => {
    setHasOnboarded(true);
    setShowOnboarding(false);
    setOnboardingStep(1);
  }, [setHasOnboarded]);

  // =============================================================================
  // PREFERENCE ACTIONS
  // =============================================================================
  const toggleLeftHandedMode = useCallback(() => {
    setLeftHandedMode(prev => !prev);
  }, [setLeftHandedMode]);

  const toggleHaptics = useCallback(() => {
    setHapticsEnabled(prev => !prev);
  }, [setHapticsEnabled]);

  const toggleDevMode = useCallback(() => {
    setDevModeEnabled(prev => !prev);
  }, [setDevModeEnabled]);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================
  const value = {
    // Navigation state
    activeTab,
    setActiveTab,
    animatingTab,
    setAnimatingTab,
    tripSubTab,
    setTripSubTab,
    previousTab,
    setPreviousTab,
    selectedCasino,
    setSelectedCasino,

    // Navigation actions
    navigateToTab,
    goBack,

    // Modal state
    showNoteForm,
    setShowNoteForm,
    showSpotter,
    setShowSpotter,
    spotterData,
    setSpotterData,
    showTripSettings,
    setShowTripSettings,
    showTierHelp,
    setShowTierHelp,
    confirmDelete,
    setConfirmDelete,
    viewingPhoto,
    setViewingPhoto,
    pendingCheckIn,
    setPendingCheckIn,

    // Onboarding
    hasOnboarded,
    showOnboarding,
    setShowOnboarding,
    onboardingStep,
    setOnboardingStep,
    completeOnboarding,

    // Modal actions
    openSpotter,
    closeSpotter,
    openPhotoViewer,
    closePhotoViewer,

    // Preferences
    leftHandedMode,
    setLeftHandedMode,
    hapticsEnabled,
    setHapticsEnabled,
    toggleHaptics,
    devModeEnabled,
    setDevModeEnabled,
    toggleLeftHandedMode,
    toggleDevMode,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
