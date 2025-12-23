// Video Poker Games Database for Hit Seeker
// Reference: VPFree2.com & WizardOfOdds.com

// VP Game Categories
const vpCategories = {
  'standard': { name: 'Standard Games', description: 'Classic video poker variants' },
  'bonus': { name: 'Bonus Poker Family', description: 'Enhanced payouts for four of a kind' },
  'wild': { name: 'Wild Card Games', description: 'Games with wild cards (Deuces, Jokers)' },
  'ultimate-x': { name: 'Ultimate X Family', description: 'Multiplier-based games' },
  'multi-play': { name: 'Multi-Play & Multi-Strike', description: 'Multiple hands or levels' },
  'wheel': { name: 'Wheel Bonus Games', description: 'Games with wheel bonus features' },
  'specialty': { name: 'Specialty Games', description: 'Unique mechanics and variants' },
};

const vpGames = {
  // ============================================
  // STANDARD GAMES
  // ============================================
  'jacks-or-better': {
    id: 'jacks-or-better',
    name: 'Jacks or Better',
    shortName: 'JoB',
    category: 'standard',
    description: 'The classic. Pair of Jacks or better to win.',
    popularity: 100,
    payTables: [
      { id: '9-6', label: '9/6 Full Pay', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 98.45, rating: 'OK' },
      { id: '8-6', label: '8/6', fh: 8, fl: 6, return: 98.39, rating: 'OK' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.30, rating: 'AVOID' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 96.15, rating: 'AVOID' },
      { id: '6-5', label: '6/5', fh: 6, fl: 5, return: 95.00, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Hold any paying hand (pair J+ through Royal)' },
      { priority: 2, rule: '4 to a Royal > anything except pat SF/Royal' },
      { priority: 3, rule: 'Low pair > 4 to a Flush on standard pay' },
      { priority: 4, rule: 'Never hold a kicker' },
    ],
  },
  'tens-or-better': {
    id: 'tens-or-better',
    name: 'Tens or Better',
    shortName: 'ToB',
    category: 'standard',
    description: 'Like JoB but pair of 10s pays. Lower other payouts.',
    popularity: 60,
    payTables: [
      { id: '6-5', label: '6/5 Full Pay', fh: 6, fl: 5, return: 99.14, rating: 'HUNT' },
      { id: '5-5', label: '5/5', fh: 5, fl: 5, return: 98.01, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Tens pay! Adjust accordingly' },
      { priority: 2, rule: 'Otherwise similar to JoB' },
    ],
  },
  'all-american': {
    id: 'all-american',
    name: 'All American',
    shortName: 'AA',
    category: 'standard',
    description: 'Straight, Flush, SF all pay 8. Two pair pays 1.',
    popularity: 55,
    payTables: [
      { id: '8-8-8', label: '8/8/8 Full Pay', fh: 8, fl: 8, return: 100.72, rating: 'HUNT' },
      { id: '8-8-25', label: '8/8/25', fh: 8, fl: 8, return: 99.60, rating: 'HUNT' },
      { id: '1-1-1', label: '1/1/1 (bad)', fh: 1, fl: 1, return: 95.00, rating: 'AVOID' },
    ],
    keyLookup: 'Flush / Straight / SF payout (usually same)',
    strategyTips: [
      { priority: 1, rule: 'Flushes pay same as full house!' },
      { priority: 2, rule: 'Straights very valuable (pay 8)' },
      { priority: 3, rule: 'Two pair only pays 1' },
    ],
  },

  // ============================================
  // BONUS POKER FAMILY
  // ============================================
  'bonus-poker': {
    id: 'bonus-poker',
    name: 'Bonus Poker',
    shortName: 'BP',
    category: 'bonus',
    description: 'Like JoB but bonus payouts for quads.',
    popularity: 90,
    payTables: [
      { id: '8-5', label: '8/5 Full Pay', fh: 8, fl: 5, return: 99.17, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.01, rating: 'OK' },
      { id: '6-5', label: '6/5', fh: 6, fl: 5, return: 96.87, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Four Aces pays 80 (vs 25 in JoB)' },
      { priority: 2, rule: 'Four 2-4 pays 40' },
      { priority: 3, rule: 'Strategy similar to JoB' },
    ],
  },
  'bonus-poker-deluxe': {
    id: 'bonus-poker-deluxe',
    name: 'Bonus Poker Deluxe',
    shortName: 'BPD',
    category: 'bonus',
    description: 'All quads pay 80. Two pair pays 1.',
    popularity: 70,
    payTables: [
      { id: '9-6', label: '9/6 Full Pay', fh: 9, fl: 6, return: 99.64, rating: 'HUNT' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 98.55, rating: 'OK' },
      { id: '8-6', label: '8/6', fh: 8, fl: 6, return: 98.49, rating: 'OK' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.40, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'All quads pay 80 - simpler decisions' },
      { priority: 2, rule: 'Two pair only pays 1!' },
    ],
  },
  'double-bonus': {
    id: 'double-bonus',
    name: 'Double Bonus',
    shortName: 'DB',
    category: 'bonus',
    description: 'Higher quad payouts. Four Aces pays 160.',
    popularity: 85,
    payTables: [
      { id: '10-7', label: '10/7 Full Pay', fh: 10, fl: 7, return: 100.17, rating: 'HUNT' },
      { id: '9-7', label: '9/7', fh: 9, fl: 7, return: 99.11, rating: 'HUNT' },
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 97.81, rating: 'OK' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 96.38, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Four Aces pays 160!' },
      { priority: 2, rule: 'Flush pays 7 on good tables - changes strategy' },
      { priority: 3, rule: '4 to flush > low pair on 10/7 and 9/7' },
    ],
  },
  'double-double-bonus': {
    id: 'double-double-bonus',
    name: 'Double Double Bonus',
    shortName: 'DDB',
    category: 'bonus',
    description: 'Kickers matter for PAT quads only! Four Aces + 2-4 pays 400.',
    popularity: 95,
    payTables: [
      { id: '10-6', label: '10/6 Full Pay', fh: 10, fl: 6, return: 100.07, rating: 'HUNT' },
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 98.98, rating: 'OK' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 97.87, rating: 'AVOID' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 96.79, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Do NOT hold kickers with trips!' },
      { priority: 2, rule: 'AAA alone (EV 62.45) > AAA+kicker (EV 59.15)' },
      { priority: 3, rule: 'Only hold kicker with PAT quads' },
    ],
  },
  'triple-double-bonus': {
    id: 'triple-double-bonus',
    name: 'Triple Double Bonus',
    shortName: 'TDB',
    category: 'bonus',
    description: 'Very volatile. 4A+kicker = 4000 (same as Royal!).',
    popularity: 80,
    payTables: [
      { id: '9-7', label: '9/7 Full Pay', fh: 9, fl: 7, return: 99.58, rating: 'HUNT' },
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 98.15, rating: 'OK' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 96.72, rating: 'AVOID' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 95.97, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'HOLD kickers with AAA/222/333/444!' },
      { priority: 2, rule: '4A + 2-4 kicker = 4000 (same as Royal!)' },
      { priority: 3, rule: 'Very high variance' },
    ],
  },
  'triple-triple-bonus': {
    id: 'triple-triple-bonus',
    name: 'Triple Triple Bonus',
    shortName: 'TTB',
    category: 'bonus',
    description: 'Even more volatile. SF pays 100.',
    popularity: 65,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.79, rating: 'HUNT' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 98.61, rating: 'OK' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.47, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'SF pays 100 (double normal!)' },
      { priority: 2, rule: 'Extremely high variance' },
    ],
  },
  'super-double-bonus': {
    id: 'super-double-bonus',
    name: 'Super Double Bonus',
    shortName: 'SDB',
    category: 'bonus',
    description: 'Four Aces pays 160. Four J-K pays 120.',
    popularity: 60,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.69, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.77, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Face card quads pay 120' },
      { priority: 2, rule: 'Aces still king at 160' },
    ],
  },
  'super-aces': {
    id: 'super-aces',
    name: 'Super Aces Bonus',
    shortName: 'SA',
    category: 'bonus',
    description: 'Four Aces pays 400! Very volatile.',
    popularity: 70,
    payTables: [
      { id: '8-5', label: '8/5 Full Pay', fh: 8, fl: 5, return: 99.94, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.86, rating: 'OK' },
      { id: '6-5', label: '6/5', fh: 6, fl: 5, return: 97.78, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Four Aces = 400! Hold Aces aggressively' },
      { priority: 2, rule: 'Single Ace has extra value' },
    ],
  },
  'white-hot-aces': {
    id: 'white-hot-aces',
    name: 'White Hot Aces',
    shortName: 'WHA',
    category: 'bonus',
    description: 'Four Aces pays 240. Four 2-4 pays 120.',
    popularity: 65,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.57, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.50, rating: 'OK' },
      { id: '6-5', label: '6/5', fh: 6, fl: 5, return: 97.43, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Four Aces = 240' },
      { priority: 2, rule: 'Four 2-4 = 120' },
    ],
  },
  'aces-and-faces': {
    id: 'aces-and-faces',
    name: 'Aces and Faces',
    shortName: 'A&F',
    category: 'bonus',
    description: 'Bonus pays for quad Aces (80) and Faces (40).',
    popularity: 55,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.26, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.10, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Quad Aces = 80, Quad J/Q/K = 40' },
    ],
  },
  'double-aces-and-faces': {
    id: 'double-aces-and-faces',
    name: 'Double Aces and Faces',
    shortName: 'DA&F',
    category: 'bonus',
    description: 'Enhanced Aces and Faces with higher payouts.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.47, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.82, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Higher pays than standard A&F' },
    ],
  },
  'aces-and-eights': {
    id: 'aces-and-eights',
    name: 'Aces and Eights',
    shortName: 'A&8',
    category: 'bonus',
    description: 'Bonus for quad Aces and quad 8s.',
    popularity: 50,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.78, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.44, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Quad Aces and 8s pay 80' },
      { priority: 2, rule: 'Sevens pay 50' },
    ],
  },
  'bonus-deuces-wild': {
    id: 'bonus-deuces-wild',
    name: 'Bonus Deuces Wild',
    shortName: 'BDW',
    category: 'bonus',
    description: 'Deuces wild with bonus quad payouts.',
    popularity: 60,
    payTables: [
      { id: '13-4-3', label: '13/4/3 Full Pay', fh: 4, fl: 3, return: 99.86, rating: 'HUNT' },
      { id: '10-4-3', label: '10/4/3', fh: 4, fl: 3, return: 99.06, rating: 'OK' },
    ],
    keyLookup: 'Five of Kind / Four of Kind payout',
    strategyTips: [
      { priority: 1, rule: 'Wild deuces + bonus quad pays' },
      { priority: 2, rule: 'Different strategy from regular DW' },
    ],
  },
  'double-bonus-deuces-wild': {
    id: 'double-bonus-deuces-wild',
    name: 'Double Bonus Deuces Wild',
    shortName: 'DBDW',
    category: 'bonus',
    description: 'Deuces wild with even higher bonus pays.',
    popularity: 50,
    payTables: [
      { id: '9-4-3', label: '9/4/3', fh: 4, fl: 3, return: 99.81, rating: 'HUNT' },
    ],
    keyLookup: 'Four of Kind / Wild Royal payout',
    strategyTips: [
      { priority: 1, rule: 'Combines wild cards with bonus pays' },
    ],
  },
  'super-bonus-deuces-wild': {
    id: 'super-bonus-deuces-wild',
    name: 'Super Bonus Deuces Wild',
    shortName: 'SBDW',
    category: 'bonus',
    description: 'Enhanced Bonus Deuces with even higher pays.',
    popularity: 45,
    payTables: [
      { id: '12-4-3', label: '12/4/3', fh: 4, fl: 3, return: 99.52, rating: 'HUNT' },
    ],
    keyLookup: 'Five of Kind / Four Deuces payout',
    strategyTips: [
      { priority: 1, rule: 'Higher wild pays than standard BDW' },
    ],
  },
  'triple-bonus': {
    id: 'triple-bonus',
    name: 'Triple Bonus',
    shortName: 'TB',
    category: 'bonus',
    description: 'Four Aces pays 240. SF pays 100.',
    popularity: 55,
    payTables: [
      { id: '9-7', label: '9/7', fh: 9, fl: 7, return: 99.94, rating: 'HUNT' },
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.16, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.03, rating: 'AVOID' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'SF pays 100!' },
      { priority: 2, rule: 'Four Aces = 240' },
    ],
  },
  'triple-bonus-plus': {
    id: 'triple-bonus-plus',
    name: 'Triple Bonus Poker Plus',
    shortName: 'TBP',
    category: 'bonus',
    description: 'Triple Bonus with enhanced pays.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.80, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.94, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Enhanced Triple Bonus' },
    ],
  },
  'super-triple-bonus': {
    id: 'super-triple-bonus',
    name: 'Super Triple Bonus',
    shortName: 'STB',
    category: 'bonus',
    description: 'Even higher pays than Triple Bonus.',
    popularity: 40,
    payTables: [
      { id: '9-7', label: '9/7', fh: 9, fl: 7, return: 99.82, rating: 'HUNT' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Top tier of Triple Bonus family' },
    ],
  },
  'royal-aces-bonus': {
    id: 'royal-aces-bonus',
    name: 'Royal Aces Bonus',
    shortName: 'RAB',
    category: 'bonus',
    description: 'Four Aces pays 800. Min hand is pair of Aces.',
    popularity: 35,
    payTables: [
      { id: '8-6', label: '8/6', fh: 8, fl: 6, return: 99.58, rating: 'HUNT' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Four Aces = 800!' },
      { priority: 2, rule: 'Min hand is pair of Aces (not Jacks)' },
    ],
  },
  'nevada-bonus': {
    id: 'nevada-bonus',
    name: 'Nevada Bonus Poker',
    shortName: 'NB',
    category: 'bonus',
    description: 'Bonus pays with different structure.',
    popularity: 30,
    payTables: [
      { id: '10-6', label: '10/6', fh: 10, fl: 6, return: 99.26, rating: 'HUNT' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Nevada-specific pay structure' },
    ],
  },
  'ultra-bonus': {
    id: 'ultra-bonus',
    name: 'Ultra Bonus Poker',
    shortName: 'UB',
    category: 'bonus',
    description: 'High bonus quad pays.',
    popularity: 35,
    payTables: [
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 99.20, rating: 'HUNT' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'High variance bonus game' },
    ],
  },
  'hyper-bonus': {
    id: 'hyper-bonus',
    name: 'Hyper Bonus Poker',
    shortName: 'HB',
    category: 'bonus',
    description: 'Very high quad pays.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.00, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Extremely volatile' },
    ],
  },
  'pyramid-bonus': {
    id: 'pyramid-bonus',
    name: 'Pyramid Bonus Poker',
    shortName: 'PB',
    category: 'bonus',
    description: 'Pyramid-structured bonus pays.',
    popularity: 25,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 98.90, rating: 'OK' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Tiered bonus structure' },
    ],
  },

  // ============================================
  // WILD CARD GAMES
  // ============================================
  'deuces-wild': {
    id: 'deuces-wild',
    name: 'Deuces Wild',
    shortName: 'DW',
    category: 'wild',
    description: 'All 2s are wild. Completely different strategy.',
    popularity: 95,
    payTables: [
      { id: 'full-pay', label: 'Full Pay (NSUD)', fh: 4, fl: 3, return: 100.76, rating: 'HUNT' },
      { id: '25-15-9', label: '25/15/9', fh: 4, fl: 3, return: 99.73, rating: 'HUNT' },
      { id: '20-12-9', label: '20/12/9', fh: 4, fl: 3, return: 99.12, rating: 'OK' },
      { id: '25-16-10', label: '25/16/10 Illinois', fh: 4, fl: 3, return: 98.91, rating: 'OK' },
    ],
    keyLookup: 'Natural Royal / 5K / Wild Royal payout',
    strategyTips: [
      { priority: 1, rule: 'NEVER discard a deuce!' },
      { priority: 2, rule: 'Strategy changes based on # of deuces' },
      { priority: 3, rule: 'Minimum win is 3 of a kind' },
    ],
  },
  'loose-deuces': {
    id: 'loose-deuces',
    name: 'Loose Deuces',
    shortName: 'LD',
    category: 'wild',
    description: 'Deuces wild with 4 deuces paying 500 (2500 for max bet).',
    popularity: 60,
    payTables: [
      { id: '17-10', label: '500/17/10 Full Pay', fh: 3, fl: 2, return: 101.60, rating: 'HUNT' },
      { id: '15-10', label: '500/15/10', fh: 3, fl: 2, return: 100.97, rating: 'HUNT' },
      { id: '12-11', label: '500/12/11', fh: 3, fl: 2, return: 100.47, rating: 'HUNT' },
    ],
    keyLookup: 'Four Deuces / 5K / SF payout',
    strategyTips: [
      { priority: 1, rule: '3 Deuces: DUMP everything, chase 4D!' },
      { priority: 2, rule: 'Break wild royal/5K with 3 deuces!' },
      { priority: 3, rule: '4 Deuces = 500 (same as 2 royals!)' },
    ],
  },
  'double-deuces': {
    id: 'double-deuces',
    name: 'Double Deuces',
    shortName: 'DD',
    category: 'wild',
    description: 'Deuces wild with enhanced quad payouts.',
    popularity: 45,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 4, fl: 3, return: 99.62, rating: 'HUNT' },
    ],
    keyLookup: 'Four Deuces / Wild Royal payout',
    strategyTips: [
      { priority: 1, rule: 'Enhanced Deuces Wild' },
    ],
  },
  'joker-poker-kings': {
    id: 'joker-poker-kings',
    name: 'Joker Poker (Kings+)',
    shortName: 'JPK',
    category: 'wild',
    description: '53-card deck. Joker is wild. Kings or better pays.',
    popularity: 70,
    payTables: [
      { id: '20-7-5', label: '20/7/5 Full Pay', fh: 7, fl: 5, return: 100.64, rating: 'HUNT' },
      { id: '18-7-5', label: '18/7/5', fh: 7, fl: 5, return: 99.29, rating: 'HUNT' },
      { id: '17-7-5', label: '17/7/5', fh: 7, fl: 5, return: 98.93, rating: 'HUNT' },
      { id: '16-7-5', label: '16/7/5', fh: 7, fl: 5, return: 97.24, rating: 'OK' },
    ],
    keyLookup: 'Four of Kind / Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Joker is wild - hold it always!' },
      { priority: 2, rule: 'K/A pairs pay, Q and below do NOT' },
      { priority: 3, rule: 'With Joker: Hold Joker + K/A' },
    ],
  },
  'joker-poker-twopair': {
    id: 'joker-poker-twopair',
    name: 'Joker Poker (Two Pair+)',
    shortName: 'JP2',
    category: 'wild',
    description: '53-card deck. Min hand is TWO PAIR (pairs don\'t pay!).',
    popularity: 55,
    payTables: [
      { id: '20-10-6', label: '20/10/6 Full Pay', fh: 10, fl: 6, return: 99.92, rating: 'HUNT' },
      { id: '16-8-5', label: '16/8/5', fh: 8, fl: 5, return: 98.59, rating: 'HUNT' },
    ],
    keyLookup: 'Four of Kind / Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Min hand is TWO PAIR!' },
      { priority: 2, rule: 'NO pairs pay (even K/A!)' },
      { priority: 3, rule: 'More aggressive draw strategy' },
    ],
  },
  'joker-poker-aces': {
    id: 'joker-poker-aces',
    name: 'Joker Wild (Aces+)',
    shortName: 'JPA',
    category: 'wild',
    description: '53-card deck. Min hand is pair of Aces.',
    popularity: 45,
    payTables: [
      { id: '17-7-5', label: '17/7/5', fh: 7, fl: 5, return: 99.10, rating: 'HUNT' },
    ],
    keyLookup: 'Four of Kind / Full House payout',
    strategyTips: [
      { priority: 1, rule: 'Min hand is pair of Aces' },
    ],
  },
  'double-joker': {
    id: 'double-joker',
    name: 'Double Joker',
    shortName: 'DJ',
    category: 'wild',
    description: '54-card deck with TWO jokers wild.',
    popularity: 40,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 5, fl: 4, return: 99.97, rating: 'HUNT' },
    ],
    keyLookup: 'Natural Royal / 5K payout',
    strategyTips: [
      { priority: 1, rule: 'TWO jokers in deck!' },
      { priority: 2, rule: 'High hit frequency' },
    ],
  },
  'deuces-and-joker': {
    id: 'deuces-and-joker',
    name: 'Deuces and Joker Wild',
    shortName: 'D&J',
    category: 'wild',
    description: '53-card deck. All deuces AND joker wild.',
    popularity: 50,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 3, fl: 2, return: 99.06, rating: 'OK' },
    ],
    keyLookup: 'Natural Royal / 5K / 4 Deuces payout',
    strategyTips: [
      { priority: 1, rule: '5 wild cards total!' },
      { priority: 2, rule: 'Very high hit frequency' },
    ],
  },
  'sevens-wild': {
    id: 'sevens-wild',
    name: 'Sevens Wild',
    shortName: 'SW',
    category: 'wild',
    description: 'All 7s are wild.',
    popularity: 35,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 5, fl: 4, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Natural Royal / Five of Kind payout',
    strategyTips: [
      { priority: 1, rule: 'All 7s are wild' },
      { priority: 2, rule: 'Similar to Deuces strategy concepts' },
    ],
  },
  'sevens-and-joker': {
    id: 'sevens-and-joker',
    name: 'Sevens and Joker Wild',
    shortName: 'S&J',
    category: 'wild',
    description: '53-card deck. 7s and Joker wild.',
    popularity: 25,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 4, fl: 3, return: 98.50, rating: 'OK' },
    ],
    keyLookup: 'Five 7s / Natural Royal payout',
    strategyTips: [
      { priority: 1, rule: '5 wild cards in deck' },
    ],
  },
  'one-eyed-jacks': {
    id: 'one-eyed-jacks',
    name: 'One-Eyed Jacks',
    shortName: 'OEJ',
    category: 'wild',
    description: 'J♥ and J♠ are wild.',
    popularity: 30,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 8, fl: 5, return: 99.52, rating: 'HUNT' },
    ],
    keyLookup: 'Full House / Flush payout',
    strategyTips: [
      { priority: 1, rule: 'Only 2 wild cards in deck' },
      { priority: 2, rule: 'One-eyed Jacks (J♥ J♠) are wild' },
    ],
  },
  'faces-n-deuces': {
    id: 'faces-n-deuces',
    name: "Faces n' Deuces",
    shortName: 'FnD',
    category: 'wild',
    description: 'Deuces wild with face card bonus.',
    popularity: 30,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 4, fl: 3, return: 99.40, rating: 'HUNT' },
    ],
    keyLookup: 'Quad Faces / Deuces pays',
    strategyTips: [
      { priority: 1, rule: 'Combines wild deuces with face bonus' },
    ],
  },
  'acey-deucey': {
    id: 'acey-deucey',
    name: 'Acey Deucey Poker',
    shortName: 'AD',
    category: 'wild',
    description: 'Deuces wild with Ace bonus.',
    popularity: 25,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 4, fl: 3, return: 99.20, rating: 'HUNT' },
    ],
    keyLookup: 'Quad Aces / Deuces pays',
    strategyTips: [
      { priority: 1, rule: 'Wild deuces plus Ace bonuses' },
    ],
  },

  // ============================================
  // ULTIMATE X FAMILY
  // ============================================
  'ultimate-x-jacks': {
    id: 'ultimate-x-jacks',
    name: 'Ultimate X (Jacks or Better)',
    shortName: 'UX-JoB',
    category: 'ultimate-x',
    description: 'JoB with multipliers. Wins give 2x-12x on next hand. Uses standard JoB strategy.',
    popularity: 85,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.30, rating: 'AVOID' },
    ],
    keyLookup: 'Base pay table (multipliers add ~0.2%)',
    strategyTips: [
      { priority: 1, rule: 'Use standard Jacks or Better strategy!' },
      { priority: 2, rule: 'Multipliers (2x-12x) don\'t change optimal play' },
      { priority: 3, rule: 'Royal = 12x, SF = 10x on next hand' },
      { priority: 4, rule: 'Must play 3-10 hands simultaneously' },
    ],
  },
  'ultimate-x-bonus': {
    id: 'ultimate-x-bonus',
    name: 'Ultimate X (Bonus Poker)',
    shortName: 'UX-BP',
    category: 'ultimate-x',
    description: 'Bonus Poker with Ultimate X multipliers. Uses standard BP strategy.',
    popularity: 75,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.17, rating: 'HUNT' },
      { id: '7-5', label: '7/5', fh: 7, fl: 5, return: 98.01, rating: 'OK' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Use standard Bonus Poker strategy!' },
      { priority: 2, rule: 'Quad bonuses + multipliers = volatile' },
      { priority: 3, rule: 'Multipliers don\'t change optimal play' },
    ],
  },
  'ultimate-x-ddb': {
    id: 'ultimate-x-ddb',
    name: 'Ultimate X (Double Double Bonus)',
    shortName: 'UX-DDB',
    category: 'ultimate-x',
    description: 'DDB with Ultimate X multipliers. Uses standard DDB strategy with kicker rules.',
    popularity: 80,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 98.98, rating: 'OK' },
      { id: '9-5', label: '9/5', fh: 9, fl: 5, return: 97.87, rating: 'AVOID' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Use standard DDB strategy with kickers!' },
      { priority: 2, rule: 'Hold AAA + kicker (2/3/4) for 400-coin draw' },
      { priority: 3, rule: 'Kickers + multipliers = huge volatility' },
    ],
  },
  'ultimate-x-double-bonus': {
    id: 'ultimate-x-double-bonus',
    name: 'Ultimate X (Double Bonus)',
    shortName: 'UX-DB',
    category: 'ultimate-x',
    description: 'Double Bonus with Ultimate X multipliers. Uses standard DB strategy.',
    popularity: 70,
    payTables: [
      { id: '9-7', label: '9/7', fh: 9, fl: 7, return: 99.11, rating: 'HUNT' },
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 97.81, rating: 'OK' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Use standard Double Bonus strategy!' },
      { priority: 2, rule: '4 Aces = 160 coins + potential multiplier' },
      { priority: 3, rule: 'Multipliers don\'t change optimal play' },
    ],
  },
  'ultimate-x-bpd': {
    id: 'ultimate-x-bpd',
    name: 'Ultimate X (Bonus Poker Deluxe)',
    shortName: 'UX-BPD',
    category: 'ultimate-x',
    description: 'BPD with Ultimate X multipliers. All quads pay 80. Uses BP strategy.',
    popularity: 60,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.64, rating: 'HUNT' },
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 97.40, rating: 'AVOID' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Use Bonus Poker strategy!' },
      { priority: 2, rule: 'All quads = 80 coins (no kicker bonuses)' },
      { priority: 3, rule: 'Multipliers don\'t change optimal play' },
    ],
  },
  'ultimate-x-joker': {
    id: 'ultimate-x-joker',
    name: 'Ultimate X (Joker Poker)',
    shortName: 'UX-JP',
    category: 'ultimate-x',
    description: 'Joker Poker Kings with Ultimate X multipliers. Uses JPK strategy.',
    popularity: 50,
    payTables: [
      { id: '20-7', label: '20/7/5', fh: 7, fl: 5, return: 100.64, rating: 'HUNT' },
      { id: '17-7', label: '17/7/5', fh: 7, fl: 5, return: 99.07, rating: 'OK' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Use Joker Poker Kings strategy!' },
      { priority: 2, rule: 'K/A pairs pay, Q and below don\'t' },
      { priority: 3, rule: 'Hold Joker + K/A for paying pair' },
      { priority: 4, rule: 'Multipliers don\'t change optimal play' },
    ],
  },
  'ultimate-x-gold': {
    id: 'ultimate-x-gold',
    name: 'Ultimate X Gold',
    shortName: 'UX-G',
    category: 'ultimate-x',
    description: 'Enhanced Ultimate X with better multipliers.',
    popularity: 55,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.70, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + enhanced multipliers',
    strategyTips: [
      { priority: 1, rule: 'Better multipliers than standard UX' },
    ],
  },
  'ultimate-x-bonus-streak': {
    id: 'ultimate-x-bonus-streak',
    name: 'Ultimate X Bonus Streak',
    shortName: 'UXBS',
    category: 'ultimate-x',
    description: 'UX with streak bonus feature.',
    popularity: 65,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.60, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + streak bonus',
    strategyTips: [
      { priority: 1, rule: 'Multipliers can streak/accumulate' },
    ],
  },

  // ============================================
  // MULTI-PLAY & MULTI-STRIKE
  // ============================================
  'multi-strike': {
    id: 'multi-strike',
    name: 'Multi-Strike Poker',
    shortName: 'MS',
    category: 'multi-play',
    description: '4 levels. Win to advance. Multipliers 1x-2x-4x-8x.',
    popularity: 70,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.79, rating: 'HUNT' },
      { id: '8-5', label: '8/5 JoB', fh: 8, fl: 5, return: 97.81, rating: 'OK' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Must win to advance levels' },
      { priority: 2, rule: 'Level 4 = 8x multiplier!' },
      { priority: 3, rule: 'Free ride cards help advance' },
    ],
  },
  'multi-strike-16x': {
    id: 'multi-strike-16x',
    name: 'Multi-Strike Poker 16X',
    shortName: 'MS16',
    category: 'multi-play',
    description: '5 levels with 16x top multiplier.',
    popularity: 50,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.85, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: '5 levels: 1x-2x-4x-8x-16x' },
      { priority: 2, rule: 'Even more volatile than standard MS' },
    ],
  },
  'spin-poker': {
    id: 'spin-poker',
    name: 'Spin Poker',
    shortName: 'SP',
    category: 'multi-play',
    description: '9-line with spinning pattern. Same strategy as single.',
    popularity: 60,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table (same return as single)',
    strategyTips: [
      { priority: 1, rule: 'Same strategy as single-line' },
      { priority: 2, rule: '9 hands share same draw cards' },
    ],
  },
  'triple-play': {
    id: 'triple-play',
    name: 'Triple Play Poker',
    shortName: 'TP',
    category: 'multi-play',
    description: '3 hands. Same initial cards, different draws.',
    popularity: 55,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Same strategy as single-line' },
      { priority: 2, rule: 'Higher variance than single' },
    ],
  },
  'five-play': {
    id: 'five-play',
    name: 'Five Play Poker',
    shortName: '5P',
    category: 'multi-play',
    description: '5 hands. Same initial cards, different draws.',
    popularity: 50,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Same strategy as single-line' },
    ],
  },
  'ten-play': {
    id: 'ten-play',
    name: 'Ten Play Poker',
    shortName: '10P',
    category: 'multi-play',
    description: '10 hands simultaneously.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Very high variance' },
    ],
  },
  'super-times-pay': {
    id: 'super-times-pay',
    name: 'Super Times Pay',
    shortName: 'STP',
    category: 'multi-play',
    description: 'Random multipliers 2x-10x on hands.',
    popularity: 65,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.54, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table + random multipliers',
    strategyTips: [
      { priority: 1, rule: 'Random multiplier appears on deal' },
      { priority: 2, rule: 'Same base strategy' },
    ],
  },
  'double-super-times-pay': {
    id: 'double-super-times-pay',
    name: 'Double Super Times Pay',
    shortName: 'DSTP',
    category: 'multi-play',
    description: 'Enhanced Super Times Pay multipliers.',
    popularity: 50,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.60, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + better multipliers',
    strategyTips: [
      { priority: 1, rule: 'Better multiplier frequency' },
    ],
  },
  'hot-roll': {
    id: 'hot-roll',
    name: 'Hot Roll Poker',
    shortName: 'HR',
    category: 'multi-play',
    description: 'Dice roll on wins determines multiplier.',
    popularity: 55,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.64, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + dice multiplier',
    strategyTips: [
      { priority: 1, rule: 'Win triggers dice roll for multiplier' },
      { priority: 2, rule: '7 = point, keeps rolling' },
    ],
  },
  'super-hot-roll': {
    id: 'super-hot-roll',
    name: 'Super Hot Roll',
    shortName: 'SHR',
    category: 'multi-play',
    description: 'Enhanced Hot Roll with better odds.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.70, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + enhanced dice',
    strategyTips: [
      { priority: 1, rule: 'Better multiplier structure' },
    ],
  },

  // ============================================
  // WHEEL BONUS GAMES
  // ============================================
  'wheel-poker': {
    id: 'wheel-poker',
    name: 'Wheel Poker',
    shortName: 'WP',
    category: 'wheel',
    description: 'Quads trigger wheel spin for bonus.',
    popularity: 55,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.20, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + wheel bonus',
    strategyTips: [
      { priority: 1, rule: 'Four of a kind spins the wheel' },
      { priority: 2, rule: 'Wheel can give big multipliers' },
    ],
  },
  'wheel-poker-deluxe': {
    id: 'wheel-poker-deluxe',
    name: 'Wheel Poker Deluxe',
    shortName: 'WPD',
    category: 'wheel',
    description: 'Enhanced Wheel Poker.',
    popularity: 45,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + better wheel',
    strategyTips: [
      { priority: 1, rule: 'Better wheel prizes' },
    ],
  },
  'ultimate-x-wheel': {
    id: 'ultimate-x-wheel',
    name: 'Ultimate X Wheel Poker',
    shortName: 'UXW',
    category: 'wheel',
    description: 'Ultimate X combined with wheel bonus.',
    popularity: 50,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.65, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + UX + wheel',
    strategyTips: [
      { priority: 1, rule: 'Multipliers AND wheel bonus' },
    ],
  },
  'quick-quads': {
    id: 'quick-quads',
    name: 'Quick Quads',
    shortName: 'QQ',
    category: 'wheel',
    description: 'Extra bet adds "quick quad" bonus cards.',
    popularity: 60,
    payTables: [
      { id: '9-6', label: '9/6 JoB', fh: 9, fl: 6, return: 99.52, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + quick quad bonus',
    strategyTips: [
      { priority: 1, rule: 'Extra bet for bonus quick quad cards' },
      { priority: 2, rule: 'Bonus cards help make quads' },
    ],
  },
  'lucky-quads-wheel': {
    id: 'lucky-quads-wheel',
    name: "Lucky Quads Wheel Poker",
    shortName: 'LQW',
    category: 'wheel',
    description: 'Quads trigger wheel and quick quads.',
    popularity: 40,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.00, rating: 'OK' },
    ],
    keyLookup: 'Base pay + wheel + quick quads',
    strategyTips: [
      { priority: 1, rule: 'Multiple bonus features' },
    ],
  },
  'wheel-of-fortune-poker': {
    id: 'wheel-of-fortune-poker',
    name: 'Wheel of Fortune Poker',
    shortName: 'WoF',
    category: 'wheel',
    description: 'Licensed WoF theme with wheel bonus.',
    popularity: 50,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.10, rating: 'OK' },
    ],
    keyLookup: 'Base pay + WoF wheel',
    strategyTips: [
      { priority: 1, rule: 'Standard wheel mechanic, WoF theme' },
    ],
  },

  // ============================================
  // SPECIALTY GAMES
  // ============================================
  'pick-em-poker': {
    id: 'pick-em-poker',
    name: "Pick'em Poker",
    shortName: 'PeP',
    category: 'specialty',
    description: 'Pick 1 of 2 columns. Only 2 decision points.',
    popularity: 50,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 9, fl: 6, return: 99.95, rating: 'HUNT' },
    ],
    keyLookup: 'Standard pay table',
    strategyTips: [
      { priority: 1, rule: 'Only 2 decisions per hand' },
      { priority: 2, rule: 'Much simpler than standard VP' },
      { priority: 3, rule: 'Pick highest value column' },
    ],
  },
  'draw-poker-dream-card': {
    id: 'draw-poker-dream-card',
    name: 'Dream Card Poker',
    shortName: 'DC',
    category: 'specialty',
    description: 'Pick a "dream card" before the deal.',
    popularity: 40,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 8, fl: 5, return: 99.50, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Pick card you want before deal' },
      { priority: 2, rule: 'Changes strategy significantly' },
    ],
  },
  'peek-and-play': {
    id: 'peek-and-play',
    name: 'Peek and Play Poker',
    shortName: 'PnP',
    category: 'specialty',
    description: 'See one draw card before hold decision.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.60, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'See one replacement card early' },
      { priority: 2, rule: 'Changes hold decisions' },
    ],
  },
  'super-peek-and-play': {
    id: 'super-peek-and-play',
    name: 'Super Peek and Play',
    shortName: 'SPnP',
    category: 'specialty',
    description: 'Enhanced Peek and Play.',
    popularity: 35,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.65, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'See more peek cards' },
    ],
  },
  'look-ahead': {
    id: 'look-ahead',
    name: 'Look Ahead Poker',
    shortName: 'LA',
    category: 'specialty',
    description: 'See future cards before decision.',
    popularity: 35,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.40, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Similar to Peek and Play' },
    ],
  },
  'super-look-ahead': {
    id: 'super-look-ahead',
    name: 'Super Look Ahead Poker',
    shortName: 'SLA',
    category: 'specialty',
    description: 'Enhanced Look Ahead.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.50, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'More look ahead cards' },
    ],
  },
  'double-draw': {
    id: 'double-draw',
    name: 'Double Draw Poker',
    shortName: 'DDr',
    category: 'specialty',
    description: 'Two draw phases. Unique mechanic.',
    popularity: 35,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 8, fl: 5, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Get two chances to draw' },
      { priority: 2, rule: 'Different strategy required' },
    ],
  },
  'double-pay': {
    id: 'double-pay',
    name: 'Double Pay Poker',
    shortName: 'DP',
    category: 'specialty',
    description: 'Certain hands pay double.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.40, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table + double feature',
    strategyTips: [
      { priority: 1, rule: 'Specific hands pay 2x' },
    ],
  },
  '2-ways-royal': {
    id: '2-ways-royal',
    name: '2 Ways Royal',
    shortName: '2WR',
    category: 'specialty',
    description: 'Two ways to make a Royal Flush.',
    popularity: 35,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 8, fl: 5, return: 99.45, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Hi and Lo royals both pay' },
    ],
  },
  'shockwave': {
    id: 'shockwave',
    name: 'Shockwave Poker',
    shortName: 'SW',
    category: 'specialty',
    description: 'Special bonus feature poker.',
    popularity: 40,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.50, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Bonus feature mechanic' },
    ],
  },
  'all-aces': {
    id: 'all-aces',
    name: 'All Aces Video Poker',
    shortName: 'ALA',
    category: 'specialty',
    description: 'Four Aces pays extremely high.',
    popularity: 45,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.92, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + Ace bonus',
    strategyTips: [
      { priority: 1, rule: 'Aces are extremely valuable' },
    ],
  },
  'five-aces': {
    id: 'five-aces',
    name: 'Five Aces Poker',
    shortName: '5A',
    category: 'specialty',
    description: 'Wild card allows 5 Aces.',
    popularity: 30,
    payTables: [
      { id: 'full-pay', label: 'Full Pay', fh: 7, fl: 5, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: '5 Aces possible with wild' },
    ],
  },
  'sequential-royal': {
    id: 'sequential-royal',
    name: 'Sequential Royal',
    shortName: 'SR',
    category: 'specialty',
    description: 'Sequential Royal pays huge bonus.',
    popularity: 35,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.20, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + sequential bonus',
    strategyTips: [
      { priority: 1, rule: '10-J-Q-K-A in order = mega pay' },
    ],
  },
  'chase-the-royal': {
    id: 'chase-the-royal',
    name: 'Chase The Royal',
    shortName: 'CTR',
    category: 'specialty',
    description: 'Progressive royal chase mechanic.',
    popularity: 40,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.50, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Chase mechanic for royals' },
    ],
  },
  'reversible-royals': {
    id: 'reversible-royals',
    name: 'Reversible Royals',
    shortName: 'RR',
    category: 'specialty',
    description: 'Royals can go both directions.',
    popularity: 30,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.55, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'A-2-3-4-5 royal pays too' },
    ],
  },
  'flush-fever': {
    id: 'flush-fever',
    name: 'Flush Fever',
    shortName: 'FF',
    category: 'specialty',
    description: '4 to a flush gets free redraws.',
    popularity: 45,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.60, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + flush fever bonus',
    strategyTips: [
      { priority: 1, rule: '4 suited = free redraws for flush' },
      { priority: 2, rule: 'Makes flush draws more valuable' },
    ],
  },
  'atomic-fever': {
    id: 'atomic-fever',
    name: 'Atomic Fever',
    shortName: 'AF',
    category: 'specialty',
    description: 'Fever bonus variant.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.40, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + fever bonus',
    strategyTips: [
      { priority: 1, rule: 'Fever mechanic variant' },
    ],
  },
  'fever-aces': {
    id: 'fever-aces',
    name: 'Fever Aces',
    shortName: 'FA',
    category: 'specialty',
    description: 'Ace-focused fever variant.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + ace fever',
    strategyTips: [
      { priority: 1, rule: 'Aces trigger fever bonus' },
    ],
  },
  'extra-draw-frenzy': {
    id: 'extra-draw-frenzy',
    name: 'Extra Draw Frenzy',
    shortName: 'EDF',
    category: 'specialty',
    description: 'Extra draw opportunities.',
    popularity: 45,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.70, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + extra draws',
    strategyTips: [
      { priority: 1, rule: 'More draw opportunities' },
      { priority: 2, rule: 'Good return with proper play' },
    ],
  },
  'face-card-frenzy': {
    id: 'face-card-frenzy',
    name: 'Face Card Frenzy',
    shortName: 'FCF',
    category: 'specialty',
    description: 'Face cards trigger frenzy bonus.',
    popularity: 35,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.40, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + face frenzy',
    strategyTips: [
      { priority: 1, rule: 'Face cards more valuable' },
    ],
  },
  'magic-deal': {
    id: 'magic-deal',
    name: 'Magic Deal',
    shortName: 'MD',
    category: 'specialty',
    description: 'Magic card changes one card.',
    popularity: 35,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.35, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Magic card transforms' },
    ],
  },
  'power-quads': {
    id: 'power-quads',
    name: 'Power Quads',
    shortName: 'PQ',
    category: 'specialty',
    description: 'Enhanced quad payouts.',
    popularity: 40,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.45, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + quad bonus',
    strategyTips: [
      { priority: 1, rule: 'Extra value on quads' },
    ],
  },
  'straight-flush-bonus': {
    id: 'straight-flush-bonus',
    name: 'Straight Flush Bonus',
    shortName: 'SFB',
    category: 'specialty',
    description: 'Enhanced straight flush pays.',
    popularity: 35,
    payTables: [
      { id: '9-6', label: '9/6', fh: 9, fl: 6, return: 99.60, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay + SF bonus',
    strategyTips: [
      { priority: 1, rule: 'SF draws more valuable' },
    ],
  },
  'powerhouse': {
    id: 'powerhouse',
    name: 'Powerhouse Poker',
    shortName: 'PH',
    category: 'specialty',
    description: 'Enhanced power feature.',
    popularity: 30,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 99.30, rating: 'HUNT' },
    ],
    keyLookup: 'Base pay table',
    strategyTips: [
      { priority: 1, rule: 'Power feature mechanic' },
    ],
  },
  'jackpot-poker': {
    id: 'jackpot-poker',
    name: 'Jackpot Poker',
    shortName: 'JP',
    category: 'specialty',
    description: 'Progressive jackpot feature.',
    popularity: 45,
    payTables: [
      { id: '8-5', label: '8/5', fh: 8, fl: 5, return: 98.50, rating: 'OK' },
    ],
    keyLookup: 'Base pay + jackpot (varies)',
    strategyTips: [
      { priority: 1, rule: 'Progressive adds value' },
      { priority: 2, rule: 'Check meter level' },
    ],
  },
};

export { vpCategories, vpGames };
