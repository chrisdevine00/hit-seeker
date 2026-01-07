import React, { useState, useEffect } from 'react';
import { Search, Calculator, ChevronRight, ChevronDown, ChevronUp, Check, X, AlertTriangle, Info, Home, List, Building2, StickyNote, Trash2, Edit3, Eye, MapPin, Target, ChevronLeft, Navigation, LogOut, CheckCircle2, Camera, ImagePlus, Users, Share2, Copy, RefreshCw, Loader2, Grid, LayoutList, Crosshair, Map, BookOpen, Spade, Heart, Diamond, Club, Gem, GlassWater, Flame, Sparkles, Star, Lock, Plus } from 'lucide-react';

// Badge system imports
import {
  BADGE_COLORS,
  BADGE_ICONS,
  BLOODY_BADGES,
  HexBadge,
  BadgeDetailModal,
  BadgeUnlockModal,
  BadgeProvider,
  useBadges,
} from './badges';

// Lib imports
import { injectGlobalStyles } from './lib/theme';
// haptics moved to extracted components

// Context imports
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrip } from './context/TripContext';
import { UIProvider, useUI } from './context/UIContext';
import { SlotsProvider, useSlots } from './context/SlotsContext';
import { DebugProvider, useDebug } from './context/DebugContext';

// Hook imports
import { useNotes, usePhotos, useCheckIns } from './hooks';

// Data imports
import { machines } from './data/machines';
import { vegasCasinos } from './data/casinos';

// Utility imports
// formatRelativeTime moved to extracted components

// Screen imports
import { LoginScreen, TripSelectionScreen } from './screens';

// Component imports
import { TripHeader, DesktopSidebar, BottomNavigation } from './components/layout';
import { StrategyValidator, DevModePanel, OnboardingModal, SettingsScreen } from './components/features';
import { initErrorCapture } from './lib/errorCapture';
import { ConfirmDialog, FilledMapPin, Button, PhotoViewer, TierHelpModal, CheckInConfirmModal } from './components/ui';
import { Toaster } from 'sonner';

// Feature imports
import { MachineCarousel, MachineDetail, HuntTab } from './features/slots';
import { VideoPokerTab } from './features/vp';
import { BloodiesTab } from './features/bloodies';
import { SpotterForm, NoteForm, NoteCard } from './features/spots';
import { TripTab, CasinoDetail } from './features/trip';

// Constants imports
import {
  STORAGE_KEYS,
  TAB_IDS,
  TIER_COLORS,
  VIEW_MODES,
  APP_CONFIG,
} from './constants';

// Initialize global styles
injectGlobalStyles();

// Initialize error capture for dev mode
initErrorCapture();

// Tab navigation configuration (shared between mobile and desktop nav)
const NAV_TABS = [
  { id: TAB_IDS.HUNT, icon: Gem, label: 'Slots' },
  { id: TAB_IDS.VP, icon: Spade, label: 'Video Poker' },
  { id: TAB_IDS.BLOODIES, icon: GlassWater, label: 'Bloodies' },
  { id: TAB_IDS.TRIP, icon: Map, label: 'Trip' }
];

// SpotterForm extracted to src/features/spots/components/SpotterForm.jsx
// NoteForm extracted to src/features/spots/components/SpotterForm.jsx

// NoteCard extracted to src/features/spots/components/NoteCard.jsx

// PhotoViewer extracted to src/components/ui/PhotoViewer.jsx
// MachineCarousel extracted to src/features/slots/components/MachineCarousel.jsx

// MachineDetail extracted to src/features/slots/components/MachineDetail.jsx

// LogBloodyModal extracted to src/features/bloodies/components/LogBloodyModal.jsx
// BloodiesTab extracted to src/features/bloodies/components/BloodiesTab.jsx

// ============================================
// MAIN APP COMPONENT
// ============================================
function MainApp() {
  const { user } = useAuth();
  const { trips, currentTrip, tripMembers } = useTrip();
  const { notes, addNote, deleteNote, refresh: refreshNotes } = useNotes();
  const { photos, deletePhoto, getPhotoUrl, getMachinePhotos } = usePhotos();
  const { checkIns, myCheckIn, checkIn } = useCheckIns();
  const { updateSlotBadges, updateVPBadges, updateTripBadges, unlockQueue, dismissBadge } = useBadges();

  // UI Context - navigation, modals, and preferences
  const {
    activeTab, setActiveTab,
    animatingTab, setAnimatingTab,
    setTripSubTab,
    selectedCasino, setSelectedCasino,
    showNoteForm, setShowNoteForm,
    showSpotter, setShowSpotter,
    spotterData, setSpotterData,
    showTripSettings, setShowTripSettings,
    showTierHelp, setShowTierHelp,
    confirmDelete, setConfirmDelete,
    viewingPhoto, setViewingPhoto,
    setPendingCheckIn,
    showOnboarding, setShowOnboarding,
    devModeEnabled,
  } = useUI();

  // Slots Context - machine selection only (filtering moved to HuntTab)
  const {
    selectedMachine, setSelectedMachine,
    debouncedSearch,
  } = useSlots();

  // Other local state
  const [recentActivity, setRecentActivity] = useState([]);
  const [prefillMachine, setPrefillMachine] = useState(null);
  const [_editingNote, setEditingNote] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setters from context are stable
  }, [viewingPhoto, showTierHelp, showTripSettings, showSpotter, showNoteForm, selectedMachine, showOnboarding]);

  // tierColors moved to src/constants/index.js as TIER_COLORS
  // Use getTierColors(tier) helper for safe access with fallback

  const currentCasinoInfo = myCheckIn ? vegasCasinos.find(c => c.id === myCheckIn.casino_id) : null;

  // Debug Context - debug state and actions
  const {
    debugGeoMode, setDebugGeoMode,
    showDebugMenu, setShowDebugMenu,
    showStrategyValidator, setShowStrategyValidator,
    previewBadges, setPreviewBadges,
    handlePreviewBadge,
    handleToggleDevMode,
    simulateGeolocation,
  } = useDebug();

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
          setActiveTab(TAB_IDS.TRIP);
          setTripSubTab('casinos');
          setGeoStatus('idle');
        }
      })
      .catch(() => {
        // Geolocation error - go to casino list
        setActiveTab(TAB_IDS.TRIP);
        setTripSubTab('casinos');
        setGeoStatus('idle');
      });
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

  // calcResult, filteredMachines, and apCount are now from SlotsContext

  const filteredNotes = debouncedSearch
    ? notes.filter(n => n.machine.toLowerCase().includes(debouncedSearch.toLowerCase()) || n.casino?.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : notes;

  // Settings Screen - unified user + trip settings
  if (showTripSettings) {
    return <SettingsScreen />;
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
        onLogoLongPress={user?.email === APP_CONFIG.DEV_EMAIL ? handleToggleDevMode : null}
      />
      <TripHeader
        onOpenSettings={() => setShowTripSettings(true)}
        onLocationClick={handleHeaderCheckIn}
        myCheckIn={myCheckIn}
        onLogoLongPress={user?.email === APP_CONFIG.DEV_EMAIL ? handleToggleDevMode : null}
      />

      {/* Onboarding Modal - extracted component */}
      <OnboardingModal />

      {/* Tier Help Modal - extracted component */}
      <TierHelpModal />

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Note?"
        message="This action cannot be undone."
        onConfirm={() => { deleteNote(confirmDelete); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Check-in Confirmation Modal - extracted component */}
      <CheckInConfirmModal onCheckIn={handleCheckIn} />

      {/* Dev Mode Button - Only visible to admin when dev mode is enabled */}
      {user?.email === APP_CONFIG.DEV_EMAIL && devModeEnabled && (
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
        {/* HUNT TAB - using extracted component */}
        {activeTab === TAB_IDS.HUNT && !selectedMachine && (
          <HuntTab />
        )}

        {/* Machine Detail (Hunt) - using extracted component */}
        {activeTab === TAB_IDS.HUNT && selectedMachine && (
          <MachineDetail />
        )}

        {/* TRIP TAB - using extracted component */}
        {activeTab === TAB_IDS.TRIP && !selectedCasino && (
          <TripTab
            geoStatus={geoStatus}
            detectCasino={detectCasino}
            recentActivity={recentActivity}
            filteredNotes={filteredNotes}
            prefillMachine={prefillMachine}
            setPrefillMachine={setPrefillMachine}
            currentCasinoInfo={currentCasinoInfo}
            setEditingNote={setEditingNote}
          />
        )}

        {/* Casino Detail - using extracted component */}
        {activeTab === TAB_IDS.TRIP && selectedCasino && (
          <CasinoDetail onCheckIn={handleCheckIn} />
        )}

        {/* VIDEO POKER TAB */}
        {activeTab === TAB_IDS.VP && (
          <VideoPokerTab onSpot={openVPSpotter} />
        )}

        {/* BLOODIES TAB */}
        {activeTab === TAB_IDS.BLOODIES && (
          <BloodiesTab />
        )}
      </div>

      {/* Global Badge Unlock Modal (for slot, VP, trip badges) */}
      <BadgeUnlockModal
        badges={unlockQueue}
        onDismiss={dismissBadge}
      />

      {/* Bottom Navigation - extracted component */}
      <BottomNavigation />
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
        <UIProvider>
          <SlotsProvider>
            <DebugProvider>
              <TripContent />
            </DebugProvider>
          </SlotsProvider>
        </UIProvider>
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
