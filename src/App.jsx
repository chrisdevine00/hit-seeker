import React, { useState, useEffect, useRef } from 'react';
import { Search, Calculator, ChevronRight, ChevronDown, ChevronUp, Check, X, AlertTriangle, Info, Home, List, Building2, StickyNote, Trash2, Edit3, Eye, MapPin, Target, ChevronLeft, Navigation, LogOut, CheckCircle2, Camera, ImagePlus, Users, Share2, Copy, RefreshCw, Loader2, Grid, LayoutList, Crosshair, Map, BookOpen, Spade, Heart, Diamond, Club, Gem, GlassWater, Flame, Sparkles, Star, Lock, Plus } from 'lucide-react';

// Badge system imports
import {
  BADGE_COLORS,
  BADGE_ICONS,
  BLOODY_BADGES,
  checkBloodyBadges,
  HexBadge,
  BadgeDetailModal,
  BadgeUnlockModal,
  BadgeProvider,
  useBadges,
} from './badges';

// Lib imports
import { supabase } from './lib/supabase';
import { theme, injectGlobalStyles } from './lib/theme';
import { hapticLight, hapticMedium, hapticSelection, hapticSuccess, hapticCelebration } from './lib/haptics';

// Context imports
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrip } from './context/TripContext';

// Hook imports  
import { useNotes, usePhotos, useCheckIns, useDebounce } from './hooks';

// Data imports
import { machineCategories, machines } from './data/machines';
import { vpCategories, vpGames } from './data/vpGames';
import { 
  PAY_TABLE_STRATEGIES, 
  STRATEGY_HIERARCHIES, 
  WOO_RANK_VALUES, 
  WOO_HIGH_CARDS,
  analyzeHandForWoO,
  getWoOStrategyRecommendation,
  getDeucesWildWoORecommendation,
  getJokerPokerWoORecommendation,
  getBonusDeucesWildWoORecommendation,
  getLooseDeucesWoORecommendation,
  getJokerPokerKingsWoORecommendation
} from './data/vpStrategies';
import { strategyTestCases, runAllStrategyTests } from './data/vpTestCases';
import { vegasCasinos } from './data/casinos';

// Utility imports
import { compressImage, formatRelativeTime } from './utils';
import { SUITS, RANKS, RANK_VALUES, HIGH_CARDS, evaluateHand, analyzeDraws } from './utils/vpAnalysis';

// Screen imports
import { LoginScreen, TripSelectionScreen } from './screens';

// Component imports
import { TripHeader, DesktopSidebar } from './components/layout';
import { StrategyValidator, DevModePanel } from './components/features';
import { initErrorCapture } from './lib/errorCapture';
import { ConfirmDialog, FilledMapPin, Button, PhotoViewer } from './components/ui';
import { Toaster, toast } from 'sonner';

// Feature imports
import { MachineCarousel, MachineDetail } from './features/slots';
import { VideoPokerTab } from './features/vp';
import { BloodiesTab } from './features/bloodies';
import { SpotterForm, NoteForm } from './features/spots';

// Initialize global styles
injectGlobalStyles();

// Initialize error capture for dev mode
initErrorCapture();

// Tab navigation configuration (shared between mobile and desktop nav)
const NAV_TABS = [
  { id: 'hunt', icon: Gem, label: 'Slots' },
  { id: 'vp', icon: Spade, label: 'Video Poker' },
  { id: 'bloodies', icon: GlassWater, label: 'Bloodies' },
  { id: 'trip', icon: Map, label: 'Trip' }
];

// SpotterForm extracted to src/features/spots/components/SpotterForm.jsx
// NoteForm extracted to src/features/spots/components/SpotterForm.jsx

// ============================================
// NOTE CARD - Handles Slots, VP, and Bloody
// ============================================
function NoteCard({ note, onEdit, onDelete, isOwn }) {
  const [expanded, setExpanded] = useState(false);
  const isVP = note.type === 'vp';
  const isBloody = note.type === 'bloody';
  const title = isBloody ? 'Bloody Mary' : isVP ? (note.vpGameName || note.vpGame) : note.machine;
  const subtitle = isVP ? `${note.vpPayTable} • ${note.vpReturn}%` : null;

  // Get badge color based on type
  const getBadgeClass = () => {
    if (isBloody) return 'bg-red-600 text-white';
    if (isVP) return 'bg-blue-600 text-white';
    return 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black';
  };

  return (
    <div className={`bg-[#161616] border rounded overflow-hidden ${note.playable ? 'border-emerald-500/50' : 'border-[#333]'}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${getBadgeClass()}`}>
                {isBloody ? 'BLOODY' : isVP ? 'VP' : 'SLOT'}
              </span>
              {note.playable && <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/20 px-2 py-0.5 rounded-full">PLAYABLE</span>}
              <span className="text-white font-semibold truncate">{title}</span>
            </div>
            {subtitle && <p className="text-[#d4a855] text-sm mb-1">{subtitle}</p>}
            {/* Bloody rating display */}
            {isBloody && (note.bloodyRating > 0 || note.bloodySpice > 0) && (
              <div className="flex items-center gap-3 mb-1">
                {note.bloodyRating > 0 && (
                  <span className="text-yellow-400 text-sm">
                    {'★'.repeat(note.bloodyRating)}{'☆'.repeat(5 - note.bloodyRating)}
                  </span>
                )}
                {note.bloodySpice > 0 && (
                  <span className="text-orange-500 text-sm flex items-center gap-0.5">
                    {[...Array(note.bloodySpice)].map((_, i) => <Flame key={i} size={14} fill="currentColor" />)}
                  </span>
                )}
              </div>
            )}
            <p className="text-[#bbb] text-sm">{note.casino || 'Unknown casino'}</p>
            {note.denomination && <p className="text-[#888] text-xs">{note.denomination} denomination</p>}
            {note.profiles?.display_name && (
              <p className="text-[#888] text-xs mt-1">by {note.profiles.display_name}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-[#888] text-xs">{formatRelativeTime(note.created_at)}</p>
            <ChevronDown size={16} className={`text-[#888] mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#333] pt-3">
          {note.location && <p className="text-sm text-[#ccc] mb-2"><span className="text-[#888]">Location:</span> {note.location}</p>}
          {note.state && <p className="text-sm text-[#ccc] mb-3"><span className="text-[#888]">{isBloody ? 'Notes:' : isVP ? 'Notes:' : 'State:'}</span> {note.state}</p>}
          {isOwn && (
            <div className="flex gap-2">
              <Button onClick={() => onEdit(note)} variant="secondary" size="sm" className="flex-1 flex items-center justify-center gap-1">
                <Edit3 size={14} /> Edit
              </Button>
              <Button onClick={() => onDelete(note.id)} variant="danger-subtle" size="sm" className="flex items-center gap-1">
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// PhotoViewer extracted to src/components/ui/PhotoViewer.jsx
// MachineCarousel extracted to src/features/slots/components/MachineCarousel.jsx

// MachineDetail extracted to src/features/slots/components/MachineDetail.jsx

// LogBloodyModal extracted to src/features/bloodies/components/LogBloodyModal.jsx
// BloodiesTab extracted to src/features/bloodies/components/BloodiesTab.jsx

// ============================================
// MAIN APP COMPONENT
// ============================================
function MainApp() {
  const { user, profile, signOut } = useAuth();
  const { trips, currentTrip, tripMembers, clearTrip } = useTrip();
  const { notes, loading: notesLoading, addNote, updateNote, deleteNote, refresh: refreshNotes } = useNotes();
  const { photos, addPhoto, deletePhoto, getPhotoUrl, getMachinePhotos, getLatestPhoto } = usePhotos();
  const { checkIns, myCheckIn, checkIn, checkOut, getMembersAtCasino } = useCheckIns();
  const { updateSlotBadges, updateVPBadges, updateTripBadges, unlockQueue, dismissBadge } = useBadges();

  const [activeTab, setActiveTab] = useState('hunt');
  const [animatingTab, setAnimatingTab] = useState(null); // Track tab animation
  const [tripSubTab, setTripSubTab] = useState('overview'); // 'overview', 'casinos', 'notes', 'team'
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [recentMachines, setRecentMachines] = useState([]); // Track recently viewed machines
  const [recentActivity, setRecentActivity] = useState([]); // Unified activity tracking
  const [previousTab, setPreviousTab] = useState(null); // Track where we came from
  const [selectedCasino, setSelectedCasino] = useState(null);
  const [casinoAreaFilter, setCasinoAreaFilter] = useState('all'); // Casino area filter
  const [casinoSearch, setCasinoSearch] = useState(''); // Casino search
  const [currentTier, setCurrentTier] = useState(1);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showSpotter, setShowSpotter] = useState(false); // Unified spotter form
  const [spotterData, setSpotterData] = useState(null); // { type: 'slot'|'vp', ...prefillData }
  const [prefillMachine, setPrefillMachine] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [calcCurrent, setCalcCurrent] = useState('');
  const [calcCeiling, setCalcCeiling] = useState('');
  const [showTripSettings, setShowTripSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if user has seen onboarding
    return !localStorage.getItem('hitseeker_onboarded');
  });
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showTierHelp, setShowTierHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [geoStatus, setGeoStatus] = useState('idle');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [machineViewMode, setMachineViewMode] = useState(() => {
    return localStorage.getItem('hitseeker_view_mode') || 'cards';
  }); // 'list' or 'cards'
  const [leftHandedMode, setLeftHandedMode] = useState(() => {
    return localStorage.getItem('hitseeker_left_handed') === 'true';
  });
  const [apOnly, setApOnly] = useState(false); // AP machines only toggle
  const [releaseYearFilter, setReleaseYearFilter] = useState('all'); // 'all', '2024', '2023', etc.

  // Update slot and VP badges when notes/photos change
  useEffect(() => {
    if (notes) {
      const slotNotes = notes.filter(n => n.type !== 'vp' && !n.machine?.startsWith('VP:'));
      const vpNotes = notes.filter(n => n.type === 'vp' || n.machine?.startsWith('VP:'));
      updateSlotBadges(slotNotes, photos);
      updateVPBadges(vpNotes, photos);
    }
  }, [notes, photos, updateSlotBadges, updateVPBadges]);

  // Update trip badges when trip data changes
  useEffect(() => {
    if (trips && user) {
      updateTripBadges(trips, tripMembers, checkIns, user.id);
    }
  }, [trips, tripMembers, checkIns, user, updateTripBadges]);

  // Escape key to close modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        // Close modals in order of priority (top-most first)
        if (viewingPhoto) setViewingPhoto(null);
        else if (showTierHelp) setShowTierHelp(false);
        else if (showTripSettings) setShowTripSettings(false);
        else if (showSpotter) setShowSpotter(false);
        else if (showNoteForm) setShowNoteForm(false);
        else if (selectedMachine) setSelectedMachine(null);
        else if (showOnboarding) setShowOnboarding(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [viewingPhoto, showTierHelp, showTripSettings, showSpotter, showNoteForm, selectedMachine, showOnboarding]);

  // Track recently viewed machines
  const selectMachine = (machine) => {
    setSelectedMachine(machine);
    if (machine) {
      setRecentMachines(prev => {
        const filtered = prev.filter(m => m.id !== machine.id);
        return [machine, ...filtered].slice(0, 5); // Keep last 5
      });
    }
  };

  const tierColors = {
    1: { bg: 'bg-emerald-900/40', border: 'border-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-600', badgeOutline: 'border-emerald-500 text-emerald-400 bg-[#0d0d0d]' },
    2: { bg: 'bg-amber-900/40', border: 'border-amber-500', text: 'text-amber-400', badge: 'bg-amber-600', badgeOutline: 'border-amber-500 text-amber-400 bg-[#0d0d0d]' },
    3: { bg: 'bg-red-900/40', border: 'border-red-500', text: 'text-red-400', badge: 'bg-red-600', badgeOutline: 'border-red-500 text-red-400 bg-[#0d0d0d]' }
  };

  const currentCasinoInfo = myCheckIn ? vegasCasinos.find(c => c.id === myCheckIn.casino_id) : null;

  // Settings save helpers
  const updateViewMode = (mode) => {
    setMachineViewMode(mode);
    localStorage.setItem('hitseeker_view_mode', mode);
  };

  const updateLeftHandedMode = (enabled) => {
    setLeftHandedMode(enabled);
    localStorage.setItem('hitseeker_left_handed', enabled ? 'true' : 'false');
  };

  // Debug mode for testing check-in flows (set to null to use real geolocation)
  // Options: 'near-casino' | 'not-near' | 'error' | null
  const [debugGeoMode, setDebugGeoMode] = useState(null);
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [showStrategyValidator, setShowStrategyValidator] = useState(false);
  const [previewBadges, setPreviewBadges] = useState([]);

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

  const handlePreviewBadge = (badgeKey) => {
    console.log('Preview badge triggered:', badgeKey, TEST_BADGES[badgeKey]);
    setShowDebugMenu(false);
    const badge = TEST_BADGES[badgeKey];
    if (badge) {
      setPreviewBadges([badge]);
    }
  };

  // Dev mode visibility - persisted in localStorage, toggled via long-press on logo
  const [devModeEnabled, setDevModeEnabled] = useState(() => {
    return localStorage.getItem('devModeEnabled') === 'true';
  });

  const toggleDevMode = () => {
    const newValue = !devModeEnabled;
    setDevModeEnabled(newValue);
    localStorage.setItem('devModeEnabled', newValue.toString());
    if (!newValue) setShowDebugMenu(false); // Close menu when disabling
    hapticMedium(); // Feedback for toggle
  };

  const handleCheckIn = (casino) => {
    checkIn(casino.id, casino.name);
  };

  const detectCasino = () => {
    setGeoStatus('loading');
    if (!navigator.geolocation) { setGeoStatus('error'); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let closest = null, minDist = Infinity;
        vegasCasinos.forEach(casino => {
          const dist = Math.sqrt(Math.pow(latitude - casino.lat, 2) + Math.pow(longitude - casino.lng, 2));
          if (dist < minDist) { minDist = dist; closest = casino; }
        });
        if (closest && minDist < 0.005) {
          handleCheckIn(closest);
          setGeoStatus('success');
        } else {
          setGeoStatus('not-found');
        }
      },
      () => setGeoStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // State for check-in confirmation
  const [pendingCheckIn, setPendingCheckIn] = useState(null);

  // Simulated geolocation for testing
  const simulateGeolocation = (mode) => {
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
  };

  // Header check-in: try to detect location, ask to confirm, or fall back to casino list
  const handleHeaderCheckIn = () => {
    setGeoStatus('loading');
    
    // Use simulated geolocation if debug mode is set
    const geoPromise = debugGeoMode 
      ? simulateGeolocation(debugGeoMode)
      : new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('No geolocation'));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
        });
    
    geoPromise
      .then((position) => {
        const { latitude, longitude } = position.coords;
        let closest = null, minDist = Infinity;
        vegasCasinos.forEach(casino => {
          const dist = Math.sqrt(Math.pow(latitude - casino.lat, 2) + Math.pow(longitude - casino.lng, 2));
          if (dist < minDist) { minDist = dist; closest = casino; }
        });
        if (closest && minDist < 0.005) {
          // Found nearby casino - ask user to confirm (even if already checked in elsewhere)
          setPendingCheckIn(closest);
          setGeoStatus('idle');
        } else {
          // Not near a casino - go to casino list
          setActiveTab('trip');
          setTripSubTab('casinos');
          setGeoStatus('idle');
        }
      })
      .catch(() => {
        // Geolocation error - go to casino list
        setActiveTab('trip');
        setTripSubTab('casinos');
        setGeoStatus('idle');
      });
  };

  const confirmCheckIn = () => {
    if (pendingCheckIn) {
      hapticSuccess();
      handleCheckIn(pendingCheckIn);
      setPendingCheckIn(null);
    }
  };

  const cancelCheckIn = () => {
    setPendingCheckIn(null);
    setActiveTab('trip');
    setTripSubTab('casinos');
  };

  const getWalkTime = (casinoId) => {
    if (!myCheckIn) return '?';
    const fromCasino = vegasCasinos.find(c => c.id === myCheckIn.casino_id);
    return fromCasino?.walkTimes[casinoId] || '?';
  };

  const handleAddNote = async (noteData) => {
    await addNote(noteData);
    setShowNoteForm(false);
    setPrefillMachine(null);
  };

  const handleQuickNote = (machineName) => {
    setPrefillMachine(machineName);
    setShowNoteForm(true);
    setActiveTab('trip');
    setSelectedMachine(null);
  };

  const [photoUploading, setPhotoUploading] = useState(false);
  
  const handleAddPhoto = async (machineId, file) => {
    setPhotoUploading(true);
    try {
      await addPhoto(machineId, file, currentCasinoInfo?.name);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleDeletePhoto = async (machineId, photoId) => {
    await deletePhoto(machineId, photoId);
    setViewingPhoto(null);
  };

  // Handle spot submission - creates note AND adds to recent activity
  const handleSpotSubmit = async (spotData) => {
    // Add to recent activity (in-memory, session-based)
    const activityItem = {
      ...spotData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setRecentActivity(prev => [activityItem, ...prev].slice(0, 20)); // Keep last 20
    
    // Also add as a note (persisted)
    const noteContent = spotData.type === 'vp' 
      ? `${spotData.vpGameName} ${spotData.vpPayTable} (${spotData.vpReturn}%)${spotData.denomination ? ` - ${spotData.denomination}` : ''}`
      : spotData.state || 'Spotted';
    
    await addNote({
      machine: spotData.type === 'vp' ? `VP: ${spotData.vpGameName}` : spotData.machine,
      casino: spotData.casino,
      location: spotData.location,
      state: spotData.type === 'vp' ? `${spotData.vpPayTable} @ ${spotData.vpReturn}%${spotData.denomination ? ` | ${spotData.denomination}` : ''}${spotData.state ? ` | ${spotData.state}` : ''}` : spotData.state,
      playable: spotData.playable,
      // Extended fields for VP
      type: spotData.type,
      vpGame: spotData.vpGame,
      vpGameName: spotData.vpGameName,
      vpPayTable: spotData.vpPayTable,
      vpReturn: spotData.vpReturn,
      denomination: spotData.denomination,
    });
    
    setShowSpotter(false);
    setSpotterData(null);
  };

  // Open spotter for a slot machine
  const openSlotSpotter = (machineName) => {
    setSpotterData({ type: 'slot', machine: machineName });
    setShowSpotter(true);
  };

  // Open spotter for VP
  const openVPSpotter = (game, payTable) => {
    setSpotterData({
      type: 'vp',
      game: game.id,
      gameName: game.name,
      payTable: payTable.label,
      return: payTable.return,
    });
    setShowSpotter(true);
  };

  const calcResult = (() => {
    const c = parseFloat(calcCurrent), ceil = parseFloat(calcCeiling);
    return (!isNaN(c) && !isNaN(ceil) && ceil > 0) ? ((c / ceil) * 100).toFixed(1) : null;
  })();

  // Get unique release years for filter dropdown
  const releaseYears = [...new Set(machines.filter(m => m.releaseYear).map(m => m.releaseYear))].sort((a, b) => b - a);

  const filteredMachines = machines.filter(m => {
    // Safeguard: ensure this is a valid machine entry with required fields
    if (!m.id || !m.tier || !m.name) return false;
    
    const matchesSearch = !debouncedSearch || 
      m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      m.shortName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.manufacturer?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesAP = !apOnly || m.category !== 'entertainment';
    const matchesYear = releaseYearFilter === 'all' || m.releaseYear === parseInt(releaseYearFilter);
    return matchesSearch && matchesCategory && matchesAP && matchesYear;
  });

  // Count AP vs Entertainment for toggle label
  const apCount = machines.filter(m => m.id && m.category !== 'entertainment').length;
  const entertainmentCount = machines.filter(m => m.id && m.category === 'entertainment').length;

  const filteredNotes = debouncedSearch
    ? notes.filter(n => n.machine.toLowerCase().includes(debouncedSearch.toLowerCase()) || n.casino?.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : notes;

  // Trip Settings Modal
  if (showTripSettings) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] p-6">
        <div className="max-w-md mx-auto">
          <button onClick={() => setShowTripSettings(false)} className="no-animate flex items-center gap-2 text-[#d4a855] mb-6">
            <ChevronLeft size={20} /> Back
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6">{currentTrip.name}</h2>
          
          <div className="bg-[#161616] rounded p-4 mb-4 border border-[#333]">
            <h3 className="font-semibold text-white mb-3">Share Code</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentTrip.share_code.toUpperCase());
                hapticLight();
                toast.success('Code copied to clipboard!');
              }}
              className="w-full bg-[#0d0d0d] px-4 py-3 rounded flex items-center justify-center gap-3 hover:bg-[#1a1a1a] transition-colors group"
            >
              <code className="text-white font-mono text-xl tracking-wider">
                {currentTrip.share_code.toUpperCase()}
              </code>
              <Copy size={18} className="text-[#666] group-hover:text-[#d4a855] transition-colors" />
            </button>
            <p className="text-[#bbbbbb] text-sm text-center mt-2">Tap to copy and share with friends</p>
          </div>

          <div className="bg-[#161616] rounded p-4 mb-4 border border-[#333]">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Users size={18} /> Members ({tripMembers.length})
            </h3>
            <div className="space-y-2">
              {tripMembers.map((member, idx) => (
                <div key={member.user_id || `member-${idx}`} className="flex items-center gap-3 p-2 bg-[#0d0d0d]/50 rounded">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-[#bbbbbb] text-sm">
                      {member.display_name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white text-sm">{member.display_name || member.email}</p>
                    <p className="text-[#aaaaaa] text-xs">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Settings Section */}
          <div className="bg-[#161616] rounded p-4 mb-4 border border-[#333]">
            <h3 className="font-semibold text-white mb-4">Settings</h3>

            {/* Account Info */}
            <div className="flex items-center gap-3 p-3 bg-[#0d0d0d]/50 rounded mb-4">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#d4a855] flex items-center justify-center text-black font-bold">
                  {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{profile?.display_name || 'User'}</p>
                <p className="text-[#888] text-sm truncate">{user?.email}</p>
              </div>
            </div>

            {/* Default View Mode */}
            <div className="flex items-center justify-between py-3 border-t border-[#333]">
              <div>
                <p className="text-white text-sm">Default View</p>
                <p className="text-[#666] text-xs">Card or list layout for machines</p>
              </div>
              <div className="flex bg-[#0d0d0d] rounded overflow-hidden">
                <button
                  onClick={() => updateViewMode('cards')}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    machineViewMode === 'cards' ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'text-[#888]'
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => updateViewMode('list')}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    machineViewMode === 'list' ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'text-[#888]'
                  }`}
                >
                  List
                </button>
              </div>
            </div>

            {/* Left-Handed Mode */}
            <div className="flex items-center justify-between py-3 border-t border-[#333]">
              <div>
                <p className="text-white text-sm">Left-Handed Mode</p>
                <p className="text-[#666] text-xs">Move Add button to left side</p>
              </div>
              <button
                onClick={() => updateLeftHandedMode(!leftHandedMode)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  leftHandedMode ? 'bg-gradient-to-r from-[#d4a855] to-amber-600' : 'bg-[#333]'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  leftHandedMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          <Button
            onClick={() => { clearTrip(); setShowTripSettings(false); }}
            variant="secondary"
            className="w-full py-3 flex items-center justify-center gap-2 mb-3 text-white"
          >
            <ChevronLeft size={18} /> Switch Trip
          </Button>

          <Button onClick={signOut} variant="secondary" className="w-full py-3 flex items-center justify-center gap-2">
            <LogOut size={18} /> Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Photo Viewer
  if (viewingPhoto) {
    const machineId = Object.keys(photos).find(id => 
      photos[id].some(p => p.id === viewingPhoto.id)
    );
    const allMachinePhotos = machineId ? getMachinePhotos(machineId) : [];
    const machine = machines.find(m => m.id === machineId);
    
    return (
      <PhotoViewer
        photo={viewingPhoto}
        photoUrl={getPhotoUrl(viewingPhoto)}
        machineName={machine?.name || 'Unknown'}
        onClose={() => setViewingPhoto(null)}
        onDelete={(photoId) => handleDeletePhoto(machineId, photoId)}
        allPhotos={allMachinePhotos}
        onNavigate={setViewingPhoto}
        getPhotoUrl={getPhotoUrl}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-20 md:pb-0 md:pl-16 overflow-x-hidden">
      <DesktopSidebar
        tabs={NAV_TABS}
        activeTab={activeTab}
        onTabChange={(id) => { setActiveTab(id); setSelectedMachine(null); setSelectedCasino(null); }}
        animatingTab={animatingTab}
        setAnimatingTab={setAnimatingTab}
        onLogoLongPress={user?.email === 'christopher.devine@gmail.com' ? toggleDevMode : null}
      />
      <TripHeader
        onOpenSettings={() => setShowTripSettings(true)}
        onLocationClick={handleHeaderCheckIn}
        myCheckIn={myCheckIn}
        onLogoLongPress={user?.email === 'christopher.devine@gmail.com' ? toggleDevMode : null}
      />

      {/* Onboarding Modal - 5 Step Walkthrough */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-[#333] rounded max-w-sm w-full p-6 max-h-[90vh] overflow-y-auto">
            
            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6].map(step => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step === onboardingStep ? 'bg-gradient-to-r from-[#d4a855] to-amber-600' :
                    step < onboardingStep ? 'bg-[#d4a855]/50' : 'bg-[#333]'
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Welcome + Tiers */}
            {onboardingStep === 1 && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    <span className="text-white">Welcome to </span>
                    <span className="text-[#d4a855]">Hit</span><span className="bg-gradient-to-r from-[#d4a855] to-amber-600 bg-clip-text text-transparent">S</span><span className="text-[#d4a855]">eeker</span>
                  </h1>
                  <p className="text-[#aaa] text-sm">Your advantage play companion</p>
                </div>

                <p className="text-white text-center mb-4 font-medium">Machines are organized into 3 tiers:</p>

                <div className="space-y-3 mb-6">
                  <div className="bg-emerald-900/20 border border-emerald-500/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">T1</span>
                      <span className="text-emerald-400 font-semibold text-sm">Must-Hit-By</span>
                    </div>
                    <p className="text-[#bbb] text-xs">Jackpots that MUST hit by a ceiling amount.</p>
                  </div>

                  <div className="bg-amber-900/20 border border-amber-500/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">T2</span>
                      <span className="text-amber-400 font-semibold text-sm">Persistent State</span>
                    </div>
                    <p className="text-[#bbb] text-xs">Machines that save progress between players.</p>
                  </div>

                  <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">T3</span>
                      <span className="text-red-400 font-semibold text-sm">Entertainment</span>
                    </div>
                    <p className="text-[#bbb] text-xs">No advantage play. Fun only!</p>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Hunt Tab */}
            {onboardingStep === 2 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                    <Gem size={32} className="text-[#d4a855]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Hunt Tab</h2>
                  <p className="text-[#aaa] text-sm">Find your next play</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Search size={16} className="text-[#d4a855]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Search 777 machines</p>
                      <p className="text-[#aaa] text-xs">By name, manufacturer, or type</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Target size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Filter by AP Only</p>
                      <p className="text-[#aaa] text-xs">Show only advantage play machines (T1 & T2)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Grid size={16} className="text-[#d4a855]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Browse by category</p>
                      <p className="text-[#aaa] text-xs">Must-Hit-By, Persistent State, and more</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Machine Details */}
            {onboardingStep === 3 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                    <Calculator size={32} className="text-[#d4a855]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Machine Details</h2>
                  <p className="text-[#aaa] text-sm">Everything you need to decide</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-emerald-900/20 border border-emerald-500/30 rounded p-3">
                    <p className="text-emerald-400 font-medium text-sm mb-1">T1: MHB Calculator</p>
                    <p className="text-[#aaa] text-xs">Enter current value and ceiling to see if it's worth playing</p>
                  </div>

                  <div className="bg-amber-900/20 border border-amber-500/30 rounded p-3">
                    <p className="text-amber-400 font-medium text-sm mb-1">T2: Visual Cues</p>
                    <p className="text-[#aaa] text-xs">See exactly what to look for on the machine</p>
                  </div>

                  <div className="flex items-start gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Camera size={16} className="text-[#d4a855]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Add photos & notes</p>
                      <p className="text-[#aaa] text-xs">Remember where you found good machines</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Trip Coordination */}
            {onboardingStep === 4 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                    <Users size={32} className="text-[#d4a855]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Trip Tab</h2>
                  <p className="text-[#aaa] text-sm">Coordinate with your team</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <FilledMapPin size={16} className="text-emerald-400" holeColor="#2a2a2a" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Check in to casinos</p>
                      <p className="text-[#aaa] text-xs">Let teammates know where you are</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <StickyNote size={16} className="text-[#d4a855]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Share scouting notes</p>
                      <p className="text-[#aaa] text-xs">Team sees notes in real-time</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Target size={16} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Hot Opportunities</p>
                      <p className="text-[#aaa] text-xs">See today's best finds from the team</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 5: Video Poker */}
            {onboardingStep === 5 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#d4a855]/20 flex items-center justify-center mx-auto mb-4">
                    <Spade size={32} className="text-[#d4a855]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Video Poker</h2>
                  <p className="text-[#aaa] text-sm">Find the best pay tables</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Search size={16} className="text-[#d4a855]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">88 Game Variants</p>
                      <p className="text-[#aaa] text-xs">Jacks or Better, Deuces Wild, Ultimate X, and more</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <Calculator size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Pay Table Analyzer</p>
                      <p className="text-[#aaa] text-xs">See return % and find HUNT-worthy machines</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
                      <BookOpen size={16} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Hand Checker</p>
                      <p className="text-[#aaa] text-xs">Enter your hand, get the optimal play</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 6: Get Started */}
            {onboardingStep === 6 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#d4a855]/20 rounded-full flex items-center justify-center">
                    <Gem size={32} className="text-[#d4a855]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">You're Ready!</h2>
                  <p className="text-[#aaa] text-sm">Time to hit the floor</p>
                </div>

                <div className="bg-[#1a1a1a] rounded p-4 mb-6">
                  <p className="text-white font-medium text-sm mb-3">Quick start tips:</p>
                  <ul className="space-y-2 text-[#aaa] text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[#d4a855]">1.</span>
                      <span>Tap <strong className="text-white">Check In</strong> in the top-right</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#d4a855]">2.</span>
                      <span>Turn on <strong className="text-white">AP Only</strong> to focus on plays</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#d4a855]">3.</span>
                      <span>Search for machines you see on the floor</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {onboardingStep > 1 && (
                <button
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-white font-semibold py-3 rounded transition-colors"
                >
                  Back
                </button>
              )}
              
              {onboardingStep < 6 ? (
                <Button
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  variant="primary"
                  className="flex-1 py-3 font-bold"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    localStorage.setItem('hitseeker_onboarded', 'true');
                    setShowOnboarding(false);
                    setOnboardingStep(1);
                  }}
                  variant="primary"
                  className="flex-1 py-3 font-bold"
                >
                  Start Hunting
                </Button>
              )}
            </div>

            {/* Skip button */}
            {onboardingStep < 6 && (
              <button
                onClick={() => {
                  localStorage.setItem('hitseeker_onboarded', 'true');
                  setShowOnboarding(false);
                  setOnboardingStep(1);
                }}
                className="w-full mt-3 text-[#aaa] hover:text-[#aaa] text-sm transition-colors"
              >
                Skip intro
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tier Help Modal - Can be reopened anytime */}
      {showTierHelp && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowTierHelp(false)}>
          <div className="bg-[#161616] border border-[#333] rounded max-w-sm w-full p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Understanding Tiers</h2>
              <button onClick={() => setShowTierHelp(false)} className="text-[#aaa] hover:text-white" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shrink-0 mt-0.5">T1</span>
                <div>
                  <p className="text-emerald-400 font-medium text-sm">Must-Hit-By Jackpots</p>
                  <p className="text-[#aaa] text-xs">Progressive must hit before ceiling. Play when 90%+ filled.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shrink-0 mt-0.5">T2</span>
                <div>
                  <p className="text-amber-400 font-medium text-sm">Persistent State</p>
                  <p className="text-[#aaa] text-xs">Banked coins, meters, collectibles. Look for machines left in good states.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shrink-0 mt-0.5">T3</span>
                <div>
                  <p className="text-red-400 font-medium text-sm">Entertainment Only</p>
                  <p className="text-[#aaa] text-xs">No edge. House always wins long-term. Play for fun only.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTierHelp(false)}
              className="w-full mt-4 bg-[#2a2a2a] hover:bg-[#333] text-white py-2 rounded text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Note?"
        message="This action cannot be undone."
        onConfirm={() => { deleteNote(confirmDelete); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Check-in Confirmation Modal */}
      {pendingCheckIn && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-[#333] rounded p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto mb-3 bg-emerald-600/20 rounded-full flex items-center justify-center">
                <FilledMapPin size={28} className="text-emerald-400" holeColor="#161616" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {myCheckIn ? 'Switch Location?' : 'Check In?'}
              </h3>
              <p className="text-[#aaa] text-sm">
                {myCheckIn 
                  ? `You're currently at ${myCheckIn.casino_name}` 
                  : 'We detected you\'re near'}
              </p>
            </div>
            
            {myCheckIn && (
              <div className="flex items-center justify-center gap-2 mb-3 text-[#888] text-sm">
                <span>{myCheckIn.casino_name}</span>
                <ChevronRight size={16} />
                <span className="text-emerald-400">{pendingCheckIn.name}</span>
              </div>
            )}
            
            <div className="bg-[#0d0d0d] border border-emerald-500/30 rounded p-4 mb-4">
              <p className="text-white font-bold text-lg">{pendingCheckIn.name}</p>
              <p className="text-[#aaa] text-sm">{pendingCheckIn.area} • {pendingCheckIn.slots} slots</p>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={confirmCheckIn}
                variant="success"
                className="w-full"
              >
                {myCheckIn ? `Switch to ${pendingCheckIn.name}` : 'Check In'}
              </Button>
              <Button
                onClick={cancelCheckIn}
                variant="secondary"
                className="w-full"
              >
                Choose Different Casino
              </Button>
              <button 
                onClick={() => setPendingCheckIn(null)}
                className="w-full text-[#666] hover:text-[#aaa] py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dev Mode Button - Only visible to admin when dev mode is enabled */}
      {user?.email === 'christopher.devine@gmail.com' && devModeEnabled && (
        <button
          onClick={() => setShowDebugMenu(true)}
          className="fixed bottom-24 right-4 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-xs font-bold z-40 shadow-lg md:bottom-4"
        >
          DEV
        </button>
      )}

      {/* Dev Mode Panel */}
      <DevModePanel
        isOpen={showDebugMenu}
        onClose={() => setShowDebugMenu(false)}
        user={user}
        currentTrip={currentTrip}
        myCheckIn={myCheckIn}
        notesCount={notes?.length || 0}
        onForceRefresh={refreshNotes}
        debugGeoMode={debugGeoMode}
        setDebugGeoMode={setDebugGeoMode}
        onShowStrategyValidator={() => setShowStrategyValidator(true)}
        onPreviewBadge={handlePreviewBadge}
      />

      {/* Badge Preview Modal (for dev testing) */}
      <BadgeUnlockModal
        badges={previewBadges}
        onDismiss={() => setPreviewBadges([])}
      />
      
      {/* Strategy Validator Modal */}
      {showStrategyValidator && (
        <StrategyValidator onClose={() => setShowStrategyValidator(false)} />
      )}

      {/* Spotter Modal */}
      {showSpotter && spotterData && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <SpotterForm
              spotType={spotterData.type}
              prefillData={spotterData}
              currentCasino={currentCasinoInfo?.name || ''}
              onSubmit={handleSpotSubmit}
              onCancel={() => { setShowSpotter(false); setSpotterData(null); }}
            />
          </div>
        </div>
      )}

      <div className="p-4">
        {/* HUNT TAB - Merged with Catalog */}
        {activeTab === 'hunt' && !selectedMachine && (
          <div className="pb-24">
            {/* Header */}
            <div className="px-4 py-2 border-b border-[#333] -mx-4 mb-4">
              <h1 className="text-2xl font-bold text-white">Slots</h1>
              <p className="text-gray-500 text-sm">Find advantage play opportunities</p>
            </div>

            <div className="space-y-4">
            {/* Search and View Toggle Row */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aaaaaa]" size={18} />
                <input
                  type="text"
                  placeholder="Search 777 machines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-[#161616] border border-[#333] rounded pl-10 ${searchQuery ? 'pr-10' : 'pr-4'} py-3 text-white placeholder-gray-500 focus:border-[#d4a855] focus:outline-none`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              {/* View Toggle */}
              <div className="flex bg-[#161616] border border-[#333] rounded overflow-hidden">
                <button
                  onClick={() => setMachineViewMode('list')}
                  className={`p-3 transition-colors ${machineViewMode === 'list' ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'text-[#aaaaaa] hover:text-white'}`}
                  title="List view"
                >
                  <LayoutList size={20} />
                </button>
                <button
                  onClick={() => setMachineViewMode('cards')}
                  className={`p-3 transition-colors ${machineViewMode === 'cards' ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'text-[#aaaaaa] hover:text-white'}`}
                  title="Card view"
                >
                  <Grid size={20} />
                </button>
              </div>
            </div>

            {/* Category Filter - horizontal scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {/* AP Only Toggle - first filter */}
              <button
                onClick={() => setApOnly(!apOnly)}
                className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  apOnly
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                }`}
              >
                AP Only ({apCount})
              </button>

              {/* Divider */}
              <div className="w-px h-5 bg-[#333] shrink-0" />

              <button
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
                    : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                }`}
              >
                All ({apOnly ? apCount : machines.length})
              </button>
              {Object.entries(machineCategories)
                .filter(([key]) => !apOnly || key !== 'entertainment')
                .map(([key, cat]) => {
                const count = machines.filter(m => m.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      selectedCategory === key
                        ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
                        : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                    }`}
                  >
                    {cat.name.split(' ')[0]} ({count})
                  </button>
                );
              })}

              {/* Help Button */}
              <button
                onClick={() => setShowTierHelp(true)}
                className="shrink-0 ml-auto p-1.5 text-[#aaa] hover:text-[#d4a855] transition-colors"
                title="What do tiers mean?"
              >
                <Info size={16} />
              </button>
            </div>

            {/* Recently Viewed (if any) */}
            {recentMachines.length > 0 && (
              <div>
                <p className="text-[#aaa] text-xs uppercase tracking-wider mb-2">Recently Viewed</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {recentMachines.map(machine => (
                    <button
                      key={machine.id}
                      onClick={() => selectMachine(machine)}
                      className="shrink-0 bg-[#161616] border border-[#333] rounded px-3 py-2 flex items-center gap-2 hover:border-[#d4a855] transition-colors"
                    >
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${tierColors[machine.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                        Tier {machine.tier}
                      </span>
                      <span className="text-white text-sm whitespace-nowrap">{machine.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#aaa]">
                {filteredMachines.length} machine{filteredMachines.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* No Results State */}
            {filteredMachines.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-[#444]" />
                </div>
                <p className="text-white font-medium mb-2">No machines found</p>
                <p className="text-[#aaa] text-sm mb-4">
                  {debouncedSearch 
                    ? `No results for "${debouncedSearch}"`
                    : 'Try adjusting your filters'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setApOnly(false);
                    setSelectedCategory('all');
                    setReleaseYearFilter('all');
                  }}
                  className="text-[#d4a855] text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Machine Grid (Card View) */}
            {machineViewMode === 'cards' && filteredMachines.length > 0 && (
              <div className="grid grid-cols-2 gap-3 -mx-4 px-4">
                {filteredMachines.map(machine => {
                  const latestPhoto = getLatestPhoto(machine.id);
                  return (
                    <button
                      key={machine.id}
                      onClick={() => selectMachine(machine)}
                      className={`bg-[#161616] border rounded overflow-hidden text-left transition-all active:scale-[0.98] ${
                        machine.tier === 1 ? 'border-emerald-500/40 hover:border-emerald-500' :
                        machine.tier === 2 ? 'border-amber-500/40 hover:border-amber-500' :
                        'border-red-500/40 hover:border-red-500'
                      }`}
                    >
                      {/* Image or Placeholder */}
                      <div className="aspect-[4/3] bg-[#0d0d0d] relative overflow-hidden">
                        {latestPhoto ? (
                          <img 
                            src={getPhotoUrl(latestPhoto)} 
                            alt={machine.shortName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#161616]">
                            <Gem size={28} className="text-[#333] mb-1" />
                            <span className="text-[#333] text-xs">No photo</span>
                          </div>
                        )}
                        {/* Gradient overlay - tall and gradual blend into card bg */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#161616] from-10% via-[#161616]/60 via-40% to-transparent" />
                        {/* Tier Badge - bottom left */}
                        <span className={`absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${tierColors[machine.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                          Tier {machine.tier}
                        </span>
                      </div>
                      {/* Card Content */}
                      <div className="px-3 pb-3 -mt-1">
                        <h3 className="font-semibold text-white text-base mb-1 line-clamp-1">{machine.shortName}</h3>
                        <p className="text-xs text-[#888] mb-1">{machine.manufacturer}</p>
                        <p className={`text-xs line-clamp-2 ${
                          machine.tier === 1 ? 'text-emerald-400' :
                          machine.tier === 2 ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {machine.thresholdSummary}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Machine List (List View) */}
            {machineViewMode === 'list' && filteredMachines.length > 0 && (
              <div className="space-y-2">
                {filteredMachines.map(machine => (
                  <button
                    key={machine.id}
                    onClick={() => selectMachine(machine)}
                    className={`w-full bg-[#161616] border rounded p-3 text-left transition-colors ${
                      machine.tier === 1 ? 'border-emerald-500/30 hover:border-emerald-500' :
                      machine.tier === 2 ? 'border-amber-500/30 hover:border-amber-500' :
                      'border-red-500/30 hover:border-red-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{machine.shortName}</h3>
                          <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${tierColors[machine.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                            Tier {machine.tier}
                          </span>
                        </div>
                        <p className="text-xs text-[#aaa] mb-1">{machine.manufacturer} • {machine.category?.replace(/-/g, ' ')}</p>
                        <p className={`text-xs truncate ${
                          machine.tier === 1 ? 'text-emerald-400' :
                          machine.tier === 2 ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {machine.thresholdSummary}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-[#aaa] shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>
        )}

        {/* Machine Detail (Hunt) - with context-aware calculator */}
        {activeTab === 'hunt' && selectedMachine && (
          <div className="pb-24 space-y-4">
            {/* Back Button */}
            <button 
              onClick={() => {
                setSelectedMachine(null);
                setSearchQuery('');
                if (previousTab) {
                  setActiveTab(previousTab);
                  setPreviousTab(null);
                }
              }} 
              className="flex items-center gap-2 text-[#d4a855]"
            >
              <ChevronLeft size={20} /> Back
            </button>

            {/* Machine Header - More prominent */}
            <div className={`rounded p-4 ${
              selectedMachine.tier === 1 ? 'bg-gradient-to-br from-emerald-900/40 to-[#161616] border border-emerald-500/50' :
              selectedMachine.tier === 2 ? 'bg-gradient-to-br from-amber-900/40 to-[#161616] border border-amber-500/50' :
              'bg-gradient-to-br from-red-900/40 to-[#161616] border border-red-500/50'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs px-3 py-1 rounded border font-semibold ${tierColors[selectedMachine.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                  {selectedMachine.tier === 1 ? 'Tier 1 - Must Hit By' : 
                   selectedMachine.tier === 2 ? 'Tier 2 - Persistent State' : 
                   'Tier 3 - Entertainment'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{selectedMachine.shortName}</h2>
              <p className="text-[#aaa] text-sm mb-3">{selectedMachine.manufacturer} • {selectedMachine.releaseYear}</p>
              
              {/* Threshold - THE KEY INFO - Big and prominent */}
              <div className={`rounded p-3 ${
                selectedMachine.tier === 1 ? 'bg-emerald-950/50' :
                selectedMachine.tier === 2 ? 'bg-amber-950/50' :
                'bg-red-950/50'
              }`}>
                <p className="text-xs text-[#aaa] uppercase tracking-wider mb-1">Play When</p>
                <p className={`text-lg font-bold ${
                  selectedMachine.tier === 1 ? 'text-emerald-400' :
                  selectedMachine.tier === 2 ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {selectedMachine.thresholdSummary}
                </p>
              </div>
            </div>

            {/* Quick ID - How to spot it */}
            <div className="bg-[#161616] border border-[#333] rounded p-4">
              <p className="text-xs text-[#aaa] uppercase tracking-wider mb-2">Quick ID</p>
              <p className="text-white">{selectedMachine.quickId}</p>
            </div>

            {/* CONTEXT-AWARE: MHB Calculator (Only for Tier 1) */}
            {selectedMachine.tier === 1 && selectedMachine.category === 'must-hit-by' && (
              <div className="bg-[#161616] border border-emerald-500/30 rounded p-4">
                <h3 className="font-bold text-emerald-400 mb-3 flex items-center gap-2 text-sm">
                  <Calculator size={16} /> MHB Calculator
                </h3>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1">
                    <label className="text-xs text-[#aaa] block mb-1">Current $</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      value={calcCurrent} 
                      onChange={(e) => setCalcCurrent(e.target.value)} 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-white text-lg" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-[#aaa] block mb-1">Must Hit By $</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      value={calcCeiling} 
                      onChange={(e) => setCalcCeiling(e.target.value)} 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-white text-lg" 
                    />
                  </div>
                </div>
                {calcResult && (
                  <div className={`p-4 rounded text-center ${
                    parseFloat(calcResult) >= 90 ? 'bg-emerald-900/50 border border-emerald-500' : 
                    parseFloat(calcResult) >= 80 ? 'bg-amber-900/50 border border-amber-500' : 
                    'bg-red-900/50 border border-red-500'
                  }`}>
                    <p className={`text-4xl font-bold ${
                      parseFloat(calcResult) >= 90 ? 'text-emerald-400' : 
                      parseFloat(calcResult) >= 80 ? 'text-amber-400' : 
                      'text-red-400'
                    }`}>
                      {calcResult}%
                    </p>
                    <p className={`text-sm font-medium mt-1 ${
                      parseFloat(calcResult) >= 90 ? 'text-emerald-300' : 
                      parseFloat(calcResult) >= 80 ? 'text-amber-300' : 
                      'text-red-300'
                    }`}>
                      {parseFloat(calcResult) >= 90 ? 'PLAY - Strong +EV' : 
                       parseFloat(calcResult) >= 80 ? 'MARGINAL - Proceed with caution' : 
                       'SKIP - Not worth it'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* CONTEXT-AWARE: Visual Tips (For Tier 2 with visual data) */}
            {selectedMachine.tier === 2 && selectedMachine.visual && (
              <div className="bg-[#161616] border border-amber-500/30 rounded p-4">
                <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2 text-sm">
                  <Eye size={16} /> What to Look For
                </h3>
                <div className="space-y-2">
                  {selectedMachine.visual.appearance?.map((item, i) => (
                    <div key={i} className={`text-sm p-2 rounded ${item.highlight ? 'bg-amber-900/30 text-amber-200' : 'text-[#bbb]'}`}>
                      <span className="text-[#aaa] font-medium">{item.label}:</span> {item.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tier 3 Warning */}
            {selectedMachine.tier === 3 && (
              <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold">No Advantage Play</p>
                    <p className="text-[#bbb] text-sm mt-1">This machine has no exploitable features. Play for entertainment only with money you can afford to lose.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Thresholds (if available) */}
            {selectedMachine.threshold && (selectedMachine.tier === 1 || selectedMachine.tier === 2) && (
              <div className="bg-[#161616] border border-[#333] rounded p-4">
                <p className="text-xs text-[#aaa] uppercase tracking-wider mb-3">Strategy Guide</p>
                <div className="space-y-2">
                  {selectedMachine.threshold.conservative && (
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <div>
                        <p className="text-emerald-400 text-sm font-medium">Conservative</p>
                        <p className="text-[#bbb] text-sm">{selectedMachine.threshold.conservative}</p>
                      </div>
                    </div>
                  )}
                  {selectedMachine.threshold.aggressive && (
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <div>
                        <p className="text-amber-400 text-sm font-medium">Aggressive</p>
                        <p className="text-[#bbb] text-sm">{selectedMachine.threshold.aggressive}</p>
                      </div>
                    </div>
                  )}
                  {selectedMachine.threshold.skip && (
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      <div>
                        <p className="text-red-400 text-sm font-medium">Skip When</p>
                        <p className="text-[#bbb] text-sm">{selectedMachine.threshold.skip}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => openSlotSpotter(selectedMachine.name)}
                variant="primary"
                className="flex items-center justify-center gap-2"
              >
                <FilledMapPin size={18} holeColor="#d4a855" />
                Spot It
              </Button>
              <button
                onClick={() => document.getElementById('photo-input-hunt')?.click()}
                disabled={photoUploading}
                className={`rounded p-3 flex items-center justify-center gap-2 transition-colors ${
                  photoUploading
                    ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
                    : 'bg-[#161616] border border-[#333] hover:border-[#d4a855] text-white'
                }`}
              >
                {photoUploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera size={18} />
                    Add Photo
                  </>
                )}
              </button>
              <input
                id="photo-input-hunt"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddPhoto(selectedMachine.id, file);
                  e.target.value = ''; // Reset so same file can be selected again
                }}
              />
            </div>

            {/* Photos */}
            <div className="bg-[#161616] border border-[#333] rounded p-4">
              <p className="text-xs text-[#aaa] uppercase tracking-wider mb-3">Your Photos</p>
              {getMachinePhotos(selectedMachine.id).length === 0 ? (
                <div className="text-center py-4">
                  <Camera size={24} className="mx-auto text-[#444] mb-2" />
                  <p className="text-[#aaa] text-sm">No photos yet</p>
                  <p className="text-[#555] text-xs mt-1">Tap "Add Photo" to capture this machine</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {getMachinePhotos(selectedMachine.id).map(photo => (
                    <div key={photo.id} className="relative aspect-square rounded overflow-hidden bg-[#0d0d0d] group">
                      <button
                        onClick={() => setViewingPhoto(photo)}
                        className="w-full h-full"
                      >
                        <img src={getPhotoUrl(photo)} alt="" className="w-full h-full object-cover" />
                      </button>
                      {/* Delete button overlay */}
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm('Delete this photo?')) {
                            try {
                              await deletePhoto(selectedMachine.id, photo.id);
                              toast.success('Photo deleted');
                            } catch (err) {
                              toast.error('Failed to delete photo');
                              console.error('Delete photo error:', err);
                            }
                          }
                        }}
                        className="absolute top-1 right-1 w-7 h-7 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes tab removed - consolidated into Trip tab */}

        {/* TRIP TAB */}
        {activeTab === 'trip' && !selectedCasino && (
          <div className="pb-24">
            {/* Header */}
            <div className="px-4 py-2 border-b border-[#333] -mx-4 mb-4">
              <h1 className="text-2xl font-bold text-white">Trip</h1>
              <p className="text-gray-500 text-sm">Manage your scouting trip</p>
            </div>

            <div className="space-y-4">
            {/* Quick Check-in Button - prominent at top */}
            {!myCheckIn ? (
              <button
                onClick={detectCasino}
                disabled={geoStatus === 'loading'}
                className="w-full bg-gradient-to-r from-[#d4a855] to-amber-600 text-black py-3.5 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg shadow-[#d4a855]/20"
              >
                {geoStatus === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} />}
                {geoStatus === 'loading' ? 'Detecting Location...' : 'Check In to a Casino'}
              </button>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <MapPin size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-emerald-400 font-medium">Checked in</p>
                    <p className="text-white text-sm">{myCheckIn.casino_name}</p>
                  </div>
                </div>
                <button
                  onClick={checkOut}
                  className="text-[#888] hover:text-white text-sm px-3 py-1.5 rounded bg-[#1a1a1a] hover:bg-[#252525] transition-colors"
                >
                  Check Out
                </button>
              </div>
            )}

            {/* Overview Content (shown when not viewing notes) */}
            {tripSubTab !== 'notes' && (
              <>
                {/* DEMO DATA - Remove after testing */}
                {(() => {
                  // Fake data for demo purposes - shows when no real notes exist
                  const demoNotes = notes.length === 0 ? [
                    { id: 'demo1', machine: 'Ocean Magic Grand', content: '4 bubbles in rows 1-2, near high limit', casino: 'Flamingo', created_at: new Date().toISOString() },
                    { id: 'demo2', machine: 'Piggy Bankin\'', content: 'Both pigs fat by sports book', casino: 'LINQ', created_at: new Date().toISOString() },
                    { id: 'demo3', machine: 'Wheel of Fortune MHB', content: 'Major at $485/$500 (97%)', casino: 'Caesars Palace', created_at: new Date(Date.now() - 3600000).toISOString() },
                    { id: 'demo4', machine: 'Lucky Wealth Cat', content: '6 orbs stacked low', casino: 'Paris', created_at: new Date(Date.now() - 86400000).toISOString() },
                    { id: 'demo5', machine: 'Buffalo Gold', content: 'Just for fun, hit bonus', casino: 'Harrahs', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
                  ] : notes;
                  const demoMembers = tripMembers.length <= 1 ? [
                    { user_id: 'demo1', display_name: 'You', role: 'owner' },
                    { user_id: 'demo2', display_name: 'Mike', role: 'member' },
                    { user_id: 'demo3', display_name: 'Sarah', role: 'member' },
                  ] : tripMembers;
                  const isDemo = notes.length === 0;
                  
                  return (
                    <>
                      {isDemo && (
                        <div className="bg-amber-900/20 border border-amber-500/30 rounded p-3 text-center">
                          <p className="text-amber-400 text-sm">Demo Mode - Showing sample data</p>
                        </div>
                      )}
                      
                      {/* Current Trip Info */}
                      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#161616] border border-[#333] rounded p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[#aaa] text-xs uppercase tracking-wider mb-1">Current Trip</p>
                            <h2 className="text-xl font-bold text-white">{currentTrip?.name || 'Vegas January 2025'}</h2>
                          </div>
                          {(currentTrip?.share_code || isDemo) && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(currentTrip?.share_code || 'DEMO123');
                              }}
                              className="flex items-center gap-1.5 bg-[#2a2a2a] px-3 py-1.5 rounded text-[#d4a855] text-sm hover:bg-[#333] transition-colors"
                              title="Copy share code"
                            >
                              <Copy size={14} />
                              {currentTrip?.share_code || 'DEMO123'}
                            </button>
                          )}
                        </div>
                        
                        {/* Trip Stats */}
                        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#333]">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">{demoMembers.length}</p>
                            <p className="text-[#aaa] text-xs">Members</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-[#d4a855]">{demoNotes.length}</p>
                            <p className="text-[#aaa] text-xs">Notes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">
                              {demoNotes.filter(n => {
                                const noteDate = new Date(n.created_at).toDateString();
                                const today = new Date().toDateString();
                                return noteDate === today;
                              }).length}
                            </p>
                            <p className="text-[#aaa] text-xs">Today</p>
                          </div>
                        </div>
                      </div>

                      {/* Hot Opportunities - AP notes from today (slots & VP) */}
                      {(() => {
                        // Get today's slot notes for T1/T2 machines
                        const todaySlotNotes = demoNotes.filter(n => {
                          const noteDate = new Date(n.created_at).toDateString();
                          const today = new Date().toDateString();
                          if (noteDate !== today) return false;
                          if (n.type === 'vp' || n.machine?.startsWith('VP:')) return false;
                          const noteMachine = machines.find(m => m?.name === n.machine || m?.shortName === n.machine);
                          return noteMachine && (noteMachine.tier === 1 || noteMachine.tier === 2);
                        });
                        
                        // Get today's VP notes with good returns (>99%)
                        const todayVPNotes = demoNotes.filter(n => {
                          const noteDate = new Date(n.created_at).toDateString();
                          const today = new Date().toDateString();
                          if (noteDate !== today) return false;
                          return (n.type === 'vp' || n.machine?.startsWith('VP:')) && n.vpReturn >= 99;
                        });
                        
                        // Also check recent activity for today's VP spots
                        const todayVPActivity = recentActivity.filter(a => {
                          const actDate = new Date(a.timestamp).toDateString();
                          const today = new Date().toDateString();
                          return actDate === today && a.type === 'vp' && a.vpReturn >= 99;
                        });
                        
                        const allHotItems = [
                          ...todaySlotNotes.map(n => ({ ...n, itemType: 'slot' })),
                          ...todayVPNotes.map(n => ({ ...n, itemType: 'vp' })),
                          ...todayVPActivity.map(a => ({ ...a, itemType: 'vp-activity' })),
                        ];
                        
                        if (allHotItems.length === 0) return null;
                        
                        return (
                          <div className="bg-gradient-to-br from-amber-900/20 to-[#161616] border border-amber-500/30 rounded p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Target size={16} className="text-amber-400" />
                              <p className="text-amber-400 text-sm font-semibold">Hot Opportunities Today</p>
                            </div>
                            <div className="space-y-2">
                              {allHotItems.slice(0, 4).map((item, idx) => {
                                const isVP = item.itemType === 'vp' || item.itemType === 'vp-activity';
                                const noteMachine = !isVP ? machines.find(m => m?.name === item.machine || m?.shortName === item.machine) : null;
                                const title = isVP ? (item.vpGameName || item.machine?.replace('VP: ', '')) : item.machine;
                                const subtitle = isVP ? `${item.vpPayTable} • ${item.vpReturn}%` : null;
                                
                                return (
                                  <button
                                    key={`hot-${item.itemType}-${item.id || idx}`}
                                    onClick={() => {
                                      if (!isVP && noteMachine) {
                                        selectMachine(noteMachine);
                                        setActiveTab('hunt');
                                      } else if (isVP) {
                                        setActiveTab('vp');
                                      }
                                    }}
                                    className="w-full bg-[#0d0d0d] rounded p-3 text-left hover:bg-[#1a1a1a] transition-colors"
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'}`}>
                                          {isVP ? 'VP' : 'SLOT'}
                                        </span>
                                        {!isVP && noteMachine && (
                                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${tierColors[noteMachine?.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                                            Tier {noteMachine?.tier}
                                          </span>
                                        )}
                                        {isVP && (
                                          <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                                            {item.vpReturn}%
                                          </span>
                                        )}
                                        <span className="text-white text-sm font-medium">{title}</span>
                                      </div>
                                      <ChevronRight size={14} className="text-[#aaa]" />
                                    </div>
                                    {subtitle && <p className="text-[#d4a855] text-xs">{subtitle}</p>}
                                    {!isVP && item.content && <p className="text-[#aaa] text-xs truncate">{item.content}</p>}
                                    {item.casino && (
                                      <p className="text-amber-400/70 text-xs mt-1">@ {item.casino}</p>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Team Locations - Show where everyone is */}
                      {demoMembers.length > 1 && (
                        <div className="bg-[#161616] border border-[#333] rounded p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-[#aaa] text-xs uppercase tracking-wider">Team Locations</p>
                            <span className="text-[#aaa] text-xs">{demoMembers.length} members</span>
                          </div>
                          <div className="space-y-2">
                            {demoMembers.map((member, idx) => {
                              const memberCasino = isDemo 
                                ? (idx === 1 ? vegasCasinos.find(c => c.name === 'Flamingo') : idx === 2 ? vegasCasinos.find(c => c.name === 'LINQ') : null)
                                : vegasCasinos.find(c => getMembersAtCasino(c.id).some(m => m.user_id === member.user_id));
                              const isYou = isDemo ? idx === 0 : member.user_id === user?.id;
                              return (
                                <div key={member.user_id || `demo-member-${idx}`} className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                    isYou ? 'bg-[#d4a855]' : 'bg-[#333]'
                                  }`}>
                                    {member.display_name?.[0]?.toUpperCase() || '?'}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">
                                      {member.display_name || 'Unknown'}
                                      {isYou && <span className="text-[#aaa] font-normal"> (you)</span>}
                                    </p>
                                  </div>
                                  {memberCasino ? (
                                    <span className="text-emerald-400 text-xs bg-emerald-400/10 px-2 py-1 rounded-full">
                                      {memberCasino.name}
                                    </span>
                                  ) : (
                                    <span className="text-[#aaa] text-xs">Not checked in</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Recent Activity - Notes with more context */}
                      <div className="bg-[#161616] border border-[#333] rounded p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[#aaa] text-xs uppercase tracking-wider">Recent Activity</p>
                          <button onClick={() => setTripSubTab('notes')} className="text-[#d4a855] text-xs">View All</button>
                        </div>
                        {demoNotes.length === 0 && recentActivity.length === 0 ? (
                          <div className="text-center py-4">
                            <StickyNote size={24} className="mx-auto text-[#444] mb-2" />
                            <p className="text-[#aaa] text-sm">No activity yet</p>
                            <p className="text-[#555] text-xs mt-1">Spot machines or VP pay tables to track them</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {/* Show recent activity first (session-based), then notes */}
                            {recentActivity.slice(0, 3).map(activity => {
                              const isVP = activity.type === 'vp';
                              const title = isVP ? activity.vpGameName : activity.machine;
                              const subtitle = isVP ? `${activity.vpPayTable} • ${activity.vpReturn}%` : activity.state;
                              
                              return (
                                <div key={`activity-${activity.id}`} className="bg-[#0d0d0d] rounded p-3">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'}`}>
                                        {isVP ? 'VP' : 'SLOT'}
                                      </span>
                                      <div>
                                        <p className="text-white text-sm font-medium">{title}</p>
                                        {subtitle && <p className="text-[#d4a855] text-xs">{subtitle}</p>}
                                      </div>
                                    </div>
                                    <span className="text-[#aaa] text-xs whitespace-nowrap">
                                      {formatRelativeTime(activity.timestamp)}
                                    </span>
                                  </div>
                                  {activity.casino && (
                                    <p className="text-[#aaa] text-xs mt-1 flex items-center gap-1">
                                      <FilledMapPin size={10} className="text-[#aaa]" holeColor="#161616" /> {activity.casino}
                                      {activity.location && ` • ${activity.location}`}
                                    </p>
                                  )}
                                  {activity.playable && (
                                    <span className="inline-block mt-2 text-emerald-400 text-xs font-semibold bg-emerald-400/20 px-2 py-0.5 rounded-full">
                                      PLAYABLE
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                            {/* If no recent activity, show notes */}
                            {recentActivity.length === 0 && demoNotes.slice(0, 3).map(note => {
                              const isVP = note.type === 'vp' || note.machine?.startsWith('VP:');
                              const noteMachine = !isVP ? machines.find(m => m?.name === note.machine || m?.shortName === note.machine) : null;
                              
                              return (
                                <div key={`note-${note.id}`} className="bg-[#0d0d0d] rounded p-3">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'}`}>
                                        {isVP ? 'VP' : 'SLOT'}
                                      </span>
                                      {!isVP && noteMachine && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${tierColors[noteMachine.tier]?.badgeOutline || 'border-gray-500 text-gray-400 bg-[#0d0d0d]'}`}>
                                          Tier {noteMachine.tier}
                                        </span>
                                      )}
                                      <p className="text-white text-sm font-medium">{note.machine}</p>
                                    </div>
                                    <span className="text-[#aaa] text-xs whitespace-nowrap">
                                      {new Date(note.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-[#bbb] text-sm">{note.content || note.state}</p>
                                  {note.casino && (
                                    <p className="text-[#aaa] text-xs mt-1 flex items-center gap-1">
                                      <FilledMapPin size={10} className="text-[#aaa]" holeColor="#161616" /> {note.casino}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </>
            )}

            {/* Notes View (accessed via FAB) */}
            {tripSubTab === 'notes' && (
              <>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setTripSubTab('overview')}
                    className="flex items-center gap-1 text-[#888] hover:text-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                    <span className="text-sm">Back</span>
                  </button>
                  <h2 className="text-lg font-bold text-white">Scouting Notes</h2>
                  <div className="flex items-center gap-2">
                    <button onClick={refreshNotes} className="no-animate p-2 text-[#bbbbbb] hover:text-white">
                      <RefreshCw size={18} />
                    </button>
                    <Button onClick={() => setShowNoteForm(true)} variant="primary" size="sm">
                      + Add
                    </Button>
                  </div>
                </div>

                {showNoteForm && (
                  <NoteForm
                    onSubmit={handleAddNote}
                    onCancel={() => { setShowNoteForm(false); setPrefillMachine(null); }}
                    prefillMachine={prefillMachine}
                    currentCasino={currentCasinoInfo?.name}
                  />
                )}

                {notesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#d4a855] animate-spin" />
                  </div>
                ) : filteredNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                      <StickyNote size={28} className="text-[#444]" />
                    </div>
                    <p className="text-white font-medium mb-2">No scouting notes yet</p>
                    <p className="text-[#aaa] text-sm mb-4 max-w-xs mx-auto">
                      Spot a good machine? Add a note to remember it or share with your team.
                    </p>
                    <Button
                      onClick={() => setShowNoteForm(true)}
                      variant="primary"
                      size="sm"
                      className="inline-flex items-center gap-2"
                    >
                      <StickyNote size={16} />
                      Add Your First Note
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotes.map(note => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={setEditingNote}
                        onDelete={setConfirmDelete}
                        isOwn={note.user_id === user?.id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            </div>
          </div>
        )}

        {/* Casino Detail */}
        {activeTab === 'trip' && selectedCasino && (
          <div className="pb-24 space-y-4">
            <button onClick={() => setSelectedCasino(null)} className="no-animate flex items-center gap-2 text-[#d4a855]">
              <ChevronLeft size={20} /> Back
            </button>
            
            <div className="bg-[#161616] border border-[#333] rounded p-4">
              <h2 className="text-2xl font-bold text-white mb-1">{selectedCasino.name}</h2>
              <p className="text-[#bbb]">{selectedCasino.owner} • {selectedCasino.area}</p>
              <p className="text-[#888] text-sm mt-1">{selectedCasino.size} • {selectedCasino.slots} slots</p>
              
              {myCheckIn?.casino_id === selectedCasino.id ? (
                <div className="mt-4 space-y-3">
                  <div className="bg-emerald-900/40 border border-emerald-500/50 rounded p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-emerald-400 font-semibold">You're Here</p>
                      <p className="text-emerald-400/70 text-sm">Currently checked in</p>
                    </div>
                  </div>
                  <button
                    onClick={checkOut}
                    className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#bbbbbb] py-3 rounded font-semibold transition-colors"
                  >
                    Check Out
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => handleCheckIn(selectedCasino)}
                  variant="success"
                  className="w-full mt-4"
                >
                  Check In Here
                </Button>
              )}
            </div>

            {selectedCasino.apNotes && (
              <div className="bg-amber-900/30 border border-amber-500/30 rounded p-4">
                <p className="text-amber-200 text-sm">{selectedCasino.apNotes}</p>
              </div>
            )}

            {/* Members at this casino */}
            {(() => {
              const membersHere = getMembersAtCasino(selectedCasino.id);
              if (membersHere.length === 0) return null;
              return (
                <div className="bg-[#161616] border border-[#333] rounded p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Users size={18} /> Here Now
                  </h3>
                  <div className="space-y-2">
                    {membersHere.map(checkin => (
                      <div key={checkin.id} className="flex items-center gap-3 p-2 bg-[#0d0d0d]/50 rounded">
                        {checkin.profiles?.avatar_url ? (
                          <img src={checkin.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-[#bbbbbb] text-sm">
                            {checkin.profiles?.display_name?.[0]?.toUpperCase() || '?'}
                          </div>
                        )}
                        <p className="text-white text-sm">{checkin.profiles?.display_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Notes for this casino */}
            {(() => {
              const casinoNotes = notes.filter(n => n.casino === selectedCasino.name);
              if (casinoNotes.length === 0) return null;
              return (
                <div className="bg-[#161616] border border-[#333] rounded p-4">
                  <h3 className="font-semibold text-white mb-3">Notes Here ({casinoNotes.length})</h3>
                  <div className="space-y-2">
                    {casinoNotes.slice(0, 5).map(note => (
                      <div key={note.id} className="p-2 bg-[#0d0d0d]/50 rounded">
                        <p className="text-white text-sm font-medium">{note.machine}</p>
                        {note.state && <p className="text-[#bbbbbb] text-xs">{note.state}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* VIDEO POKER TAB */}
        {activeTab === 'vp' && (
          <VideoPokerTab onSpot={openVPSpotter} />
        )}

        {/* BLOODIES TAB */}
        {activeTab === 'bloodies' && (
          <BloodiesTab />
        )}
      </div>

      {/* Global Badge Unlock Modal (for slot, VP, trip badges) */}
      <BadgeUnlockModal
        badges={unlockQueue}
        onDismiss={dismissBadge}
      />

      {/* Bottom Navigation - Mobile Only */}
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
          {leftHandedMode && (
            <div className="flex flex-col items-center py-2 px-5 relative">
              <div className="w-[32px] h-[22px]" />
              <span className="text-xs mt-1 font-medium opacity-0">Add</span>
              <button
                onClick={() => {
                  hapticMedium();
                  setSpotterData({ type: 'slot' });
                  setShowSpotter(true);
                }}
                className="absolute -top-7 left-1/2 -translate-x-1/2"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4a855] to-amber-600 flex items-center justify-center shadow-lg shadow-[#d4a855]/30">
                  <Plus size={32} className="text-black" strokeWidth={2.5} />
                </div>
              </button>
            </div>
          )}

          {/* All nav tabs */}
          {NAV_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                hapticSelection();
                if (activeTab !== tab.id) {
                  setAnimatingTab(tab.id);
                }
                setActiveTab(tab.id);
                setSelectedMachine(null);
                setSelectedCasino(null);
              }}
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
          {!leftHandedMode && (
            <div className="flex flex-col items-center py-2 px-5 relative">
              <div className="w-[32px] h-[22px]" />
              <span className="text-xs mt-1 font-medium opacity-0">Add</span>
              <button
                onClick={() => {
                  hapticMedium();
                  setSpotterData({ type: 'slot' });
                  setShowSpotter(true);
                }}
                className="absolute -top-7 left-1/2 -translate-x-1/2"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4a855] to-amber-600 flex items-center justify-center shadow-lg shadow-[#d4a855]/30">
                  <Plus size={32} className="text-black" strokeWidth={2.5} />
                </div>
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

// ============================================
// ROOT APP WITH PROVIDERS
// ============================================
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster
        theme="dark"
        position="top-right"
        offset={16}
        toastOptions={{
          style: {
            background: '#161616',
            border: '1px solid #333',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span className="text-white">Hit</span>
            <span style={{ color: '#d4a855' }}>Seeker</span>
          </h1>
          <Loader2 className="w-8 h-8 text-[#d4a855] animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <TripProvider>
      <BadgeProvider>
        <TripContent />
      </BadgeProvider>
    </TripProvider>
  );
}

function TripContent() {
  const { currentTrip, loading: tripLoading } = useTrip();

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#d4a855] animate-spin" />
      </div>
    );
  }

  if (!currentTrip) {
    return <TripSelectionScreen />;
  }

  return <MainApp />;
}
