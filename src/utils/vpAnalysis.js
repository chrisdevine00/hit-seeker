// Video Poker Analysis Utilities
// Card evaluation and hand analysis functions

// Card deck for hand analyzer
const SUITS = [
  { symbol: '♠', name: 'spades', color: 'text-black', pickerColor: 'text-white' },
  { symbol: '♥', name: 'hearts', color: 'text-red-500', pickerColor: 'text-red-400' },
  { symbol: '♣', name: 'clubs', color: 'text-black', pickerColor: 'text-white' },
  { symbol: '♦', name: 'diamonds', color: 'text-red-500', pickerColor: 'text-red-400' }
];
const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const RANK_VALUES = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
const HIGH_CARDS = ['A', 'K', 'Q', 'J'];

// Hand evaluation functions
const evaluateHand = (cards, gameType = 'jacks-or-better') => {
  if (!cards || cards.length !== 5 || cards.some(c => !c)) return null;
  
  // Check if this is a deuces wild variant
  const deucesWildGames = ['deuces-wild', 'bonus-deuces-wild', 'double-bonus-deuces-wild', 'super-bonus-deuces-wild', 'loose-deuces', 'double-deuces', 'deuces-and-joker', 'faces-n-deuces', 'acey-deucey'];
  const isDeucesWild = deucesWildGames.includes(gameType);
  
  const ranks = cards.map(c => c.rank);
  const suits = cards.map(c => c.suit);
  const values = cards.map(c => RANK_VALUES[c.rank]).sort((a, b) => a - b);
  
  // Count suits and ranks
  const suitCounts = {};
  const rankCounts = {};
  suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
  ranks.forEach(r => rankCounts[r] = (rankCounts[r] || 0) + 1);
  
  // For deuces wild, count wilds and adjust
  const deuceCount = isDeucesWild ? (rankCounts['2'] || 0) : 0;
  
  // For deuces wild evaluation
  if (isDeucesWild && deuceCount > 0) {
    // Get non-deuce cards
    const nonDeuceRanks = ranks.filter(r => r !== '2');
    const nonDeuceSuits = cards.filter(c => c.rank !== '2').map(c => c.suit);
    
    const ndRankCounts = {};
    nonDeuceRanks.forEach(r => ndRankCounts[r] = (ndRankCounts[r] || 0) + 1);
    const ndSortedCounts = Object.values(ndRankCounts).sort((a, b) => b - a);
    const maxOfKind = (ndSortedCounts[0] || 0) + deuceCount;
    
    // Check for 5 of a kind
    if (maxOfKind >= 5) return { name: 'Five of a Kind', rank: 2, payout: 15 };
    
    // Check for wild royal / straight flush / flush / straight
    const ndSuitCounts = {};
    nonDeuceSuits.forEach(s => ndSuitCounts[s] = (ndSuitCounts[s] || 0) + 1);
    const maxSameSuit = Math.max(...Object.values(ndSuitCounts), 0);
    const isFlushPossible = maxSameSuit + deuceCount >= 5;
    
    // Check for royal flush with wilds
    if (isFlushPossible) {
      const flushSuit = Object.keys(ndSuitCounts).find(s => ndSuitCounts[s] === maxSameSuit);
      const flushCards = cards.filter(c => c.suit === flushSuit && c.rank !== '2');
      const royalRanks = ['A', 'K', 'Q', 'J', '10'];
      const royalCount = flushCards.filter(c => royalRanks.includes(c.rank)).length;
      if (royalCount + deuceCount >= 5 && flushCards.every(c => royalRanks.includes(c.rank))) {
        return { name: deuceCount > 0 ? 'Wild Royal Flush' : 'Natural Royal Flush', rank: 1, payout: deuceCount > 0 ? 25 : 800 };
      }
    }
    
    // 4 of a kind
    if (maxOfKind >= 4) return { name: 'Four of a Kind', rank: 3, payout: 5 };
    
    // Full house (trips + pair with wilds)
    const secondHighest = ndSortedCounts[1] || 0;
    if (ndSortedCounts[0] + deuceCount >= 3 && secondHighest >= 2) {
      return { name: 'Full House', rank: 4, payout: 3 };
    }
    
    // Flush
    if (isFlushPossible) return { name: 'Flush', rank: 5, payout: 2 };
    
    // Straight check with wilds
    const ndValues = cards.filter(c => c.rank !== '2').map(c => RANK_VALUES[c.rank]);
    const uniqueNdValues = [...new Set(ndValues)].sort((a, b) => a - b);
    // Check if we can make a straight with deuces filling gaps
    let canMakeStraight = false;
    for (let start = 1; start <= 10; start++) {
      const target = [start, start+1, start+2, start+3, start+4].map(v => v > 13 ? v - 13 + 1 : v);
      // Handle ace-high (10-J-Q-K-A)
      if (start === 10) {
        const aceHighTarget = [10, 11, 12, 13, 14];
        const missing = aceHighTarget.filter(v => !uniqueNdValues.includes(v)).length;
        if (missing <= deuceCount) canMakeStraight = true;
      } else {
        const missing = target.filter(v => !uniqueNdValues.includes(v)).length;
        if (missing <= deuceCount && uniqueNdValues.every(v => target.includes(v) || v === 14)) canMakeStraight = true;
      }
    }
    // Check wheel (A-2-3-4-5) - but 2s are wild so it's A-3-4-5 + wilds
    const wheelTarget = [14, 3, 4, 5]; // A, 3, 4, 5 (2 is wild)
    const wheelMissing = wheelTarget.filter(v => !uniqueNdValues.includes(v)).length;
    if (wheelMissing <= deuceCount && uniqueNdValues.every(v => wheelTarget.includes(v))) canMakeStraight = true;
    
    if (canMakeStraight) return { name: 'Straight', rank: 6, payout: 2 };
    
    // Three of a kind
    if (maxOfKind >= 3) return { name: 'Three of a Kind', rank: 7, payout: 1 };
    
    // In deuces wild, pairs don't pay - minimum is 3 of a kind
    return { name: 'No Win', rank: 11, payout: 0 };
  }
  
  // Standard (non-wild) evaluation
  const isFlush = Object.values(suitCounts).some(c => c === 5);
  const sortedCounts = Object.values(rankCounts).sort((a, b) => b - a);
  
  // Check for straight (including wheel: A-2-3-4-5)
  const uniqueValues = [...new Set(values)];
  const isWheel = uniqueValues.length === 5 && 
    uniqueValues.includes(14) && uniqueValues.includes(2) && 
    uniqueValues.includes(3) && uniqueValues.includes(4) && uniqueValues.includes(5);
  const isRegularStraight = uniqueValues.length === 5 && (values[4] - values[0] === 4);
  const isStraight = isWheel || isRegularStraight;
  
  // Check for royal (10-J-Q-K-A)
  const isRoyal = uniqueValues.length === 5 && 
    [10, 11, 12, 13, 14].every(v => uniqueValues.includes(v));
  
  // Determine hand
  if (isRoyal && isFlush) return { name: 'Royal Flush', rank: 1, payout: 800 };
  if (isStraight && isFlush) return { name: 'Straight Flush', rank: 2, payout: 50 };
  if (sortedCounts[0] === 4) {
    const quadRank = Object.keys(rankCounts).find(r => rankCounts[r] === 4);
    if (gameType === 'double-double-bonus') {
      const kicker = Object.keys(rankCounts).find(r => rankCounts[r] === 1);
      if (quadRank === 'A' && ['2', '3', '4'].includes(kicker)) return { name: 'Four Aces + 2-4', rank: 3, payout: 400 };
      if (['2', '3', '4'].includes(quadRank) && ['A', '2', '3', '4'].includes(kicker)) return { name: 'Four 2-4 + A-4', rank: 3, payout: 160 };
    }
    if (gameType === 'double-bonus' || gameType === 'double-double-bonus') {
      if (quadRank === 'A') return { name: 'Four Aces', rank: 3, payout: 160 };
      if (['2', '3', '4'].includes(quadRank)) return { name: 'Four 2-4', rank: 3, payout: 80 };
      return { name: 'Four 5-K', rank: 3, payout: 50 };
    }
    if (gameType === 'bonus-poker') {
      if (quadRank === 'A') return { name: 'Four Aces', rank: 3, payout: 80 };
      if (['2', '3', '4'].includes(quadRank)) return { name: 'Four 2-4', rank: 3, payout: 40 };
      return { name: 'Four 5-K', rank: 3, payout: 25 };
    }
    return { name: 'Four of a Kind', rank: 3, payout: 25 };
  }
  if (sortedCounts[0] === 3 && sortedCounts[1] === 2) return { name: 'Full House', rank: 4, payout: 9 };
  if (isFlush) return { name: 'Flush', rank: 5, payout: 6 };
  if (isStraight) return { name: 'Straight', rank: 6, payout: 4 };
  if (sortedCounts[0] === 3) return { name: 'Three of a Kind', rank: 7, payout: 3 };
  if (sortedCounts[0] === 2 && sortedCounts[1] === 2) return { name: 'Two Pair', rank: 8, payout: 2 };
  if (sortedCounts[0] === 2) {
    const pairRank = Object.keys(rankCounts).find(r => rankCounts[r] === 2);
    if (HIGH_CARDS.includes(pairRank)) return { name: 'Jacks or Better', rank: 9, payout: 1 };
    return { name: 'Low Pair', rank: 10, payout: 0 };
  }
  return { name: 'High Card', rank: 11, payout: 0 };
};

// Analyze draws and potential
const analyzeDraws = (cards) => {
  if (!cards || cards.length !== 5) return {};
  
  const ranks = cards.map(c => c.rank);
  const suits = cards.map(c => c.suit);
  const values = cards.map(c => RANK_VALUES[c.rank]);
  
  const suitCounts = {};
  const rankCounts = {};
  suits.forEach((s, i) => {
    if (!suitCounts[s]) suitCounts[s] = [];
    suitCounts[s].push(i);
  });
  ranks.forEach((r, i) => {
    if (!rankCounts[r]) rankCounts[r] = [];
    rankCounts[r].push(i);
  });
  
  const draws = {};
  
  // Check for flush draws
  Object.entries(suitCounts).forEach(([suit, indices]) => {
    if (indices.length === 4) {
      draws.fourToFlush = { indices, suit };
    }
    if (indices.length >= 3) {
      // Check for royal draw
      const flushCards = indices.map(i => cards[i]);
      const royalRanks = ['A', 'K', 'Q', 'J', '10'];
      const royalIndices = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalIndices.length === 4) {
        draws.fourToRoyal = { indices: royalIndices };
      } else if (royalIndices.length === 3) {
        draws.threeToRoyal = { indices: royalIndices };
      }
    }
  });
  
  // Check for straight draws
  const sortedValues = [...new Set(values)].sort((a, b) => a - b);
  // 4 to a straight (open-ended or inside)
  for (let i = 1; i <= 10; i++) {
    const straightValues = [i, i+1, i+2, i+3, i+4];
    if (i === 10) straightValues[4] = 14; // 10-J-Q-K-A
    const matchingIndices = [];
    straightValues.forEach(v => {
      const idx = values.indexOf(v === 14 && !values.includes(14) ? 1 : v);
      if (values.includes(v)) {
        matchingIndices.push(values.indexOf(v));
      }
    });
    // Also check for wheel (A-2-3-4-5)
  }
  
  // Check for pairs/trips
  Object.entries(rankCounts).forEach(([rank, indices]) => {
    if (indices.length === 3) draws.threeOfKind = { indices, rank };
    if (indices.length === 2) {
      if (HIGH_CARDS.includes(rank)) {
        draws.highPair = { indices, rank };
      } else {
        draws.lowPair = { indices, rank };
      }
    }
  });
  
  // High cards
  const highCardIndices = cards.map((c, i) => HIGH_CARDS.includes(c.rank) ? i : -1).filter(i => i >= 0);
  if (highCardIndices.length > 0) draws.highCards = { indices: highCardIndices };
  
  return draws;
};

export { SUITS, RANKS, RANK_VALUES, HIGH_CARDS, evaluateHand, analyzeDraws };
