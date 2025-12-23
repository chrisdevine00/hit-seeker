import React from 'react';
import { MapPin } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export function TripHeader({ onOpenSettings, onLocationClick, myCheckIn }) {
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
