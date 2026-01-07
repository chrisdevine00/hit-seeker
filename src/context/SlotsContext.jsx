/* eslint-disable react-refresh/only-export-components */
/**
 * SlotsContext - Centralized slot machine state management
 * Handles machine selection, filtering, and view preferences
 */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useStorage, useDebounce } from '../hooks';
import { STORAGE_KEYS, VIEW_MODES } from '../constants';
import { machines as machineData } from '../data/machines';

const SlotsContext = createContext(null);

export function SlotsProvider({ children }) {
  // =============================================================================
  // SELECTION STATE
  // =============================================================================
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [recentMachines, setRecentMachines] = useState([]);

  // =============================================================================
  // FILTER STATE
  // =============================================================================
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [apOnly, setApOnly] = useState(false);
  const [releaseYearFilter, setReleaseYearFilter] = useState('all');

  // =============================================================================
  // VIEW PREFERENCES (persisted)
  // =============================================================================
  const [machineViewMode, setMachineViewMode] = useStorage(STORAGE_KEYS.VIEW_MODE, VIEW_MODES.CARDS);

  // =============================================================================
  // CALCULATOR STATE (for MHB machines)
  // =============================================================================
  const [calcCurrent, setCalcCurrent] = useState('');
  const [calcCeiling, setCalcCeiling] = useState('');

  // =============================================================================
  // DERIVED STATE
  // =============================================================================

  // Calculate MHB percentage
  const calcResult = useMemo(() => {
    const c = parseFloat(calcCurrent);
    const ceil = parseFloat(calcCeiling);
    return (!isNaN(c) && !isNaN(ceil) && ceil > 0) ? ((c / ceil) * 100).toFixed(1) : null;
  }, [calcCurrent, calcCeiling]);

  // Filter machines based on search, category, AP toggle, and year
  const filteredMachines = useMemo(() => {
    return machineData.filter(m => {
      // Safeguard: ensure this is a valid machine entry with required fields
      if (!m.id || !m.tier || !m.name) return false;

      // AP Only filter: exclude tier 3 (entertainment)
      if (apOnly && m.tier === 3) return false;

      // Category filter
      if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;

      // Year filter
      if (releaseYearFilter !== 'all' && m.releaseYear !== parseInt(releaseYearFilter)) return false;

      // Search filter
      if (debouncedSearch && !m.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;

      return true;
    });
  }, [debouncedSearch, selectedCategory, apOnly, releaseYearFilter]);

  // Count AP machines for toggle label
  const apCount = useMemo(() => {
    return machineData.filter(m => m.id && m.category !== 'entertainment').length;
  }, []);

  // Total machine count
  const totalCount = machineData.length;

  // =============================================================================
  // SELECTION ACTIONS
  // =============================================================================
  const selectMachine = useCallback((machine) => {
    setSelectedMachine(machine);
    if (machine) {
      setRecentMachines(prev => {
        const filtered = prev.filter(m => m.id !== machine.id);
        return [machine, ...filtered].slice(0, 5); // Keep last 5
      });
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMachine(null);
  }, []);

  // =============================================================================
  // FILTER ACTIONS
  // =============================================================================
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setApOnly(false);
    setReleaseYearFilter('all');
  }, []);

  const updateViewMode = useCallback((mode) => {
    setMachineViewMode(mode);
  }, [setMachineViewMode]);

  // =============================================================================
  // CALCULATOR ACTIONS
  // =============================================================================
  const resetCalculator = useCallback(() => {
    setCalcCurrent('');
    setCalcCeiling('');
  }, []);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================
  const value = {
    // Selection state
    selectedMachine,
    setSelectedMachine,
    recentMachines,
    selectMachine,
    clearSelection,

    // Filter state
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    selectedCategory,
    setSelectedCategory,
    apOnly,
    setApOnly,
    releaseYearFilter,
    setReleaseYearFilter,

    // Filter actions
    clearFilters,

    // View preferences
    machineViewMode,
    setMachineViewMode,
    updateViewMode,

    // Calculator state
    calcCurrent,
    setCalcCurrent,
    calcCeiling,
    setCalcCeiling,
    calcResult,
    resetCalculator,

    // Derived state
    filteredMachines,
    apCount,
    totalCount,

    // Raw data access
    machines: machineData,
  };

  return (
    <SlotsContext.Provider value={value}>
      {children}
    </SlotsContext.Provider>
  );
}

export function useSlots() {
  const context = useContext(SlotsContext);
  if (!context) {
    throw new Error('useSlots must be used within a SlotsProvider');
  }
  return context;
}
