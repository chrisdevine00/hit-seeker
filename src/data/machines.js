// Machine Database for Hit Seeker
// Contains slot machine data for advantage play tracking

// Machine Categories for filtering/display
const machineCategories = {
  'must-hit-by': { name: 'Must-Hit-By Progressives', description: 'Progressive jackpots that MUST pay before reaching ceiling amount' },
  'banked-coins': { name: 'Banked Coins/Symbols', description: 'Machines that accumulate coins, gems, or symbols over time' },
  'expanding-reels': { name: 'Expanding Reels/Ways', description: 'Machines where reels grow taller, increasing ways to win' },
  'cycle-bonus': { name: 'Cycle/Meter Bonus', description: 'Machines with meters that fill toward guaranteed bonus' },
  'persistent-state': { name: 'Other Persistent State', description: 'Various machines with carryover features' },
  'entertainment': { name: 'Entertainment (No AP)', description: 'Popular licensed/themed machines - NO advantage play edge, just for fun!' }
};

const machines = [
  // =============================================
  // MUST-HIT-BY PROGRESSIVES (Tier 1)
  // =============================================
  {
    id: 'wheel-of-fortune-mhb',
    name: 'Wheel of Fortune (Must-Hit-By)',
    shortName: 'Wheel of Fortune MHB',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Classic wheel on top + "Must Hit By" display showing current/ceiling amounts',
    visual: {
      location: 'TOP of cabinet shows progressive displays with "Must Hit By" text',
      appearance: [
        { label: 'Display', text: 'Current amount + ceiling amount (e.g., "$487.23 Must Hit By $500")' },
        { label: 'Wheel', text: 'Iconic spinning wheel on top of cabinet' },
        { label: 'Versions', text: 'Multiple versions exist - look for MHB text specifically' },
      ],
      colors: 'Blue/purple cabinet with gold wheel',
      example: 'Mini at $48.50 MHB $50, Minor at $180 MHB $200'
    },
    thresholdSummary: '90%+ of ceiling',
    thresholdDetail: 'Use calculator: Current ÷ Ceiling × 100. At 90%+, math favors you. Each progressive tier (Mini, Minor, Major) has own ceiling.',
    threshold: {
      conservative: '90%+ of any ceiling',
      aggressive: '85%+ with multiple meters high',
      quickMath: '(Current ÷ Must-Hit-By) × 100'
    },
    notes: 'Multiple progressive tiers - check ALL of them. Higher tiers = bigger swings.',
    hasCalculator: true
  },

  {
    id: 'fu-dai-lian-lian-mhb',
    name: 'Fu Dai Lian Lian (Must-Hit-By)',
    shortName: 'Fu Dai Lian Lian',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Asian theme with lucky bags + Must-Hit-By progressive display',
    visual: {
      location: 'Progressive displays at top showing MHB amounts',
      appearance: [
        { label: 'Theme', text: 'Red/gold Asian theme with lucky money bags' },
        { label: 'MHB Display', text: 'Shows current value and ceiling for each tier' },
        { label: 'Tiers', text: 'Mini, Minor, Major, Grand - each with own MHB ceiling' },
      ],
      colors: 'Red and gold Asian prosperity theme',
      example: 'Major at $920 Must Hit By $1,000'
    },
    thresholdSummary: '90%+ of any ceiling',
    thresholdDetail: 'Same math as all MHB games. Check each tier separately.',
    threshold: {
      conservative: '90%+ of ceiling',
      aggressive: '85%+ on Major/Grand tiers'
    },
    notes: 'Part of larger MHB family from IGT. Very common on floors.',
    hasCalculator: true
  },

  {
    id: 'money-mania-mhb',
    name: 'Money Mania (Must-Hit-By)',
    shortName: 'Money Mania',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Various themes (Cleopatra, Pharaoh\'s Fortune) with MHB progressives',
    visual: {
      location: 'TOP displays showing "Must Hit By" with current/ceiling',
      appearance: [
        { label: 'Themes', text: 'Cleopatra, Pharaoh\'s Fortune, Sphinx Wild, and more' },
        { label: 'MHB Display', text: 'Clearly shows ceiling amount for each tier' },
        { label: 'Format', text: 'Bright LED numbers with MHB text' },
      ],
      colors: 'Varies by theme (Egyptian gold, etc.)',
      example: '$475.50 Must Hit By $500'
    },
    thresholdSummary: '90%+ of ceiling',
    thresholdDetail: 'Standard MHB math applies.',
    threshold: {
      conservative: '90%+ of ceiling',
      aggressive: '85%+ if multiple tiers are high'
    },
    notes: 'Multiple theme variations - all use same MHB mechanic.',
    hasCalculator: true
  },

  {
    id: 'generic-mhb',
    name: 'Other Must-Hit-By Games',
    shortName: 'Any MHB Game',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Various (Konami, WMS, IGT, Ainsworth)',
    quickId: 'ANY machine showing "Must Hit By" or "Must Award By" text with ceiling amount',
    visual: {
      location: 'TOP of machine, above main screen',
      appearance: [
        { label: 'Key Text', text: 'Look for "Must Hit By $X" or "Must Award By $X"', highlight: true },
        { label: 'Display', text: 'Current amount (changing) next to ceiling (static)' },
        { label: 'Format', text: 'LED-style digits, often red/gold/green' },
      ],
      colors: 'Varies - look for the MHB text',
      example: 'Current: $487.23 | Must Hit By: $500.00'
    },
    thresholdSummary: '90%+ of ceiling (use calculator)',
    thresholdDetail: 'Divide current by ceiling × 100. At 90%+ you have edge. At 80-89% marginal. Below 80% skip.',
    threshold: {
      conservative: '90%+ of ceiling',
      aggressive: '80%+ of ceiling',
      skip: 'Below 80%'
    },
    warning: 'AVOID AGS machines (River Dragons, Rakin\' Bacon) — programmed to hit at 99%+. Check cabinet for AGS logo.',
    notes: 'This is your catch-all for any MHB game you find.',
    hasCalculator: true
  },

  // =============================================
  // BANKED COINS/SYMBOLS (Tier 1)
  // =============================================

  {
    id: 'golden-egypt',
    name: 'Golden Egypt',
    shortName: 'Golden Egypt',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Gold coins in meter boxes ABOVE each reel',
    visual: {
      location: 'ABOVE each reel (not on the reels) — rectangular meter boxes',
      appearance: [
        { label: 'Coins', text: 'Small GOLD CIRCLES with Egyptian designs' },
        { label: 'Meters', text: 'Dark rectangular boxes above each reel, holds 0-2 coins each' },
        { label: '2 coins', text: 'That reel goes WILD for 2 spins (glows gold)', highlight: true },
      ],
      colors: 'Gold and blue Egyptian theme — pharaoh imagery, hieroglyphics',
      example: 'Empty = dark box. 1 coin = one gold circle. 2 coins = reel about to go wild'
    },
    thresholdSummary: '1+ coin on two of columns 1-3',
    thresholdDetail: 'Reels are numbered 1-5 from left to right. Since wins pay left-to-right, wild reels on columns 1-3 are valuable.',
    threshold: {
      conservative: '1+ coin on two of first three columns',
      aggressive: 'Any 2 coins total on columns 1-3',
      skip: 'Coins only on columns 4-5 (right side)'
    },
    notes: 'CHECK ALL BET LEVELS — each is independent!',
    checkBetLevels: true
  },

  {
    id: 'ocean-magic',
    name: 'Ocean Magic',
    shortName: 'Ocean Magic',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Blue bubbles floating up on underwater-themed reels',
    visual: {
      location: 'On the reels AND below the bottom row',
      appearance: [
        { label: 'Bubbles', text: 'TRANSLUCENT BLUE-GREEN circles with shimmer/glow' },
        { label: 'Movement', text: 'Float UP one row per spin until they exit top', highlight: true },
        { label: 'Below reels', text: 'Look for curved bubble shapes about to enter' },
      ],
      colors: 'Deep blue underwater background — fish, seahorses, coral',
      example: 'Bubbles visible below play area = about to float up'
    },
    thresholdSummary: 'Any bubble rows 1-3 on reels 2-4',
    thresholdDetail: 'Bubbles are wild symbols that float up one row per spin. Reels 2-4 (middle) are most valuable.',
    threshold: {
      conservative: 'Any bubble in rows 1-3 on reels 2, 3, or 4',
      aggressive: 'Multiple bubbles in good positions',
      quit: 'All bubbles floated off top, none visible below'
    },
    notes: 'Very visual — can spot from distance without sitting down.',
    checkBetLevels: false
  },

  {
    id: 'magic-of-nile',
    category: 'banked-coins',
    name: 'Magic of the Nile',
    shortName: 'Magic of Nile',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Three colored obelisks on LEFT side — look for SPARKLING gems',
    visual: {
      location: 'LEFT SIDE of screen — three tall vertical columns (obelisks)',
      appearance: [
        { label: 'Obelisks', text: 'RED (left), BLUE (middle), GREEN (right) columns' },
        { label: 'Segments', text: 'Each divided into 3 segments, light up bottom-to-top' },
        { label: 'KEY CUE', text: 'Gem at TOP of obelisk SPARKLES when 2+ segments lit', highlight: true },
      ],
      colors: 'Egyptian/Nile theme — blue water, pyramids, golden accents',
      example: 'SPARKLING GEM = 2+ gems collected'
    },
    thresholdSummary: '2+ sparkling gems (2 colors with 2+ each)',
    thresholdDetail: 'Each obelisk tracks gems of its color. When 2+ gems are collected, the gem at the top sparkles.',
    threshold: {
      conservative: 'Two colors with 2 gems each (two sparkling gems)',
      aggressive: 'Any 4 gems total',
      quickScout: 'Just look for SPARKLING gems'
    },
    notes: '5 BET LEVELS, each independent!',
    checkBetLevels: true
  },

  {
    id: 'buffalo-link',
    category: 'cycle-bonus',
    name: 'Buffalo Link',
    shortName: 'Buffalo Link',
    tier: 2,
    manufacturer: 'Aristocrat',
    quickId: 'Meter on RIGHT side showing buffalo head count out of 1,800',
    visual: {
      location: 'RIGHT SIDE of screen — vertical progress bar',
      appearance: [
        { label: 'Meter', text: 'Shows count like "847 / 1,800"' },
        { label: 'Symbols', text: 'HEADS increment meter, BODIES trigger Hold & Spin' },
        { label: 'Cycle', text: 'Starts at 100 after bonus, auto-triggers at 1,800' },
      ],
      colors: 'Purple/orange sunset, mountain scenery',
      example: 'Meter at 1,450+ = playable territory'
    },
    thresholdSummary: '1,450+ on meter (out of 1,800)',
    thresholdDetail: 'The meter fills as buffalo head symbols land. At 1,800, a bonus is guaranteed.',
    threshold: {
      conservative: '1,450+ (about 80% of 1,800)',
      aggressive: '1,300-1,400 at higher bet levels'
    },
    notes: 'Very popular but high threshold.',
    checkBetLevels: false
  },

  {
    id: 'hexbreaker',
    category: 'expanding-reels',
    name: 'Hexbreak3r',
    shortName: 'Hexbreak3r',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Reels at different heights + "Ways to Win" number',
    visual: {
      location: 'BOTTOM LEFT shows "Ways to Win"',
      appearance: [
        { label: 'Reels', text: 'Each of 5 reels can show 3-8 positions' },
        { label: 'Prize orbs', text: 'GLOWING ORBS above each reel' },
        { label: 'Horseshoes', text: 'ORANGE = +1 height, BLUE = +2 height' },
      ],
      colors: 'Dark purple/black + neon green',
      example: 'Ways = product of heights'
    },
    thresholdSummary: '6,000+ ways OR any reel at 8',
    thresholdDetail: 'More ways = more chances to win per spin.',
    threshold: {
      conservative: '6,000+ ways OR any reel at 8',
      best: 'Center column (reel 3) at 6+'
    },
    notes: 'High variance.',
    checkBetLevels: false
  },

  {
    id: 'huff-n-puff',
    category: 'persistent-state',
    name: 'Huff N\' Puff Series',
    shortName: 'Huff N\' Puff',
    tier: 2,
    manufacturer: 'Light & Wonder',
    quickId: 'Three Little Pigs theme — houses being built',
    visual: {
      location: 'Houses appear on reel positions during bonus',
      appearance: [
        { label: 'Houses', text: 'STRAW → WOOD → BRICK → MANSION' },
        { label: 'Scatters', text: 'YELLOW HARD HATS trigger free spins' },
        { label: 'Wheel', text: 'BUZZSAW symbols trigger wheel spin' },
      ],
      colors: 'Cartoon pigs, Big Bad Wolf',
      example: 'Wolf blows down houses at bonus end'
    },
    thresholdSummary: 'Mid-bonus with brick houses',
    thresholdDetail: 'NOT persistent state — value resets when bonus ends.',
    threshold: {
      play: 'NOT traditional persistent state',
      lookFor: 'Someone abandoned MID-BONUS'
    },
    notes: 'Mid-bonus abandonment is rare.',
    checkBetLevels: false
  },

  {
    id: 'regal-riches',
    category: 'banked-coins',
    name: 'Regal Riches',
    shortName: 'Regal Riches',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Four colored meter bars (Blue/Purple/Green/Yellow)',
    visual: {
      location: 'Four colored progress bars on sides',
      appearance: [
        { label: 'Meters', text: 'BLUE, PURPLE, GREEN, YELLOW' },
        { label: 'Display', text: 'Shows count like "7/50"' },
        { label: 'Wilds', text: 'Wild symbols add to bank' },
      ],
      colors: 'Purple/gold royal theme',
      example: 'Blue at 8+, Purple at 56+'
    },
    thresholdSummary: 'Blue 8+ / Purple 56+ / Green 81+ / Yellow 106+',
    thresholdDetail: 'Each color has a different scale.',
    threshold: {
      blue: '8+ wilds',
      purple: '56+ wilds',
      green: '81+ wilds',
      yellow: '106+ wilds'
    },
    notes: 'Each bet level has INDEPENDENT meters!',
    checkBetLevels: true
  },

  {
    id: 'buffalo-ascension',
    category: 'expanding-reels',
    name: 'Buffalo Ascension',
    shortName: 'Buffalo Ascension',
    tier: 2,
    manufacturer: 'Aristocrat',
    quickId: 'Middle three reels at different heights',
    visual: {
      location: 'Middle reels (2, 3, 4) at different heights',
      appearance: [
        { label: 'Expanding', text: 'Reels 2, 3, 4 grow from 4 to 7 positions' },
        { label: 'Arrows', text: 'GOLD ARROW symbols grow reels' },
        { label: 'Prizes', text: 'Above reels: "Stampede" or progressive' },
      ],
      colors: 'Buffalo theme — sunset colors',
      example: 'Max = 5,488 ways'
    },
    thresholdSummary: '3,136+ ways to win',
    thresholdDetail: 'Ways = product of all reel heights.',
    threshold: {
      conservative: '3,136+ ways',
      best: 'Reels 2 or 4 at height 7'
    },
    warning: 'HIGH VARIANCE — brutal swings.',
    checkBetLevels: false
  },

  {
    id: 'cash-falls',
    category: 'banked-coins',
    name: 'Cash Falls',
    shortName: 'Cash Falls',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Column containers ABOVE reels filling with coins',
    visual: {
      location: 'ABOVE main reels — column containers',
      appearance: [
        { label: 'Columns', text: '5 containers that fill with GOLD COINS' },
        { label: 'Visual', text: 'Coins stack up visibly' },
        { label: 'Trigger', text: 'Coins "fall" when columns fill' },
      ],
      colors: 'Various themes',
      example: 'Multiple columns half full'
    },
    thresholdSummary: 'Multiple columns more than half full',
    thresholdDetail: 'Coins accumulate in containers above each reel.',
    threshold: {
      play: 'Multiple columns visually more than half full'
    },
    notes: 'Check all bet levels.',
    checkBetLevels: true
  },

  {
    id: 'rich-little-piggies',
    category: 'banked-coins',
    name: 'Rich Little Piggies',
    shortName: 'Rich Little Piggies',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Three piggy banks that grow FATTER',
    visual: {
      location: 'Three colored piggy banks',
      appearance: [
        { label: 'Pigs', text: 'BLUE, YELLOW, RED piggy banks' },
        { label: 'KEY CUE', text: 'Pigs VISUALLY GROW FATTER', highlight: true },
        { label: 'State', text: 'FAT = lots banked' },
      ],
      colors: 'Cartoon pig theme',
      example: 'Both blue AND yellow pigs fat'
    },
    thresholdSummary: 'Blue AND yellow pigs both FAT',
    thresholdDetail: 'Visual "fatness" correlates with coins banked.',
    threshold: {
      play: 'Blue AND yellow pigs both visibly fat'
    },
    warning: 'CONTROVERSIAL — high variance.',
    checkBetLevels: false
  },

  {
    id: 'piggy-bankin',
    category: 'banked-coins',
    name: 'Piggy Bankin\'',
    shortName: 'Piggy Bankin\'',
    tier: 3,
    manufacturer: 'WMS Classic',
    quickId: 'CLASSIC 3-reel with 9 piggy banks in top box',
    visual: {
      location: 'TOP BOX above mechanical reels',
      appearance: [
        { label: 'Cabinet', text: 'OLDER 3-REEL MECHANICAL slot' },
        { label: 'Top box', text: '9 cartoon PIGGY BANKS in a row' },
        { label: 'Mechanic', text: '510 coins across 9 pigs' },
      ],
      colors: 'Classic WMS style',
      example: 'Fewer pigs = closer to bonus'
    },
    thresholdSummary: '≤3 piggies remaining',
    thresholdDetail: 'Fewer pigs = fewer coins before lucky one.',
    threshold: {
      conservative: '3 or fewer piggies remaining',
      aggressive: '4-5 remaining'
    },
    notes: 'CLASSIC MACHINE — increasingly RARE.',
    checkBetLevels: false
  },
  
  // =============================================
  // ADDITIONAL TIER 1 MACHINES
  // =============================================

  {
    id: 'scarab-link',
    name: 'Scarab Link',
    shortName: 'Scarab Link',
    category: 'cycle-bonus',
    tier: 1,
    manufacturer: 'IGT',
    quickId: '10-spin cycle — scarabs collected on spins 1-9 go WILD on spin 10',
    visual: {
      location: 'Counter showing which spin you\'re on (1-10)',
      appearance: [
        { label: 'Counter', text: 'Shows current spin number out of 10', highlight: true },
        { label: 'Scarabs', text: 'Beetle symbols collected during spins 1-9' },
        { label: 'Spin 10', text: 'ALL collected scarabs turn WILD' },
      ],
      colors: 'Egyptian gold/blue theme with scarab beetles',
      example: 'Spin 7 with 5 scarabs collected = good setup'
    },
    thresholdSummary: 'Spin 7+ with 3+ scarabs collected',
    thresholdDetail: 'The later in the cycle with more scarabs = more wilds on spin 10.',
    threshold: {
      conservative: 'Spin 8-9 with 4+ scarabs',
      aggressive: 'Spin 7+ with 3+ scarabs',
      best: 'Spin 9 with 5+ scarabs'
    },
    notes: 'Very common machine. Easy to spot cycle counter.',
    checkBetLevels: true
  },

  {
    id: 'treasure-ball',
    name: 'Treasure Ball',
    shortName: 'Treasure Ball',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Treasure chest that fills with gold coins above reels',
    visual: {
      location: 'Treasure chest display ABOVE the reels',
      appearance: [
        { label: 'Chest', text: 'Animated treasure chest that fills with coins' },
        { label: 'Coins', text: 'Gold coins visually stack up in chest' },
        { label: 'Trigger', text: 'When full, triggers bonus round' },
      ],
      colors: 'Gold/brown pirate treasure theme',
      example: 'Chest 75%+ full = worth playing'
    },
    thresholdSummary: 'Chest more than half full',
    thresholdDetail: 'Visual inspection - the fuller the chest, the closer to bonus.',
    threshold: {
      conservative: '75%+ full',
      aggressive: '50%+ full'
    },
    notes: 'Check all bet levels - each independent.',
    checkBetLevels: true
  },

  {
    id: 'wonka-3-reel',
    name: 'Willy Wonka 3-Reel',
    shortName: 'Wonka 3-Reel',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'WMS',
    quickId: 'Oompa Loompa meters on sides tracking progress to features',
    visual: {
      location: 'Side panels showing Oompa Loompa character meters',
      appearance: [
        { label: 'Meters', text: 'Multiple character meters (Oompa Loompas, etc.)' },
        { label: 'Progress', text: 'Bars fill up as symbols land' },
        { label: 'Features', text: 'Different bonuses for each character' },
      ],
      colors: 'Colorful Wonka chocolate factory theme',
      example: 'Multiple meters at 75%+'
    },
    thresholdSummary: 'Any meter at 75%+ OR multiple meters at 50%+',
    thresholdDetail: 'Each meter triggers a different bonus when full.',
    threshold: {
      conservative: 'Any meter at 80%+',
      aggressive: '2+ meters at 50%+'
    },
    notes: 'Multiple versions exist - look for the banked meters.',
    checkBetLevels: false
  },

  // =============================================
  // ADDITIONAL MACHINES FROM RESEARCH
  // =============================================

  {
    id: 'prosperity-pearl',
    name: 'Prosperity Pearl',
    shortName: 'Prosperity Pearl',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Sister game to Regal Riches - three colored pearl meters + hidden center meter',
    visual: {
      location: 'Three large meters at top (purple/green/gold) + small center meter above reel 3',
      appearance: [
        { label: 'Main Meters', text: 'Purple (MHB 75), Green (MHB 100), Gold (MHB 125)' },
        { label: 'Center Meter', text: 'Small meter above reel 3, starts at 5, KEY for advantage plays', highlight: true },
        { label: 'Pearls', text: 'Colored pearls on reels increase corresponding meters' },
      ],
      colors: 'Ocean blue theme with pearls',
      example: 'Center meter at 8+ = playable'
    },
    thresholdSummary: 'Center meter 8+ OR main meters at 63/83/113',
    thresholdDetail: 'Hidden center meter triggers random wilds. Main meters: Purple 63+, Green 83+, Gold 113+ (assuming others at reset).',
    threshold: {
      conservative: 'Center meter 10+',
      aggressive: 'Center meter 8+',
      mainMeters: 'Purple 63, Green 83, Gold 113'
    },
    notes: 'CHECK ALL BET LEVELS - center meter varies! Tap each bet to see it.',
    checkBetLevels: true
  },

  {
    id: 'dragonsphere',
    name: 'DragonSphere',
    shortName: 'DragonSphere',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Ocean Magic clone - orbs float DOWN instead of up',
    visual: {
      location: 'On the reels - look for glowing orbs ABOVE the top row',
      appearance: [
        { label: 'Orbs', text: 'Glowing wild orbs that float DOWN one row per spin' },
        { label: 'Direction', text: 'Orbs come from TOP (opposite of Ocean Magic)', highlight: true },
        { label: 'Dragon symbols', text: 'If orb lands on dragon, expands to adjacent spots' },
      ],
      colors: 'Dragon/fire theme, red and gold',
      example: 'Orbs visible in top rows on reels 1-4 = playable'
    },
    thresholdSummary: 'Orbs in rows 1-4 on reels 1-4 (ignore reel 5)',
    thresholdDetail: 'Same as Ocean Magic but orbs descend. Ignore reel 5 (pays left-to-right) and bottom row (about to exit).',
    threshold: {
      conservative: 'Multiple orbs in rows 1-3 on reels 1-4',
      aggressive: 'Any orb in good position',
      quit: 'All orbs have fallen off bottom'
    },
    notes: 'Less scouted than Ocean Magic - may find more plays.',
    checkBetLevels: true
  },

  {
    id: 'legends-fire-water',
    name: 'Legends of Fire and Water',
    shortName: 'Legends Fire/Water',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'Spielo/GTECH',
    quickId: 'Dragon wild stack meters above reels 1, 3, and 5',
    visual: {
      location: 'Meters ABOVE reels 1, 3, and 5 showing wild count',
      appearance: [
        { label: 'Meters', text: 'Numbers above reels 1, 3, 5 showing accumulated wilds' },
        { label: 'Yin-Yang', text: 'Gold yin-yang adds 1-3 wilds, broken reduces by 10-100%' },
        { label: 'Dragon', text: 'Full wild dragon adds 5 to that reel\'s meter' },
      ],
      colors: 'Asian dragon theme with fire/water elements',
      example: 'Columns 1 & 3 in high teens = playable'
    },
    thresholdSummary: 'Columns 1 & 3 in high teens OR either over 20',
    thresholdDetail: 'Focus on columns 1 & 3 (most valuable). Column 5 count doesn\'t matter for play decision.',
    threshold: {
      conservative: 'Both columns 1 & 3 at 17+',
      aggressive: 'Either column 1 or 3 over 20',
      quit: 'When broken yin-yangs drop meters below threshold'
    },
    notes: 'Streaky game - losses usually small, positive runs can be great.',
    checkBetLevels: true
  },

  {
    id: 'progressive-free-games',
    name: 'Progressive Free Games (Triple Double Diamond / Phoenix)',
    shortName: 'Progressive Free Games',
    category: 'cycle-bonus',
    tier: 1,
    manufacturer: 'IGT',
    quickId: '3-reel with three MHB free game meters (2x, 5x, 10x) - must hit by 15',
    visual: {
      location: 'Three meters on screen showing free games remaining until trigger',
      appearance: [
        { label: '2x Meter', text: 'Red meter - 2x multiplier free games (cycles every ~48 spins)' },
        { label: '5x Meter', text: 'Green meter - 5x multiplier free games (cycles every ~175 spins)' },
        { label: '10x Meter', text: 'Blue meter - 10x multiplier free games (cycles every ~600 spins)', highlight: true },
      ],
      colors: 'Classic 3-reel look (Triple Double Diamond or Phoenix theme)',
      example: '10x meter at 14 = very playable'
    },
    thresholdSummary: '12+ red, 13+ green, 14+ blue',
    thresholdDetail: 'Meters move on fixed cycles. At 15 it triggers. Higher multiplier = better payout potential.',
    threshold: {
      conservative: '14 on any meter',
      aggressive: '12 red, 13 green, 14 blue',
      best: '14 on the 10x (blue) meter'
    },
    notes: 'Very popular among APs. Meters are competitive - take plays when you find them.',
    checkBetLevels: false
  },

  {
    id: 'treasure-box-igt',
    name: 'Treasure Box',
    shortName: 'Treasure Box',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Coin counter showing coins needed to trigger respin bonus (starts at 6)',
    visual: {
      location: 'Top screen shows coin count needed for respin bonus',
      appearance: [
        { label: 'Counter', text: 'Number showing coins needed (starts at 6, decreases)', highlight: true },
        { label: 'Key Symbol', text: 'Key on reel 3 reduces counter by 1' },
        { label: 'Respin Bonus', text: 'Collect coins, multipliers, and progressive jewels' },
      ],
      colors: 'Pirate treasure theme',
      example: 'Counter at 3 or less = good play'
    },
    thresholdSummary: '4 or less coins needed',
    thresholdDetail: 'Counter starts at 6, decreases as coins land or keys appear. Play until you trigger respin bonus.',
    threshold: {
      conservative: '3 or less',
      aggressive: '4 or less',
      skip: '5 or more'
    },
    notes: 'CHECK ALL BET LEVELS - each is independent. Higher bets = higher variance.',
    checkBetLevels: true
  },

  {
    id: 'jackpot-explosion',
    name: 'Jackpot Explosion',
    shortName: 'Jackpot Explosion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    quickId: 'Community volcano that fills with lava - erupts to award progressive',
    visual: {
      location: 'Shared volcano display above bank of linked machines',
      appearance: [
        { label: 'Volcano', text: 'Animated volcano that fills with lava' },
        { label: 'Lava Level', text: 'Higher = closer to eruption', highlight: true },
        { label: 'Progressives', text: 'Four progressives awarded when volcano erupts' },
      ],
      colors: 'Red/orange volcanic theme',
      example: 'Lava near very top = worth playing'
    },
    thresholdSummary: 'Lava near very top of volcano',
    thresholdDetail: 'Community game - consider how many others are playing and their bet sizes.',
    threshold: {
      conservative: 'Lava at 90%+ of volcano height',
      aggressive: 'Lava at 80%+ with low-betting opponents'
    },
    notes: 'Not a primary AP target - good backup when other plays are cleaned out.',
    checkBetLevels: false
  },

  {
    id: 'spy-vs-spy',
    name: 'Spy vs Spy',
    shortName: 'Spy vs Spy',
    category: 'banked-coins',
    tier: 3,
    manufacturer: 'WMS',
    quickId: 'OLDER game - Black and White spy meters on sides',
    visual: {
      location: 'Spy meters on left and right sides of screen',
      appearance: [
        { label: 'Black Spy', text: 'Meter on one side' },
        { label: 'White Spy', text: 'Meter on other side' },
        { label: 'Bonus', text: 'Triggers when either spy meter fills' },
      ],
      colors: 'Black and white MAD Magazine comic style',
      example: 'Either spy meter nearly full'
    },
    thresholdSummary: 'Either spy meter 80%+ full',
    thresholdDetail: 'Older game - increasingly rare but still found in some casinos.',
    threshold: {
      conservative: 'Either meter 90%+',
      aggressive: 'Either meter 75%+'
    },
    notes: 'RARE - based on MAD Magazine comic. Worth playing if you find one.',
    checkBetLevels: false
  },

  {
    id: 'dice-seeker',
    name: 'Dice Seeker',
    shortName: 'Dice Seeker',
    category: 'cycle-bonus',
    tier: 2,
    manufacturer: 'Everi',
    quickId: 'Dice symbols accumulate - bonus triggers when you collect enough',
    visual: {
      location: 'Dice counter/meter on screen',
      appearance: [
        { label: 'Dice', text: 'Dice symbols land and accumulate' },
        { label: 'Counter', text: 'Shows progress toward bonus' },
        { label: 'Bonus', text: 'Triggered when threshold reached' },
      ],
      colors: 'Varies by theme',
      example: 'High dice count = playable'
    },
    thresholdSummary: 'High dice accumulation (varies by version)',
    thresholdDetail: 'Feature attached to various Everi slot themes.',
    threshold: {
      conservative: 'Counter very close to triggering',
      aggressive: 'Counter past halfway'
    },
    notes: 'Newer manufacturer - watch for this feature on Everi cabinets.',
    checkBetLevels: true
  },

  {
    id: 'green-stamps',
    name: 'S&H Green Stamps',
    shortName: 'Green Stamps',
    category: 'banked-coins',
    tier: 3,
    manufacturer: 'Bally',
    quickId: 'CLASSIC - Stamp book fills with green stamps (1x, 2x, 5x multipliers)',
    visual: {
      location: 'Stamp book display showing collected stamps',
      appearance: [
        { label: 'Book', text: 'Visual stamp book that fills up' },
        { label: 'Stamps', text: 'Green stamps with 1x, 2x, 5x multipliers' },
        { label: 'Bonus', text: 'When book is full, free games trigger' },
      ],
      colors: 'Retro green stamp theme',
      example: 'Book nearly full = strong play'
    },
    thresholdSummary: 'Book mostly full (visual inspection)',
    thresholdDetail: 'Need at least 2000 credits bankroll per denomination.',
    threshold: {
      conservative: 'Book 90%+ full',
      aggressive: 'Book 75%+ full'
    },
    warning: 'VERY RARE machine - classic that\'s nearly extinct.',
    notes: 'One of the original advantage slots. If you find one, consider yourself lucky.',
    checkBetLevels: false
  },

  {
    id: 'star-watch-magma',
    name: 'Star Watch Magma',
    shortName: 'Star Watch Magma',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    quickId: 'Volcano wheel at top with star symbols that award instant prizes',
    visual: {
      location: 'Large volcano wheel display at top of tall cabinet',
      appearance: [
        { label: 'Stars', text: 'Star symbols on reels award credit prizes or wheel spins' },
        { label: 'Volcano Wheel', text: 'Spin for Mini/Major/Mega/Maxi prizes' },
        { label: 'Strike Zone', text: 'Higher bets activate more reels for stars' },
      ],
      colors: 'Space/volcano theme with fiery colors',
      example: 'Multiple pending wheel spins = playable'
    },
    thresholdSummary: 'Multiple accumulated wheel spins OR high progressive',
    thresholdDetail: 'Check if previous player left wheel spins. Maxi resets at $5,000, Major at $500.',
    threshold: {
      conservative: '3+ wheel spins banked',
      aggressive: '2+ wheel spins with high progressive'
    },
    notes: 'Requires extra bet for full features. 43-inch tall cabinet.',
    checkBetLevels: true
  },

  {
    id: 'rescue-spin',
    name: 'Rescue Spin (Aruze games)',
    shortName: 'Rescue Spin',
    category: 'cycle-bonus',
    tier: 2,
    manufacturer: 'Aruze',
    quickId: 'Countdown meter to guaranteed bonus (usually 500 spins) with multiplier',
    visual: {
      location: 'Right side of screen - countdown number + multiplier',
      appearance: [
        { label: 'Countdown', text: 'Number showing spins until guaranteed bonus (starts ~500)' },
        { label: 'Multiplier', text: 'Average bet per line throughout play (1x-5x)', highlight: true },
        { label: 'Activation', text: 'May need to press button to activate (costs 5¢)' },
      ],
      colors: 'Varies by theme (Shen Long, Last Emperor, etc.)',
      example: '200 spins remaining with 3x+ multiplier'
    },
    thresholdSummary: '200 or fewer spins remaining (adjust for multiplier)',
    thresholdDetail: 'Higher multiplier = take at higher spin counts. Low multiplier (1-1.5x) = wait for ~150.',
    threshold: {
      conservative: '150 or less with any multiplier',
      aggressive: '225 or less with 3.5x+ multiplier',
      ideal: '100 or less with high multiplier'
    },
    notes: 'ACTIVATE RESCUE SPIN if not already on (press button, costs 5¢). Less common now.',
    checkBetLevels: false
  },

  // =============================================
  // NEW 2022-2025 MACHINES (from machinepro.club)
  // =============================================
  
  // --- WHEEL OF FORTUNE FAMILY ---

  {
    id: 'wof-4d',
    name: 'Wheel of Fortune 4D',
    shortName: 'WOF 4D',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Dollar symbol holders above reels - collect 2 to turn reel wild for 2 spins',
    visual: {
      location: 'Above each reel - small holders showing collected $ symbols',
      appearance: [
        { label: 'Collectors', text: 'Small boxes above each reel (hold 0-2 dollar symbols)' },
        { label: 'Wild Reels', text: 'When holder has 2, that reel turns wild for 2 spins', highlight: true },
        { label: 'Cabinet', text: '4D cabinet with physical spinning wheel on top' },
      ],
      colors: 'Blue/purple with iconic WOF wheel',
      example: 'Reels 2 and 4 have 1 dollar symbol each collected'
    },
    thresholdSummary: 'Any reel with 1+ collected',
    thresholdDetail: 'Look for 1 or more dollar symbols collected above any reel. Multiple reels with 1 = better play.',
    threshold: {
      conservative: '2+ reels with 1 symbol each',
      aggressive: 'Any reel with 1 symbol',
      ideal: '3+ reels with 1 symbol each'
    },
    notes: 'Very common on floors. Easier version of Golden Egypt mechanic.',
    checkBetLevels: false
  },

  {
    id: 'wof-4d-collectors',
    name: 'Wheel of Fortune 4D Collector\'s Edition',
    shortName: 'WOF 4D Collectors',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Credit prizes above reels that build up - Collect symbol awards them',
    visual: {
      location: 'Above each reel - credit prize amounts that grow',
      appearance: [
        { label: 'Prize Display', text: 'Credit amounts above each reel (grow as coins land)', highlight: true },
        { label: 'Collect', text: 'Landing Collect symbol in reel awards that prize' },
        { label: 'Reset', text: 'Prize resets after collection' },
      ],
      colors: 'Blue/purple WOF theme',
      example: 'Reel 3 shows $45.00 credit prize built up'
    },
    thresholdSummary: 'Any prize 25x+ bet or higher',
    thresholdDetail: 'Credit prizes above reels should be significantly above starting value.',
    threshold: {
      conservative: 'Any prize 30x+ bet',
      aggressive: 'Any prize 20x+ bet',
      ideal: 'Multiple prizes 25x+ bet'
    },
    notes: 'Different from regular WOF 4D - this collects credit values.',
    checkBetLevels: true
  },

  {
    id: 'wof-high-roller',
    name: 'Wheel of Fortune High Roller',
    shortName: 'WOF High Roller',
    category: 'expanding-reels',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Reels expand from 3 to 8 high - arrows above reels track height',
    visual: {
      location: 'Above reels - wheel spin awards; Reels visibly different heights',
      appearance: [
        { label: 'Reel Height', text: 'Reels start 3 high, expand to max 8', highlight: true },
        { label: 'Wheel Awards', text: 'Awards above each reel (multi-pointer, multiplier wheels)' },
        { label: 'Trigger', text: 'High Roller symbol on max height reel triggers wheel' },
      ],
      colors: 'Premium WOF cabinet',
      example: 'Reels at heights 5-6-7-5-4'
    },
    thresholdSummary: 'Any reel at 6+ height',
    thresholdDetail: 'Higher reels = closer to triggering wheel awards. Look for reels approaching 8.',
    threshold: {
      conservative: 'Any reel at 7+',
      aggressive: 'Any reel at 6+',
      ideal: 'Multiple reels at 6+'
    },
    notes: 'Higher bet levels = faster reel expansion.',
    checkBetLevels: true
  },

  // --- IGT GRAND SERIES (Updated classics) ---

  {
    id: 'golden-egypt-grand',
    name: 'Golden Egypt Grand',
    shortName: 'Golden Egypt Grand',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Coin holders above reels - fill holder for wild reel (2-4 spins)',
    visual: {
      location: 'Above each reel - coin collection holders',
      appearance: [
        { label: 'Holders', text: 'Show collected coins above each reel', highlight: true },
        { label: 'Wild Duration', text: '2, 3, or 4 spins wild based on coins collected' },
        { label: 'Theme', text: 'Egyptian pyramid/pharaoh theme' },
      ],
      colors: 'Gold and blue Egyptian theme',
      example: 'Reel 3 has 3/4 coins collected'
    },
    thresholdSummary: 'Any reel with 2+ coins of 4',
    thresholdDetail: 'More coins = closer to wild reel. 3/4 coins is ideal find.',
    threshold: {
      conservative: 'Any reel at 3/4 coins',
      aggressive: 'Any reel at 2/4 coins',
      ideal: 'Multiple reels at 2+ coins'
    },
    notes: 'Updated version of classic Golden Egypt. Very common.',
    checkBetLevels: false
  },

  {
    id: 'golden-jungle-grand',
    name: 'Golden Jungle Grand',
    shortName: 'Golden Jungle Grand',
    category: 'cycle-bonus',
    tier: 1,
    manufacturer: 'IGT',
    quickId: '10-spin cycle - collect Buddha symbols above reels for wild reels on spin 10',
    visual: {
      location: 'Above reels - Buddha collection + spin counter (1-10)',
      appearance: [
        { label: 'Spin Counter', text: 'Shows current spin in 10-spin cycle (1-10)', highlight: true },
        { label: 'Buddha Symbols', text: 'Collected above each reel (need 2 for wild)' },
        { label: 'Reset', text: 'Cycle resets after spin 10' },
      ],
      colors: 'Gold jungle theme',
      example: 'Spin 7/10, reels 2 and 4 have 2 Buddhas each'
    },
    thresholdSummary: 'Spin 5+ with 2+ reels having 2 Buddhas',
    thresholdDetail: 'The later in cycle + more Buddhas = better. Need 2 Buddhas per reel for wild.',
    threshold: {
      conservative: 'Spin 7+ with 2+ wild reels ready',
      aggressive: 'Spin 5+ with 2+ wild reels ready',
      ideal: 'Spin 8+ with 3+ wild reels ready'
    },
    notes: 'Easy to see cycle progress. 10-spin limit makes bankroll predictable.',
    checkBetLevels: false
  },

  {
    id: 'ocean-magic-grand',
    name: 'Ocean Magic Grand',
    shortName: 'Ocean Magic Grand',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Wild bubbles float UP one row per spin - land on Ocean Magic symbol for expanding wilds',
    visual: {
      location: 'On the reels - bubbles with "WILD" text floating upward',
      appearance: [
        { label: 'Bubbles', text: 'Wild bubbles on reels that move UP each spin', highlight: true },
        { label: 'Target', text: 'Ocean Magic symbol - bubble landing on it expands wilds' },
        { label: 'Movement', text: 'Bubbles rise one row per spin' },
      ],
      colors: 'Blue underwater ocean theme',
      example: 'Bubbles in rows 2-3 on reels 1,3,4'
    },
    thresholdSummary: 'Multiple bubbles in lower rows (1-3)',
    thresholdDetail: 'Bubbles in lower rows have more spins to potentially hit Ocean Magic symbols.',
    threshold: {
      conservative: '3+ bubbles in rows 1-3',
      aggressive: '2+ bubbles in rows 1-4',
      ideal: '4+ bubbles spread across lower rows'
    },
    notes: 'Updated version of Ocean Magic. Ignore reel 5 bubbles (less valuable).',
    checkBetLevels: false
  },

  // --- POPULAR 2023-2025 RELEASES ---

  {
    id: 'lucky-pick',
    name: 'Lucky Pick',
    shortName: 'Lucky Pick',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Board above reels with 21 covered picks - reveal credit prizes and upgrades',
    visual: {
      location: 'Above reels - 4x5+ grid of covered pick squares',
      appearance: [
        { label: 'Pick Board', text: '21 covered squares above reels', highlight: true },
        { label: 'Revealed', text: 'Some picks may already be revealed (credit values or upgrades)' },
        { label: 'Trigger', text: 'Lucky Pick symbol reveals one pick; 3 scatters = free games' },
      ],
      colors: 'Varies (Bumble Bee, Cash Tree, Leprechaun themes)',
      example: '8 picks revealed, several showing upgrade icons'
    },
    thresholdSummary: '8+ picks revealed with upgrades showing',
    thresholdDetail: 'More revealed picks (especially upgrades) = better bonus when triggered.',
    threshold: {
      conservative: '10+ picks revealed',
      aggressive: '6+ picks revealed with 2+ upgrades',
      ideal: '12+ picks with multiple upgrades'
    },
    notes: 'MOST LUCRATIVE newer AP game per machinepro.club. Complex but huge wins possible.',
    checkBetLevels: true
  },

  {
    id: 'dancing-drums-golden',
    name: 'Dancing Drums: Golden Drums',
    shortName: 'DD Golden Drums',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    quickId: 'Multiplier above reel 1 (starts 2x) - persists until used in Golden Respin',
    visual: {
      location: 'Above reel 1 / on bet pad - multiplier value (2x, 3x, etc.)',
      appearance: [
        { label: 'Multiplier', text: 'Current multiplier shown above first reel', highlight: true },
        { label: 'Build Up', text: 'Drum +1 symbols increment multiplier' },
        { label: 'Golden Respin', text: 'Drum in reels 1+2 triggers feature using multiplier' },
      ],
      colors: 'Red/gold Dancing Drums theme',
      example: 'Multiplier showing 5x above reel 1'
    },
    thresholdSummary: 'Multiplier at 4x or higher',
    thresholdDetail: 'Higher multiplier = bigger wins when Golden Respin triggers.',
    threshold: {
      conservative: '5x+ multiplier',
      aggressive: '4x+ multiplier',
      ideal: '6x+ multiplier'
    },
    notes: 'Different from regular Dancing Drums. Look for "Golden Drums" subtitle.',
    checkBetLevels: false
  },

  {
    id: 'dragon-unleashed',
    name: 'Dragon Unleashed',
    shortName: 'Dragon Unleashed',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Orbs with credits fall DOWN one row per spin - 6 orbs triggers hold & spin',
    visual: {
      location: 'On reels - orbs with credit values that shift DOWN',
      appearance: [
        { label: 'Orbs', text: 'Credit value orbs on reels moving DOWN each spin', highlight: true },
        { label: 'Stacking', text: 'Orbs often stack vertically (up to 4 tall)' },
        { label: 'Trigger', text: '6 orbs on screen triggers hold & spin' },
      ],
      colors: 'Red/gold dragon theme (Prosperity Packets, Red Fleet, etc.)',
      example: 'Stack of 3 orbs in top rows of reel 2'
    },
    thresholdSummary: '4+ orbs visible in upper rows',
    thresholdDetail: 'Orbs in upper rows have more spins to accumulate to 6.',
    threshold: {
      conservative: '5+ orbs visible',
      aggressive: '4+ orbs in rows 1-2',
      ideal: '5+ orbs with stacked positions'
    },
    notes: 'Themes: Prosperity Packets, Red Fleet, Three Legends, Treasured Happiness.',
    checkBetLevels: false
  },

  {
    id: 'ultimate-fire-link-cash-falls',
    name: 'Ultimate Fire Link Cash Falls',
    shortName: 'UFL Cash Falls',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Fireballs fill columns - fill entire reel to win all credits in that column',
    visual: {
      location: 'On reels - fireballs with credit values + spin counters',
      appearance: [
        { label: 'Fireballs', text: 'Credit value fireballs on reels', highlight: true },
        { label: 'Counter', text: '3-spin countdown below each reel with fireballs' },
        { label: 'Fill Column', text: 'Fill entire reel before counter hits 0 = win all' },
      ],
      colors: 'Fire Link orange/red theme (China Street, Olvera Street)',
      example: 'Reel 3 has 3/4 positions filled, counter at 2'
    },
    thresholdSummary: 'Any column with 3+ fireballs',
    thresholdDetail: 'Close to filling a column with spins remaining = good play.',
    threshold: {
      conservative: 'Any column 3/4 full with counter 2+',
      aggressive: 'Any column 3/4 full with counter 1+',
      ideal: 'Multiple columns close to filling'
    },
    notes: 'Part of popular Fire Link family. Look for Fire Link Feature fireball.',
    checkBetLevels: true
  },

  {
    id: 'fu-dai-lian-lian-boost',
    name: 'Fu Dai Lian Lian Boost',
    shortName: 'FDLL Boost',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Three bags fill with coins/jewels - fuller bags = boosted bonus features',
    visual: {
      location: 'Above reels - 3 bags (different colors) showing fill level',
      appearance: [
        { label: 'Bags', text: 'Three colored bags above reels', highlight: true },
        { label: 'Fill Level', text: 'Bags get fatter and show jewels when full' },
        { label: 'Boost', text: 'Full bags = enhanced bonus features (NOT closer to triggering)' },
      ],
      colors: 'Red/gold Asian theme with peacock/tiger variants',
      example: 'Two bags showing jewels (glowing)'
    },
    thresholdSummary: '2+ bags with jewels showing',
    thresholdDetail: 'Jewels mean bag is full and bonus will be "boosted" when it hits.',
    threshold: {
      conservative: 'All 3 bags with jewels',
      aggressive: '2+ bags with jewels',
      ideal: 'All 3 bags with jewels + high progressive'
    },
    notes: 'IMPORTANT: Fuller bags do NOT mean bonus is closer - just better when it hits.',
    checkBetLevels: false,
    warning: 'Bags being full does NOT increase trigger chance - only improves bonus quality!'
  },

  {
    id: 'phoenix-link',
    name: 'Phoenix Link',
    shortName: 'Phoenix Link',
    category: 'cycle-bonus',
    tier: 1,
    manufacturer: 'Aristocrat',
    quickId: 'Phoenix counter resets 100-1500, MUST HIT BY 1888',
    visual: {
      location: 'Counter showing phoenix symbols collected',
      appearance: [
        { label: 'Counter', text: 'Shows current phoenix count (resets 100-1500)', highlight: true },
        { label: 'MHB', text: 'Must hit by 1888' },
        { label: 'Trigger', text: 'Accumulate phoenix symbols for hold & spin' },
      ],
      colors: 'Red/orange phoenix fire theme',
      example: 'Counter at 1650/1888'
    },
    thresholdSummary: '1700+ on counter (90% of 1888)',
    thresholdDetail: 'Standard MHB math: counter ÷ 1888 × 100.',
    threshold: {
      conservative: '1700+ (90%)',
      aggressive: '1600+ (85%)',
      ideal: '1750+ (93%)'
    },
    notes: 'From Aristocrat - different from IGT games. Very popular.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'ultra-rush-gold',
    name: 'Ultra Rush Gold',
    shortName: 'Ultra Rush Gold',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'Everi',
    quickId: 'Gold scatters lock for 3 spins - 6 scatters triggers bonus',
    visual: {
      location: 'On reels - gold scatter symbols with lock counters',
      appearance: [
        { label: 'Scatters', text: 'Gold symbols that lock for 3 spins when they land', highlight: true },
        { label: 'Counter', text: 'Each scatter shows spins remaining (3→2→1→gone)' },
        { label: 'Goal', text: 'Get 6 scatters on screen simultaneously' },
      ],
      colors: 'Gold theme (African Adventure, Mythical Phoenix, Tiger Run)',
      example: '4 scatters visible with mixed counters'
    },
    thresholdSummary: '4+ scatters visible',
    thresholdDetail: 'More scatters with higher counters = better chance to reach 6.',
    threshold: {
      conservative: '5+ scatters on screen',
      aggressive: '4+ scatters with 2+ showing 3 spins',
      ideal: '5+ scatters with most at 2-3 spins'
    },
    notes: 'Everi game - less common than IGT but solid when found.',
    checkBetLevels: false
  },

  {
    id: 'power-push',
    name: 'Power Push',
    shortName: 'Power Push',
    category: 'cycle-bonus',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Coin pusher tray - coins stack in back, push triggers at 300 coins (12 full stacks)',
    visual: {
      location: 'Above reels - coin pusher tray with stacks and prizes',
      appearance: [
        { label: 'Stacks', text: '12 stacks of coins in back of tray (25 coins each)', highlight: true },
        { label: 'Prizes', text: 'Credit values and jackpots on the tray' },
        { label: 'Push', text: 'MHB at 300 coins total (12 full stacks)' },
      ],
      colors: 'Jin Gou or Long De Xiyue theme',
      example: '9 stacks full, 10th partially filled'
    },
    thresholdSummary: '250+ coins collected (83%+)',
    thresholdDetail: 'Count stacks: each full stack = 25 coins. 10+ full stacks = good play.',
    threshold: {
      conservative: '270+ coins (10.8 stacks)',
      aggressive: '250+ coins (10 stacks)',
      ideal: '280+ coins (11+ stacks)'
    },
    notes: 'Unique coin pusher mechanic. Also check what prizes are visible on tray.',
    checkBetLevels: false
  },

  {
    id: 'rich-little-piggies-2',
    name: 'Rich Little Piggies Hog Wild / Meal Ticket',
    shortName: 'RLP Hog Wild',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    quickId: 'Three pigs that get fatter - blue (spins), yellow (jackpots), red (wilds/symbols)',
    visual: {
      location: 'Above reels - 3 pigs (blue, yellow, red) at varying sizes',
      appearance: [
        { label: 'Pigs', text: 'Three pigs that grow fatter as features build', highlight: true },
        { label: 'Blue', text: 'Increasing free games count' },
        { label: 'Yellow', text: 'Better jackpot chances' },
        { label: 'Red', text: 'Guaranteed wilds (Hog Wild) or symbol removal (Meal Ticket)' },
      ],
      colors: 'Colorful farm/pig theme',
      example: 'All 3 pigs visibly fat'
    },
    thresholdSummary: 'All 3 pigs visibly fat',
    thresholdDetail: 'Fatter pigs = better features when bonus triggers. NOT closer to triggering.',
    threshold: {
      conservative: 'All 3 pigs at max fat',
      aggressive: '2+ pigs very fat',
      ideal: 'All 3 pigs max fat + coins visible'
    },
    notes: 'Like FDLL Boost - fat pigs improve bonus quality, NOT trigger chance.',
    warning: 'Fat pigs do NOT increase trigger probability!',
    checkBetLevels: false
  },

  {
    id: 'crackin-cash',
    name: 'Crackin\' Cash',
    shortName: 'Crackin Cash',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Three balloons above each reel - rocket symbols award balloon prizes',
    visual: {
      location: 'Above each reel - 3 stacked balloons with credit values',
      appearance: [
        { label: 'Balloons', text: 'Purple (small), green (larger), jackpot balloons above reels', highlight: true },
        { label: 'Values', text: 'Credit values shown on balloons' },
        { label: 'Rockets', text: 'Single rocket = 1 balloon; Triple rocket = all 3' },
      ],
      colors: 'Colorful balloon/celebration theme',
      example: 'Multiple green/jackpot balloons in bottom positions'
    },
    thresholdSummary: 'High-value balloons in bottom position',
    thresholdDetail: 'Balloons push up when new ones land. Bottom balloon = next to be awarded.',
    threshold: {
      conservative: 'Jackpot balloon in bottom position on any reel',
      aggressive: 'Green balloon in bottom on 2+ reels',
      ideal: 'Multiple jackpot/green balloons in bottom positions'
    },
    notes: 'New balloons push old ones up. Track what\'s about to be awarded.',
    checkBetLevels: false
  },

  {
    id: 'bustin-money',
    name: 'Bustin\' Money',
    shortName: 'Bustin Money',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Three safes (red/green/blue) above reels - build up spins, ways, and multiplier',
    visual: {
      location: 'Above reels - 3 safes that get fatter as features build',
      appearance: [
        { label: 'Red Safe', text: 'Increasing free games count' },
        { label: 'Green Safe', text: 'Increasing ways to win' },
        { label: 'Blue Safe', text: 'Increasing multiplier', highlight: true },
        { label: 'Fat Level', text: 'Safes get fatter as they build' },
      ],
      colors: 'Red/green/blue safes',
      example: 'Blue safe visibly large, others medium'
    },
    thresholdSummary: 'Any safe visibly large/fat',
    thresholdDetail: 'Fatter safes = better features. Can trigger 1, 2, or all 3 together.',
    threshold: {
      conservative: 'All 3 safes showing fat',
      aggressive: '2+ safes fat',
      ideal: 'All 3 safes max fat'
    },
    notes: 'Like other persistent state - fat improves bonus, NOT trigger rate.',
    checkBetLevels: false
  },

  {
    id: 'cash-cano',
    name: 'Cash Cano',
    shortName: 'Cash Cano',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Four rows of gems above reels - fill row + unlock during hold & spin for jackpot',
    visual: {
      location: 'Above reels - 4 horizontal rows of gem positions',
      appearance: [
        { label: 'Rows', text: 'Minor, Maxi, Major, Grand rows', highlight: true },
        { label: 'Gems', text: 'Gems with credit values fill positions' },
        { label: 'Jackpot', text: '3 gems in row = jackpot eligible if row unlocks' },
      ],
      colors: 'Roman Riches or Tiki theme',
      example: 'Minor row has 2 gems, Major has 3 gems'
    },
    thresholdSummary: 'Any row with 2+ gems collected',
    thresholdDetail: '3 gems in a row enables jackpot. More gems = better hold & spin.',
    threshold: {
      conservative: '2+ rows with 2+ gems each',
      aggressive: 'Any row with 3 gems',
      ideal: 'Major/Grand row with 3 gems'
    },
    notes: 'Hold & spin must unlock rows by landing more gems. Higher rows = bigger jackpots.',
    checkBetLevels: true
  },

  {
    id: 'treasure-box-2',
    name: 'Treasure Box Kingdom/Dynasty',
    shortName: 'Treasure Box K/D',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Counter shows coins needed for respin - key symbols on reel 3 reduce count',
    visual: {
      location: 'Counter showing coins needed (starts at 6)',
      appearance: [
        { label: 'Counter', text: 'Number showing coins needed for bonus (6→5→4→...)', highlight: true },
        { label: 'Keys', text: 'Key on reel 3 reduces counter by 1' },
        { label: 'Trigger', text: 'Land required coins OR key when counter = 1' },
      ],
      colors: 'Kingdom or Dynasty Asian theme',
      example: 'Counter showing 3 coins needed'
    },
    thresholdSummary: '4 or less coins needed',
    thresholdDetail: 'Lower counter = easier to trigger bonus.',
    threshold: {
      conservative: '3 or less',
      aggressive: '4 or less',
      ideal: '2 or less'
    },
    notes: 'CHECK ALL BET LEVELS - each has independent counter!',
    checkBetLevels: true
  },

  {
    id: 'regal-riches-2',
    name: 'Regal Riches (MHB Wilds)',
    shortName: 'Regal Riches',
    category: 'banked-coins',
    tier: 1,
    manufacturer: 'IGT',
    quickId: 'Four colored MHB wild meters - blue (base), purple/green/yellow (free games)',
    visual: {
      location: 'Above middle reel - wild counters with MHB ceilings',
      appearance: [
        { label: 'Blue Wilds', text: 'Counter above reel 3, MHB 50 (base game)', highlight: true },
        { label: 'Purple', text: 'MHB 75 - Minor free games wilds' },
        { label: 'Green', text: 'MHB 100 - Major free games wilds' },
        { label: 'Yellow', text: 'MHB 125 - Mega free games wilds' },
      ],
      colors: 'Purple/regal theme',
      example: 'Blue at 42/50, Green at 88/100'
    },
    thresholdSummary: 'Any meter at 85%+ of ceiling',
    thresholdDetail: 'Blue: 43+. Purple: 64+. Green: 85+. Yellow: 106+.',
    threshold: {
      conservative: '90%+ on any meter',
      aggressive: '85%+ on any meter',
      ideal: 'Multiple meters at 85%+'
    },
    notes: 'Check ALL bet levels. Hidden center meter above reel 3 too!',
    hasCalculator: true,
    checkBetLevels: true
  },

  {
    id: 'diamond-collector',
    name: 'Diamond Collector',
    shortName: 'Diamond Collector',
    category: 'cycle-bonus',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Collect 15 diamonds to trigger free spins - counter shows progress',
    visual: {
      location: 'Diamond counter showing collected/15',
      appearance: [
        { label: 'Counter', text: 'Shows X/15 diamonds collected', highlight: true },
        { label: 'Themes', text: 'Wolfpack or Elite 7s variants' },
        { label: 'Trigger', text: '15 diamonds = free spins bonus' },
      ],
      colors: 'Blue diamond theme',
      example: 'Counter at 12/15'
    },
    thresholdSummary: '12+ diamonds collected',
    thresholdDetail: 'Higher count = fewer spins to trigger bonus.',
    threshold: {
      conservative: '13+ diamonds',
      aggressive: '11+ diamonds',
      ideal: '14 diamonds'
    },
    notes: 'Simple mechanic - just count diamonds.',
    checkBetLevels: false
  },

  {
    id: 'hyper-orbs',
    name: 'Hyper Orbs',
    shortName: 'Hyper Orbs',
    category: 'cycle-bonus',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Collect 15 orbs to trigger free spins bonus',
    visual: {
      location: 'Orb counter showing collected/15',
      appearance: [
        { label: 'Counter', text: 'Shows X/15 orbs collected', highlight: true },
        { label: 'Themes', text: 'King of the Seas or Dragon Sense' },
        { label: 'Trigger', text: '15 orbs = free spins' },
      ],
      colors: 'Blue/teal ocean or dragon theme',
      example: 'Counter at 11/15'
    },
    thresholdSummary: '12+ orbs collected',
    thresholdDetail: 'Same as Diamond Collector mechanic.',
    threshold: {
      conservative: '13+ orbs',
      aggressive: '11+ orbs',
      ideal: '14 orbs'
    },
    notes: 'Identical mechanic to Diamond Collector with different theme.',
    checkBetLevels: false
  },

  {
    id: 'top-up-fortunes',
    name: 'Top Up Fortunes',
    shortName: 'Top Up Fortunes',
    category: 'expanding-reels',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Reels expand from 3 to 6 high - symbols land to expand, counter shows spins at height',
    visual: {
      location: 'Reels at different heights + green spin counters in corners',
      appearance: [
        { label: 'Reel Height', text: 'Reels 3-6 symbols tall', highlight: true },
        { label: 'Counter', text: 'Green squares show spins remaining at current height' },
        { label: 'Expand', text: 'Volcano/trident symbols expand reels' },
      ],
      colors: 'Flame or Ocean theme',
      example: 'Reels at 5-6-4-5-3 heights'
    },
    thresholdSummary: 'Any reel at 5+ height',
    thresholdDetail: 'Taller reels = more ways + better line hits + Add Wild chance on max.',
    threshold: {
      conservative: '2+ reels at 5+ height',
      aggressive: 'Any reel at 5+ height',
      ideal: '3+ reels at 5+ with counters at 2-3'
    },
    notes: 'Max height reel (6) + expansion symbol = Add Wild feature.',
    checkBetLevels: false
  },

  {
    id: 'sumo-kitty',
    name: 'Sumo Kitty / Lucha Kitty',
    shortName: 'Sumo/Lucha Kitty',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    quickId: 'Gold frames lock on reels for 3 spins - coins in frames pay all connected frames',
    visual: {
      location: 'On reels - gold/glowing frames around certain positions',
      appearance: [
        { label: 'Frames', text: 'Gold frames that persist for 3 spins', highlight: true },
        { label: 'Connection', text: 'Connected frames pay together when coin lands in any' },
        { label: 'Counter', text: 'Frames show 3-2-1 countdown' },
      ],
      colors: 'Sumo (Japanese) or Lucha (Mexican wrestling) theme',
      example: 'Large connected frame cluster with high counters'
    },
    thresholdSummary: 'Large connected frame clusters',
    thresholdDetail: 'More connected frames = bigger potential payout.',
    threshold: {
      conservative: '8+ connected frames',
      aggressive: '6+ connected frames with 2+ spins',
      ideal: '10+ connected frames'
    },
    notes: 'Unique mechanic - coin in ANY connected frame pays ALL connected frames.',
    checkBetLevels: false
  },

  {
    id: 'aztec-vault',
    name: 'Aztec Vault / Cleopatra\'s Vault',
    shortName: 'Aztec/Cleo Vault',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Coin columns above reels - fill any column to win all coins on board',
    visual: {
      location: 'Above reels - vertical columns collecting coins with values',
      appearance: [
        { label: 'Columns', text: 'Coin collection columns above each reel', highlight: true },
        { label: 'Fill', text: 'Fill any column = win ALL coins on board' },
        { label: 'Reset', text: 'All coins clear after any column fills' },
      ],
      colors: 'Aztec gold or Egyptian Cleopatra theme',
      example: 'Column 3 has 4/5 coins, high values visible'
    },
    thresholdSummary: 'Any column with 4+ coins AND high values',
    thresholdDetail: 'Close to filling + high total value = good play.',
    threshold: {
      conservative: 'Any column 4/5 full with 100x+ total value',
      aggressive: 'Any column 4/5 full',
      ideal: 'Multiple columns 3-4/5 full with high values'
    },
    notes: 'Winning clears ALL coins - so total board value matters.',
    checkBetLevels: false
  },

  {
    id: 'lucky-coin-link',
    name: 'Lucky Coin Link',
    shortName: 'Lucky Coin Link',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Coin holders below reels - fill all 5 for respin feature',
    visual: {
      location: 'Below reels - 5 coin holder positions',
      appearance: [
        { label: 'Holders', text: '5 coin holders below reels (one per reel)', highlight: true },
        { label: 'Fill', text: 'All 5 filled = respin feature' },
        { label: 'Bet Level', text: 'Higher bets start with more coins collected' },
      ],
      colors: 'Asian Dreaming or Atlantica theme',
      example: '4/5 holders filled'
    },
    thresholdSummary: '4/5 holders filled at any bet level',
    thresholdDetail: 'Check all bet levels - higher bets start with more coins.',
    threshold: {
      conservative: '4/5 at max bet (starts with 3)',
      aggressive: '4/5 at any bet',
      ideal: '4/5 with high values on board'
    },
    notes: 'Highest bet starts with 3 coins, lowest starts with 0.',
    checkBetLevels: true
  },

  {
    id: 'dragon-spin-crosslink',
    name: 'Dragon Spin CrossLink',
    shortName: 'DS CrossLink',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Five gold bags above reels fill with gold - fuller bags = better Dragon Spin feature',
    visual: {
      location: 'Above reels - 5 bags showing fill level (empty to full of gold)',
      appearance: [
        { label: 'Bags', text: '5 bags above reels filling with gold', highlight: true },
        { label: 'Fill Level', text: 'More gold = larger credit prizes in feature' },
        { label: 'Trigger', text: 'Gold medallion can randomly trigger Dragon Spin' },
      ],
      colors: 'Air, Earth, Fire, or Water dragon themes',
      example: 'Bags 2 and 4 nearly full of gold'
    },
    thresholdSummary: 'Multiple bags 75%+ full',
    thresholdDetail: 'Fuller bags add bigger credit prizes to Dragon Spin reels.',
    threshold: {
      conservative: '3+ bags 75%+ full',
      aggressive: '2+ bags 75%+ full',
      ideal: '4+ bags nearly full'
    },
    notes: 'Bag fullness improves feature quality, NOT trigger rate.',
    checkBetLevels: false
  },

  {
    id: 'frankenstein',
    name: 'Frankenstein',
    shortName: 'Frankenstein',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Prize array above reels with multipliers - Power Up adds multipliers, It\'s Alive awards prizes',
    visual: {
      location: 'Above reels - array of jackpot and credit prizes with multiplier badges',
      appearance: [
        { label: 'Prizes', text: 'Jackpots (orange flame) and credits (blue) above', highlight: true },
        { label: 'Multipliers', text: 'Badges on prizes showing 2x, 3x, etc.' },
        { label: 'Power Up', text: 'Reel 1 symbol adds multipliers to prizes' },
      ],
      colors: 'Halloween/monster theme',
      example: 'Major jackpot showing 4x multiplier'
    },
    thresholdSummary: 'High multipliers on major prizes',
    thresholdDetail: 'Multipliers persist until It\'s Alive feature awards and resets them.',
    threshold: {
      conservative: '3x+ on Major/Grand jackpot',
      aggressive: '2x+ on multiple prizes',
      ideal: '4x+ on Grand jackpot'
    },
    notes: 'Unique mechanic - multipliers build on prizes until awarded.',
    checkBetLevels: false
  },

  {
    id: 'rising-phoenix',
    name: 'Rising Phoenix',
    shortName: 'Rising Phoenix',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Wheel with multipliers + flame meter (4 spots) - 4 phoenixes triggers multiplied spin',
    visual: {
      location: 'Wheel above reels with multiplier values + flame meter inside',
      appearance: [
        { label: 'Wheel', text: 'Multipliers around wheel (increase over time)', highlight: true },
        { label: 'Flame Meter', text: '4 spots inside wheel - fill for wheel spin' },
        { label: 'Phoenix', text: 'Landing phoenix fills meter + makes reel wild' },
      ],
      colors: 'Red/orange phoenix fire theme',
      example: 'Wheel showing 5x-8x multipliers, meter at 3/4'
    },
    thresholdSummary: 'Flame meter 3/4 AND high wheel multipliers',
    thresholdDetail: 'Wheel multipliers increase when meter fills without line hit.',
    threshold: {
      conservative: 'Meter 3/4 with wheel showing 6x+ average',
      aggressive: 'Meter 2/4 with wheel showing 8x+ average',
      ideal: 'Meter 3/4 with 10x+ multipliers visible'
    },
    notes: 'Multipliers build when no line hit on full meter. Very streaky.',
    checkBetLevels: false
  },

  {
    id: 'temple-falls',
    name: 'Temple Falls',
    shortName: 'Temple Falls',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: '5x7 grid of coins above reels - bottom row coins drop during feature',
    visual: {
      location: 'Above reels - 5 columns × 7 rows of coin prizes',
      appearance: [
        { label: 'Grid', text: '35 coin positions with credit values', highlight: true },
        { label: 'High Value', text: 'Red background coins = 12.5x+ value' },
        { label: 'Wheel', text: 'Wheel coins award jackpot spin' },
      ],
      colors: 'Temple/ancient ruins theme',
      example: 'Bottom row has 3 red (high value) coins'
    },
    thresholdSummary: 'High value coins in bottom row positions',
    thresholdDetail: 'Bottom coins are next to drop. Red = 12.5x+, Wheel = jackpot.',
    threshold: {
      conservative: '2+ red/wheel coins in bottom row',
      aggressive: '1+ wheel coin in bottom row',
      ideal: '3+ high value coins in bottom 2 rows'
    },
    notes: 'All coins eventually award - bottom row is next. Track high values.',
    checkBetLevels: false
  },

  {
    id: 'river-dragons',
    name: 'River Dragons / Fire Wolf 2',
    shortName: 'River Dragons',
    category: 'must-hit-by',
    tier: 2,
    manufacturer: 'AGS',
    quickId: 'Two MHB progressives: $500 and $5,000 ceilings',
    visual: {
      location: 'Top of cabinet - two progressive displays',
      appearance: [
        { label: 'Lower MHB', text: '$500 ceiling progressive', highlight: true },
        { label: 'Upper MHB', text: '$5,000 ceiling progressive' },
        { label: 'Themes', text: 'River Dragons, Fire Wolf 2, Forest Dragons, Wolf Queen' },
      ],
      colors: 'Dragon or wolf themes',
      example: 'Lower at $485, Upper at $4,750'
    },
    thresholdSummary: '90%+ on either progressive',
    thresholdDetail: '$500 meter: $450+. $5,000 meter: $4,500+.',
    threshold: {
      conservative: '90%+ on either',
      aggressive: '85%+ on $5,000 meter',
      ideal: 'Both at 85%+'
    },
    notes: 'AGS games - different from IGT. $500 hits more often.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'stack-up-pays',
    name: 'Stack Up Pays / Ascending Fortunes',
    shortName: 'Stack Up Pays',
    category: 'must-hit-by',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Five MHB free games meters - reel expansions instead of extra spins',
    visual: {
      location: 'Five colored meters above reels',
      appearance: [
        { label: 'Mega (Red)', text: 'Resets 250, MHB 350' },
        { label: 'Grand (Orange)', text: 'Resets 200, MHB 250' },
        { label: 'Major (Purple)', text: 'Resets 150, MHB 200', highlight: true },
        { label: 'Minor (Green)', text: 'Resets 100, MHB 150' },
        { label: 'Mini (Blue)', text: 'Resets 75, MHB 125' },
      ],
      colors: 'Island Riches or Sakura Riches theme',
      example: 'Major at 185/200, Minor at 140/150'
    },
    thresholdSummary: '90%+ on any meter',
    thresholdDetail: 'Higher meters = more reel expansions = more ways to win.',
    threshold: {
      conservative: '90%+ on Major/Grand/Mega',
      aggressive: '85%+ on any meter',
      ideal: 'Multiple meters at 85%+'
    },
    notes: 'Meters give reel expansions not extra spins. Check all.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'rocket-rumble',
    name: 'Rocket Rumble',
    shortName: 'Rocket Rumble',
    category: 'must-hit-by',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Four MHB free games meters - Blue 8-15, Green 10-20, Purple 20-35, Red 50-100',
    visual: {
      location: 'Four colored meters above reels',
      appearance: [
        { label: 'Blue', text: 'Resets 8, MHB 15' },
        { label: 'Green', text: 'Resets 10, MHB 20' },
        { label: 'Purple', text: 'Resets 20, MHB 35', highlight: true },
        { label: 'Red', text: 'Resets 50, MHB 100' },
      ],
      colors: 'Space/rocket theme',
      example: 'Purple at 32/35, Red at 88/100'
    },
    thresholdSummary: '90%+ on any meter',
    thresholdDetail: 'Blue: 14+. Green: 18+. Purple: 32+. Red: 90+.',
    threshold: {
      conservative: '90%+ on Purple or Red',
      aggressive: '85%+ on any meter',
      ideal: 'Multiple meters at 85%+'
    },
    notes: 'Smaller MHB windows than Stack Up Pays.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'regal-link',
    name: 'Regal Link',
    shortName: 'Regal Link',
    category: 'must-hit-by',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Five MHB wild meters + random silver wilds in base game',
    visual: {
      location: 'Five gem-colored meters showing wild counts',
      appearance: [
        { label: 'Amber', text: 'Resets 30, MHB 50' },
        { label: 'Sapphire', text: 'Resets 40, MHB 60' },
        { label: 'Amethyst', text: 'Resets 50, MHB 75', highlight: true },
        { label: 'Emerald', text: 'Resets 75, MHB 100' },
        { label: 'Diamond', text: 'Resets 175, MHB 200' },
      ],
      colors: 'Lion or Raven theme',
      example: 'Amethyst at 70/75, Emerald at 92/100'
    },
    thresholdSummary: '90%+ on any meter',
    thresholdDetail: 'Amber: 45+. Sapphire: 54+. Amethyst: 68+. Emerald: 90+. Diamond: 180+.',
    threshold: {
      conservative: '90%+ on higher meters',
      aggressive: '85%+ on any meter',
      ideal: 'Multiple meters at 85%+'
    },
    notes: 'Also has silver wilds that trigger randomly during base game.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'treasure-shot',
    name: 'Treasure Shot',
    shortName: 'Treasure Shot',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Wild bags and treasure chests above reels - blue/red bags (base), chests (free games)',
    visual: {
      location: 'Above reels - bags and treasure chests with wild counts',
      appearance: [
        { label: 'Blue/Red Bags', text: 'Base game wilds, MHB at 10 each' },
        { label: 'Blue Chest', text: 'Free games wilds, MHB 100', highlight: true },
        { label: 'Green/Purple Chest', text: 'Free games wilds, MHB 75 each' },
      ],
      colors: 'Pirate Ship or Robin Hood theme',
      example: 'Blue chest at 92/100, Red bag at 8/10'
    },
    thresholdSummary: '85%+ on any chest, or bag at 10',
    thresholdDetail: 'Bags trigger at 10 (base game). Chests are MHB for free games.',
    threshold: {
      conservative: 'Any chest at 90%+',
      aggressive: 'Any bag at 10 OR chest at 85%+',
      ideal: 'Multiple chests/bags near ceiling'
    },
    notes: 'Bags trigger immediately at 10. Chests require free games to trigger.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'pinwheel-prizes',
    name: 'Pinwheel Prizes',
    shortName: 'Pinwheel Prizes',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Five colored pinwheels above reels - wedges increase value and upgrade to gold',
    visual: {
      location: 'Above reels - 5 pinwheels with 8 wedges each',
      appearance: [
        { label: 'Wedges', text: 'Credit values that grow as symbols land' },
        { label: 'Gold Wedges', text: 'Upgraded wedges include free spins', highlight: true },
        { label: 'Trigger', text: '3 same-color scatters = spin that pinwheel' },
      ],
      colors: 'Green, blue, purple, orange, red pinwheels',
      example: 'Red pinwheel has 4 gold wedges with high values'
    },
    thresholdSummary: 'Any pinwheel with 3+ gold wedges AND high values',
    thresholdDetail: 'Gold wedges include free spins. Higher values = better awards.',
    threshold: {
      conservative: 'Any pinwheel with 4+ gold wedges',
      aggressive: 'Any pinwheel with 3+ gold wedges + 20x+ average',
      ideal: 'Multiple pinwheels with gold wedges'
    },
    notes: 'Wedges reset after being won. Track which pinwheels are built up.',
    checkBetLevels: false
  },

  {
    id: 'golden-beasts',
    name: 'Golden Beasts / Golden Elements',
    shortName: 'Golden Beasts',
    category: 'cycle-bonus',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'MHB super spin at 180 special symbols collected',
    visual: {
      location: 'Counter showing special symbols collected',
      appearance: [
        { label: 'Counter', text: 'Shows X/180 symbols collected', highlight: true },
        { label: 'MHB', text: 'Must hit before 180' },
        { label: 'Award', text: 'Super spin feature' },
      ],
      colors: 'Golden beast or elements theme',
      example: 'Counter at 165/180'
    },
    thresholdSummary: '162+ collected (90%)',
    thresholdDetail: 'Standard MHB math: 90% = 162, 85% = 153.',
    threshold: {
      conservative: '162+ (90%)',
      aggressive: '153+ (85%)',
      ideal: '170+ (94%)'
    },
    notes: 'Simple counter mechanic. Easy to evaluate.',
    hasCalculator: true,
    checkBetLevels: false
  },

  {
    id: 'block-bonanza',
    name: 'Block Bonanza',
    shortName: 'Block Bonanza',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Colored blocks with credits above reels - dollar symbols pay corresponding block values',
    visual: {
      location: 'Above reels - 3x5 grid of colored blocks with credit values',
      appearance: [
        { label: 'Blocks', text: 'Credit values in blocks matching reel positions', highlight: true },
        { label: 'Dollar Trigger', text: 'Dollar in reels 1-3 = win corresponding block above' },
        { label: 'High Values', text: 'Look for blocks with elevated credit values' },
      ],
      colors: 'Hawaii or Rio theme',
      example: 'Top row blocks showing 50x, 75x, 60x values'
    },
    thresholdSummary: 'Multiple high-value blocks in triggerable positions',
    thresholdDetail: 'Only reels 1-3 positions can trigger. Focus on those columns.',
    threshold: {
      conservative: '3+ blocks at 25x+ in reels 1-3',
      aggressive: '2+ blocks at 30x+ in reels 1-3',
      ideal: 'Reel 1-3 top row with 40x+ average'
    },
    notes: 'Blocks correspond to reel positions. Only reels 1-3 matter for trigger.',
    checkBetLevels: true
  },

  {
    id: 'wolf-peak',
    name: 'Wolf Peak / Cat Peak / Fu Ren Wu',
    shortName: 'Wolf/Cat Peak',
    category: 'persistent-state',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Expanding wilds stay for 4 spins - arrow shows up/down expansion direction',
    visual: {
      location: 'On reels - yellow/orange WILD symbols with directional arrows',
      appearance: [
        { label: 'Wilds', text: 'Yellow background wilds with up/down arrows', highlight: true },
        { label: 'Expansion', text: 'Wilds expand one position per spin in arrow direction' },
        { label: 'Duration', text: '4 spins then disappear' },
      ],
      colors: 'Wolf, Cat, or Asian theme',
      example: 'Wild on row 2 with up arrow (will expand to rows 1-4)'
    },
    thresholdSummary: 'Multiple expanding wilds with 3+ spins remaining',
    thresholdDetail: 'Wilds that will expand to cover full reels = best.',
    threshold: {
      conservative: '2+ wilds with 3+ spins in expandable positions',
      aggressive: 'Any wild with 4 spins in center position',
      ideal: '3+ wilds with good expansion paths'
    },
    notes: 'Track expansion direction. Center positions expand both ways.',
    checkBetLevels: false
  },

  {
    id: 'magic-treasures-gold',
    name: 'Magic Treasures Gold',
    shortName: 'MT Gold',
    category: 'banked-coins',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Three pots (gold/purple/green) with money ball counters - random trigger awards all',
    visual: {
      location: 'Above reels - 3 pots showing collected money ball counts',
      appearance: [
        { label: 'Pots', text: 'Gold, purple, green pots with counters', highlight: true },
        { label: 'Collection', text: 'Money balls increment corresponding pot' },
        { label: 'Trigger', text: 'Random trigger when money ball lands' },
      ],
      colors: 'Emperor or Empress Asian theme',
      example: 'Gold pot at 45, Purple at 30, Green at 25'
    },
    thresholdSummary: 'Any pot with 40+ balls',
    thresholdDetail: 'Higher counts = more value when triggered. All pots pay when any triggers.',
    threshold: {
      conservative: 'Any pot at 50+',
      aggressive: 'Any pot at 40+ OR total 100+',
      ideal: 'Multiple pots at 40+'
    },
    notes: 'Random trigger - not MHB. Higher counts just mean better payouts.',
    checkBetLevels: false
  },

  {
    id: 'lucky-empress',
    name: 'Lucky Empress / Inca Empress',
    shortName: 'Lucky Empress',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Multiplier tiles queue on left side of rows - active multiplier shows "10X NEXT PAY"',
    visual: {
      location: 'Left side of rows - tile placeholders and active multiplier',
      appearance: [
        { label: 'Tiles', text: 'Diamond/circle tiles queue on left of rows', highlight: true },
        { label: 'Multipliers', text: 'Revealed: 2x, 3x, 5x, 8x, 10x, or 12x' },
        { label: 'Active', text: 'Shows "10X NEXT PAY" when multiplier is ready' },
      ],
      colors: 'Asian Lucky or Incan theme',
      example: 'Row 2 shows "8X NEXT PAY" with 2 more tiles queued'
    },
    thresholdSummary: 'High multiplier (8x+) active OR queued',
    thresholdDetail: 'Active multipliers apply to next line hit starting from that row.',
    threshold: {
      conservative: '10x+ multiplier active',
      aggressive: '8x+ multiplier active OR 10x+ queued',
      ideal: 'Multiple rows with high multipliers active/queued'
    },
    notes: 'Multipliers persist until used. Queued tiles become active after current is used.',
    checkBetLevels: false
  },

  // =============================================
  // ENTERTAINMENT - NO ADVANTAGE PLAY (Popular Licensed/Themed)
  // These machines have NO edge - they're just fun to play!
  // =============================================
  
  // --- TV SHOWS ---

  {
    id: 'game-of-thrones',
    name: 'Game of Thrones',
    shortName: 'GOT',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'HBO series theme with house selection - multiple versions exist',
    visual: {
      location: 'Large cabinet with GOT branding, often multi-screen setup',
      appearance: [
        { label: 'Theme', text: 'Stark, Lannister, Targaryen, Baratheon house themes' },
        { label: 'Cabinet', text: 'Often on premium Arc or King Max cabinets' },
        { label: 'Versions', text: 'Winter is Coming, Fire & Blood, multiple seasons' },
      ],
      colors: 'Dark medieval aesthetic with house sigils',
      example: 'Located in high-traffic areas due to popularity'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'This is an entertainment machine only. There is no mathematical edge to be found.',
    notes: 'Extremely popular franchise. Multiple bonus rounds with show clips. Great for fans but no AP opportunity.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'house-of-the-dragon',
    name: 'House of the Dragon',
    shortName: 'HOTD',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'GOT prequel series - NEW 2024 release on King Max cabinet',
    visual: {
      location: 'Premium King Max cabinet with dragon imagery',
      appearance: [
        { label: 'Theme', text: 'Targaryen civil war era, dragons featured prominently' },
        { label: 'Cabinet', text: 'King Max premium cabinet' },
        { label: 'Release', text: 'New 2024 release' },
      ],
      colors: 'Red/black Targaryen theme',
      example: 'Look for dragon imagery and HOTD branding'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Newest GOT-universe game. Based on HBO hit series. Premium cabinet experience.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'walking-dead',
    name: 'The Walking Dead',
    shortName: 'Walking Dead',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'AMC zombie series - multiple versions with show clips and characters',
    visual: {
      location: 'Various cabinet sizes with Walking Dead branding',
      appearance: [
        { label: 'Theme', text: 'Zombie apocalypse with Rick, Daryl, Michonne' },
        { label: 'Versions', text: 'Multiple seasons/editions available' },
        { label: 'Features', text: 'Walker Wilds, CDC bonus, various pick games' },
      ],
      colors: 'Dark, gritty post-apocalyptic aesthetic',
      example: 'Often found near other Aristocrat licensed games'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Long-running licensed series from Aristocrat. Multiple versions with different bonuses.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'big-bang-theory',
    name: 'The Big Bang Theory',
    shortName: 'Big Bang',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'CBS sitcom theme - Bazinga bonus with Sheldon, Leonard, and gang',
    visual: {
      location: 'Large Behemoth cabinet with life-size character displays',
      appearance: [
        { label: 'Theme', text: 'Apartment setting with main cast' },
        { label: 'Cabinet', text: 'Behemoth super-sized cabinet' },
        { label: 'Bonus', text: 'Bazinga feature with show clips' },
      ],
      colors: 'Bright sitcom aesthetic',
      example: 'Characters appear nearly life-size on large screen'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Premium cabinet experience. Great for fans of the show.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'sons-of-anarchy',
    name: 'Sons of Anarchy',
    shortName: 'Sons of Anarchy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'SAMCRO motorcycle club theme',
    visual: {
      location: 'Premium cabinet with SOA reaper logo',
      appearance: [
        { label: 'Theme', text: 'SAMCRO motorcycle club, Jax Teller, club members' },
        { label: 'Cabinet', text: 'Verve HD or Arc cabinet' },
        { label: 'Features', text: 'Motorcycle ride bonus, club vote feature' },
      ],
      colors: 'Black leather and chrome aesthetic',
      example: 'Look for reaper logo and motorcycle imagery'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Popular with fans of the FX series. Mature themes.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'breaking-bad',
    name: 'Breaking Bad',
    shortName: 'Breaking Bad',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'AMC drama - Walter White and Jesse Pinkman theme',
    visual: {
      location: 'Crystal Core 42 cabinet',
      appearance: [
        { label: 'Theme', text: 'Heisenberg, blue crystals, RV lab' },
        { label: 'Cabinet', text: 'Crystal Core 42" vertical monitor' },
        { label: 'Features', text: 'Multi-level progressive, show footage' },
      ],
      colors: 'Blue crystal and desert aesthetic',
      example: 'Look for Heisenberg hat imagery'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Critically acclaimed series brought to slots. Powerful imagery from the show.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'squid-game',
    name: 'Squid Game',
    shortName: 'Squid Game',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Netflix Korean drama - green tracksuits, masked guards, deadly games',
    visual: {
      location: 'Modern cabinet with distinctive Squid Game branding',
      appearance: [
        { label: 'Theme', text: 'Green tracksuits, pink soldiers, doll from Red Light Green Light' },
        { label: 'Release', text: 'March 2024 release' },
        { label: 'Features', text: 'Various deadly game bonuses' },
      ],
      colors: 'Green and pink contrast, dystopian aesthetic',
      example: 'Look for the giant doll or masked guards'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Based on Netflix global phenomenon. New 2024 release. Season 3 coming soon.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'ellen',
    name: 'The Ellen DeGeneres Show',
    shortName: 'Ellen',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Talk show theme with Ellen hosting bonus games',
    visual: {
      location: 'Crystal Core 42 cabinet',
      appearance: [
        { label: 'Theme', text: 'Ellen show set, dancing, audience games' },
        { label: 'Cabinet', text: 'Large vertical monitor' },
        { label: 'Features', text: 'Dance bonus, show-style mini games' },
      ],
      colors: 'Bright, cheerful daytime TV aesthetic',
      example: 'Ellen character animations throughout'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Fun, upbeat game based on popular talk show.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'sex-and-the-city',
    name: 'Sex and the City',
    shortName: 'SATC',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'HBO series - Carrie, Samantha, Charlotte, Miranda shopping in NYC',
    visual: {
      location: 'Various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'NYC fashion, four main characters, shoe shopping' },
        { label: 'Versions', text: 'Multiple versions including Ultra' },
        { label: 'Features', text: 'Shoe bonus, cosmopolitan cocktails' },
      ],
      colors: 'Pink, glamorous NYC aesthetic',
      example: 'Shoe symbols and NYC skyline'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Long-running licensed game. Multiple versions exist.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  
  // --- MOVIES ---

  {
    id: 'willy-wonka',
    name: 'Willy Wonka',
    shortName: 'Wonka',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: '1971 Chocolate Factory movie - Oompa Loompas, golden tickets, Gene Wilder',
    visual: {
      location: 'Various cabinet sizes, often curved or dual-screen',
      appearance: [
        { label: 'Theme', text: 'Chocolate factory, Oompa Loompas, golden elevator' },
        { label: 'Versions', text: 'World of Wonka, Pure Imagination, Dream Factory, Wonkavator' },
        { label: 'Features', text: 'Golden ticket unwrapping, Oompa Loompa wilds' },
      ],
      colors: 'Colorful candy factory aesthetic',
      example: 'Look for Gene Wilder imagery and candy symbols'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Extremely popular series with multiple versions. Great bonuses with movie footage. Legendary status among slot players.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'wizard-of-oz',
    name: 'The Wizard of Oz',
    shortName: 'Wizard of Oz',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: '1939 classic - Dorothy, Toto, yellow brick road, ruby slippers',
    visual: {
      location: 'Various cabinets including premium setups',
      appearance: [
        { label: 'Theme', text: 'Emerald City, Scarecrow, Tin Man, Cowardly Lion' },
        { label: 'Versions', text: 'Road to Emerald City, Ruby Slippers, Over the Rainbow, many more' },
        { label: 'Features', text: 'Flying monkey bonus, witch melting feature' },
      ],
      colors: 'Sepia to Technicolor transition, emerald green',
      example: 'Ruby slippers, yellow brick road imagery'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'One of the most licensed slot themes ever. Countless versions over decades. New online versions launching 2025.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'ghostbusters',
    name: 'Ghostbusters',
    shortName: 'Ghostbusters',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: '1984 movie - Slimer, Stay Puft, proton packs, who you gonna call?',
    visual: {
      location: 'CrystalCurve TRUE 4D cabinet (premium versions)',
      appearance: [
        { label: 'Theme', text: 'Ghost busting, Slimer, Stay Puft Marshmallow Man' },
        { label: 'Cabinet', text: '4D version with haptic feedback and 3D without glasses' },
        { label: 'Features', text: 'Ghost blasting bonus, trap bonus' },
      ],
      colors: 'Green ghost slime, red/white logo',
      example: 'Slimer animations, proton pack imagery'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Multiple versions including impressive 4D experience with haptic technology. TRUE 3D without glasses.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'jurassic-park',
    name: 'Jurassic Park',
    shortName: 'Jurassic Park',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Spielberg dinosaur movie - T-Rex, raptors, Isla Nublar',
    visual: {
      location: 'Crystal Core Duo cabinet with expanding reels',
      appearance: [
        { label: 'Theme', text: 'Dinosaurs, DNA extraction, park gates' },
        { label: 'Cabinet', text: 'Dual 42" monitors' },
        { label: 'Features', text: 'T-Rex chase bonus, reels expand to 10 rows' },
      ],
      colors: 'Jungle green, amber, dinosaur imagery',
      example: 'T-Rex roaring, park logo'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Outstanding HD video quality. T-Rex bonus is a crowd favorite.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'batman-classic',
    name: 'Batman Classic TV Series',
    shortName: 'Batman 60s',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: '1960s Adam West Batman - POW! BAM! ZONK! campy fun',
    visual: {
      location: 'Helix Wonder Wheels cabinet',
      appearance: [
        { label: 'Theme', text: 'Adam West Batman, Burt Ward Robin, classic villains' },
        { label: 'Features', text: 'Batcave bonus, villain showdowns, comic book graphics' },
        { label: 'Style', text: 'Campy 1960s comic book aesthetic' },
      ],
      colors: 'Bright comic book colors, POW/BAM graphics',
      example: 'Adam West in costume, Batmobile'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Nostalgic fun for fans of the 1960s series. Great villain roster.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'dark-knight',
    name: 'The Dark Knight',
    shortName: 'Dark Knight',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Playtech/Various',
    quickId: 'Christopher Nolan Batman trilogy - Joker, serious tone',
    visual: {
      location: 'Various premium cabinets',
      appearance: [
        { label: 'Theme', text: 'Gotham City, Heath Ledger Joker, Batman vs villains' },
        { label: 'Features', text: 'Progressive jackpots, Joker bonus rounds' },
        { label: 'Style', text: 'Dark, gritty, cinematic' },
      ],
      colors: 'Dark black and blue, Gotham aesthetic',
      example: 'Joker face imagery, Bat signal'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Based on critically acclaimed film. Darker tone than classic Batman.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'superman',
    name: 'Superman / Man of Steel',
    shortName: 'Superman',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'DC superhero - Clark Kent, Metropolis, Lex Luthor',
    visual: {
      location: 'Wonder Wheels format',
      appearance: [
        { label: 'Theme', text: 'Superman flying, Metropolis, Kryptonian powers' },
        { label: 'Features', text: 'Flying bonus, expanding wilds' },
        { label: 'Versions', text: 'Classic Superman and Man of Steel movie versions' },
      ],
      colors: 'Red, blue, yellow - classic Superman colors',
      example: 'Superman logo, flying animations'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Iconic superhero theme. Multiple versions exist.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'wonder-woman',
    name: 'Wonder Woman',
    shortName: 'Wonder Woman',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Various',
    quickId: 'DC Amazon warrior - Themyscira, lasso of truth',
    visual: {
      location: 'Various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'Diana Prince, Amazon warriors, Greek mythology' },
        { label: 'Features', text: 'Ares showdown bonus, shield bonus' },
        { label: 'Style', text: 'Heroic warrior aesthetic' },
      ],
      colors: 'Red, gold, blue warrior colors',
      example: 'Wonder Woman in battle stance'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Popular DC heroine. Often found near other DC games.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'dumb-and-dumber',
    name: 'Dumb & Dumber',
    shortName: 'Dumb & Dumber',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: '1994 comedy - Lloyd and Harry, Mutt Cutts van, Aspen trip',
    visual: {
      location: 'Helix Wonder Wheels cabinet',
      appearance: [
        { label: 'Theme', text: 'Jim Carrey, Jeff Daniels, road trip comedy' },
        { label: 'Features', text: 'Movie clips and quotes throughout' },
        { label: 'Style', text: 'Hilarious 90s comedy aesthetic' },
      ],
      colors: 'Bright, comedic styling',
      example: 'Lloyd and Harry orange and blue tuxedos'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Hilarious for fans of the movie. Great use of movie clips.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'hangover',
    name: 'The Hangover',
    shortName: 'Hangover',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Vegas bachelor party gone wrong - tiger, baby, Zach Galifianakis',
    visual: {
      location: 'Various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'Wolfpack, Vegas chaos, Mr. Chow, Mike Tyson\'s tiger' },
        { label: 'Features', text: 'Vegas-themed bonuses, movie clips' },
        { label: 'Style', text: 'Wild Vegas party aesthetic' },
      ],
      colors: 'Vegas neon and chaos',
      example: 'Movie poster imagery, tiger, baby Carlos'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Meta - playing a Vegas slot about a Vegas movie IN Vegas.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'bridesmaids',
    name: 'Bridesmaids',
    shortName: 'Bridesmaids',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Comedy hit - Kristen Wiig, wedding chaos, airplane scene',
    visual: {
      location: 'Standard cabinet',
      appearance: [
        { label: 'Theme', text: 'Wedding party, dress shopping, bachelorette party' },
        { label: 'Features', text: 'Themed bonus rounds from movie scenes' },
        { label: 'Style', text: 'Wedding comedy aesthetic' },
      ],
      colors: 'Pink bridal party colors',
      example: 'Bridesmaids characters in pink dresses'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Popular comedy brought to slots.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'terminator-2',
    name: 'Terminator 2: Judgment Day',
    shortName: 'Terminator 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Various',
    quickId: 'James Cameron sci-fi - Arnold, T-1000, Hasta la vista baby',
    visual: {
      location: 'Various premium cabinets',
      appearance: [
        { label: 'Theme', text: 'T-800, T-1000, Sarah Connor, Skynet' },
        { label: 'Features', text: 'Iconic movie scenes, liquid metal effects' },
        { label: 'Style', text: 'Dark sci-fi apocalyptic' },
      ],
      colors: 'Metal, chrome, fire and blue time travel effects',
      example: 'Arnold with shotgun, T-1000 morphing'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Classic action sci-fi translated to slots. I\'ll be back.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'mad-max',
    name: 'Mad Max: Fury Road',
    shortName: 'Mad Max',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Post-apocalyptic chase - Furiosa, War Boys, witness me',
    visual: {
      location: 'Edge X cabinet with dual curved displays',
      appearance: [
        { label: 'Theme', text: 'War rig, desert chase, Immortan Joe' },
        { label: 'Cabinet', text: 'Edge X premium cabinet' },
        { label: 'Features', text: 'High-octane bonus rounds' },
      ],
      colors: 'Orange desert, chrome, black',
      example: 'War rig imagery, skull steering wheel'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Visually stunning game based on visually stunning film.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'ted',
    name: 'Ted',
    shortName: 'Ted',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Various',
    quickId: 'Seth MacFarlane comedy - talking teddy bear, Mark Wahlberg',
    visual: {
      location: 'Standard cabinet',
      appearance: [
        { label: 'Theme', text: 'Ted the bear, Boston setting, adult humor' },
        { label: 'Features', text: 'Ted animations and voice clips' },
        { label: 'Style', text: 'R-rated comedy aesthetic' },
      ],
      colors: 'Brown teddy bear, Boston colors',
      example: 'Ted with beer bottle'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Adult comedy theme. Ted provides commentary throughout play.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  
  // --- MUSIC/CELEBRITIES ---

  {
    id: 'michael-jackson',
    name: 'Michael Jackson',
    shortName: 'MJ',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally/Light & Wonder',
    quickId: 'King of Pop - music videos, moonwalk, classic songs',
    visual: {
      location: 'Pro Wheel cabinet with surround sound chair',
      appearance: [
        { label: 'Theme', text: 'Michael Jackson performances, iconic outfits' },
        { label: 'Songs', text: 'Beat It, Billie Jean, Bad, Smooth Criminal, and more' },
        { label: 'Features', text: 'Music video bonuses, concert experience' },
      ],
      colors: 'Glittery, performance stage aesthetic',
      example: 'Michael in various iconic poses/outfits'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Outstanding audio experience. Multiple versions: King of Pop, Icon, Wanna Be Startin\' Somethin\'. A must-play for MJ fans.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'elvis',
    name: 'Elvis',
    shortName: 'Elvis',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'The King - Vegas era, jumpsuits, classic hits',
    visual: {
      location: 'Various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'Elvis performances, Vegas residency, iconic moments' },
        { label: 'Songs', text: 'Hound Dog, Jailhouse Rock, Viva Las Vegas' },
        { label: 'Versions', text: 'Multiple Elvis-themed games exist' },
      ],
      colors: 'Vegas gold, white jumpsuit, 1970s aesthetic',
      example: 'Elvis in iconic jumpsuit pose'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Fitting to play Elvis in Vegas. Long-running theme with devoted fans.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'britney-spears',
    name: 'Britney Spears',
    shortName: 'Britney',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Pop princess - Hit Me Baby, Oops I Did It Again',
    visual: {
      location: 'Premium cabinet',
      appearance: [
        { label: 'Theme', text: 'Britney performances, music videos, costumes' },
        { label: 'Songs', text: 'Classic Britney hits' },
        { label: 'Versions', text: 'Original and "One More Time" version' },
      ],
      colors: 'Pop star pink and glitter',
      example: 'Britney in iconic outfits'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'For fans of 90s/2000s pop. She had a Vegas residency too!',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'dolly-parton',
    name: 'Dolly Parton',
    shortName: 'Dolly',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Country legend - 9 to 5, Jolene, rhinestones',
    visual: {
      location: 'Standard cabinet',
      appearance: [
        { label: 'Theme', text: 'Dolly performances, country aesthetic' },
        { label: 'Songs', text: '9 to 5, Jolene, I Will Always Love You' },
        { label: 'Style', text: 'Rhinestone country glamour' },
      ],
      colors: 'Country sparkle, blonde wigs',
      example: 'Dolly in signature look'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Beloved country icon with devoted fan base.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  
  // --- GAME SHOWS ---

  {
    id: 'wheel-of-fortune-entertainment',
    name: 'Wheel of Fortune (Standard)',
    shortName: 'WOF Standard',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Classic game show - spinning wheel, buy a vowel (NON-MHB versions)',
    visual: {
      location: 'Various cabinets, often with physical spinning wheel on top',
      appearance: [
        { label: 'Theme', text: 'TV game show with Pat and Vanna' },
        { label: 'Features', text: 'Wheel spin bonus, puzzle solving' },
        { label: 'Note', text: 'Look for versions WITHOUT Must-Hit-By display' },
      ],
      colors: 'Blue, yellow, classic game show look',
      example: 'Physical wheel spinning above machine'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Note: MHB versions of Wheel of Fortune ARE advantage play - check for MHB display!',
    notes: 'Most popular slot theme for 25+ years. NOT the same as MHB versions which have advantage play potential.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'Check if this is MHB version - those have AP opportunity!'
  },

  {
    id: 'jeopardy',
    name: 'Jeopardy!',
    shortName: 'Jeopardy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Quiz show - What is... answers in question form',
    visual: {
      location: 'Standard cabinet',
      appearance: [
        { label: 'Theme', text: 'Game board, categories, Daily Doubles' },
        { label: 'Features', text: 'Trivia bonus rounds' },
        { label: 'Style', text: 'Classic Jeopardy board aesthetic' },
      ],
      colors: 'Blue board, gold text',
      example: 'Jeopardy board with dollar amounts'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Long-running game show brought to slots.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'price-is-right',
    name: 'The Price is Right',
    shortName: 'Price is Right',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Come on down! Pricing games, Big Wheel, Showcase Showdown',
    visual: {
      location: 'Various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'Bob Barker/Drew Carey show, pricing games' },
        { label: 'Features', text: 'Plinko bonus, Big Wheel spin, showcase' },
        { label: 'Versions', text: 'Showcase Showdown, Video Slots versions' },
      ],
      colors: 'Game show bright colors',
      example: 'Plinko board, Big Wheel'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Popular pricing games translated to slot bonuses.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'deal-or-no-deal',
    name: 'Deal or No Deal',
    shortName: 'Deal or No Deal',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Various',
    quickId: 'Briefcase game show - 26 models, banker phone calls',
    visual: {
      location: 'Standard cabinet',
      appearance: [
        { label: 'Theme', text: 'Briefcases, banker offers, risk vs reward' },
        { label: 'Features', text: 'Briefcase picking bonus, banker negotiations' },
        { label: 'Style', text: 'Game show studio setting' },
      ],
      colors: 'Black briefcases, gold accents',
      example: '26 briefcases with dollar amounts'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Risk vs reward gameplay mirrors the TV show tension.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  
  // --- BOARD GAMES ---

  {
    id: 'monopoly',
    name: 'Monopoly',
    shortName: 'Monopoly',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Classic board game - Mr. Monopoly, property buying, Go to Jail',
    visual: {
      location: 'Various cabinets',
      appearance: [
        { label: 'Theme', text: 'Board game properties, Mr. Monopoly (Rich Uncle Pennybags)' },
        { label: 'Versions', text: 'DOZENS of versions - Express, Super Money, Boardwalk Sevens' },
        { label: 'Features', text: 'Board game bonus, property collection' },
      ],
      colors: 'Green and white board game aesthetic',
      example: 'Mr. Monopoly character, game board'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'One of the most frequently updated themes. New versions every year. Perfect theme for slots.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  
  // --- CLASSIC POPULAR SLOTS (No AP but extremely common) ---

  {
    id: 'buffalo-standard',
    name: 'Buffalo (Standard)',
    shortName: 'Buffalo',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Most popular slot theme ever - stampede of buffalo, sunset wilds',
    visual: {
      location: 'Everywhere - Buffalo is EVERYWHERE',
      appearance: [
        { label: 'Theme', text: 'American West, buffalo stampede, eagles, wolves' },
        { label: 'Versions', text: 'Buffalo Gold, Grand, Link, Stampede, Chief, Ultimate, Ascension, etc.' },
        { label: 'Features', text: 'Xtra Reel Power, sunset wilds multiply, free games' },
      ],
      colors: 'Orange sunset, brown buffalo, American West palette',
      example: 'Buffalo head symbol, sunset wild with multiplier'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY (standard versions)',
    thresholdDetail: 'Some Buffalo versions (like Buffalo Link) may have AP elements - check specific version.',
    notes: 'Arguably the most successful slot machine ever made. You\'ll find Buffalo in every casino.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'Some Buffalo versions may have AP - check specific variant!'
  },

  {
    id: '88-fortunes-standard',
    name: '88 Fortunes (Standard)',
    shortName: '88 Fortunes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Asian luck theme - Fu Bat jackpots, gold symbols, 88 is lucky',
    visual: {
      location: 'Very common - Asian-themed areas',
      appearance: [
        { label: 'Theme', text: 'Asian prosperity, gold coins, fu bats' },
        { label: 'Features', text: 'Pick your bet level for jackpots, Fu Bat feature' },
        { label: 'Versions', text: 'Lucky Gong, Money Coins, Gold, etc.' },
      ],
      colors: 'Red and gold Chinese prosperity theme',
      example: 'Gold gong, fu bat, 88 branding'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Standard 88 Fortunes has no AP opportunity.',
    notes: 'One of the most popular slots in US casinos. #1 or #2 with Buffalo.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'dancing-drums-standard',
    name: 'Dancing Drums (Standard)',
    shortName: 'Dancing Drums',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Fu Babies, dancing drums, Asian prosperity theme',
    visual: {
      location: 'Asian-themed slot areas',
      appearance: [
        { label: 'Theme', text: 'Red drums, Fu Babies, Chinese New Year celebration' },
        { label: 'Features', text: 'Mystery bonus, Fu Baby wilds, jackpots' },
        { label: 'Versions', text: 'Prosperity, Explosion, Golden Drums (Golden has AP!)' },
      ],
      colors: 'Red and gold celebration theme',
      example: 'Dancing drum symbols, Fu Babies'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY (standard)',
    thresholdDetail: 'Note: "Golden Drums" version DOES have AP potential - different game!',
    notes: 'Part of the 88 Fortunes family. Extremely popular.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'Golden Drums version has AP - check which version!'
  },

  {
    id: 'lightning-link',
    name: 'Lightning Link',
    shortName: 'Lightning Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Hold & spin pioneer - lightning bolt locks, 4-tier progressives',
    visual: {
      location: 'Often in dedicated Lightning Link banks',
      appearance: [
        { label: 'Theme', text: 'Various themes - Heart Throb, Sahara Gold, High Stakes, etc.' },
        { label: 'Features', text: 'Hold & Spin bonus that started the trend' },
        { label: 'Progressives', text: 'Mini, Minor, Major, Grand jackpots' },
      ],
      colors: 'Varies by theme, lightning bolt branding',
      example: 'Lightning bolt symbols locking in place'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Lightning Link pioneered the hold & spin mechanic but has no inherent AP.',
    notes: 'The game that started the modern hold & spin craze. Every manufacturer copied this.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'dragon-link',
    name: 'Dragon Link',
    shortName: 'Dragon Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Asian-themed Lightning Link - dragon orbs, hold & spin, 4-tier jackpots',
    visual: {
      location: 'Often in dedicated Dragon Link areas',
      appearance: [
        { label: 'Theme', text: 'Dragon themes - Autumn Moon, Golden Century, Spring Festival, etc.' },
        { label: 'Features', text: 'Hold & Spin with dragon orbs' },
        { label: 'Progressives', text: 'Mini, Minor, Major, Grand jackpots' },
      ],
      colors: 'Red and gold Asian dragon theme',
      example: 'Dragon orbs with credit values'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Dragon Link is sister game to Lightning Link with Asian theme.',
    notes: 'Extremely popular. Phoenix Link is the 2024 successor.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'cleopatra',
    name: 'Cleopatra',
    shortName: 'Cleopatra',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Egyptian queen - pyramids, scarabs, classic IGT game',
    visual: {
      location: 'Found in most casinos',
      appearance: [
        { label: 'Theme', text: 'Ancient Egypt, Cleopatra, pyramids, sphinx' },
        { label: 'Features', text: 'Free spins with multiplier' },
        { label: 'Versions', text: 'Original, II, MegaJackpots, Gold, etc.' },
      ],
      colors: 'Gold and blue Egyptian aesthetic',
      example: 'Cleopatra face, scarab beetles, Eye of Horus'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Classic slot with no AP opportunity.',
    notes: 'One of the most successful slot themes in history. Still popular after 20+ years.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'quick-hit',
    name: 'Quick Hit',
    shortName: 'Quick Hit',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Classic Bally game - Quick Hit symbols, scatter pays',
    visual: {
      location: 'Common throughout casinos',
      appearance: [
        { label: 'Theme', text: 'Classic slot symbols with Quick Hit scatter' },
        { label: 'Features', text: 'Quick Hit scatter awards, free games' },
        { label: 'Versions', text: 'Platinum, Black Gold, Pro, many more' },
      ],
      colors: 'Various themes, Quick Hit logo consistent',
      example: 'Quick Hit flame scatter symbol'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Long-running series with devoted following.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'lock-it-link',
    name: 'Lock It Link',
    shortName: 'Lock It Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Hold & spin family - Piggy Bankin\' is most famous version',
    visual: {
      location: 'Found throughout casinos',
      appearance: [
        { label: 'Theme', text: 'Various - Piggy Bankin\' (pig with coins), others' },
        { label: 'Features', text: 'Hold & spin lock feature' },
        { label: 'Versions', text: 'Piggy Bankin\', Nightlife, Loteria, etc.' },
      ],
      colors: 'Varies by theme',
      example: 'Lock It Link logo, Piggy Bankin\' pig'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Piggy Bankin\' version is extremely popular. "We got a piggy!"',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'mighty-cash',
    name: 'Mighty Cash',
    shortName: 'Mighty Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Hold & spin with zapper feature',
    visual: {
      location: 'Common in Aristocrat areas',
      appearance: [
        { label: 'Theme', text: 'Various - Double Up, Tiger Roars, Dragon Flies, etc.' },
        { label: 'Features', text: 'Hold & spin, zapper can upgrade symbols' },
        { label: 'Style', text: 'Premium cabinet presentation' },
      ],
      colors: 'Varies by theme',
      example: 'Mighty Cash branding, zapper feature'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Aristocrat\'s answer to Lightning Link. Many theme variations.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'wonder-4',
    name: 'Wonder 4',
    shortName: 'Wonder 4',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    quickId: 'Play 4 games at once - Buffalo, Miss Kitty, Pompeii, etc.',
    visual: {
      location: 'Common in Aristocrat areas',
      appearance: [
        { label: 'Theme', text: 'Multi-game: 4 classic Aristocrat games simultaneously' },
        { label: 'Features', text: 'Choose 1-4 games to play at once, super free games' },
        { label: 'Versions', text: 'Tower, Jackpots, Special Edition, etc.' },
      ],
      colors: 'Four quadrant display',
      example: 'Four game panels on one screen'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Play Buffalo, Miss Kitty, Pompeii, Wild Splash all at once!',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'triple-double-diamond',
    name: 'Triple Double Diamond',
    shortName: 'Triple Dbl Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Classic 3-reel - diamond symbols with multipliers',
    visual: {
      location: 'Often in classic/high limit areas',
      appearance: [
        { label: 'Theme', text: 'Classic 3-reel with diamond symbols' },
        { label: 'Features', text: 'Wild multipliers up to 9x' },
        { label: 'Style', text: 'Traditional slot machine look' },
      ],
      colors: 'Blue diamonds, classic red 7s',
      example: 'Diamond symbols, classic 3-reel layout'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'For fans of classic 3-reel slot machines. Simple but satisfying.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'double-diamond',
    name: 'Double Diamond',
    shortName: 'Double Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'The classic - simple 3-reel, diamond wilds double wins',
    visual: {
      location: 'Classic slot areas',
      appearance: [
        { label: 'Theme', text: 'Original 3-reel classic' },
        { label: 'Features', text: 'Wild symbol doubles wins' },
        { label: 'Style', text: 'Timeless slot machine design' },
      ],
      colors: 'Blue diamond, classic symbols',
      example: 'Single diamond wild symbol'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'One of the most iconic slot machines ever made. Timeless.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'lobstermania',
    name: 'Lucky Larry\'s Lobstermania',
    shortName: 'Lobstermania',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Maine lobster theme - buoy picking bonus, Lucky Larry character',
    visual: {
      location: 'Found in most IGT areas',
      appearance: [
        { label: 'Theme', text: 'Maine lobster fishing, buoys, ocean' },
        { label: 'Features', text: 'Buoy picking bonus, Lucky Larry animations' },
        { label: 'Versions', text: 'Original, 2, 3, etc.' },
      ],
      colors: 'Ocean blue, red lobsters',
      example: 'Larry the lobster character, buoys'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Beloved classic with memorable bonus. Lucky Larry is iconic.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },

  {
    id: 'stinkin-rich',
    name: 'Stinkin\' Rich',
    shortName: 'Stinkin Rich',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    quickId: 'Skunks and money theme - "skunks gone wild" feature',
    visual: {
      location: 'Common IGT game',
      appearance: [
        { label: 'Theme', text: 'Wealthy skunks, money, diamonds' },
        { label: 'Features', text: 'Multi-tiered free spins, wild features' },
        { label: 'Versions', text: 'Original, Skunks Gone Wild' },
      ],
      colors: 'Green money, black/white skunks',
      example: 'Skunk characters with money'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. No mathematical edge.',
    notes: 'Long-running popular game. Skunks Gone Wild version is newer.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  // =============================================
  // NEW ADDITIONS - December 2024
  // =============================================

  {
    id: 'wolf-run-eclipse',
    name: 'Wolf Run Eclipse',
    shortName: 'Wolf Run Eclipse',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    quickId: 'Wolf theme with 4 free spin meters (Mini/Minor/Major/Mega) that persist between sessions',
    visual: {
      location: 'Check the free spin meters at top of screen for each bet level',
      appearance: [
        { label: 'Meters', text: 'Four free spin counters: Mini, Minor, Major, Mega' },
        { label: 'Theme', text: 'Wolves, moonlit forest, Native American totems' },
        { label: 'Reels', text: '5x4 layout with 40 paylines' },
        { label: 'Key Symbol', text: 'Free Games Bonus symbols on reel 4 add to meters' },
      ],
      colors: 'Purple/blue twilight forest with gold accents',
      example: 'Mini: 15 spins, Minor: 22 spins, Major: 18 spins'
    },
    thresholdSummary: 'High meter counts (volatile - large bankroll needed)',
    thresholdDetail: 'Meters persist and build up as bonus symbols land on reel 4. Mini/Minor/Major reset to 5 spins. Mega resets to 100. NOT must-hit-by - triggers are random. Very high volatility.',
    threshold: {
      conservative: 'Machine Pro Club has specific thresholds',
      aggressive: 'Look for elevated meters across multiple tiers',
      note: 'Requires large bankroll due to high volatility'
    },
    notes: 'Sister game to Cats Wild Serengeti. One of the most popular current AP slots but very volatile. Check all bet levels as meters are separate per bet. Only for experienced APs.',
    hasCalculator: true,
    checkBetLevels: true,
    warning: 'HIGH VOLATILITY - Large bankroll required!'
  },

  {
    id: 'green-machine-bingo',
    name: 'Green Machine Bingo',
    shortName: 'Green Machine Bingo',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    quickId: 'Bingo/slot hybrid - 5x5 grid where balls lock for 2-3 spins',
    visual: {
      location: '5x5 bingo grid with center free space (gold star)',
      appearance: [
        { label: 'Grid', text: '5x5 matrix like bingo card' },
        { label: 'Balls', text: 'Cash denomination balls ($3, $5, $10, $20) lock for 2-3 spins' },
        { label: 'Goal', text: 'Complete 5 in a row (horizontal, vertical, diagonal)' },
        { label: 'Bonus', text: 'Super Bingo Bonus when line goes through center star' },
      ],
      colors: 'Green money theme with colorful bingo balls',
      example: 'Balls showing multipliers locked on grid'
    },
    thresholdSummary: 'NO CONFIRMED AP VALUE',
    thresholdDetail: 'Progress is tied to bet level and balls persist briefly. However, no confirmed advantage play strategy exists. Treat as entertainment.',
    notes: 'Hybrid game combining slot and bingo mechanics. Four jackpots available. Progress persists per bet level if you change bets. Fun concept but not confirmed AP.',
    hasCalculator: false,
    checkBetLevels: true,
    warning: 'NO CONFIRMED AP - Likely entertainment only'
  },

  {
    id: 'magic-treasures-gold-empress',
    name: 'Magic Treasures Gold Empress',
    shortName: 'Magic Treasures',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Unknown',
    quickId: 'Asian empress theme - check for any persistent meters or features',
    visual: {
      location: 'Look for any counters, meters, or collection features',
      appearance: [
        { label: 'Theme', text: 'Asian/Chinese empress, gold treasures' },
        { label: 'Check For', text: 'Any visible meters, counters, or "collect" features' },
        { label: 'Note', text: 'Limited information available on this title' },
      ],
      colors: 'Gold and red Asian theme',
      example: 'Report any persistent features you observe'
    },
    thresholdSummary: 'UNKNOWN - NEEDS RESEARCH',
    thresholdDetail: 'Limited information available. If you see any persistent meters, counters, or must-hit-by displays, note them for research.',
    notes: 'Not enough data to confirm AP value. If you play this, look for: must-hit-by progressives, banked bonuses, persistent counters, or collection features. Report findings!',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'UNKNOWN VALUE - Research needed'
  },

  {
    id: 'jackpot-party',
    name: 'Jackpot Party',
    shortName: 'Jackpot Party',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS/Light & Wonder',
    quickId: 'Classic party theme - presents, noisemakers, bonus picking game',
    visual: {
      location: 'Common floor game in various cabinet sizes',
      appearance: [
        { label: 'Theme', text: 'Party celebration - presents, balloons, noisemakers' },
        { label: 'Bonus', text: 'Pick presents for prizes, avoid "Party Poopers"' },
        { label: 'Versions', text: 'Original, Super Jackpot Party, Jackpot Block Party' },
        { label: 'Style', text: 'Colorful, festive, classic WMS game' },
      ],
      colors: 'Bright party colors - purple, gold, red, blue',
      example: 'Gift boxes to pick during bonus round'
    },
    thresholdSummary: 'NO ADVANTAGE PLAY',
    thresholdDetail: 'Entertainment machine only. Classic bonus picking game with no persistent state or must-hit-by features.',
    notes: 'One of the most iconic WMS slots. Fun bonus round but purely entertainment - no mathematical edge available.',
    hasCalculator: false,
    checkBetLevels: false,
    warning: 'NO ADVANTAGE PLAY - Entertainment only!'
  },
  // =============================================
  // BULK AP MACHINES FROM MACHINE PRO CLUB - December 2024
  // =============================================

  {
    id: 'alien-heroes',
    name: 'Alien Heroes',
    shortName: 'Alien Heroes',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Unknown',
    releaseYear: 2023,
    quickId: 'Scatter-only game - collect stars in 3 containers to activate hero features',
    visual: {
      location: 'Look for 3 containers on the right side of the reels showing star collection',
      appearance: [
        { label: 'Mechanics', text: 'All symbols are scatters - no paylines' },
        { label: 'Goal', text: 'Land 8 of same symbol to trigger free games' },
        { label: 'Stars', text: 'Collect 3 stars in a container to activate hero feature' },
      ],
      colors: 'Space/alien theme',
      example: '2 stars in container = close to hero activation'
    },
    thresholdSummary: '2+ stars in any container',
    thresholdDetail: 'When 3 stars are collected in a container, hero feature activates on next spin giving better chance at 8-symbol trigger.',
    notes: 'Unique scatter-only mechanic. Look for partially filled star containers.',
    hasCalculator: false
  },

  {
    id: 'ascending-fortunes',
    name: 'Ascending Fortunes: Jewel Oasis / Pagoda Rising',
    shortName: 'Ascending Fortunes',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: '5 must-hit-by free games meters (Mega/Grand/Major/Minor/Mini) with reel expansions',
    visual: {
      location: 'Check the 5 progressive meters at top of screen',
      appearance: [
        { label: 'Mega (red)', text: 'Resets 250, hits by 350' },
        { label: 'Grand (orange)', text: 'Resets 200, hits by 250' },
        { label: 'Major (purple)', text: 'Resets 150, hits by 200' },
        { label: 'Minor (green)', text: 'Resets 100, hits by 150' },
        { label: 'Mini (blue)', text: 'Resets 75, hits by 125' },
      ],
      colors: 'Asian theme with colorful meters',
      example: 'Mega at 320/350 = 91% = PLAY'
    },
    thresholdSummary: '85%+ of any ceiling',
    thresholdDetail: 'Each meter builds reel expansions for free games (more ways to win). Calculate: current ÷ ceiling.',
    threshold: {
      conservative: '90%+ of any ceiling',
      aggressive: '85%+ especially on higher tiers'
    },
    notes: 'Similar to Stack Up Pays. Reel expansions increase ways to win during bonus.',
    hasCalculator: true
  },

  {
    id: 'azure-dragon',
    name: 'Azure Dragon / Emerald Guardian',
    shortName: 'Azure Dragon',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: '4 progressive free games meters (Mega/Maxi/Minor/Mini) - NOT must-hit-by',
    visual: {
      location: 'Check 4 free games meters - symbols on reel 4 add to meters',
      appearance: [
        { label: 'Meters', text: 'Mega, Maxi, Minor, Mini free games' },
        { label: 'Trigger', text: 'Random - NOT guaranteed to hit' },
        { label: 'Build', text: 'Symbols on reel 4 increase meter counts' },
      ],
      colors: 'Blue dragon / Green guardian themes',
      example: 'High meter counts = more free spins when triggered'
    },
    thresholdSummary: 'High meter counts (VOLATILE)',
    thresholdDetail: 'NOT must-hit-by - triggers are random. Only play with elevated meters AND large bankroll.',
    notes: 'Sister games. Very volatile - only for experienced APs. Similar to Wolf Run Eclipse.',
    hasCalculator: false,
    warning: 'HIGH VOLATILITY - Not must-hit-by!'
  },

  {
    id: 'cash-falls-huo-zhu',
    name: 'Cash Falls: Huo Zhu / Pirate\'s Trove / Island Bounty',
    shortName: 'Cash Falls',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Coins land in reels with 3-spin counter - fill reel to win all credits',
    visual: {
      location: 'Watch for coins locked in reels with countdown timers',
      appearance: [
        { label: 'Coins', text: 'Land with credit values, lock for 3 spins' },
        { label: 'Counter', text: 'Resets to 3 when new coin lands in same reel' },
        { label: 'Goal', text: 'Fill entire reel before counter hits 0' },
      ],
      colors: 'Various themes (Asian, Pirate, Island)',
      example: 'Reel with 3-4 coins and 2+ spins remaining'
    },
    thresholdSummary: 'Reel 3-4 coins full with spins remaining',
    thresholdDetail: 'Look for reels nearly full (3-4 coins of 4 needed) with 2+ spins on counter.',
    notes: 'Multiple themes available. Counter mechanics are key - watch the timers.',
    hasCalculator: false
  },

  {
    id: 'igt-classic-hits',
    name: 'IGT Classic Hits: Coyote Moon / Money Storm / Lobstermania Deluxe',
    shortName: 'IGT Classic Hits',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: '3 must-hit-by progressives per bet level (15 total progressives)',
    visual: {
      location: 'Check all 3 progressive displays at each bet level',
      appearance: [
        { label: 'Progressives', text: 'Top (large), Middle (medium), Bottom (small)' },
        { label: 'Bet Levels', text: '5 different bet levels, each with own progressives' },
        { label: 'Total', text: '15 progressives to check per machine' },
      ],
      colors: 'Classic IGT themes',
      example: 'Any progressive at 90%+ of ceiling'
    },
    thresholdSummary: '90%+ on any progressive',
    thresholdDetail: 'Check ALL bet levels - each has 3 separate progressives. 15 opportunities per machine.',
    threshold: {
      conservative: '90%+ of any ceiling',
      aggressive: '85%+ especially on higher tiers'
    },
    notes: 'Three classic themes. Must check all 5 bet levels × 3 progressives = 15 checks!',
    hasCalculator: true,
    checkBetLevels: true
  },

  {
    id: 'lobstermania-4-link',
    name: 'Lucky Larry\'s Lobstermania 4 Link',
    shortName: 'Lobstermania 4 Link',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Loot Awards above reels 2-4 - activate when 2 coins collected',
    visual: {
      location: 'Check Loot Award displays above reels 2, 3, and 4',
      appearance: [
        { label: 'Awards', text: 'Loot Awards above middle 3 reels' },
        { label: 'Coins', text: 'Need 2 coins to activate award' },
        { label: 'Trigger', text: 'Award activates when 2nd coin lands' },
      ],
      colors: 'Lobster/ocean theme',
      example: '1 coin already in multiple reels'
    },
    thresholdSummary: '1 coin in 2+ reels',
    thresholdDetail: 'Look for reels with 1 coin already collected. One more coin = instant Loot Award.',
    notes: 'Sister game Shrimpmania plays identically. Check middle 3 reels only.',
    hasCalculator: false
  },

  {
    id: 'magic-of-the-nile',
    name: 'Magic of the Nile',
    shortName: 'Magic of the Nile',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2021,
    quickId: '3 obelisks with 3 segments each - fill obelisk to trigger bonus',
    visual: {
      location: 'Watch 3 obelisks above reels showing segment fill',
      appearance: [
        { label: 'Obelisks', text: '3 obelisks, each with 3 segments' },
        { label: 'Fill', text: 'Scarab symbols fill segments' },
        { label: 'Trigger', text: 'Full obelisk = bonus feature' },
      ],
      colors: 'Egyptian Nile theme',
      example: 'Obelisk with 2/3 segments filled'
    },
    thresholdSummary: 'Any obelisk 2/3 full',
    thresholdDetail: 'Simple fill mechanic. Look for obelisks one segment from triggering.',
    notes: 'Each obelisk triggers a different bonus. Straightforward to evaluate.',
    hasCalculator: false
  },

  {
    id: 'magic-treasures',
    name: 'Magic Treasures: Dragon / Tiger',
    shortName: 'Magic Treasures',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Money balls collect in bowl counter - random trigger awards all balls',
    visual: {
      location: 'Green bowl shows money ball count (starts at 5)',
      appearance: [
        { label: 'Counter', text: 'Shows collected money balls' },
        { label: 'Trigger', text: 'Random when money ball lands' },
        { label: 'Reset', text: 'Resets to 5 after feature' },
      ],
      colors: 'Asian dragon/tiger themes',
      example: 'Counter at 25+ money balls'
    },
    thresholdSummary: '20+ money balls collected',
    thresholdDetail: 'More balls = bigger payout when feature triggers. Random trigger, but higher count = better value.',
    notes: 'Foundation for Magic Treasures Gold. Simple accumulator mechanic.',
    hasCalculator: false
  },

  {
    id: 'treasure-box',
    name: 'Treasure Box: Kingdom / Dynasty',
    shortName: 'Treasure Box',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'Keys reduce coins needed for bonus - start at 6, keys on reel 3 reduce count',
    visual: {
      location: 'Watch coin requirement counter and keys collected',
      appearance: [
        { label: 'Coins Needed', text: 'Starts at 6, reduced by keys' },
        { label: 'Keys', text: 'Land on middle reel to reduce requirement' },
        { label: 'Trigger', text: 'Land required coins at once for bonus' },
      ],
      colors: 'Kingdom/Dynasty themes',
      example: 'Only 2 coins needed = very playable'
    },
    thresholdSummary: '3 or fewer coins needed',
    thresholdDetail: 'Keys make bonus easier to trigger. At 2-3 coins needed, hitting bonus becomes much more likely.',
    notes: 'Keys are key! Watch the requirement counter, not just coin count.',
    hasCalculator: false
  },

  {
    id: 'treasure-hunter',
    name: 'Treasure Hunter',
    shortName: 'Treasure Hunter',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Unknown',
    releaseYear: 2022,
    quickId: 'Collect 3 pearls under jackpot to win it (Major/Maxi/Minor/Mini)',
    visual: {
      location: 'Pearl collection under each of 4 jackpots',
      appearance: [
        { label: 'Jackpots', text: 'Major, Maxi, Minor, Mini' },
        { label: 'Pearls', text: 'Collect 3 per jackpot to win' },
        { label: 'Progress', text: 'Shows X/3 pearls per jackpot' },
      ],
      colors: 'Ocean treasure theme',
      example: '2/3 pearls under any jackpot'
    },
    thresholdSummary: '2 pearls under any jackpot',
    thresholdDetail: 'Simple - 3 pearls = jackpot. Look for any jackpot with 2 pearls collected.',
    notes: 'Very straightforward. Higher jackpots = better value at 2/3.',
    hasCalculator: false
  },

  {
    id: 'ufl-cash-falls',
    name: 'Ultimate Fire Link Cash Falls: China Street / Olvera Street',
    shortName: 'UFL Cash Falls',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Fireballs with credits fill reels - 3-spin counter, fill reel to win + possible bonus',
    visual: {
      location: 'Watch for fireballs locked in reels with timers',
      appearance: [
        { label: 'Fireballs', text: 'Land with credits, lock for 3 spins' },
        { label: 'Counter', text: 'Resets to 3 when new fireball lands in reel' },
        { label: 'Special', text: 'Fire Link Feature fireball triggers bonus' },
      ],
      colors: 'Fire Link red/gold theme',
      example: 'Reel nearly full with Fire Link symbol present'
    },
    thresholdSummary: 'Reel 3+ full with spins remaining',
    thresholdDetail: 'Like Cash Falls but with Fire Link bonus potential. Special fireball fills reel = extra feature.',
    notes: 'Combines Cash Falls mechanic with Fire Link bonus. Watch for special fireball.',
    hasCalculator: false
  },

  {
    id: 'wheel-of-fortune-4d',
    name: 'Wheel of Fortune 4D',
    shortName: 'WoF 4D',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Dollar symbol holders above reels - 2 to fill, reel goes wild for 2 spins',
    visual: {
      location: 'Check dollar symbol holders above each reel',
      appearance: [
        { label: 'Holders', text: 'Each reel has holder for 2 dollar symbols' },
        { label: 'When Full', text: 'Reel turns wild for 2 spins' },
        { label: 'Classic', text: 'Wheel of Fortune theme with 4D cabinet' },
      ],
      colors: 'Classic WoF blue/gold',
      example: 'Holder with 1/2 dollar symbols'
    },
    thresholdSummary: 'Multiple holders at 1/2',
    thresholdDetail: 'Similar to Golden Egypt Grand. Wild reels dramatically improve win potential.',
    notes: 'One of the best known AP games. Higher bet level than Golden Egypt.',
    hasCalculator: false
  },

  {
    id: 'wheel-of-fortune-high-roller',
    name: 'Wheel of Fortune High Roller',
    shortName: 'WoF High Roller',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Reels expand 3→8 high - max height triggers wheel spin award above',
    visual: {
      location: 'Watch reel heights and wheel awards above each reel',
      appearance: [
        { label: 'Reels', text: 'Expand from 3 to 8 symbols tall' },
        { label: 'High Roller', text: 'Symbol lands to expand reel' },
        { label: 'Max Height', text: 'At 8, next HR symbol triggers wheel above' },
      ],
      colors: 'WoF theme with high roller styling',
      example: 'Reel at 7 height = one away from wheel'
    },
    thresholdSummary: 'Reels at 6+ height',
    thresholdDetail: 'Like Buffalo Ascension. Reels at 7 = one symbol from triggering wheel spin.',
    notes: 'Wheel spins can have multipliers and multi-pointers. Watch reel heights.',
    hasCalculator: false
  },

  {
    id: 'wizard-of-oz-ftybr',
    name: 'Wizard of Oz: Follow the Yellow Brick Road',
    shortName: 'WoO Yellow Brick',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: '3 progressive free games meters (Silver/Gold/Emerald) - NOT must-hit-by',
    visual: {
      location: 'Check 3 free games meters',
      appearance: [
        { label: 'Meters', text: 'Silver, Gold, Emerald free games' },
        { label: 'Build', text: 'Red shoes on reel 5 increase meters' },
        { label: 'Trigger', text: 'Random - NOT guaranteed' },
      ],
      colors: 'Wizard of Oz theme',
      example: 'High meter counts but random trigger'
    },
    thresholdSummary: 'High meters (VERY VOLATILE)',
    thresholdDetail: 'NOT must-hit-by - extremely volatile. Only for experienced APs with large bankrolls.',
    notes: 'Beautiful game but very dangerous. Triggers are completely random.',
    hasCalculator: false,
    warning: 'EXTREMELY VOLATILE - Not must-hit-by!'
  },

  {
    id: 'cats-wild-serengeti',
    name: 'Cats Wild Serengeti',
    shortName: 'Cats Wild Serengeti',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Sister game to Wolf Run Eclipse - 4 free spin meters that persist',
    visual: {
      location: 'Check the free spin meters at top of screen for each bet level',
      appearance: [
        { label: 'Meters', text: 'Four free spin counters: Mini, Minor, Major, Mega' },
        { label: 'Theme', text: 'African cats, Serengeti savanna' },
        { label: 'Mechanics', text: 'Identical to Wolf Run Eclipse' },
      ],
      colors: 'Golden savanna sunset colors',
      example: 'Check all bet levels for elevated meters'
    },
    thresholdSummary: 'High meter counts (volatile)',
    thresholdDetail: 'Plays identically to Wolf Run Eclipse. NOT must-hit-by. Very high volatility.',
    notes: 'Sister game to Wolf Run Eclipse. Same strategy applies. Check all bet levels.',
    hasCalculator: true,
    checkBetLevels: true,
    warning: 'HIGH VOLATILITY - Large bankroll required!'
  },

  {
    id: 'frankenstein-slot',
    name: 'Frankenstein',
    shortName: 'Frankenstein',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Unknown',
    releaseYear: 2023,
    quickId: 'Prizes above reels gain multipliers - It\'s Alive feature shoots to win prizes',
    visual: {
      location: 'Watch prize array above reels and attached multipliers',
      appearance: [
        { label: 'Prizes', text: 'Jackpots (orange flame) and credits (blue electric)' },
        { label: 'Multipliers', text: 'Power Up symbol adds multipliers to prizes' },
        { label: 'Feature', text: 'It\'s Alive shoots electricity to win prizes' },
      ],
      colors: 'Horror/electric theme',
      example: 'High multipliers (3x+) on jackpot prizes'
    },
    thresholdSummary: 'High multipliers on good prizes',
    thresholdDetail: 'Multipliers persist and apply when prize is won. Look for multipliers on jackpots.',
    notes: 'After feature, multipliers reset and 2-3 new ones added randomly. Track the buildup.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-autumn-moon',
    name: 'Dragon Link: Autumn Moon',
    shortName: 'Dragon Link Autumn',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Hold & Spin with dragon pearls - the most popular slot in Vegas',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Floor managers consistently rank Dragon Link #1. Hold & Spin triggers with 6+ pearls. Four progressive jackpots.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-golden-century',
    name: 'Dragon Link: Golden Century',
    shortName: 'Dragon Link Golden',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Hold & Spin dragon theme - golden variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Part of the dominant Dragon Link family. Same mechanics as Autumn Moon with different theme.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-peace-prosperity',
    name: 'Dragon Link: Peace & Prosperity',
    shortName: 'Dragon Link Peace',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Hold & Spin dragon theme - peace variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Dragon Link variant. Same core mechanics.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-spring-festival',
    name: 'Dragon Link: Spring Festival',
    shortName: 'Dragon Link Spring',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Hold & Spin dragon theme - spring festival variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Seasonal Dragon Link variant. Identical mechanics.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-happy-prosperous',
    name: 'Dragon Link: Happy & Prosperous',
    shortName: 'Dragon Link Happy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Hold & Spin dragon theme - happy variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newer Dragon Link variant with same proven mechanics.',
    hasCalculator: false
  },

  {
    id: 'dragon-link-genghis-khan',
    name: 'Dragon Link: Genghis Khan',
    shortName: 'Dragon Link Genghis',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Hold & Spin with Mongol warrior theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Warrior-themed Dragon Link with same core mechanics.',
    hasCalculator: false
  },
  
  // LIGHTNING LINK SERIES (Aristocrat) - Pioneer of Hold & Spin

  {
    id: 'lightning-link-sahara-gold',
    name: 'Lightning Link: Sahara Gold',
    shortName: 'Lightning Sahara',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Original Hold & Spin mechanic - 6 pearls triggers feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lightning Link pioneered the Hold & Spin mechanic that revolutionized slots. Desert theme.',
    hasCalculator: false
  },

  {
    id: 'lightning-link-high-stakes',
    name: 'Lightning Link: High Stakes',
    shortName: 'Lightning High Stakes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Hold & Spin with card/poker theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Lightning Link variant with gambling theme.',
    hasCalculator: false
  },

  {
    id: 'lightning-link-happy-lantern',
    name: 'Lightning Link: Happy Lantern',
    shortName: 'Lightning Lantern',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Hold & Spin with Asian lantern theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Asian-themed Lightning Link variant.',
    hasCalculator: false
  },

  {
    id: 'lightning-link-bengal-treasures',
    name: 'Lightning Link: Bengal Treasures',
    shortName: 'Lightning Bengal',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Hold & Spin with tiger/Indian theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Tiger-themed Lightning Link variant.',
    hasCalculator: false
  },

  {
    id: 'lightning-link-magic-pearl',
    name: 'Lightning Link: Magic Pearl',
    shortName: 'Lightning Pearl',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Hold & Spin with ocean/mermaid theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ocean-themed Lightning Link variant.',
    hasCalculator: false
  },

  {
    id: 'lightning-link-moon-race',
    name: 'Lightning Link: Moon Race',
    shortName: 'Lightning Moon Race',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Hold & Spin with space/moon theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Space-themed Lightning Link variant.',
    hasCalculator: false
  },
  
  // BUFFALO SERIES (Aristocrat) - Iconic Vegas Brand

  {
    id: 'buffalo-original',
    name: 'Buffalo',
    shortName: 'Buffalo Original',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2008,
    quickId: 'The original - 1024 ways, stacked wilds, free games with multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'The OG that launched a franchise. Still going strong 15+ years later. High volatility classic.',
    hasCalculator: false
  },

  {
    id: 'buffalo-gold',
    name: 'Buffalo Gold',
    shortName: 'Buffalo Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2016,
    quickId: 'Collect 15 gold buffalo heads during bonus for multipliers up to 27x',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Most popular Buffalo variant. Gold head collection adds massive multipliers in bonus. Very high volatility.',
    hasCalculator: false
  },

  {
    id: 'buffalo-grand',
    name: 'Buffalo Grand',
    shortName: 'Buffalo Grand',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Premium Buffalo with wheel bonus and grand jackpot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wheel bonus can award progressive jackpots. Premium cabinet experience.',
    hasCalculator: false
  },

  {
    id: 'buffalo-diamond',
    name: 'Buffalo Diamond',
    shortName: 'Buffalo Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Diamond symbols add extra features during free games',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Diamond collection mechanic enhances bonus rounds.',
    hasCalculator: false
  },

  {
    id: 'buffalo-gold-revolution',
    name: 'Buffalo Gold Revolution',
    shortName: 'Buffalo Revolution',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Updated Buffalo Gold with enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Evolution of Buffalo Gold with modern cabinet and features.',
    hasCalculator: false
  },

  {
    id: 'buffalo-chief',
    name: 'Buffalo Chief',
    shortName: 'Buffalo Chief',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'Chief variant with expanding reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newer Buffalo with expanding reel mechanics.',
    hasCalculator: false
  },
  
  // DANCING DRUMS SERIES (Light & Wonder/SG)

  {
    id: 'dancing-drums',
    name: 'Dancing Drums',
    shortName: 'Dancing Drums',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2017,
    quickId: 'Asian drums theme - Fu Bat jackpot feature, 243 ways',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Very popular Asian-themed slot. Fu Bat feature triggers jackpot picks. Mystery choice free games.',
    hasCalculator: false
  },

  {
    id: 'dancing-drums-explosion',
    name: 'Dancing Drums Explosion',
    shortName: 'DD Explosion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Enhanced Dancing Drums with explosion feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Upgraded version with additional features. One of the most faithful land-to-online transitions.',
    hasCalculator: false
  },

  {
    id: 'dancing-drums-prosperity',
    name: 'Dancing Drums Prosperity',
    shortName: 'DD Prosperity',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Prosperity variant with enhanced jackpot features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest Dancing Drums with prosperity theme.',
    hasCalculator: false
  },
  
  // 88 FORTUNES SERIES (Light & Wonder/SG)

  {
    id: '88-fortunes',
    name: '88 Fortunes',
    shortName: '88 Fortunes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2015,
    quickId: 'Gold symbols trigger Fu Bat jackpot feature - 243 ways',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Asian luck theme. Fu Bat bonus picks from 4 jackpots. Medium volatility, great for extended play.',
    hasCalculator: false
  },

  {
    id: '88-fortunes-diamond',
    name: '88 Fortunes Diamond',
    shortName: '88 Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Diamond variant with enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced version with diamond collection mechanic.',
    hasCalculator: false
  },

  {
    id: '88-fortunes-lucky-gong',
    name: '88 Fortunes Lucky Gong',
    shortName: '88 Lucky Gong',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Gong feature adds wilds and multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gong bonus can transform symbols for big wins.',
    hasCalculator: false
  },
  
  // HUFF N PUFF SERIES (Light & Wonder)

  {
    id: 'huff-n-more-puff',
    name: 'Huff N\' More Puff',
    shortName: 'Huff N More',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Sequel with enhanced pig features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular sequel with additional bonus features.',
    hasCalculator: false
  },

  {
    id: 'huff-n-even-more-puff',
    name: 'Huff N\' Even More Puff',
    shortName: 'Huff N Even More',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Latest sequel with Golden Buzzsaw feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newest version. Golden Buzzsaw shreds reels for guaranteed wins. $50k+ wins reported at Venetian.',
    hasCalculator: false
  },
  
  // ULTIMATE FIRE LINK SERIES (Light & Wonder)

  {
    id: 'ultimate-fire-link',
    name: 'Ultimate Fire Link',
    shortName: 'Fire Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Fireball collection triggers Hold & Spin feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Hold & Spin game. Multiple themed variants available.',
    hasCalculator: false
  },

  {
    id: 'ufl-china-street',
    name: 'Ultimate Fire Link: China Street',
    shortName: 'Fire Link China',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Asian-themed Fire Link variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese theme with Fire Link mechanics.',
    hasCalculator: false
  },

  {
    id: 'ufl-olvera-street',
    name: 'Ultimate Fire Link: Olvera Street',
    shortName: 'Fire Link Olvera',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Mexican-themed Fire Link variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mexican marketplace theme with Fire Link mechanics.',
    hasCalculator: false
  },

  {
    id: 'ufl-glacier-gold',
    name: 'Ultimate Fire Link: Glacier Gold',
    shortName: 'Fire Link Glacier',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Ice/glacier themed Fire Link variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Winter theme with Fire Link mechanics.',
    hasCalculator: false
  },

  {
    id: 'ufl-explosion',
    name: 'Ultimate Fire Link Explosion',
    shortName: 'Fire Link Explosion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Enhanced Fire Link with explosion features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Premium version with enhanced features.',
    hasCalculator: false
  },
  
  // LOCK IT LINK SERIES (Light & Wonder)

  {
    id: 'lock-it-link-nightlife',
    name: 'Lock It Link: Nightlife',
    shortName: 'Lock It Nightlife',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2017,
    quickId: 'Lock symbols in place - party/nightclub theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Locking reel mechanic. Nightclub theme with neon aesthetics.',
    hasCalculator: false
  },

  {
    id: 'lock-it-link-diamonds',
    name: 'Lock It Link: Diamonds',
    shortName: 'Lock It Diamonds',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Diamond theme with locking mechanic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic diamond theme with Lock It Link feature.',
    hasCalculator: false
  },

  {
    id: 'lock-it-link-loteria',
    name: 'Lock It Link: Loteria',
    shortName: 'Lock It Loteria',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Mexican lottery card theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mexican Loteria card theme with Lock It Link mechanics.',
    hasCalculator: false
  },
  
  // CLASSIC IGT SLOTS

  {
    id: 'cleopatra-ii',
    name: 'Cleopatra II',
    shortName: 'Cleopatra II',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Sequel with increasing multipliers during free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced version with multipliers that increase with each retrigger.',
    hasCalculator: false
  },

  {
    id: 'da-vinci-diamonds',
    name: 'Da Vinci Diamonds',
    shortName: 'Da Vinci Diamonds',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2007,
    quickId: 'Tumbling reels - winning symbols disappear for new wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pioneer of tumbling reels mechanic. Renaissance art theme. Multiple consecutive wins possible.',
    hasCalculator: false
  },

  {
    id: 'wolf-run',
    name: 'Wolf Run',
    shortName: 'Wolf Run',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2006,
    quickId: 'Wolf pack theme - 40 paylines, stacked wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic IGT with stacked wilds. Howling wolves and nature theme.',
    hasCalculator: false
  },

  {
    id: 'siberian-storm',
    name: 'Siberian Storm',
    shortName: 'Siberian Storm',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2011,
    quickId: 'White tiger theme - 720 ways MultiWay Xtra',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'MultiWay Xtra pays both ways. Stunning white tiger graphics.',
    hasCalculator: false
  },

  {
    id: 'texas-tea',
    name: 'Texas Tea',
    shortName: 'Texas Tea',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2005,
    quickId: 'Oil baron theme - oil derrick bonus game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Named "Top 5 favorite video slots" by Strictly Slots. Classic oil tycoon theme.',
    hasCalculator: false
  },

  {
    id: 'triple-diamond',
    name: 'Triple Diamond',
    shortName: 'Triple Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1994,
    quickId: '3-reel classic - triple diamonds multiply wins 3x',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Evolution of Double Diamond. Two triple diamonds = 9x multiplier.',
    hasCalculator: false
  },

  {
    id: 'kitty-glitter',
    name: 'Kitty Glitter',
    shortName: 'Kitty Glitter',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2011,
    quickId: 'Glamorous cats theme - diamond collection during free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Collect diamonds during free spins for extra wilds. Cute cat theme.',
    hasCalculator: false
  },

  {
    id: 'golden-goddess',
    name: 'Golden Goddess',
    shortName: 'Golden Goddess',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2011,
    quickId: 'Greek mythology theme - super stacks feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Super Stacks can fill reels with same symbol. Elegant Greek theme.',
    hasCalculator: false
  },
  
  // KONAMI POPULAR SLOTS

  {
    id: 'china-shores',
    name: 'China Shores',
    shortName: 'China Shores',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2010,
    quickId: 'Panda theme - action stacked symbols, up to 320 free games',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Konami\'s first major online hit. Massive free spin potential. Action stacked symbols.',
    hasCalculator: false
  },

  {
    id: 'chili-chili-fire',
    name: 'Chili Chili Fire',
    shortName: 'Chili Chili Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Mexican theme - fade away feature, action stacked symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fiery Mexican theme. Fade Away feature gives cascading wins. 96.09% RTP.',
    hasCalculator: false
  },

  {
    id: 'lion-festival',
    name: 'Lion Festival: Boosted Celebration',
    shortName: 'Lion Festival',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Chinese lion dance theme - boosted free spins option',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Can exchange regular free spins for super spins with larger multipliers.',
    hasCalculator: false
  },

  {
    id: 'fortune-stacks',
    name: 'Fortune Stacks',
    shortName: 'Fortune Stacks',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2016,
    quickId: 'Asian fortune theme - action stacked symbols with multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Action stacked symbols get 2x, 3x, or 5x multipliers during free spins.',
    hasCalculator: false
  },

  {
    id: 'lotus-land',
    name: 'Lotus Land',
    shortName: 'Lotus Land',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2014,
    quickId: 'Peaceful Asian garden theme - wild reels feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Serene lotus theme. Wild reels can appear during base game.',
    hasCalculator: false
  },
  
  // WMS/LIGHT & WONDER CLASSICS

  {
    id: 'zeus',
    name: 'Zeus',
    shortName: 'Zeus',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2006,
    quickId: 'Greek god theme - 30 paylines, free spins with wild reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'WMS classic. Simple but engaging. Multiple sequels spawned.',
    hasCalculator: false
  },

  {
    id: 'zeus-iii',
    name: 'Zeus III',
    shortName: 'Zeus III',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: '6-reel version with 192 ways, hot hot super respin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Extended 6-reel format. Hot Hot Super Respin feature.',
    hasCalculator: false
  },

  {
    id: 'kronos',
    name: 'Kronos',
    shortName: 'Kronos',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Titan father of Zeus - similar mechanics to Zeus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Zeus companion game. Same core mechanics with Titan theme.',
    hasCalculator: false
  },

  {
    id: 'raging-rhino',
    name: 'Raging Rhino',
    shortName: 'Raging Rhino',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'African safari theme - 4096 ways, free spins with multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: '4096 ways to win. High volatility. Retriggers add multipliers.',
    hasCalculator: false
  },

  {
    id: 'monopoly-big-event',
    name: 'Monopoly Big Event',
    shortName: 'Monopoly Big Event',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2016,
    quickId: 'Monopoly board game theme - side bet for enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Big Bet feature unlocks enhanced bonus rounds. 99% RTP with Big Bet.',
    hasCalculator: false
  },
  
  // AGS POPULAR SLOTS

  {
    id: 'rakin-bacon',
    name: 'Rakin\' Bacon',
    shortName: 'Rakin\' Bacon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Pig theme - 243 ways, Power XStream pays both directions',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Very popular on Vegas floors. Reel Surge expands reels. 95.89% RTP.',
    hasCalculator: false
  },

  {
    id: 'rakin-bacon-link',
    name: 'Rakin\' Bacon Link',
    shortName: 'Rakin Bacon Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: 'Link version with hold and spin feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newer version combining Rakin Bacon with Hold & Spin mechanics.',
    hasCalculator: false
  },

  {
    id: 'fire-wolf-ii-ags',
    name: 'Fire Wolf II (AGS)',
    shortName: 'Fire Wolf II AGS',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Wolf theme - up to 128 free spins, mystery jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High volatility. Reel Surge and Power XStream mechanics. Note: Different from MHB version.',
    hasCalculator: false
  },

  {
    id: 'fu-nan-fu-nu',
    name: 'Fu Nan Fu Nu',
    shortName: 'Fu Nan Fu Nu',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2017,
    quickId: 'Lucky boy/girl theme - Power XStream, random jackpot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Distinctive screen layout. Random jackpot pick feature.',
    hasCalculator: false
  },
  
  // EVERI POPULAR SLOTS

  {
    id: 'cash-machine',
    name: 'Cash Machine',
    shortName: 'Cash Machine',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2018,
    quickId: 'ATM/money theme - simple high-paying symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Everi game. Money/ATM theme. Straightforward gameplay.',
    hasCalculator: false
  },

  {
    id: 'smokin-hot-gems',
    name: 'Smokin\' Hot Gems',
    shortName: 'Smokin Hot Gems',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2019,
    quickId: 'Gem/jewel theme with fire elements',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Everi gem-themed slot.',
    hasCalculator: false
  },

  {
    id: 'press-your-luck',
    name: 'Press Your Luck',
    shortName: 'Press Your Luck',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'TV game show theme - avoid the Whammy!',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Based on classic game show. Big Board bonus with Whammy risk.',
    hasCalculator: false
  },
  
  // PROGRESSIVES/WIDE AREA

  {
    id: 'megabucks',
    name: 'Megabucks',
    shortName: 'Megabucks',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1986,
    quickId: 'Nevada-wide progressive - starts at $10 million minimum jackpot',
    thresholdSummary: 'NO ADVANTAGE PLAY - Worst odds on floor',
    notes: 'Holds the record: $39.7M won at Excalibur in 2003. 11%+ house edge. Play for the dream, not the math.',
    hasCalculator: false,
    warning: 'WORST ODDS - ~11% house edge!'
  },

  {
    id: 'wheel-of-fortune-progressive',
    name: 'Wheel of Fortune Progressive',
    shortName: 'WoF Progressive',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1996,
    quickId: 'Wide-area progressive linked across Nevada',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Multiple jackpot tiers. The iconic spinning wheel. One of Vegas\'s most recognizable games.',
    hasCalculator: false
  },
  
  // OTHER POPULAR VEGAS MACHINES,

  {
    id: 'invaders-planet-moolah',
    name: 'Invaders from Planet Moolah',
    shortName: 'Planet Moolah',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Alien cow theme - cascading reels with free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Quirky alien cow invasion theme. Cascading reels for consecutive wins.',
    hasCalculator: false
  },

  {
    id: 'money-link',
    name: 'Money Link: The Great Immortals',
    shortName: 'Money Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Link feature with immortal characters theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newer Light & Wonder link game. Popular on Vegas floors.',
    hasCalculator: false
  },

  {
    id: 'james-bond-thunderball',
    name: 'James Bond: Thunderball',
    shortName: 'Bond Thunderball',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: '007 license - spy theme with multiple bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed James Bond theme. Multiple bonus rounds.',
    hasCalculator: false
  },

  {
    id: 'the-walking-dead',
    name: 'The Walking Dead',
    shortName: 'Walking Dead',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'AMC zombie series theme - walker bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed AMC theme. Multiple walker-themed bonus rounds.',
    hasCalculator: false
  },
  
  // =============================================
  // G2E 2025 RELEASES (October 2025)
  // These are hitting casino floors late 2025 / early 2026
  // =============================================
  
  // IGT G2E 2025 - AP RELEVANT

  {
    id: 'surefire-frenzy-link',
    name: 'SureFire Frenzy Link',
    shortName: 'SureFire Frenzy',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: '27 MUST-HIT-BY PROGRESSIVES - Most ever in a single machine! Linked bank competition.',
    visual: {
      location: 'Check ALL 27 progressive displays - players compete within linked bank',
      appearance: [
        { label: 'Progressives', text: '27 separate must-hit-by meters' },
        { label: 'Competition', text: 'Linked machines - players race to hit' },
        { label: 'Strategy', text: 'Check entire bank for best opportunities' },
      ],
      colors: 'Modern IGT cabinet design',
      example: 'Any meter at 90%+ = potential play'
    },
    thresholdSummary: '90%+ on any of 27 meters',
    thresholdDetail: 'MOST MHB PROGRESSIVES EVER. Each meter is independent. Check all 27 for plays. Linked bank means competition with other players.',
    threshold: {
      conservative: '90%+ of any ceiling',
      aggressive: '85%+ on multiple meters'
    },
    notes: 'Debuted G2E 2025. Revolutionary number of MHB progressives. Worth learning all meter ceilings.',
    hasCalculator: true,
    checkBetLevels: true,
    warning: 'NEW RELEASE - Learn all 27 meter ceilings!'
  },

  {
    id: 'wheel-of-fortune-cash-machine',
    name: 'Wheel of Fortune Cash Machine Jackpots',
    shortName: 'WoF Cash Machine',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'IGT + Everi merger flagship - Cash Machine base game + WoF wheel bonus',
    thresholdSummary: 'NO CONFIRMED AP - Research needed',
    notes: 'Star product of IGT/Everi merger. Cash Machine gameplay with Wheel of Fortune bonus wheel. On 12-foot MegaTower Rise cabinet. Research for potential AP features.',
    hasCalculator: false,
    warning: 'NEW - Research for AP potential'
  },

  {
    id: 'magic-treasures-lock-respin',
    name: 'Magic Treasures Lock & Respin',
    shortName: 'Magic Treasures L&R',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Updated Magic Treasures with lock and respin mechanic',
    thresholdSummary: 'Similar to original - check money ball count',
    thresholdDetail: 'Likely similar mechanics to original Magic Treasures. Watch for accumulated money balls.',
    notes: 'G2E 2025 release on RISE32 cabinet. Research specific mechanics when encountered.',
    hasCalculator: false,
    warning: 'NEW - Verify mechanics match original'
  },

  {
    id: 'eternal-link',
    name: 'Eternal Link: Warrior\'s Empire',
    shortName: 'Eternal Link',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'New IGT link series - research mechanics when encountered',
    thresholdSummary: 'UNKNOWN - New release',
    notes: 'Major new IGT franchise debuting G2E 2025. On RISE55 cabinet. Research for AP potential.',
    hasCalculator: false,
    warning: 'NEW - Research AP potential'
  },
  
  // IGT G2E 2025 - Entertainment

  {
    id: 'smokin-hot-stuff-wicked-wheel-grand',
    name: 'Smokin\' Hot Stuff Wicked Wheel Grand',
    shortName: 'Hot Stuff Wicked',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Hot Stuff devil character + Wicked Wheel mechanic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Dynasty Luna cabinet. Combines Hot Stuff IP with Wicked Wheel feature.',
    hasCalculator: false
  },

  {
    id: 'magic-rockets-tiger',
    name: 'Magic Rockets Tiger',
    shortName: 'Magic Rockets Tiger',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Rocket-themed slot with tiger variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on RISE55 cabinet.',
    hasCalculator: false
  },

  {
    id: 'magic-rockets-dragon',
    name: 'Magic Rockets Dragon',
    shortName: 'Magic Rockets Dragon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Rocket-themed slot with dragon variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on RISE55 cabinet.',
    hasCalculator: false
  },

  {
    id: 'jackpot-express-igt',
    name: 'Jackpot Express',
    shortName: 'Jackpot Express',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Train-themed jackpot game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Dynasty Sol cabinet.',
    hasCalculator: false
  },

  {
    id: 'stink-link-hawaii',
    name: 'Stink Link: Hawaii',
    shortName: 'Stink Link Hawaii',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Link game with Hawaiian theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on RISE32 cabinet.',
    hasCalculator: false
  },

  {
    id: 'stink-link-wild-west',
    name: 'Stink Link: Wild West',
    shortName: 'Stink Link West',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Link game with Western theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on RISE32 cabinet.',
    hasCalculator: false
  },

  {
    id: 'king-khufu',
    name: 'King Khufu',
    shortName: 'King Khufu',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Egyptian pharaoh theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on RISE32 cabinet. Egyptian pyramid builder theme.',
    hasCalculator: false
  },

  {
    id: 'whitney-houston-slots',
    name: 'Whitney Houston Slots',
    shortName: 'Whitney Houston',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Licensed Whitney Houston music theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed music slot featuring Whitney Houston. Recent hit release.',
    hasCalculator: false
  },

  {
    id: 'prosperity-link-2025',
    name: 'Prosperity Link (2025)',
    shortName: 'Prosperity Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Updated Prosperity Link with new features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 updated version of Prosperity Link series.',
    hasCalculator: false
  },

  {
    id: 'tiger-and-dragon-2025',
    name: 'Tiger and Dragon (2025)',
    shortName: 'Tiger and Dragon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Updated Tiger and Dragon with Cash on Reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Won "Top Performing New Premium Game" at EKG Slot Awards.',
    hasCalculator: false
  },

  {
    id: 'wof-cash-on-reels',
    name: 'Wheel of Fortune Cash on Reels',
    shortName: 'WoF Cash on Reels',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'WoF with Cash on Reels mechanic on RISE55/MegaTower cabinets',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Multi-level progressive on spectacular new cabinets.',
    hasCalculator: false
  },

  {
    id: 'kitty-glitter-grand',
    name: 'Kitty Glitter Grand',
    shortName: 'Kitty Glitter Grand',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Premium version of classic Kitty Glitter',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Simultaneous land-based and online launch. Premium cabinet experience.',
    hasCalculator: false
  },
  
  // ARISTOCRAT G2E 2025

  {
    id: 'buffalo-mega-stampede',
    name: 'Buffalo Mega Stampede',
    shortName: 'Buffalo Mega',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Expanding reels + Hold & Spin + 3-level Bonus Meter',
    visual: {
      location: 'Check the 3-level Bonus Meter progress',
      appearance: [
        { label: 'Reels', text: 'Expanding reels during features' },
        { label: 'Hold & Spin', text: 'Standard Aristocrat H&S mechanic' },
        { label: 'Bonus Meter', text: '3 levels - check progress' },
      ],
      colors: 'Buffalo orange/sunset theme',
      example: 'Bonus meter nearly full on any level'
    },
    thresholdSummary: 'Check 3-level Bonus Meter',
    thresholdDetail: 'Builds on Buffalo Ultimate Stampede. Watch the 3-level bonus meter for accumulated progress.',
    notes: 'G2E 2025 release. Latest Buffalo evolution. Research specific meter thresholds.',
    hasCalculator: false,
    warning: 'NEW - Research meter thresholds'
  },

  {
    id: 'phoenix-link-confucius',
    name: 'Phoenix Link: Confucius Say',
    shortName: 'Phoenix Confucius',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Phoenix rises to revive bonus rounds - similar to Dragon Link but with revival feature',
    visual: {
      location: 'Phoenix symbol counter + revival indicator',
      appearance: [
        { label: 'Counter', text: 'Similar to Dragon Link mechanics' },
        { label: 'Phoenix Revival', text: 'Bonus can revive for additional wins' },
        { label: 'Hold & Spin', text: 'Standard Aristocrat H&S' },
      ],
      colors: 'Red/gold phoenix fire theme',
      example: 'Counter near ceiling + revival potential'
    },
    thresholdSummary: 'Similar to Dragon Link - check counter',
    thresholdDetail: 'New Phoenix Link series. Phoenix revival feature extends bonus rounds. Research specific ceiling values.',
    notes: 'G2E 2025 release. Phoenix can revive bonus for more wins. Sister game to Dragon Link.',
    hasCalculator: false,
    warning: 'NEW - Research ceiling values'
  },

  {
    id: 'phoenix-link-general-tso',
    name: 'Phoenix Link: General Tso',
    shortName: 'Phoenix General Tso',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Phoenix Link variant with General Tso theme',
    thresholdSummary: 'Similar to Dragon Link mechanics',
    notes: 'G2E 2025 release. Part of new Phoenix Link series with revival feature.',
    hasCalculator: false,
    warning: 'NEW - Research ceiling values'
  },

  {
    id: 'phoenix-link-queen-chiu',
    name: 'Phoenix Link: Queen Chiu',
    shortName: 'Phoenix Queen Chiu',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Phoenix Link variant with Queen theme',
    thresholdSummary: 'Similar to Dragon Link mechanics',
    notes: 'G2E 2025 release. Part of new Phoenix Link series with revival feature.',
    hasCalculator: false,
    warning: 'NEW - Research ceiling values'
  },

  {
    id: 'phoenix-link-sensei-master',
    name: 'Phoenix Link: Sensei Master',
    shortName: 'Phoenix Sensei',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Phoenix Link variant with martial arts master theme',
    thresholdSummary: 'Similar to Dragon Link mechanics',
    notes: 'G2E 2025 release. Part of new Phoenix Link series with revival feature.',
    hasCalculator: false,
    warning: 'NEW - Research ceiling values'
  },

  {
    id: 'monopoly-big-board-bucks',
    name: 'Monopoly Big Board Bucks',
    shortName: 'Monopoly Big Board',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'First Aristocrat Monopoly under new Hasbro license - pot collection + Hold & Spin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. First Monopoly game under Aristocrat\'s new Hasbro license. On Baron Portrait cabinet.',
    hasCalculator: false
  },

  {
    id: 'millioniser',
    name: 'Millioni$er',
    shortName: 'Millioniser',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'New mechanic + progressive jackpot on Baron Portrait cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Introduces new game mechanic. On Baron Portrait cabinet.',
    hasCalculator: false
  },

  {
    id: 'bao-zhu-zhao-fu-firecrackers',
    name: 'Bao Zhu Zhao Fu Firecrackers Express',
    shortName: 'BZZF Firecrackers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: '5 overlapping features = up to 31 different bonus combos',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Double, Ultra, Zone, Twin, Extra features can all overlap.',
    hasCalculator: false
  },
  
  // LIGHT & WONDER G2E 2025

  {
    id: 'dancing-drums-revolution',
    name: 'Dancing Drums Revolution',
    shortName: 'DD Revolution',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Latest Dancing Drums on LightWave cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on new LightWave cabinet system. Spectacular light show integration.',
    hasCalculator: false
  },

  {
    id: 'frankenstein-returns',
    name: 'Frankenstein Returns',
    shortName: 'Frankenstein Returns',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Universal Monsters Frankenstein sequel on LightWave',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on LightWave cabinet. Universal Monsters license.',
    hasCalculator: false
  },

  {
    id: 'visitors-planet-moolah',
    name: 'Visitors From Planet Moolah',
    shortName: 'Visitors Moolah',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Sequel to Invaders from Planet Moolah on LightWave',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on LightWave cabinet. Alien cow theme continues.',
    hasCalculator: false
  },

  {
    id: 'ufl-cash-falls-explosion',
    name: 'Ultimate Fire Link Cash Falls Explosion',
    shortName: 'UFL Cash Falls Exp',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Combined Fire Link + Cash Falls mechanics on LightWave',
    thresholdSummary: 'Check fireball fill + reel counters',
    thresholdDetail: 'Combines Cash Falls fill mechanic with Fire Link features. Watch for partially filled reels.',
    notes: 'G2E 2025 release on LightWave cabinet. Combines two popular mechanics.',
    hasCalculator: false,
    warning: 'NEW - Research specific thresholds'
  },

  {
    id: 'jackpot-party-vip-disco',
    name: 'Jackpot Party VIP-Disco',
    shortName: 'JP VIP Disco',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Modern disco party version of classic Jackpot Party',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on LightWave cabinet. Evolution of 1998 WMS classic.',
    hasCalculator: false
  },

  {
    id: 'willy-wonka-sweet-selection',
    name: 'Willy Wonka Sweet Selection',
    shortName: 'Wonka Sweet',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Four-pot Wonka with Golden Goose Hold & Spin feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Cosmic Sky cabinet. Free-spin + hold-and-spin features.',
    hasCalculator: false
  },

  {
    id: 'squid-game-slot',
    name: 'Squid Game',
    shortName: 'Squid Game',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Netflix series license - Red Light Green Light, Tug of War, Glass Tile games',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed from most-popular Netflix series. On HORIZON 75-inch cabinet. Features iconic show games.',
    hasCalculator: false
  },
  
  // KONAMI G2E 2025

  {
    id: 'money-in-the-bank-konami',
    name: 'Money in the Bank',
    shortName: 'Money in Bank',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'New Konami parent franchise - accumulator mechanic',
    thresholdSummary: 'Check bank accumulation',
    thresholdDetail: 'New parent franchise from Konami. Bank accumulation mechanic - research specific thresholds.',
    notes: 'G2E 2025 major new franchise. Multiple derivative games expected. Worth learning.',
    hasCalculator: false,
    warning: 'NEW FRANCHISE - Research mechanics'
  },

  {
    id: 'bomberman-boom',
    name: 'Bomberman Boom',
    shortName: 'Bomberman Boom',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'Bomberman license - 3 bomb collection pots, bombs break walls for prizes',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Solstice 49C cabinet. Licensed Bomberman character. Three bonus types.',
    hasCalculator: false
  },

  {
    id: 'china-shores-link-majesty',
    name: 'China Shores Link Majesty',
    shortName: 'CS Link Majesty',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'China Shores with 3 panda pots that enhance free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Solstice 49C. Evolution of classic China Shores.',
    hasCalculator: false
  },

  {
    id: 'red-fortune-rail',
    name: 'Red Fortune Rail',
    shortName: 'Red Fortune Rail',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'Train theme - hold-and-spin within hold-and-spin feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Yin-yang symbols trigger second H&S within H&S feature.',
    hasCalculator: false
  },

  {
    id: 'broadside-bounty',
    name: 'Broadside Bounty',
    shortName: 'Broadside Bounty',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'Pirate ship cannon theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Pirate/naval battle theme.',
    hasCalculator: false
  },

  {
    id: 'kintsugi-cat',
    name: 'Kintsugi Cat',
    shortName: 'Kintsugi Cat',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'Japanese art theme with lucky cat',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Kintsugi (gold repair art) + maneki-neko theme.',
    hasCalculator: false
  },

  {
    id: 'volcanic-rock-fire',
    name: 'Volcanic Rock Fire',
    shortName: 'Volcanic Rock Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2025,
    quickId: 'Volcano/fire theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Fire/lava theme.',
    hasCalculator: false
  },
  
  // AGS G2E 2025

  {
    id: 'moo-cluck-oink',
    name: 'Moo Cluck Oink',
    shortName: 'Moo Cluck Oink',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Farm-themed three-pot metamorphic game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release on Spectra UR43 Premium cabinet. Farm animal theme.',
    hasCalculator: false
  },

  {
    id: 'rakin-bacon-odyssey',
    name: 'Rakin\' Bacon Odyssey',
    shortName: 'Rakin Bacon Odyssey',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Cornsquealius returns in adventure theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Popular pig character Cornsquealius continues.',
    hasCalculator: false
  },

  {
    id: 'rakin-bacon-sahara',
    name: 'Rakin\' Bacon Sahara',
    shortName: 'Rakin Bacon Sahara',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Cornsquealius in desert/Sahara theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Desert-themed Rakin Bacon variant.',
    hasCalculator: false
  },

  {
    id: 'fu-nan-fu-nu-prosperity',
    name: 'Fu Nan Fu Nu Prosperity',
    shortName: 'FNFN Prosperity',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Premium merchandising version of Fu Nan Fu Nu',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Premium cabinet version.',
    hasCalculator: false
  },

  {
    id: 'fu-nan-fu-nu-longevity',
    name: 'Fu Nan Fu Nu Longevity',
    shortName: 'FNFN Longevity',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Premium merchandising version with longevity theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Premium cabinet version.',
    hasCalculator: false
  },

  {
    id: 'triple-coin-treasures-gold',
    name: 'Triple Coin Treasures Gold',
    shortName: 'Triple Coin Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2025,
    quickId: 'Four-pot version of award-winning Triple Coin Treasures',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Won "Best Slot Product" at 2024 GGB Gaming & Technology Awards.',
    hasCalculator: false
  },
  
  // AINSWORTH G2E 2025

  {
    id: 'train-heist-robbers-roost',
    name: 'Train Heist: Robber\'s Roost',
    shortName: 'Train Heist Robbers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2025,
    quickId: 'Western train robbery theme - 3 collection pots, train chase bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Train robber chases train to collect credits. Three pots boost values.',
    hasCalculator: false
  },

  {
    id: 'train-heist-rio-grande',
    name: 'Train Heist: Rio Grande Pass',
    shortName: 'Train Heist Rio',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2025,
    quickId: 'Mexican bandito train robbery variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Mexican bandito theme with train chase bonus.',
    hasCalculator: false
  },
  
  // EVERI/IGT G2E 2025 (pre-merger Everi games now under IGT)

  {
    id: 'powerball-slot',
    name: 'Powerball',
    shortName: 'Powerball',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Licensed Powerball lottery theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Licensed lottery brand. Launching Q4 2025.',
    hasCalculator: false
  },

  {
    id: 'casper-slot',
    name: 'Casper',
    shortName: 'Casper',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Casper the Friendly Ghost license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Announced G2E 2025. May not be widely deployed yet.',
    hasCalculator: false
  },

  {
    id: 'fire-lion',
    name: 'Fire Lion',
    shortName: 'Fire Lion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2025,
    quickId: 'Australian-designed fire lion theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 release. Developed by Australian designer in collaboration with Everi.',
    hasCalculator: false
  },
  
  // INCREDIBLE TECHNOLOGIES G2E 2025

  {
    id: 'double-stack-up-pays',
    name: 'Double Stack-Up Pays',
    shortName: 'Double Stack-Up',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2025,
    quickId: 'Expanding reels - can trigger 2 bonuses or win 2 jackpots at once',
    thresholdSummary: 'Check reel expansion state',
    thresholdDetail: 'Similar to Stack Up Pays but can double-trigger. Watch for expanded reel states.',
    notes: 'G2E 2025 release on new Prism Spark curved-screen cabinet.',
    hasCalculator: false,
    warning: 'NEW - Research specific mechanics'
  },
  
  // INTERBLOCK G2E 2025 (ETG focused)

  {
    id: 'marble-run-2025',
    name: 'Marble Run (2025)',
    shortName: 'Marble Run',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Interblock',
    releaseYear: 2025,
    quickId: 'Improved marble racing ETG - expanding/contracting track',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2025 improved version. Part of AMUSE series. Casual gambler focused.',
    hasCalculator: false
  },

  // =============================================
  // MACHINE PRO CLUB AP MACHINES (79 documented)
  // Adding all missing AP machines from their list
  // =============================================


  {
    id: 'ascending-fortunes-jewel-oasis',
    name: 'Ascending Fortunes: Jewel Oasis',
    shortName: 'Ascending Jewel',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: '5 MHB free games meters - reel expansions increase ways to win',
    visual: {
      location: 'Five colored meters above reels',
      appearance: [
        { label: 'Mega (red)', text: 'Resets 250, hits by 350' },
        { label: 'Grand (orange)', text: 'Resets 200, hits by 250' },
        { label: 'Major (purple)', text: 'Resets 150, hits by 200' },
        { label: 'Minor (green)', text: 'Resets 100, hits by 150' },
        { label: 'Mini (blue)', text: 'Resets 75, hits by 125' }
      ]
    },
    thresholdSummary: 'Mega 320+, Grand 230+, Major 180+',
    thresholdDetail: 'Same mechanics as Stack Up Pays. Meters build reel expansions for 10 free games.',
    notes: 'Sister game to Stack Up Pays with different theme.',
    hasCalculator: true
  },

  {
    id: 'ascending-fortunes-pagoda-rising',
    name: 'Ascending Fortunes: Pagoda Rising',
    shortName: 'Ascending Pagoda',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: '5 MHB free games meters - same as Jewel Oasis',
    thresholdSummary: 'Mega 320+, Grand 230+, Major 180+',
    thresholdDetail: 'Same mechanics as Stack Up Pays/Jewel Oasis.',
    notes: 'Asian pagoda theme variant of Ascending Fortunes.',
    hasCalculator: true
  },

  {
    id: 'cleopatras-vault',
    name: 'Cleopatra\'s Vault',
    shortName: 'Cleo Vault',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2022,
    quickId: 'Same as Aztec Vault - fill column to win',
    thresholdSummary: 'Column nearly full (1-2 coins needed)',
    thresholdDetail: 'Identical mechanics to Aztec Vault with Egyptian theme.',
    notes: 'Sister game to Aztec Vault.',
    hasCalculator: false
  },

  {
    id: 'big-ocean-jackpots',
    name: 'Big Ocean Jackpots',
    shortName: 'Big Ocean',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Bubbles move up each spin - jackpot bubbles on coins = win',
    visual: {
      location: 'Bubbles floating above reels',
      appearance: [
        { label: 'Jackpot bubbles', text: 'Mini, Minor, Maxi prizes' },
        { label: 'Wild bubbles', text: 'Turn poker symbols wild' },
        { label: 'Movement', text: 'Bubbles move up 1 position per spin' }
      ]
    },
    thresholdSummary: 'Jackpot bubble 1-2 rows from coin position',
    thresholdDetail: 'Bubbles move up each spin. Jackpot bubble landing on coin = win that jackpot.',
    notes: 'Track bubble positions relative to coin symbols.',
    hasCalculator: false
  },

  {
    id: 'block-bonanza-hawaii',
    name: 'Block Bonanza: Hawaii',
    shortName: 'Block Hawaii',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Colored blocks above reels with credit values - dollar symbols trigger corresponding block prizes',
    visual: {
      location: 'Blocks above reels matching positions below',
      appearance: [
        { label: 'Blocks', text: 'Credit values in colored blocks' },
        { label: 'Trigger', text: 'Dollar in reels 1-3 = win matching block' }
      ]
    },
    thresholdSummary: 'High credit values in blocks',
    thresholdDetail: 'Look for blocks with much higher than normal credit values.',
    notes: 'Block positions match reel positions below.',
    hasCalculator: false
  },

  {
    id: 'block-bonanza-rio',
    name: 'Block Bonanza: Rio',
    shortName: 'Block Rio',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as Hawaii - high value blocks',
    thresholdSummary: 'High credit values in blocks',
    notes: 'Rio carnival theme variant.',
    hasCalculator: false
  },

  {
    id: 'bonus-builder-emerald',
    name: 'Bonus Builder: Emerald Spins',
    shortName: 'Bonus Builder',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: '3 bonuses (red/blue/purple) - clovers build features or trigger',
    visual: {
      location: 'Three bonus meters - red, blue, purple',
      appearance: [
        { label: 'Red bonus', text: 'Expanded reels' },
        { label: 'Blue bonus', text: 'More free spins' },
        { label: 'Purple bonus', text: 'Low symbols removed' }
      ]
    },
    thresholdSummary: 'Any bonus meter highly built up',
    thresholdDetail: 'Clover symbols can build OR trigger bonuses. Higher build = better bonus when triggered.',
    notes: 'Complex game - features stack. MPC has calculator.',
    hasCalculator: true
  },

  {
    id: 'captain-riches',
    name: 'Captain Riches',
    shortName: 'Captain Riches',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Coin holders above reels 2-4 - 3 coins = wild reel for 3 spins',
    visual: {
      location: 'Coin holders above reels 2, 3, 4',
      appearance: [
        { label: 'Coins', text: 'Collect 3 to activate wild reel' },
        { label: 'Wild duration', text: '3 spins once activated' }
      ]
    },
    thresholdSummary: '2 coins collected in any holder',
    thresholdDetail: 'WARNING: Borderline AP trap. Understand mechanics before playing.',
    notes: 'MPC warns this is borderline - be careful.',
    hasCalculator: false,
    warning: 'Borderline AP trap - research first'
  },

  {
    id: 'tiki-fortune',
    name: 'Tiki Fortune',
    shortName: 'Tiki Fortune',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Same as Captain Riches - 3 coins = wild reel',
    thresholdSummary: '2 coins collected in any holder',
    notes: 'Sister game to Captain Riches. Same AP trap warning.',
    hasCalculator: false,
    warning: 'Borderline AP trap - research first'
  },

  {
    id: 'mine-blast',
    name: 'Mine Blast',
    shortName: 'Mine Blast',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2022,
    quickId: 'Same mechanics as Captain Riches/Tiki Fortune',
    thresholdSummary: '2 coins collected in any holder',
    notes: 'Mining theme variant. Same AP trap warning.',
    hasCalculator: false,
    warning: 'Borderline AP trap - research first'
  },

  {
    id: 'cash-cano-roman',
    name: 'Cash Cano: Roman Riches',
    shortName: 'Cash Cano Roman',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: '4 rows of gems above reels - fill row + unlock = jackpot',
    visual: {
      location: 'Four rows above reels (minor, maxi, major, grand)',
      appearance: [
        { label: 'Gems', text: 'Credit prizes in 4 rows' },
        { label: 'Trigger', text: 'Gem in each of middle 3 reels' },
        { label: 'Unlock', text: 'Rows unlock during hold & spin' }
      ]
    },
    thresholdSummary: 'High value gems + rows nearly full',
    thresholdDetail: '3 gems in row = jackpot IF row unlocks. Hold & spin unlocks rows.',
    notes: 'Complex unlock mechanic. Research before playing.',
    hasCalculator: false
  },

  {
    id: 'cash-cano-tiki',
    name: 'Cash Cano: Tiki',
    shortName: 'Cash Cano Tiki',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: 'Same as Roman Riches with tiki theme',
    thresholdSummary: 'High value gems + rows nearly full',
    notes: 'Tiki theme variant of Cash Cano.',
    hasCalculator: false
  },

  {
    id: 'dancing-drums-golden-drums',
    name: 'Dancing Drums: Golden Drums',
    shortName: 'DD Golden',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Multiplier builds above reel 1 - applies to Golden Respin feature',
    visual: {
      location: 'Multiplier display above first reel',
      appearance: [
        { label: 'Multiplier', text: 'Increases with +1 drum symbols' },
        { label: 'Golden Respin', text: 'Drums in reels 1-2 trigger feature' },
        { label: 'Reset', text: 'Only resets if glowing green drums land' }
      ]
    },
    thresholdSummary: 'High multiplier (8x+)',
    thresholdDetail: 'Multiplier applies to glowing green drum prizes. Persists until green drums actually land.',
    notes: 'Different from regular Dancing Drums. Learn the multiplier mechanics.',
    hasCalculator: false
  },

  {
    id: 'diamond-collector-wolfpack',
    name: 'Diamond Collector: Wolfpack',
    shortName: 'Diamond Wolfpack',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Collect 15 diamonds = free spins bonus',
    visual: {
      location: 'Diamond counter display',
      appearance: [
        { label: 'Counter', text: 'Shows diamonds collected (0-15)' },
        { label: 'Trigger', text: '15 diamonds = free spins' }
      ]
    },
    thresholdSummary: '12+ diamonds collected',
    thresholdDetail: 'Simple collection mechanic. 15 diamonds guarantees bonus trigger.',
    notes: 'Straightforward AP game.',
    hasCalculator: false
  },

  {
    id: 'diamond-collector-elite7s',
    name: 'Diamond Collector: Elite 7\'s',
    shortName: 'Diamond Elite7s',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as Wolfpack - 15 diamonds = bonus',
    thresholdSummary: '12+ diamonds collected',
    notes: '7s theme variant.',
    hasCalculator: false
  },

  {
    id: 'diamonds-devils-deluxe',
    name: 'Diamonds & Devils Deluxe',
    shortName: 'Diamonds Devils',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'Collect 3 diamonds per reel for prizes - devils REMOVE diamonds',
    visual: {
      location: 'Prize displays and diamond holders above reels',
      appearance: [
        { label: 'Diamonds', text: 'Collect 3 to win prize' },
        { label: 'Devils', text: 'REMOVE 1 diamond' },
        { label: 'Reset', text: 'Devil with 0 diamonds = full reset' }
      ]
    },
    thresholdSummary: '2 diamonds + built up prizes',
    thresholdDetail: 'WARNING: Devils remove progress. 0 diamonds + devil = resets credits AND free games.',
    notes: 'Can lose progress. Risk/reward calculation needed.',
    hasCalculator: false,
    warning: 'Devils can reset your progress!'
  },

  {
    id: 'jade-monkey-deluxe',
    name: 'Jade Monkey Deluxe',
    shortName: 'Jade Monkey Dlx',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'Same as Diamonds & Devils - monkeys remove progress',
    thresholdSummary: '2 diamonds + built up prizes',
    notes: 'Asian theme variant. Same reset warning.',
    hasCalculator: false,
    warning: 'Jade monkeys can reset your progress!'
  },

  {
    id: 'dragon-lights-fortune-skies',
    name: 'Dragon Lights: Fortune Skies',
    shortName: 'Dragon Lights FS',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: '4 progressive free games meters - NOT must-hit-by - VOLATILE',
    visual: {
      location: 'Four meters: mini, minor, major, mega',
      appearance: [
        { label: 'Meters', text: 'Build with symbols in reel 5' },
        { label: 'Trigger', text: 'Random - NOT guaranteed' }
      ]
    },
    thresholdSummary: 'Very high meter values',
    thresholdDetail: 'WARNING: NOT must-hit-by. Extremely volatile. Large bankroll required.',
    notes: 'MPC warns: only for experienced APs with large bankrolls.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'dragon-lights-mystical-falls',
    name: 'Dragon Lights: Mystical Falls',
    shortName: 'Dragon Lights MF',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Same as Fortune Skies - VOLATILE',
    thresholdSummary: 'Very high meter values',
    notes: 'Waterfall theme variant. Same volatility warning.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'dragon-lights-secret-fortress',
    name: 'Dragon Lights: Secret Fortress',
    shortName: 'Dragon Lights SF',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Same as Fortune Skies - VOLATILE',
    thresholdSummary: 'Very high meter values',
    notes: 'Fortress theme variant. Same volatility warning.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'dragon-spin-crosslink-air',
    name: 'Dragon Spin CrossLink: Air',
    shortName: 'DS CrossLink Air',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: '5 bags fill with gold - fuller bags = bigger prizes in Dragon Spin feature',
    visual: {
      location: 'Five gold bags above reels',
      appearance: [
        { label: 'Bags', text: 'Fill when medallions land' },
        { label: 'Dragon Spin', text: 'Random trigger when medallion lands' },
        { label: 'Prizes', text: 'Fuller bags = larger credit prizes' }
      ]
    },
    thresholdSummary: 'Multiple bags nearly full',
    thresholdDetail: 'Gold medallions fill corresponding bags. Dragon Spin can trigger any time medallion lands.',
    notes: 'Track bag fill levels across all 5 positions.',
    hasCalculator: false
  },

  {
    id: 'dragon-spin-crosslink-earth',
    name: 'Dragon Spin CrossLink: Earth',
    shortName: 'DS CrossLink Earth',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Air variant',
    thresholdSummary: 'Multiple bags nearly full',
    notes: 'Earth element theme.',
    hasCalculator: false
  },

  {
    id: 'dragon-spin-crosslink-fire',
    name: 'Dragon Spin CrossLink: Fire',
    shortName: 'DS CrossLink Fire',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Air variant',
    thresholdSummary: 'Multiple bags nearly full',
    notes: 'Fire element theme.',
    hasCalculator: false
  },

  {
    id: 'dragon-spin-crosslink-water',
    name: 'Dragon Spin CrossLink: Water',
    shortName: 'DS CrossLink Water',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Air variant',
    thresholdSummary: 'Multiple bags nearly full',
    notes: 'Water element theme.',
    hasCalculator: false
  },

  {
    id: 'dragon-unleashed-prosperity',
    name: 'Dragon Unleashed: Prosperity Packets',
    shortName: 'Dragon Unleashed PP',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Orbs with credits shift down each spin - 6 orbs = hold & spin',
    visual: {
      location: 'Orbs on reels that shift down',
      appearance: [
        { label: 'Orbs', text: 'Credit prizes, shift down each spin' },
        { label: 'Trigger', text: '6 orbs on screen = hold & spin' },
        { label: 'Stacks', text: 'Often land in connected stacks of 4' }
      ]
    },
    thresholdSummary: '4-5 orbs already on screen',
    thresholdDetail: 'Orbs persist and shift down. 6 total triggers hold & spin.',
    notes: 'Watch for orbs about to shift off bottom.',
    hasCalculator: false
  },

  {
    id: 'dragon-unleashed-red-fleet',
    name: 'Dragon Unleashed: Red Fleet',
    shortName: 'Dragon Unleashed RF',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Prosperity Packets',
    thresholdSummary: '4-5 orbs already on screen',
    notes: 'Naval theme variant.',
    hasCalculator: false
  },

  {
    id: 'dragon-unleashed-three-legends',
    name: 'Dragon Unleashed: Three Legends',
    shortName: 'Dragon Unleashed 3L',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Prosperity Packets',
    thresholdSummary: '4-5 orbs already on screen',
    notes: 'Three Kingdoms theme variant.',
    hasCalculator: false
  },

  {
    id: 'dragon-unleashed-treasured-happiness',
    name: 'Dragon Unleashed: Treasured Happiness',
    shortName: 'Dragon Unleashed TH',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Prosperity Packets',
    thresholdSummary: '4-5 orbs already on screen',
    notes: 'Happiness/prosperity theme variant.',
    hasCalculator: false
  },

  {
    id: 'frankenstein-ap',
    name: 'Frankenstein',
    shortName: 'Frankenstein',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Multipliers build on prize array - Power Up adds multipliers, It\'s Alive awards prizes',
    visual: {
      location: 'Prize array above reels with multipliers',
      appearance: [
        { label: 'Prizes', text: 'Jackpots (orange) and credits (blue)' },
        { label: 'Power Up', text: 'Adds multipliers to prizes' },
        { label: 'It\'s Alive', text: 'Awards prizes with multipliers' }
      ]
    },
    thresholdSummary: 'High multipliers on jackpot prizes',
    thresholdDetail: 'Multipliers persist. It\'s Alive in reel 1 + Frankenstein heads in 2-5 = win prizes.',
    notes: 'MPC has calculator. Complex but lucrative.',
    hasCalculator: true
  },

  {
    id: 'fu-dai-lian-lian-peacock',
    name: 'Fu Dai Lian Lian: Boost Peacock',
    shortName: 'FDLL Peacock',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: '3 bags fill with coins - jewels = boosted bonus features',
    visual: {
      location: 'Three bags above reels',
      appearance: [
        { label: 'Bags', text: 'Fill with colored coins' },
        { label: 'Jewels', text: 'Appear when bag nearly full' },
        { label: 'Boost', text: 'Jewels = enhanced bonus features' }
      ]
    },
    thresholdSummary: 'Bags with jewels (glowing)',
    thresholdDetail: 'Jewels mean BETTER bonus, NOT closer to trigger. Fuller bags improve features when bonus hits.',
    notes: 'Fuller bags = better bonus, but trigger is still random.',
    hasCalculator: false
  },

  {
    id: 'fu-dai-lian-lian-tiger',
    name: 'Fu Dai Lian Lian: Boost Tiger',
    shortName: 'FDLL Tiger',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'Same as Peacock variant',
    thresholdSummary: 'Bags with jewels (glowing)',
    notes: 'Tiger theme variant.',
    hasCalculator: false
  },

  {
    id: 'golden-elements-brilliant',
    name: 'Golden Elements: Brilliant Fortunes',
    shortName: 'Golden Elements',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Same as Golden Beasts - MHB 180',
    thresholdSummary: '160+ symbols collected',
    notes: 'Elements theme variant.',
    hasCalculator: false
  },

  {
    id: 'grand-buddha-link',
    name: 'Grand Buddha Link',
    shortName: 'Grand Buddha',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Line hits create persistent multipliers (8 spins) - left side 5-12x, right side 3x',
    visual: {
      location: 'Multiplier positions on left and right of reels',
      appearance: [
        { label: 'Left', text: '8x, 6x, 5x multipliers' },
        { label: 'Right', text: '3x multipliers' },
        { label: 'Duration', text: '8 spins once activated' }
      ]
    },
    thresholdSummary: 'High multipliers with spins remaining',
    thresholdDetail: 'Line hits turn symbols into multipliers. Track positions and remaining spins.',
    notes: 'Complex tracking required.',
    hasCalculator: false
  },

  {
    id: 'grand-cat-link',
    name: 'Grand Cat Link',
    shortName: 'Grand Cat',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as Grand Buddha Link',
    thresholdSummary: 'High multipliers with spins remaining',
    notes: 'Cat theme variant.',
    hasCalculator: false
  },

  {
    id: 'hyper-orbs-king-seas',
    name: 'Hyper Orbs: King of the Seas',
    shortName: 'Hyper Orbs KotS',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Collect 15 orbs = free spins bonus',
    visual: {
      location: 'Orb counter display',
      appearance: [
        { label: 'Counter', text: 'Orbs collected (0-15)' },
        { label: 'Trigger', text: '15 orbs = free spins' }
      ]
    },
    thresholdSummary: '12+ orbs collected',
    thresholdDetail: 'Simple collection. 15 orbs = guaranteed bonus.',
    notes: 'Similar to Diamond Collector.',
    hasCalculator: false
  },

  {
    id: 'hyper-orbs-dragon-sense',
    name: 'Hyper Orbs: Dragon Sense',
    shortName: 'Hyper Orbs DS',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as King of the Seas',
    thresholdSummary: '12+ orbs collected',
    notes: 'Dragon theme variant.',
    hasCalculator: false
  },

  {
    id: 'jackpot-catcher-sun',
    name: 'Jackpot Catcher: Sun',
    shortName: 'JP Catcher Sun',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2022,
    quickId: 'Glowing rings lock for 3 spins - credit values in rings = win',
    visual: {
      location: 'Glowing rings on reels',
      appearance: [
        { label: 'Rings', text: 'Lock for 3 spins (3 segments)' },
        { label: 'Win', text: 'Credit value lands in ring = award' }
      ]
    },
    thresholdSummary: 'Multiple rings with 2-3 segments',
    thresholdDetail: 'Each ring has 3 segments showing spins remaining. Credit symbol in ring = win that amount.',
    notes: 'Track ring positions and remaining spins.',
    hasCalculator: false
  },

  {
    id: 'jackpot-catcher-moon',
    name: 'Jackpot Catcher: Moon',
    shortName: 'JP Catcher Moon',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2022,
    quickId: 'Same as Sun variant',
    thresholdSummary: 'Multiple rings with 2-3 segments',
    notes: 'Moon theme variant.',
    hasCalculator: false
  },

  {
    id: 'jewel-collection-dragon',
    name: 'Jewel Collection: Dragon',
    shortName: 'Jewel Coll Dragon',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: '4 jewel meters + scatter meter (MHB 777) - wilds added to reels',
    visual: {
      location: 'Four jewel meters + scatter meter',
      appearance: [
        { label: 'Amethyst', text: 'Random wilds (like Regal Riches blue)' },
        { label: 'Sapphire/Emerald/Ruby', text: 'Free games wilds' },
        { label: 'Scatter', text: 'MHB by 777 = mystery free games' }
      ]
    },
    thresholdSummary: 'High meter values OR scatter near 777',
    thresholdDetail: 'NOT like Regal Riches MHB - wilds are added to reel strip, not guaranteed to land.',
    notes: 'Complex game. Research differences from Regal Riches.',
    hasCalculator: false
  },

  {
    id: 'jewel-collection-vault',
    name: 'Jewel Collection: Vault',
    shortName: 'Jewel Coll Vault',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Same as Dragon variant',
    thresholdSummary: 'High meter values OR scatter near 777',
    notes: 'Vault theme variant.',
    hasCalculator: false
  },

  {
    id: 'joe-blow-diamonds',
    name: 'Joe Blow Diamonds',
    shortName: 'Joe Blow Dia',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: '3 dynamite sticks above reel = wild reel for 3 spins - chain reaction possible',
    visual: {
      location: 'Dynamite stick holders above reels',
      appearance: [
        { label: 'Sticks', text: 'Collect 3 per reel' },
        { label: 'Wild', text: '3 spins when triggered' },
        { label: 'Chain', text: 'New wild resets ALL wild reels to 3 spins' }
      ]
    },
    thresholdSummary: '2 sticks on multiple reels',
    thresholdDetail: 'Chain reaction: if another reel hits 3 sticks while wild active, ALL wild reels reset to 3 spins.',
    notes: 'Chain reactions can be very profitable.',
    hasCalculator: false
  },

  {
    id: 'joe-blow-gold',
    name: 'Joe Blow Gold',
    shortName: 'Joe Blow Gold',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Same as Diamonds variant',
    thresholdSummary: '2 sticks on multiple reels',
    notes: 'Gold theme variant.',
    hasCalculator: false
  },

  {
    id: 'knock-knock-guardians-queen',
    name: 'Knock Knock Guardians: Queen',
    shortName: 'KK Guard Queen',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: '2 bonuses with 3 upgrade levels each - orbs upgrade or trigger',
    visual: {
      location: 'Two cat figures (left and right) + 4 free spins meters',
      appearance: [
        { label: 'Left cat', text: 'Symbol Change Bonus (1-3 symbols upgraded)' },
        { label: 'Right cat', text: 'Reel Grow Bonus (1024-7776 ways)' },
        { label: 'Orbs', text: 'White=left, Black=right' }
      ]
    },
    thresholdSummary: 'Either bonus at level 2-3',
    thresholdDetail: 'Higher levels = much better bonuses. Both bonuses can trigger together.',
    notes: 'Complex but rewarding. Learn all upgrade levels.',
    hasCalculator: false
  },

  {
    id: 'knock-knock-guardians-raider',
    name: 'Knock Knock Guardians: Raider',
    shortName: 'KK Guard Raider',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: 'Same as Queen variant',
    thresholdSummary: 'Either bonus at level 2-3',
    notes: 'Raider theme variant.',
    hasCalculator: false
  },

  {
    id: 'life-of-luxury-hot-diamonds',
    name: 'Life of Luxury Hot Diamonds',
    shortName: 'LoL Hot Diamonds',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'WMS',
    releaseYear: 2020,
    quickId: '3 progressive free games meters (car/boat/plane) - NOT MHB - VOLATILE',
    visual: {
      location: 'Three meters: car, boat, plane',
      appearance: [
        { label: 'Meters', text: 'Build with landing symbols' },
        { label: 'Trigger', text: 'Random - NOT guaranteed' }
      ]
    },
    thresholdSummary: 'Very high meter values',
    thresholdDetail: 'WARNING: NOT must-hit-by. Extremely volatile. Large bankroll required.',
    notes: 'MPC warns: only for experienced APs. Titles include Far East Fortunes, Great Eagle, Jungle Cats, Mermaid\'s Gold.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'lucky-coin-link-asian',
    name: 'Lucky Coin Link: Asian Dreaming',
    shortName: 'Lucky Coin Asian',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2022,
    quickId: 'Coin holders below reels - all 5 full = re-spin feature',
    visual: {
      location: 'Coin holders below each reel',
      appearance: [
        { label: 'Holders', text: '1 coin each, 5 total' },
        { label: 'Bet levels', text: 'Higher bets start with more coins' },
        { label: 'Trigger', text: 'All 5 full = re-spin feature' }
      ]
    },
    thresholdSummary: '4 coins collected',
    thresholdDetail: 'Highest bet resets with 3 coins, lowest with 0. Check bet level requirements.',
    notes: 'Bet level affects starting coins.',
    hasCalculator: false
  },

  {
    id: 'lucky-coin-link-atlantica',
    name: 'Lucky Coin Link: Atlantica',
    shortName: 'Lucky Coin Atlantica',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2022,
    quickId: 'Same as Asian Dreaming',
    thresholdSummary: '4 coins collected',
    notes: 'Atlantis theme variant.',
    hasCalculator: false
  },

  {
    id: 'inca-empress',
    name: 'Inca Empress',
    shortName: 'Inca Empress',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Same as Lucky Empress with circular tiles',
    thresholdSummary: 'High multipliers (8x+) active or queued',
    notes: 'Inca theme variant with circular tiles instead of diamonds.',
    hasCalculator: false
  },

  {
    id: 'shrimpmania-4-link',
    name: 'Super Sally\'s Shrimpmania 4 Link',
    shortName: 'Shrimpmania 4',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Same as Lobstermania 4 Link',
    thresholdSummary: '1 coin on multiple reels',
    notes: 'Shrimp theme companion game.',
    hasCalculator: false
  },

  {
    id: 'lucky-pick-bumble-bee',
    name: 'Lucky Pick: Bumble Bee',
    shortName: 'Lucky Pick BB',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: '21 picks on board - reveal upgrades for free games - HIGHLY LUCRATIVE',
    visual: {
      location: 'Board with 21 covered picks above reels',
      appearance: [
        { label: 'Picks', text: 'Credits (immediate) or upgrades' },
        { label: 'Trigger', text: '3 bonus scatters = free games' },
        { label: 'Reset', text: 'After bonus, 3 non-credit picks revealed' }
      ]
    },
    thresholdSummary: 'Many upgrades already revealed',
    thresholdDetail: 'MPC says MOST LUCRATIVE AP game in years. Complex strategy - basic and advanced methods.',
    notes: 'Worth extensive study. Can get massive wins on small bets.',
    hasCalculator: false,
    warning: 'Complex - study MPC guide thoroughly'
  },

  {
    id: 'lucky-pick-cash-tree',
    name: 'Lucky Pick: Cash Tree',
    shortName: 'Lucky Pick CT',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Same as Bumble Bee - HIGHLY LUCRATIVE',
    thresholdSummary: 'Many upgrades already revealed',
    notes: 'Cash tree theme variant.',
    hasCalculator: false,
    warning: 'Complex - study MPC guide thoroughly'
  },

  {
    id: 'lucky-pick-leprechaun',
    name: 'Lucky Pick: Leprechaun',
    shortName: 'Lucky Pick Lep',
    category: 'persistent-state',
    tier: 1,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Same as Bumble Bee - HIGHLY LUCRATIVE',
    thresholdSummary: 'Many upgrades already revealed',
    notes: 'Leprechaun theme variant.',
    hasCalculator: false,
    warning: 'Complex - study MPC guide thoroughly'
  },

  {
    id: 'lunar-disc',
    name: 'Lunar Disc',
    shortName: 'Lunar Disc',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: '6 discs collected = bonus that turns random symbol wild',
    visual: {
      location: 'Disc counter display',
      appearance: [
        { label: 'Counter', text: 'Discs collected (0-6)' },
        { label: 'Bonus', text: 'Random symbol turns wild' }
      ]
    },
    thresholdSummary: '5 discs collected',
    thresholdDetail: '6 discs triggers bonus. Random symbol selected and all instances turn wild.',
    notes: 'Simple collection mechanic.',
    hasCalculator: false
  },

  {
    id: 'fortune-disc',
    name: 'Fortune Disc',
    shortName: 'Fortune Disc',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: 'Same as Lunar Disc',
    thresholdSummary: '5 discs collected',
    notes: 'Fortune theme variant.',
    hasCalculator: false
  },

  {
    id: 'pillars-of-cash-celestial',
    name: 'Pillars of Cash: Celestial Fortune',
    shortName: 'Pillars Celestial',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: 'Pillars above reels build credit prizes - gold dragon = chance to win pillar',
    visual: {
      location: 'Pillars above each reel with credit values',
      appearance: [
        { label: 'Pillars', text: 'Grow when coins land' },
        { label: 'Spin counter', text: '3 green dots per level' },
        { label: 'Gold dragon', text: 'Max height = chance to win' }
      ]
    },
    thresholdSummary: 'High value pillars near max height',
    thresholdDetail: 'Complex: pillars grow/shrink, values accumulate, gold dragon needed to win.',
    notes: 'Track both pillar heights and accumulated values.',
    hasCalculator: false
  },

  {
    id: 'pillars-of-cash-festive',
    name: 'Pillars of Cash: Festive Fortune',
    shortName: 'Pillars Festive',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: 'Same as Celestial Fortune',
    thresholdSummary: 'High value pillars near max height',
    notes: 'Festive theme variant.',
    hasCalculator: false
  },

  {
    id: 'pinwheel-prizes-cat-tiger',
    name: 'Pinwheel Prizes: Cat & Tiger',
    shortName: 'Pinwheel Cat',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: '5 pinwheels with 8 wedges each - scatter symbols build values and upgrade wedges',
    visual: {
      location: 'Five colored pinwheels above reels',
      appearance: [
        { label: 'Wedges', text: '8 per pinwheel, credits or golden (credits + spins)' },
        { label: 'Build', text: 'Scatters increase wedge values' },
        { label: 'Trigger', text: '3 same-color scatters = spin that wheel' }
      ]
    },
    thresholdSummary: 'High value wedges or multiple golden wedges',
    thresholdDetail: 'Track all 5 pinwheels. Golden wedges include free spins with credit prize.',
    notes: 'Complex tracking across 5 wheels.',
    hasCalculator: false
  },

  {
    id: 'pinwheel-prizes-majestic',
    name: 'Pinwheel Prizes: Majestic Oasis',
    shortName: 'Pinwheel Majestic',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: 'Same as Cat & Tiger',
    thresholdSummary: 'High value wedges or multiple golden wedges',
    notes: 'Oasis theme variant.',
    hasCalculator: false
  },

  {
    id: 'power-push-jin-gou',
    name: 'Power Push: Jin Gou',
    shortName: 'Power Push JG',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Coin pusher - 12 full stacks (300 coins) = guaranteed push bonus',
    visual: {
      location: 'Tray above reels with coin stacks',
      appearance: [
        { label: 'Stacks', text: '25 coins each, at back of tray' },
        { label: 'Prizes', text: 'Coins and prizes on tray' },
        { label: 'Push', text: 'MHB after 300 coins (12 stacks)' }
      ]
    },
    thresholdSummary: '10+ stacks full (250+ coins)',
    thresholdDetail: 'Push bonus guaranteed after 12 full stacks. Prizes on tray fall off and are awarded.',
    notes: 'Physical coin pusher mechanic.',
    hasCalculator: false
  },

  {
    id: 'power-push-long-de',
    name: 'Power Push: Long De Xiyue',
    shortName: 'Power Push LDX',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as Jin Gou',
    thresholdSummary: '10+ stacks full (250+ coins)',
    notes: 'Dragon theme variant.',
    hasCalculator: false
  },

  {
    id: 'prize-pool-cactus',
    name: 'Prize Pool: Cactus Cash',
    shortName: 'Prize Pool Cactus',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Blocks above reels with credit values - 4+ Prize Pool scatters = win corresponding blocks',
    visual: {
      location: 'Colored blocks above reels matching positions',
      appearance: [
        { label: 'Blocks', text: 'Credit values in matching positions' },
        { label: 'Trigger', text: '4+ Prize Pool scatters' },
        { label: 'Award', text: 'Win blocks matching scatter positions' }
      ]
    },
    thresholdSummary: 'High credit values in blocks',
    thresholdDetail: 'Similar to Block Bonanza. 4+ scatters needed (vs 3 for Block Bonanza).',
    notes: 'Track block values at all positions.',
    hasCalculator: false
  },

  {
    id: 'prize-pool-fierce-dragon',
    name: 'Prize Pool: Fierce Dragon',
    shortName: 'Prize Pool Dragon',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Same as Cactus Cash',
    thresholdSummary: 'High credit values in blocks',
    notes: 'Dragon theme variant.',
    hasCalculator: false
  },

  {
    id: 'raise-the-sails',
    name: 'Raise the Sails',
    shortName: 'Raise Sails',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: '3 progressive free games meters (bronze/silver/gold) - NOT MHB - VOLATILE',
    visual: {
      location: 'Three meters: bronze, silver, gold',
      appearance: [
        { label: 'Meters', text: 'Build with landing symbols' },
        { label: 'Trigger', text: 'Collect symbol in reel 5 + matching color' }
      ]
    },
    thresholdSummary: 'Very high meter values',
    thresholdDetail: 'WARNING: NOT must-hit-by. Collect symbol required in reel 5. Extremely volatile.',
    notes: 'MPC warns: extremely volatile game.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'san-xing-riches',
    name: 'San Xing Riches',
    shortName: 'San Xing',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Same as Raise the Sails - VOLATILE',
    thresholdSummary: 'Very high meter values',
    notes: 'Chinese theme variant. Same volatility warning.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'red-silk',
    name: 'Red Silk',
    shortName: 'Red Silk',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Coin holders above reels - 2 coins = wild reel for 2 spins',
    visual: {
      location: 'Coin holders above each reel',
      appearance: [
        { label: 'Holders', text: 'Fill with 2 coins' },
        { label: 'Wild', text: '2 spins when full' }
      ]
    },
    thresholdSummary: '1 coin on multiple reels',
    thresholdDetail: '2 coins = wild reel for 2 spins. Simple mechanic.',
    notes: 'Similar to Golden Egypt Grand but 2 coins instead of variable.',
    hasCalculator: false
  },

  {
    id: 'aztec-chief',
    name: 'Aztec Chief',
    shortName: 'Aztec Chief',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Same as Red Silk',
    thresholdSummary: '1 coin on multiple reels',
    notes: 'Aztec theme variant.',
    hasCalculator: false
  },

  {
    id: 'regal-link-lion',
    name: 'Regal Link: Lion',
    shortName: 'Regal Link Lion',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: '5 MHB free games meters with different wild counts',
    visual: {
      location: 'Five meters: amber, sapphire, amethyst, emerald, diamond',
      appearance: [
        { label: 'Amber', text: 'Resets 30, hits by 50' },
        { label: 'Sapphire', text: 'Resets 40, hits by 60' },
        { label: 'Amethyst', text: 'Resets 50, hits by 75' },
        { label: 'Emerald', text: 'Resets 75, hits by 100' },
        { label: 'Diamond', text: 'Resets 175, hits by 200' }
      ]
    },
    thresholdSummary: 'Any meter near ceiling',
    thresholdDetail: 'Also has silver wilds awarded randomly during base game.',
    notes: 'Multiple MHB opportunities per machine.',
    hasCalculator: false
  },

  {
    id: 'regal-link-raven',
    name: 'Regal Link: Raven',
    shortName: 'Regal Link Raven',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'Same as Lion variant',
    thresholdSummary: 'Any meter near ceiling',
    notes: 'Raven theme variant.',
    hasCalculator: false
  },

  {
    id: 'rich-little-piggies-hog-wild',
    name: 'Rich Little Piggies: Hog Wild',
    shortName: 'Piggies Hog Wild',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: '3 pigs build features - blue=spins, yellow=jackpots, red=wilds - NOT MHB',
    visual: {
      location: 'Three pigs above reels',
      appearance: [
        { label: 'Blue pig', text: 'Increasing free games' },
        { label: 'Yellow pig', text: 'Jackpot chances' },
        { label: 'Red pig', text: 'Guaranteed wilds (Hog Wild)' }
      ]
    },
    thresholdSummary: 'Fat pigs with built up features',
    thresholdDetail: 'Pigs get fatter as features build. NOT MHB - trigger is random.',
    notes: 'Similar to Bustin Money but with pigs. Red pig gives guaranteed wilds in this version.',
    hasCalculator: false
  },

  {
    id: 'rich-little-piggies-meal-ticket',
    name: 'Rich Little Piggies: Meal Ticket',
    shortName: 'Piggies Meal Ticket',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Same as Hog Wild but red pig removes low symbols instead',
    thresholdSummary: 'Fat pigs with built up features',
    notes: 'Red pig removes lowest paying symbols instead of guaranteed wilds.',
    hasCalculator: false
  },

  {
    id: 'rich-little-sheep-on-the-lamb',
    name: 'Rich Little Sheep: On the Lamb',
    shortName: 'Sheep On Lamb',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: '3 sheep upgrade hold & spin - left=head start, middle=jackpots, right=rows',
    visual: {
      location: 'Three sheep above reels',
      appearance: [
        { label: 'Left sheep', text: 'Head start spins (before H&S begins)' },
        { label: 'Middle sheep', text: 'Jackpot value increases' },
        { label: 'Right sheep', text: 'Extra rows in H&S grid' }
      ]
    },
    thresholdSummary: 'Upgraded sheep features',
    thresholdDetail: 'Colored coins upgrade or trigger 1, 2, or all 3 sheep.',
    notes: 'Sheep version of Rich Little Piggies concept.',
    hasCalculator: false
  },

  {
    id: 'rich-little-sheep-wool-street',
    name: 'Rich Little Sheep: Wool Street Riches',
    shortName: 'Sheep Wool Street',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Same as On the Lamb',
    thresholdSummary: 'Upgraded sheep features',
    notes: 'Wall Street theme variant.',
    hasCalculator: false
  },

  {
    id: 'rising-phoenix-ap',
    name: 'Rising Phoenix',
    shortName: 'Rising Phoenix',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Phoenix = wild reel, fills flame meter, 4 flames = wheel spin multiplier',
    visual: {
      location: 'Wheel above reels with multipliers + flame meter inside',
      appearance: [
        { label: 'Phoenix', text: 'Wild reel, adds to flame meter' },
        { label: 'Flame meter', text: '4 spots to fill' },
        { label: 'Wheel', text: 'Spins when meter full + line hit' }
      ]
    },
    thresholdSummary: '3 flames + high multipliers on wheel',
    thresholdDetail: 'If no line hit when meter full, 2-3 wheel multipliers increase by 1x.',
    notes: 'Multipliers can build up significantly.',
    hasCalculator: false
  },

  {
    id: 'lucha-kitty',
    name: 'Lucha Kitty',
    shortName: 'Lucha Kitty',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Same as Sumo Kitty',
    thresholdSummary: 'Many connected gold frames',
    notes: 'Mexican wrestling theme variant.',
    hasCalculator: false
  },

  {
    id: 'super-bowl-jackpots',
    name: 'Super Bowl Jackpots',
    shortName: 'Super Bowl JP',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: '2-Minute Drill every 22-26 min - prizes collect, 4 consecutive = win all',
    visual: {
      location: 'Holding area with 4 spots above reels',
      appearance: [
        { label: '2-Min Drill', text: 'Bank-wide feature, 2 min countdown' },
        { label: 'Collection', text: 'Prizes accumulate in 4 spots' },
        { label: 'Win', text: '4 consecutive prize spins = win all' }
      ]
    },
    thresholdSummary: '3 spots filled after 2-Minute Drill ends',
    thresholdDetail: 'Prizes persist after feature ends! Check for partially filled boards.',
    notes: 'Time-based feature on entire bank. Scout after drill ends.',
    hasCalculator: false
  },

  {
    id: 'top-up-fortunes-flame',
    name: 'Top Up Fortunes: Flame',
    shortName: 'Top Up Flame',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Volcano symbols expand reels (3→6 high) - max height = Add Wild feature',
    visual: {
      location: 'Reels that expand in height + green dot counters',
      appearance: [
        { label: 'Expansion', text: '3 to 6 symbols tall' },
        { label: 'Counter', text: 'Green dots show spins at height' },
        { label: 'Max height', text: 'Volcano on max = Add Wild feature' }
      ]
    },
    thresholdSummary: 'Reels at 5-6 height with spins remaining',
    thresholdDetail: 'Taller reels = better line hits, more bonus chances, more H&S chances.',
    notes: 'Track both height and remaining spins per reel.',
    hasCalculator: false
  },

  {
    id: 'top-up-fortunes-ocean',
    name: 'Top Up Fortunes: Ocean',
    shortName: 'Top Up Ocean',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Same as Flame with trident instead of volcano',
    thresholdSummary: 'Reels at 5-6 height with spins remaining',
    notes: 'Ocean theme variant.',
    hasCalculator: false
  },

  {
    id: 'treasure-box-kingdom',
    name: 'Treasure Box: Kingdom',
    shortName: 'Treasure Box King',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Keys reduce coins needed to trigger respin bonus (6→1)',
    visual: {
      location: 'Key counter on middle reel',
      appearance: [
        { label: 'Keys', text: 'Reduce coins needed from 6' },
        { label: 'Trigger', text: 'Land required coins for respin bonus' },
        { label: 'Auto-trigger', text: 'Key symbol with 1 coin needed = auto bonus' }
      ]
    },
    thresholdSummary: '1-2 coins needed (4-5 keys collected)',
    thresholdDetail: 'Each key reduces requirement by 1. At 1 coin needed, key symbol auto-triggers.',
    notes: 'Simple key collection mechanic.',
    hasCalculator: false
  },

  {
    id: 'treasure-box-dynasty',
    name: 'Treasure Box: Dynasty',
    shortName: 'Treasure Box Dyn',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Same as Kingdom',
    thresholdSummary: '1-2 coins needed (4-5 keys collected)',
    notes: 'Dynasty theme variant.',
    hasCalculator: false
  },

  {
    id: 'treasure-shot-pirate',
    name: 'Treasure Shot: Pirate Ship',
    shortName: 'Treasure Shot Pirate',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'MHB wilds in bags (base game) and chests (free games) - similar to Regal Riches',
    visual: {
      location: 'Bags (base game) and chests (free games)',
      appearance: [
        { label: 'Blue/Red bags', text: 'Random trigger, MHB at 10' },
        { label: 'Blue chest', text: 'MHB at 100 (free games)' },
        { label: 'Green/Purple', text: 'MHB at 75 (free games)' }
      ]
    },
    thresholdSummary: 'Bags at 8-9 OR chests near ceiling',
    thresholdDetail: 'Multiple MHB wild features. Base game bags + free game chests.',
    notes: 'Similar to Regal Riches mechanics.',
    hasCalculator: false
  },

  {
    id: 'treasure-shot-robin-hood',
    name: 'Treasure Shot: Robin Hood',
    shortName: 'Treasure Shot Robin',
    category: 'must-hit-by',
    tier: 1,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'Same as Pirate Ship',
    thresholdSummary: 'Bags at 8-9 OR chests near ceiling',
    notes: 'Robin Hood theme variant.',
    hasCalculator: false
  },

  {
    id: 'voodoo-jackpots',
    name: 'Voodoo Jackpots: Jack\'s Gold',
    shortName: 'Voodoo Jackpots',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: '2 progressive free games meters (green/purple) - voodoo doll randomly triggers',
    visual: {
      location: 'Two meters: green and purple (6-20 spins each)',
      appearance: [
        { label: 'Meters', text: 'Start at 6, cap at 20 free spins' },
        { label: 'Voodoo doll', text: 'Appears in center, awards prizes' },
        { label: 'Trigger', text: 'Random - voodoo doll can increase or trigger' }
      ]
    },
    thresholdSummary: 'Either meter at 15+ free spins',
    thresholdDetail: 'Voodoo doll appearance can build meters or trigger them.',
    notes: 'MPC has calculator.',
    hasCalculator: true
  },

  {
    id: 'wheel-of-fortune-4d-collectors',
    name: 'Wheel of Fortune 4D Collector\'s Edition',
    shortName: 'WoF 4D Collectors',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2021,
    quickId: 'Credit prizes above reels build - Collect symbol wins that prize',
    visual: {
      location: 'Credit prize displays above each reel',
      appearance: [
        { label: 'Prizes', text: 'Build when coins land' },
        { label: 'Collect', text: 'Collect symbol = win prize above' }
      ]
    },
    thresholdSummary: 'High credit values above reels',
    thresholdDetail: 'Collect symbol in reel = win that reel\'s accumulated prize.',
    notes: 'Different mechanic from regular 4D.',
    hasCalculator: false
  },

  {
    id: 'wizard-of-oz-yellow-brick',
    name: 'Wizard of Oz: Follow the Yellow Brick Road',
    shortName: 'WoO Yellow Brick',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: '3 progressive free games meters (silver/gold/emerald) - red shoes in reel 5 builds - NOT MHB',
    visual: {
      location: 'Three meters: silver, gold, emerald',
      appearance: [
        { label: 'Meters', text: 'Build with red shoes in reel 5' },
        { label: 'Trigger', text: 'Random - NOT guaranteed' }
      ]
    },
    thresholdSummary: 'Very high meter values',
    thresholdDetail: 'WARNING: NOT must-hit-by. Extremely volatile.',
    notes: 'Another high-volatility non-MHB game.',
    hasCalculator: false,
    warning: 'EXTREME VOLATILITY - Not MHB!'
  },

  {
    id: 'cat-peak',
    name: 'Cat Peak',
    shortName: 'Cat Peak',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2021,
    quickId: 'Same as Wolf Peak',
    thresholdSummary: 'Expanding wilds with 2-3 spins remaining',
    notes: 'Cat theme variant.',
    hasCalculator: false
  },

  {
    id: 'fu-ren-wu',
    name: 'Fu Ren Wu',
    shortName: 'Fu Ren Wu',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2021,
    quickId: 'Same as Wolf Peak',
    thresholdSummary: 'Expanding wilds with 2-3 spins remaining',
    notes: 'Chinese theme variant.',
    hasCalculator: false
  },

  {
    id: 'zhao-cai-zhu-piggy',
    name: 'Zhao Cai Zhu: Gettin\' Piggy With It',
    shortName: 'ZCZ Piggy',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: 'Pig collection mechanic - MPC has calculator',
    thresholdSummary: 'Check MPC calculator',
    thresholdDetail: 'Complex mechanics - use MPC calculator for accurate plays.',
    notes: 'MPC has dedicated calculator for this game.',
    hasCalculator: true
  },

  {
    id: 'yo-ho-hog',
    name: 'Yo Ho Hog',
    shortName: 'Yo Ho Hog',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: 'Same as Zhao Cai Zhu - pirate pig theme',
    thresholdSummary: 'Check MPC calculator',
    notes: 'Pirate theme variant. Same calculator.',
    hasCalculator: true
  },

  // =============================================
  // ADDITIONAL POPULAR VEGAS FLOOR MACHINES
  // Based on comprehensive floor audit
  // =============================================

  // MORE IGT CLASSICS
  {
    id: 'black-widow',
    name: 'Black Widow',
    shortName: 'Black Widow',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Spider-themed with Super Stacks feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular IGT classic with stacked symbols and free spins.',
    hasCalculator: false
  },
  {
    id: 'triple-fortune-dragon',
    name: 'Triple Fortune Dragon',
    shortName: 'Triple Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Asian dragon theme with multipliers up to 27x',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Part of Fortune series. Features unlockable free spins with massive multipliers.',
    hasCalculator: false
  },
  {
    id: 'ocean-belles',
    name: 'Ocean Belles',
    shortName: 'Ocean Belles',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Mermaid theme with multiple bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Underwater theme with stacked wilds and free spins.',
    hasCalculator: false
  },
  {
    id: 'cash-eruption',
    name: 'Cash Eruption',
    shortName: 'Cash Eruption',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2020,
    quickId: 'Volcano theme with hold & spin feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular IGT link game with multiple themes.',
    hasCalculator: false
  },
  {
    id: 'mystical-unicorn',
    name: 'Mystical Unicorn',
    shortName: 'Mystical Unicorn',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2011,
    quickId: 'Fantasy unicorn theme with cascading reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'WMS classic with tumbling reels feature.',
    hasCalculator: false
  },
  {
    id: 'spartacus',
    name: 'Spartacus Gladiator of Rome',
    shortName: 'Spartacus',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Roman gladiator theme with colossal reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Features Colossal Reels - two linked reel sets.',
    hasCalculator: false
  },
  {
    id: 'jade-elephant',
    name: 'Jade Elephant',
    shortName: 'Jade Elephant',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Asian elephant theme with bonus wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular WMS game with multiple bonus features.',
    hasCalculator: false
  },
  {
    id: 'bier-haus',
    name: 'Bier Haus',
    shortName: 'Bier Haus',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'German beer festival theme with locked wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Oktoberfest theme. Up to 80 free spins with locking wilds.',
    hasCalculator: false
  },
  {
    id: 'pixies-of-the-forest',
    name: 'Pixies of the Forest',
    shortName: 'Pixies Forest',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2008,
    quickId: 'Enchanted forest theme with tumbling reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of the first tumbling reel slots. Still very popular.',
    hasCalculator: false
  },
  {
    id: 'double-happiness-panda',
    name: 'Double Happiness Panda',
    shortName: 'Double Happiness',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2018,
    quickId: 'Panda theme with double symbol feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Ainsworth Asian theme slot.',
    hasCalculator: false
  },
  {
    id: 'mustang-money',
    name: 'Mustang Money',
    shortName: 'Mustang Money',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2015,
    quickId: 'Wild horse theme with free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Ainsworth title with Western theme.',
    hasCalculator: false
  },
  {
    id: 'quick-hit-platinum',
    name: 'Quick Hit Platinum',
    shortName: 'Quick Hit Plat',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2016,
    quickId: 'Classic Quick Hit with platinum jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Part of legendary Quick Hit series.',
    hasCalculator: false
  },
  {
    id: 'quick-hit-pro',
    name: 'Quick Hit Pro',
    shortName: 'Quick Hit Pro',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2018,
    quickId: 'Enhanced Quick Hit with more features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Modern Quick Hit variant.',
    hasCalculator: false
  },
  {
    id: 'blazing-7s',
    name: 'Blazing 7s',
    shortName: 'Blazing 7s',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 1999,
    quickId: 'Classic 3-reel sevens slot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of the most iconic classic slots ever made.',
    hasCalculator: false
  },
  {
    id: 'titanic',
    name: 'Titanic',
    shortName: 'Titanic',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2015,
    quickId: 'Movie-themed with Heart of the Ocean feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed from James Cameron film. Multiple bonus features.',
    hasCalculator: false
  },

  // MORE ARISTOCRAT
  {
    id: 'miss-kitty',
    name: 'Miss Kitty',
    shortName: 'Miss Kitty',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2010,
    quickId: 'Cat theme with xtra reel power',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Aristocrat classic with medium volatility.',
    hasCalculator: false
  },
  {
    id: 'sun-and-moon',
    name: 'Sun and Moon',
    shortName: 'Sun and Moon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2011,
    quickId: 'Mayan theme with 50 free spins potential',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Aristocrat with massive free spin potential.',
    hasCalculator: false
  },
  {
    id: 'where-the-gold',
    name: 'Where\'s the Gold',
    shortName: 'Where\'s the Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2008,
    quickId: 'Gold mining theme with pick bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Iconic Australian pokie now popular worldwide.',
    hasCalculator: false
  },
  {
    id: 'more-chilli',
    name: 'More Chilli',
    shortName: 'More Chilli',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2012,
    quickId: 'Mexican theme with reel power',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sequel to More Hearts. Popular Mexican theme.',
    hasCalculator: false
  },
  {
    id: 'more-hearts',
    name: 'More Hearts',
    shortName: 'More Hearts',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2010,
    quickId: 'Romance theme with multiplying wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Aristocrat with heart-themed features.',
    hasCalculator: false
  },
  {
    id: '5-dragons',
    name: '5 Dragons',
    shortName: '5 Dragons',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2009,
    quickId: 'Asian dragon theme with reel power',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of Aristocrat\'s most popular Asian themes.',
    hasCalculator: false
  },
  {
    id: 'queen-of-the-nile',
    name: 'Queen of the Nile',
    shortName: 'Queen Nile',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 1997,
    quickId: 'Classic Egyptian theme - one of oldest Aristocrat slots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Legendary Aristocrat classic. Still on many floors.',
    hasCalculator: false
  },
  {
    id: 'pompeii',
    name: 'Pompeii',
    shortName: 'Pompeii',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2012,
    quickId: 'Ancient Rome theme with reel power',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Aristocrat with Roman theme.',
    hasCalculator: false
  },
  {
    id: 'dollar-storm',
    name: 'Dollar Storm',
    shortName: 'Dollar Storm',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Hold & Spin with multiple themes',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Similar to Lightning Link but with dollar theme.',
    hasCalculator: false
  },
  {
    id: 'lightning-dollar-link',
    name: 'Lightning Dollar Link',
    shortName: 'Lightning Dollar',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Lightning Link meets Dollar Storm',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines Lightning Link and Dollar Storm features.',
    hasCalculator: false
  },
  {
    id: 'tarzan-grand',
    name: 'Tarzan Grand',
    shortName: 'Tarzan Grand',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Tarzan license with progressive link',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed Tarzan theme on premium cabinet.',
    hasCalculator: false
  },

  // MORE KONAMI
  {
    id: 'golden-peach',
    name: 'Golden Peach',
    shortName: 'Golden Peach',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Asian theme with action stacked symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Konami with good bonus features.',
    hasCalculator: false
  },
  {
    id: 'radiant-witch',
    name: 'Radiant Witch',
    shortName: 'Radiant Witch',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Halloween theme with action stacked symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Konami Halloween theme.',
    hasCalculator: false
  },
  {
    id: 'solstice-celebration',
    name: 'Solstice Celebration',
    shortName: 'Solstice Celeb',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Nature theme with expanding wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Beautiful seasonal theme from Konami.',
    hasCalculator: false
  },

  // MORE LIGHT & WONDER / SCIENTIFIC GAMES
  {
    id: 'james-bond-007',
    name: 'James Bond 007',
    shortName: 'James Bond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2017,
    quickId: 'James Bond license with multiple movie themes',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Licensed Bond slot with spy features.',
    hasCalculator: false
  },
  {
    id: 'epic-monopoly-ii',
    name: 'Epic Monopoly II',
    shortName: 'Epic Monopoly II',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2015,
    quickId: 'Monopoly colossal reels with board game bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Features Colossal Reels and board game feature.',
    hasCalculator: false
  },
  {
    id: 'goldfish',
    name: 'Goldfish',
    shortName: 'Goldfish',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2006,
    quickId: 'Aquarium theme with multiple bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic WMS with multiple fish-themed bonuses.',
    hasCalculator: false
  },
  {
    id: 'life-of-luxury',
    name: 'Life of Luxury',
    shortName: 'Life of Luxury',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2009,
    quickId: 'Luxury theme with progressive meters',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic WMS with car/boat/plane progressive.',
    hasCalculator: false
  },

  // MORE AGS
  {
    id: 'starry-night',
    name: 'Starry Night',
    shortName: 'Starry Night',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Van Gogh art theme with bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Art-themed AGS slot with beautiful graphics.',
    hasCalculator: false
  },
  {
    id: 'gold-dragon-red-dragon',
    name: 'Gold Dragon Red Dragon',
    shortName: 'Gold Red Dragon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2018,
    quickId: 'Dual dragon theme with split reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular AGS Asian theme.',
    hasCalculator: false
  },

  // EVERI
  {
    id: 'jackpot-inferno',
    name: 'Jackpot Inferno',
    shortName: 'JP Inferno',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2018,
    quickId: 'Fire theme with multiple jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Everi with progressive jackpots.',
    hasCalculator: false
  },
  {
    id: 'cash-burst',
    name: 'Cash Burst',
    shortName: 'Cash Burst',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Money theme with burst feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Everi hold & spin style game.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - DRAGON LINK
  // =============================================
  {
    id: 'dragon-link-panda-magic',
    name: 'Dragon Link: Panda Magic',
    shortName: 'DL Panda Magic',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Cute panda theme - most accessible Dragon Link variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lowest denomination Dragon Link ($0.01-$2.00). Dancing pandas, family-friendly theme.',
    hasCalculator: false
  },
  {
    id: 'dragon-link-silk-road',
    name: 'Dragon Link: Silk Road',
    shortName: 'DL Silk Road',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Trade route theme - expanding wilds in free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Silk Road trading theme. Key feature is expanding wild during bonus.',
    hasCalculator: false
  },
  {
    id: 'dragon-link-peace-long-life',
    name: 'Dragon Link: Peace & Long Life',
    shortName: 'DL Peace & Long',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Peaceful theme - wilds double wins in bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Every wild symbol doubles wins during bonus round.',
    hasCalculator: false
  },
  {
    id: 'dragon-link-peacock-princess',
    name: 'Dragon Link: Peacock Princess',
    shortName: 'DL Peacock',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'Peacock/princess theme with elegant visuals',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Colorful peacock and princess imagery. Standard Dragon Link mechanics.',
    hasCalculator: false
  },
  {
    id: 'dragon-link-eyes-of-fortune',
    name: 'Dragon Link: Eyes of Fortune',
    shortName: 'DL Eyes Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Fortune-themed with lucky symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Eyes of Fortune theme with standard Dragon Link Hold & Spin.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - LIGHTNING LINK
  // =============================================
  {
    id: 'lightning-link-tiki-fire',
    name: 'Lightning Link: Tiki Fire',
    shortName: 'LL Tiki Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Polynesian tiki theme - original 4 Lightning Link games',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of the original 4 Lightning Link titles. Tiki/Hawaiian theme.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-heart-throb',
    name: 'Lightning Link: Heart Throb',
    shortName: 'LL Heart Throb',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Romance/heart theme with pink aesthetics',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Heart and romance theme. Pink and red color scheme.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-eyes-of-fortune',
    name: 'Lightning Link: Eyes of Fortune',
    shortName: 'LL Eyes Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Fortune-themed with Asian symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Asian fortune theme with standard Lightning Link mechanics.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-dragons-riches',
    name: 'Lightning Link: Dragon\'s Riches',
    shortName: 'LL Dragon Riches',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Dragon theme similar to Dragon Link',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon theme on Lightning Link platform.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-wild-chuco',
    name: 'Lightning Link: Wild Chuco',
    shortName: 'LL Wild Chuco',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Wild West/Mexican theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wild West meets Mexican culture theme.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-best-bet',
    name: 'Lightning Link: Best Bet',
    shortName: 'LL Best Bet',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Horse racing theme - low symbols removed in free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Horse racing theme. Free spins remove low-paying symbols for better odds.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-magic-totem',
    name: 'Lightning Link: Magic Totem',
    shortName: 'LL Magic Totem',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Native American totem theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Totem pole theme with nature imagery.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-mine-mine-mine',
    name: 'Lightning Link: Mine Mine Mine',
    shortName: 'LL Mine Mine',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Mining/gold theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold mining theme with pickaxe and gold nugget symbols.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-raging-bull',
    name: 'Lightning Link: Raging Bull',
    shortName: 'LL Raging Bull',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Bull/rodeo Western theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Powerful bull imagery. Popular in Australia.',
    hasCalculator: false
  },
  {
    id: 'lightning-link-fire-idol',
    name: 'Lightning Link: Fire Idol',
    shortName: 'LL Fire Idol',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Ancient fire temple theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire idol/temple theme with blazing imagery.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - BUFFALO
  // =============================================
  {
    id: 'buffalo-stampede',
    name: 'Buffalo Stampede',
    shortName: 'Buffalo Stampede',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2013,
    quickId: 'Early Buffalo sequel with stampede bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Part of Xtra Reel Power series. 1024 ways to win.',
    hasCalculator: false
  },
  {
    id: 'buffalo-deluxe',
    name: 'Buffalo Deluxe',
    shortName: 'Buffalo Deluxe',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'Enhanced Buffalo with more features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Upgraded version of original Buffalo.',
    hasCalculator: false
  },
  {
    id: 'buffalo-max',
    name: 'Buffalo Max',
    shortName: 'Buffalo Max',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Maximum multipliers version',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Higher multiplier potential than standard Buffalo.',
    hasCalculator: false
  },
  {
    id: 'buffalo-xtreme',
    name: 'Buffalo Xtreme',
    shortName: 'Buffalo Xtreme',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Extreme volatility Buffalo variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High volatility version with bigger swing potential.',
    hasCalculator: false
  },
  {
    id: 'buffalo-cash',
    name: 'Buffalo Cash',
    shortName: 'Buffalo Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Buffalo with standalone cash jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Standalone jackpots unlike linked Buffalo Link.',
    hasCalculator: false
  },
  {
    id: 'buffalo-gold-collection',
    name: 'Buffalo Gold Collection',
    shortName: 'Buffalo Gold Coll',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Collection of Buffalo Gold variants',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Multiple Buffalo Gold games in one cabinet.',
    hasCalculator: false
  },
  {
    id: 'buffalo-gold-max-power',
    name: 'Buffalo Gold Max Power',
    shortName: 'Buffalo Max Power',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'Up to 46,656 ways to win - newest Buffalo',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest Buffalo release. Dynamic reels 2-6 symbols per spin.',
    hasCalculator: false
  },
  {
    id: 'buffalo-friends',
    name: 'Buffalo & Friends',
    shortName: 'Buffalo & Friends',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2023,
    quickId: 'Buffalo with multiple animal friends',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Buffalo meets other popular Aristocrat animal themes.',
    hasCalculator: false
  },
  {
    id: 'buffalo-ultimate-stampede',
    name: 'Buffalo Ultimate Stampede',
    shortName: 'Buffalo Ultimate',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2023,
    quickId: 'Ultimate Buffalo experience with Hold & Spin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines classic Buffalo with Hold & Spin mechanics.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - 88 FORTUNES
  // =============================================
  {
    id: '88-fortunes-megaways',
    name: '88 Fortunes Megaways',
    shortName: '88 Fortunes Mega',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: '88 Fortunes with Megaways mechanic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Up to 117,649 ways to win with Megaways.',
    hasCalculator: false
  },
  {
    id: '88-fortunes-mystery-cash',
    name: '88 Fortunes Mystery Cash',
    shortName: '88 Mystery Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: '88 Fortunes with mystery cash feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mystery cash awards during gameplay.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - DANCING DRUMS
  // =============================================
  {
    id: 'dancing-drums-slot-festival',
    name: 'Dancing Drums Slot Festival',
    shortName: 'DD Slot Festival',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Festival edition with enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Festival celebration theme with upgraded bonuses.',
    hasCalculator: false
  },
  {
    id: 'dancing-drums-gold',
    name: 'Dancing Drums Gold',
    shortName: 'DD Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Gold-themed Dancing Drums',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden color scheme with enhanced jackpots.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - WHEEL OF FORTUNE
  // =============================================
  {
    id: 'wheel-of-fortune-triple-gold',
    name: 'Wheel of Fortune Triple Gold',
    shortName: 'WoF Triple Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Triple the gold multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold-themed WoF with triple multipliers.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-triple-extreme',
    name: 'Wheel of Fortune Triple Extreme Spin',
    shortName: 'WoF Triple Extreme',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Three mini wheels plus main wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Multiple wheel bonuses for extreme excitement.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-megaways',
    name: 'Wheel of Fortune Megaways',
    shortName: 'WoF Megaways',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2022,
    quickId: 'WoF with Megaways mechanic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic WoF meets Megaways for more ways to win.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-on-tour',
    name: 'Wheel of Fortune On Tour',
    shortName: 'WoF On Tour',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Travel-themed WoF across USA',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Road trip across America theme.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-hawaiian',
    name: 'Wheel of Fortune Hawaiian Getaway',
    shortName: 'WoF Hawaiian',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2018,
    quickId: 'Hawaiian vacation theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Tropical Hawaiian theme with beach imagery.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-gold-spin',
    name: 'Wheel of Fortune Gold Spin',
    shortName: 'WoF Gold Spin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2017,
    quickId: 'Gold-themed with special gold spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden wheel with enhanced spin features.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-wild-gems',
    name: 'Wheel of Fortune Wild Gems',
    shortName: 'WoF Wild Gems',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2020,
    quickId: 'Gem-themed with wild features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Colorful gem symbols with wild bonuses.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-double-diamond',
    name: 'Wheel of Fortune Double Diamond',
    shortName: 'WoF Double Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2015,
    quickId: 'Classic Double Diamond meets WoF',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines two IGT classics.',
    hasCalculator: false
  },

  // =============================================
  // SERIES COMPLETIONS - LOCK IT LINK
  // =============================================
  {
    id: 'lock-it-link-cats-hats-bats',
    name: 'Lock It Link: Cats, Hats & More Bats',
    shortName: 'LIL Cats Hats Bats',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Halloween theme with cats and bats',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Spooky fun theme with Hold & Spin.',
    hasCalculator: false
  },
  {
    id: 'lock-it-link-eureka-reel-blast',
    name: 'Lock It Link: Eureka Reel Blast',
    shortName: 'LIL Eureka',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Mining/eureka theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold mining eureka moment theme.',
    hasCalculator: false
  },
  {
    id: 'lock-it-link-piggy-bankin',
    name: 'Lock It Link: Piggy Bankin\'',
    shortName: 'LIL Piggy Bankin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Piggy bank theme - same as standalone Piggy Bankin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lock It Link version of popular Piggy Bankin.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - IGT
  // =============================================
  {
    id: 'cats',
    name: 'Cats',
    shortName: 'Cats',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2006,
    quickId: 'Classic cat-themed with split symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of IGT\'s most enduring classics. Split symbols feature.',
    hasCalculator: false
  },
  {
    id: 'red-white-blue',
    name: 'Red White & Blue',
    shortName: 'Red White Blue',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1996,
    quickId: 'Classic 3-reel American theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Iconic patriotic 3-reel classic.',
    hasCalculator: false
  },
  {
    id: 'five-times-pay',
    name: 'Five Times Pay',
    shortName: '5x Pay',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1999,
    quickId: 'Classic 3-reel with 5x multiplier',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Simple classic with powerful multiplier.',
    hasCalculator: false
  },
  {
    id: 'ten-times-pay',
    name: 'Ten Times Pay',
    shortName: '10x Pay',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2001,
    quickId: 'Classic 3-reel with 10x multiplier',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Higher multiplier classic slot.',
    hasCalculator: false
  },
  {
    id: 'lucky-larry-lobstermania',
    name: 'Lucky Larry\'s Lobstermania',
    shortName: 'Lobstermania',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2006,
    quickId: 'Lobster fishing theme - iconic buoy bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pick lobster pots bonus. One of IGT\'s biggest hits.',
    hasCalculator: false
  },
  {
    id: 'lobstermania-2',
    name: 'Lobstermania 2',
    shortName: 'Lobstermania 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Sequel with more bonus features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Lobstermania with additional bonuses.',
    hasCalculator: false
  },
  {
    id: 'lobstermania-3',
    name: 'Lobstermania 3',
    shortName: 'Lobstermania 3',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2018,
    quickId: 'Third installment with progressive',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest Lobstermania with progressive jackpot.',
    hasCalculator: false
  },
  {
    id: 'triple-diamond-free-games',
    name: 'Triple Diamond Free Games',
    shortName: 'Triple Diamond FG',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2015,
    quickId: 'Triple Diamond with free spins added',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Triple Diamond with bonus round.',
    hasCalculator: false
  },
  {
    id: 'wolf-run-2',
    name: 'Wolf Run 2',
    shortName: 'Wolf Run 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Wolf Run sequel with enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Modern sequel to classic Wolf Run.',
    hasCalculator: false
  },
  {
    id: 'ghostbusters-plus',
    name: 'Ghostbusters Plus',
    shortName: 'Ghostbusters Plus',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2018,
    quickId: 'Enhanced Ghostbusters with more features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Upgraded Ghostbusters with additional bonuses.',
    hasCalculator: false
  },
  {
    id: 'star-trek',
    name: 'Star Trek',
    shortName: 'Star Trek',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2013,
    quickId: 'Classic Star Trek license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Original series Star Trek theme.',
    hasCalculator: false
  },
  {
    id: 'family-guy',
    name: 'Family Guy',
    shortName: 'Family Guy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Animated TV show license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Family Guy animated theme with character bonuses.',
    hasCalculator: false
  },
  {
    id: 'hex-breaker-2',
    name: 'Hexbreaker 2',
    shortName: 'Hexbreaker 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2013,
    quickId: 'Hexagonal reel pattern',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Unique hexagonal reel layout.',
    hasCalculator: false
  },
  {
    id: 'triple-fortune-dragon-unleashed',
    name: 'Triple Fortune Dragon Unleashed',
    shortName: 'TFD Unleashed',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Enhanced Triple Fortune Dragon',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Upgraded version with unleashed dragons.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - ARISTOCRAT
  // =============================================
  {
    id: '50-dragons',
    name: '50 Dragons',
    shortName: '50 Dragons',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2009,
    quickId: '50 paylines with dragon pearls',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Aristocrat with dragon pearl collection.',
    hasCalculator: false
  },
  {
    id: '50-lions',
    name: '50 Lions',
    shortName: '50 Lions',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2006,
    quickId: 'African safari with 50 paylines',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'African theme. Part of Reel Power series.',
    hasCalculator: false
  },
  {
    id: 'timber-wolf',
    name: 'Timber Wolf',
    shortName: 'Timber Wolf',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2008,
    quickId: 'Wolf pack theme - 1024 ways',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular wolf theme similar to Buffalo.',
    hasCalculator: false
  },
  {
    id: 'timber-wolf-deluxe',
    name: 'Timber Wolf Deluxe',
    shortName: 'Timber Wolf DX',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'Enhanced Timber Wolf',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Deluxe version with improved features.',
    hasCalculator: false
  },
  {
    id: 'wicked-winnings',
    name: 'Wicked Winnings',
    shortName: 'Wicked Winnings',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2002,
    quickId: 'Classic with stacked wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'One of Aristocrat\'s first major video slot hits.',
    hasCalculator: false
  },
  {
    id: 'wicked-winnings-2',
    name: 'Wicked Winnings II',
    shortName: 'Wicked Winnings 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2007,
    quickId: 'Sequel with enhanced wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular sequel with stacked wild birds.',
    hasCalculator: false
  },
  {
    id: 'wicked-winnings-3',
    name: 'Wicked Winnings III',
    shortName: 'Wicked Winnings 3',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2012,
    quickId: 'Third installment of series',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest in the Wicked Winnings trilogy.',
    hasCalculator: false
  },
  {
    id: 'indian-dreaming',
    name: 'Indian Dreaming',
    shortName: 'Indian Dreaming',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 1999,
    quickId: 'Native American dream theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Aristocrat with dream catcher bonus.',
    hasCalculator: false
  },
  {
    id: 'geisha',
    name: 'Geisha',
    shortName: 'Geisha',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2005,
    quickId: 'Japanese geisha theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Elegant Japanese theme with geisha symbols.',
    hasCalculator: false
  },
  {
    id: 'big-red',
    name: 'Big Red',
    shortName: 'Big Red',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2004,
    quickId: 'Australian outback kangaroo theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Iconic Australian pokie with kangaroo.',
    hasCalculator: false
  },
  {
    id: 'choy-sun-doa',
    name: 'Choy Sun Doa',
    shortName: 'Choy Sun Doa',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2010,
    quickId: 'God of Wealth theme - 243 ways',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Asian prosperity theme with Choy Sun character.',
    hasCalculator: false
  },
  {
    id: 'lucky-88',
    name: 'Lucky 88',
    shortName: 'Lucky 88',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2011,
    quickId: 'Chinese luck theme with 88 multiplier',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lucky 8s theme with dice roll bonus.',
    hasCalculator: false
  },
  {
    id: 'wild-panda',
    name: 'Wild Panda',
    shortName: 'Wild Panda',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2011,
    quickId: 'Panda theme with 100 paylines',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cute panda imagery with Asian theme.',
    hasCalculator: false
  },
  {
    id: 'lightning-cash',
    name: 'Lightning Cash',
    shortName: 'Lightning Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Like Lightning Link but standalone jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Similar to Lightning Link but with standalone (not linked) jackpots.',
    hasCalculator: false
  },
  {
    id: 'dragon-cash',
    name: 'Dragon Cash',
    shortName: 'Dragon Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Like Dragon Link but standalone jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Higher min bet than Dragon Link, standalone jackpots.',
    hasCalculator: false
  },
  {
    id: 'cashman-fever',
    name: 'Cashman Fever',
    shortName: 'Cashman Fever',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Mr. Cashman character with fever bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Mr. Cashman character slot.',
    hasCalculator: false
  },
  {
    id: 'cash-express',
    name: 'Cash Express',
    shortName: 'Cash Express',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Train theme with cash bonuses',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Train-themed with express bonus feature.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - LIGHT & WONDER / WMS
  // =============================================
  {
    id: 'jungle-wild',
    name: 'Jungle Wild',
    shortName: 'Jungle Wild',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2010,
    quickId: 'Jungle theme with cascading reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular WMS jungle adventure theme.',
    hasCalculator: false
  },
  {
    id: 'jungle-wild-2',
    name: 'Jungle Wild II',
    shortName: 'Jungle Wild 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Sequel with enhanced features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced jungle adventure.',
    hasCalculator: false
  },
  {
    id: 'super-jackpot-party',
    name: 'Super Jackpot Party',
    shortName: 'Super JP Party',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2007,
    quickId: 'Party theme - iconic WMS bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic party bonus picking game.',
    hasCalculator: false
  },
  {
    id: 'alice-in-wonderland',
    name: 'Alice in Wonderland',
    shortName: 'Alice Wonderland',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2010,
    quickId: 'Lewis Carroll classic theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wonderland theme with multiple bonuses.',
    hasCalculator: false
  },
  {
    id: 'gems-gems-gems',
    name: 'Gems Gems Gems',
    shortName: 'Gems Gems Gems',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Colorful gem theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Vibrant gemstone theme.',
    hasCalculator: false
  },
  {
    id: 'black-knight',
    name: 'Black Knight',
    shortName: 'Black Knight',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Medieval knight theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dark medieval theme with knight warrior.',
    hasCalculator: false
  },
  {
    id: 'black-knight-2',
    name: 'Black Knight II',
    shortName: 'Black Knight 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2015,
    quickId: 'Sequel with colossal reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced with Colossal Reels feature.',
    hasCalculator: false
  },
  {
    id: 'bruce-lee',
    name: 'Bruce Lee',
    shortName: 'Bruce Lee',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Martial arts legend license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Bruce Lee license with martial arts theme.',
    hasCalculator: false
  },
  {
    id: 'kiss',
    name: 'KISS',
    shortName: 'KISS',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Rock band license with classic hits',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'KISS rock band license with music.',
    hasCalculator: false
  },
  {
    id: 'monopoly-once-around-deluxe',
    name: 'Monopoly Once Around Deluxe',
    shortName: 'Monopoly Once',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Monopoly board game bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Move around the Monopoly board for prizes.',
    hasCalculator: false
  },
  {
    id: 'monopoly-money',
    name: 'Monopoly Money',
    shortName: 'Monopoly Money',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Cash-themed Monopoly',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Monopoly with focus on cash prizes.',
    hasCalculator: false
  },
  {
    id: 'wizard-of-oz-emerald-city',
    name: 'Wizard of Oz: Emerald City',
    shortName: 'WoZ Emerald City',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Wizard of Oz in Emerald City',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Follow the yellow brick road to Emerald City.',
    hasCalculator: false
  },
  {
    id: 'wizard-of-oz-ruby-slippers',
    name: 'Wizard of Oz: Ruby Slippers',
    shortName: 'WoZ Ruby Slippers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Dorothy\'s ruby slippers theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic WMS Oz game with ruby slipper bonus.',
    hasCalculator: false
  },
  {
    id: 'ultimate-fire-link-rue-royale',
    name: 'Ultimate Fire Link: Rue Royale',
    shortName: 'UFL Rue Royale',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'French Quarter New Orleans theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Newest Fire Link with New Orleans Mardi Gras theme.',
    hasCalculator: false
  },
  {
    id: 'ultimate-fire-link-brazil',
    name: 'Ultimate Fire Link: Brazil',
    shortName: 'UFL Brazil',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Brazilian carnival theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Colorful Brazil carnival theme.',
    hasCalculator: false
  },
  {
    id: 'ultimate-fire-link-north-shore',
    name: 'Ultimate Fire Link: North Shore',
    shortName: 'UFL North Shore',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Hawaiian surf theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Surfing and Hawaiian beach theme.',
    hasCalculator: false
  },
  {
    id: 'ultimate-fire-link-by-the-bay',
    name: 'Ultimate Fire Link: By The Bay',
    shortName: 'UFL By The Bay',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'San Francisco bay theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'San Francisco/California bay area theme.',
    hasCalculator: false
  },
  {
    id: 'james-bond-casino-royale',
    name: 'James Bond: Casino Royale',
    shortName: 'Bond Casino Royal',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Daniel Craig Bond movie theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Casino Royale movie theme.',
    hasCalculator: false
  },
  {
    id: 'james-bond-goldfinger',
    name: 'James Bond: Goldfinger',
    shortName: 'Bond Goldfinger',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Classic Connery Bond film',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Goldfinger classic Bond theme.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - KONAMI
  // =============================================
  {
    id: 'african-diamond',
    name: 'African Diamond',
    shortName: 'African Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2012,
    quickId: 'African safari with diamond jackpot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Safari theme with diamond collection.',
    hasCalculator: false
  },
  {
    id: 'full-moon-diamond',
    name: 'Full Moon Diamond',
    shortName: 'Full Moon Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2015,
    quickId: 'Werewolf/moon theme with diamonds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mystical moon theme.',
    hasCalculator: false
  },
  {
    id: 'dragon-treasure',
    name: 'Dragon Treasure',
    shortName: 'Dragon Treasure',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2014,
    quickId: 'Dragon hoarding treasure theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon guarding treasure.',
    hasCalculator: false
  },
  {
    id: 'roman-tribune',
    name: 'Roman Tribune',
    shortName: 'Roman Tribune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2016,
    quickId: 'Roman empire military theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Roman soldier and colosseum theme.',
    hasCalculator: false
  },
  {
    id: 'celestial-sun-riches',
    name: 'Celestial Sun Riches',
    shortName: 'Celestial Sun',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Celestial/space theme with sun',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cosmic sun and stars theme.',
    hasCalculator: false
  },
  {
    id: 'money-galaxy',
    name: 'Money Galaxy',
    shortName: 'Money Galaxy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: 'Space/galaxy money theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Galactic cash theme.',
    hasCalculator: false
  },
  {
    id: 'beat-the-field',
    name: 'Beat the Field',
    shortName: 'Beat the Field',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2020,
    quickId: 'Horse racing theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Horse racing competition theme.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - AGS
  // =============================================
  {
    id: 'golden-wins',
    name: 'Golden Wins',
    shortName: 'Golden Wins',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2018,
    quickId: 'Gold/wealth theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden prosperity theme.',
    hasCalculator: false
  },
  {
    id: 'colossal-diamonds',
    name: 'Colossal Diamonds',
    shortName: 'Colossal Diamonds',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Large diamond symbols',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Big diamond symbols feature.',
    hasCalculator: false
  },
  {
    id: 'jade-wins',
    name: 'Jade Wins',
    shortName: 'Jade Wins',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Asian jade gemstone theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Jade and Asian fortune theme.',
    hasCalculator: false
  },
  {
    id: 'lucky-lightning',
    name: 'Lucky Lightning',
    shortName: 'Lucky Lightning',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Lightning strike luck theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lightning bolt brings luck.',
    hasCalculator: false
  },
  {
    id: 'royal-riches',
    name: 'Royal Riches',
    shortName: 'Royal Riches',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2018,
    quickId: 'Royal monarchy wealth theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Kings, queens, and royal treasures.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - EVERI
  // =============================================
  {
    id: 'cash-machine-wild',
    name: 'Cash Machine Wild',
    shortName: 'Cash Machine Wild',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2019,
    quickId: 'Cash Machine with wild features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Cash Machine with wilds.',
    hasCalculator: false
  },
  {
    id: 'triple-cash-wheel',
    name: 'Triple Cash Wheel',
    shortName: 'Triple Cash Wheel',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Three cash wheels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Triple wheel bonus feature.',
    hasCalculator: false
  },
  {
    id: 'jackpot-streams',
    name: 'Jackpot Streams',
    shortName: 'Jackpot Streams',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Streaming jackpot feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Multiple jackpot streams.',
    hasCalculator: false
  },
  {
    id: 'player-classic',
    name: 'Player Classic',
    shortName: 'Player Classic',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2018,
    quickId: 'Classic style slot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Traditional classic slot feel.',
    hasCalculator: false
  },

  // =============================================
  // MANUFACTURER FLAGSHIPS - AINSWORTH
  // =============================================
  {
    id: 'eagle-bucks',
    name: 'Eagle Bucks',
    shortName: 'Eagle Bucks',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2016,
    quickId: 'American eagle theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Patriotic eagle theme.',
    hasCalculator: false
  },
  {
    id: 'grand-dragon',
    name: 'Grand Dragon',
    shortName: 'Grand Dragon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2017,
    quickId: 'Asian dragon theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese dragon theme.',
    hasCalculator: false
  },
  {
    id: 'stormin-7s',
    name: 'Stormin\' 7s',
    shortName: 'Stormin 7s',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2015,
    quickId: 'Classic 7s with storm theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sevens with lightning storm effects.',
    hasCalculator: false
  },
  {
    id: 'shaman-spirit',
    name: 'Shaman\'s Spirit',
    shortName: 'Shaman Spirit',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2018,
    quickId: 'Native American shaman theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mystical shaman and spirit theme.',
    hasCalculator: false
  },
  {
    id: 'mammoth-power',
    name: 'Mammoth Power',
    shortName: 'Mammoth Power',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2019,
    quickId: 'Ice age mammoth theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Woolly mammoth prehistoric theme.',
    hasCalculator: false
  },

  // =============================================
  // LICENSED/BRANDED GAMES
  // =============================================
  {
    id: 'willy-wonka-dreamers',
    name: 'Willy Wonka: World of Wonka Dreamers',
    shortName: 'Wonka Dreamers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Wonka chocolate factory theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Expanded Wonka world theme.',
    hasCalculator: false
  },
  {
    id: 'grease',
    name: 'Grease',
    shortName: 'Grease',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2012,
    quickId: 'Musical movie license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Grease movie and musical theme.',
    hasCalculator: false
  },
  {
    id: 'elvira',
    name: 'Elvira: Mistress of the Dark',
    shortName: 'Elvira',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Horror hostess icon',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Elvira horror comedy theme.',
    hasCalculator: false
  },
  {
    id: 'anchorman',
    name: 'Anchorman',
    shortName: 'Anchorman',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Will Ferrell comedy movie',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ron Burgundy news team theme.',
    hasCalculator: false
  },
  {
    id: 'sharknado',
    name: 'Sharknado',
    shortName: 'Sharknado',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Cult disaster movie',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Campy shark tornado movie theme.',
    hasCalculator: false
  },
  {
    id: 'game-of-thrones-fire-ice',
    name: 'Game of Thrones: Fire & Ice',
    shortName: 'GoT Fire Ice',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'HBO series - fire and ice theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'House Targaryen vs Stark theme.',
    hasCalculator: false
  },
  {
    id: 'big-bang-theory-jackpot',
    name: 'Big Bang Theory: Jackpot',
    shortName: 'Big Bang Jackpot',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'TV sitcom nerds theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sheldon and gang with progressive.',
    hasCalculator: false
  },
  {
    id: 'rolling-stones',
    name: 'The Rolling Stones',
    shortName: 'Rolling Stones',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Rock legends music license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mick Jagger and classic Stones songs.',
    hasCalculator: false
  },
  {
    id: 'madonna',
    name: 'Madonna',
    shortName: 'Madonna',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'Pop queen music license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Madonna greatest hits theme.',
    hasCalculator: false
  },
  {
    id: 'mariah-carey',
    name: 'Mariah Carey',
    shortName: 'Mariah Carey',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2023,
    quickId: 'Pop diva music license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mariah Carey music themed.',
    hasCalculator: false
  },
  {
    id: 'ozzy-osbourne',
    name: 'Ozzy Osbourne',
    shortName: 'Ozzy Osbourne',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Prince of Darkness rock legend',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Black Sabbath frontman theme.',
    hasCalculator: false
  },
  {
    id: 'guns-n-roses',
    name: 'Guns N\' Roses',
    shortName: 'Guns N Roses',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2016,
    quickId: 'Rock band music license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Appetite for Destruction era theme.',
    hasCalculator: false
  },
  {
    id: 'motley-crue',
    name: 'Mötley Crüe',
    shortName: 'Motley Crue',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Hair metal band license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Kickstart My Heart and classics.',
    hasCalculator: false
  },
  {
    id: 'def-leppard',
    name: 'Def Leppard',
    shortName: 'Def Leppard',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: '80s rock band license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pour Some Sugar On Me theme.',
    hasCalculator: false
  },
  {
    id: 'beetlejuice',
    name: 'Beetlejuice',
    shortName: 'Beetlejuice',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Tim Burton movie ghost',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Beetlejuice Beetlejuice Beetlejuice!',
    hasCalculator: false
  },
  {
    id: 'mad-max-fury-road',
    name: 'Mad Max: Fury Road',
    shortName: 'Mad Max',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Post-apocalyptic action movie',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Witness me! War rig theme.',
    hasCalculator: false
  },
  {
    id: 'jurassic-world',
    name: 'Jurassic World',
    shortName: 'Jurassic World',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Dinosaur movie franchise',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'T-Rex and velociraptors theme.',
    hasCalculator: false
  },
  {
    id: 'jaws',
    name: 'Jaws',
    shortName: 'Jaws',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Spielberg shark classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'You\'re gonna need a bigger boat.',
    hasCalculator: false
  },
  {
    id: 'jumanji',
    name: 'Jumanji',
    shortName: 'Jumanji',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Adventure board game movie',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Jungle adventure board game theme.',
    hasCalculator: false
  },
  {
    id: 'back-to-the-future',
    name: 'Back to the Future',
    shortName: 'Back to Future',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2020,
    quickId: 'Time travel movie classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'DeLorean and 1.21 gigawatts!',
    hasCalculator: false
  },
  {
    id: 'baywatch',
    name: 'Baywatch',
    shortName: 'Baywatch',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2017,
    quickId: 'Beach lifeguard TV show',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Hasselhoff and slow-motion running.',
    hasCalculator: false
  },
  {
    id: 'breakfast-at-tiffanys',
    name: 'Breakfast at Tiffany\'s',
    shortName: 'Breakfast Tiffany',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Audrey Hepburn classic film',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Elegant Audrey Hepburn theme.',
    hasCalculator: false
  },
  {
    id: 'igt-top-dollar',
    name: 'Top Dollar',
    shortName: 'Top Dollar',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1998,
    quickId: 'Classic IGT with top dollar bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Iconic IGT classic still on many floors.',
    hasCalculator: false
  },
  {
    id: 'double-top-dollar',
    name: 'Double Top Dollar',
    shortName: 'Double Top Dollar',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2005,
    quickId: 'Enhanced Top Dollar with double feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Double the Top Dollar fun.',
    hasCalculator: false
  },
  {
    id: 'triple-top-dollar',
    name: 'Triple Top Dollar',
    shortName: 'Triple Top Dollar',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2010,
    quickId: 'Triple feature Top Dollar',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Triple version of classic.',
    hasCalculator: false
  },

  // =============================================
  // 2023-2025 RECENT RELEASES
  // =============================================
  {
    id: 'crazy-money-gold',
    name: 'Crazy Money Gold',
    shortName: 'Crazy Money Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2023,
    quickId: 'Gold-themed Crazy Money',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest in Crazy Money series.',
    hasCalculator: false
  },
  {
    id: 'ocean-riches',
    name: 'Ocean Riches',
    shortName: 'Ocean Riches',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2023,
    quickId: 'Underwater treasure theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ocean floor riches theme.',
    hasCalculator: false
  },
  {
    id: 'fu-xuan',
    name: 'Fu Xuan',
    shortName: 'Fu Xuan',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2023,
    quickId: 'Asian fortune theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese prosperity slot.',
    hasCalculator: false
  },
  {
    id: 'coin-trio',
    name: 'Coin Trio',
    shortName: 'Coin Trio',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Triple coin collection feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Three-coin collection mechanic.',
    hasCalculator: false
  },
  {
    id: 'fortune-fury',
    name: 'Fortune Fury',
    shortName: 'Fortune Fury',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2023,
    quickId: 'Furious fortune theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High energy fortune theme.',
    hasCalculator: false
  },
  {
    id: 'fire-link-power-4',
    name: 'Fire Link Power 4',
    shortName: 'Fire Link Power 4',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Four-game Fire Link experience',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Four Fire Link games in one cabinet.',
    hasCalculator: false
  },
  {
    id: 'dragon-link-lightning',
    name: 'Dragon Link Lightning',
    shortName: 'DL Lightning',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'Dragon Link meets Lightning mechanics',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines Dragon Link with lightning effects.',
    hasCalculator: false
  },
  {
    id: 'dancing-drums-link',
    name: 'Dancing Drums Link',
    shortName: 'DD Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Dancing Drums with linked jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dancing Drums with linked progressive.',
    hasCalculator: false
  },

  // =============================================
  // ADDITIONAL POPULAR FLOOR MACHINES - BATCH 2
  // =============================================

  // MORE IGT CLASSICS & POPULAR
  {
    id: 'double-diamond-2000',
    name: 'Double Diamond 2000',
    shortName: 'DD 2000',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2000,
    quickId: 'Millennium version of classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Y2K version of the classic Double Diamond.',
    hasCalculator: false
  },
  {
    id: 'double-diamond-deluxe',
    name: 'Double Diamond Deluxe',
    shortName: 'DD Deluxe',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2008,
    quickId: 'Enhanced Double Diamond',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Upgraded classic with more features.',
    hasCalculator: false
  },
  {
    id: 'triple-diamond-haywire',
    name: 'Triple Diamond Haywire',
    shortName: 'TD Haywire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Triple Diamond with wild feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Haywire feature adds excitement.',
    hasCalculator: false
  },
  {
    id: 'sizzling-7s',
    name: 'Sizzling 7s',
    shortName: 'Sizzling 7s',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2005,
    quickId: 'Classic 7s with sizzle',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Hot 7s theme classic.',
    hasCalculator: false
  },
  {
    id: 'wild-cherry',
    name: 'Wild Cherry',
    shortName: 'Wild Cherry',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2003,
    quickId: 'Cherry-themed classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic fruit machine style.',
    hasCalculator: false
  },
  {
    id: 'mega-jackpots-cleopatra',
    name: 'MegaJackpots Cleopatra',
    shortName: 'MJ Cleopatra',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Cleopatra with progressive',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wide area progressive Cleopatra.',
    hasCalculator: false
  },
  {
    id: 'mega-jackpots-siberian-storm',
    name: 'MegaJackpots Siberian Storm',
    shortName: 'MJ Siberian Storm',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2017,
    quickId: 'Siberian Storm with progressive',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wide area progressive version.',
    hasCalculator: false
  },
  {
    id: 'cleopatra-gold',
    name: 'Cleopatra Gold',
    shortName: 'Cleopatra Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2018,
    quickId: 'Gold-themed Cleopatra',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden version of classic Cleopatra.',
    hasCalculator: false
  },
  {
    id: 'cleopatra-plus',
    name: 'Cleopatra Plus',
    shortName: 'Cleopatra Plus',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Enhanced Cleopatra with more features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Plus version with additional bonuses.',
    hasCalculator: false
  },
  {
    id: 'cash-spin',
    name: 'Cash Spin',
    shortName: 'Cash Spin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Wheel spin for cash',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Spin the wheel for cash prizes.',
    hasCalculator: false
  },
  {
    id: 'money-storm',
    name: 'Money Storm',
    shortName: 'Money Storm',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2015,
    quickId: 'Stormy money theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Weather meets money theme.',
    hasCalculator: false
  },
  {
    id: 'paradise-garden',
    name: 'Paradise Garden',
    shortName: 'Paradise Garden',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2020,
    quickId: 'Garden of Eden theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lush garden paradise setting.',
    hasCalculator: false
  },
  {
    id: 'invaders-attack-planet-moolah',
    name: 'Invaders Attack from the Planet Moolah',
    shortName: 'Invaders Attack',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2014,
    quickId: 'Alien cow invasion cascading reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Aliens meets Planet Moolah theme.',
    hasCalculator: false
  },
  {
    id: 'return-planet-moolah',
    name: 'Return to Planet Moolah',
    shortName: 'Return Moolah',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Sequel to Planet Moolah',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Return to the alien cow planet.',
    hasCalculator: false
  },
  {
    id: 'prowling-panther',
    name: 'Prowling Panther',
    shortName: 'Prowling Panther',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Jungle panther with multiway',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Jungle theme with prowling black panther.',
    hasCalculator: false
  },
  {
    id: 'fire-opals',
    name: 'Fire Opals',
    shortName: 'Fire Opals',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Gem-themed with fire opals',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Colorful gemstone theme.',
    hasCalculator: false
  },
  {
    id: 'secrets-of-the-forest',
    name: 'Secrets of the Forest',
    shortName: 'Secrets Forest',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2013,
    quickId: 'Mystical forest fairy theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enchanted forest with magical creatures.',
    hasCalculator: false
  },
  {
    id: 'treasures-of-troy',
    name: 'Treasures of Troy',
    shortName: 'Treasures Troy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2011,
    quickId: 'Ancient Troy theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Helen of Troy and Trojan horse theme.',
    hasCalculator: false
  },
  {
    id: 'sphinx-3d',
    name: 'Sphinx 3D',
    shortName: 'Sphinx 3D',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Egyptian sphinx in 3D',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: '3D graphics Egyptian theme.',
    hasCalculator: false
  },
  {
    id: 'cats-slot',
    name: 'CATS',
    shortName: 'CATS',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2009,
    quickId: 'Big cat wildlife theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lions, tigers, leopards theme.',
    hasCalculator: false
  },

  // MORE ARISTOCRAT
  {
    id: 'heart-of-vegas',
    name: 'Heart of Vegas',
    shortName: 'Heart of Vegas',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Vegas heart theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Love Vegas theme.',
    hasCalculator: false
  },
  {
    id: 'quick-fire-flaming-jackpots',
    name: 'Quick Fire Flaming Jackpots',
    shortName: 'Quick Fire Flaming',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Fast action fire jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Quick hitting fire jackpot theme.',
    hasCalculator: false
  },
  {
    id: 'moon-festival',
    name: 'Moon Festival',
    shortName: 'Moon Festival',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Chinese moon festival theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mid-Autumn Festival celebration theme.',
    hasCalculator: false
  },
  {
    id: 'spring-carnival',
    name: 'Spring Carnival',
    shortName: 'Spring Carnival',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2016,
    quickId: 'Australian horse racing carnival',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Melbourne Cup racing theme.',
    hasCalculator: false
  },
  {
    id: 'double-happiness',
    name: 'Double Happiness',
    shortName: 'Double Happiness',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2013,
    quickId: 'Chinese wedding/happiness theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese double happiness symbol.',
    hasCalculator: false
  },
  {
    id: 'golden-peony',
    name: 'Golden Peony',
    shortName: 'Golden Peony',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Asian golden flower theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden peony flower Asian theme.',
    hasCalculator: false
  },
  {
    id: 'mighty-cash-original',
    name: 'Mighty Cash',
    shortName: 'Mighty Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Cash collection theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Collect mighty cash prizes.',
    hasCalculator: false
  },
  {
    id: 'mighty-cash-ultra',
    name: 'Mighty Cash Ultra',
    shortName: 'Mighty Cash Ultra',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Enhanced Mighty Cash',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ultra version with bigger prizes.',
    hasCalculator: false
  },
  {
    id: 'wonder-4-boost',
    name: 'Wonder 4 Boost',
    shortName: 'Wonder 4 Boost',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Wonder 4 with boost feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Four games with boost multiplier.',
    hasCalculator: false
  },
  {
    id: 'wonder-4-tall-fortunes',
    name: 'Wonder 4 Tall Fortunes',
    shortName: 'W4 Tall Fortunes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Wonder 4 on tall cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Premium Wonder 4 on tall screen.',
    hasCalculator: false
  },
  {
    id: 'walking-dead-2',
    name: 'The Walking Dead 2',
    shortName: 'Walking Dead 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Walking Dead sequel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Second Walking Dead slot.',
    hasCalculator: false
  },
  {
    id: 'sons-of-anarchy-2015',
    name: 'Sons of Anarchy',
    shortName: 'Sons of Anarchy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Motorcycle gang TV show',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Biker gang SAMCRO theme.',
    hasCalculator: false
  },

  // MORE LIGHT & WONDER / WMS / BALLY
  {
    id: 'wizard-of-oz-tin-man',
    name: 'Wizard of Oz: Tin Man',
    shortName: 'WoZ Tin Man',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2016,
    quickId: 'Tin Man focused Oz game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Tin Man character focus.',
    hasCalculator: false
  },
  {
    id: 'wizard-of-oz-scarecrow',
    name: 'Wizard of Oz: Scarecrow',
    shortName: 'WoZ Scarecrow',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2016,
    quickId: 'Scarecrow focused Oz game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Scarecrow character focus.',
    hasCalculator: false
  },
  {
    id: 'quick-hit-black-gold',
    name: 'Quick Hit Black Gold',
    shortName: 'QH Black Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2014,
    quickId: 'Oil/gold themed Quick Hit',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Texas oil baron theme Quick Hit.',
    hasCalculator: false
  },
  {
    id: 'quick-hit-fever',
    name: 'Quick Hit Fever',
    shortName: 'QH Fever',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2017,
    quickId: 'Hot fever Quick Hit',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fever hot streak theme.',
    hasCalculator: false
  },
  {
    id: 'quick-hit-ultra-pays',
    name: 'Quick Hit Ultra Pays',
    shortName: 'QH Ultra Pays',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Ultra pays Quick Hit',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced pays version.',
    hasCalculator: false
  },
  {
    id: 'cash-wizard',
    name: 'Cash Wizard',
    shortName: 'Cash Wizard',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2011,
    quickId: 'Magical wizard cash theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wizard creates magical cash.',
    hasCalculator: false
  },
  {
    id: 'dragon-spin',
    name: 'Dragon Spin',
    shortName: 'Dragon Spin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2015,
    quickId: 'Spinning dragon reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon with spinning reel feature.',
    hasCalculator: false
  },
  {
    id: 'hot-hot-penny',
    name: 'Hot Hot Penny',
    shortName: 'Hot Hot Penny',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Hot penny slot theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Penny themed with hot features.',
    hasCalculator: false
  },
  {
    id: 'great-eagle',
    name: 'Great Eagle',
    shortName: 'Great Eagle',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Majestic eagle theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'American eagle patriotic theme.',
    hasCalculator: false
  },
  {
    id: 'great-eagle-returns',
    name: 'Great Eagle Returns',
    shortName: 'Great Eagle Ret',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2017,
    quickId: 'Eagle sequel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Eagle returns with more features.',
    hasCalculator: false
  },
  {
    id: 'robin-hood',
    name: 'Robin Hood',
    shortName: 'Robin Hood',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Steal from rich Robin Hood',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sherwood Forest adventure.',
    hasCalculator: false
  },
  {
    id: 'lord-of-the-rings',
    name: 'Lord of the Rings',
    shortName: 'LOTR',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Tolkien fantasy epic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Middle Earth adventure theme.',
    hasCalculator: false
  },
  {
    id: 'fortune-coin',
    name: 'Fortune Coin',
    shortName: 'Fortune Coin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Lucky coin fortune theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden fortune coin theme.',
    hasCalculator: false
  },
  {
    id: 'fortune-coin-boost',
    name: 'Fortune Coin Boost',
    shortName: 'Fortune Coin Boost',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Fortune Coin with boost',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Boosted version with multipliers.',
    hasCalculator: false
  },
  {
    id: 'cash-galaxy',
    name: 'Cash Galaxy',
    shortName: 'Cash Galaxy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Galactic cash theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Space themed cash game.',
    hasCalculator: false
  },
  {
    id: 'cash-connection-charming-lady',
    name: 'Cash Connection: Charming Lady',
    shortName: 'CC Charming Lady',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Lady luck cash connection',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Charming lady brings luck.',
    hasCalculator: false
  },
  {
    id: '777-jackpot',
    name: '777 Jackpot',
    shortName: '777 Jackpot',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Classic 777 with jackpot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Triple sevens jackpot theme.',
    hasCalculator: false
  },

  // MORE KONAMI
  {
    id: 'china-mystery',
    name: 'China Mystery',
    shortName: 'China Mystery',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2014,
    quickId: 'Chinese mystery theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mysterious Chinese symbols.',
    hasCalculator: false
  },
  {
    id: 'gypsy-fire',
    name: 'Gypsy Fire',
    shortName: 'Gypsy Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2013,
    quickId: 'Fortune teller theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fortune teller and crystal ball.',
    hasCalculator: false
  },
  {
    id: 'golden-wolves',
    name: 'Golden Wolves',
    shortName: 'Golden Wolves',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Wolf pack with gold theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden wolf pack hunt.',
    hasCalculator: false
  },
  {
    id: 'electrifying-riches',
    name: 'Electrifying Riches',
    shortName: 'Electrifying Rich',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Electric money theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Electric riches theme.',
    hasCalculator: false
  },
  {
    id: 'jackpot-streak',
    name: 'Jackpot Streak',
    shortName: 'Jackpot Streak',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2020,
    quickId: 'Jackpot winning streak',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Hot streak jackpot theme.',
    hasCalculator: false
  },
  {
    id: 'sparkling-nightlife',
    name: 'Sparkling Nightlife',
    shortName: 'Sparkling Night',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Vegas nightclub theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Glamorous nightclub setting.',
    hasCalculator: false
  },
  {
    id: 'great-moai',
    name: 'Great Moai',
    shortName: 'Great Moai',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2016,
    quickId: 'Easter Island statues',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Easter Island Moai heads theme.',
    hasCalculator: false
  },
  {
    id: 'scroll-of-wonder',
    name: 'Scroll of Wonder',
    shortName: 'Scroll Wonder',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: 'Magic scroll Asian theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ancient magic scroll theme.',
    hasCalculator: false
  },
  {
    id: 'riches-of-the-sea',
    name: 'Riches of the Sea',
    shortName: 'Riches of Sea',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Underwater treasure theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ocean floor riches.',
    hasCalculator: false
  },
  {
    id: 'lucky-o-leary',
    name: 'Lucky O\'Leary',
    shortName: 'Lucky O\'Leary',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Irish leprechaun luck',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lucky Irish leprechaun theme.',
    hasCalculator: false
  },

  // MORE AGS
  {
    id: 'xtreme-jackpots',
    name: 'Xtreme Jackpots',
    shortName: 'Xtreme Jackpots',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Extreme jackpot action',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High action jackpot theme.',
    hasCalculator: false
  },
  {
    id: 'fire-pearl',
    name: 'Fire Pearl',
    shortName: 'Fire Pearl',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Flaming pearl theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire and pearl dragon theme.',
    hasCalculator: false
  },
  {
    id: 'phoenix-rising',
    name: 'Phoenix Rising',
    shortName: 'Phoenix Rising',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2018,
    quickId: 'Rising phoenix bird',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Phoenix rebirth theme.',
    hasCalculator: false
  },
  {
    id: 'action-dragons',
    name: 'Action Dragons',
    shortName: 'Action Dragons',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Action-packed dragon theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High action dragon game.',
    hasCalculator: false
  },
  {
    id: 'money-charge-jackpots',
    name: 'Money Charge Jackpots',
    shortName: 'Money Charge JP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2022,
    quickId: 'Charging money jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Money charges up jackpots.',
    hasCalculator: false
  },
  {
    id: 'olympus-strikes',
    name: 'Olympus Strikes',
    shortName: 'Olympus Strikes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Greek god thunder',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Zeus thunderbolt theme.',
    hasCalculator: false
  },
  {
    id: 'orion-rising',
    name: 'Orion Rising',
    shortName: 'Orion Rising',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Constellation theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Orion constellation theme.',
    hasCalculator: false
  },

  // MORE EVERI
  {
    id: 'money-rain',
    name: 'Money Rain',
    shortName: 'Money Rain',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2019,
    quickId: 'Raining money theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Money falling from sky.',
    hasCalculator: false
  },
  {
    id: 'cash-cove',
    name: 'Cash Cove',
    shortName: 'Cash Cove',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Pirate treasure cove',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pirate treasure hideaway.',
    hasCalculator: false
  },
  {
    id: 'jewel-jackpots',
    name: 'Jewel Jackpots',
    shortName: 'Jewel Jackpots',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Gemstone jackpot theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Collect jewels for jackpots.',
    hasCalculator: false
  },
  {
    id: 'cashin-catch',
    name: 'Cashin\' Catch',
    shortName: 'Cashin Catch',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2022,
    quickId: 'Fishing for cash theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fishing game catches cash.',
    hasCalculator: false
  },
  {
    id: 'gold-standard-jackpots',
    name: 'Gold Standard Jackpots',
    shortName: 'Gold Standard JP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Gold bar jackpot theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold bars and jackpots.',
    hasCalculator: false
  },

  // MORE AINSWORTH
  {
    id: 'players-choice',
    name: 'Player\'s Choice',
    shortName: 'Players Choice',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2017,
    quickId: 'Multi-game player choice',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Choose between multiple games.',
    hasCalculator: false
  },
  {
    id: 'thunder-cash',
    name: 'Thunder Cash',
    shortName: 'Thunder Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2018,
    quickId: 'Thunder storm cash theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lightning and cash theme.',
    hasCalculator: false
  },
  {
    id: 'pac-man-wild-edition',
    name: 'PAC-MAN Wild Edition',
    shortName: 'PAC-MAN Wild',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2019,
    quickId: 'Classic arcade PAC-MAN',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Arcade game license.',
    hasCalculator: false
  },
  {
    id: 'sky-dancer',
    name: 'Sky Dancer',
    shortName: 'Sky Dancer',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2020,
    quickId: 'Dancer in the sky theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ethereal sky dancer.',
    hasCalculator: false
  },
  {
    id: 'golden-incas',
    name: 'Golden Incas',
    shortName: 'Golden Incas',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2019,
    quickId: 'Inca gold treasure',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Incan gold treasure hunt.',
    hasCalculator: false
  },

  // MORE INCREDIBLE TECHNOLOGIES
  {
    id: 'crazy-money-ii',
    name: 'Crazy Money II',
    shortName: 'Crazy Money II',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2017,
    quickId: 'Crazy Money sequel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Second Crazy Money game.',
    hasCalculator: false
  },
  {
    id: 'money-mania',
    name: 'Money Mania',
    shortName: 'Money Mania',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2020,
    quickId: 'Money madness theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Money-crazy theme.',
    hasCalculator: false
  },
  {
    id: 'triple-cash-jackpots',
    name: 'Triple Cash Jackpots',
    shortName: 'Triple Cash JP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2021,
    quickId: 'Three cash jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Triple jackpot chances.',
    hasCalculator: false
  },
  {
    id: 'jackpot-explosion-it',
    name: 'Jackpot Explosion',
    shortName: 'JP Explosion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2022,
    quickId: 'Explosive jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Explosive jackpot feature.',
    hasCalculator: false
  },

  // ADDITIONAL LICENSED GAMES
  {
    id: 'the-mask',
    name: 'The Mask',
    shortName: 'The Mask',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2017,
    quickId: 'Jim Carrey comedy movie',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sssmokin! The Mask movie theme.',
    hasCalculator: false
  },
  {
    id: 'ace-ventura',
    name: 'Ace Ventura: Pet Detective',
    shortName: 'Ace Ventura',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Jim Carrey pet detective',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Alrighty then! Movie theme.',
    hasCalculator: false
  },
  {
    id: 'ferris-bueller',
    name: 'Ferris Bueller\'s Day Off',
    shortName: 'Ferris Bueller',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2015,
    quickId: '80s teen comedy classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Life moves pretty fast movie.',
    hasCalculator: false
  },
  {
    id: 'tmnt',
    name: 'Teenage Mutant Ninja Turtles',
    shortName: 'TMNT',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Cowabunga! Pizza time',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Turtle power!',
    hasCalculator: false
  },
  {
    id: 'nightmare-on-elm-street',
    name: 'A Nightmare on Elm Street',
    shortName: 'Elm Street',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Freddy Krueger horror',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Whatever you do, don\'t fall asleep.',
    hasCalculator: false
  },
  {
    id: 'braveheart',
    name: 'Braveheart',
    shortName: 'Braveheart',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Mel Gibson Scottish epic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'FREEDOM! Scottish battle theme.',
    hasCalculator: false
  },
  {
    id: 'planet-of-the-apes',
    name: 'Planet of the Apes',
    shortName: 'Planet Apes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Apes take over the world',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Caesar and apes theme.',
    hasCalculator: false
  },
  {
    id: 'godzilla',
    name: 'Godzilla',
    shortName: 'Godzilla',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'King of the monsters',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Giant monster destruction theme.',
    hasCalculator: false
  },
  {
    id: 'transformers',
    name: 'Transformers: Battle for Cybertron',
    shortName: 'Transformers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2017,
    quickId: 'Robots in disguise',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Autobots vs Decepticons.',
    hasCalculator: false
  },
  {
    id: 'cluedo',
    name: 'Cluedo',
    shortName: 'Cluedo',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Classic board game mystery',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Who did it mystery theme.',
    hasCalculator: false
  },
  {
    id: 'simpsons',
    name: 'The Simpsons',
    shortName: 'Simpsons',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'D\'oh! Animated family',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Homer and Springfield gang.',
    hasCalculator: false
  },
  {
    id: 'south-park',
    name: 'South Park',
    shortName: 'South Park',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Adult cartoon humor',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'They killed Kenny! theme.',
    hasCalculator: false
  },
  {
    id: 'austin-powers',
    name: 'Austin Powers',
    shortName: 'Austin Powers',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Yeah baby! Spy spoof',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'International man of mystery.',
    hasCalculator: false
  },
  {
    id: 'zorro',
    name: 'Zorro',
    shortName: 'Zorro',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2010,
    quickId: 'Masked hero swashbuckler',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Z marks the spot!',
    hasCalculator: false
  },
  {
    id: 'golden-jungle',
    name: 'Golden Jungle',
    shortName: 'Golden Jungle',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Jungle with golden treasure',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden treasures in jungle.',
    hasCalculator: false
  },
  {
    id: 'african-treasure',
    name: 'African Treasure',
    shortName: 'African Treasure',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2018,
    quickId: 'African safari treasure',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Safari adventure treasures.',
    hasCalculator: false
  },
  {
    id: 'jaguar-moon',
    name: 'Jaguar Moon',
    shortName: 'Jaguar Moon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2019,
    quickId: 'Moonlit jaguar theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Jungle jaguar under moonlight.',
    hasCalculator: false
  },
  {
    id: 'penguin-pays',
    name: 'Penguin Pays',
    shortName: 'Penguin Pays',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'Arctic penguin theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cute penguins on ice.',
    hasCalculator: false
  },
  {
    id: 'panda-king',
    name: 'Panda King',
    shortName: 'Panda King',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2016,
    quickId: 'Panda royalty theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'King of the pandas.',
    hasCalculator: false
  },
  {
    id: 'lucky-honeycomb',
    name: 'Lucky Honeycomb',
    shortName: 'Lucky Honeycomb',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Bee and honeycomb theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sweet honeycomb prizes.',
    hasCalculator: false
  },
  {
    id: 'mystic-pearls',
    name: 'Mystic Pearls',
    shortName: 'Mystic Pearls',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Mystical ocean pearls',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Underwater pearl magic.',
    hasCalculator: false
  },
  {
    id: 'outback-jack',
    name: 'Outback Jack',
    shortName: 'Outback Jack',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2007,
    quickId: 'Australian outback explorer',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Australian adventure theme.',
    hasCalculator: false
  },
  {
    id: 'sahara-gold-ll',
    name: 'Sahara Gold',
    shortName: 'Sahara Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Desert gold treasure theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lightning Link desert variant.',
    hasCalculator: false
  },

  // =============================================
  // MISSING 2023-2025 MAJOR RELEASES
  // =============================================

  // ARISTOCRAT 2024-2025 NEW RELEASES
  {
    id: 'hyperlink',
    name: 'Hyperlink',
    shortName: 'Hyperlink',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Follow-up to Buffalo Ultimate Stampede - multi-denom',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Three multi-denom game choice. Premium lease game.',
    hasCalculator: false
  },
  {
    id: 'touchdown-link',
    name: 'Touchdown Link',
    shortName: 'Touchdown Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'NFL series - touchdown scoring theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'NFL license. Mars X Flex cabinet.',
    hasCalculator: false
  },
  {
    id: 'touchdown-trio',
    name: 'Touchdown Trio',
    shortName: 'Touchdown Trio',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'NFL series - Marquee cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'NFL triple game experience.',
    hasCalculator: false
  },
  {
    id: 'triple-score',
    name: 'Triple Score',
    shortName: 'Triple Score',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'NFL series - Mars Portrait cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'NFL football scoring theme.',
    hasCalculator: false
  },
  {
    id: 'overtime-cash',
    name: 'Overtime Cash',
    shortName: 'Overtime Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'NFL high-denom 3-reel with Interception feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'NFL license. Marquis cabinet. Extra credit activates Interception Feature.',
    hasCalculator: false
  },
  {
    id: 'buffalo-gold-cash-collection',
    name: 'Buffalo Gold Cash Collection',
    shortName: 'Buffalo Gold CC',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'Buffalo Gold on Baron cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Buffalo Gold on new Baron dual-screen cabinet.',
    hasCalculator: false
  },
  {
    id: 'ju-cai-jin-gui',
    name: 'Ju Cai Jin Gui',
    shortName: 'Ju Cai Jin Gui',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'Asian prosperity theme - Baron cabinet launch',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese fortune theme. Baron cabinet debut.',
    hasCalculator: false
  },
  {
    id: 'phantom-2025',
    name: 'Phantom',
    shortName: 'Phantom 2025',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2025,
    quickId: 'Phantom of the Opera - new 2025 version',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: '16 years after 2009 version. G2E 2024 and ICE 2025 debut.',
    hasCalculator: false
  },
  {
    id: 'whisker-wheels',
    name: 'Whisker Wheels',
    shortName: 'Whisker Wheels',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2024,
    quickId: 'Cat-themed wheel bonus game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular cat theme with wheel feature.',
    hasCalculator: false
  },
  {
    id: 'buffalo-strike',
    name: 'Buffalo Strike!',
    shortName: 'Buffalo Strike',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2023,
    quickId: 'Buffalo on MarsX Flex cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Buffalo theme on 55-inch top monitor MarsX Flex.',
    hasCalculator: false
  },
  {
    id: 'fu-dai-lian-lian-turtle',
    name: 'Fu Dai Lian Lian Turtle',
    shortName: 'FDLL Turtle',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2023,
    quickId: 'Fu Dai Lian Lian turtle theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Turtle-themed Fu Dai Lian Lian variant.',
    hasCalculator: false
  },

  // IGT 2024-2025 NEW RELEASES
  {
    id: 'wheel-of-fortune-cash-link-big-money',
    name: 'Wheel of Fortune Cash Link Big Money',
    shortName: 'WoF CL Big Money',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: 'WoF Trio cabinet - physical wheel across 3 cabinets',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'G2E 2024 debut. Large physical wheel spans three cabinets.',
    hasCalculator: false
  },
  {
    id: 'wheel-of-fortune-cash-link-reels-dd',
    name: 'Wheel of Fortune Cash Link Reels Double Diamond',
    shortName: 'WoF CL DD',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: 'First stepper Cash Link - DiamondRS Wheel cabinet',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines WoF, Cash Link, and Double Diamond. Ultra Link series.',
    hasCalculator: false
  },
  {
    id: 'pirate-link-drakes-treasure',
    name: 'Pirate Link: Drake\'s Treasure',
    shortName: 'Pirate Link Drake',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: 'Pirate adventure with treasure hunting',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pirate theme with progressive jackpots.',
    hasCalculator: false
  },
  {
    id: 'mystery-of-the-lamp',
    name: 'Mystery of the Lamp',
    shortName: 'Mystery Lamp',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: 'Magical lamp theme - expanding wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Aladdin-style magical theme.',
    hasCalculator: false
  },
  {
    id: 'red-hot-tamales-pinata',
    name: 'Red Hot Tamales! Piñata Bash',
    shortName: 'Red Hot Pinata',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2024,
    quickId: 'Mexican theme - interactive piñata bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Bash the piñata for credits and jackpots.',
    hasCalculator: false
  },
  {
    id: 'double-diamond-3x4x5',
    name: 'Double Diamond 3x4x5',
    shortName: 'DD 3x4x5',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Double Diamond with up to 20x multipliers',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced multiplier version of classic.',
    hasCalculator: false
  },
  {
    id: 'pyramidion',
    name: 'Pyramidion',
    shortName: 'Pyramidion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Egyptian pyramid theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Modern Egyptian theme slot.',
    hasCalculator: false
  },
  {
    id: 'pixies-of-the-forest-2',
    name: 'Pixies of the Forest II',
    shortName: 'Pixies 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2023,
    quickId: 'Sequel to enchanted forest classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pixies return with enhanced features.',
    hasCalculator: false
  },

  // LIGHT & WONDER 2024-2025 NEW RELEASES
  {
    id: 'quick-hit-link',
    name: 'Quick Hit Link',
    shortName: 'Quick Hit Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Quick Hit with linked jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic Quick Hit with progressive link.',
    hasCalculator: false
  },
  {
    id: 'shenlong-unleashed',
    name: 'Shenlong Unleashed',
    shortName: 'Shenlong',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Chinese dragon unleashed theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon theme with unleashed feature.',
    hasCalculator: false
  },
  {
    id: 'cash-falls-pirates-trove',
    name: 'Cash Falls: Pirate\'s Trove',
    shortName: 'CF Pirates Trove',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Pirate theme - 21,025x max win',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Highest max win in Cash Falls series.',
    hasCalculator: false
  },
  {
    id: 'cash-falls-island-bounty',
    name: 'Cash Falls: Island Bounty',
    shortName: 'CF Island Bounty',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2024,
    quickId: 'Tropical island theme - 21,025x max',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Island treasure hunting theme.',
    hasCalculator: false
  },
  {
    id: 'add-em-up-gold',
    name: 'Add Em Up Gold',
    shortName: 'Add Em Up Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Add up symbols for prizes - gold theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latest Cash Falls series game.',
    hasCalculator: false
  },
  {
    id: 'ufl-cash-falls-glacier-gold',
    name: 'Ultimate Fire Link Cash Falls: Glacier Gold',
    shortName: 'UFL CF Glacier',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2025,
    quickId: 'Fire Link meets Cash Falls - ice theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Combines Fire Link and Cash Falls mechanics.',
    hasCalculator: false
  },

  // KONAMI 2024-2025 NEW RELEASES
  {
    id: 'money-in-bank-gold',
    name: 'Money in the Bank Gold',
    shortName: 'MITB Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2024,
    quickId: 'Gold-themed Money in the Bank',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Premium version of Money in the Bank series.',
    hasCalculator: false
  },
  {
    id: 'solstice-celebration-link',
    name: 'Solstice Celebration Link',
    shortName: 'Solstice Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2024,
    quickId: 'Nature solstice theme with linked jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Solstice theme on Solstice 49C cabinet.',
    hasCalculator: false
  },
  {
    id: 'all-aboard-dynamite-dash',
    name: 'All Aboard Dynamite Dash',
    shortName: 'All Aboard DD',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2024,
    quickId: 'Train theme with dynamite feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'All Aboard series with explosive feature.',
    hasCalculator: false
  },
  {
    id: 'fu-gui-rong-hua',
    name: 'Fu Gui Rong Hua',
    shortName: 'Fu Gui Rong Hua',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2024,
    quickId: 'Chinese wealth and prosperity theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Asian fortune theme.',
    hasCalculator: false
  },

  // AGS 2024-2025 NEW RELEASES
  {
    id: 'rakin-bacon-deluxe',
    name: 'Rakin\' Bacon Deluxe',
    shortName: 'Rakin Bacon DX',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2024,
    quickId: 'Enhanced Rakin Bacon with more features',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Deluxe version with upgraded bonuses.',
    hasCalculator: false
  },
  {
    id: 'super-wheel-blast',
    name: 'Super Wheel Blast',
    shortName: 'Super Wheel Blast',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2024,
    quickId: 'Wheel bonus with explosive wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Powerful wheel bonus feature.',
    hasCalculator: false
  },
  {
    id: 'golden-wins-infinity',
    name: 'Golden Wins Infinity',
    shortName: 'Golden Wins Inf',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2024,
    quickId: 'Infinite golden wins potential',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Expanded Golden Wins with infinite feature.',
    hasCalculator: false
  },

  // EVERI 2024-2025 NEW RELEASES (merged with IGT)
  {
    id: 'player-epic',
    name: 'Player Epic',
    shortName: 'Player Epic',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2024,
    quickId: 'Epic player wins theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Premium Everi release.',
    hasCalculator: false
  },
  {
    id: 'smokin-hot-jackpots',
    name: 'Smokin\' Hot Jackpots',
    shortName: 'Smokin Hot JP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2024,
    quickId: 'Hot smoking jackpot theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire and smoke jackpot theme.',
    hasCalculator: false
  },
  {
    id: 'cash-machine-link',
    name: 'Cash Machine Link',
    shortName: 'Cash Machine Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2024,
    quickId: 'Cash Machine with linked jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cash Machine series with progressive link.',
    hasCalculator: false
  },

  // =============================================
  // CONFIRMED VEGAS FLOOR GAMES - MISSING ADDITIONS
  // =============================================

  // COIN COMBO SERIES (Popular Hold & Spin)
  {
    id: 'coin-combo-marvelous-mouse',
    name: 'Coin Combo: Marvelous Mouse',
    shortName: 'CC Marvelous Mouse',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Mouse theme - coin collection Hold & Spin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Coin Combo series. Hold & Spin mechanic.',
    hasCalculator: false
  },
  {
    id: 'coin-combo-sahara-gold',
    name: 'Coin Combo: Sahara Gold',
    shortName: 'CC Sahara Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2022,
    quickId: 'Desert theme Coin Combo',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Desert treasure Hold & Spin.',
    hasCalculator: false
  },
  {
    id: 'coin-combo-copa-cash',
    name: 'Coin Combo: Copa Cash',
    shortName: 'CC Copa Cash',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2023,
    quickId: 'Latin theme Coin Combo',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Latin celebration theme.',
    hasCalculator: false
  },

  // PINBALL (High-limit classic)
  {
    id: 'pinball',
    name: 'Pinball',
    shortName: 'Pinball',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2004,
    quickId: 'High-limit classic with pinball bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High-limit favorite. Pinball machine bonus game.',
    hasCalculator: false
  },
  {
    id: 'pinball-double-gold',
    name: 'Pinball Double Gold',
    shortName: 'Pinball Dbl Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2010,
    quickId: 'Gold-themed Pinball variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Pinball with gold theme.',
    hasCalculator: false
  },

  // MORE ALL ABOARD VARIANTS (Confirmed popular)
  {
    id: 'all-aboard-piggy-pennies',
    name: 'All Aboard: Piggy Pennies',
    shortName: 'All Aboard Piggy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: 'Pig theme train game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Piggy bank meets train theme.',
    hasCalculator: false
  },
  {
    id: 'all-aboard-gold-express',
    name: 'All Aboard: Gold Express',
    shortName: 'All Aboard Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Gold train express theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden train express.',
    hasCalculator: false
  },

  // MORE DOLLAR STORM (Confirmed on floors)
  {
    id: 'dollar-storm-ninja-moon',
    name: 'Dollar Storm: Ninja Moon',
    shortName: 'DS Ninja Moon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Ninja theme Dollar Storm',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ninja theme with Dollar Storm mechanics.',
    hasCalculator: false
  },
  {
    id: 'dollar-storm-caribbean-gold',
    name: 'Dollar Storm: Caribbean Gold',
    shortName: 'DS Caribbean',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Caribbean pirate Dollar Storm',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Caribbean pirate treasure theme.',
    hasCalculator: false
  },
  {
    id: 'dollar-storm-egyptian-jewels',
    name: 'Dollar Storm: Egyptian Jewels',
    shortName: 'DS Egyptian',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Egyptian theme Dollar Storm',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Egyptian jewels theme.',
    hasCalculator: false
  },

  // MORE CASH EXPRESS (Confirmed Hold & Spin family)
  {
    id: 'cash-express-luxury-line',
    name: 'Cash Express: Luxury Line',
    shortName: 'CE Luxury Line',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Luxury train theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Premium luxury train experience.',
    hasCalculator: false
  },
  {
    id: 'cash-express-gold-class',
    name: 'Cash Express: Gold Class',
    shortName: 'CE Gold Class',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'First class gold train',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold class train experience.',
    hasCalculator: false
  },

  // JIN JI BAO XI (Mentioned as Dragon Link alternative)
  {
    id: 'jin-ji-bao-xi',
    name: 'Jin Ji Bao Xi',
    shortName: 'Jin Ji Bao Xi',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Golden rooster prosperity - Dragon Link competitor',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Similar to Dragon Link. Chinese prosperity theme.',
    hasCalculator: false
  },
  {
    id: 'jin-ji-bao-xi-rising',
    name: 'Jin Ji Bao Xi: Rising Fortunes',
    shortName: 'JJBX Rising',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2021,
    quickId: 'Rising fortunes variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Jin Ji Bao Xi.',
    hasCalculator: false
  },

  // MORE PLANET MOOLAH (Confirmed penny slot favorite)
  {
    id: 'planet-moolah',
    name: 'Planet Moolah',
    shortName: 'Planet Moolah',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2012,
    quickId: 'Alien cow invasion - cascading reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Iconic cascading reels with alien cows.',
    hasCalculator: false
  },

  // MORE MONOPOLY (Confirmed penny slot favorite)
  {
    id: 'monopoly-big-money-reel',
    name: 'Monopoly Big Money Reel',
    shortName: 'Monopoly Big Money',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2020,
    quickId: 'Big wheel Monopoly',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Large wheel bonus Monopoly.',
    hasCalculator: false
  },
  {
    id: 'monopoly-hot-shot',
    name: 'Monopoly Hot Shot',
    shortName: 'Monopoly Hot Shot',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2019,
    quickId: 'Hot Shot series Monopoly',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Monopoly with Hot Shot mechanics.',
    hasCalculator: false
  },
  {
    id: 'monopoly-party-train',
    name: 'Monopoly Party Train',
    shortName: 'Monopoly Train',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2015,
    quickId: 'Train themed Monopoly',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Monopoly railroad theme.',
    hasCalculator: false
  },

  // TARZAN (Mentioned at Downtown Grand)
  {
    id: 'tarzan-lord-jungle',
    name: 'Tarzan: Lord of the Jungle',
    shortName: 'Tarzan Lord',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'King of jungle Tarzan',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Tarzan rules the jungle.',
    hasCalculator: false
  },

  // VEGAS FLOOR CONFIRMED ADDITIONS

  {
    id: 'da-vinci-diamonds-dual',
    name: 'Da Vinci Diamonds Dual Play',
    shortName: 'Da Vinci Dual',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Enhanced Da Vinci with dual reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Two reel sets for double the action.',
    hasCalculator: false
  },
  {
    id: 'kingpin-bowling',
    name: 'Kingpin Bowling',
    shortName: 'Kingpin Bowling',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2012,
    quickId: 'Bowling alley theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Bowling strike bonus game.',
    hasCalculator: false
  },


  {
    id: '100-pandas',
    name: '100 Pandas',
    shortName: '100 Pandas',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: '100 paylines panda theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cute panda bears with 100 paylines.',
    hasCalculator: false
  },
  {
    id: 'wild-bear-paws',
    name: 'Wild Bear Paws',
    shortName: 'Wild Bear Paws',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2016,
    quickId: 'Bear claw stacked wilds',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Bear theme with stacked wilds.',
    hasCalculator: false
  },
  {
    id: 'day-of-the-dead',
    name: 'Day of the Dead',
    shortName: 'Day of the Dead',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2015,
    quickId: 'Mexican Dia de los Muertos - hexagonal reels',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Unique hexagonal 3-4-5 reels layout.',
    hasCalculator: false
  },
  {
    id: 'plants-vs-zombies',
    name: 'Plants vs Zombies',
    shortName: 'Plants vs Zombies',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2018,
    quickId: 'PopCap video game license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Based on popular mobile game.',
    hasCalculator: false
  },
  {
    id: 'game-of-gods',
    name: 'Game of the Gods',
    shortName: 'Game of Gods',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2014,
    quickId: 'Greek gods mythology',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Greek mythology gods theme.',
    hasCalculator: false
  },
  {
    id: 'sizzling-7',
    name: 'Sizzling 7',
    shortName: 'Sizzling 7',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 1998,
    quickId: 'Hot sevens classic slot',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Classic hot 7s theme.',
    hasCalculator: false
  },
  {
    id: 'star-trek-against-all-odds',
    name: 'Star Trek: Against All Odds',
    shortName: 'Star Trek AAO',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2013,
    quickId: 'Original Star Trek series',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Kirk, Spock, Enterprise theme.',
    hasCalculator: false
  },
  {
    id: 'elvis-little-more-action',
    name: 'Elvis: A Little More Action',
    shortName: 'Elvis Action',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2006,
    quickId: 'Elvis Presley music theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'The King of Rock and Roll.',
    hasCalculator: false
  },
  {
    id: 'scarab',
    name: 'Scarab',
    shortName: 'Scarab',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2017,
    quickId: 'Egyptian scarab beetle',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Egyptian beetle riches.',
    hasCalculator: false
  },
  {
    id: 'scarab-grand',
    name: 'Scarab Grand',
    shortName: 'Scarab Grand',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'IGT',
    releaseYear: 2019,
    quickId: 'Enhanced Scarab with progressives',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Grand version with bigger jackpots.',
    hasCalculator: false
  },

  // === ARISTOCRAT CATALOG EXPANSION ===
  {
    id: 'lets-go-fishing',
    name: 'Let\'s Go Fish\'n',
    shortName: 'Lets Go Fishn',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2012,
    quickId: 'Fishing reel bonus game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cast your line fishing bonus.',
    hasCalculator: false
  },
  {
    id: 'big-fish',
    name: 'Big Fish',
    shortName: 'Big Fish',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Big catch fishing theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Land the big fish for big wins.',
    hasCalculator: false
  },
  {
    id: 'fire-light',
    name: 'Fire Light',
    shortName: 'Fire Light',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2013,
    quickId: 'Phoenix firebird theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Firebird rising from flames.',
    hasCalculator: false
  },
  {
    id: 'fire-light-2',
    name: 'Fire Light II',
    shortName: 'Fire Light 2',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Enhanced firebird sequel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sequel with more features.',
    hasCalculator: false
  },
  {
    id: 'red-baron',
    name: 'Red Baron',
    shortName: 'Red Baron',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2010,
    quickId: 'WWI flying ace biplane',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'WWI dogfight aerial combat.',
    hasCalculator: false
  },

  {
    id: 'moon-maiden',
    name: 'Moon Maiden',
    shortName: 'Moon Maiden',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2014,
    quickId: 'Mystical moon goddess',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Moon goddess stacked wilds.',
    hasCalculator: false
  },
  {
    id: 'fortune-king',
    name: 'Fortune King',
    shortName: 'Fortune King',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2015,
    quickId: 'Chinese fortune king',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Chinese wealth god.',
    hasCalculator: false
  },
  {
    id: 'fortune-king-gold',
    name: 'Fortune King Gold',
    shortName: 'Fortune King Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Gold enhanced Fortune King',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced gold version.',
    hasCalculator: false
  },
  {
    id: 'player-piano',
    name: 'Player Piano',
    shortName: 'Player Piano',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2016,
    quickId: 'Old west saloon piano',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wild west saloon theme.',
    hasCalculator: false
  },
  {
    id: 'panda-panda',
    name: 'Panda Panda',
    shortName: 'Panda Panda',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Playful panda bears',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Cute panda antics.',
    hasCalculator: false
  },
  {
    id: 'wonder-4-spinning-fortunes',
    name: 'Wonder 4 Spinning Fortunes',
    shortName: 'W4 Spinning',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Wonder 4 with wheel bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wheel bonus on Wonder 4.',
    hasCalculator: false
  },
  {
    id: 'wonder-4-stars',
    name: 'Wonder 4 Stars',
    shortName: 'W4 Stars',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Star-themed Wonder 4',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Stellar Wonder 4 variant.',
    hasCalculator: false
  },

  {
    id: 'lightning-cash-high-stakes',
    name: 'Lightning Cash: High Stakes',
    shortName: 'LC High Stakes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'High denomination Lightning Cash',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High-limit Lightning Cash.',
    hasCalculator: false
  },
  {
    id: 'lightning-cash-magic-pearl',
    name: 'Lightning Cash: Magic Pearl',
    shortName: 'LC Magic Pearl',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Pearl theme Lightning Cash',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Ocean pearl theme.',
    hasCalculator: false
  },
  {
    id: 'mighty-cash-double-up',
    name: 'Mighty Cash Double Up',
    shortName: 'MC Double Up',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2020,
    quickId: 'Double your Mighty Cash wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Double up feature on Mighty Cash.',
    hasCalculator: false
  },
  {
    id: 'mighty-cash-big-money',
    name: 'Mighty Cash Big Money',
    shortName: 'MC Big Money',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Larger jackpots Mighty Cash',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced jackpot version.',
    hasCalculator: false
  },

  {
    id: 'dragon-cash-gold-dragon',
    name: 'Dragon Cash: Gold Dragon',
    shortName: 'DC Gold Dragon',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2022,
    quickId: 'Golden dragon variant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Gold dragon theme.',
    hasCalculator: false
  },
  {
    id: 'quick-fire-jackpots',
    name: 'Quick Fire Jackpots',
    shortName: 'Quick Fire JP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Fast hitting jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Quick hitting jackpot system.',
    hasCalculator: false
  },





  // === KONAMI CATALOG EXPANSION ===
  
  {
    id: 'china-shores-great-stacks',
    name: 'China Shores: Great Stacks',
    shortName: 'China Shores GS',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Stacked symbols China Shores',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Great Stacks feature added.',
    hasCalculator: false
  },

  {
    id: 'lion-carnival',
    name: 'Lion Carnival',
    shortName: 'Lion Carnival',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Carnival lion theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Festive lion carnival.',
    hasCalculator: false
  },
  {
    id: 'charms-link',
    name: 'Charms Link',
    shortName: 'Charms Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Lucky charms link feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lucky charms collection.',
    hasCalculator: false
  },
  {
    id: 'charms-link-golden-princess',
    name: 'Charms Link: Golden Princess',
    shortName: 'Charms Link GP',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2020,
    quickId: 'Princess themed Charms Link',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Princess charms theme.',
    hasCalculator: false
  },
  {
    id: 'treasure-trove',
    name: 'Treasure Trove',
    shortName: 'Treasure Trove',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Pirate treasure collection',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pirate treasure hunting.',
    hasCalculator: false
  },
  {
    id: 'star-watch-fire',
    name: 'Star Watch Fire',
    shortName: 'Star Watch Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2020,
    quickId: 'Fire version Star Watch',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire themed stargazing.',
    hasCalculator: false
  },
  {
    id: 'dragon-celebration',
    name: 'Dragon Celebration',
    shortName: 'Dragon Celebration',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Dragon festival celebration',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon festival theme.',
    hasCalculator: false
  },
  {
    id: 'wild-stallion',
    name: 'Wild Stallion',
    shortName: 'Wild Stallion',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2016,
    quickId: 'Wild horse running free',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mustang horse theme.',
    hasCalculator: false
  },
  {
    id: 'wealth-dynasty',
    name: 'Wealth Dynasty',
    shortName: 'Wealth Dynasty',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Chinese wealth dynasty',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Imperial wealth theme.',
    hasCalculator: false
  },
  {
    id: 'enchanted-gardens',
    name: 'Enchanted Gardens',
    shortName: 'Enchanted Gardens',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2017,
    quickId: 'Magical garden theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Beautiful enchanted garden.',
    hasCalculator: false
  },
  {
    id: 'golden-wolves-grand',
    name: 'Golden Wolves Grand',
    shortName: 'Golden Wolves Gr',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2021,
    quickId: 'Grand version golden wolves',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced wolf pack game.',
    hasCalculator: false
  },
  {
    id: 'sparkling-roses',
    name: 'Sparkling Roses',
    shortName: 'Sparkling Roses',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2018,
    quickId: 'Romantic roses theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Romance and roses.',
    hasCalculator: false
  },
  {
    id: 'solstice-fortune',
    name: 'Solstice Fortune',
    shortName: 'Solstice Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2022,
    quickId: 'Nature solstice fortune',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Solstice nature theme.',
    hasCalculator: false
  },

  // === AGS CATALOG EXPANSION ===
  {
    id: 'bonanza-blast',
    name: 'Bonanza Blast',
    shortName: 'Bonanza Blast',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Mining bonanza explosion',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Mining dynamite theme.',
    hasCalculator: false
  },
  {
    id: 'bonanza-blast-double-gold',
    name: 'Bonanza Blast: Double Gold',
    shortName: 'BB Double Gold',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Gold themed Bonanza Blast',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Double the gold mining.',
    hasCalculator: false
  },
  {
    id: 'golden-wins-deluxe',
    name: 'Golden Wins Deluxe',
    shortName: 'Golden Wins DX',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Deluxe golden wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Golden Wins.',
    hasCalculator: false
  },
  {
    id: 'colossal-diamonds-wild',
    name: 'Colossal Diamonds: Wild',
    shortName: 'Colossal Wild',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Wild diamonds colossal',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wild expanding diamonds.',
    hasCalculator: false
  },
  {
    id: 'xtreme-jackpots-blazing',
    name: 'Xtreme Jackpots: Blazing',
    shortName: 'Xtreme Blazing',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Blazing hot Xtreme Jackpots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire themed Xtreme.',
    hasCalculator: false
  },
  {
    id: 'xtreme-jackpots-lucky-tiger',
    name: 'Xtreme Jackpots: Lucky Tiger',
    shortName: 'Xtreme Tiger',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Tiger themed Xtreme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lucky tiger theme.',
    hasCalculator: false
  },
  {
    id: 'fu-nan-fu-nu-boost',
    name: 'Fu Nan Fu Nu Boost',
    shortName: 'FNFN Boost',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2022,
    quickId: 'Boosted Fu Nan Fu Nu',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Boost feature added.',
    hasCalculator: false
  },
  {
    id: 'lucky-rising-phoenix',
    name: 'Lucky Rising Phoenix',
    shortName: 'Lucky Phoenix',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2020,
    quickId: 'Phoenix rising lucky',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Lucky phoenix theme.',
    hasCalculator: false
  },
  {
    id: 'jade-wins-link',
    name: 'Jade Wins Link',
    shortName: 'Jade Wins Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2021,
    quickId: 'Linked jade wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Jade link feature.',
    hasCalculator: false
  },
  {
    id: 'golden-spins',
    name: 'Golden Spins',
    shortName: 'Golden Spins',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'AGS',
    releaseYear: 2019,
    quickId: 'Golden free spins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden wheel spins.',
    hasCalculator: false
  },

  // === EVERI CATALOG EXPANSION ===
  {
    id: 'cash-machine-emerald',
    name: 'Cash Machine Emerald',
    shortName: 'CM Emerald',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Emerald theme Cash Machine',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Green emerald theme.',
    hasCalculator: false
  },
  {
    id: 'cash-machine-diamond',
    name: 'Cash Machine Diamond',
    shortName: 'CM Diamond',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Diamond theme Cash Machine',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Sparkling diamond theme.',
    hasCalculator: false
  },
  {
    id: 'jackpot-streams-fire',
    name: 'Jackpot Streams: Fire',
    shortName: 'JP Streams Fire',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Fire themed jackpot streams',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Flaming jackpot streams.',
    hasCalculator: false
  },
  {
    id: 'jackpot-streams-ice',
    name: 'Jackpot Streams: Ice',
    shortName: 'JP Streams Ice',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Ice themed jackpot streams',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Frozen ice jackpots.',
    hasCalculator: false
  },
  {
    id: 'money-rain-deluxe',
    name: 'Money Rain Deluxe',
    shortName: 'Money Rain DX',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Deluxe money rain',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced money rain.',
    hasCalculator: false
  },
  {
    id: 'cash-cove-pirate',
    name: 'Cash Cove: Pirate',
    shortName: 'Cash Cove Pirate',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2020,
    quickId: 'Pirate treasure cove',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Pirate treasure hunting.',
    hasCalculator: false
  },
  {
    id: 'player-classic-gold',
    name: 'Player Classic Gold',
    shortName: 'Player Classic G',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2021,
    quickId: 'Gold version Player Classic',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Golden classic player.',
    hasCalculator: false
  },
  {
    id: 'triple-cash-spin',
    name: 'Triple Cash Spin',
    shortName: 'Triple Cash Spin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Everi',
    releaseYear: 2019,
    quickId: 'Triple spinning cash wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Three wheel bonus.',
    hasCalculator: false
  },

  // === AINSWORTH CATALOG EXPANSION ===
  
  {
    id: 'rumble-rumble',
    name: 'Rumble Rumble',
    shortName: 'Rumble Rumble',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2015,
    quickId: 'Thunder rumbling theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Thundering action.',
    hasCalculator: false
  },
  {
    id: 'royal-elephant',
    name: 'Royal Elephant',
    shortName: 'Royal Elephant',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2016,
    quickId: 'Majestic royal elephant',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Indian royal elephant.',
    hasCalculator: false
  },
  {
    id: 'big-thunder',
    name: 'Big Thunder',
    shortName: 'Big Thunder',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2017,
    quickId: 'Thunder storm theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Big thunderstorm.',
    hasCalculator: false
  },
  {
    id: 'fortune-star',
    name: 'Fortune Star',
    shortName: 'Fortune Star',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2018,
    quickId: 'Lucky fortune star',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Star of fortune.',
    hasCalculator: false
  },
  {
    id: 'golden-streak',
    name: 'Golden Streak',
    shortName: 'Golden Streak',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2019,
    quickId: 'Winning golden streak',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Hot streak of gold.',
    hasCalculator: false
  },
  {
    id: 'jiulong-baohu',
    name: 'Jiulong Baohu',
    shortName: 'Jiulong Baohu',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2020,
    quickId: 'Nine dragons treasure',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Nine dragon protector.',
    hasCalculator: false
  },
  {
    id: 'flying-horse',
    name: 'Flying Horse',
    shortName: 'Flying Horse',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2017,
    quickId: 'Pegasus flying horse',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Winged horse theme.',
    hasCalculator: false
  },
  {
    id: 'multi-extreme',
    name: 'Multi Extreme',
    shortName: 'Multi Extreme',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2019,
    quickId: 'Extreme multi-game',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Multiple games extreme.',
    hasCalculator: false
  },
  {
    id: 'golden-fortune',
    name: 'Golden Fortune',
    shortName: 'Golden Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Ainsworth',
    releaseYear: 2020,
    quickId: 'Golden good fortune',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fortune of gold.',
    hasCalculator: false
  },

  // === WMS CATALOG EXPANSION ===
  
  {
    id: 'raging-rhino-rampage',
    name: 'Raging Rhino Rampage',
    shortName: 'RR Rampage',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2020,
    quickId: 'Enhanced rampage rhino',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Rampage bonus feature.',
    hasCalculator: false
  },

  {
    id: 'kronos-unleashed',
    name: 'Kronos Unleashed',
    shortName: 'Kronos Unleashed',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2017,
    quickId: 'Kronos freed from chains',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Unleashed titan power.',
    hasCalculator: false
  },

  {
    id: 'zeus-ii',
    name: 'Zeus II',
    shortName: 'Zeus II',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Sequel to Zeus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced Zeus features.',
    hasCalculator: false
  },

  {
    id: 'zeus-1000',
    name: 'Zeus 1000',
    shortName: 'Zeus 1000',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2017,
    quickId: 'Zeus with 1000 ways',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: '1000 ways to win Zeus.',
    hasCalculator: false
  },
  {
    id: 'colossal-reels',
    name: 'Colossal Reels',
    shortName: 'Colossal Reels',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Giant reel mechanic pioneer',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'First colossal reels system.',
    hasCalculator: false
  },


  {
    id: 'montezuma',
    name: 'Montezuma',
    shortName: 'Montezuma',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Aztec emperor theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Aztec emperor Montezuma.',
    hasCalculator: false
  },
  {
    id: 'nascar',
    name: 'NASCAR',
    shortName: 'NASCAR',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2012,
    quickId: 'Stock car racing',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'NASCAR racing license.',
    hasCalculator: false
  },
  {
    id: 'super-monopoly-money',
    name: 'Super Monopoly Money',
    shortName: 'Super Monopoly',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2014,
    quickId: 'Enhanced Monopoly with wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Super wheel bonus.',
    hasCalculator: false
  },
  {
    id: 'fire-queen',
    name: 'Fire Queen',
    shortName: 'Fire Queen',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'WMS',
    releaseYear: 2013,
    quickId: 'Fiery queen theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fire queen royalty.',
    hasCalculator: false
  },

  // === BALLY CATALOG EXPANSION ===,

  {
    id: 'quick-hit-cash-wheel',
    name: 'Quick Hit Cash Wheel',
    shortName: 'QH Cash Wheel',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2019,
    quickId: 'Quick Hit with cash wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wheel bonus on Quick Hit.',
    hasCalculator: false
  },
  {
    id: 'playboy',
    name: 'Playboy',
    shortName: 'Playboy',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2012,
    quickId: 'Playboy magazine license',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Playboy bunny theme.',
    hasCalculator: false
  },
  {
    id: 'moon-goddess',
    name: 'Moon Goddess',
    shortName: 'Moon Goddess',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2014,
    quickId: 'Lunar goddess theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Moon goddess mythology.',
    hasCalculator: false
  },
  {
    id: 'dragon-emperor',
    name: 'Dragon Emperor',
    shortName: 'Dragon Emperor',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Bally',
    releaseYear: 2015,
    quickId: 'Chinese dragon emperor',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Dragon emperor theme.',
    hasCalculator: false
  },

  // === INCREDIBLE TECHNOLOGIES EXPANSION ===
  {
    id: 'crazy-money-deluxe',
    name: 'Crazy Money Deluxe',
    shortName: 'Crazy Money DX',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2018,
    quickId: 'Deluxe crazy money',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced crazy money.',
    hasCalculator: false
  },
  {
    id: 'money-wheel',
    name: 'Money Wheel',
    shortName: 'Money Wheel',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2017,
    quickId: 'Giant money wheel',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Wheel of money.',
    hasCalculator: false
  },
  {
    id: 'money-madness',
    name: 'Money Madness',
    shortName: 'Money Madness',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2019,
    quickId: 'Mad for money',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Money madness theme.',
    hasCalculator: false
  },
  {
    id: 'golden-coins',
    name: 'Golden Coins',
    shortName: 'Golden Coins',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2018,
    quickId: 'Golden coin collection',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Collect golden coins.',
    hasCalculator: false
  },
  {
    id: 'triple-fortune',
    name: 'Triple Fortune',
    shortName: 'Triple Fortune',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Incredible Technologies',
    releaseYear: 2019,
    quickId: 'Triple fortune wins',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Three times fortune.',
    hasCalculator: false
  },
  // Additional machines to reach 777
  {
    id: 'panda-magic',
    name: 'Panda Magic',
    shortName: 'Panda Magic',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2017,
    quickId: 'Panda theme with hold & spin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Aristocrat game with panda theme.',
    hasCalculator: false
  },
  {
    id: 'gold-stacks-88',
    name: 'Gold Stacks 88',
    shortName: 'Gold Stacks 88',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'Gold theme with 88 feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Asian-themed with stacking wilds.',
    hasCalculator: false
  },
  {
    id: 'rising-fortunes',
    name: 'Rising Fortunes',
    shortName: 'Rising Fortunes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Golden reels ascending feature',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Fortune-themed with rising jackpots.',
    hasCalculator: false
  },
  {
    id: 'lucky-buddha',
    name: 'Lucky Buddha',
    shortName: 'Lucky Buddha',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2016,
    quickId: 'Buddha statue with orbs',
    thresholdSummary: 'Play when 4+ orbs collected',
    threshold: {
      conservative: 'Look for 5+ orbs banked',
      aggressive: '4+ orbs can be worth a shot'
    },
    visual: {
      location: 'Orb count above reels',
      appearance: [
        { label: 'Orbs', text: 'Golden orbs collect near Buddha', highlight: true },
        { label: 'Trigger', text: '8 orbs triggers feature' }
      ]
    },
    notes: 'Similar to Lucky Wealth Cat mechanics.',
    hasCalculator: false
  },
  {
    id: 'golden-century',
    name: 'Dragon Link: Golden Century',
    shortName: 'Golden Century',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'Aristocrat',
    releaseYear: 2019,
    quickId: 'Dragon Link with golden coins',
    thresholdSummary: 'Check orb/coin count',
    threshold: {
      conservative: 'Look for 5+ coins banked',
      aggressive: '4+ coins may be worth playing'
    },
    visual: {
      location: 'Coin counter on screen',
      appearance: [
        { label: 'Coins', text: 'Golden coins stack during play', highlight: true },
        { label: 'Trigger', text: 'Fill meter for bonus' }
      ]
    },
    notes: 'Dragon Link variant with Golden Century theme.',
    hasCalculator: false
  },
  {
    id: 'epic-fortunes',
    name: 'Epic Fortunes',
    shortName: 'Epic Fortunes',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2020,
    quickId: 'Epic hero theme slots',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Adventure-themed Konami game.',
    hasCalculator: false
  },
  {
    id: 'quick-spin',
    name: 'Quick Spin',
    shortName: 'Quick Spin',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Fast-paced spinning action',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'High-speed gameplay option.',
    hasCalculator: false
  },
  {
    id: 'fu-dai-lian-lian',
    name: 'Fu Dai Lian Lian',
    shortName: 'Fu Dai Lian Lian',
    category: 'persistent-state',
    tier: 2,
    manufacturer: 'IGT',
    releaseYear: 2020,
    quickId: 'Red bags with gold coins',
    thresholdSummary: 'Look for filled red bags',
    threshold: {
      conservative: '3+ bags filled',
      aggressive: '2+ bags with good denomination'
    },
    visual: {
      location: 'Red bag meters on top screen',
      appearance: [
        { label: 'Bags', text: 'Red bags fill with gold coins', highlight: true },
        { label: 'Bonus', text: 'Full bags trigger feature' }
      ]
    },
    notes: 'Similar to Dancing Drums mechanics.',
    hasCalculator: false
  },
  {
    id: 'ultimate-firelink',
    name: 'Ultimate Fire Link',
    shortName: 'Ultimate Fire Link',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Light & Wonder',
    releaseYear: 2018,
    quickId: 'Fire Link hold and spin',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Popular Fire Link series entry.',
    hasCalculator: false
  },
  {
    id: 'more-more-chilli',
    name: 'More More Chilli',
    shortName: 'More More Chilli',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2021,
    quickId: 'Sequel to More Chilli',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Enhanced version of More Chilli.',
    hasCalculator: false
  },
  {
    id: 'all-aboard',
    name: 'All Aboard',
    shortName: 'All Aboard',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Konami',
    releaseYear: 2019,
    quickId: 'Train theme with pick bonus',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Train-themed Konami game.',
    hasCalculator: false
  },
  {
    id: 'can-can-de-paris',
    name: 'Can Can de Paris',
    shortName: 'Can Can de Paris',
    category: 'entertainment',
    tier: 3,
    manufacturer: 'Aristocrat',
    releaseYear: 2018,
    quickId: 'French dancer theme',
    thresholdSummary: 'NO ADVANTAGE PLAY',
    notes: 'Parisian-themed Aristocrat slot.',
    hasCalculator: false
  }
];

export { machineCategories, machines };
