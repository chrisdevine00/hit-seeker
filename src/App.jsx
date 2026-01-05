import React, { useState, useEffect, useRef } from 'react';
import { Search, Calculator, ChevronRight, ChevronDown, ChevronUp, Check, X, AlertTriangle, Info, Home, List, Building2, StickyNote, Trash2, Edit3, Eye, MapPin, Target, ChevronLeft, Navigation, LogOut, CheckCircle2, Camera, ImagePlus, Users, Share2, Copy, RefreshCw, Loader2, Grid, LayoutList, Crosshair, Map, BookOpen, Spade, Heart, Diamond, Club, Gem, GlassWater, Flame, Sparkles, Star, Lock } from 'lucide-react';

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
import { ConfirmDialog, FilledMapPin, Button } from './components/ui';
import { Toaster, toast } from 'sonner';

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

// ============================================
// SPOTTER FORM - Unified for Slots and VP
// ============================================
function SpotterForm({ onSubmit, onCancel, spotType: initialSpotType, prefillData, currentCasino }) {
  // spotType: 'slot', 'vp', or 'bloody'
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

  // Bloody-specific state
  const [bloodyRating, setBloodyRating] = useState(0);
  const [bloodySpice, setBloodySpice] = useState(0);

  // vpGames is an object, not array - get the game by key or find by id
  const vpGame = vpGames[selectedVPGame] || Object.values(vpGames).find(g => g.id === selectedVPGame);

  const handleSubmit = () => {
    if (activeType === 'slot' && !machine.trim()) return;
    if (activeType === 'vp' && !selectedVPGame) return;
    if (activeType === 'bloody' && !casino.trim()) return;

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
    } else if (activeType === 'vp') {
      noteData.vpGame = selectedVPGame;
      noteData.vpGameName = vpGame?.name || prefillData?.gameName;
      noteData.vpPayTable = selectedVPPayTable?.label || prefillData?.payTable;
      noteData.vpReturn = selectedVPPayTable?.return || prefillData?.return;
      noteData.denomination = denomination.trim();
      noteData.state = state.trim();
    } else if (activeType === 'bloody') {
      noteData.bloodyRating = bloodyRating;
      noteData.bloodySpice = bloodySpice;
      noteData.state = state.trim(); // notes
    }

    onSubmit(noteData);
  };

  const isVP = activeType === 'vp';
  const isBloody = activeType === 'bloody';

  return (
    <div className="bg-[#161616] border border-[#333] rounded p-4 space-y-4">
      <div className="flex items-center gap-2">
        {activeType === 'slot' && <Gem size={24} className="text-[#d4a855]" />}
        {activeType === 'vp' && <Spade size={24} className="text-[#d4a855]" />}
        {activeType === 'bloody' && <GlassWater size={24} className="text-[#d4a855]" />}
        <h3 className="font-bold text-white text-lg">
          {activeType === 'bloody' ? 'Log Bloody' : 'Spot Find'}
        </h3>
      </div>
      
      {/* Type Toggle - only show if not locked */}
      {!isTypeLocked && (
        <div className="flex gap-2 p-1 bg-[#0d0d0d] rounded">
          <button
            onClick={() => setActiveType('slot')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeType === 'slot'
                ? 'bg-[#d4a855] text-black'
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            Slot
          </button>
          <button
            onClick={() => setActiveType('vp')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeType === 'vp'
                ? 'bg-[#d4a855] text-black'
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            Video Poker
          </button>
          <button
            onClick={() => setActiveType('bloody')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeType === 'bloody'
                ? 'bg-[#d4a855] text-black'
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            Bloody
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
                <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Game <span className="text-red-500">*</span></label>
                {selectedVPGame ? (
                  <button
                    onClick={() => { setSelectedVPGame(''); setSelectedVPPayTable(null); }}
                    className="w-full bg-[#d4a855] border border-[#d4a855] rounded px-4 py-3 text-black font-medium text-left flex items-center justify-between"
                  >
                    <span className="truncate">{vpGames[selectedVPGame]?.name || selectedVPGame}</span>
                    <X size={18} className="shrink-0 ml-2 opacity-60" />
                  </button>
                ) : (
                  <select
                    value=""
                    onChange={(e) => { setSelectedVPGame(e.target.value); setSelectedVPPayTable(null); }}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-[#aaa] font-medium focus:outline-none focus:border-[#d4a855] appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                  >
                    <option value="" disabled>Select a game...</option>
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
                )}
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
      ) : isBloody ? (
        // Bloody Mary - Rating and Spice
        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-[#888] text-xs uppercase tracking-wider mb-2 block">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => { hapticLight(); setBloodyRating(bloodyRating === star ? 0 : star); }}
                  className={`text-3xl transition-all hover:scale-110 ${
                    star <= bloodyRating ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]' : 'text-gray-600'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level */}
          <div>
            <label className="text-[#888] text-xs uppercase tracking-wider mb-2 block">Spice Level</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(fire => (
                <button
                  key={fire}
                  onClick={() => { hapticLight(); setBloodySpice(bloodySpice === fire ? 0 : fire); }}
                  className={`transition-all hover:scale-110 ${
                    fire <= bloodySpice ? 'text-orange-500' : 'text-gray-600 opacity-40'
                  }`}
                >
                  <Flame size={28} fill="currentColor" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Slot Selection
        <div>
          <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Machine <span className="text-red-500">*</span></label>
          {prefillData?.machine ? (
            <div className="w-full bg-[#d4a855] border border-[#d4a855] rounded px-4 py-3 text-black font-medium">
              {prefillData.machine}
            </div>
          ) : machine ? (
            <button
              onClick={() => setMachine('')}
              className="w-full bg-[#d4a855] border border-[#d4a855] rounded px-4 py-3 text-black font-medium text-left flex items-center justify-between"
            >
              <span className="truncate">{machine}</span>
              <X size={18} className="shrink-0 ml-2 opacity-60" />
            </button>
          ) : (
            <select
              value=""
              onChange={(e) => setMachine(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-[#aaa] font-medium focus:outline-none focus:border-[#d4a855] appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              <option value="" disabled>Select a machine...</option>
              {machines.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              <option value="Other">Other</option>
            </select>
          )}
        </div>
      )}
      
      {/* Casino */}
      <div>
        <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">Casino {isBloody && <span className="text-red-500">*</span>}</label>
        {casino ? (
          <button
            onClick={() => setCasino('')}
            className="w-full bg-[#d4a855] border border-[#d4a855] rounded px-4 py-3 text-black font-medium text-left flex items-center justify-between"
          >
            <span className="truncate">{casino}</span>
            <X size={18} className="shrink-0 ml-2 opacity-60" />
          </button>
        ) : (
          <select
            value=""
            onChange={(e) => setCasino(e.target.value)}
            className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-[#aaa] font-medium focus:outline-none focus:border-[#d4a855] appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
          >
            <option value="" disabled>Select a casino...</option>
            {vegasCasinos.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        )}
      </div>
      
      {/* Location within casino - not needed for bloody */}
      {!isBloody && (
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
      )}

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
          {isBloody ? 'Notes' : isVP ? 'Notes' : 'Machine State'}
        </label>
        <textarea
          placeholder={isBloody ? "e.g., Great garnishes, served in a souvenir glass" : isVP ? "e.g., Multiple machines, good location" : "e.g., Meter at 85%, 3 coins on reel 2"}
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-white placeholder-[#555] min-h-[70px]"
        />
      </div>

      {/* Playable toggle - not for bloody */}
      {!isBloody && (
        <button
          onClick={() => setPlayable(!playable)}
          className={`w-full py-3 rounded font-semibold flex items-center justify-center gap-2 transition-colors border ${
            playable ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-[#1a1a1a] text-[#888] border-[#333]'
          }`}
        >
          {playable ? <CheckCircle2 size={18} /> : <div className="w-5 h-5 border-2 border-[#555] rounded-full" />}
          {playable ? 'Marked as Playable!' : 'Mark as Playable?'}
        </button>
      )}

      {/* Validation Message */}
      {(() => {
        const missingField = isBloody
          ? (!casino && 'casino')
          : isVP
            ? (!selectedVPGame ? 'game' : (!selectedVPPayTable && !prefillData?.payTable) ? 'pay table' : null)
            : (!machine && 'machine');
        return missingField ? (
          <p className="text-red-400 text-sm text-center">Please select a {missingField} to continue</p>
        ) : null;
      })()}

      {/* Actions */}
      <div className="space-y-2">
        <Button
          onClick={handleSubmit}
          disabled={isBloody ? !casino : isVP ? !(selectedVPGame && (selectedVPPayTable || prefillData?.payTable)) : !machine}
          variant="primary"
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Spot
        </Button>
        <Button
          onClick={onCancel}
          variant="secondary"
          className="w-full"
        >
          Cancel
        </Button>
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
    return 'bg-[#d4a855] text-black';
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
        <button onClick={onClose} className="no-animate text-white p-2" aria-label="Close"><X size={24} /></button>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {hasPrev && (
          <button onClick={() => onNavigate(allPhotos[currentIndex - 1])} className="no-animate absolute left-2 bg-black/50 p-2 rounded-full text-white">
            <ChevronLeft size={24} />
          </button>
        )}
        <img src={photoUrl} alt={machineName} className="max-h-full max-w-full object-contain" />
        {hasNext && (
          <button onClick={() => onNavigate(allPhotos[currentIndex + 1])} className="no-animate absolute right-2 bg-black/50 p-2 rounded-full text-white">
            <ChevronRight size={24} />
          </button>
        )}
      </div>
      
      <div className="p-4 bg-black/80 flex items-center justify-between">
        <div>
          <p className="text-[#bbbbbb] text-sm">{currentIndex + 1} of {allPhotos.length}</p>
          <p className="text-[#aaaaaa] text-xs">{formatRelativeTime(photo.created_at)}</p>
        </div>
        <Button onClick={() => onDelete(photo.id)} variant="danger-subtle" size="sm" className="flex items-center gap-2">
          <Trash2 size={16} /> Delete
        </Button>
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
            <button onClick={() => goTo(currentIndex - 1)} className="no-animate p-1 text-[#bbbbbb] hover:text-white" aria-label="Previous photo"><ChevronLeft size={20} /></button>
            <span className="text-xs text-[#aaaaaa]">{currentIndex + 1}/{tierMachines.length}</span>
            <button onClick={() => goTo(currentIndex + 1)} className="no-animate p-1 text-[#bbbbbb] hover:text-white" aria-label="Next photo"><ChevronRight size={20} /></button>
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  const existingPhoto = photos.length > 0 ? photos[0] : null;

  const handleDeleteConfirm = async () => {
    if (existingPhoto) {
      await onDeletePhoto(machine.id, existingPhoto.id);
      toast.success('Photo deleted');
    }
    setShowDeleteConfirm(false);
  };

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
              <Button onClick={handleReplaceConfirm} variant="primary" className="w-full">Replace</Button>
              <Button onClick={handleReplaceCancel} variant="secondary" className="w-full">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Photo Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161616] rounded p-6 max-w-sm w-full border border-[#333]">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Photo?</h3>
            <p className="text-[#bbbbbb] mb-6">This action cannot be undone.</p>
            <div className="space-y-2">
              <Button onClick={handleDeleteConfirm} variant="danger" className="w-full">Delete</Button>
              <Button onClick={() => setShowDeleteConfirm(false)} variant="secondary" className="w-full">Cancel</Button>
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
          <div className="flex gap-2 mb-3">
            <button
              onClick={handlePhotoClick}
              className="flex-1 bg-[#0d0d0d] border border-[#333] hover:border-[#d4a855] text-[#aaa] hover:text-white text-sm flex items-center justify-center gap-2 py-2 px-3 rounded transition-colors"
              disabled={uploading}
            >
              <Camera size={16} /> {uploading ? 'Uploading...' : 'Replace'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-[#0d0d0d] border border-[#333] hover:border-red-500 text-[#aaa] hover:text-red-400 text-sm flex items-center justify-center gap-2 py-2 px-3 rounded transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
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

      <Button onClick={() => onAddNote(machine.name)} variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
        <StickyNote size={18} /> Add Note for {machine.shortName}
      </Button>
    </div>
  );
}

// ============================================
// VIDEO POKER TAB COMPONENT
// ============================================
function VideoPokerTab({ onSpot }) {
  const [selectedGame, setSelectedGame] = useState(null);
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
  
  // If a game was selected but is no longer in the filtered list, clear selection
  React.useEffect(() => {
    if (selectedGame && filteredGames.length > 0 && !filteredGames.find(g => g.id === selectedGame)) {
      setSelectedGame(null);
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

    // Split ranks into two rows: A-8 (high) and 7-2 (low)
    const ranksRow1 = ['A', 'K', 'Q', 'J', '10', '9', '8'];
    const ranksRow2 = ['7', '6', '5', '4', '3', '2'];

    const renderCard = (rank, suit) => {
      const cardKey = `${rank}${suit.symbol}`;
      const isExcluded = excludeSet.has(cardKey);
      return (
        <button
          key={cardKey}
          disabled={isExcluded}
          onClick={() => onSelect({ rank, suit: suit.symbol, color: suit.color })}
          className={`aspect-[2.5/3.5] rounded border-2 flex flex-col items-center justify-center font-bold transition-colors ${
            isExcluded
              ? 'bg-[#0d0d0d] border-[#1a1a1a] text-[#333] cursor-not-allowed'
              : 'bg-[#1a1a1a] border-[#333] hover:border-[#d4a855] hover:bg-[#222] ' + suit.pickerColor
          }`}
        >
          <span className="text-base font-bold leading-none">{rank}</span>
          <span className="text-lg leading-none">{suit.symbol}</span>
        </button>
      );
    };

    return (
      <div className="fixed inset-0 bg-[#0d0d0d] z-50 flex flex-col" style={{ paddingTop: 'var(--sat, 0px)', paddingBottom: 'var(--sab, 0px)' }}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-[#333]">
          <h3 className="text-white font-semibold text-lg">Select Card</h3>
          <button onClick={onClose} className="no-animate text-[#aaa] hover:text-white p-1" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Cards grid - fills remaining space */}
        <div className="flex-1 flex flex-col justify-center px-2 py-2 gap-1">
          {/* Joker option for Joker Poker games */}
          {isJokerGame && (
            <button
              disabled={jokerExcluded}
              onClick={() => onSelect({ rank: 'JOKER', suit: '★', color: 'text-purple-500', isJoker: true })}
              className={`py-2 rounded font-bold transition-colors mb-1 ${
                jokerExcluded
                  ? 'bg-[#0d0d0d] border border-[#222] text-[#333] cursor-not-allowed'
                  : 'bg-[#2a1a2a] border border-purple-500/50 hover:bg-[#3a2a3a] text-purple-400'
              }`}
            >
              ★ JOKER ★
            </button>
          )}

          {SUITS.map(suit => (
            <div key={suit.name} className="flex flex-col gap-1">
              {/* Row 1: A-7 */}
              <div className="grid grid-cols-7 gap-1">
                {ranksRow1.map(rank => renderCard(rank, suit))}
              </div>
              {/* Row 2: 8-K */}
              <div className="grid grid-cols-7 gap-1">
                {ranksRow2.map(rank => renderCard(rank, suit))}
                {/* Empty cell to balance the grid */}
                <div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#333] -mx-4 mb-4">
        <h1 className="text-2xl font-bold text-white">Video Poker</h1>
        <p className="text-gray-500 text-sm">Find the best pay tables</p>
      </div>

      <div className="space-y-4">
      {/* Content */}
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
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Category filter - horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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
          
          {/* Game selector */}
          <div className="w-full overflow-hidden">
            {filteredGames.length > 0 ? (
              selectedGame ? (
                /* Selected game - solid gold display with X to clear */
                <button
                  onClick={() => {
                    setSelectedGame(null);
                    setSelectedPayTable(null);
                    setSelectedHand([null, null, null, null, null]);
                  }}
                  className="w-full bg-[#d4a855] border border-[#d4a855] rounded px-4 py-3 text-black font-medium text-left flex items-center justify-between"
                >
                  <span className="truncate">{game?.name}</span>
                  <X size={18} className="shrink-0 ml-2 opacity-60" />
                </button>
              ) : (
                /* No game selected - dropdown with placeholder */
                <select
                  value=""
                  onChange={(e) => {
                    setSelectedGame(e.target.value);
                    setSelectedPayTable(null);
                    setSelectedHand([null, null, null, null, null]);
                  }}
                  className="w-full max-w-full bg-[#0d0d0d] border border-[#333] rounded px-4 py-3 text-[#aaa] font-medium focus:outline-none focus:border-[#d4a855] appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', boxSizing: 'border-box' }}
                >
                  <option value="" disabled>Select a game...</option>
                  {filteredGames.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              )
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
          </div>

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
        <Button
          onClick={() => onSpot(game, selectedPayTable)}
          variant="primary"
          className="w-full flex items-center justify-center gap-2"
        >
          <FilledMapPin size={18} holeColor="#d4a855" />
          Spot This Pay Table
        </Button>
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
            <div className={`flex gap-1 sm:gap-2 justify-center mb-3 ${isComplete ? 'animate-hand-complete' : ''}`} key={isComplete ? 'complete' : 'incomplete'}>
              {selectedHand.map((card, index) => {
                const shouldHold = recommendation?.hold?.includes(index);
                const isJoker = card?.rank === 'JOKER' || card?.isJoker;
                return (
                  <div key={index} className="text-center">
                    <button
                      onClick={() => setShowCardPicker(index)}
                      className={`w-14 h-20 sm:w-24 sm:h-32 rounded sm:rounded border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${
                        card
                          ? isComplete
                            ? shouldHold
                              ? 'bg-[#1a1a1a] border-[#444] card-hold'
                              : 'bg-[#1a1a1a] border-[#333] card-draw'
                            : isJoker
                              ? 'bg-purple-900 border-purple-500'
                              : 'bg-white border-white'
                          : 'bg-[#1a1a1a] border-[#444] border-dashed hover:border-[#d4a855]'
                      }`}
                    >
                      {card ? (
                        isJoker ? (
                          <>
                            <span className={`text-xl sm:text-3xl font-bold ${isComplete && !shouldHold ? 'text-purple-300/50' : 'text-purple-400'}`}>★</span>
                            <span className={`text-[8px] sm:text-xs font-bold ${isComplete && !shouldHold ? 'text-purple-300/50' : 'text-purple-400'}`}>JOKER</span>
                          </>
                        ) : (
                          <>
                            <span className={`text-2xl sm:text-4xl font-bold ${
                              isComplete
                                ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white')
                                : card.color
                            }`}>{card.rank}</span>
                            <span className={`text-xl sm:text-3xl ${
                              isComplete
                                ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white')
                                : card.color
                            }`}>{card.suit}</span>
                          </>
                        )
                      ) : (
                        <span className="text-[#666] text-2xl sm:text-4xl">?</span>
                      )}
                    </button>
                    {isComplete && (
                      <p className={`text-xs sm:text-sm mt-1 sm:mt-1.5 font-bold ${shouldHold ? 'text-[#d4a855]' : 'text-[#666]'}`}>
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
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 font-medium inline-flex items-center gap-0.5">
                      WoO <Check size={10} />
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

      {/* Prompt to select pay table first - only show when game is selected */}
      {selectedGame && !selectedPayTable && (
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
      </div>

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



// Log Bloody Modal
function LogBloodyModal({ isOpen, onClose, onSubmit, casinos }) {
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [rating, setRating] = useState(0);
  const [spice, setSpice] = useState(0);
  const [notes, setNotes] = useState('');

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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
        className="bg-[#1a1a1a] border-t border-[#333] rounded-t w-full max-w-md p-5 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white font-bold text-xl">Log a Bloody</h3>
          <button onClick={onClose} className="no-animate text-gray-400 hover:text-white text-2xl" aria-label="Close">&times;</button>
        </div>
        
        {/* Location */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Location <span className="text-red-500">*</span></label>
          {location && location !== 'custom' ? (
            <button
              onClick={() => setLocation('')}
              className="w-full bg-[#d4a855] border border-[#d4a855] rounded px-4 py-3 text-black font-medium text-left flex items-center justify-between"
            >
              <span className="truncate">{location}</span>
              <X size={18} className="shrink-0 ml-2 opacity-60" />
            </button>
          ) : location === 'custom' ? (
            <div>
              <button
                onClick={() => { setLocation(''); setCustomLocation(''); }}
                className="w-full bg-[#d4a855] border border-[#d4a855] rounded px-4 py-3 text-black font-medium text-left flex items-center justify-between"
              >
                <span className="truncate">Other (custom)</span>
                <X size={18} className="shrink-0 ml-2 opacity-60" />
              </button>
              <input
                type="text"
                value={customLocation}
                onChange={e => setCustomLocation(e.target.value)}
                placeholder="Enter location name..."
                className="w-full mt-2 bg-[#242424] border border-[#444] rounded px-4 py-3 text-white placeholder-gray-600"
              />
            </div>
          ) : (
            <select
              value=""
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-[#242424] border border-[#444] rounded px-4 py-3 text-[#aaa] font-medium appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              <option value="" disabled>Select a location...</option>
              {casinos.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
              <option value="custom">Other (type below)</option>
            </select>
          )}
        </div>
        
        {/* Rating */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-2 block">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => { hapticLight(); setRating(rating === star ? 0 : star); }}
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
                onClick={() => { hapticLight(); setSpice(spice === fire ? 0 : fire); }}
                className={`transition-all hover:scale-110 ${
                  fire <= spice ? 'text-orange-500' : 'text-gray-600 opacity-40'
                }`}
              >
                <Flame size={28} fill="currentColor" />
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
            className="w-full bg-[#242424] border border-[#444] rounded px-4 py-3 text-white placeholder-gray-600"
          />
        </div>
        
        {/* Validation Message */}
        {(!location || (location === 'custom' && !customLocation)) && (
          <p className="text-red-400 text-sm text-center mb-3">
            {!location ? 'Please select a location' : 'Please enter a location name'}
          </p>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!location || (location === 'custom' && !customLocation)}
          variant="danger"
          size="lg"
          className="w-full disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          Log It!
        </Button>
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
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [newBadges, setNewBadges] = useState([]);
  
  // Save bloodies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hitseeker_bloodies', JSON.stringify(bloodies));
  }, [bloodies]);
  
  // Calculate earned badges
  const earnedBadges = checkBloodyBadges(bloodies);
  
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
    const oldEarned = checkBloodyBadges(bloodies);
    const newBloodies = [...bloodies, newBloody];
    const newEarned = checkBloodyBadges(newBloodies);
    
    // Find newly earned badges
    const justEarned = [];
    newEarned.forEach(badgeId => {
      if (!oldEarned.has(badgeId)) {
        justEarned.push(BLOODY_BADGES.find(b => b.id === badgeId));
      }
    });
    
    setBloodies(newBloodies);
    hapticSuccess();

    // Build toast message parts
    const parts = [];
    if (bloodyData.spice > 0) parts.push(`${bloodyData.spice}🔥`);
    if (bloodyData.rating > 0) parts.push(`${bloodyData.rating}⭐`);
    const prefix = parts.length > 0 ? `${parts.join(' ')} ` : '';

    toast.success(`${prefix}Bloody at ${bloodyData.location}`, {
      icon: <GlassWater size={18} className="text-red-400" />,
    });
    
    // Show badge unlock after a short delay
    if (justEarned.length > 0) {
      setTimeout(() => {
        hapticCelebration();
        setNewBadges(justEarned);
      }, 1500);
    }
  };
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#333] -mx-4 mb-4">
        <h1 className="text-2xl font-bold text-white">Bloodies</h1>
        <p className="text-gray-500 text-sm">Track your Bloody Mary adventures</p>
      </div>

      <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1a1a1a] rounded p-4 text-center border border-[#333]">
          <div className="text-4xl font-bold text-white">{bloodies.length}</div>
          <div className="text-gray-500 text-sm">Lifetime</div>
        </div>
        <div className="bg-[#1a1a1a] rounded p-4 text-center border border-[#333]">
          <div className="text-4xl font-bold text-[#d4a855]">{todayCount}</div>
          <div className="text-gray-500 text-sm">Today</div>
        </div>
      </div>
      
      {/* Log Button */}
      <div>
        <Button
          onClick={() => setShowLogModal(true)}
          variant="danger"
          size="xl"
          className="w-full flex items-center justify-center gap-2"
        >
          <GlassWater size={24} />
          Log a Bloody
        </Button>
      </div>
      
      {/* Badges Section */}
      <div>
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
      <div>
        <h2 className="text-lg font-bold text-white mb-3">Recent</h2>
        {bloodies.length === 0 ? (
          <div className="text-center py-8 bg-[#1a1a1a] rounded border border-[#333]">
            <GlassWater size={40} className="mx-auto text-[#444] mb-3" />
            <p className="text-[#888] mb-1">No bloodies logged yet</p>
            <p className="text-[#666] text-sm">Tap the button above to log your first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {bloodies.slice(-5).reverse().map(bloody => (
              <div key={bloody.id} className="bg-[#1a1a1a] rounded p-3 border border-[#333]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white font-medium">{bloody.location}</div>
                    <div className="text-gray-500 text-xs">
                      {formatRelativeTime(bloody.timestamp)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {bloody.rating > 0 && (
                      <span className="text-yellow-400 text-sm">{'★'.repeat(bloody.rating)}</span>
                    )}
                    {bloody.spice > 0 && (
                      <span className="flex text-orange-500">
                        {[...Array(bloody.spice)].map((_, i) => <Flame key={i} size={14} fill="currentColor" />)}
                      </span>
                    )}
                  </div>
                </div>
                {bloody.notes && (
                  <div className="text-gray-400 text-sm mt-1 italic">"{bloody.notes}"</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

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

      {/* Badge Unlock Modal */}
      <BadgeUnlockModal
        badges={newBadges}
        onDismiss={() => setNewBadges(prev => prev.slice(1))}
      />
    </div>
  );
}

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
  const [machineViewMode, setMachineViewMode] = useState('cards'); // 'list' or 'cards'
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

  // Debug mode for testing check-in flows (set to null to use real geolocation)
  // Options: 'near-casino' | 'not-near' | 'error' | null
  const [debugGeoMode, setDebugGeoMode] = useState(null);
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [showStrategyValidator, setShowStrategyValidator] = useState(false);
  const [previewBadges, setPreviewBadges] = useState([]);

  // Test badges for previewing effects
  const TEST_BADGES = {
    confetti: { id: 'test-confetti', name: 'First Spot', description: 'Log your first slot spot', icon: 'target', color: 'amber', effect: 'confetti', tier: 'common' },
    fire: { id: 'test-fire', name: 'Centurion', description: 'Log 100 slot spots', icon: 'crown', color: 'red', effect: 'fire', tier: 'legendary' },
    explode: { id: 'test-explode', name: 'Holy Grail', description: 'Find a 100%+ return VP machine', icon: 'trophy', color: 'purple', effect: 'explode', tier: 'epic' },
  };

  const handlePreviewBadge = (effectType) => {
    console.log('Preview badge triggered:', effectType, TEST_BADGES[effectType]);
    setShowDebugMenu(false);
    const badge = TEST_BADGES[effectType];
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
                    ? 'bg-[#d4a855] text-black'
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
                        ? 'bg-[#d4a855] text-black'
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
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all whitespace-nowrap border ${
                    tripSubTab === sub.id
                      ? 'bg-[#d4a855] text-black border-[#d4a855]'
                      : 'bg-[#1a1a1a] text-[#aaa] border-[#333]'
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
                      aria-label="Clear search"
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
        <div className="flex justify-around max-w-md mx-auto">
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
              className={`flex flex-col items-center py-2 px-3 ${
                activeTab === tab.id ? 'text-[#d4a855]' : 'text-[#aaaaaa]'
              }`}
            >
              <tab.icon
                size={22}
                className={animatingTab === tab.id ? 'animate-nav-pop' : ''}
                onAnimationEnd={() => setAnimatingTab(null)}
              />
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
