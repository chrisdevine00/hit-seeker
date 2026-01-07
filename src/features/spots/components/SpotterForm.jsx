import React, { useState } from 'react';
import { X, Gem, Spade, GlassWater, Flame, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui';
import { vpGames } from '../../../data/vpGames';
import { machines } from '../../../data/machines';
import { vegasCasinos } from '../../../data/casinos';
import { hapticLight } from '../../../lib/haptics';

/**
 * SpotterForm - Unified form for logging Slots, VP, and Bloody Mary finds
 *
 * @param {Function} onSubmit - Callback when form is submitted (receives note data)
 * @param {Function} onCancel - Callback to cancel/close the form
 * @param {string} spotType - Initial spot type: 'slot', 'vp', or 'bloody'
 * @param {Object} prefillData - Pre-filled data: { machine } for slots, { game, payTable, return, gameName } for VP
 * @param {string} currentCasino - Current casino name to pre-fill
 */
export function SpotterForm({ onSubmit, onCancel, spotType: initialSpotType, prefillData, currentCasino }) {
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
                ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            Slot
          </button>
          <button
            onClick={() => setActiveType('vp')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeType === 'vp'
                ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
                : 'text-[#aaa] hover:text-white'
            }`}
          >
            Video Poker
          </button>
          <button
            onClick={() => setActiveType('bloody')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeType === 'bloody'
                ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
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
                    className="w-full bg-gradient-to-r from-[#d4a855] to-amber-600 border border-[#d4a855] rounded px-4 py-3 text-black font-medium text-left flex items-center justify-between"
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
                            ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
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
            <div className="w-full bg-gradient-to-r from-[#d4a855] to-amber-600 border border-[#d4a855] rounded px-4 py-3 text-black font-medium">
              {prefillData.machine}
            </div>
          ) : machine ? (
            <button
              onClick={() => setMachine('')}
              className="w-full bg-gradient-to-r from-[#d4a855] to-amber-600 border border-[#d4a855] rounded px-4 py-3 text-black font-medium text-left flex items-center justify-between"
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
            className="w-full bg-gradient-to-r from-[#d4a855] to-amber-600 border border-[#d4a855] rounded px-4 py-3 text-black font-medium text-left flex items-center justify-between"
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
                    ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
                    : 'bg-[#0d0d0d] text-[#aaa] hover:text-white border border-[#333]'
                }`}
              >
                {denom}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="text-[#888] text-xs uppercase tracking-wider mb-1 block">
          Notes
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
          disabled={isBloody ? !casino : isVP ? !(casino && selectedVPGame && (selectedVPPayTable || prefillData?.payTable)) : !(casino && machine)}
          variant="primary"
          className="w-full disabled:from-[#333] disabled:to-[#222] disabled:text-[#666] disabled:shadow-none disabled:cursor-not-allowed"
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

/**
 * NoteForm - Legacy wrapper for backwards compatibility
 * Wraps SpotterForm with slot-specific behavior
 */
export function NoteForm({ onSubmit, onCancel, prefillMachine, currentCasino }) {
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
