import React from 'react';
import { Search, X, Grid, LayoutList, Info, ChevronRight, Gem } from 'lucide-react';
import { useSlots } from '../../../context/SlotsContext';
import { useUI } from '../../../context/UIContext';
import { usePhotos } from '../../../hooks';
import { machineCategories } from '../../../data/machines';
import { getTierColors } from '../../../constants';

/**
 * HuntTab - Slots machine list/search view
 * Uses SlotsContext for machine state and filtering
 * Uses UIContext for tier help modal
 * Uses usePhotos for machine photos
 */
export function HuntTab() {
  // Slots Context
  const {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    machineViewMode,
    setMachineViewMode,
    selectedCategory,
    setSelectedCategory,
    apOnly,
    setApOnly,
    setReleaseYearFilter,
    filteredMachines,
    apCount,
    totalCount,
    recentMachines,
    selectMachine,
    machines,
  } = useSlots();

  // UI Context
  const { setShowTierHelp } = useUI();

  // Photos
  const { getLatestPhoto, getPhotoUrl } = usePhotos();

  const clearFilters = () => {
    setSearchQuery('');
    setApOnly(false);
    setSelectedCategory('all');
    setReleaseYearFilter('all');
  };

  return (
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
              className={`p-3 transition-colors ${machineViewMode === 'list' ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'text-[#aaaaaa] hover:text-white'}`}
              title="List view"
            >
              <LayoutList size={20} />
            </button>
            <button
              onClick={() => setMachineViewMode('cards')}
              className={`p-3 transition-colors ${machineViewMode === 'cards' ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'text-[#aaaaaa] hover:text-white'}`}
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
                ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
                : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
            }`}
          >
            All ({apOnly ? apCount : totalCount})
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
                      ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
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
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${getTierColors(machine.tier).badgeOutline}`}>
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
              onClick={clearFilters}
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
                    {/* Gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#161616] from-10% via-[#161616]/60 via-40% to-transparent" />
                    {/* Tier Badge */}
                    <span className={`absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${getTierColors(machine.tier).badgeOutline}`}>
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
                      <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${getTierColors(machine.tier).badgeOutline}`}>
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
  );
}
