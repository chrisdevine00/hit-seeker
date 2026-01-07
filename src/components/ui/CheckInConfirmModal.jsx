import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCheckIns } from '../../hooks';
import { Button } from './Button';
import { FilledMapPin } from './FilledMapPin';
import { hapticSuccess } from '../../lib/haptics';
import { TAB_IDS } from '../../constants';

/**
 * CheckInConfirmModal - Confirms check-in to a detected casino
 * Shows when geolocation detects user near a casino
 */
export function CheckInConfirmModal({ onCheckIn }) {
  const {
    pendingCheckIn,
    setPendingCheckIn,
    setActiveTab,
    setTripSubTab,
  } = useUI();
  const { myCheckIn } = useCheckIns();

  if (!pendingCheckIn) return null;

  const confirmCheckIn = () => {
    hapticSuccess();
    onCheckIn(pendingCheckIn);
    setPendingCheckIn(null);
  };

  const cancelCheckIn = () => {
    setPendingCheckIn(null);
    setActiveTab(TAB_IDS.TRIP);
    setTripSubTab('casinos');
  };

  return (
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
  );
}
