// WoO-Verified Video Poker Strategy Engine
// Source: wizardofodds.com

// Pay table ID mapping from game/FH/FL to strategy key
const PAY_TABLE_STRATEGIES = {
  // JACKS OR BETTER - FH/FL combinations
  'jacks-or-better': {
    '9/6': 'JOB_9_6', '8/6': 'JOB_8_6', '8/5': 'JOB_9_6', // 8/5 uses 9/6 per WoO (0.01% penalty)
    '9/5': 'JOB_9_6', '7/5': 'JOB_9_6', '6/5': 'JOB_9_6'
  },
  'tens-or-better': { '6/5': 'JOB_9_6', '5/5': 'JOB_9_6' },
  
  // BONUS POKER FAMILY
  'bonus-poker': { '8/5': 'BP_8_5', '7/5': 'BP_8_5', '6/5': 'BP_8_5' },
  'bonus-poker-deluxe': { '9/6': 'BP_8_5', '9/5': 'BP_8_5', '8/6': 'BP_8_5', '8/5': 'BP_8_5' },
  'double-bonus': { '10/7': 'DB_10_7', '9/7': 'DB_10_7', '9/6': 'DB_10_7', '9/5': 'DB_10_7' },
  'double-double-bonus': { '10/6': 'DDB_9_6', '9/6': 'DDB_9_6', '9/5': 'DDB_9_6', '8/5': 'DDB_9_6' },
  'triple-double-bonus': { '9/7': 'TDB_9_7', '9/6': 'TDB_9_7', '9/5': 'TDB_9_7', '8/5': 'TDB_9_7' },
  'super-double-bonus': { '9/6': 'DB_10_7', '8/5': 'DB_10_7' },
  
  // DEUCES WILD FAMILY
  'deuces-wild': { 'NSUD': 'DW_NSUD', 'Illinois': 'DW_NSUD', 'Colorado': 'DW_NSUD', '16/10': 'DW_NSUD', '15/9': 'DW_NSUD', '13/8': 'DW_NSUD' },
  'bonus-deuces-wild': { '13/4': 'BDW_13_4', '9/4': 'BDW_13_4', '9/4/4': 'BDW_13_4' },
  'loose-deuces': { '17/10': 'LD_FULL', '15/8': 'LD_FULL', '12/11': 'LD_FULL' },
  
  // JOKER POKER (53-card deck)
  'joker-poker-kings': { '20/7': 'JPK_FULL', '17/7': 'JPK_FULL', '15/7': 'JPK_FULL' },
  'joker-poker-twopair': { '20/8': 'JP2_FULL', '17/7': 'JP2_FULL', '20/10': 'JP2_FULL' },
  
  // ULTIMATE X VARIANTS (use base game strategies - multipliers add ~0.2% but don't change optimal play)
  // Per WoO: "The basic strategy for Ultimate X is identical to the base game"
  'ultimate-x-jacks': { '9/6': 'JOB_9_6', '8/5': 'JOB_9_6' },
  'ultimate-x-bonus': { '8/5': 'BP_8_5', '7/5': 'BP_8_5' },
  'ultimate-x-ddb': { '9/6': 'DDB_9_6', '9/5': 'DDB_9_6' },
  'ultimate-x-double-bonus': { '9/7': 'DB_10_7', '9/6': 'DB_10_7' },
  'ultimate-x-bpd': { '9/6': 'BP_8_5', '8/5': 'BP_8_5' }, // Bonus Poker Deluxe uses BP strategy
  'ultimate-x-joker': { '20/7': 'JPK_FULL', '17/7': 'JPK_FULL' },
};

// WoO Optimal Strategy Hierarchies
// Each entry: { rank, name, ev, check: function(cards, analysis) => { indices } or null }

const STRATEGY_HIERARCHIES = {
  // ============================================
  // JACKS OR BETTER 9/6 (36 lines) - WoO Optimal
  // Return: 99.54%
  // ============================================
  'JOB_9_6': [
    { rank: 1, name: "Royal Flush", ev: 800.0000, check: (c, h) => h.isRoyalFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 2, name: "Straight Flush", ev: 50.0000, check: (c, h) => h.isStraightFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 3, name: "Four of a Kind", ev: 25.0000, check: (c, h) => h.is4K ? { indices: [0,1,2,3,4] } : null },
    { rank: 4, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    { rank: 5, name: "Full House", ev: 9.0000, check: (c, h) => h.isFullHouse ? { indices: [0,1,2,3,4] } : null },
    { rank: 6, name: "Flush", ev: 6.0000, check: (c, h) => h.isFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 7, name: "Three of a Kind", ev: 4.3025, check: (c, h) => h.trips },
    { rank: 8, name: "Straight", ev: 4.0000, check: (c, h) => h.isStraight ? { indices: [0,1,2,3,4] } : null },
    { rank: 9, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 10, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 11, name: "High Pair (J+)", ev: 1.5365, check: (c, h) => h.highPair },
    { rank: 12, name: "3 to Royal Flush", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 13, name: "4 to Flush", ev: 1.2766, check: (c, h) => h.fourToFlush },
    { rank: 14, name: "TJQK Unsuited", ev: 0.8723, check: (c, h) => h.unsuitedTJQK },
    { rank: 15, name: "Low Pair", ev: 0.8237, check: (c, h) => h.lowPair },
    { rank: 16, name: "4 to Outside Straight", ev: 0.6809, check: (c, h) => h.fourToOutside },
    { rank: 17, name: "3 to SF (Type 1)", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 18, name: "Suited QJ", ev: 0.6004, check: (c, h) => h.suitedQJ },
    { rank: 19, name: "JQKA Unsuited", ev: 0.5957, check: (c, h) => h.unsuitedJQKA },
    { rank: 20, name: "Suited KQ/KJ", ev: 0.5821, check: (c, h) => h.suitedKQKJ },
    { rank: 21, name: "Suited AK/AQ/AJ", ev: 0.5678, check: (c, h) => h.suitedAHigh },
    { rank: 22, name: "4 to Inside Straight (3 HC)", ev: 0.5319, check: (c, h) => h.fourToInside3HC },
    { rank: 23, name: "3 to SF (Type 2)", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 24, name: "JQK Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedJQK },
    { rank: 25, name: "JQ Unsuited", ev: 0.4980, check: (c, h) => h.unsuitedJQ },
    { rank: 26, name: "Suited TJ", ev: 0.4968, check: (c, h) => h.suitedTJ },
    { rank: 27, name: "KQ/KJ Unsuited", ev: 0.4862, check: (c, h) => h.unsuitedKQKJ },
    { rank: 28, name: "Suited TQ", ev: 0.4825, check: (c, h) => h.suitedTQ },
    { rank: 29, name: "AK/AQ/AJ Unsuited", ev: 0.4743, check: (c, h) => h.unsuitedAHigh },
    { rank: 30, name: "J Only", ev: 0.4713, check: (c, h) => h.singleJ },
    { rank: 31, name: "Suited TK", ev: 0.4682, check: (c, h) => h.suitedTK },
    { rank: 32, name: "Q Only", ev: 0.4681, check: (c, h) => h.singleQ },
    { rank: 33, name: "K Only", ev: 0.4649, check: (c, h) => h.singleK },
    { rank: 34, name: "A Only", ev: 0.4640, check: (c, h) => h.singleA },
    { rank: 35, name: "3 to SF (Type 3)", ev: 0.4431, check: (c, h) => h.threeToSF3 },
    { rank: 36, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
  
  // ============================================
  // JACKS OR BETTER 8/6 (27 lines) - WoO
  // Return: 98.39%
  // Key difference: Flush/Straight moved up relative to Two Pair
  // ============================================
  'JOB_8_6': [
    { rank: 1, name: "Full House or better", ev: 8.0000, check: (c, h) => (h.isRoyalFlush || h.isStraightFlush || h.is4K || h.isFullHouse) ? { indices: [0,1,2,3,4] } : null },
    { rank: 2, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    { rank: 3, name: "Three of a Kind", ev: 4.3025, check: (c, h) => h.trips },
    { rank: 4, name: "Flush", ev: 6.0000, check: (c, h) => h.isFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 5, name: "Straight", ev: 4.0000, check: (c, h) => h.isStraight ? { indices: [0,1,2,3,4] } : null },
    { rank: 6, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 7, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 8, name: "High Pair", ev: 1.5365, check: (c, h) => h.highPair },
    { rank: 9, name: "3 to Royal Flush", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 10, name: "4 to Flush", ev: 1.2766, check: (c, h) => h.fourToFlush },
    { rank: 11, name: "TJQK Unsuited", ev: 0.8723, check: (c, h) => h.unsuitedTJQK },
    { rank: 12, name: "Low Pair", ev: 0.8237, check: (c, h) => h.lowPair },
    { rank: 13, name: "4 to Outside Straight", ev: 0.6809, check: (c, h) => h.fourToOutside },
    { rank: 14, name: "3 to SF (Type 1)", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 15, name: "JQKA Unsuited", ev: 0.5957, check: (c, h) => h.unsuitedJQKA },
    { rank: 16, name: "2 to Royal: JQ/JK/QK/JA/QA/KA", ev: 0.5750, check: (c, h) => h.twoToRoyalHigh },
    { rank: 17, name: "4 to Inside Straight 3HC", ev: 0.5319, check: (c, h) => h.fourToInside3HC },
    { rank: 18, name: "3 to SF (Type 2)", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 19, name: "JQK Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedJQK },
    { rank: 20, name: "JQ/QK Unsuited", ev: 0.4930, check: (c, h) => h.unsuitedJQ || h.unsuitedQK },
    { rank: 21, name: "Suited TJ/TQ", ev: 0.4896, check: (c, h) => h.suitedTJ || h.suitedTQ },
    { rank: 22, name: "JK/QA Unsuited", ev: 0.4802, check: (c, h) => h.unsuitedJK || h.unsuitedQA },
    { rank: 23, name: "JA/KA Unsuited", ev: 0.4743, check: (c, h) => h.unsuitedJA || h.unsuitedKA },
    { rank: 24, name: "Suited TK", ev: 0.4682, check: (c, h) => h.suitedTK },
    { rank: 25, name: "Single J/Q/K/A", ev: 0.4671, check: (c, h) => h.singleJ || h.singleQ || h.singleK || h.singleA },
    { rank: 26, name: "3 to SF (Type 3)", ev: 0.4431, check: (c, h) => h.threeToSF3 },
    { rank: 27, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
  
  // ============================================
  // BONUS POKER 8/5 (28 lines) - WoO
  // Return: 99.17%
  // ============================================
  'BP_8_5': [
    { rank: 1, name: "Pat 4K/SF/RF", ev: 25.0000, check: (c, h) => (h.isRoyalFlush || h.isStraightFlush || h.is4K) ? { indices: [0,1,2,3,4] } : null },
    { rank: 2, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    { rank: 3, name: "Pat Straight/Flush/FH", ev: 6.0000, check: (c, h) => (h.isStraight || h.isFlush || h.isFullHouse) ? { indices: [0,1,2,3,4] } : null },
    { rank: 4, name: "Three of a Kind", ev: 4.3025, check: (c, h) => h.trips },
    { rank: 5, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 6, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 7, name: "High Pair", ev: 1.5365, check: (c, h) => h.highPair },
    { rank: 8, name: "3 to Royal Flush", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 9, name: "4 to Flush", ev: 1.2766, check: (c, h) => h.fourToFlush },
    { rank: 10, name: "KQJT Unsuited", ev: 0.8723, check: (c, h) => h.unsuitedTJQK },
    { rank: 11, name: "Low Pair", ev: 0.8237, check: (c, h) => h.lowPair },
    { rank: 12, name: "4 to Outside Straight", ev: 0.6809, check: (c, h) => h.fourToOutside },
    { rank: 13, name: "3 to SF Type 1", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 14, name: "AKQJ Unsuited", ev: 0.5957, check: (c, h) => h.unsuitedJQKA },
    { rank: 15, name: "2 Suited High Cards", ev: 0.5750, check: (c, h) => h.suitedTwoHigh },
    { rank: 16, name: "3 to SF Type 2", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 17, name: "4 to Inside Straight 3HC", ev: 0.5319, check: (c, h) => h.fourToInside3HC },
    { rank: 18, name: "JQK Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedJQK },
    { rank: 19, name: "JQ Unsuited", ev: 0.4980, check: (c, h) => h.unsuitedJQ },
    { rank: 20, name: "3 to SF Type 3", ev: 0.4700, check: (c, h) => h.threeToSF3 },
    { rank: 21, name: "KQ/KJ Unsuited", ev: 0.4862, check: (c, h) => h.unsuitedKQKJ },
    { rank: 22, name: "Suited JT", ev: 0.4968, check: (c, h) => h.suitedTJ },
    { rank: 23, name: "AK/AQ/AJ Unsuited", ev: 0.4743, check: (c, h) => h.unsuitedAHigh },
    { rank: 24, name: "A Only", ev: 0.4640, check: (c, h) => h.singleA },
    { rank: 25, name: "Suited KT/QT", ev: 0.4753, check: (c, h) => h.suitedKTQT },
    { rank: 26, name: "J/Q/K Only", ev: 0.4680, check: (c, h) => h.singleJQK },
    { rank: 27, name: "3 to SF Type 4", ev: 0.4431, check: (c, h) => h.threeToSF4 },
    { rank: 28, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
  
  // ============================================
  // DOUBLE BONUS 10/7 (34 lines) - WoO
  // Return: 100.17%
  // ============================================
  'DB_10_7': [
    { rank: 1, name: "Pat SF/4K/RF", ev: 50.0000, check: (c, h) => (h.isRoyalFlush || h.isStraightFlush || h.is4K) ? { indices: [0,1,2,3,4] } : null },
    { rank: 2, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    { rank: 3, name: "Three Aces", ev: 7.6809, check: (c, h) => h.threeAces },
    { rank: 4, name: "Pat Straight/Flush/FH", ev: 7.0000, check: (c, h) => (h.isStraight || h.isFlush || h.isFullHouse) ? { indices: [0,1,2,3,4] } : null },
    { rank: 5, name: "Three of a Kind (not A)", ev: 4.4681, check: (c, h) => h.tripsNonAce },
    { rank: 6, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 7, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 8, name: "High Pair", ev: 1.5365, check: (c, h) => h.highPair },
    { rank: 9, name: "4 to Flush", ev: 1.4894, check: (c, h) => h.fourToFlush },
    { rank: 10, name: "3 to Royal Flush", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 11, name: "4 to Outside Straight", ev: 0.8511, check: (c, h) => h.fourToOutside },
    { rank: 12, name: "Low Pair", ev: 0.8237, check: (c, h) => h.lowPair },
    { rank: 13, name: "AKQJ Unsuited", ev: 0.7447, check: (c, h) => h.unsuitedJQKA },
    { rank: 14, name: "3 to SF Type 1", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 15, name: "4 to Inside Straight 3HC", ev: 0.5745, check: (c, h) => h.fourToInside3HC },
    { rank: 16, name: "Suited QJ", ev: 0.6004, check: (c, h) => h.suitedQJ },
    { rank: 17, name: "3 to Flush 2HC", ev: 0.5532, check: (c, h) => h.threeToFlush2HC },
    { rank: 18, name: "2 Suited High Cards", ev: 0.5750, check: (c, h) => h.suitedTwoHigh },
    { rank: 19, name: "4 to Inside Straight 2HC", ev: 0.5319, check: (c, h) => h.fourToInside2HC },
    { rank: 20, name: "3 to SF Type 2", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 21, name: "4 to Inside Straight 1HC", ev: 0.4894, check: (c, h) => h.fourToInside1HC },
    { rank: 22, name: "KQJ Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedKQJ },
    { rank: 23, name: "Suited JT", ev: 0.4968, check: (c, h) => h.suitedTJ },
    { rank: 24, name: "QJ Unsuited", ev: 0.4980, check: (c, h) => h.unsuitedJQ },
    { rank: 25, name: "3 to Flush 1HC", ev: 0.4787, check: (c, h) => h.threeToFlush1HC },
    { rank: 26, name: "Suited QT", ev: 0.4825, check: (c, h) => h.suitedTQ },
    { rank: 27, name: "3 to SF Type 3", ev: 0.4431, check: (c, h) => h.threeToSF3 },
    { rank: 28, name: "KQ/KJ Unsuited", ev: 0.4862, check: (c, h) => h.unsuitedKQKJ },
    { rank: 29, name: "A Only", ev: 0.4640, check: (c, h) => h.singleA },
    { rank: 30, name: "Suited KT", ev: 0.4682, check: (c, h) => h.suitedTK },
    { rank: 31, name: "J/Q/K Only", ev: 0.4671, check: (c, h) => h.singleJQK },
    { rank: 32, name: "4 to Inside Straight 0HC", ev: 0.4255, check: (c, h) => h.fourToInside0HC },
    { rank: 33, name: "3 to Flush 0HC", ev: 0.4106, check: (c, h) => h.threeToFlush0HC },
    { rank: 34, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
  
  // ============================================
  // DOUBLE DOUBLE BONUS 9/6 (39 lines) - WoO
  // Return: 98.98%
  // ============================================
  'DDB_9_6': [
    { rank: 1, name: "Royal Flush", ev: 800.0000, check: (c, h) => h.isRoyalFlush ? { indices: [0,1,2,3,4] } : null },
    // Pat quads with kicker - keep all 5!
    { rank: 2, name: "4 Aces w/2-4 Kicker", ev: 400.0000, check: (c, h) => h.fourAcesWithKicker },
    { rank: 3, name: "4 2-4s w/A-4 Kicker", ev: 160.0000, check: (c, h) => h.fourLowWithKicker },
    { rank: 4, name: "Four of a Kind", ev: 80.0000, check: (c, h) => h.is4K ? { indices: [0,1,2,3,4] } : null },
    { rank: 5, name: "Straight Flush", ev: 50.0000, check: (c, h) => h.isStraightFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 6, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    // DDB: Do NOT hold kicker with trips! EV for AAA alone (62.45) > AAA+kicker (59.15)
    // You get 2 cards to draw the 4th Ace vs only 1 card if holding kicker
    { rank: 7, name: "Three Aces", ev: 10.42, check: (c, h) => h.threeAces },
    { rank: 8, name: "Full House", ev: 9.0000, check: (c, h) => h.isFullHouse ? { indices: [0,1,2,3,4] } : null },
    { rank: 9, name: "Flush", ev: 6.0000, check: (c, h) => h.isFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 10, name: "Three of a Kind (2s-4s)", ev: 5.50, check: (c, h) => h.threeLow },
    { rank: 11, name: "Straight", ev: 4.0000, check: (c, h) => h.isStraight ? { indices: [0,1,2,3,4] } : null },
    { rank: 12, name: "Three of a Kind", ev: 4.3025, check: (c, h) => h.trips },
    { rank: 13, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 14, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 15, name: "Pair of Aces", ev: 1.6809, check: (c, h) => h.pairAces },
    { rank: 16, name: "3 to RF: JQK", ev: 1.4468, check: (c, h) => h.threeToRoyalJQK },
    { rank: 17, name: "Pair of Kings", ev: 1.5365, check: (c, h) => h.pairKings },
    { rank: 18, name: "3 to RF: TJQ", ev: 1.3617, check: (c, h) => h.threeToRoyalTJQ },
    { rank: 19, name: "Pair of J/Q", ev: 1.5365, check: (c, h) => h.pairJQ },
    { rank: 20, name: "4 to Flush", ev: 1.2766, check: (c, h) => h.fourToFlush },
    { rank: 21, name: "3 to RF (other)", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 22, name: "4 to Straight: 89TJ/9TJQ/TJQK", ev: 0.8723, check: (c, h) => h.fourToStraightHigh },
    { rank: 23, name: "Low Pair", ev: 0.8237, check: (c, h) => h.lowPair },
    { rank: 24, name: "4 to Outside Straight (mid)", ev: 0.6809, check: (c, h) => h.fourToOutside },
    { rank: 25, name: "3 to SF Type 1", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 26, name: "JQKA Unsuited", ev: 0.5957, check: (c, h) => h.unsuitedJQKA },
    { rank: 27, name: "2 to RF: JQ/JK/QK/JA/QA/KA", ev: 0.5750, check: (c, h) => h.twoToRoyalHigh },
    { rank: 28, name: "4 to Inside Straight 3HC", ev: 0.5319, check: (c, h) => h.fourToInside3HC },
    { rank: 29, name: "3 to SF Type 2", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 30, name: "JQK Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedJQK },
    { rank: 31, name: "4 to Inside (89JQ/8TJQ/9TJK/9TQK)", ev: 0.5106, check: (c, h) => h.fourToInsideSpecial },
    { rank: 32, name: "JQ Unsuited", ev: 0.4980, check: (c, h) => h.unsuitedJQ },
    { rank: 33, name: "A Only", ev: 0.4640, check: (c, h) => h.singleA },
    { rank: 34, name: "Suited TJ", ev: 0.4968, check: (c, h) => h.suitedTJ },
    { rank: 35, name: "JK/QK Unsuited", ev: 0.4862, check: (c, h) => h.unsuitedJKQK },
    { rank: 36, name: "3 to Flush 2HC (low)", ev: 0.4787, check: (c, h) => h.threeToFlush2HC },
    { rank: 37, name: "Suited TQ/TK", ev: 0.4753, check: (c, h) => h.suitedTQTK },
    { rank: 38, name: "J/Q/K Only", ev: 0.4671, check: (c, h) => h.singleJQK },
    { rank: 39, name: "3 to SF Type 3", ev: 0.4431, check: (c, h) => h.threeToSF3 },
    { rank: 40, name: "4 to Inside Straight 0HC", ev: 0.4255, check: (c, h) => h.fourToInside0HC },
    { rank: 41, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
  
  // ============================================
  // TRIPLE DOUBLE BONUS 9/7 - WoO
  // Return: 99.58%
  // KEY DIFFERENCE FROM DDB: Hold kicker with 3 Aces/2s/3s/4s
  // because 4A+kicker = 4000 (same as royal!)
  // ============================================
  'TDB_9_7': [
    { rank: 1, name: "Royal Flush", ev: 800.0000, check: (c, h) => h.isRoyalFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 2, name: "4 Aces w/2-4 Kicker", ev: 800.0000, check: (c, h) => h.fourAcesWithKicker },  // Same as royal in TDB!
    { rank: 3, name: "4 2-4s w/A-4 Kicker", ev: 400.0000, check: (c, h) => h.fourLowWithKicker },
    { rank: 4, name: "Four of a Kind", ev: 80.0000, check: (c, h) => h.is4K ? { indices: [0,1,2,3,4] } : null },
    { rank: 5, name: "Straight Flush", ev: 50.0000, check: (c, h) => h.isStraightFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 6, name: "4 to Royal Flush", ev: 18.3617, check: (c, h) => h.fourToRoyal },
    // KEY TDB RULE: 3 Aces + kicker (2/3/4) - hold all 4 cards!
    // EV ~97 coins vs ~75 for 3 Aces alone
    { rank: 7, name: "Three Aces + Kicker", ev: 97.13, check: (c, h) => h.threeAcesWithKicker },
    // 3 of 2s/3s/4s with A/2/3/4 kicker
    { rank: 8, name: "Three 2-4s + Kicker", ev: 45.0, check: (c, h) => h.threeLowWithKicker },
    { rank: 9, name: "Three Aces", ev: 75.39, check: (c, h) => h.threeAces },
    { rank: 10, name: "Full House", ev: 9.0000, check: (c, h) => h.isFullHouse ? { indices: [0,1,2,3,4] } : null },
    { rank: 11, name: "Flush", ev: 7.0000, check: (c, h) => h.isFlush ? { indices: [0,1,2,3,4] } : null },
    { rank: 12, name: "Straight", ev: 4.0000, check: (c, h) => h.isStraight ? { indices: [0,1,2,3,4] } : null },
    { rank: 13, name: "Three 2-4s", ev: 4.5, check: (c, h) => h.threeLow },
    { rank: 14, name: "Three of a Kind", ev: 4.3025, check: (c, h) => h.trips },
    { rank: 15, name: "4 to Straight Flush", ev: 3.5319, check: (c, h) => h.fourToSF },
    { rank: 16, name: "Pair of Aces", ev: 1.6809, check: (c, h) => h.pairAces },
    { rank: 17, name: "Two Pair", ev: 2.5957, check: (c, h) => h.twoPair },
    { rank: 18, name: "High Pair JQK", ev: 1.5365, check: (c, h) => h.highPairJQK },
    { rank: 19, name: "3 to Royal Flush", ev: 1.2868, check: (c, h) => h.threeToRoyal },
    { rank: 20, name: "4 to Flush", ev: 1.4894, check: (c, h) => h.fourToFlush },  // Flush pays 7
    { rank: 21, name: "Pair of 2s/3s/4s", ev: 0.9, check: (c, h) => h.pairLow },
    { rank: 22, name: "4 to Outside Straight", ev: 0.8511, check: (c, h) => h.fourToOutside },
    { rank: 23, name: "Low Pair 5-10", ev: 0.8237, check: (c, h) => h.lowPairMid },
    { rank: 24, name: "JQKA Unsuited", ev: 0.7447, check: (c, h) => h.unsuitedJQKA },
    { rank: 25, name: "3 to SF Type 1", ev: 0.6318, check: (c, h) => h.threeToSF1 },
    { rank: 26, name: "Suited QJ", ev: 0.6004, check: (c, h) => h.suitedQJ },
    { rank: 27, name: "4 to Inside Straight 3HC", ev: 0.5745, check: (c, h) => h.fourToInside3HC },
    { rank: 28, name: "2 Suited High Cards", ev: 0.5750, check: (c, h) => h.suitedTwoHigh },
    { rank: 29, name: "3 to SF Type 2", ev: 0.5162, check: (c, h) => h.threeToSF2 },
    { rank: 30, name: "4 to Inside Straight 2HC", ev: 0.5319, check: (c, h) => h.fourToInside2HC },
    { rank: 31, name: "JQK Unsuited", ev: 0.5005, check: (c, h) => h.unsuitedJQK },
    { rank: 32, name: "JQ Unsuited", ev: 0.4980, check: (c, h) => h.unsuitedJQ },
    { rank: 33, name: "A Only", ev: 0.4640, check: (c, h) => h.singleA },
    { rank: 34, name: "Suited TJ", ev: 0.4968, check: (c, h) => h.suitedTJ },
    { rank: 35, name: "J/Q/K Only", ev: 0.4671, check: (c, h) => h.singleJQK },
    { rank: 36, name: "3 to SF Type 3", ev: 0.4431, check: (c, h) => h.threeToSF3 },
    { rank: 37, name: "Discard All", ev: 0.3597, check: () => ({ indices: [] }) }
  ],
};

// ============================================
// WoO HAND ANALYSIS HELPERS
// ============================================

const WOO_RANK_VALUES = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
const WOO_HIGH_CARDS = ['J', 'Q', 'K', 'A'];

function analyzeHandForWoO(cards) {
  if (!cards || cards.length !== 5 || cards.some(c => !c)) return null;
  
  const ranks = cards.map(c => c.rank);
  const suits = cards.map(c => c.suit);
  const values = cards.map(c => WOO_RANK_VALUES[c.rank]);
  
  // Rank and suit counts
  const rankCounts = {};
  const suitCounts = {};
  ranks.forEach((r, i) => { if (!rankCounts[r]) rankCounts[r] = []; rankCounts[r].push(i); });
  suits.forEach((s, i) => { if (!suitCounts[s]) suitCounts[s] = []; suitCounts[s].push(i); });
  
  // Find pairs, trips, quads
  const pairs = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 2);
  const tripsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 3);
  const quads = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 4);
  
  // Flush check
  const flushSuit = Object.entries(suitCounts).find(([s, arr]) => arr.length === 5)?.[0];
  const isFlush = !!flushSuit;
  
  // Straight check
  const sortedValues = [...values].sort((a, b) => a - b);
  const isWheel = sortedValues.join(',') === '2,3,4,5,14';
  const isSequential = !isWheel && sortedValues.every((v, i) => i === 0 || v === sortedValues[i-1] + 1);
  const isStraight = isWheel || isSequential;
  
  // Royal check
  const royalRanks = ['10', 'J', 'Q', 'K', 'A'];
  const isRoyal = isFlush && royalRanks.every(r => ranks.includes(r));
  
  // Build result object with all possible holds
  const result = {
    // Pat hands
    isRoyalFlush: isRoyal,
    isStraightFlush: isFlush && isStraight && !isRoyal,
    is4K: quads.length > 0,
    isFullHouse: tripsArr.length === 1 && pairs.length === 1,
    isFlush: isFlush && !isStraight,
    isStraight: isStraight && !isFlush,
    
    // Made hands
    trips: tripsArr.length > 0 ? { indices: tripsArr[0][1] } : null,
    threeAces: tripsArr.length > 0 && tripsArr[0][0] === 'A' ? { indices: tripsArr[0][1] } : null,
    tripsNonAce: tripsArr.length > 0 && tripsArr[0][0] !== 'A' ? { indices: tripsArr[0][1] } : null,
    twoPair: pairs.length === 2 ? { indices: [...pairs[0][1], ...pairs[1][1]] } : null,
    highPair: pairs.length >= 1 && WOO_HIGH_CARDS.includes(pairs[0][0]) ? { indices: pairs[0][1] } : null,
    lowPair: pairs.length >= 1 && !WOO_HIGH_CARDS.includes(pairs[0][0]) ? { indices: pairs[0][1] } : null,
    pairAces: pairs.find(([r]) => r === 'A') ? { indices: pairs.find(([r]) => r === 'A')[1] } : null,
    pairKings: pairs.find(([r]) => r === 'K') ? { indices: pairs.find(([r]) => r === 'K')[1] } : null,
    pairJQ: pairs.find(([r]) => ['J', 'Q'].includes(r)) ? { indices: pairs.find(([r]) => ['J', 'Q'].includes(r))[1] } : null,
    
    // Drawing hands initialized to null
    fourToRoyal: null, threeToRoyal: null, threeToRoyalJQK: null, threeToRoyalTJQ: null, twoToRoyalHigh: null,
    fourToSF: null, threeToSF1: null, threeToSF2: null, threeToSF3: null, threeToSF4: null,
    fourToFlush: null, threeToFlush2HC: null, threeToFlush1HC: null, threeToFlush0HC: null,
    fourToOutside: null, fourToStraightHigh: null, fourToInside3HC: null, fourToInside2HC: null, 
    fourToInside1HC: null, fourToInside0HC: null, fourToInsideSpecial: null,
    suitedQJ: null, suitedKQKJ: null, suitedAHigh: null, suitedTJ: null, suitedTQ: null, suitedTK: null,
    suitedTQTK: null, suitedKTQT: null, suitedTwoHigh: null,
    unsuitedTJQK: null, unsuitedJQKA: null, unsuitedJQK: null, unsuitedKQJ: null, unsuitedJQ: null,
    unsuitedKQKJ: null, unsuitedJKQK: null, unsuitedAHigh: null, unsuitedQK: null, unsuitedJK: null,
    unsuitedQA: null, unsuitedJA: null, unsuitedKA: null,
    singleA: null, singleK: null, singleQ: null, singleJ: null, singleJQK: null,
    fourAcesWithKicker: null,
    // TDB-specific
    fourLowWithKicker: null,
    threeAcesWithKicker: null,
    threeLowWithKicker: null,
    threeLow: null,
    pairLow: null,
    lowPairMid: null,
    highPairJQK: null
  };
  
  // Check for royal/SF draws
  for (const [suit, indices] of Object.entries(suitCounts)) {
    if (indices.length >= 4) {
      const suitedCards = indices.map(i => cards[i]);
      const suitedRanks = suitedCards.map(c => c.rank);
      const royalCount = suitedRanks.filter(r => royalRanks.includes(r)).length;
      
      // 4 to Royal
      if (royalCount === 4) {
        const royalIndices = indices.filter(i => royalRanks.includes(cards[i].rank));
        result.fourToRoyal = { indices: royalIndices };
      }
      
      // 4 to SF (not royal) - includes both open-ended (span=3) and inside (span=4)
      // Per WoO: 4-SF Open EV ~4.07, 4-SF Inside EV ~2.73 - BOTH beat High Pair (1.54) and 4-Flush (1.28)
      const suitedValues = suitedCards.map(c => WOO_RANK_VALUES[c.rank]).sort((a, b) => a - b);
      const span = suitedValues[suitedValues.length - 1] - suitedValues[0];
      if (span <= 4 && royalCount < 4) {
        // Distinguish between open (span=3) and inside (span=4) for proper ranking
        if (span <= 3) {
          result.fourToSFOpen = { indices };
        } else {
          result.fourToSFInside = { indices };
        }
        // Generic fourToSF for strategies that don't distinguish
        result.fourToSF = { indices };
      }
      
      // 4 to Flush (not SF draw)
      if (!result.fourToSF && !result.fourToRoyal) {
        result.fourToFlush = { indices };
      }
    }
    
    if (indices.length >= 3) {
      const suitedCards = indices.map(i => cards[i]);
      const suitedRanks = suitedCards.map(c => c.rank);
      const royalCount = suitedRanks.filter(r => royalRanks.includes(r)).length;
      
      // 3 to Royal
      if (royalCount >= 3) {
        const royalIndices = indices.filter(i => royalRanks.includes(cards[i].rank)).slice(0, 3);
        result.threeToRoyal = { indices: royalIndices };
        
        const royalRanksHeld = royalIndices.map(i => cards[i].rank);
        if (royalRanksHeld.includes('J') && royalRanksHeld.includes('Q') && royalRanksHeld.includes('K')) {
          result.threeToRoyalJQK = { indices: royalIndices };
        }
        if (royalRanksHeld.includes('10') && royalRanksHeld.includes('J') && royalRanksHeld.includes('Q')) {
          result.threeToRoyalTJQ = { indices: royalIndices };
        }
      }
      
      // 3 to SF - analyze gaps and high cards
      const suitedValues = suitedCards.map(c => WOO_RANK_VALUES[c.rank]).sort((a, b) => a - b);
      const highCount = suitedCards.filter(c => WOO_HIGH_CARDS.includes(c.rank)).length;
      const gaps = suitedValues[suitedValues.length - 1] - suitedValues[0] - (suitedValues.length - 1);
      
      if (suitedValues[suitedValues.length - 1] - suitedValues[0] <= 4) {
        const sfIndices = indices.slice(0, 3);
        if (highCount >= gaps) result.threeToSF1 = { indices: sfIndices };
        else if (gaps === 1 || (gaps === 2 && highCount >= 1)) result.threeToSF2 = { indices: sfIndices };
        else if (gaps === 2 && highCount === 0) result.threeToSF3 = { indices: sfIndices };
        else result.threeToSF4 = { indices: sfIndices };
      }
      
      // 3 to Flush with high cards
      const hcCount = suitedCards.filter(c => WOO_HIGH_CARDS.includes(c.rank)).length;
      if (hcCount >= 2) result.threeToFlush2HC = { indices: indices.slice(0, 3) };
      else if (hcCount === 1) result.threeToFlush1HC = { indices: indices.slice(0, 3) };
      else result.threeToFlush0HC = { indices: indices.slice(0, 3) };
    }
    
    // 2 to Royal (high cards only, no T)
    if (indices.length >= 2) {
      const royalIndices = indices.filter(i => royalRanks.includes(cards[i].rank) && cards[i].rank !== '10');
      if (royalIndices.length >= 2) {
        result.twoToRoyalHigh = { indices: royalIndices.slice(0, 2) };
      }
    }
  }
  
  // Check suited high card pairs
  for (const [suit, indices] of Object.entries(suitCounts)) {
    if (indices.length >= 2) {
      const suitedRanks = indices.map(i => cards[i].rank);
      if (suitedRanks.includes('Q') && suitedRanks.includes('J')) {
        result.suitedQJ = { indices: [indices[suitedRanks.indexOf('Q')], indices[suitedRanks.indexOf('J')]] };
      }
      if (suitedRanks.includes('K') && (suitedRanks.includes('Q') || suitedRanks.includes('J'))) {
        const kIdx = indices[suitedRanks.indexOf('K')];
        const otherIdx = suitedRanks.includes('Q') ? indices[suitedRanks.indexOf('Q')] : indices[suitedRanks.indexOf('J')];
        result.suitedKQKJ = { indices: [kIdx, otherIdx] };
      }
      if (suitedRanks.includes('A') && ['K', 'Q', 'J'].some(r => suitedRanks.includes(r))) {
        const aIdx = indices[suitedRanks.indexOf('A')];
        const otherRank = ['K', 'Q', 'J'].find(r => suitedRanks.includes(r));
        result.suitedAHigh = { indices: [aIdx, indices[suitedRanks.indexOf(otherRank)]] };
      }
      if (suitedRanks.includes('10') && suitedRanks.includes('J')) {
        result.suitedTJ = { indices: [indices[suitedRanks.indexOf('10')], indices[suitedRanks.indexOf('J')]] };
      }
      if (suitedRanks.includes('10') && suitedRanks.includes('Q')) {
        result.suitedTQ = { indices: [indices[suitedRanks.indexOf('10')], indices[suitedRanks.indexOf('Q')]] };
      }
      if (suitedRanks.includes('10') && suitedRanks.includes('K')) {
        result.suitedTK = { indices: [indices[suitedRanks.indexOf('10')], indices[suitedRanks.indexOf('K')]] };
      }
      // Any two suited high cards
      const suitedHigh = indices.filter(i => WOO_HIGH_CARDS.includes(cards[i].rank));
      if (suitedHigh.length >= 2) {
        result.suitedTwoHigh = { indices: suitedHigh.slice(0, 2) };
      }
      if (suitedRanks.includes('10') && (suitedRanks.includes('K') || suitedRanks.includes('Q'))) {
        result.suitedKTQT = result.suitedTK || result.suitedTQ;
        result.suitedTQTK = result.suitedTQ || result.suitedTK;
      }
    }
  }
  
  // Check unsuited combinations
  const findUnsuited = (targetRanks) => {
    const matchingIndices = [];
    for (const targetRank of targetRanks) {
      const idx = cards.findIndex((c, i) => c.rank === targetRank && !matchingIndices.includes(i));
      if (idx >= 0) matchingIndices.push(idx);
    }
    if (matchingIndices.length === targetRanks.length) {
      const matchSuits = matchingIndices.map(i => cards[i].suit);
      if (new Set(matchSuits).size > 1) {
        return { indices: matchingIndices };
      }
    }
    return null;
  };
  
  result.unsuitedTJQK = findUnsuited(['10', 'J', 'Q', 'K']);
  result.unsuitedJQKA = findUnsuited(['J', 'Q', 'K', 'A']);
  result.unsuitedJQK = findUnsuited(['J', 'Q', 'K']);
  result.unsuitedKQJ = result.unsuitedJQK;
  result.unsuitedJQ = findUnsuited(['J', 'Q']);
  result.unsuitedKQKJ = findUnsuited(['K', 'Q']) || findUnsuited(['K', 'J']);
  result.unsuitedJKQK = findUnsuited(['J', 'K']) || findUnsuited(['Q', 'K']);
  result.unsuitedAHigh = findUnsuited(['A', 'K']) || findUnsuited(['A', 'Q']) || findUnsuited(['A', 'J']);
  result.unsuitedQK = findUnsuited(['Q', 'K']);
  result.unsuitedJK = findUnsuited(['J', 'K']);
  result.unsuitedQA = findUnsuited(['Q', 'A']);
  result.unsuitedJA = findUnsuited(['J', 'A']);
  result.unsuitedKA = findUnsuited(['K', 'A']);
  
  // Single high cards
  for (const [rank, key] of [['A', 'singleA'], ['K', 'singleK'], ['Q', 'singleQ'], ['J', 'singleJ']]) {
    const idx = cards.findIndex(c => c.rank === rank);
    if (idx >= 0) result[key] = { indices: [idx] };
  }
  const jqkIdx = cards.findIndex(c => ['J', 'Q', 'K'].includes(c.rank));
  if (jqkIdx >= 0) result.singleJQK = { indices: [jqkIdx] };
  
  // Check for straights
  for (let skip = 0; skip < 5; skip++) {
    const subset = cards.filter((_, i) => i !== skip);
    const subValues = subset.map(c => WOO_RANK_VALUES[c.rank]).sort((a, b) => a - b);
    const uniqueValues = [...new Set(subValues)];
    
    if (uniqueValues.length === 4) {
      const span = uniqueValues[3] - uniqueValues[0];
      const hcCount = subset.filter(c => WOO_HIGH_CARDS.includes(c.rank)).length;
      const indices = [0,1,2,3,4].filter(i => i !== skip);
      
      // Open-ended (span = 3, not at edges)
      if (span === 3 && uniqueValues[0] >= 2 && uniqueValues[3] <= 13) {
        result.fourToOutside = { indices };
        if (uniqueValues[0] >= 8) {
          result.fourToStraightHigh = { indices };
        }
      }
      
      // Inside straight (span = 4)
      if (span === 4) {
        if (hcCount >= 3) result.fourToInside3HC = { indices };
        else if (hcCount === 2) result.fourToInside2HC = { indices };
        else if (hcCount === 1) result.fourToInside1HC = { indices };
        else result.fourToInside0HC = { indices };
        
        // Special inside straights for DDB
        const ranksHeld = indices.map(i => cards[i].rank);
        if ((ranksHeld.includes('8') && ranksHeld.includes('9') && ranksHeld.includes('J') && ranksHeld.includes('Q')) ||
            (ranksHeld.includes('8') && ranksHeld.includes('10') && ranksHeld.includes('J') && ranksHeld.includes('Q')) ||
            (ranksHeld.includes('9') && ranksHeld.includes('10') && ranksHeld.includes('J') && ranksHeld.includes('K')) ||
            (ranksHeld.includes('9') && ranksHeld.includes('10') && ranksHeld.includes('Q') && ranksHeld.includes('K'))) {
          result.fourToInsideSpecial = { indices };
        }
      }
    }
  }
  
  // DDB: 4 Aces with 2-4 kicker
  if (quads.length > 0 && quads[0][0] === 'A') {
    const kickerIdx = [0,1,2,3,4].find(i => !quads[0][1].includes(i));
    const kickerRank = cards[kickerIdx].rank;
    if (['2', '3', '4'].includes(kickerRank)) {
      result.fourAcesWithKicker = { indices: [0,1,2,3,4] };
    }
  }
  
  // TDB: 4 of 2s/3s/4s with A/2/3/4 kicker
  if (quads.length > 0 && ['2', '3', '4'].includes(quads[0][0])) {
    const kickerIdx = [0,1,2,3,4].find(i => !quads[0][1].includes(i));
    const kickerRank = cards[kickerIdx].rank;
    if (['A', '2', '3', '4'].includes(kickerRank)) {
      result.fourLowWithKicker = { indices: [0,1,2,3,4] };
    }
  }
  
  // TDB: 3 Aces with 2/3/4 kicker - HOLD THE KICKER!
  if (tripsArr.length > 0 && tripsArr[0][0] === 'A') {
    const nonTripIndices = [0,1,2,3,4].filter(i => !tripsArr[0][1].includes(i));
    const kickers = nonTripIndices.map(i => cards[i].rank);
    const hasKicker = kickers.some(k => ['2', '3', '4'].includes(k));
    if (hasKicker) {
      const kickerIdx = nonTripIndices.find(i => ['2', '3', '4'].includes(cards[i].rank));
      result.threeAcesWithKicker = { indices: [...tripsArr[0][1], kickerIdx] };
    }
  }
  
  // TDB: 3 of 2s/3s/4s with A/2/3/4 kicker
  if (tripsArr.length > 0 && ['2', '3', '4'].includes(tripsArr[0][0])) {
    const nonTripIndices = [0,1,2,3,4].filter(i => !tripsArr[0][1].includes(i));
    const kickers = nonTripIndices.map(i => cards[i].rank);
    const hasKicker = kickers.some(k => ['A', '2', '3', '4'].includes(k));
    if (hasKicker) {
      const kickerIdx = nonTripIndices.find(i => ['A', '2', '3', '4'].includes(cards[i].rank));
      result.threeLowWithKicker = { indices: [...tripsArr[0][1], kickerIdx] };
    }
    // Also set threeLow (without kicker consideration)
    result.threeLow = { indices: tripsArr[0][1] };
  }
  
  // TDB: Pair of 2s/3s/4s (special ranking)
  if (pairs.length >= 1 && ['2', '3', '4'].includes(pairs[0][0])) {
    result.pairLow = { indices: pairs[0][1] };
  }
  
  // TDB: Low pair 5-10 (mid range)
  if (pairs.length >= 1 && ['5', '6', '7', '8', '9', '10'].includes(pairs[0][0])) {
    result.lowPairMid = { indices: pairs[0][1] };
  }
  
  // TDB: High pair JQK (not aces - aces handled separately)
  if (pairs.length >= 1 && ['J', 'Q', 'K'].includes(pairs[0][0])) {
    result.highPairJQK = { indices: pairs[0][1] };
  }
  
  return result;
}

// ============================================
// MAIN WoO RECOMMENDATION FUNCTION
// ============================================

const getWoOStrategyRecommendation = (cards, payTable = null, gameType = 'jacks-or-better') => {
  if (!cards || cards.length !== 5 || cards.some(c => !c)) return null;
  
  // Get pay table key
  const fhfl = payTable ? `${payTable.fh}/${payTable.fl}` : '9/6';
  const gameStrategies = PAY_TABLE_STRATEGIES[gameType];
  const strategyKey = gameStrategies?.[fhfl] || gameStrategies?.['9/6'] || 'JOB_9_6';
  
  // Handle Deuces Wild games
  const deucesWildGames = ['deuces-wild', 'double-deuces'];
  if (deucesWildGames.includes(gameType)) {
    return getDeucesWildWoORecommendation(cards, payTable);
  }
  
  // Handle Loose Deuces (4 deuces = 500!)
  if (gameType === 'loose-deuces') {
    return getLooseDeucesWoORecommendation(cards, payTable);
  }
  
  // Handle Bonus Deuces Wild (has different pay table and strategy)
  if (gameType === 'bonus-deuces-wild') {
    return getBonusDeucesWildWoORecommendation(cards, payTable);
  }
  
  // Handle Joker Poker Kings or Better (53-card deck, min hand: Kings+)
  if (gameType === 'joker-poker-kings') {
    return getJokerPokerKingsWoORecommendation(cards, payTable);
  }
  
  // Handle Joker Poker Two Pair (53-card deck, min hand: Two Pair)
  if (gameType === 'joker-poker-twopair') {
    return getJokerPokerTwoPairWoORecommendation(cards, payTable);
  }
  
  // Handle Ultimate X variants - route to base game strategies
  // Per WoO: Basic strategy for Ultimate X is identical to base game
  // Multipliers add ~0.2% return but don't change optimal play decisions
  if (gameType === 'ultimate-x-jacks') {
    const result = getWoOStrategyRecommendation(cards, payTable, 'jacks-or-better');
    if (result) result.note = 'Ultimate X: Same strategy as base JoB (multipliers add ~0.2%)';
    return result;
  }
  if (gameType === 'ultimate-x-bonus') {
    const result = getWoOStrategyRecommendation(cards, payTable, 'bonus-poker');
    if (result) result.note = 'Ultimate X: Same strategy as base BP (multipliers add ~0.2%)';
    return result;
  }
  if (gameType === 'ultimate-x-ddb') {
    const result = getWoOStrategyRecommendation(cards, payTable, 'double-double-bonus');
    if (result) result.note = 'Ultimate X: Same strategy as base DDB (multipliers add ~0.2%)';
    return result;
  }
  if (gameType === 'ultimate-x-double-bonus') {
    const result = getWoOStrategyRecommendation(cards, payTable, 'double-bonus');
    if (result) result.note = 'Ultimate X: Same strategy as base DB (multipliers add ~0.2%)';
    return result;
  }
  if (gameType === 'ultimate-x-bpd') {
    const result = getWoOStrategyRecommendation(cards, payTable, 'bonus-poker-deluxe');
    if (result) result.note = 'Ultimate X: Same strategy as base BPD (multipliers add ~0.2%)';
    return result;
  }
  if (gameType === 'ultimate-x-joker') {
    const result = getJokerPokerKingsWoORecommendation(cards, payTable);
    if (result) result.note = 'Ultimate X: Same strategy as base Joker Poker Kings (multipliers add ~0.2%)';
    return result;
  }
  
  // Handle other Joker Poker games (fallback to Kings strategy)
  if (gameType.includes('joker')) {
    return getJokerPokerWoORecommendation(cards, payTable);
  }
  
  // Get strategy hierarchy
  const hierarchy = STRATEGY_HIERARCHIES[strategyKey];
  if (!hierarchy) {
    // Fallback to JoB 9/6
    return getWoOStrategyRecommendation(cards, { fh: 9, fl: 6 }, 'jacks-or-better');
  }
  
  // Analyze hand
  const analysis = analyzeHandForWoO(cards);
  if (!analysis) return null;
  
  // Find best play from hierarchy
  for (const line of hierarchy) {
    const match = line.check(cards, analysis);
    if (match) {
      return {
        hold: match.indices,
        name: line.name,
        reason: `EV: ${line.ev.toFixed(4)} • WoO Optimal`,
        payout: line.ev,
        rank: line.rank,
        source: 'wizardofodds.com'
      };
    }
  }
  
  // Fallback
  return { hold: [], name: 'Discard All', reason: 'Draw 5 new cards', payout: 0.36, rank: 99 };
};

// Deuces Wild WoO recommendation
const getDeucesWildWoORecommendation = (cards, payTable) => {
  const deuceCount = cards.filter(c => c.rank === '2').length;
  const deuceIndices = cards.map((c, i) => c.rank === '2' ? i : -1).filter(i => i >= 0);
  const nonDeuceCards = cards.filter(c => c.rank !== '2');
  const nonDeuceIndices = cards.map((c, i) => c.rank !== '2' ? i : -1).filter(i => i >= 0);
  
  // Analyze non-deuce cards
  const ranks = cards.map(c => c.rank);
  const rankCounts = {};
  ranks.forEach((r, i) => { 
    if (r !== '2') {
      if (!rankCounts[r]) rankCounts[r] = []; 
      rankCounts[r].push(i); 
    }
  });
  
  // Find pairs/trips among non-deuces
  const pairsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 2);
  const tripsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 3);
  const quadsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 4);
  
  // Check for suited NON-DEUCE cards (deuces are wild and can be any suit!)
  const nonDeuceSuitCounts = {};
  nonDeuceCards.forEach((c, origIdx) => {
    const realIdx = nonDeuceIndices[nonDeuceCards.indexOf(c)] !== undefined ? 
      cards.findIndex((card, i) => card === c && card.rank !== '2') : -1;
    // Find the actual index in original cards array
    const actualIdx = cards.indexOf(c);
    if (!nonDeuceSuitCounts[c.suit]) nonDeuceSuitCounts[c.suit] = [];
    nonDeuceSuitCounts[c.suit].push(actualIdx);
  });
  
  const royalRanks = ['10', 'J', 'Q', 'K', 'A'];
  const WOO_RANK_VALUES_DW = { '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  
  if (deuceCount === 4) {
    return { hold: [0,1,2,3,4], name: 'Four Deuces', reason: 'EV: 200.00 • WoO Optimal', payout: 200, source: 'wizardofodds.com' };
  }
  
  if (deuceCount === 3) {
    // Check for wild royal (3 deuces + 2 royal cards same suit among non-deuces)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for 5 of a kind (3 deuces + pair)
    if (pairsArr.length > 0) {
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 15.00 • Keep it!', payout: 15, source: 'wizardofodds.com' };
    }
    return { hold: deuceIndices, name: '3 Deuces', reason: 'EV: 14.41 • Draw for Wild Royal/5K', payout: 14.41, source: 'wizardofodds.com' };
  }
  
  if (deuceCount === 2) {
    // Check for wild royal (2 deuces + 3 royal cards same suit among non-deuces)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for straight flush (2 deuces + 3 suited cards that can make SF)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          // With 2 deuces filling gaps, span of 4 or less means we have SF
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 9.00 • Keep it!', payout: 9, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Check for 5 of a kind (2 deuces + trips)
    if (tripsArr.length > 0) {
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 15.00 • Keep it!', payout: 15, source: 'wizardofodds.com' };
    }
    // Check for 4 of a kind (2 deuces + pair) - draw for 5K
    if (pairsArr.length > 0) {
      const pairIndices = pairsArr[0][1];
      return { hold: [...deuceIndices, ...pairIndices], name: 'Four of a Kind', reason: 'EV: 5.76 • Draw 1 for 5K', payout: 5.76, source: 'wizardofodds.com' };
    }
    // Check for 4 to wild royal (2 deuces + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [...deuceIndices, ...royalInSuit.slice(0, 2)], name: '4 to Wild Royal', reason: 'EV: 14.89 • Draw 1', payout: 14.89, source: 'wizardofodds.com' };
      }
    }
    return { hold: deuceIndices, name: '2 Deuces', reason: 'EV: 3.07 • Draw for Quads+', payout: 3.07, source: 'wizardofodds.com' };
  }
  
  if (deuceCount === 1) {
    const deuceIdx = deuceIndices[0];
    
    // Check for wild royal (1 deuce + 4 royal cards same suit among NON-DEUCES)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length === 4) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for 5 of a kind (deuce + quads)
    if (quadsArr.length > 0) {
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 15.00 • Keep it!', payout: 15, source: 'wizardofodds.com' };
    }
    // Check for straight flush (1 deuce + 4 suited cards that form SF)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 4) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 4) {
          const span = vals[vals.length - 1] - vals[0];
          // With 1 deuce filling a gap, span of 4 or less means SF
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 9.00 • Keep it!', payout: 9, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Check for 4 of a kind (deuce + trips)
    if (tripsArr.length > 0) {
      const tripIndices = tripsArr[0][1];
      return { hold: [...deuceIndices, ...tripIndices], name: 'Four of a Kind', reason: 'EV: 5.76 • Draw 1 for 5K', payout: 5.76, source: 'wizardofodds.com' };
    }
    // Check for 4 to wild royal (1 deuce + 3 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [deuceIdx, ...royalInSuit.slice(0, 3)], name: '4 to Wild Royal', reason: 'EV: 3.40 • Draw 1', payout: 3.40, source: 'wizardofodds.com' };
      }
    }
    // Full house check (deuce + 2 pairs = FH)
    if (pairsArr.length >= 2) {
      return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 3.00 • Keep it!', payout: 3, source: 'wizardofodds.com' };
    }
    // Flush check (deuce + 4 same suit non-deuces, but not SF)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 4) {
        return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 2.00 • Keep it!', payout: 2, source: 'wizardofodds.com' };
      }
    }
    // Straight check - need to verify non-deuces can form straight with wild
    const nonDeuceVals = nonDeuceCards.map(c => WOO_RANK_VALUES_DW[c.rank]).filter(v => v).sort((a,b) => a-b);
    if (nonDeuceVals.length === 4) {
      const uniqueVals = [...new Set(nonDeuceVals)];
      if (uniqueVals.length === 4) {
        const span = uniqueVals[3] - uniqueVals[0];
        if (span <= 4) {
          return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 2.00 • Keep it!', payout: 2, source: 'wizardofodds.com' };
        }
        // Check for wheel (A-2-3-4-5 but 2 is wild)
        if (uniqueVals.includes(14) && uniqueVals.includes(3) && uniqueVals.includes(4) && uniqueVals.includes(5)) {
          return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 2.00 • Keep it!', payout: 2, source: 'wizardofodds.com' };
        }
      }
    }
    // THREE OF A KIND (deuce + pair) - THIS IS THE KEY FIX!
    if (pairsArr.length > 0) {
      const pairIndices = pairsArr[0][1];
      return { hold: [...deuceIndices, ...pairIndices], name: 'Three of a Kind', reason: 'EV: 1.51 • Draw 2 for Quads+', payout: 1.51, source: 'wizardofodds.com' };
    }
    // 4 to straight flush (1 deuce + 3 suited that can make SF)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [deuceIdx, ...indices.slice(0, 3)], name: '4 to Straight Flush', reason: 'EV: 1.22 • Draw 1', payout: 1.22, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // 3 to wild royal (1 deuce + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [deuceIdx, ...royalInSuit.slice(0, 2)], name: '3 to Wild Royal', reason: 'EV: 1.17 • Draw 2', payout: 1.17, source: 'wizardofodds.com' };
      }
    }
    // Just the deuce
    return { hold: deuceIndices, name: '1 Deuce', reason: 'EV: 1.01 • Draw 4 for Trips+', payout: 1.01, source: 'wizardofodds.com' };
  }
  
  // 0 Deuces - use standard analysis
  const analysis = analyzeHandForWoO(cards);
  if (analysis.isRoyalFlush) return { hold: [0,1,2,3,4], name: 'Natural Royal', reason: 'EV: 800.00 • Jackpot!', payout: 800, source: 'wizardofodds.com' };
  if (analysis.fourToRoyal) return { hold: analysis.fourToRoyal.indices, name: '4 to Royal', reason: 'EV: 19.83 • WoO Optimal', payout: 19.83, source: 'wizardofodds.com' };
  if (analysis.isStraightFlush) return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 9.00', payout: 9, source: 'wizardofodds.com' };
  if (analysis.is4K) return { hold: [0,1,2,3,4], name: 'Four of a Kind', reason: 'EV: 5.00', payout: 5, source: 'wizardofodds.com' };
  if (analysis.isFullHouse) return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 3.00', payout: 3, source: 'wizardofodds.com' };
  if (analysis.isFlush) return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 2.00', payout: 2, source: 'wizardofodds.com' };
  if (analysis.isStraight) return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 2.00', payout: 2, source: 'wizardofodds.com' };
  if (analysis.trips) return { hold: analysis.trips.indices, name: 'Three of a Kind', reason: 'EV: 1.02 • Draw 2', payout: 1.02, source: 'wizardofodds.com' };
  if (analysis.fourToSF) return { hold: analysis.fourToSF.indices, name: '4 to SF', reason: 'EV: 1.22 • WoO Optimal', payout: 1.22, source: 'wizardofodds.com' };
  if (analysis.threeToRoyal) return { hold: analysis.threeToRoyal.indices, name: '3 to Royal', reason: 'EV: 1.30 • WoO Optimal', payout: 1.30, source: 'wizardofodds.com' };
  if (analysis.fourToFlush) return { hold: analysis.fourToFlush.indices, name: '4 to Flush', reason: 'EV: 0.51', payout: 0.51, source: 'wizardofodds.com' };
  // In DW, discard one pair from two pair (two pair doesn't pay!)
  if (analysis.twoPair) {
    const firstPair = pairsArr[0]?.[1] || [];
    return { hold: firstPair, name: 'One Pair (discard 2P)', reason: 'EV: 0.56 • DW: Two pair pays nothing!', payout: 0.56, source: 'wizardofodds.com' };
  }
  if (analysis.lowPair || analysis.highPair) {
    const pairResult = analysis.lowPair || analysis.highPair;
    return { hold: pairResult.indices, name: 'Pair', reason: 'EV: 0.56 • WoO Optimal', payout: 0.56, source: 'wizardofodds.com' };
  }
  if (analysis.fourToOutside) return { hold: analysis.fourToOutside.indices, name: '4 to Straight', reason: 'EV: 0.51', payout: 0.51, source: 'wizardofodds.com' };
  if (analysis.threeToSF1 || analysis.threeToSF2) {
    const sf = analysis.threeToSF1 || analysis.threeToSF2;
    return { hold: sf.indices, name: '3 to SF', reason: 'EV: 0.45', payout: 0.45, source: 'wizardofodds.com' };
  }
  return { hold: [], name: 'Discard All', reason: 'EV: 0.32 • No valuable holds', payout: 0.32, source: 'wizardofodds.com' };
};

// Joker Poker WoO recommendation
const getJokerPokerWoORecommendation = (cards, payTable) => {
  const hasJoker = cards.some(c => c.rank === 'JOKER' || c.isJoker);
  if (hasJoker) {
    const jokerIndices = cards.map((c, i) => (c.rank === 'JOKER' || c.isJoker) ? i : -1).filter(i => i >= 0);
    return { hold: jokerIndices, name: 'Joker', reason: 'Always hold the Joker • WoO', payout: 0.74 };
  }
  
  const analysis = analyzeHandForWoO(cards);
  if (analysis.isRoyalFlush) return { hold: [0,1,2,3,4], name: 'Natural Royal', reason: 'Jackpot!', payout: 800 };
  if (analysis.fourToRoyal) return { hold: analysis.fourToRoyal.indices, name: '4 to Royal', reason: 'EV: 19.66 • WoO', payout: 19.66 };
  if (analysis.isStraightFlush) return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 50.00', payout: 50 };
  if (analysis.is4K) return { hold: [0,1,2,3,4], name: 'Four of a Kind', reason: 'EV: 17.00', payout: 17 };
  if (analysis.fourToSF) return { hold: analysis.fourToSF.indices, name: '4 to SF', reason: 'EV: 3.32 • WoO', payout: 3.32 };
  if (analysis.isFullHouse) return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 7.00', payout: 7 };
  if (analysis.isFlush) return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 5.00', payout: 5 };
  if (analysis.isStraight) return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 3.00', payout: 3 };
  if (analysis.trips) return { hold: analysis.trips.indices, name: 'Three of a Kind', reason: 'EV: 2.00', payout: 2 };
  if (analysis.threeToRoyal) return { hold: analysis.threeToRoyal.indices, name: '3 to Royal', reason: 'EV: 1.45 • WoO', payout: 1.45 };
  if (analysis.twoPair) return { hold: analysis.twoPair.indices, name: 'Two Pair', reason: 'EV: 1.00', payout: 1 };
  if (analysis.pairKings || analysis.pairAces) {
    const pair = analysis.pairKings || analysis.pairAces;
    return { hold: pair.indices, name: 'Pair K/A', reason: 'Kings or Better • WoO', payout: 1 };
  }
  if (analysis.threeToSF1 || analysis.threeToSF2) {
    const sf = analysis.threeToSF1 || analysis.threeToSF2;
    return { hold: sf.indices, name: '3 to SF', reason: 'EV: 0.72 • WoO', payout: 0.72 };
  }
  if (analysis.lowPair) return { hold: analysis.lowPair.indices, name: 'Low Pair', reason: 'EV: 0.62 • WoO', payout: 0.62 };
  if (analysis.fourToFlush) return { hold: analysis.fourToFlush.indices, name: '4 to Flush', reason: 'EV: 0.77', payout: 0.77 };
  if (analysis.fourToOutside) return { hold: analysis.fourToOutside.indices, name: '4 to Straight', reason: 'EV: 0.60', payout: 0.60 };
  if (analysis.singleK || analysis.singleA) {
    const single = analysis.singleK || analysis.singleA;
    return { hold: single.indices, name: 'K or A', reason: 'EV: 0.42 • WoO', payout: 0.42 };
  }
  return { hold: [], name: 'Discard All', reason: 'EV: 0.39 • Draw 5', payout: 0.39 };
};

// ============================================
// BONUS DEUCES WILD WoO Strategy (13/4/3)
// Return: 98.80%
// Source: https://wizardofodds.com/games/video-poker/strategy/bonus-deuces-wild/13-4-3/
// Key differences from regular DW:
//   - 4 Deuces + Ace = 400 (same as royal value, hold ace!)
//   - 5 Aces = 80
//   - 5 of 3s/4s/5s = 40
//   - 5 of 6s-Ks = 20
// ============================================
const getBonusDeucesWildWoORecommendation = (cards, payTable) => {
  const deuceCount = cards.filter(c => c.rank === '2').length;
  const deuceIndices = cards.map((c, i) => c.rank === '2' ? i : -1).filter(i => i >= 0);
  const nonDeuceCards = cards.filter(c => c.rank !== '2');
  const nonDeuceIndices = cards.map((c, i) => c.rank !== '2' ? i : -1).filter(i => i >= 0);
  
  // Analyze non-deuce cards
  const rankCounts = {};
  cards.forEach((c, i) => { 
    if (c.rank !== '2') {
      if (!rankCounts[c.rank]) rankCounts[c.rank] = []; 
      rankCounts[c.rank].push(i); 
    }
  });
  
  const pairsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 2);
  const tripsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 3);
  const quadsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 4);
  
  // Check for Aces among non-deuces
  const aceIndices = rankCounts['A'] || [];
  const hasAce = aceIndices.length > 0;
  
  // Check for suited NON-DEUCE cards
  const nonDeuceSuitCounts = {};
  nonDeuceCards.forEach(c => {
    const actualIdx = cards.indexOf(c);
    if (!nonDeuceSuitCounts[c.suit]) nonDeuceSuitCounts[c.suit] = [];
    nonDeuceSuitCounts[c.suit].push(actualIdx);
  });
  
  const royalRanks = ['10', 'J', 'Q', 'K', 'A'];
  const WOO_RANK_VALUES_DW = { '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  
  // === 4 DEUCES ===
  if (deuceCount === 4) {
    // BDW RULE: 4 Deuces + Ace = 400 (same as keeping all 5!)
    if (hasAce) {
      return { hold: [0,1,2,3,4], name: 'Four Deuces + Ace', reason: 'EV: 400.00 • BDW Jackpot!', payout: 400, source: 'wizardofodds.com' };
    }
    return { hold: [0,1,2,3,4], name: 'Four Deuces', reason: 'EV: 200.00 • Keep it!', payout: 200, source: 'wizardofodds.com' };
  }
  
  // === 3 DEUCES ===
  if (deuceCount === 3) {
    // Check for wild royal (3 deuces + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for 5 of a kind (3 deuces + pair)
    if (pairsArr.length > 0) {
      const pairRank = pairsArr[0][0];
      if (pairRank === 'A') {
        return { hold: [0,1,2,3,4], name: 'Five Aces', reason: 'EV: 80.00 • BDW Bonus!', payout: 80, source: 'wizardofodds.com' };
      }
      if (['3', '4', '5'].includes(pairRank)) {
        return { hold: [0,1,2,3,4], name: 'Five 3-5s', reason: 'EV: 40.00 • BDW Bonus!', payout: 40, source: 'wizardofodds.com' };
      }
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 20.00', payout: 20, source: 'wizardofodds.com' };
    }
    // BDW RULE: 3 Deuces + Ace = Hold the ace (draw for 4 deuces+A or 5 aces)
    if (hasAce) {
      return { hold: [...deuceIndices, ...aceIndices], name: '3 Deuces + Ace', reason: 'EV: ~15 • Drawing for 4 Deuces+A or 5 Aces', payout: 15, source: 'wizardofodds.com' };
    }
    return { hold: deuceIndices, name: '3 Deuces', reason: 'EV: 14.41 • Draw for Wild Royal/5K', payout: 14.41, source: 'wizardofodds.com' };
  }
  
  // === 2 DEUCES ===
  if (deuceCount === 2) {
    // Check for wild royal
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for 5 of a kind (2 deuces + trips)
    if (tripsArr.length > 0) {
      const tripRank = tripsArr[0][0];
      if (tripRank === 'A') {
        return { hold: [0,1,2,3,4], name: 'Five Aces', reason: 'EV: 80.00 • BDW Bonus!', payout: 80, source: 'wizardofodds.com' };
      }
      if (['3', '4', '5'].includes(tripRank)) {
        return { hold: [0,1,2,3,4], name: 'Five 3-5s', reason: 'EV: 40.00 • BDW Bonus!', payout: 40, source: 'wizardofodds.com' };
      }
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 20.00', payout: 20, source: 'wizardofodds.com' };
    }
    // Check for straight flush
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 13.00 • Keep it!', payout: 13, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // 4 of a kind (2 deuces + pair)
    if (pairsArr.length > 0) {
      const pairRank = pairsArr[0][0];
      const pairIndices = pairsArr[0][1];
      return { hold: [...deuceIndices, ...pairIndices], name: 'Four of a Kind', reason: 'EV: ~6 • Draw 1 for 5K', payout: 6, source: 'wizardofodds.com' };
    }
    // 4 to wild royal (2 deuces + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [...deuceIndices, ...royalInSuit.slice(0, 2)], name: '4 to Wild Royal', reason: 'EV: 14.89 • Draw 1', payout: 14.89, source: 'wizardofodds.com' };
      }
    }
    // 4 to SF with specific patterns (WoO: deuces + 45/56/57/67/68/78/79/89/8T/9T/9J)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 2) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 2) {
          const span = vals[vals.length - 1] - vals[0];
          // Good SF draws: span <= 2 means consecutive or 1 gap
          if (span <= 2 && vals[0] >= 4 && vals[1] <= 11) {
            return { hold: [...deuceIndices, ...indices.slice(0, 2)], name: '4 to SF', reason: 'EV: ~2.5 • Draw 1', payout: 2.5, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // BDW RULE: 2 Deuces + Ace = Hold the ace
    if (hasAce) {
      return { hold: [...deuceIndices, ...aceIndices], name: '2 Deuces + Ace', reason: 'EV: ~3.2 • Better than 2 deuces alone', payout: 3.2, source: 'wizardofodds.com' };
    }
    return { hold: deuceIndices, name: '2 Deuces', reason: 'EV: 3.07 • Draw for Quads+', payout: 3.07, source: 'wizardofodds.com' };
  }
  
  // === 1 DEUCE ===
  if (deuceCount === 1) {
    const deuceIdx = deuceIndices[0];
    
    // Check for wild royal (1 deuce + 4 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length === 4) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 25.00 • Keep it!', payout: 25, source: 'wizardofodds.com' };
      }
    }
    // Check for 5 of a kind (deuce + quads)
    if (quadsArr.length > 0) {
      const quadRank = quadsArr[0][0];
      if (quadRank === 'A') {
        return { hold: [0,1,2,3,4], name: 'Five Aces', reason: 'EV: 80.00 • BDW Bonus!', payout: 80, source: 'wizardofodds.com' };
      }
      if (['3', '4', '5'].includes(quadRank)) {
        return { hold: [0,1,2,3,4], name: 'Five 3-5s', reason: 'EV: 40.00 • BDW Bonus!', payout: 40, source: 'wizardofodds.com' };
      }
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 20.00', payout: 20, source: 'wizardofodds.com' };
    }
    // Check for straight flush
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 4) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 4) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 13.00 • Keep it!', payout: 13, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // 4 of a kind (deuce + trips)
    if (tripsArr.length > 0) {
      const tripRank = tripsArr[0][0];
      const tripIndices = tripsArr[0][1];
      // Special ranking for 3-5s and Aces in BDW
      if (tripRank === 'A') {
        return { hold: [...deuceIndices, ...tripIndices], name: 'Four Aces', reason: 'EV: ~8 • Draw 1 for 5 Aces (80)!', payout: 8, source: 'wizardofodds.com' };
      }
      if (['3', '4', '5'].includes(tripRank)) {
        return { hold: [...deuceIndices, ...tripIndices], name: 'Four 3-5s', reason: 'EV: ~6 • Draw 1 for Five 3-5s (40)!', payout: 6, source: 'wizardofodds.com' };
      }
      return { hold: [...deuceIndices, ...tripIndices], name: 'Four of a Kind', reason: 'EV: ~5 • Draw 1 for 5K', payout: 5, source: 'wizardofodds.com' };
    }
    // 4 to wild royal
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [deuceIdx, ...royalInSuit.slice(0, 3)], name: '4 to Wild Royal', reason: 'EV: 3.40 • Draw 1', payout: 3.40, source: 'wizardofodds.com' };
      }
    }
    // Full house (deuce + 2 pairs)
    if (pairsArr.length >= 2) {
      return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 3.00 • Keep it!', payout: 3, source: 'wizardofodds.com' };
    }
    // Flush
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 4) {
        return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 3.00 • Keep it!', payout: 3, source: 'wizardofodds.com' };
      }
    }
    // 4 to SF (1 deuce + 3 suited)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [deuceIdx, ...indices.slice(0, 3)], name: '4 to Straight Flush', reason: 'EV: ~2 • Draw 1', payout: 2, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // BDW: Pair rankings - Aces > 3/4/5 > 6-K
    // Check for 3K (deuce + pair)
    if (pairsArr.length > 0) {
      // Find best pair: prioritize Aces, then 3-5s
      let bestPair = pairsArr[0];
      for (const pair of pairsArr) {
        if (pair[0] === 'A') { bestPair = pair; break; }
        if (['3', '4', '5'].includes(pair[0]) && bestPair[0] !== 'A') { bestPair = pair; }
      }
      const pairRank = bestPair[0];
      const pairIndices = bestPair[1];
      if (pairRank === 'A') {
        return { hold: [...deuceIndices, ...pairIndices], name: 'Three Aces', reason: 'EV: ~1.8 • BDW: Drawing for 5 Aces!', payout: 1.8, source: 'wizardofodds.com' };
      }
      if (['3', '4', '5'].includes(pairRank)) {
        return { hold: [...deuceIndices, ...pairIndices], name: 'Three 3-5s', reason: 'EV: ~1.6 • BDW: Drawing for Five 3-5s!', payout: 1.6, source: 'wizardofodds.com' };
      }
      return { hold: [...deuceIndices, ...pairIndices], name: 'Three of a Kind', reason: 'EV: ~1.5 • Draw 2', payout: 1.5, source: 'wizardofodds.com' };
    }
    // 3 to wild royal (1 deuce + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        const royalRanksHeld = royalInSuit.map(i => cards[i].rank);
        // Better draws: TJ, TQ rank higher than TA/JA/QA/KA
        if (royalRanksHeld.includes('10') && (royalRanksHeld.includes('J') || royalRanksHeld.includes('Q'))) {
          return { hold: [deuceIdx, ...royalInSuit.slice(0, 2)], name: '3 to Wild Royal', reason: 'EV: ~1.2 • Draw 2', payout: 1.2, source: 'wizardofodds.com' };
        }
        return { hold: [deuceIdx, ...royalInSuit.slice(0, 2)], name: '3 to Wild Royal', reason: 'EV: ~1.1 • Draw 2', payout: 1.1, source: 'wizardofodds.com' };
      }
    }
    // Straight check
    const nonDeuceVals = nonDeuceCards.map(c => WOO_RANK_VALUES_DW[c.rank]).filter(v => v);
    const uniqueVals = [...new Set(nonDeuceVals)].sort((a,b) => a-b);
    if (uniqueVals.length === 4 && uniqueVals[3] - uniqueVals[0] <= 4) {
      return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 1.00 • Keep it!', payout: 1, source: 'wizardofodds.com' };
    }
    // 3 to SF with good connectors
    for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
      if (indices.length >= 2) {
        const vals = indices.map(i => WOO_RANK_VALUES_DW[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 2) {
          const span = vals[vals.length - 1] - vals[0];
          // Good SF connectors: 67, 78, 89, 9T per WoO
          if (span <= 1 && vals[0] >= 6 && vals[1] <= 10) {
            return { hold: [deuceIdx, ...indices.slice(0, 2)], name: '3 to SF', reason: 'EV: ~0.9 • Draw 2', payout: 0.9, source: 'wizardofodds.com' };
          }
        }
      }
    }
    return { hold: deuceIndices, name: '1 Deuce', reason: 'EV: 1.01 • Draw 4', payout: 1.01, source: 'wizardofodds.com' };
  }
  
  // === 0 DEUCES ===
  const analysis = analyzeHandForWoO(cards);
  if (analysis.isRoyalFlush) return { hold: [0,1,2,3,4], name: 'Natural Royal', reason: 'EV: 800.00 • Jackpot!', payout: 800, source: 'wizardofodds.com' };
  if (analysis.fourToRoyal) return { hold: analysis.fourToRoyal.indices, name: '4 to Royal', reason: 'EV: 19.83 • WoO Optimal', payout: 19.83, source: 'wizardofodds.com' };
  if (analysis.isStraightFlush) return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 13.00 • Keep it!', payout: 13, source: 'wizardofodds.com' };
  if (analysis.is4K) return { hold: [0,1,2,3,4], name: 'Four of a Kind', reason: 'EV: 4.00', payout: 4, source: 'wizardofodds.com' };
  if (analysis.isFullHouse) return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 3.00', payout: 3, source: 'wizardofodds.com' };
  if (analysis.isFlush) return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 3.00', payout: 3, source: 'wizardofodds.com' };
  if (analysis.trips) {
    // BDW: Trips of Aces or 3-5s are more valuable
    const tripRank = tripsArr[0]?.[0];
    if (tripRank === 'A') {
      return { hold: analysis.trips.indices, name: 'Three Aces', reason: 'EV: ~1.5 • Drawing for 5 Aces!', payout: 1.5, source: 'wizardofodds.com' };
    }
    return { hold: analysis.trips.indices, name: 'Three of a Kind', reason: 'EV: ~1.0 • Draw 2', payout: 1.0, source: 'wizardofodds.com' };
  }
  if (analysis.fourToSF) return { hold: analysis.fourToSF.indices, name: '4 to SF', reason: 'EV: 1.22 • WoO Optimal', payout: 1.22, source: 'wizardofodds.com' };
  if (analysis.threeToRoyal) return { hold: analysis.threeToRoyal.indices, name: '3 to Royal', reason: 'EV: 1.30 • WoO Optimal', payout: 1.30, source: 'wizardofodds.com' };
  if (analysis.isStraight) return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 1.00', payout: 1, source: 'wizardofodds.com' };
  if (analysis.fourToFlush) return { hold: analysis.fourToFlush.indices, name: '4 to Flush', reason: 'EV: 0.51', payout: 0.51, source: 'wizardofodds.com' };
  
  // BDW: Pair of Aces ranks highest, then 3/4/5, then 6-K
  if (pairsArr.length > 0) {
    // Sort pairs by BDW value
    const sortedPairs = [...pairsArr].sort((a, b) => {
      if (a[0] === 'A') return -1;
      if (b[0] === 'A') return 1;
      if (['3', '4', '5'].includes(a[0]) && !['3', '4', '5'].includes(b[0])) return -1;
      if (['3', '4', '5'].includes(b[0]) && !['3', '4', '5'].includes(a[0])) return 1;
      return 0;
    });
    const bestPair = sortedPairs[0];
    const pairRank = bestPair[0];
    if (pairRank === 'A') {
      return { hold: bestPair[1], name: 'Pair of Aces', reason: 'EV: ~0.65 • BDW: Best pair!', payout: 0.65, source: 'wizardofodds.com' };
    }
    if (['3', '4', '5'].includes(pairRank)) {
      return { hold: bestPair[1], name: 'Pair of 3-5s', reason: 'EV: ~0.60 • BDW: Better than 6-K!', payout: 0.60, source: 'wizardofodds.com' };
    }
    return { hold: bestPair[1], name: 'Pair', reason: 'EV: ~0.55 • WoO Optimal', payout: 0.55, source: 'wizardofodds.com' };
  }
  
  // 3 to SF (with good connectors)
  if (analysis.threeToSF1 || analysis.threeToSF2) {
    const sf = analysis.threeToSF1 || analysis.threeToSF2;
    return { hold: sf.indices, name: '3 to SF', reason: 'EV: 0.45', payout: 0.45, source: 'wizardofodds.com' };
  }
  
  // 2 to Royal (TJ, TQ, JQ, TK, JK, QK)
  for (const [suit, indices] of Object.entries(nonDeuceSuitCounts)) {
    const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
    if (royalInSuit.length >= 2) {
      const royalRanksHeld = royalInSuit.map(i => cards[i].rank).sort();
      // TJ and TQ are best 2-royal draws
      if (royalRanksHeld.includes('10') && (royalRanksHeld.includes('J') || royalRanksHeld.includes('Q'))) {
        return { hold: royalInSuit.slice(0, 2), name: '2 to Royal', reason: 'EV: ~0.42 • Draw 3', payout: 0.42, source: 'wizardofodds.com' };
      }
      return { hold: royalInSuit.slice(0, 2), name: '2 to Royal', reason: 'EV: ~0.40 • Draw 3', payout: 0.40, source: 'wizardofodds.com' };
    }
  }
  
  return { hold: [], name: 'Discard All', reason: 'EV: 0.32 • Draw 5', payout: 0.32, source: 'wizardofodds.com' };
};

// ============================================
// LOOSE DEUCES WoO Strategy (17/10 Full Pay)
// Return: 101.60%
// Source: https://wizardofodds.com/games/video-poker/tables/loose-deuces/
// Key difference from regular DW: 4 Deuces pays 500!
// Strategy is nearly identical to Full-Pay Deuces Wild
// ============================================
const getLooseDeucesWoORecommendation = (cards, payTable) => {
  // Loose Deuces has VERY different strategy due to 4 deuces paying 500!
  // Key difference: With 3 deuces, ALWAYS hold just deuces (no exceptions!)
  // In regular DW you'd keep wild royal/5K, but in LD the 4D payout is too high
  
  const deuceIndices = cards.map((c, i) => c.rank === '2' ? i : -1).filter(i => i >= 0);
  const deuceCount = deuceIndices.length;
  
  // 4 deuces - keep all!
  if (deuceCount === 4) {
    return { hold: [0,1,2,3,4], name: 'Four Deuces', reason: 'EV: 500.00 • Loose Deuces Jackpot!', payout: 500, source: 'wizardofodds.com' };
  }
  
  // 3 deuces - ALWAYS hold just deuces, dump everything else!
  // This is the KEY difference from regular Deuces Wild
  // Wild Royal (25) and 5K (15) are sacrificed to chase 4D (500)
  if (deuceCount === 3) {
    return { hold: deuceIndices, name: '3 Deuces', reason: 'EV: ~21 • Draw for 4 Deuces (500)!', payout: 21, source: 'wizardofodds.com' };
  }
  
  // For 0-2 deuces, use regular DW strategy with adjusted payouts
  const result = getDeucesWildWoORecommendation(cards, payTable);
  
  // Adjust messaging for Loose Deuces specific payouts
  if (result.name === 'Four Deuces') {
    result.reason = 'EV: 500.00 • Loose Deuces Jackpot!';
    result.payout = 500;
  }
  if (result.name === 'Five of a Kind') {
    result.reason = 'EV: 15.00 • Keep it!';
    result.payout = 15;
  }
  if (result.name === 'Straight Flush') {
    result.reason = 'EV: 8.00 • Keep it!';
    result.payout = 8;
  }
  
  return result;
};

// ============================================
// JOKER POKER KINGS OR BETTER WoO Strategy
// Return: 100.64% (20/7/5 Full Pay)
// 53-card deck with 1 Joker wild
// Min paying hand: Kings or Better
// ============================================
const getJokerPokerKingsWoORecommendation = (cards, payTable) => {
  const hasJoker = cards.some(c => c.rank === 'JOKER' || c.isJoker);
  const jokerIndices = cards.map((c, i) => (c.rank === 'JOKER' || c.isJoker) ? i : -1).filter(i => i >= 0);
  const nonJokerCards = cards.filter(c => c.rank !== 'JOKER' && !c.isJoker);
  const nonJokerIndices = cards.map((c, i) => (c.rank !== 'JOKER' && !c.isJoker) ? i : -1).filter(i => i >= 0);
  
  // Rank counts for non-joker cards
  const rankCounts = {};
  cards.forEach((c, i) => { 
    if (c.rank !== 'JOKER' && !c.isJoker) {
      if (!rankCounts[c.rank]) rankCounts[c.rank] = []; 
      rankCounts[c.rank].push(i); 
    }
  });
  
  const pairsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 2);
  const tripsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 3);
  const quadsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 4);
  
  // Suit counts for non-joker cards
  const nonJokerSuitCounts = {};
  nonJokerCards.forEach(c => {
    const actualIdx = cards.indexOf(c);
    if (!nonJokerSuitCounts[c.suit]) nonJokerSuitCounts[c.suit] = [];
    nonJokerSuitCounts[c.suit].push(actualIdx);
  });
  
  const royalRanks = ['10', 'J', 'Q', 'K', 'A'];
  const WOO_RANK_VALUES = { '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  
  // === WITH JOKER ===
  if (hasJoker) {
    const jokerIdx = jokerIndices[0];
    
    // Natural Royal is impossible with joker, check for Wild Royal
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length === 4) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 100.00 • Keep it!', payout: 100, source: 'wizardofodds.com' };
      }
    }
    // Five of a Kind (joker + quads)
    if (quadsArr.length > 0) {
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 200.00 • Keep it!', payout: 200, source: 'wizardofodds.com' };
    }
    // Straight Flush (joker + 4 SF cards)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 4) {
        const vals = indices.map(i => WOO_RANK_VALUES[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 4) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 50.00 • Keep it!', payout: 50, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Four of a Kind (joker + trips)
    if (tripsArr.length > 0) {
      const tripIndices = tripsArr[0][1];
      return { hold: [...jokerIndices, ...tripIndices], name: 'Four of a Kind', reason: 'EV: 20.00 • Draw 1 for 5K', payout: 20, source: 'wizardofodds.com' };
    }
    // 4 to Wild Royal (joker + 3 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [jokerIdx, ...royalInSuit.slice(0, 3)], name: '4 to Wild Royal', reason: 'EV: ~12 • Draw 1', payout: 12, source: 'wizardofodds.com' };
      }
    }
    // Full House (joker + 2 pairs)
    if (pairsArr.length >= 2) {
      return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 7.00 • Keep it!', payout: 7, source: 'wizardofodds.com' };
    }
    // Flush (joker + 4 suited)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 4) {
        return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 5.00 • Keep it!', payout: 5, source: 'wizardofodds.com' };
      }
    }
    // 4 to Straight Flush (joker + 3 SF cards)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [jokerIdx, ...indices.slice(0, 3)], name: '4 to SF', reason: 'EV: ~6 • Draw 1', payout: 6, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Straight (joker + 4 straight cards)
    const nonJokerVals = nonJokerCards.map(c => WOO_RANK_VALUES[c.rank]).filter(v => v);
    const uniqueVals = [...new Set(nonJokerVals)].sort((a,b) => a-b);
    if (uniqueVals.length === 4 && uniqueVals[3] - uniqueVals[0] <= 4) {
      return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 3.00 • Keep it!', payout: 3, source: 'wizardofodds.com' };
    }
    // Three of a Kind (joker + pair)
    if (pairsArr.length > 0) {
      const pairIndices = pairsArr[0][1];
      return { hold: [...jokerIndices, ...pairIndices], name: 'Three of a Kind', reason: 'EV: 2.00 • Draw 2', payout: 2, source: 'wizardofodds.com' };
    }
    // 3 to Wild Royal (joker + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [jokerIdx, ...royalInSuit.slice(0, 2)], name: '3 to Wild Royal', reason: 'EV: ~1.5 • Draw 2', payout: 1.5, source: 'wizardofodds.com' };
      }
    }
    // 4 to Flush (joker + 3 suited)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 3) {
        return { hold: [jokerIdx, ...indices.slice(0, 3)], name: '4 to Flush', reason: 'EV: ~1.0 • Draw 1', payout: 1.0, source: 'wizardofodds.com' };
      }
    }
    // Pair of Kings or Aces (joker + K or A)
    const kingsAces = nonJokerIndices.filter(i => cards[i].rank === 'K' || cards[i].rank === 'A');
    if (kingsAces.length > 0) {
      return { hold: [jokerIdx, kingsAces[0]], name: 'Pair K/A', reason: 'EV: 1.00 • Kings or Better', payout: 1, source: 'wizardofodds.com' };
    }
    // Just the joker
    return { hold: jokerIndices, name: 'Joker Only', reason: 'EV: ~0.8 • Draw 4', payout: 0.8, source: 'wizardofodds.com' };
  }
  
  // === NO JOKER ===
  const analysis = analyzeHandForWoO(cards);
  
  // Natural Royal
  if (analysis.isRoyalFlush) return { hold: [0,1,2,3,4], name: 'Natural Royal', reason: 'EV: 800.00 • Jackpot!', payout: 800, source: 'wizardofodds.com' };
  // 4 to Royal
  if (analysis.fourToRoyal) return { hold: analysis.fourToRoyal.indices, name: '4 to Royal', reason: 'EV: ~19 • Draw 1', payout: 19, source: 'wizardofodds.com' };
  // Straight Flush
  if (analysis.isStraightFlush) return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 50.00', payout: 50, source: 'wizardofodds.com' };
  // Four of a Kind
  if (analysis.is4K) return { hold: [0,1,2,3,4], name: 'Four of a Kind', reason: 'EV: 20.00', payout: 20, source: 'wizardofodds.com' };
  // 4 to SF
  if (analysis.fourToSF) return { hold: analysis.fourToSF.indices, name: '4 to SF', reason: 'EV: ~3.5 • Draw 1', payout: 3.5, source: 'wizardofodds.com' };
  // Full House
  if (analysis.isFullHouse) return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 7.00', payout: 7, source: 'wizardofodds.com' };
  // Flush
  if (analysis.isFlush) return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 5.00', payout: 5, source: 'wizardofodds.com' };
  // Straight
  if (analysis.isStraight) return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 3.00', payout: 3, source: 'wizardofodds.com' };
  // Three of a Kind
  if (analysis.trips) return { hold: analysis.trips.indices, name: 'Three of a Kind', reason: 'EV: 2.00 • Draw 2', payout: 2, source: 'wizardofodds.com' };
  // 3 to Royal
  if (analysis.threeToRoyal) return { hold: analysis.threeToRoyal.indices, name: '3 to Royal', reason: 'EV: ~1.4 • Draw 2', payout: 1.4, source: 'wizardofodds.com' };
  // Two Pair
  if (analysis.twoPair) return { hold: analysis.twoPair.indices, name: 'Two Pair', reason: 'EV: 1.00', payout: 1, source: 'wizardofodds.com' };
  // Pair of Kings or Aces
  if (rankCounts['K']?.length === 2) {
    return { hold: rankCounts['K'], name: 'Pair of Kings', reason: 'EV: 1.00 • Kings or Better', payout: 1, source: 'wizardofodds.com' };
  }
  if (rankCounts['A']?.length === 2) {
    return { hold: rankCounts['A'], name: 'Pair of Aces', reason: 'EV: 1.00 • Aces pay!', payout: 1, source: 'wizardofodds.com' };
  }
  // 3 to SF (good connectors)
  if (analysis.threeToSF1 || analysis.threeToSF2) {
    const sf = analysis.threeToSF1 || analysis.threeToSF2;
    return { hold: sf.indices, name: '3 to SF', reason: 'EV: ~0.7 • Draw 2', payout: 0.7, source: 'wizardofodds.com' };
  }
  // Low Pair (doesn't pay but has draw value)
  if (analysis.lowPair) return { hold: analysis.lowPair.indices, name: 'Low Pair', reason: 'EV: ~0.6 • Draw 3', payout: 0.6, source: 'wizardofodds.com' };
  // 4 to Flush
  if (analysis.fourToFlush) return { hold: analysis.fourToFlush.indices, name: '4 to Flush', reason: 'EV: ~0.77 • Draw 1', payout: 0.77, source: 'wizardofodds.com' };
  // 4 to Outside Straight
  if (analysis.fourToOutside) return { hold: analysis.fourToOutside.indices, name: '4 to Straight', reason: 'EV: ~0.6 • Draw 1', payout: 0.6, source: 'wizardofodds.com' };
  // Single K or A
  const singleK = nonJokerIndices.find(i => cards[i].rank === 'K');
  const singleA = nonJokerIndices.find(i => cards[i].rank === 'A');
  if (singleK !== undefined) return { hold: [singleK], name: 'Single King', reason: 'EV: ~0.45 • Draw 4', payout: 0.45, source: 'wizardofodds.com' };
  if (singleA !== undefined) return { hold: [singleA], name: 'Single Ace', reason: 'EV: ~0.45 • Draw 4', payout: 0.45, source: 'wizardofodds.com' };
  
  return { hold: [], name: 'Discard All', reason: 'EV: ~0.4 • Draw 5', payout: 0.4, source: 'wizardofodds.com' };
};

// ============================================
// JOKER POKER TWO PAIR OR BETTER WoO Strategy
// Return: 99.92% (20/8/5 Full Pay)
// 53-card deck with 1 Joker wild
// Min paying hand: Two Pair (NO PAIRS PAY!)
// ============================================
const getJokerPokerTwoPairWoORecommendation = (cards, payTable) => {
  const hasJoker = cards.some(c => c.rank === 'JOKER' || c.isJoker);
  const jokerIndices = cards.map((c, i) => (c.rank === 'JOKER' || c.isJoker) ? i : -1).filter(i => i >= 0);
  const nonJokerCards = cards.filter(c => c.rank !== 'JOKER' && !c.isJoker);
  const nonJokerIndices = cards.map((c, i) => (c.rank !== 'JOKER' && !c.isJoker) ? i : -1).filter(i => i >= 0);
  
  // Rank counts for non-joker cards
  const rankCounts = {};
  cards.forEach((c, i) => { 
    if (c.rank !== 'JOKER' && !c.isJoker) {
      if (!rankCounts[c.rank]) rankCounts[c.rank] = []; 
      rankCounts[c.rank].push(i); 
    }
  });
  
  const pairsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 2);
  const tripsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 3);
  const quadsArr = Object.entries(rankCounts).filter(([r, arr]) => arr.length === 4);
  
  // Suit counts for non-joker cards
  const nonJokerSuitCounts = {};
  nonJokerCards.forEach(c => {
    const actualIdx = cards.indexOf(c);
    if (!nonJokerSuitCounts[c.suit]) nonJokerSuitCounts[c.suit] = [];
    nonJokerSuitCounts[c.suit].push(actualIdx);
  });
  
  const royalRanks = ['10', 'J', 'Q', 'K', 'A'];
  const WOO_RANK_VALUES = { '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  
  // === WITH JOKER ===
  if (hasJoker) {
    const jokerIdx = jokerIndices[0];
    
    // Wild Royal (joker + 4 royal cards)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length === 4) {
        return { hold: [0,1,2,3,4], name: 'Wild Royal', reason: 'EV: 50.00 • Keep it!', payout: 50, source: 'wizardofodds.com' };
      }
    }
    // Five of a Kind (joker + quads)
    if (quadsArr.length > 0) {
      return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'EV: 100.00 • Keep it!', payout: 100, source: 'wizardofodds.com' };
    }
    // Straight Flush (joker + 4 SF cards)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 4) {
        const vals = indices.map(i => WOO_RANK_VALUES[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 4) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 50.00 • Keep it!', payout: 50, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Four of a Kind (joker + trips)
    if (tripsArr.length > 0) {
      const tripIndices = tripsArr[0][1];
      return { hold: [...jokerIndices, ...tripIndices], name: 'Four of a Kind', reason: 'EV: 20.00 • Draw 1 for 5K', payout: 20, source: 'wizardofodds.com' };
    }
    // 4 to Wild Royal (joker + 3 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 3) {
        return { hold: [jokerIdx, ...royalInSuit.slice(0, 3)], name: '4 to Wild Royal', reason: 'EV: ~6.5 • Draw 1', payout: 6.5, source: 'wizardofodds.com' };
      }
    }
    // Full House (joker + 2 pairs)
    if (pairsArr.length >= 2) {
      return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 10.00 • Keep it!', payout: 10, source: 'wizardofodds.com' };
    }
    // Flush (joker + 4 suited)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 4) {
        return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 6.00 • Keep it!', payout: 6, source: 'wizardofodds.com' };
      }
    }
    // 4 to Straight Flush (joker + 3 SF cards)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 3) {
        const vals = indices.map(i => WOO_RANK_VALUES[cards[i].rank]).filter(v => v).sort((a,b) => a-b);
        if (vals.length >= 3) {
          const span = vals[vals.length - 1] - vals[0];
          if (span <= 4) {
            return { hold: [jokerIdx, ...indices.slice(0, 3)], name: '4 to SF', reason: 'EV: ~5 • Draw 1', payout: 5, source: 'wizardofodds.com' };
          }
        }
      }
    }
    // Straight (joker + 4 straight cards)
    const nonJokerVals = nonJokerCards.map(c => WOO_RANK_VALUES[c.rank]).filter(v => v);
    const uniqueVals = [...new Set(nonJokerVals)].sort((a,b) => a-b);
    if (uniqueVals.length === 4 && uniqueVals[3] - uniqueVals[0] <= 4) {
      return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 5.00 • Keep it!', payout: 5, source: 'wizardofodds.com' };
    }
    // Three of a Kind (joker + pair)
    if (pairsArr.length > 0) {
      const pairIndices = pairsArr[0][1];
      return { hold: [...jokerIndices, ...pairIndices], name: 'Three of a Kind', reason: 'EV: 2.00 • Draw 2', payout: 2, source: 'wizardofodds.com' };
    }
    // 4 to Flush (joker + 3 suited)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      if (indices.length >= 3) {
        return { hold: [jokerIdx, ...indices.slice(0, 3)], name: '4 to Flush', reason: 'EV: ~1.5 • Draw 1', payout: 1.5, source: 'wizardofodds.com' };
      }
    }
    // 3 to Wild Royal (joker + 2 royal cards same suit)
    for (const [suit, indices] of Object.entries(nonJokerSuitCounts)) {
      const royalInSuit = indices.filter(i => royalRanks.includes(cards[i].rank));
      if (royalInSuit.length >= 2) {
        return { hold: [jokerIdx, ...royalInSuit.slice(0, 2)], name: '3 to Wild Royal', reason: 'EV: ~1.3 • Draw 2', payout: 1.3, source: 'wizardofodds.com' };
      }
    }
    // 4 to Straight (joker + 3 straight cards)
    // Just the joker
    return { hold: jokerIndices, name: 'Joker Only', reason: 'EV: ~0.7 • Draw 4', payout: 0.7, source: 'wizardofodds.com' };
  }
  
  // === NO JOKER - TWO PAIR MINIMUM ===
  // Key difference: NO PAIRS PAY, only Two Pair or better!
  const analysis = analyzeHandForWoO(cards);
  
  // Natural Royal
  if (analysis.isRoyalFlush) return { hold: [0,1,2,3,4], name: 'Natural Royal', reason: 'EV: 1000.00 • Jackpot!', payout: 1000, source: 'wizardofodds.com' };
  // 4 to Royal
  if (analysis.fourToRoyal) return { hold: analysis.fourToRoyal.indices, name: '4 to Royal', reason: 'EV: ~23 • Draw 1', payout: 23, source: 'wizardofodds.com' };
  // Straight Flush
  if (analysis.isStraightFlush) return { hold: [0,1,2,3,4], name: 'Straight Flush', reason: 'EV: 50.00', payout: 50, source: 'wizardofodds.com' };
  // Four of a Kind
  if (analysis.is4K) return { hold: [0,1,2,3,4], name: 'Four of a Kind', reason: 'EV: 20.00', payout: 20, source: 'wizardofodds.com' };
  // Full House
  if (analysis.isFullHouse) return { hold: [0,1,2,3,4], name: 'Full House', reason: 'EV: 10.00', payout: 10, source: 'wizardofodds.com' };
  // 4 to SF
  if (analysis.fourToSF) return { hold: analysis.fourToSF.indices, name: '4 to SF', reason: 'EV: ~5 • Draw 1', payout: 5, source: 'wizardofodds.com' };
  // Flush
  if (analysis.isFlush) return { hold: [0,1,2,3,4], name: 'Flush', reason: 'EV: 6.00', payout: 6, source: 'wizardofodds.com' };
  // Straight
  if (analysis.isStraight) return { hold: [0,1,2,3,4], name: 'Straight', reason: 'EV: 5.00', payout: 5, source: 'wizardofodds.com' };
  // Three of a Kind
  if (analysis.trips) return { hold: analysis.trips.indices, name: 'Three of a Kind', reason: 'EV: 2.00 • Draw 2', payout: 2, source: 'wizardofodds.com' };
  // 3 to Royal
  if (analysis.threeToRoyal) return { hold: analysis.threeToRoyal.indices, name: '3 to Royal', reason: 'EV: ~1.4 • Draw 2', payout: 1.4, source: 'wizardofodds.com' };
  // Two Pair - THIS IS THE MINIMUM PAYING HAND!
  if (analysis.twoPair) return { hold: analysis.twoPair.indices, name: 'Two Pair', reason: 'EV: 1.00 • Min paying hand!', payout: 1, source: 'wizardofodds.com' };
  // 4 to Flush - ranked higher since pairs don't pay
  if (analysis.fourToFlush) return { hold: analysis.fourToFlush.indices, name: '4 to Flush', reason: 'EV: ~0.95 • Draw 1', payout: 0.95, source: 'wizardofodds.com' };
  // 3 to SF
  if (analysis.threeToSF1 || analysis.threeToSF2) {
    const sf = analysis.threeToSF1 || analysis.threeToSF2;
    return { hold: sf.indices, name: '3 to SF', reason: 'EV: ~0.8 • Draw 2', payout: 0.8, source: 'wizardofodds.com' };
  }
  // 4 to Outside Straight
  if (analysis.fourToOutside) return { hold: analysis.fourToOutside.indices, name: '4 to Straight', reason: 'EV: ~0.7 • Draw 1', payout: 0.7, source: 'wizardofodds.com' };
  // Pair - does NOT pay! But still better than nothing for trips potential
  if (analysis.highPair || analysis.lowPair) {
    const pair = analysis.highPair || analysis.lowPair;
    return { hold: pair.indices, name: 'Pair (no pay)', reason: 'EV: ~0.5 • Draw 3 for 2P/Trips', payout: 0.5, source: 'wizardofodds.com' };
  }
  // 3 to SF type 3
  if (analysis.threeToSF3) {
    return { hold: analysis.threeToSF3.indices, name: '3 to SF', reason: 'EV: ~0.45 • Draw 2', payout: 0.45, source: 'wizardofodds.com' };
  }
  
  return { hold: [], name: 'Discard All', reason: 'EV: ~0.4 • Draw 5', payout: 0.4, source: 'wizardofodds.com' };
};

// ============================================
// END WoO STRATEGY ENGINE
// ============================================

// JoB Strategy engine based on optimal play (LEGACY - keeping for comparison)
// payTable parameter allows for future strategy adjustments based on pay table
// Strategy recommendation engine - works for JoB-family games
// Different bonus games have nuances, but core strategy is similar
const getStrategyRecommendation = (cards, payTable = null, gameType = 'jacks-or-better') => {
  if (!cards || cards.length !== 5 || cards.some(c => !c)) return null;
  
  const hand = evaluateHand(cards, gameType);
  const draws = analyzeDraws(cards);
  
  // Get pay table values (default to 9/6 if not provided)
  const flushPay = payTable?.fl || 6;
  const fullHousePay = payTable?.fh || 9;
  
  // Game-specific adjustments
  const isHighFlushGame = flushPay >= 7; // TDB, some DB variants
  const isBonusGame = ['bonus-poker', 'double-bonus', 'double-double-bonus', 'triple-double-bonus'].includes(gameType);
  // Check if this is a deuces wild variant (any game where 2s are wild)
  const deucesWildGames = ['deuces-wild', 'bonus-deuces-wild', 'double-bonus-deuces-wild', 'super-bonus-deuces-wild', 'loose-deuces', 'double-deuces', 'deuces-and-joker', 'faces-n-deuces', 'acey-deucey'];
  const isDeucesWild = deucesWildGames.includes(gameType);
  
  // Deuces Wild has completely different strategy
  if (isDeucesWild) {
    const deuceCount = cards.filter(c => c.rank === '2').length;
    const deuceIndices = cards.map((c, i) => c.rank === '2' ? i : -1).filter(i => i >= 0);
    
    if (deuceCount >= 3) {
      return {
        hold: deuceIndices,
        name: `${deuceCount} Deuces`,
        reason: 'Hold only the deuces, draw for 5 of a kind',
        payout: 'Drawing for wild royal or 5K'
      };
    }
    if (deuceCount === 2) {
      const ranks = cards.map(c => c.rank);
      const rankCounts = {};
      ranks.forEach((r, i) => { if (!rankCounts[r]) rankCounts[r] = []; rankCounts[r].push(i); });
      
      // Check for trips (2 deuces + trips = 5 of a kind) - KEEP
      const tripRank = Object.keys(rankCounts).find(r => r !== '2' && rankCounts[r].length === 3);
      if (tripRank) {
        return { hold: [0,1,2,3,4], name: 'Five of a Kind', reason: 'Keep your 5 of a kind!', payout: 15 };
      }
      
      // Check if we have a wild royal (2 deuces + 3 royals of same suit)
      const nonDeuceCards = cards.filter(c => c.rank !== '2');
      const suitCounts = {};
      nonDeuceCards.forEach(c => { suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1; });
      const flushSuit = Object.keys(suitCounts).find(s => suitCounts[s] === 3);
      if (flushSuit) {
        const royalRanks = ['A', 'K', 'Q', 'J', '10'];
        const suitedCards = nonDeuceCards.filter(c => c.suit === flushSuit);
        if (suitedCards.every(c => royalRanks.includes(c.rank))) {
          return { hold: [0,1,2,3,4], name: 'Wild Royal Flush', reason: 'Keep your Wild Royal!', payout: 25 };
        }
      }
      
      // Check for a pair (which becomes quads with 2 deuces) - DRAW 1 for 5K
      const pairRank = Object.keys(rankCounts).find(r => r !== '2' && rankCounts[r].length === 2);
      if (pairRank) {
        return { 
          hold: [...rankCounts[pairRank], ...deuceIndices], 
          name: 'Quads (draw for 5K)', 
          reason: 'Draw 1 for five of a kind!', 
          payout: 'Drawing for 5K' 
        };
      }
      
      // 4 to a Royal
      if (draws.fourToRoyal) {
        return { hold: [...draws.fourToRoyal.indices], name: '4 to Royal w/ deuces', reason: 'Go for the wild royal', payout: 'Drawing for 25x' };
      }
      
      // Just hold both deuces
      return { hold: deuceIndices, name: '2 Deuces', reason: 'Hold deuces, draw 3', payout: 'Drawing for quads+' };
    }
    if (deuceCount === 1) {
      const ranks = cards.map(c => c.rank);
      const rankCounts = {};
      ranks.forEach((r, i) => { if (!rankCounts[r]) rankCounts[r] = []; rankCounts[r].push(i); });
      
      // Check for made hands first (flush or better)
      if (hand.rank <= 5) { // Flush or better
        return { hold: [0,1,2,3,4], name: hand.name, reason: 'Keep it!', payout: hand.payout };
      }
      
      // 4 to a Royal with deuce
      if (draws.fourToRoyal) {
        return { hold: [...draws.fourToRoyal.indices], name: '4 to Royal w/ deuce', reason: 'Go for the wild royal', payout: 'Drawing for 25x' };
      }
      
      // Check for pair (which becomes trips with deuce)
      const pairRank = Object.keys(rankCounts).find(r => r !== '2' && rankCounts[r].length === 2);
      if (pairRank) {
        return { 
          hold: [...rankCounts[pairRank], ...deuceIndices], 
          name: 'Trips (pair + deuce)', 
          reason: 'Hold pair + deuce for 3 of a kind', 
          payout: 'Drawing for quads+' 
        };
      }
      
      // Check for 4 to a straight flush
      if (draws.fourToStraightFlush) {
        return { hold: draws.fourToStraightFlush.indices, name: '4 to Straight Flush', reason: 'Draw for SF', payout: 'Drawing for 50x' };
      }
      
      // Check for 4 to a flush
      if (draws.fourToFlush) {
        return { hold: draws.fourToFlush.indices, name: '4 to Flush w/ deuce', reason: 'Draw for flush', payout: 'Drawing for flush' };
      }
      
      // Check for 4 to an open-ended straight
      if (draws.fourToStraight?.open) {
        return { hold: draws.fourToStraight.indices, name: '4 to Straight w/ deuce', reason: 'Draw for straight', payout: 'Drawing for straight' };
      }
      
      // Just hold the deuce
      return { hold: deuceIndices, name: '1 Deuce', reason: 'Hold deuce, draw 4', payout: 'Drawing for trips+' };
    }
    // 0 deuces - fall through to normal strategy but adjust for DW pays
  }
  
  // 1. Royal Flush and Straight Flush - always keep
  if (hand.rank <= 2) { // Royal or Straight Flush only
    return {
      hold: [0, 1, 2, 3, 4],
      name: hand.name,
      reason: `Keep your ${hand.name}!`,
      payout: hand.payout
    };
  }
  
  // 2. Four to a Royal - beats flush, straight, and even quads (EV is higher)
  // This is BEFORE other pat hands because breaking a flush for royal draw is correct
  if (draws.fourToRoyal) {
    return {
      hold: draws.fourToRoyal.indices,
      name: '4 to Royal Flush',
      reason: 'Break anything for Royal draw!',
      payout: 'Drawing for 800x'
    };
  }
  
  // 3. Pat hands - Four of a Kind through Straight
  if (hand.rank <= 6) { // Quads, Full House, Flush, Straight
    return {
      hold: [0, 1, 2, 3, 4],
      name: hand.name,
      reason: `Keep your ${hand.name}!`,
      payout: hand.payout
    };
  }
  
  // 3.5 Four to a Straight Flush - BEFORE high pair! (EV 3.53 vs 1.54)
  // Check this before trips/two pair/high pair because 4-SF beats high pair
  const suits = cards.map(c => c.suit);
  const suitCounts = {};
  suits.forEach((s, i) => {
    if (!suitCounts[s]) suitCounts[s] = [];
    suitCounts[s].push(i);
  });
  
  for (const [suit, indices] of Object.entries(suitCounts)) {
    if (indices.length >= 4) {
      const suitedCards = indices.map(i => cards[i]);
      const suitedValues = suitedCards.map(c => RANK_VALUES[c.rank]).sort((a, b) => a - b);
      // Check if these 4 cards could make a straight flush (span of 4 or less)
      const gaps = suitedValues[suitedValues.length-1] - suitedValues[0];
      if (gaps <= 4 && indices.length === 4) {
        return {
          hold: indices,
          name: '4 to Straight Flush',
          reason: '4-SF (EV 3.53) beats high pair (EV 1.54)!',
          payout: 'Drawing for 50x'
        };
      }
    }
  }
  
  // 4. Made paying hands (trips, two pair, high pair)
  if (hand.rank <= 9) { // Three of kind through Jacks+
    const holdIndices = [];
    const ranks = cards.map(c => c.rank);
    const rankCounts = {};
    ranks.forEach((r, i) => {
      if (!rankCounts[r]) rankCounts[r] = [];
      rankCounts[r].push(i);
    });
    
    if (hand.rank === 7) { // Trips
      const tripRank = Object.keys(rankCounts).find(r => rankCounts[r].length === 3);
      return {
        hold: rankCounts[tripRank],
        name: 'Three of a Kind',
        reason: 'Hold the trips, draw 2',
        payout: hand.payout
      };
    }
    if (hand.rank === 8) { // Two pair
      Object.values(rankCounts).forEach(indices => {
        if (indices.length === 2) holdIndices.push(...indices);
      });
      return {
        hold: holdIndices,
        name: 'Two Pair',
        reason: 'Hold both pairs, draw 1',
        payout: hand.payout
      };
    }
    if (hand.rank === 9) { // High pair
      const pairRank = Object.keys(rankCounts).find(r => rankCounts[r].length === 2 && HIGH_CARDS.includes(r));
      return {
        hold: rankCounts[pairRank],
        name: `Pair of ${pairRank}s`,
        reason: 'Hold the high pair, draw 3',
        payout: hand.payout
      };
    }
  }
  
  // 5. Three to a Royal
  if (draws.threeToRoyal) {
    return {
      hold: draws.threeToRoyal.indices,
      name: '3 to Royal Flush',
      reason: 'Strong draw to Royal',
      payout: 'Drawing for 800x'
    };
  }
  
  // 6. Four to a Flush vs Low Pair
  // This decision is affected by pay table!
  // On standard JoB (flush=6): low pair is better
  // On high-flush games like TDB (flush=7): 4-flush is better
  if (draws.fourToFlush) {
    if (draws.lowPair) {
      // High flush pay (7+) makes 4-flush better than low pair
      if (isHighFlushGame) {
        return {
          hold: draws.fourToFlush.indices,
          name: '4 to Flush',
          reason: `4-flush beats low pair when flush pays ${flushPay}`,
          payout: `Drawing for ${flushPay}x`
        };
      }
      // Standard flush pay - low pair wins
      return {
        hold: draws.lowPair.indices,
        name: `Low Pair (${draws.lowPair.rank}s)`,
        reason: `Low pair beats 4-flush on ${fullHousePay}/${flushPay}`,
        payout: 'Drawing for trips or better'
      };
    }
    return {
      hold: draws.fourToFlush.indices,
      name: '4 to Flush',
      reason: `Draw to the Flush (pays ${flushPay}x)`,
      payout: `Drawing for ${flushPay}x`
    };
  }
  
  // 7. Low pair
  if (draws.lowPair) {
    return {
      hold: draws.lowPair.indices,
      name: `Low Pair (${draws.lowPair.rank}s)`,
      reason: 'Hold the pair, draw 3',
      payout: 'Drawing for trips or better'
    };
  }
  
  // 8. Four to a Straight (open-ended)
  // Simplified check - look for 4 consecutive values
  const values = cards.map(c => RANK_VALUES[c.rank]);
  const sortedUniqueValues = [...new Set(values)].sort((a, b) => a - b);
  if (sortedUniqueValues.length >= 4) {
    for (let i = 0; i <= sortedUniqueValues.length - 4; i++) {
      const span = sortedUniqueValues.slice(i, i + 4);
      if (span[3] - span[0] === 3) {
        const holdIndices = span.map(v => values.indexOf(v));
        return {
          hold: holdIndices,
          name: '4 to Straight',
          reason: 'Open-ended straight draw',
          payout: 'Drawing for 4x'
        };
      }
    }
  }
  
  // 9. Three to a Straight Flush
  for (const [suit, indices] of Object.entries(suitCounts)) {
    if (indices.length >= 3) {
      const suitedValues = indices.map(i => RANK_VALUES[cards[i].rank]).sort((a, b) => a - b);
      const gaps = suitedValues[suitedValues.length-1] - suitedValues[0];
      if (gaps <= 4) {
        return {
          hold: indices.slice(0, 3),
          name: '3 to Straight Flush',
          reason: 'Draw to Straight Flush',
          payout: 'Long shot for 50x'
        };
      }
    }
  }
  
  // 10. Two suited high cards
  for (const [suit, indices] of Object.entries(suitCounts)) {
    if (indices.length >= 2) {
      const highIndices = indices.filter(i => HIGH_CARDS.includes(cards[i].rank));
      if (highIndices.length >= 2) {
        return {
          hold: highIndices.slice(0, 2),
          name: '2 Suited High Cards',
          reason: 'Keep suited high cards',
          payout: 'Drawing for Royal/Flush/Pair'
        };
      }
    }
  }
  
  // 11. AKQJ unsuited (4 to broadway)
  const highCardIndices = cards.map((c, i) => ['A', 'K', 'Q', 'J'].includes(c.rank) ? i : -1).filter(i => i >= 0);
  if (highCardIndices.length === 4) {
    return {
      hold: highCardIndices,
      name: 'AKQJ (4 High Cards)',
      reason: 'Draw to Broadway straight',
      payout: 'Drawing for straight or pair'
    };
  }
  
  // 12. Any high cards
  if (draws.highCards && draws.highCards.indices.length > 0) {
    // Prefer fewer high cards (2 > 3)
    const keep = draws.highCards.indices.slice(0, Math.min(2, draws.highCards.indices.length));
    const cardNames = keep.map(i => cards[i].rank).join('-');
    return {
      hold: keep,
      name: `High Card${keep.length > 1 ? 's' : ''} (${cardNames})`,
      reason: keep.length === 1 ? 'Keep the high card, draw 4' : 'Keep high cards, draw 3',
      payout: 'Drawing for high pair'
    };
  }
  
  // 13. Nothing - draw all 5
  return {
    hold: [],
    name: 'No Hold',
    reason: 'Draw all 5 cards',
    payout: 'Starting fresh'
  };
};

// ============================================
// STRATEGY VALIDATOR - Test Suite
// ============================================
// Helper to create card objects from shorthand notation
const parseCard = (str) => {
  // Handle formats like "A♠", "As", "A-s", "10h", "10♥"
  const suitMap = {
    's': '♠', 'S': '♠', '♠': '♠',
    'h': '♥', 'H': '♥', '♥': '♥',
    'd': '♦', 'D': '♦', '♦': '♦',
    'c': '♣', 'C': '♣', '♣': '♣'
  };
  const colorMap = { '♠': 'text-black', '♣': 'text-black', '♥': 'text-red-500', '♦': 'text-red-500' };
  
  // Extract rank and suit
  let rank, suit;
  if (str.length === 2) {
    rank = str[0];
    suit = suitMap[str[1]];
  } else if (str.length === 3) {
    rank = str.slice(0, 2); // "10"
    suit = suitMap[str[2]];
  } else {
    // Handle unicode suits
    const suitChar = str.slice(-1);
    rank = str.slice(0, -1);
    suit = suitMap[suitChar] || suitChar;
  }
  
  return { rank, suit, color: colorMap[suit] || 'text-black' };
};

const parseHand = (handStr) => handStr.split(' ').map(parseCard);

export { PAY_TABLE_STRATEGIES, STRATEGY_HIERARCHIES, WOO_RANK_VALUES, WOO_HIGH_CARDS, analyzeHandForWoO, getWoOStrategyRecommendation, getDeucesWildWoORecommendation, getJokerPokerWoORecommendation, getBonusDeucesWildWoORecommendation, getLooseDeucesWoORecommendation, getJokerPokerKingsWoORecommendation };
