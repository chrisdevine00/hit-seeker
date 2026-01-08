import React, { useState, useMemo } from 'react';
import { X, Search, MapPin } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { vegasCasinos } from '../../data/casinos';
import { hapticLight } from '../../lib/haptics';

/**
 * CasinoListModal - Full list of casinos for manual check-in
 * Shows when location detection fails or user wants to pick manually
 */
export function CasinoListModal({ onCheckIn }) {
  const { showCasinoList, setShowCasinoList } = useUI();
  const [search, setSearch] = useState('');

  // Filter and group casinos by area
  const groupedCasinos = useMemo(() => {
    const filtered = search
      ? vegasCasinos.filter(c =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.area.toLowerCase().includes(search.toLowerCase())
        )
      : vegasCasinos;

    // Group by area
    const groups = {};
    filtered.forEach(casino => {
      if (!groups[casino.area]) {
        groups[casino.area] = [];
      }
      groups[casino.area].push(casino);
    });

    return groups;
  }, [search]);

  if (!showCasinoList) return null;

  const handleSelect = (casino) => {
    hapticLight();
    onCheckIn(casino);
    setShowCasinoList(false);
    setSearch('');
  };

  const handleClose = () => {
    setShowCasinoList(false);
    setSearch('');
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#333]">
        <h2 className="text-lg font-bold text-white">Choose Casino</h2>
        <button
          onClick={handleClose}
          className="p-2 text-[#888] hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[#333]">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search casinos..."
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#666] focus:outline-none focus:border-[#d4a855]"
            autoFocus
          />
        </div>
      </div>

      {/* Casino List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(groupedCasinos).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#888]">No casinos found</p>
          </div>
        ) : (
          Object.entries(groupedCasinos).map(([area, casinos]) => (
            <div key={area}>
              <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">
                {area}
              </h3>
              <div className="space-y-1">
                {casinos.map(casino => (
                  <button
                    key={casino.id}
                    onClick={() => handleSelect(casino)}
                    className="w-full bg-[#161616] border border-[#333] rounded-lg p-3 text-left hover:border-[#d4a855] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#d4a855]/10 flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-[#d4a855]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{casino.name}</p>
                        <p className="text-[#888] text-sm">{casino.slots} slots</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
