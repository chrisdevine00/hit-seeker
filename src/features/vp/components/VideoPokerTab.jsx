import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, ChevronDown, ChevronUp, X, Check, Grid, LayoutList, BookOpen } from 'lucide-react';
import { Button, FilledMapPin } from '../../../components/ui';
import { vpCategories, vpGames } from '../../../data/vpGames';
import { getWoOStrategyRecommendation } from '../../../data/vpStrategies';
import { SUITS, evaluateHand } from '../../../utils/vpAnalysis';

// Card picker component - extracted outside VideoPokerTab to avoid re-creation during render
function CardPicker({ onSelect, onClose, excludeCards, selectedGame }) {
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
}

/**
 * VideoPokerTab - Video Poker game and pay table selector with hand checker
 *
 * @param {Function} onSpot - Callback when spotting a pay table (receives game, payTable)
 */
export function VideoPokerTab({ onSpot }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedPayTable, setSelectedPayTable] = useState(null);
  const [selectedHand, setSelectedHand] = useState([null, null, null, null, null]);
  const [showCardPicker, setShowCardPicker] = useState(null);
  const [gameSearch, setGameSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectorExpanded, setSelectorExpanded] = useState(true);
  const [vpViewMode, setVpViewMode] = useState('list'); // 'list' or 'cards'
  const [recentVPGames, setRecentVPGames] = useState([]); // Track recently viewed VP games

  // Track recently viewed VP games
  const selectVPGame = (gameId) => {
    setSelectedGame(gameId);
    setSelectedPayTable(null);
    setSelectedHand([null, null, null, null, null]);
    if (gameId) {
      const gameData = vpGames[gameId];
      if (gameData) {
        setRecentVPGames(prev => {
          const filtered = prev.filter(g => g.id !== gameId);
          return [gameData, ...filtered].slice(0, 5); // Keep last 5
        });
      }
    }
  };

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

  // Get all valid VP games as array
  const vpGamesList = useMemo(() => {
    return Object.values(vpGames).filter(g => g.category);
  }, []);

  // Create Fuse instance for fuzzy game search
  const vpFuse = useMemo(() => {
    return new Fuse(vpGamesList, {
      keys: ['name', 'shortName'],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }, [vpGamesList]);

  // Filter games by search and category (using Fuse.js for fuzzy search)
  const filteredGames = useMemo(() => {
    // Start with all valid games
    let filtered = vpGamesList;

    // Apply fuzzy search if query exists
    // When searching, ignore category filter to show all matching results
    if (gameSearch && gameSearch.trim().length > 0) {
      const searchResults = vpFuse.search(gameSearch.trim());
      filtered = searchResults.map(r => r.item);
    } else {
      // Only apply category filter when NOT searching
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(g => g.category === selectedCategory);
      }
    }

    return [...filtered]; // Return a new array to prevent mutation issues
  }, [vpGamesList, gameSearch, selectedCategory, vpFuse]).sort((a, b) => {
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

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#333] -mx-4 mb-4">
        <h1 className="text-2xl font-bold text-white">Video Poker</h1>
        <p className="text-gray-500 text-sm">Find the best pay tables</p>
      </div>

      <div className="space-y-4">
      {/* Results Count & View Toggle - Always visible */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#aaa]">
          {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
        </p>
        <div className="flex bg-[#161616] border border-[#333] rounded overflow-hidden">
          <button
            onClick={() => setVpViewMode('list')}
            className={`p-2 transition-colors ${vpViewMode === 'list' ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'text-[#aaaaaa] hover:text-white'}`}
            title="List view"
          >
            <LayoutList size={18} />
          </button>
          <button
            onClick={() => setVpViewMode('cards')}
            className={`p-2 transition-colors ${vpViewMode === 'cards' ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'text-[#aaaaaa] hover:text-white'}`}
            title="Card view"
          >
            <Grid size={18} />
          </button>
        </div>
      </div>

      {/* Recently Viewed (if any) */}
      {recentVPGames.length > 0 && (
        <div>
          <p className="text-[#aaa] text-xs uppercase tracking-wider mb-2">Recently Viewed</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recentVPGames.map(g => {
              const bestPayTable = g.payTables?.find(pt => pt.rating === 'HUNT') || g.payTables?.[0];
              return (
                <button
                  key={g.id}
                  onClick={() => selectVPGame(g.id)}
                  className="shrink-0 card-3d px-3 py-2 flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {bestPayTable && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${
                      bestPayTable.rating === 'HUNT' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' :
                      bestPayTable.rating === 'OK' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' :
                      'border-red-500/50 text-red-400 bg-red-500/10'
                    }`}>
                      {bestPayTable.rating}
                    </span>
                  )}
                  <span className="text-white text-sm whitespace-nowrap">{g.shortName || g.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      {/* Game & Pay Table Selector - Collapsible */}
      {selectedPayTable && !selectorExpanded ? (
        /* Collapsed Summary Bar - resembles slot machine list item */
        <button
          onClick={() => setSelectorExpanded(true)}
          className={`w-full p-3 text-left transition-colors ${
            selectedPayTable.rating === 'HUNT' ? 'card-3d-tier1' :
            selectedPayTable.rating === 'OK' ? 'card-3d-tier2' :
            'card-3d-tier3'
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
        <div className="card-3d p-4 space-y-4">
          {/* Header with collapse button */}
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold">
              {selectedGame ? 'Select Pay Table' : 'Select Game & Pay Table'}
            </p>
            {selectedPayTable && (
              <button
                onClick={() => setSelectorExpanded(false)}
                className="text-[#aaa] hover:text-white p-1"
              >
                <ChevronUp size={18} />
              </button>
            )}
          </div>

          {/* Selected Game Indicator - show when game selected */}
          {selectedGame && (
            <div className="flex items-center justify-between bg-gradient-to-r from-[#d4a855] to-amber-600 rounded px-3 py-2">
              <span className="text-black text-sm font-semibold truncate">{game?.name}</span>
              <button
                onClick={() => {
                  setSelectedGame(null);
                  setSelectedPayTable(null);
                  setSelectedHand([null, null, null, null, null]);
                }}
                className="text-black/60 hover:text-black ml-2"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Game Selection UI - only show when no game selected */}
          {!selectedGame && (
            <>
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
                selectedCategory === 'all' ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
              }`}
            >
              All ({Object.values(vpGames).filter(g => g.category).length})
            </button>
            {Object.entries(vpCategories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedCategory === key ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black' : 'bg-[#0d0d0d] text-[#aaa] hover:text-white'
                }`}
              >
                {cat.name.replace(' Games', '').replace(' Family', '').replace(' Bonus', '')} ({categoryCounts[key] || 0})
              </button>
            ))}
          </div>

          {/* Game List View */}
          {vpViewMode === 'list' && filteredGames.length > 0 && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredGames.map(g => {
                const bestPayTable = g.payTables?.find(pt => pt.rating === 'HUNT') || g.payTables?.[0];
                const isSelected = selectedGame === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => selectVPGame(g.id)}
                    className={`w-full p-3 text-left transition-colors ${
                      isSelected
                        ? 'card-3d-slot'
                        : bestPayTable?.rating === 'HUNT' ? 'card-3d-tier1' :
                          bestPayTable?.rating === 'OK' ? 'card-3d-tier2' :
                          'card-3d-tier3'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold truncate ${isSelected ? 'text-[#d4a855]' : 'text-white'}`}>
                            {g.name}
                          </h3>
                          {bestPayTable && (
                            <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${
                              bestPayTable.rating === 'HUNT' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' :
                              bestPayTable.rating === 'OK' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' :
                              'border-red-500/50 text-red-400 bg-red-500/10'
                            }`}>
                              {bestPayTable.rating}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#888] mb-1">
                          {vpCategories[g.category]?.name?.replace(' Games', '').replace(' Family', '')}
                          {g.shortName && ` • ${g.shortName}`}
                        </p>
                        {g.description && <p className="text-xs text-[#666] line-clamp-1">{g.description}</p>}
                      </div>
                      {bestPayTable && (
                        <div className="text-right shrink-0">
                          <span className={`text-sm font-medium ${
                            bestPayTable.rating === 'HUNT' ? 'text-emerald-400' :
                            bestPayTable.rating === 'OK' ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {bestPayTable.return}%
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Game Card View */}
          {vpViewMode === 'cards' && filteredGames.length > 0 && (
            <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto">
              {filteredGames.map(g => {
                const bestPayTable = g.payTables?.find(pt => pt.rating === 'HUNT') || g.payTables?.[0];
                const isSelected = selectedGame === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => selectVPGame(g.id)}
                    className={`overflow-hidden text-left transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'card-3d-slot ring-1 ring-[#d4a855]'
                        : bestPayTable?.rating === 'HUNT' ? 'card-3d-tier1' :
                          bestPayTable?.rating === 'OK' ? 'card-3d-tier2' :
                          'card-3d-tier3'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="aspect-[3/2] relative flex flex-col items-center justify-center p-3">
                      <span className="text-2xl font-bold text-[#555] mb-1">{g.shortName || g.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-[#444] uppercase tracking-wider">
                        {vpCategories[g.category]?.name?.split(' ')[0]}
                      </span>
                      {/* Rating Badge - bottom left */}
                      {bestPayTable && (
                        <span className={`absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${
                          bestPayTable.rating === 'HUNT' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' :
                          bestPayTable.rating === 'OK' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' :
                          'border-red-500/50 text-red-400 bg-red-500/10'
                        }`}>
                          {bestPayTable.rating}
                        </span>
                      )}
                      {/* Return % - bottom right */}
                      {bestPayTable && (
                        <span className={`absolute bottom-2 right-2 text-xs font-medium ${
                          bestPayTable.rating === 'HUNT' ? 'text-emerald-400' :
                          bestPayTable.rating === 'OK' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {bestPayTable.return}%
                        </span>
                      )}
                    </div>
                    {/* Card Content */}
                    <div className="px-3 pb-3 pt-2">
                      <h3 className={`font-semibold text-sm mb-1 line-clamp-1 ${isSelected ? 'text-[#d4a855]' : 'text-white'}`}>
                        {g.name}
                      </h3>
                      {g.description && <p className="text-[11px] text-[#666] line-clamp-2">{g.description}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* No Results State */}
          {filteredGames.length === 0 && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3">
                <Search size={24} className="text-[#444]" />
              </div>
              <p className="text-white font-medium mb-1">No games found</p>
              <p className="text-[#aaa] text-sm mb-3">
                {gameSearch
                  ? `No results for "${gameSearch}"`
                  : 'Try adjusting your filters'}
              </p>
              <button
                onClick={() => { setGameSearch(''); setSelectedCategory('all'); }}
                className="text-[#d4a855] text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
          </>
          )}

          {/* Pay Table Selection */}
          {game && (
            <div className="pt-2 border-t border-[#333]">
              <p className="text-[#aaa] text-xs mb-2">{game.keyLookup || 'Select pay table'}</p>
              <div className="flex flex-wrap gap-2">
                {game.payTables?.map(pt => (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedPayTable(pt)}
                    className={`px-4 py-2.5 rounded text-sm font-medium transition-colors flex flex-col items-center min-w-[70px] ${
                      selectedPayTable?.id === pt.id
                        ? 'bg-gradient-to-r from-[#d4a855] to-amber-600 text-black'
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
          <div className="card-3d-vp p-4">
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
        <details className="card-3d overflow-hidden group">
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
          selectedGame={selectedGame}
        />
      )}
    </div>
  );
}
