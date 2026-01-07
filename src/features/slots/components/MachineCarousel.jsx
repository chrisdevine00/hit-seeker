import React, { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSlots } from '../../../context/SlotsContext';
import { usePhotos } from '../../../hooks';

// Tier color schemes
const TIER_COLORS = {
  1: {
    bg: 'bg-emerald-900/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
  },
  2: {
    bg: 'bg-amber-900/20',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
  },
  3: {
    bg: 'bg-red-900/20',
    border: 'border-red-500/30',
    text: 'text-red-400',
  },
};

/**
 * MachineCarousel - Displays a carousel of slot machines for a specific tier
 * Uses SlotsContext for machine data and selection
 * Uses usePhotos for photo display
 *
 * @param {number} tier - The tier to filter machines by (1, 2, or 3)
 */
export function MachineCarousel({ tier = 1 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slots Context
  const { machines, selectMachine } = useSlots();

  // Photos
  const { getLatestPhoto, getPhotoUrl } = usePhotos();

  const tierMachines = machines.filter(m => m.tier === tier);
  const colors = TIER_COLORS[tier] || TIER_COLORS[1];

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
            <button
              onClick={() => goTo(currentIndex - 1)}
              className="no-animate p-1 text-[#bbbbbb] hover:text-white"
              aria-label="Previous machine"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-xs text-[#aaaaaa]">{currentIndex + 1}/{tierMachines.length}</span>
            <button
              onClick={() => goTo(currentIndex + 1)}
              className="no-animate p-1 text-[#bbbbbb] hover:text-white"
              aria-label="Next machine"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-3">{machine.quickId}</p>

        <div className={`${colors.bg} rounded p-3 mb-3`}>
          <p className="text-xs text-[#bbbbbb] mb-1">Play When:</p>
          <p className={`text-sm font-semibold ${colors.text}`}>{machine.thresholdSummary}</p>
        </div>

        <button
          onClick={() => selectMachine(machine)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
