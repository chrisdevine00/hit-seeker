import React from 'react';
import { useTrip } from '../../context/TripContext';
import { FilledMapPin } from '../ui';

export function TripHeader({ onOpenSettings, onLocationClick, myCheckIn }) {
  const { currentTrip } = useTrip();

  return (
    <div
      className="sticky top-0 z-30 bg-[#161616] border-b border-[#333] px-4 pb-3"
      style={{ paddingTop: 'calc(var(--sat, 0px) + 12px)' }}
    >
      <div className="flex items-center justify-between">
        <button onClick={onOpenSettings} className="flex items-center gap-3">
          <span className="font-bold text-4xl leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span className="text-white">H</span>
            <span style={{ color: '#d4a855' }}>S</span>
          </span>
          <h1 className="font-medium text-white text-sm">{currentTrip.name}</h1>
        </button>

        <button
          onClick={onLocationClick}
          className={`p-1.5 rounded-full border-2 transition-colors ${
            myCheckIn
              ? 'border-emerald-500 hover:bg-emerald-500/10 animate-glow-green'
              : 'border-[#888] hover:bg-[#888]/10 animate-pulse-ring'
          }`}
        >
          <FilledMapPin size={16} className={myCheckIn ? 'text-emerald-500' : 'text-[#888]'} holeColor="#161616" />
        </button>
      </div>
    </div>
  );
}
