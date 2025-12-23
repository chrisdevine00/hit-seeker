import React, { useState, useEffect, useRef } from 'react';
import { Search, Calculator, ChevronRight, ChevronDown, ChevronUp, Check, X, AlertTriangle, Info, Home, List, Building2, StickyNote, Trash2, Edit3, Eye, MapPin, Target, ChevronLeft, Navigation, LogOut, CheckCircle2, Camera, ImagePlus, Users, Share2, Copy, RefreshCw, Loader2, Grid, LayoutList, Crosshair, Map, BookOpen, Spade, Heart, Diamond, Club, Gem } from 'lucide-react';

// Lib imports
import { supabase } from './lib/supabase';
import { theme, injectGlobalStyles } from './lib/theme';

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

// Initialize global styles
injectGlobalStyles();

function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [joining, setJoining] = useState(false);
  const [shareCode, setShareCode] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: theme.bg.primary }}>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span className="text-white">Hit</span>
          <span style={{ color: theme.accent }}>Seeker</span>
        </h1>
        <p style={{ color: theme.text.secondary }}>Advantage Slots Scouting</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={signInWithGoogle}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-6 rounded transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        {/* Apple sign-in can be added later */}
      </div>

      <div className="mt-8 text-center text-sm" style={{ color: theme.text.muted }}>
        <p>Sign in to create or join a trip</p>
        <p className="mt-1">Your friends can join with a share code</p>
      </div>
    </div>
  );
}

// ============================================
// TRIP SELECTION SCREEN
// ============================================
function TripSelectionScreen() {
  const { trips, loading, createTrip, joinTrip, selectTrip } = useTrip();
  const { signOut, profile, authTimeout, user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newTripName, setNewTripName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!newTripName.trim()) return;
    setCreating(true);
    await createTrip(newTripName.trim());
    setCreating(false);
    setShowCreate(false);
    setNewTripName('');
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setCreating(true);
    setError('');
    const result = await joinTrip(joinCode.trim());
    if (result.error) {
      setError(result.error);
    } else {
      setShowJoin(false);
      setJoinCode('');
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: theme.bg.primary }}>
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span className="text-white">Hit</span>
          <span style={{ color: theme.accent }}>Seeker</span>
        </h1>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: theme.accent }} />
      </div>
    );
  }

  // Show error if auth timed out
  if (authTimeout && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: theme.bg.primary }}>
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <span className="text-white">Hit</span>
          <span style={{ color: theme.accent }}>Seeker</span>
        </h1>
        <p className="text-white mb-2">Connection timed out</p>
        <p className="text-gray-400 text-sm mb-6 text-center">Having trouble connecting. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-lg font-semibold"
          style={{ background: theme.accent, color: '#000' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: theme.bg.primary }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span className="text-white">Hit</span>
              <span style={{ color: theme.accent }}>Seeker</span>
            </h1>
            <p className="text-sm" style={{ color: theme.text.secondary }}>Welcome, {profile?.display_name || 'User'}</p>
          </div>
          <button
            onClick={signOut}
            className="p-2 transition-colors"
            style={{ color: theme.text.muted }}
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Trips List */}
        {trips.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Your Trips</h2>
            <div className="space-y-2">
              {trips.map(trip => (
                <button
                  key={trip.id}
                  onClick={() => selectTrip(trip)}
                  className="w-full rounded p-4 text-left transition-colors"
                  style={{ background: theme.bg.card, border: `1px solid ${theme.border}` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{trip.name}</h3>
                      <p className="text-sm" style={{ color: theme.text.muted }}>
                        {trip.role === 'owner' ? 'Owner' : 'Member'}
                      </p>
                    </div>
                    <ChevronRight size={20} style={{ color: theme.text.muted }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Create/Join Buttons */}
        <div className="space-y-3">
          {!showCreate && !showJoin && (
            <>
              <button
                onClick={() => setShowCreate(true)}
                className="w-full font-semibold py-4 rounded transition-colors"
                style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDim} 100%)`, color: '#000' }}
              >
                Create New Trip
              </button>
              <button
                onClick={() => setShowJoin(true)}
                className="w-full font-semibold py-4 rounded transition-colors"
                style={{ background: theme.bg.card, color: theme.text.primary, border: `1px solid ${theme.border}` }}
              >
                Join with Code
              </button>
            </>
          )}

          {/* Create Form */}
          {showCreate && (
            <div className="rounded p-4" style={{ background: theme.bg.card, border: `1px solid ${theme.border}` }}>
              <h3 className="font-semibold text-white mb-3">Create New Trip</h3>
              <input
                type="text"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                placeholder="Trip name (e.g., Vegas January 2025)"
                className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white placeholder-gray-500 mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowCreate(false); setNewTripName(''); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newTripName.trim() || creating}
                  className="flex-1 bg-[#d4a855] hover:bg-[#a67c3d] disabled:opacity-50 text-white py-2 rounded flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create
                </button>
              </div>
            </div>
          )}

          {/* Join Form */}
          {showJoin && (
            <div className="bg-[#161616] rounded p-4 border border-[#333]">
              <h3 className="font-semibold text-white mb-3">Join a Trip</h3>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter share code"
                className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white placeholder-gray-500 mb-3 uppercase"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowJoin(false); setJoinCode(''); setError(''); }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoin}
                  disabled={!joinCode.trim() || creating}
                  className="flex-1 bg-[#d4a855] hover:bg-[#a67c3d] disabled:opacity-50 text-white py-2 rounded flex items-center justify-center gap-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Join
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// TRIP HEADER COMPONENT
// ============================================
function TripHeader({ onOpenSettings, onLocationClick, myCheckIn }) {
  const { currentTrip, tripMembers } = useTrip();

  return (
    <div className="bg-[#161616] border-b border-[#333] px-4 py-3">
      <div className="flex items-center justify-between">
        <button onClick={onOpenSettings} className="flex items-center gap-2">
          <span className="font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span className="text-white">Hit</span>
            <span style={{ color: '#d4a855' }}>Seeker</span>
          </span>
          <div className="ml-1">
            <h1 className="font-bold text-white text-sm">{currentTrip.name}</h1>
            <p className="text-xs text-[#bbbbbb]">{tripMembers.length} members</p>
          </div>
        </button>

        {myCheckIn ? (
          <button 
            onClick={onLocationClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors font-medium shadow-lg shadow-emerald-900/30"
          >
            <MapPin size={16} className="shrink-0" />
            <span className="truncate max-w-[120px]">{myCheckIn.casino_name}</span>
          </button>
        ) : (
          <button 
            onClick={onLocationClick}
            className="bg-[#d4a855] hover:bg-[#c49745] text-black text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors font-semibold shadow-lg shadow-amber-900/30"
          >
            <MapPin size={16} />
            <span>Check In</span>
          </button>
        )}
      </div>
    </div>
  );
}

function StrategyValidator({ onClose }) {
  const [results, setResults] = useState(null);
  const [expandedGame, setExpandedGame] = useState(null);
  const [showOnlyFailed, setShowOnlyFailed] = useState(false);
  
  useEffect(() => {
    setResults(runAllStrategyTests());
  }, []);
  
  if (!results) return <div className="p-4 text-white">Running tests...</div>;
  
  const { totalPassed, totalTests } = results;
  const allPassed = totalPassed === totalTests;
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-auto">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Strategy Validator</h2>
            <p className="text-[#888] text-sm">Testing optimal play recommendations</p>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-white p-2">
            <X size={24} />
          </button>
        </div>
        
        {/* Summary */}
        <div className={`p-4 rounded mb-4 ${allPassed ? 'bg-emerald-900/30 border border-emerald-500/50' : 'bg-red-900/30 border border-red-500/50'}`}>
          <div className="flex items-center gap-3">
            {allPassed ? (
              <CheckCircle2 size={24} className="text-emerald-400" />
            ) : (
              <AlertTriangle size={24} className="text-red-400" />
            )}
            <div>
              <p className={`font-bold ${allPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                {totalPassed} / {totalTests} tests passed
              </p>
              <p className="text-[#888] text-sm">
                {allPassed ? 'All strategy recommendations are correct!' : `${totalTests - totalPassed} tests failing - review below`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Filter toggle */}
        {!allPassed && (
          <label className="flex items-center gap-2 mb-4 text-sm text-[#888]">
            <input 
              type="checkbox" 
              checked={showOnlyFailed} 
              onChange={(e) => setShowOnlyFailed(e.target.checked)}
              className="rounded"
            />
            Show only failed tests
          </label>
        )}
        
        {/* Results by game */}
        {Object.entries(results.results).map(([gameType, gameResults]) => {
          const gamePassed = gameResults.filter(r => r.passed).length;
          const gameTotal = gameResults.length;
          const gameAllPassed = gamePassed === gameTotal;
          const displayResults = showOnlyFailed ? gameResults.filter(r => !r.passed) : gameResults;
          
          if (showOnlyFailed && displayResults.length === 0) return null;
          
          return (
            <div key={gameType} className="mb-4">
              <button
                onClick={() => setExpandedGame(expandedGame === gameType ? null : gameType)}
                className={`w-full flex items-center justify-between p-3 rounded text-left ${
                  gameAllPassed ? 'bg-emerald-900/20 hover:bg-emerald-900/30' : 'bg-red-900/20 hover:bg-red-900/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  {gameAllPassed ? (
                    <Check size={16} className="text-emerald-400" />
                  ) : (
                    <X size={16} className="text-red-400" />
                  )}
                  <span className="text-white font-medium">{gameType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${gameAllPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {gamePassed}/{gameTotal}
                  </span>
                  {expandedGame === gameType ? <ChevronUp size={16} className="text-[#888]" /> : <ChevronDown size={16} className="text-[#888]" />}
                </div>
              </button>
              
              {expandedGame === gameType && (
                <div className="mt-2 space-y-2">
                  {displayResults.map((result, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded border ${
                        result.passed 
                          ? 'bg-[#161616] border-[#333]' 
                          : 'bg-red-900/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {result.passed ? (
                              <Check size={14} className="text-emerald-400 shrink-0" />
                            ) : (
                              <X size={14} className="text-red-400 shrink-0" />
                            )}
                            <span className="text-white text-sm font-medium">{result.name}</span>
                          </div>
                          
                          {/* Hand display */}
                          <div className="flex gap-1 my-2">
                            {result.cards.map((card, i) => {
                              const isExpectedHold = result.expectedHold.includes(i);
                              const isActualHold = result.actualHold.includes(i);
                              return (
                                <div 
                                  key={i}
                                  className={`w-10 h-14 rounded border-2 flex flex-col items-center justify-center text-xs font-bold ${
                                    isExpectedHold && isActualHold ? 'bg-emerald-600 border-emerald-500 text-white' :
                                    isExpectedHold && !isActualHold ? 'bg-red-600 border-red-500 text-white' :
                                    !isExpectedHold && isActualHold ? 'bg-amber-600 border-amber-500 text-white' :
                                    'bg-[#1a1a1a] border-[#333]'
                                  }`}
                                >
                                  <span className={!isExpectedHold && !isActualHold ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white') : ''}>{card.rank}</span>
                                  <span className={!isExpectedHold && !isActualHold ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white') : ''}>{card.suit}</span>
                                </div>
                              );
                            })}
                          </div>
                          
                          {!result.passed && (
                            <div className="text-xs space-y-1">
                              <p className="text-red-400">
                                Expected hold: [{result.expectedHold.join(', ')}]
                              </p>
                              <p className="text-amber-400">
                                Actual hold: [{result.actualHold.join(', ')}] - "{result.actualName}"
                              </p>
                              <p className="text-[#666]">{result.actualReason}</p>
                            </div>
                          )}
                          
                          {result.passed && (
                            <p className="text-xs text-[#666]">
                              {result.actualName} - {result.actualReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Legend */}
        <div className="mt-6 p-3 bg-[#161616] rounded border border-[#333]">
          <p className="text-[#888] text-xs font-medium mb-2">Card Colors:</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-emerald-600 border border-emerald-500"></div>
              <span className="text-[#888]">Correct hold</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-red-600 border border-red-500"></div>
              <span className="text-[#888]">Should hold (missed)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-amber-600 border border-amber-500"></div>
              <span className="text-[#888]">Wrong hold</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-[#1a1a1a] border border-[#333]"></div>
              <span className="text-[#888]">Correct discard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ============================================
// CONFIRM DIALOG
// ============================================
function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161616] rounded p-6 max-w-sm w-full border border-[#333]">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-[#bbbbbb] mb-6">{message}</p>
        <div className="space-y-2">
          <button onClick={onConfirm} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold">Delete</button>
          <button onClick={onCancel} className="w-full bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] py-3 rounded font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SPOTTER FORM - Unified for Slots and VP
// ============================================
function SpotterForm({ onSubmit, onCancel, spotType: initialSpotType, prefillData, currentCasino }) {
  // spotType: 'slot' or 'vp'
  // prefillData: { machine } for slots, { game, payTable, return } for VP
  
  // Allow switching type if not prefilled
  const isTypeLocked = prefillData?.machine || prefillData?.game;
  const [activeType, setActiveType] = useState(initialSpotType || 'slot');
  
  const [casino, setCasino] = useState(currentCasino || '');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [denomination, setDenomination] = useState('');
  const [playable, setPlayable] = useState(false);
  const [machine, setMachine] = useState(prefillData?.machine || '');
  
  // VP-specific state
  const [selectedVPGame, setSelectedVPGame] = useState(prefillData?.game || '');
  const [selectedVPPayTable, setSelectedVPPayTable] = useState(null);
  
  // vpGames is an object, not array - get the game by key or find by id
  const vpGame = vpGames[selectedVPGame] || Object.values(vpGames).find(g => g.id === selectedVPGame);

  const handleSubmit = () => {
    if (activeType === 'slot' && !machine.trim()) return;
    if (activeType === 'vp' && !selectedVPGame) return;
    
    const noteData = {
      type: activeType,
      casino: casino.trim(),
      location: location.trim(),
      playable,
      created_at: new Date().toISOString(),
    };
    
    if (activeType === 'slot') {
      noteData.machine = machine.trim();
      noteData.state = state.trim();
    } else {
      noteData.vpGame = selectedVPGame;
      noteData.vpGameName = vpGame?.name || prefillData?.gameName;
      noteData.vpPayTable = selectedVPPayTable?.label || prefillData?.payTable;
      noteData.vpReturn = selectedVPPayTable?.return || prefillData?.return;
      noteData.denomination = denomination.trim();
      noteData.state = state.trim();
    }
    
    onSubmit(noteData);
  };

  const isVP = activeType === 'vp';

  return (
    <div className="bg-[#161616] border border-[#333] rounded p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Gem size={24} className="text-[#d4a855]" />
        <h3 className="font-bold text-white text-lg">Spot Find</h3>
      </div>
      
      {/* Type Toggle - only show if not locked */}
      {!isTypeLocked && (
        <div className="flex gap-2 p-1 bg-[#0d0d0d] rounded">
          <button
            onClick={() => setActiveType('slot')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
              activeType === 'slot' 
                ? 'bg-[#d4a855] text-black' 
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            Slot Machine
          </button>
          <button
            onClick={() => setActiveType('vp')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
              activeType === 'vp' 
                ? 'bg-[#d4a855] text-black' 
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            Video Poker
          </button>
        </div>
      )}
      
      {/* What we're spotting */}
      {isVP ? (
        // VP Selection
        <div className="space-y-3">
          {prefillData?.game ? (
            // Pre-filled VP - show read-only
            <div className="bg-[#0d0d0d] border border-[#d4a855]/30 rounded p-3">
              <p className="text-white font-semibold">{prefillData.gameName}</p>
              <p className="text-[#d4a855] text-sm">{prefillData.payTable} • {prefillData.return}% return</p>
            </div>
          ) : (
            // VP selection dropdowns
            <>
              <div>
                <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Game</label>
                <select 
                  value={selectedVPGame} 
                  onChange={(e) => { setSelectedVPGame(e.target.value); setSelectedVPPayTable(null); }}
                  className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#d4a855] appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  <option value="">Select game...</option>
                  {(() => {
                    const FEATURED = ['jacks-or-better','bonus-poker','bonus-poker-deluxe','double-bonus','double-double-bonus','triple-double-bonus','deuces-wild','bonus-deuces-wild','loose-deuces','joker-poker-kings','joker-poker-twopair','ultimate-x-jacks','ultimate-x-bonus','ultimate-x-ddb','ultimate-x-double-bonus','ultimate-x-joker'];
                    return Object.values(vpGames)
                      .filter(g => g.category)
                      .sort((a, b) => {
                        const aF = FEATURED.includes(a.id), bF = FEATURED.includes(b.id);
                        if (aF && !bF) return -1;
                        if (!aF && bF) return 1;
                        if (aF && bF) return FEATURED.indexOf(a.id) - FEATURED.indexOf(b.id);
                        return (b.popularity || 50) - (a.popularity || 50);
                      })
                      .map(g => <option key={g.id} value={g.id}>{g.name}</option>);
                  })()}
                </select>
              </div>
              
              {vpGame && (
                <div>
                  <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Pay Table</label>
                  <div className="flex flex-wrap gap-2">
                    {vpGame.payTables.map(pt => (
                      <button
                        key={pt.id}
                        onClick={() => setSelectedVPPayTable(pt)}
                        className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                          selectedVPPayTable?.id === pt.id 
                            ? 'bg-[#d4a855] text-black' 
                            : 'bg-[#0d0d0d] text-[#aaa] hover:text-white border border-[#333]'
                        }`}
                      >
                        {pt.label} ({pt.return}%)
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        // Slot Selection
        <div className="bg-[#0d0d0d] border border-[#d4a855]/30 rounded p-3">
          {prefillData?.machine ? (
            <p className="text-white font-semibold">{prefillData.machine}</p>
          ) : (
            <select 
              value={machine} 
              onChange={(e) => setMachine(e.target.value)} 
              className="w-full bg-transparent text-white focus:outline-none appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d4a855' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0px center' }}
            >
              <option value="">Select machine...</option>
              {machines.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              <option value="Other">Other</option>
            </select>
          )}
        </div>
      )}
      
      {/* Casino */}
      <div>
        <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Casino</label>
        <select 
          value={casino} 
          onChange={(e) => setCasino(e.target.value)} 
          className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white focus:outline-none focus:border-[#d4a855] appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          <option value="">Select casino...</option>
          {vegasCasinos.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      
      {/* Location within casino */}
      <div>
        <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Location in Casino</label>
        <input 
          type="text" 
          placeholder={isVP ? "e.g., Bar top, High limit room" : "e.g., Near entrance, High limit"} 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white placeholder-[#555]" 
        />
      </div>
      
      {/* VP-specific: Denomination */}
      {isVP && (
        <div>
          <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Denomination</label>
          <div className="flex gap-2 flex-wrap">
            {['$0.25', '$0.50', '$1.00', '$2.00', '$5.00'].map(denom => (
              <button
                key={denom}
                onClick={() => setDenomination(denomination === denom ? '' : denom)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  denomination === denom 
                    ? 'bg-[#d4a855] text-black' 
                    : 'bg-[#0d0d0d] text-[#aaa] hover:text-white border border-[#333]'
                }`}
              >
                {denom}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* State/Notes */}
      <div>
        <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">
          {isVP ? 'Notes' : 'Machine State'}
        </label>
        <textarea 
          placeholder={isVP ? "e.g., Multiple machines, good location" : "e.g., Meter at 85%, 3 coins on reel 2"} 
          value={state} 
          onChange={(e) => setState(e.target.value)} 
          className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white placeholder-[#555] min-h-[70px]" 
        />
      </div>
      
      {/* Playable toggle */}
      <button 
        onClick={() => setPlayable(!playable)} 
        className={`w-full py-3 rounded font-semibold flex items-center justify-center gap-2 transition-colors ${
          playable ? 'bg-emerald-600 text-white' : 'bg-[#1a1a1a] text-[#888] border border-[#333]'
        }`}
      >
        {playable ? <CheckCircle2 size={18} /> : <div className="w-5 h-5 border-2 border-[#555] rounded-full" />}
        {playable ? 'Marked as Playable!' : 'Mark as Playable?'}
      </button>
      
      {/* Actions */}
      <div className="space-y-2">
        <button 
          onClick={handleSubmit} 
          disabled={isVP ? !(selectedVPGame && (selectedVPPayTable || prefillData?.payTable)) : !machine} 
          className="w-full bg-[#d4a855] hover:bg-[#c49745] disabled:opacity-50 text-black py-3 rounded font-semibold"
        >
          Save Spot
        </button>
        <button 
          onClick={onCancel} 
          className="w-full bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] py-3 rounded font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Legacy NoteForm wrapper for backwards compatibility
function NoteForm({ onSubmit, onCancel, prefillMachine, currentCasino }) {
  return (
    <SpotterForm 
      spotType="slot"
      prefillData={{ machine: prefillMachine }}
      currentCasino={currentCasino}
      onSubmit={(data) => {
        // Convert to legacy format
        onSubmit({
          machine: data.machine,
          casino: data.casino,
          location: data.location,
          state: data.state,
          playable: data.playable
        });
      }}
      onCancel={onCancel}
    />
  );
}

// ============================================
// NOTE CARD - Handles both Slots and VP
// ============================================
function NoteCard({ note, onEdit, onDelete, isOwn }) {
  const [expanded, setExpanded] = useState(false);
  const isVP = note.type === 'vp';
  const title = isVP ? (note.vpGameName || note.vpGame) : note.machine;
  const subtitle = isVP ? `${note.vpPayTable} • ${note.vpReturn}%` : null;
  
  return (
    <div className={`bg-[#161616] border rounded overflow-hidden ${note.playable ? 'border-emerald-500/50' : 'border-[#333]'}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-[#d4a855] text-black'}`}>
                {isVP ? 'VP' : 'SLOT'}
              </span>
              {note.playable && <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/20 px-2 py-0.5 rounded-full">PLAYABLE</span>}
              <span className="text-white font-semibold truncate">{title}</span>
            </div>
            {subtitle && <p className="text-[#d4a855] text-sm mb-1">{subtitle}</p>}
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
          {note.state && <p className="text-sm text-[#ccc] mb-3"><span className="text-[#888]">{isVP ? 'Notes:' : 'State:'}</span> {note.state}</p>}
          {isOwn && (
            <div className="flex gap-2">
              <button onClick={() => onEdit(note)} className="flex-1 bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] py-2 rounded text-sm flex items-center justify-center gap-1">
                <Edit3 size={14} /> Edit
              </button>
              <button onClick={() => onDelete(note.id)} className="bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-4 rounded text-sm flex items-center gap-1">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// PHOTO VIEWER
// ============================================
function PhotoViewer({ photo, photoUrl, machineName, onClose, onDelete, allPhotos, onNavigate, getPhotoUrl }) {
  const currentIndex = allPhotos.findIndex(p => p.id === photo.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allPhotos.length - 1;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black/80">
        <div>
          <h3 className="text-white font-semibold">{machineName}</h3>
          {photo.casino && <p className="text-[#bbbbbb] text-sm">{photo.casino}</p>}
        </div>
        <button onClick={onClose} className="text-white p-2"><X size={24} /></button>
      </div>
      
      <div className="flex-1 flex items-center justify-center relative">
        {hasPrev && (
          <button onClick={() => onNavigate(allPhotos[currentIndex - 1])} className="absolute left-2 bg-black/50 p-2 rounded-full text-white">
            <ChevronLeft size={24} />
          </button>
        )}
        <img src={photoUrl} alt={machineName} className="max-h-full max-w-full object-contain" />
        {hasNext && (
          <button onClick={() => onNavigate(allPhotos[currentIndex + 1])} className="absolute right-2 bg-black/50 p-2 rounded-full text-white">
            <ChevronRight size={24} />
          </button>
        )}
      </div>
      
      <div className="p-4 bg-black/80 flex items-center justify-between">
        <div>
          <p className="text-[#bbbbbb] text-sm">{currentIndex + 1} of {allPhotos.length}</p>
          <p className="text-[#aaaaaa] text-xs">{new Date(photo.created_at).toLocaleDateString()}</p>
        </div>
        <button onClick={() => onDelete(photo.id)} className="bg-red-600/20 text-red-400 px-4 py-2 rounded text-sm flex items-center gap-2">
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

// ============================================
// MACHINE CAROUSEL
// ============================================
function MachineCarousel({ machines, tierColors, onSelect, tier, getLatestPhoto, getPhotoUrl }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const safeTier = tier || 1;
  const tierMachines = machines.filter(m => m.tier === safeTier);
  const colors = tierColors[safeTier] || tierColors[1];

  const goTo = (index) => {
    if (index < 0) index = tierMachines.length - 1;
    if (index >= tierMachines.length) index = 0;
    setCurrentIndex(index);
  };

  if (tierMachines.length === 0) return null;
  const machine = tierMachines[currentIndex];
  const latestPhoto = getLatestPhoto(machine.id);
  const photoUrl = latestPhoto ? getPhotoUrl(latestPhoto) : null;

  return (
    <div className="relative">
      <div className={`${colors.bg} border ${colors.border} rounded p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {photoUrl ? (
              <img src={photoUrl} alt="" className="w-8 h-8 rounded object-cover" />
            ) : (
              <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center">
                <Camera size={14} className="text-[#aaaaaa]" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-white">{machine.shortName}</h3>
              <p className="text-xs text-[#bbbbbb]">{machine.manufacturer}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => goTo(currentIndex - 1)} className="p-1 text-[#bbbbbb] hover:text-white"><ChevronLeft size={20} /></button>
            <span className="text-xs text-[#aaaaaa]">{currentIndex + 1}/{tierMachines.length}</span>
            <button onClick={() => goTo(currentIndex + 1)} className="p-1 text-[#bbbbbb] hover:text-white"><ChevronRight size={20} /></button>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-3">{machine.quickId}</p>
        
        <div className={`${colors.bg} rounded p-3 mb-3`}>
          <p className="text-xs text-[#bbbbbb] mb-1">Play When:</p>
          <p className={`text-sm font-semibold ${colors.text}`}>{machine.thresholdSummary}</p>
        </div>
        
        <button onClick={() => onSelect(machine)} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );
}

// ============================================
// MACHINE DETAIL
// ============================================
function MachineDetail({ machine, onBack, onAddNote, photos, onAddPhoto, onDeletePhoto, onViewPhoto, getPhotoUrl }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  const existingPhoto = photos.length > 0 ? photos[0] : null;

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (existingPhoto) {
      // Store file and show confirmation
      setPendingFile(file);
      setShowReplaceConfirm(true);
    } else {
      // No existing photo, just upload
      await uploadPhoto(file);
    }
    e.target.value = '';
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    const compressed = await compressImage(file);
    await onAddPhoto(machine.id, compressed);
    setUploading(false);
  };

  const handleReplaceConfirm = async () => {
    if (!pendingFile) return;
    setShowReplaceConfirm(false);
    
    // Delete old photo first
    if (existingPhoto) {
      await onDeletePhoto(machine.id, existingPhoto.id);
    }
    
    // Upload new photo
    await uploadPhoto(pendingFile);
    setPendingFile(null);
  };

  const handleReplaceCancel = () => {
    setShowReplaceConfirm(false);
    setPendingFile(null);
  };

  return (
    <div className="space-y-4">
      {/* Replace Photo Confirmation */}
      {showReplaceConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161616] rounded p-6 max-w-sm w-full border border-[#333]">
            <h3 className="text-lg font-semibold text-white mb-2">Replace Photo?</h3>
            <p className="text-[#bbbbbb] mb-6">The existing photo will be deleted and replaced with the new one.</p>
            <div className="space-y-2">
              <button onClick={handleReplaceConfirm} className="w-full bg-[#d4a855] hover:bg-[#c49745] text-black py-3 rounded font-semibold">Replace</button>
              <button onClick={handleReplaceCancel} className="w-full bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] py-3 rounded font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <button 
        type="button" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onBack();
        }} 
        className="flex items-center gap-2 text-[#d4a855] mb-4 py-2 pr-4 -ml-2 pl-2 hover:bg-[#1c1c1c] rounded transition-colors"
      >
        <ChevronLeft size={20} /> Back
      </button>

      <div className="bg-[#161616] border border-[#333] rounded p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {existingPhoto ? (
              <button onClick={() => onViewPhoto(existingPhoto)} className="relative">
                <img src={getPhotoUrl(existingPhoto)} alt="" className="w-12 h-12 rounded object-cover" />
              </button>
            ) : (
              <button onClick={handlePhotoClick} className="w-12 h-12 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600" disabled={uploading}>
                {uploading ? <Loader2 className="w-5 h-5 animate-spin text-[#bbbbbb]" /> : <Camera size={20} className="text-[#bbbbbb]" />}
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-white">{machine.name}</h1>
              <p className="text-[#bbbbbb] text-sm">{machine.manufacturer}</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${machine.tier === 1 ? 'bg-emerald-600' : machine.tier === 2 ? 'bg-amber-600' : 'bg-red-600'} text-white`}>
            Tier {machine.tier}
          </span>
        </div>
        
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
        
        {existingPhoto && (
          <button onClick={handlePhotoClick} className="text-[#d4a855] text-sm flex items-center gap-1 mb-3" disabled={uploading}>
            <Camera size={14} /> {uploading ? 'Uploading...' : 'Replace Photo'}
          </button>
        )}
        
        <p className="text-gray-300 bg-[#0d0d0d]/50 rounded p-3 text-sm">{machine.quickId}</p>
      </div>

      {/* Visual Info */}
      <div className="bg-[#161616] border border-[#333] rounded overflow-hidden">
        <div className="p-4 border-b border-[#333]">
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            <Eye size={18} className="text-[#d4a855]" /> What to Look For
          </h2>
        </div>
        <div className="p-4 space-y-3">
          <div className="bg-blue-900/30 rounded p-3">
            <p className="text-blue-300 text-xs uppercase tracking-wider font-semibold mb-1">Where to Look</p>
            <p className="text-white text-sm">{machine.visual.location}</p>
          </div>
          {machine.visual.appearance.map((item, i) => (
            <div key={i} className={`rounded p-3 ${item.highlight ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-[#0d0d0d]/50'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${item.highlight ? 'text-amber-400' : 'text-[#aaaaaa]'}`}>{item.label}</span>
              <p className={`text-sm ${item.highlight ? 'text-amber-200 font-semibold' : 'text-gray-300'}`}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Play Thresholds */}
      <div className="bg-[#161616] border border-[#333] rounded overflow-hidden">
        <div className="p-4 border-b border-[#333]">
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            <Target size={18} className="text-emerald-400" /> Play Thresholds
          </h2>
        </div>
        <div className="p-4 space-y-2">
          {Object.entries(machine.threshold).map(([key, value]) => (
            <div key={key} className="bg-[#0d0d0d]/50 rounded p-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#aaaaaa]">{key.replace(/([A-Z])/g, ' $1')}</span>
              <p className="text-gray-200 text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {machine.warning && (
        <div className="bg-red-900/30 border border-red-500/30 rounded p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <p className="text-red-200 text-sm">{machine.warning}</p>
        </div>
      )}

      <button onClick={() => onAddNote(machine.name)} className="w-full bg-[#d4a855] hover:bg-[#a67c3d] text-white font-semibold py-4 rounded flex items-center justify-center gap-2">
        <StickyNote size={18} /> Add Note for {machine.shortName}
      </button>
    </div>
  );
}

// ============================================
// VIDEO POKER TAB COMPONENT
// ============================================
function VideoPokerTab({ onSpot }) {
  const [selectedGame, setSelectedGame] = useState('jacks-or-better');
  const [selectedPayTable, setSelectedPayTable] = useState(null);
  const [selectedHand, setSelectedHand] = useState([null, null, null, null, null]);
  const [showCardPicker, setShowCardPicker] = useState(null);
  const [gameSearch, setGameSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectorExpanded, setSelectorExpanded] = useState(true);
  
  // List of games with full WoO strategy support (show these first)
  const FEATURED_GAMES = [
    'jacks-or-better',
    'bonus-poker', 
    'bonus-poker-deluxe',
    'double-bonus',
    'double-double-bonus',
    'triple-double-bonus',
    'deuces-wild',
    'bonus-deuces-wild',
    'loose-deuces',
    'joker-poker-kings',
    'joker-poker-twopair',
    'ultimate-x-jacks',
    'ultimate-x-bonus',
    'ultimate-x-ddb',
    'ultimate-x-double-bonus',
    'ultimate-x-joker',
  ];
  
  // Filter games by search and category
  const filteredGames = Object.values(vpGames).filter(g => {
    if (!g.category) return false; // Skip non-VP games
    const matchesSearch = gameSearch === '' || 
      g.name.toLowerCase().includes(gameSearch.toLowerCase()) ||
      g.shortName.toLowerCase().includes(gameSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Featured games first, then by popularity
    const aFeatured = FEATURED_GAMES.includes(a.id);
    const bFeatured = FEATURED_GAMES.includes(b.id);
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    // Within featured, sort by featured list order
    if (aFeatured && bFeatured) {
      return FEATURED_GAMES.indexOf(a.id) - FEATURED_GAMES.indexOf(b.id);
    }
    // Non-featured: sort by popularity
    return (b.popularity || 50) - (a.popularity || 50);
  });
  
  // Get game counts per category
  const categoryCounts = Object.keys(vpCategories).reduce((acc, cat) => {
    acc[cat] = Object.values(vpGames).filter(g => g.category === cat).length;
    return acc;
  }, {});
  
  const game = vpGames[selectedGame];
  
  // Auto-collapse when pay table is selected
  React.useEffect(() => {
    if (selectedPayTable) {
      setSelectorExpanded(false);
    }
  }, [selectedPayTable]);
  
  // Auto-select first filtered game if current selection is not in filtered list
  React.useEffect(() => {
    if (filteredGames.length > 0 && !filteredGames.find(g => g.id === selectedGame)) {
      setSelectedGame(filteredGames[0].id);
      setSelectedPayTable(null);
      setSelectedHand([null, null, null, null, null]);
    }
  }, [filteredGames, selectedGame]);
  
  // Reset pay table when game changes
  React.useEffect(() => {
    setSelectedPayTable(null);
    setSelectorExpanded(true);
  }, [selectedGame]);
  
  // Get rating color
  const getRatingColor = (rating) => {
    switch(rating) {
      case 'HUNT': return 'text-emerald-400 bg-emerald-900/30 border-emerald-500/30';
      case 'OK': return 'text-amber-400 bg-amber-900/30 border-amber-500/30';
      case 'AVOID': return 'text-red-400 bg-red-900/30 border-red-500/30';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/30';
    }
  };
  
  // Rating badge colors (outlined style like tier badges)
  const getRatingBadge = (rating) => {
    switch(rating) {
      case 'HUNT': return 'border-emerald-500 text-emerald-400 bg-[#0d0d0d]';
      case 'OK': return 'border-amber-500 text-amber-400 bg-[#0d0d0d]';
      case 'AVOID': return 'border-red-500 text-red-400 bg-[#0d0d0d]';
      default: return 'border-gray-500 text-gray-400 bg-[#0d0d0d]';
    }
  };
  
  const getRatingText = (rating) => {
    switch(rating) {
      case 'HUNT': return 'text-emerald-400';
      case 'OK': return 'text-amber-400';
      case 'AVOID': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Card picker component
  const CardPicker = ({ onSelect, onClose, excludeCards }) => {
    const excludeSet = new Set(excludeCards.filter(Boolean).map(c => c.rank === 'JOKER' ? 'JOKER' : `${c.rank}${c.suit}`));
    
    // Check if this is a Joker Poker game (53-card deck with 1 Joker)
    const isJokerGame = selectedGame?.startsWith('joker-poker');
    const jokerExcluded = excludeSet.has('JOKER');
    
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-end justify-center" onClick={onClose}>
        <div className="bg-[#161616] border-t border-[#333] rounded-t-2xl w-full max-w-md p-4 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold text-lg">Select Card</h3>
            <button onClick={onClose} className="text-[#aaa] hover:text-white p-1">
              <X size={24} />
            </button>
          </div>
          
          {/* Joker option for Joker Poker games */}
          {isJokerGame && (
            <div className="mb-4">
              <button
                disabled={jokerExcluded}
                onClick={() => onSelect({ rank: 'JOKER', suit: '★', color: 'text-purple-500', isJoker: true })}
                className={`w-full h-16 rounded border-2 flex items-center justify-center font-bold transition-colors ${
                  jokerExcluded 
                    ? 'bg-[#0d0d0d] border-[#1a1a1a] text-[#333] cursor-not-allowed'
                    : 'bg-[#2a1a2a] border-purple-500/50 hover:border-purple-400 hover:bg-[#3a2a3a] text-purple-400'
                }`}
              >
                <span className="text-xl font-bold">★</span>
                <span className="text-lg mx-1">JOKER</span>
                <span className="text-xl font-bold">★</span>
              </button>
            </div>
          )}
          
          {SUITS.map(suit => (
            <div key={suit.name} className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {RANKS.map(rank => {
                  const cardKey = `${rank}${suit.symbol}`;
                  const isExcluded = excludeSet.has(cardKey);
                  return (
                    <button
                      key={cardKey}
                      disabled={isExcluded}
                      onClick={() => onSelect({ rank, suit: suit.symbol, color: suit.color })}
                      className={`w-14 h-[72px] rounded border-2 flex flex-col items-center justify-center font-bold transition-colors ${
                        isExcluded 
                          ? 'bg-[#0d0d0d] border-[#1a1a1a] text-[#333] cursor-not-allowed'
                          : 'bg-[#1a1a1a] border-[#333] hover:border-[#d4a855] hover:bg-[#222] ' + suit.pickerColor
                      }`}
                    >
                      <span className="text-xl">{rank}</span>
                      <span className="text-lg">{suit.symbol}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Game & Pay Table Selector - Collapsible */}
      {selectedPayTable && !selectorExpanded ? (
        /* Collapsed Summary Bar - resembles slot machine list item */
        <button
          onClick={() => setSelectorExpanded(true)}
          className={`w-full bg-[#161616] border rounded p-3 text-left transition-colors ${
            selectedPayTable.rating === 'HUNT' ? 'border-emerald-500/40 hover:border-emerald-500' :
            selectedPayTable.rating === 'OK' ? 'border-amber-500/40 hover:border-amber-500' :
            'border-red-500/40 hover:border-red-500'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Rating Badge - outlined style */}
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${getRatingBadge(selectedPayTable.rating)}`}>
              {selectedPayTable.rating}
            </span>
            
            {/* Game Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{game?.name}</h3>
              <p className="text-xs text-[#888]">{selectedPayTable.label}</p>
            </div>
            
            {/* Return % */}
            <div className="text-right flex items-center gap-2">
              <span className={`text-sm font-medium ${getRatingText(selectedPayTable.rating)}`}>
                {selectedPayTable.return}% return
              </span>
              <ChevronDown size={18} className="text-[#666]" />
            </div>
          </div>
        </button>
      ) : (
        /* Expanded Selector */
        <div className="bg-[#161616] border border-[#333] rounded p-4 space-y-4">
          {/* Header with collapse button */}
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold">Select Game & Pay Table</p>
            {selectedPayTable && (
              <button 
                onClick={() => setSelectorExpanded(false)}
                className="text-[#aaa] hover:text-white p-1"
              >
                <ChevronUp size={18} />
              </button>
            )}
          </div>
          
          {/* Search input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
            <input
              type="text"
              placeholder="Search games..."
              value={gameSearch}
              onChange={(e) => setGameSearch(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#333] rounded pl-9 pr-9 py-2 text-white text-sm focus:border-[#d4a855] focus:outline-none"
            />
            {gameSearch && (
              <button 
                onClick={() => setGameSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Category filter - horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                selectedCategory === 'all' ? 'bg-[#d4a855] text-black' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
              }`}
            >
              All ({Object.values(vpGames).filter(g => g.category).length})
            </button>
            {Object.entries(vpCategories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedCategory === key ? 'bg-[#d4a855] text-black' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                }`}
              >
                {cat.name.replace(' Games', '').replace(' Family', '').replace(' Bonus', '')} ({categoryCounts[key] || 0})
              </button>
            ))}
          </div>
          
          {/* Game dropdown */}
          {filteredGames.length > 0 ? (
            <select
              value={selectedGame}
              onChange={(e) => {
                setSelectedGame(e.target.value);
                setSelectedPayTable(null);
                setSelectedHand([null, null, null, null, null]);
              }}
              className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white font-medium focus:outline-none focus:border-[#d4a855] appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              {filteredGames.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          ) : (
            <div className="bg-[#0d0d0d] border border-dashed border-[#333] rounded p-4 text-center">
              <p className="text-[#aaa] mb-2">No games match your filters</p>
              <button 
                onClick={() => { setGameSearch(''); setSelectedCategory('all'); }}
                className="text-[#d4a855] text-sm hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
          
          {/* Pay Table Selection */}
          {game && filteredGames.length > 0 && (
            <div className="pt-2 border-t border-[#333]">
              <p className="text-[#aaa] text-xs mb-2">{game.keyLookup || 'Select pay table'}</p>
              <div className="flex flex-wrap gap-2">
                {game.payTables?.map(pt => (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedPayTable(pt)}
                    className={`px-4 py-2.5 rounded text-sm font-medium transition-colors flex flex-col items-center min-w-[70px] ${
                      selectedPayTable?.id === pt.id
                        ? 'bg-[#d4a855] text-black'
                        : 'bg-[#0d0d0d] border border-[#333] text-white hover:border-[#444]'
                    }`}
                  >
                    <span className="font-bold text-base">{pt.fh}/{pt.fl}</span>
                    <span className={`text-sm ${
                      selectedPayTable?.id === pt.id ? 'text-black/70' :
                      pt.rating === 'HUNT' ? 'text-emerald-400' : 
                      pt.rating === 'OK' ? 'text-amber-400' : 'text-red-400'
                    }`}>{pt.return}%</span>
                  </button>
                )) || <p className="text-red-400 text-sm">No pay tables found</p>}
              </div>
              
              {selectedPayTable && (
                <div className={`mt-3 p-3 rounded text-sm border ${getRatingColor(selectedPayTable.rating)}`}>
                  {selectedPayTable.rating === 'HUNT' ? 'Good table - play this' : 
                   selectedPayTable.rating === 'OK' ? 'Acceptable if nothing better' : 
                   'Poor return - find a better machine'}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Spot Button - when pay table selected */}
      {selectedPayTable && onSpot && (
        <button
          onClick={() => onSpot(game, selectedPayTable)}
          className="w-full bg-[#d4a855] hover:bg-[#c49745] text-black py-3 rounded font-semibold flex items-center justify-center gap-2"
        >
          <MapPin size={18} />
          Spot This Pay Table
        </button>
      )}

      {/* Hand Entry */}
      {selectedPayTable && (() => {
        const isComplete = selectedHand.filter(Boolean).length === 5;
        // Using WoO-verified strategy engine for perfect play advice
        const recommendation = isComplete ? getWoOStrategyRecommendation(selectedHand, selectedPayTable, selectedGame) : null;
        const currentHand = isComplete ? evaluateHand(selectedHand, selectedGame) : null;
        
        return (
          <div className="bg-[#161616] border border-[#333] rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-semibold text-lg">Hand Checker</p>
                {!isComplete && <p className="text-[#aaa] text-xs">Tap each card to select</p>}
              </div>
              {isComplete && currentHand && (
                <div className={`text-right ${currentHand.payout > 0 ? 'text-emerald-400' : 'text-[#aaa]'}`}>
                  <p className="font-bold">{currentHand.name}</p>
                  {currentHand.payout > 0 && <p className="text-xs">Pays {currentHand.payout}x</p>}
                </div>
              )}
            </div>
            
            {/* Card Display */}
            <div className="flex gap-2 justify-center mb-3">
              {selectedHand.map((card, index) => {
                const shouldHold = recommendation?.hold?.includes(index);
                const isJoker = card?.rank === 'JOKER' || card?.isJoker;
                return (
                  <div key={index} className="text-center">
                    <button
                      onClick={() => setShowCardPicker(index)}
                      className={`w-24 h-32 rounded-lg border-2 flex flex-col items-center justify-center transition-colors ${
                        card 
                          ? isComplete
                            ? shouldHold
                              ? 'bg-emerald-600 border-emerald-500'
                              : 'bg-[#2a2a2a] border-[#444]'
                            : isJoker
                              ? 'bg-purple-900 border-purple-500'
                              : 'bg-white border-white'
                          : 'bg-[#1a1a1a] border-[#444] border-dashed hover:border-[#d4a855]'
                      }`}
                    >
                      {card ? (
                        isJoker ? (
                          <>
                            <span className={`text-3xl font-bold ${isComplete ? 'text-purple-300' : 'text-purple-400'}`}>★</span>
                            <span className={`text-xs font-bold ${isComplete ? 'text-purple-300' : 'text-purple-400'}`}>JOKER</span>
                          </>
                        ) : (
                          <>
                            <span className={`text-4xl font-bold ${
                              isComplete 
                                ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white')
                                : card.color
                            }`}>{card.rank}</span>
                            <span className={`text-3xl ${
                              isComplete 
                                ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white')
                                : card.color
                            }`}>{card.suit}</span>
                          </>
                        )
                      ) : (
                        <span className="text-[#666] text-4xl">?</span>
                      )}
                    </button>
                    {isComplete && (
                      <p className={`text-sm mt-1.5 font-bold ${shouldHold ? 'text-emerald-400' : 'text-[#666]'}`}>
                        {shouldHold ? 'HOLD' : 'DRAW'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Recommendation text */}
            {isComplete && recommendation && (
              <div className="text-center mt-4 pt-4 border-t border-[#333]">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <p className="text-[#d4a855] font-semibold text-lg">{recommendation.name}</p>
                  {recommendation.source && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 font-medium">
                      WoO ✓
                    </span>
                  )}
                </div>
                <p className="text-[#bbb] text-sm">{recommendation.reason}</p>
              </div>
            )}

            {/* Clear Button */}
            {selectedHand.some(c => c !== null) && (
              <button
                onClick={() => setSelectedHand([null, null, null, null, null])}
                className="w-full text-[#aaa] text-sm py-3 mt-2 hover:text-white transition-colors"
              >
                Clear hand
              </button>
            )}
          </div>
        );
      })()}

      {/* Prompt to select pay table first */}
      {!selectedPayTable && (
        <div className="bg-[#0d0d0d] border border-dashed border-[#333] rounded p-6 text-center">
          <p className="text-[#aaa]">Select a pay table above to check hands</p>
        </div>
      )}

      {/* Strategy Quick Reference - Collapsible */}
      {game && (
        <details className="bg-[#161616] border border-[#333] rounded overflow-hidden group">
          <summary className="p-4 cursor-pointer flex items-center justify-between list-none">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-[#d4a855]" />
              <span className="text-white font-semibold">Strategy Tips</span>
            </div>
            <ChevronDown size={20} className="text-[#aaa] group-open:rotate-180 transition-transform" />
          </summary>
          <div className="px-4 pb-4 space-y-4">
            {/* Key Strategy Rules */}
            {game.strategyTips && game.strategyTips.length > 0 && (
              <div className="space-y-3">
                {game.strategyTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 py-1">
                    <span className="w-6 h-6 rounded-full bg-[#d4a855]/20 text-[#d4a855] text-sm font-bold flex items-center justify-center shrink-0">
                      {tip.priority}
                    </span>
                    <p className="text-[#ddd] text-sm leading-relaxed">{tip.rule}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Pay Tables Quick View */}
            {game.payTables && game.payTables.length > 0 && (
              <div className="pt-4 border-t border-[#333]">
                <p className="text-[#bbb] text-sm mb-2">Pay Tables ({game.keyLookup})</p>
                <div className="flex flex-wrap gap-2">
                  {game.payTables.map((pt, i) => (
                    <div key={i} className={`px-3 py-1.5 rounded text-sm ${
                      pt.rating === 'HUNT' ? 'bg-emerald-900/30 text-emerald-400' :
                      pt.rating === 'OK' ? 'bg-amber-900/30 text-amber-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {pt.label}: {pt.return}%
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Mistakes */}
            {game.commonMistakes && game.commonMistakes.length > 0 && (
              <div className="pt-4 border-t border-[#333]">
                <p className="text-red-400 text-sm font-medium mb-3">Common Mistakes</p>
                <div className="space-y-3">
                  {game.commonMistakes.map((m, i) => (
                    <div key={i} className="text-sm leading-relaxed">
                      <p className="text-red-300">Wrong: {m.mistake}</p>
                      <p className="text-emerald-400">Correct: {m.correct}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </details>
      )}

      {/* Card Picker Modal */}
      {showCardPicker !== null && (
        <CardPicker
          onSelect={(card) => {
            const newHand = [...selectedHand];
            newHand[showCardPicker] = card;
            setSelectedHand(newHand);
            setShowCardPicker(null);
          }}
          onClose={() => setShowCardPicker(null)}
          excludeCards={selectedHand}
        />
      )}
    </div>
  );
}

// ============================================
// BLOODIES TAB - Bloody Mary Tracker
// ============================================

// Badge definitions with criteria
const BLOODY_BADGES = [
  // Milestones
  { id: 'first-blood', name: 'First Blood', description: 'Log your first bloody', category: 'milestone', icon: '🩸', color: 'red', effect: 'confetti' },
  { id: 'getting-started', name: 'Getting Started', description: 'Log 5 bloodies', category: 'milestone', icon: '🚀', color: 'blue', effect: 'confetti' },
  { id: 'double-digits', name: 'Double Digits', description: 'Log 10 bloodies', category: 'milestone', icon: '🔟', color: 'purple', effect: 'explode' },
  // Daily Frequency
  { id: 'back-to-back', name: 'Back to Back', description: '2 bloodies within 30 minutes', category: 'frequency', icon: '⚡', color: 'yellow', effect: 'confetti' },
  { id: 'triple-threat', name: 'Triple Threat', description: '3 bloodies in one day', category: 'frequency', icon: '3️⃣', color: 'orange', effect: 'confetti' },
  { id: 'high-five', name: 'High Five', description: '5 bloodies in one day', category: 'frequency', icon: '🖐️', color: 'pink', effect: 'explode' },
  // Location
  { id: 'regular', name: 'Regular', description: 'Same location 3+ times', category: 'location', icon: '🏠', color: 'teal', effect: 'confetti' },
  { id: 'explorer', name: 'Explorer', description: '5 different locations', category: 'location', icon: '🧭', color: 'green', effect: 'confetti' },
  { id: 'wanderer', name: 'Wanderer', description: '10 different locations', category: 'location', icon: '🗺️', color: 'emerald', effect: 'explode' },
  { id: 'strip-crawler', name: 'Strip Crawler', description: '5 different Strip casinos', category: 'location', icon: '🎰', color: 'gold', effect: 'explode' },
  // Rating
  { id: 'five-star-find', name: 'Five Star Find', description: 'Log a 5-star bloody', category: 'rating', icon: '⭐', color: 'yellow', effect: 'confetti' },
  { id: 'tough-crowd', name: 'Tough Crowd', description: 'Log a 1-star bloody', category: 'rating', icon: '👎', color: 'gray', effect: 'none' },
  // Spice - these get fire effects!
  { id: 'cough-cough', name: 'Cough, Cough', description: 'Log a 5-fire spice rating', category: 'spice', icon: '🔥', color: 'red', effect: 'fire' },
  { id: 'heat-seeker', name: 'Heat Seeker', description: 'Log five 5-fire bloodies', category: 'spice', icon: '🌶️', color: 'orange', effect: 'explode' },
  { id: 'mild-mannered', name: 'Mild Mannered', description: 'Log a 1-fire bloody', category: 'spice', icon: '🥛', color: 'blue', effect: 'none' },
  { id: 'spice-spectrum', name: 'Spice Spectrum', description: 'Log all 5 spice levels', category: 'spice', icon: '🌈', color: 'purple', effect: 'explode' },
  { id: 'playing-it-safe', name: 'Playing It Safe', description: '5 in a row at 1-2 spice', category: 'spice', icon: '🛡️', color: 'teal', effect: 'fire' },
  // Time
  { id: 'hair-of-the-dog', name: 'Hair of the Dog', description: 'First bloody before 9am', category: 'time', icon: '🌅', color: 'amber', effect: 'confetti' },
  { id: 'night-owl', name: 'Night Owl', description: 'Bloody after midnight', category: 'time', icon: '🦉', color: 'indigo', effect: 'confetti' },
  { id: 'happy-hour', name: 'Happy Hour', description: 'Bloody between 4-6pm', category: 'time', icon: '🍻', color: 'yellow', effect: 'confetti' },
  { id: 'weekend-warrior', name: 'Weekend Warrior', description: 'Log on both Sat & Sun', category: 'time', icon: '🗓️', color: 'green', effect: 'explode' },
];

// Strip casino IDs for Strip Crawler badge
const STRIP_CASINO_IDS = [
  'bellagio', 'aria', 'cosmopolitan', 'venetian', 'palazzo', 'wynn', 'encore',
  'mgm-grand', 'mandalay-bay', 'luxor', 'excalibur', 'new-york-new-york', 'park-mgm',
  'caesars-palace', 'paris', 'ballys', 'flamingo', 'linq', 'harrahs',
  'treasure-island', 'mirage', 'circus-circus', 'sahara', 'resorts-world',
  'tropicana', 'planet-hollywood'
];

// Badge color mapping
const BADGE_COLORS = {
  red: { outline: 'from-red-500 to-red-700', fill: 'from-red-900/50 to-red-950/50' },
  orange: { outline: 'from-orange-500 to-orange-700', fill: 'from-orange-900/50 to-orange-950/50' },
  yellow: { outline: 'from-yellow-500 to-yellow-700', fill: 'from-yellow-900/50 to-yellow-950/50' },
  amber: { outline: 'from-amber-500 to-amber-700', fill: 'from-amber-900/50 to-amber-950/50' },
  gold: { outline: 'from-yellow-400 to-amber-600', fill: 'from-yellow-900/50 to-amber-950/50' },
  green: { outline: 'from-green-500 to-green-700', fill: 'from-green-900/50 to-green-950/50' },
  emerald: { outline: 'from-emerald-500 to-emerald-700', fill: 'from-emerald-900/50 to-emerald-950/50' },
  teal: { outline: 'from-teal-500 to-teal-700', fill: 'from-teal-900/50 to-teal-950/50' },
  blue: { outline: 'from-blue-500 to-blue-700', fill: 'from-blue-900/50 to-blue-950/50' },
  indigo: { outline: 'from-indigo-500 to-indigo-700', fill: 'from-indigo-900/50 to-indigo-950/50' },
  purple: { outline: 'from-purple-500 to-purple-700', fill: 'from-purple-900/50 to-purple-950/50' },
  pink: { outline: 'from-pink-500 to-pink-700', fill: 'from-pink-900/50 to-pink-950/50' },
  gray: { outline: 'from-gray-500 to-gray-700', fill: 'from-gray-800/50 to-gray-900/50' },
};

// Check which badges are earned based on bloodies history
function checkBadges(bloodies) {
  const earned = new Set();
  
  if (bloodies.length === 0) return earned;
  
  // Milestone badges
  if (bloodies.length >= 1) earned.add('first-blood');
  if (bloodies.length >= 5) earned.add('getting-started');
  if (bloodies.length >= 10) earned.add('double-digits');
  
  // Location-based badges
  const locationCounts = {};
  const uniqueLocations = new Set();
  const stripLocations = new Set();
  
  bloodies.forEach(b => {
    if (b.location) {
      const locKey = b.location.toLowerCase().trim();
      locationCounts[locKey] = (locationCounts[locKey] || 0) + 1;
      uniqueLocations.add(locKey);
      
      // Check if it's a strip casino
      if (STRIP_CASINO_IDS.some(id => locKey.includes(id) || id.includes(locKey))) {
        stripLocations.add(locKey);
      }
    }
  });
  
  if (Object.values(locationCounts).some(count => count >= 3)) earned.add('regular');
  if (uniqueLocations.size >= 5) earned.add('explorer');
  if (uniqueLocations.size >= 10) earned.add('wanderer');
  if (stripLocations.size >= 5) earned.add('strip-crawler');
  
  // Rating badges
  if (bloodies.some(b => b.rating === 5)) earned.add('five-star-find');
  if (bloodies.some(b => b.rating === 1)) earned.add('tough-crowd');
  
  // Spice badges
  const spiceLevels = new Set(bloodies.map(b => b.spice).filter(s => s));
  const fiveFireCount = bloodies.filter(b => b.spice === 5).length;
  
  if (bloodies.some(b => b.spice === 5)) earned.add('cough-cough');
  if (fiveFireCount >= 5) earned.add('heat-seeker');
  if (bloodies.some(b => b.spice === 1)) earned.add('mild-mannered');
  if (spiceLevels.size === 5) earned.add('spice-spectrum');
  
  // Playing it safe - 5 in a row at 1-2 spice
  let safeStreak = 0;
  for (const b of bloodies) {
    if (b.spice && b.spice <= 2) {
      safeStreak++;
      if (safeStreak >= 5) {
        earned.add('playing-it-safe');
        break;
      }
    } else {
      safeStreak = 0;
    }
  }
  
  // Time-based badges
  bloodies.forEach(b => {
    const date = new Date(b.timestamp);
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    if (hour < 9) earned.add('hair-of-the-dog');
    if (hour >= 0 && hour < 5) earned.add('night-owl'); // After midnight, before 5am
    if (hour >= 16 && hour < 18) earned.add('happy-hour');
  });
  
  // Weekend Warrior - need both Sat and Sun
  const hasSaturday = bloodies.some(b => new Date(b.timestamp).getDay() === 6);
  const hasSunday = bloodies.some(b => new Date(b.timestamp).getDay() === 0);
  if (hasSaturday && hasSunday) earned.add('weekend-warrior');
  
  // Frequency badges - group by day
  const byDay = {};
  bloodies.forEach(b => {
    const dayKey = new Date(b.timestamp).toDateString();
    if (!byDay[dayKey]) byDay[dayKey] = [];
    byDay[dayKey].push(b);
  });
  
  Object.values(byDay).forEach(dayBloodies => {
    if (dayBloodies.length >= 3) earned.add('triple-threat');
    if (dayBloodies.length >= 5) earned.add('high-five');
    
    // Back to back - 2 within 30 minutes
    const sorted = [...dayBloodies].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    for (let i = 1; i < sorted.length; i++) {
      const diff = new Date(sorted[i].timestamp) - new Date(sorted[i-1].timestamp);
      if (diff <= 30 * 60 * 1000) { // 30 minutes in ms
        earned.add('back-to-back');
        break;
      }
    }
  });
  
  return earned;
}

// Hexagon Badge Component
function HexBadge({ badge, earned, size = 'medium', onClick }) {
  const sizes = {
    small: { outer: 'w-16 h-[70px]', inner: 'w-12 h-[53px]', icon: 'text-xl' },
    medium: { outer: 'w-20 h-[88px]', inner: 'w-16 h-[70px]', icon: 'text-2xl' },
    large: { outer: 'w-28 h-[123px]', inner: 'w-24 h-[105px]', icon: 'text-4xl' },
  };
  
  const s = sizes[size];
  const colors = earned ? BADGE_COLORS[badge.color] : { outline: 'from-gray-600 to-gray-800', fill: 'from-gray-800/50 to-gray-900/50' };
  
  return (
    <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
      {/* Outer hexagon (border) */}
      <div 
        className={`${s.outer} bg-gradient-to-b ${colors.outline} flex items-center justify-center transition-all ${earned ? 'opacity-100' : 'opacity-40'}`}
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      >
        {/* Inner hexagon (fill) */}
        <div 
          className={`${s.inner} bg-gradient-to-b ${colors.fill} flex items-center justify-center`}
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
          {earned ? (
            <span className={s.icon}>{badge.icon}</span>
          ) : (
            <span className="text-gray-600 text-lg">🔒</span>
          )}
        </div>
      </div>
      <span className={`text-xs mt-2 text-center ${earned ? 'text-white' : 'text-gray-500'} max-w-[80px]`}>
        {badge.name}
      </span>
    </div>
  );
}

// Toast notification component
function BloodyToast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`fixed top-4 right-4 z-50 animate-slide-in-right`}>
      <div className={`rounded-lg px-4 py-3 shadow-lg flex items-center gap-3 ${
        type === 'success' ? 'bg-emerald-900/90 border border-emerald-700' :
        type === 'badge' ? 'bg-purple-900/90 border border-purple-700' :
        'bg-[#242424] border border-[#444]'
      }`}>
        <span className="text-2xl">{type === 'badge' ? '🏆' : '🍅'}</span>
        <div>
          <p className="text-white font-semibold">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Log Bloody Modal
function LogBloodyModal({ isOpen, onClose, onSubmit, casinos }) {
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [rating, setRating] = useState(0);
  const [spice, setSpice] = useState(0);
  const [notes, setNotes] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    const finalLocation = location === 'custom' ? customLocation : location;
    if (!finalLocation) return;
    
    onSubmit({
      location: finalLocation,
      rating,
      spice,
      notes,
      timestamp: new Date().toISOString(),
    });
    
    // Reset form
    setLocation('');
    setCustomLocation('');
    setRating(0);
    setSpice(0);
    setNotes('');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" onClick={onClose}>
      <div 
        className="bg-[#1a1a1a] border-t border-[#333] rounded-t-2xl w-full max-w-md p-5 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white font-bold text-xl">Log a Bloody 🍅</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        {/* Location */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Location *</label>
          <select 
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full bg-[#242424] border border-[#444] rounded-lg px-4 py-3 text-white"
          >
            <option value="">Select location...</option>
            {casinos.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
            <option value="custom">Other (type below)</option>
          </select>
          {location === 'custom' && (
            <input
              type="text"
              value={customLocation}
              onChange={e => setCustomLocation(e.target.value)}
              placeholder="Enter location name..."
              className="w-full mt-2 bg-[#242424] border border-[#444] rounded-lg px-4 py-3 text-white placeholder-gray-600"
            />
          )}
        </div>
        
        {/* Rating */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(rating === star ? 0 : star)}
                className={`text-3xl transition-all hover:scale-110 ${
                  star <= rating ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]' : 'text-gray-600'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        
        {/* Spice Level */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Spice Level</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(fire => (
              <button
                key={fire}
                onClick={() => setSpice(spice === fire ? 0 : fire)}
                className={`text-3xl transition-all hover:scale-110 ${
                  fire <= spice ? 'grayscale-0' : 'grayscale opacity-40'
                }`}
              >
                🔥
              </button>
            ))}
          </div>
        </div>
        
        {/* Notes */}
        <div className="mb-5">
          <label className="text-gray-400 text-sm mb-1 block">Notes (optional)</label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Extra spicy, weak pour, great garnish..."
            className="w-full bg-[#242424] border border-[#444] rounded-lg px-4 py-3 text-white placeholder-gray-600"
          />
        </div>
        
        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!location || (location === 'custom' && !customLocation)}
          className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-white font-bold text-lg transition-colors"
        >
          Log It! 🍅
        </button>
      </div>
    </div>
  );
}

// Badge Detail Modal
function BadgeDetailModal({ badge, earned, onClose }) {
  if (!badge) return null;
  
  const colors = earned ? BADGE_COLORS[badge.color] : { outline: 'from-gray-600 to-gray-800', fill: 'from-gray-800/50 to-gray-900/50' };
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="text-center" onClick={e => e.stopPropagation()}>
        {/* Large hexagon badge */}
        <div 
          className={`w-32 h-[140px] bg-gradient-to-b ${colors.outline} flex items-center justify-center mx-auto mb-4 ${earned ? '' : 'opacity-40'}`}
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
          <div 
            className={`w-28 h-[123px] bg-gradient-to-b ${colors.fill} flex items-center justify-center`}
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
          >
            {earned ? (
              <span className="text-5xl">{badge.icon}</span>
            ) : (
              <span className="text-gray-600 text-3xl">🔒</span>
            )}
          </div>
        </div>
        
        <h2 className={`text-2xl font-bold mb-2 ${earned ? 'text-white' : 'text-gray-500'}`}>
          {badge.name}
        </h2>
        <p className={`${earned ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
          {badge.description}
        </p>
        <span className={`inline-block px-3 py-1 rounded-full text-xs ${
          earned ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' : 'bg-gray-800 text-gray-500 border border-gray-700'
        }`}>
          {earned ? '✓ Unlocked' : 'Locked'}
        </span>
        
        <button
          onClick={onClose}
          className="block mx-auto mt-6 px-6 py-2 bg-[#333] hover:bg-[#444] rounded-lg text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Main Bloodies Tab Component
function BloodiesTab() {
  // Load bloodies from localStorage
  const [bloodies, setBloodies] = useState(() => {
    const saved = localStorage.getItem('hitseeker_bloodies');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showLogModal, setShowLogModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [newBadges, setNewBadges] = useState([]);
  
  // Save bloodies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hitseeker_bloodies', JSON.stringify(bloodies));
  }, [bloodies]);
  
  // Calculate earned badges
  const earnedBadges = checkBadges(bloodies);
  
  // Get today's count
  const today = new Date().toDateString();
  const todayCount = bloodies.filter(b => new Date(b.timestamp).toDateString() === today).length;
  
  // Handle new bloody submission
  const handleLogBloody = (bloodyData) => {
    const newBloody = {
      id: Date.now().toString(),
      ...bloodyData
    };
    
    // Check for new badges before adding
    const oldEarned = checkBadges(bloodies);
    const newBloodies = [...bloodies, newBloody];
    const newEarned = checkBadges(newBloodies);
    
    // Find newly earned badges
    const justEarned = [];
    newEarned.forEach(badgeId => {
      if (!oldEarned.has(badgeId)) {
        justEarned.push(BLOODY_BADGES.find(b => b.id === badgeId));
      }
    });
    
    setBloodies(newBloodies);
    setToast({ message: 'Bloody logged!', type: 'success' });
    
    // Show badge unlock after a short delay
    if (justEarned.length > 0) {
      setTimeout(() => {
        setNewBadges(justEarned);
      }, 1500);
    }
  };
  
  // Badge unlock celebration modal with Lottie effects
  const BadgeUnlockModal = () => {
    if (newBadges.length === 0) return null;
    
    const badge = newBadges[0];
    const colors = BADGE_COLORS[badge.color];
    const effectType = badge.effect || 'confetti';
    
    // Refs for Lottie containers
    const fireContainerRef = useRef(null);
    const explosionContainerRef = useRef(null);
    const [showBadge, setShowBadge] = useState(false);
    const [explosions, setExplosions] = useState([]);
    
    // Explosion positions for major badges
    const explosionPositions = [
      { top: '15%', left: '20%', delay: 0, scale: 1.0 },
      { top: '10%', left: '80%', delay: 100, scale: 1.1 },
      { top: '45%', left: '10%', delay: 200, scale: 0.9 },
      { top: '50%', left: '50%', delay: 350, scale: 1.4 },
      { top: '40%', left: '90%', delay: 450, scale: 1.0 },
      { top: '80%', left: '25%', delay: 550, scale: 1.1 },
      { top: '75%', left: '75%', delay: 650, scale: 0.95 },
    ];
    
    useEffect(() => {
      // Show badge quickly
      const badgeTimer = setTimeout(() => setShowBadge(true), 100);
      
      // For explosion effect, trigger multiple explosions
      if (effectType === 'explode') {
        const newExplosions = explosionPositions.map((pos, i) => ({
          id: i,
          ...pos,
          visible: false,
          fading: false
        }));
        setExplosions(newExplosions);
        
        // Stagger the explosions
        explosionPositions.forEach((pos, i) => {
          setTimeout(() => {
            setExplosions(prev => prev.map(exp => 
              exp.id === i ? { ...exp, visible: true } : exp
            ));
          }, pos.delay);
          
          // Fade out each explosion
          setTimeout(() => {
            setExplosions(prev => prev.map(exp => 
              exp.id === i ? { ...exp, fading: true } : exp
            ));
          }, pos.delay + 1200);
          
          // Remove explosion
          setTimeout(() => {
            setExplosions(prev => prev.map(exp => 
              exp.id === i ? { ...exp, visible: false } : exp
            ));
          }, pos.delay + 1450);
        });
      }
      
      return () => clearTimeout(badgeTimer);
    }, [badge.id, effectType]);
    
    const handleDismiss = () => {
      setShowBadge(false);
      setExplosions([]);
      setTimeout(() => setNewBadges(prev => prev.slice(1)), 100);
    };
    
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        {/* Screen glow for fire/explode effects */}
        {(effectType === 'fire' || effectType === 'explode') && (
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 100, 0, 0.25) 0%, transparent 50%)',
              opacity: showBadge ? 1 : 0
            }}
          />
        )}
        
        {/* Explosion effects - renders 7 lottie players at different positions */}
        {effectType === 'explode' && explosions.map(exp => exp.visible && (
          <div
            key={exp.id}
            className="absolute pointer-events-none"
            style={{
              top: exp.top,
              left: exp.left,
              transform: `translate(-50%, -50%) scale(${exp.scale})`,
              width: '300px',
              height: '300px',
              opacity: exp.fading ? 0 : 1,
              transition: 'opacity 0.25s ease-out',
              zIndex: 51
            }}
          >
            <lottie-player
              src="/assets/explode.json"
              background="transparent"
              speed="1"
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ))}
        
        {/* Main content */}
        <div 
          className="text-center relative z-[100]"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: showBadge ? 'scale(1)' : 'scale(0.5)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div className="mb-2 text-yellow-400 text-sm font-semibold uppercase tracking-wider">
            🎉 Badge Unlocked! 🎉
          </div>
          
          {/* Badge with fire effect behind it */}
          <div className="relative mx-auto mb-4" style={{ width: '200px', height: '220px' }}>
            {/* Fire effect - positioned behind badge */}
            {effectType === 'fire' && (
              <div 
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ 
                  bottom: '25px', 
                  width: '240px', 
                  height: '260px',
                  zIndex: 1 
                }}
              >
                <lottie-player
                  src="/assets/fire-2.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            )}
            
            {/* Hexagon badge */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 bottom-0"
              style={{ zIndex: 10 }}
            >
              <div 
                className={`w-32 h-[140px] bg-gradient-to-b ${colors.outline} flex items-center justify-center shadow-lg`}
                style={{ 
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  boxShadow: effectType === 'fire' ? '0 0 40px rgba(255, 100, 0, 0.5)' : 
                             effectType === 'explode' ? '0 0 40px rgba(255, 200, 0, 0.5)' : 
                             'none'
                }}
              >
                <div 
                  className={`w-28 h-[123px] bg-gradient-to-b ${colors.fill} flex items-center justify-center`}
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <span className="text-5xl">{badge.icon}</span>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-2">{badge.name}</h2>
          <p className="text-gray-400 mb-6">{badge.description}</p>
          
          <button
            onClick={handleDismiss}
            className="px-8 py-3 bg-[#d4a855] hover:bg-[#c49745] rounded-lg text-black font-bold transition-colors"
          >
            {newBadges.length > 1 ? 'Next Badge →' : 'Awesome! 🍅'}
          </button>
        </div>
        
        {/* Confetti effect using canvas-confetti (simple CSS fallback) */}
        {effectType === 'confetti' && showBadge && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  backgroundColor: ['#d4a855', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][i % 7],
                  animation: `confetti-fall ${2 + Math.random() * 2}s linear forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="p-4 border-b border-[#333]">
        <h1 className="text-2xl font-bold text-white mb-1">Bloodies 🍅</h1>
        <p className="text-gray-500 text-sm">Track your Bloody Mary adventures</p>
      </div>
      
      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-[#1a1a1a] rounded-xl p-4 text-center border border-[#333]">
          <div className="text-4xl font-bold text-white">{bloodies.length}</div>
          <div className="text-gray-500 text-sm">Lifetime</div>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 text-center border border-[#333]">
          <div className="text-4xl font-bold text-[#d4a855]">{todayCount}</div>
          <div className="text-gray-500 text-sm">Today</div>
        </div>
      </div>
      
      {/* Log Button */}
      <div className="px-4 mb-6">
        <button
          onClick={() => setShowLogModal(true)}
          className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-xl text-white font-bold text-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-2xl">🍅</span>
          Log a Bloody
        </button>
      </div>
      
      {/* Badges Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Badges</h2>
          <span className="text-sm text-gray-500">{earnedBadges.size} / {BLOODY_BADGES.length}</span>
        </div>
        
        {/* Badge Grid */}
        <div className="grid grid-cols-4 gap-4">
          {BLOODY_BADGES.map(badge => (
            <HexBadge
              key={badge.id}
              badge={badge}
              earned={earnedBadges.has(badge.id)}
              size="small"
              onClick={() => setSelectedBadge(badge)}
            />
          ))}
        </div>
      </div>
      
      {/* Recent Bloodies */}
      {bloodies.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="text-lg font-bold text-white mb-3">Recent</h2>
          <div className="space-y-2">
            {bloodies.slice(-5).reverse().map(bloody => (
              <div key={bloody.id} className="bg-[#1a1a1a] rounded-lg p-3 border border-[#333]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white font-medium">{bloody.location}</div>
                    <div className="text-gray-500 text-xs">
                      {new Date(bloody.timestamp).toLocaleDateString()} at {new Date(bloody.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {bloody.rating > 0 && (
                      <span className="text-yellow-400 text-sm">{'★'.repeat(bloody.rating)}</span>
                    )}
                    {bloody.spice > 0 && (
                      <span className="text-sm">{'🔥'.repeat(bloody.spice)}</span>
                    )}
                  </div>
                </div>
                {bloody.notes && (
                  <div className="text-gray-400 text-sm mt-1 italic">"{bloody.notes}"</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Log Modal */}
      <LogBloodyModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        onSubmit={handleLogBloody}
        casinos={vegasCasinos}
      />
      
      {/* Badge Detail Modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        earned={selectedBadge && earnedBadges.has(selectedBadge.id)}
        onClose={() => setSelectedBadge(null)}
      />
      
      {/* Toast */}
      {toast && (
        <BloodyToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Badge Unlock Modal */}
      <BadgeUnlockModal />
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function MainApp() {
  const { user, profile, signOut } = useAuth();
  const { currentTrip, tripMembers } = useTrip();
  const { notes, loading: notesLoading, addNote, updateNote, deleteNote, refresh: refreshNotes } = useNotes();
  const { photos, addPhoto, deletePhoto, getPhotoUrl, getMachinePhotos, getLatestPhoto } = usePhotos();
  const { myCheckIn, checkIn, checkOut, getMembersAtCasino } = useCheckIns();

  const [activeTab, setActiveTab] = useState('hunt');
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
  const [machineViewMode, setMachineViewMode] = useState('cards'); // 'list' or 'cards'
  const [apOnly, setApOnly] = useState(false); // AP machines only toggle
  const [releaseYearFilter, setReleaseYearFilter] = useState('all'); // 'all', '2024', '2023', etc.

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

  // Debug mode for testing check-in flows (set to null to use real geolocation)
  // Options: 'near-casino' | 'not-near' | 'error' | null
  const [debugGeoMode, setDebugGeoMode] = useState(null);
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [showStrategyValidator, setShowStrategyValidator] = useState(false);

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
          <button onClick={() => setShowTripSettings(false)} className="flex items-center gap-2 text-[#d4a855] mb-6">
            <ChevronLeft size={20} /> Back
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-6">{currentTrip.name}</h2>
          
          <div className="bg-[#161616] rounded p-4 mb-4 border border-[#333]">
            <h3 className="font-semibold text-white mb-3">Share Code</h3>
            <code className="block bg-[#0d0d0d] px-4 py-3 rounded text-white font-mono text-xl tracking-widerr text-center">
              {currentTrip.share_code.toUpperCase()}
            </code>
            <p className="text-[#bbbbbb] text-sm text-center mt-2">Share this with friends to invite them</p>
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

          <button onClick={signOut} className="w-full bg-[#161616] hover:bg-gray-700 text-gray-300 py-3 rounded border border-[#333] flex items-center justify-center gap-2">
            <LogOut size={18} /> Sign Out
          </button>
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
    <div className="min-h-screen bg-[#0d0d0d] pb-20">
      <TripHeader 
        onOpenSettings={() => setShowTripSettings(true)} 
        onLocationClick={handleHeaderCheckIn}
        myCheckIn={myCheckIn}
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
                    step === onboardingStep ? 'bg-[#d4a855]' : 
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
                    <span className="text-[#d4a855]">HitSeeker</span>
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
                    <Diamond size={32} className="text-[#d4a855]" />
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
                      <MapPin size={16} className="text-emerald-400" />
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
                <button
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  className="flex-1 bg-[#d4a855] hover:bg-[#c49745] text-black font-bold py-3 rounded transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => {
                    localStorage.setItem('hitseeker_onboarded', 'true');
                    setShowOnboarding(false);
                    setOnboardingStep(1);
                  }}
                  className="flex-1 bg-[#d4a855] hover:bg-[#c49745] text-black font-bold py-3 rounded transition-colors"
                >
                  Start Hunting
                </button>
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
              <button onClick={() => setShowTierHelp(false)} className="text-[#aaa] hover:text-white">
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
                <MapPin size={28} className="text-emerald-400" />
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
              <button 
                onClick={confirmCheckIn}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded font-semibold"
              >
                {myCheckIn ? `Switch to ${pendingCheckIn.name}` : 'Check In'}
              </button>
              <button 
                onClick={cancelCheckIn}
                className="w-full bg-[#1a1a1a] hover:bg-[#252525] text-[#aaa] py-3 rounded font-medium"
              >
                Choose Different Casino
              </button>
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

      {/* Debug Menu for Testing Geolocation Flows */}
      <button
        onClick={() => setShowDebugMenu(!showDebugMenu)}
        className="fixed bottom-24 right-4 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center text-xs font-bold z-40 shadow-lg"
      >
        DEV
      </button>
      
      {showDebugMenu && (
        <div className="fixed bottom-36 right-4 bg-[#161616] border border-purple-500/50 rounded p-4 z-40 shadow-xl w-64">
          <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">Developer Tools</p>
          
          {/* Strategy Validator */}
          <button
            onClick={() => { setShowStrategyValidator(true); setShowDebugMenu(false); }}
            className="w-full text-left px-3 py-2 rounded text-sm bg-[#0d0d0d] text-[#aaa] hover:text-white hover:bg-emerald-900/30 mb-3"
          >
            Run Strategy Validator
          </button>
          
          <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">Geolocation Simulator</p>
          <div className="space-y-2">
            <button
              onClick={() => { setDebugGeoMode('near-casino'); setShowDebugMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${debugGeoMode === 'near-casino' ? 'bg-purple-600 text-white' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'}`}
            >
              Near Casino (Bellagio)
            </button>
            <button
              onClick={() => { setDebugGeoMode('not-near'); setShowDebugMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${debugGeoMode === 'not-near' ? 'bg-purple-600 text-white' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'}`}
            >
              Not Near Any Casino
            </button>
            <button
              onClick={() => { setDebugGeoMode('error'); setShowDebugMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${debugGeoMode === 'error' ? 'bg-purple-600 text-white' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'}`}
            >
              Geolocation Error
            </button>
            <button
              onClick={() => { setDebugGeoMode(null); setShowDebugMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${debugGeoMode === null ? 'bg-purple-600 text-white' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'}`}
            >
              Use Real Location
            </button>
          </div>
          <p className="text-[#666] text-xs mt-3">
            Current: <span className="text-purple-400">{debugGeoMode || 'Real'}</span>
          </p>
          <p className="text-[#555] text-xs mt-1">
            Tap "Check In" button to test
          </p>
        </div>
      )}
      
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
                  className="w-full bg-[#161616] border border-[#333] rounded pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-[#d4a855] focus:outline-none"
                />
              </div>
              {/* View Toggle */}
              <div className="flex bg-[#161616] border border-[#333] rounded overflow-hidden">
                <button
                  onClick={() => setMachineViewMode('list')}
                  className={`p-3 transition-colors ${machineViewMode === 'list' ? 'bg-[#d4a855] text-black' : 'text-[#aaaaaa] hover:text-white'}`}
                  title="List view"
                >
                  <LayoutList size={20} />
                </button>
                <button
                  onClick={() => setMachineViewMode('cards')}
                  className={`p-3 transition-colors ${machineViewMode === 'cards' ? 'bg-[#d4a855] text-black' : 'text-[#aaaaaa] hover:text-white'}`}
                  title="Card view"
                >
                  <Grid size={20} />
                </button>
              </div>
            </div>

            {/* AP Toggle and Year Filter Row */}
            <div className="flex items-center gap-3">
              {/* AP Only Toggle */}
              <button
                onClick={() => setApOnly(!apOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  apOnly 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#161616] text-[#bbbbbb] border border-[#333]'
                }`}
              >
                <Target size={16} />
                AP Only ({apCount})
              </button>
              
              {/* Release Year Filter */}
              {releaseYears.length > 0 && (
                <select
                  value={releaseYearFilter}
                  onChange={(e) => setReleaseYearFilter(e.target.value)}
                  className="bg-[#161616] border border-[#333] rounded px-3 py-2 text-sm text-[#bbbbbb] focus:outline-none focus:border-[#d4a855]"
                >
                  <option value="all">All Years</option>
                  {releaseYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}

              {/* Help Button */}
              <button
                onClick={() => setShowTierHelp(true)}
                className="ml-auto p-2 text-[#aaa] hover:text-[#d4a855] transition-colors"
                title="What do tiers mean?"
              >
                <Info size={18} />
              </button>
            </div>

            {/* Category Filter - horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-[#d4a855] text-black' 
                    : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                }`}
              >
                All ({apOnly ? apCount : filteredMachines.length})
              </button>
              {Object.entries(machineCategories)
                .filter(([key]) => !apOnly || key !== 'entertainment')
                .map(([key, cat]) => {
                const count = filteredMachines.filter(m => m.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      selectedCategory === key 
                        ? 'bg-[#d4a855] text-black' 
                        : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                    }`}
                  >
                    {cat.name.split(' ')[0]} ({count})
                  </button>
                );
              })}
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
        )}

        {/* Machine Detail (Hunt) - with context-aware calculator */}
        {activeTab === 'hunt' && selectedMachine && (
          <div className="space-y-4">
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
              <button
                onClick={() => openSlotSpotter(selectedMachine.name)}
                className="bg-[#d4a855] hover:bg-[#c49745] text-black rounded p-3 flex items-center justify-center gap-2 font-semibold"
              >
                <MapPin size={18} />
                Spot It
              </button>
              <button
                onClick={() => document.getElementById('photo-input-hunt')?.click()}
                disabled={photoUploading}
                className={`rounded p-3 flex items-center justify-center gap-2 transition-colors ${
                  photoUploading 
                    ? 'bg-[#d4a855] text-black' 
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
                    <button
                      key={photo.id}
                      onClick={() => setViewingPhoto(photo)}
                      className="aspect-square rounded overflow-hidden bg-[#0d0d0d]"
                    >
                      <img src={getPhotoUrl(photo)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes tab removed - consolidated into Trip tab */}

        {/* TRIP TAB */}
        {activeTab === 'trip' && !selectedCasino && (
          <div className="space-y-4">
            {/* Sub-tab navigation */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'casinos', label: 'Casinos', icon: Building2 },
                { id: 'notes', label: 'Notes', icon: StickyNote }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setTripSubTab(sub.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all whitespace-nowrap ${
                    tripSubTab === sub.id
                      ? 'bg-[#d4a855] text-black'
                      : 'bg-[#1a1a1a] text-[#aaa] border border-[#333]'
                  }`}
                >
                  <sub.icon size={16} />
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Overview Sub-tab */}
            {tripSubTab === 'overview' && (
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
                                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-[#d4a855] text-black'}`}>
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
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-[#d4a855] text-black'}`}>
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
                                      <MapPin size={10} /> {activity.casino}
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
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isVP ? 'bg-blue-600 text-white' : 'bg-[#d4a855] text-black'}`}>
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
                                      <MapPin size={10} /> {note.casino}
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

            {/* Casinos Sub-tab */}
            {tripSubTab === 'casinos' && (
              <>
                {/* Quick Check-in */}
                {!myCheckIn && (
                  <button
                    onClick={detectCasino}
                    disabled={geoStatus === 'loading'}
                    className="w-full bg-[#d4a855]/20 border border-[#d4a855] text-[#d4a855] py-3 rounded flex items-center justify-center gap-2"
                  >
                    {geoStatus === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <Navigation size={18} />}
                    {geoStatus === 'loading' ? 'Detecting...' : 'Detect My Location'}
                  </button>
                )}
                
                {/* Search */}
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                  <input
                    type="text"
                    placeholder="Search casinos..."
                    value={casinoSearch}
                    onChange={(e) => setCasinoSearch(e.target.value)}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded pl-10 pr-10 py-3 text-white placeholder-[#666] focus:border-[#d4a855] focus:outline-none"
                  />
                  {casinoSearch && (
                    <button 
                      onClick={() => setCasinoSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                
                {/* Area Filter - horizontal scroll */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  <button
                    onClick={() => setCasinoAreaFilter('all')}
                    className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      casinoAreaFilter === 'all' ? 'bg-[#d4a855] text-black' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {[...new Set(vegasCasinos.map(c => c.area))].map(area => (
                    <button
                      key={area}
                      onClick={() => setCasinoAreaFilter(area)}
                      className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        casinoAreaFilter === area ? 'bg-[#d4a855] text-black' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>

                {(() => {
                  const filteredCasinos = vegasCasinos.filter(casino => {
                    const matchesSearch = !casinoSearch || 
                      casino.name.toLowerCase().includes(casinoSearch.toLowerCase()) ||
                      casino.owner.toLowerCase().includes(casinoSearch.toLowerCase());
                    const matchesArea = casinoAreaFilter === 'all' || casino.area === casinoAreaFilter;
                    return matchesSearch && matchesArea;
                  });
                  
                  return (
                    <>
                      <p className="text-[#888] text-sm">{filteredCasinos.length} casinos</p>
                      <div className="space-y-2">
                        {filteredCasinos.map(casino => {
                          const membersHere = getMembersAtCasino(casino.id);
                          const isMyLocation = myCheckIn?.casino_id === casino.id;
                          return (
                            <button
                              key={casino.id}
                              onClick={() => setSelectedCasino(casino)}
                              className={`w-full bg-[#161616] border rounded p-4 text-left ${isMyLocation ? 'border-emerald-500' : 'border-[#333]'}`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white">{casino.name}</h3>
                                    {isMyLocation && <span className="text-emerald-400 text-xs bg-emerald-400/20 px-2 py-0.5 rounded-full">You're here</span>}
                                  </div>
                                  <p className="text-sm text-[#aaa]">{casino.owner} • {casino.size} • {casino.slots} slots</p>
                                </div>
                                <div className="text-right">
                                  {membersHere.length > 0 && (
                                    <div className="flex items-center gap-1 text-[#d4a855] text-sm">
                                      <Users size={14} /> {membersHere.length}
                                    </div>
                                  )}
                                  <p className="text-[#888] text-xs">{casino.area}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                        {filteredCasinos.length === 0 && (
                          <div className="bg-[#0d0d0d] border border-dashed border-[#333] rounded p-6 text-center">
                            <p className="text-[#888]">No casinos match your search</p>
                            <button 
                              onClick={() => { setCasinoSearch(''); setCasinoAreaFilter('all'); }}
                              className="text-[#d4a855] text-sm mt-2 hover:underline"
                            >
                              Clear filters
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </>
            )}

            {/* Notes Sub-tab */}
            {tripSubTab === 'notes' && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Scouting Notes</h2>
                  <div className="flex items-center gap-2">
                    <button onClick={refreshNotes} className="p-2 text-[#bbbbbb] hover:text-white">
                      <RefreshCw size={18} />
                    </button>
                    <button onClick={() => setShowNoteForm(true)} className="bg-[#d4a855] hover:bg-[#a67c3d] text-white px-4 py-2 rounded text-sm font-semibold">
                      + Add
                    </button>
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
                    <button
                      onClick={() => setShowNoteForm(true)}
                      className="bg-[#d4a855] hover:bg-[#c49745] text-black font-semibold px-4 py-2 rounded text-sm inline-flex items-center gap-2"
                    >
                      <StickyNote size={16} />
                      Add Your First Note
                    </button>
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
        )}

        {/* Casino Detail */}
        {activeTab === 'trip' && selectedCasino && (
          <div className="space-y-4">
            <button onClick={() => setSelectedCasino(null)} className="flex items-center gap-2 text-[#d4a855]">
              <ChevronLeft size={20} /> Back
            </button>
            
            <div className="bg-[#161616] border border-[#333] rounded p-4">
              <h2 className="text-xl font-bold text-white mb-1">{selectedCasino.name}</h2>
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
                <button
                  onClick={() => handleCheckIn(selectedCasino)}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded font-semibold"
                >
                  Check In Here
                </button>
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-[#333] px-4 py-2">
        <div className="flex justify-around max-w-md mx-auto">
          {[
            { id: 'hunt', icon: Gem, label: 'Slots' },
            { id: 'vp', icon: Spade, label: 'Video Poker' },
            { id: 'bloodies', icon: null, label: 'Bloodies', emoji: '🍅' },
            { id: 'trip', icon: Map, label: 'Trip' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedMachine(null); setSelectedCasino(null); }}
              className={`flex flex-col items-center py-2 px-3 ${activeTab === tab.id ? 'text-[#d4a855]' : 'text-[#aaaaaa]'}`}
            >
              {tab.emoji ? (
                <span className="text-xl">{tab.emoji}</span>
              ) : (
                <tab.icon size={22} />
              )}
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          ))}
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
      <TripContent />
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
