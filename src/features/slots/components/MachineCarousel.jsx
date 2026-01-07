import React, { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * MachineCarousel - Displays a carousel of slot machines for a specific tier
 *
 * @param {Object[]} machines - Array of all machines
 * @param {Object} tierColors - Color scheme object for each tier
 * @param {Function} onSelect - Callback when a machine is selected
 * @param {number} tier - The tier to filter machines by (1, 2, or 3)
 * @param {Function} getLatestPhoto - Function to get the latest photo for a machine
 * @param {Function} getPhotoUrl - Function to get the URL for a photo
 */
export function MachineCarousel({ machines, tierColors, onSelect, tier, getLatestPhoto, getPhotoUrl }) {
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
          onClick={() => onSelect(machine)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
