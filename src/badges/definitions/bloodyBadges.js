// Bloody Mary badge definitions

// Strip casino IDs for Strip Crawler badge
export const STRIP_CASINO_IDS = [
  'bellagio', 'aria', 'cosmopolitan', 'venetian', 'palazzo', 'wynn', 'encore',
  'mgm-grand', 'mandalay-bay', 'luxor', 'excalibur', 'new-york-new-york', 'park-mgm',
  'caesars-palace', 'paris', 'ballys', 'flamingo', 'linq', 'harrahs',
  'treasure-island', 'mirage', 'circus-circus', 'sahara', 'resorts-world',
  'tropicana', 'planet-hollywood'
];

// Badge definitions with criteria
export const BLOODY_BADGES = [
  // Milestones
  { id: 'first-blood', name: 'First Blood', description: 'Log your first bloody', category: 'milestone', domain: 'bloody', icon: 'droplet', color: 'red', effect: 'confetti', tier: 'common' },
  { id: 'getting-started', name: 'Getting Started', description: 'Log 5 bloodies', category: 'milestone', domain: 'bloody', icon: 'rocket', color: 'blue', effect: 'confetti', tier: 'common' },
  { id: 'double-digits', name: 'Double Digits', description: 'Log 10 bloodies', category: 'milestone', domain: 'bloody', icon: 'hash', color: 'purple', effect: 'explode', tier: 'uncommon' },
  // Daily Frequency
  { id: 'back-to-back', name: 'Back to Back', description: '2 bloodies within 30 minutes', category: 'frequency', domain: 'bloody', icon: 'zap', color: 'yellow', effect: 'confetti', tier: 'common' },
  { id: 'triple-threat', name: 'Triple Threat', description: '3 bloodies in one day', category: 'frequency', domain: 'bloody', icon: 'three', color: 'orange', effect: 'confetti', tier: 'uncommon' },
  { id: 'high-five', name: 'High Five', description: '5 bloodies in one day', category: 'frequency', domain: 'bloody', icon: 'hand', color: 'pink', effect: 'explode', tier: 'rare' },
  // Location
  { id: 'regular', name: 'Regular', description: 'Same location 3+ times', category: 'location', domain: 'bloody', icon: 'home', color: 'teal', effect: 'confetti', tier: 'common' },
  { id: 'explorer', name: 'Explorer', description: '5 different locations', category: 'location', domain: 'bloody', icon: 'compass', color: 'green', effect: 'confetti', tier: 'uncommon' },
  { id: 'wanderer', name: 'Wanderer', description: '10 different locations', category: 'location', domain: 'bloody', icon: 'map-pinned', color: 'emerald', effect: 'explode', tier: 'rare' },
  { id: 'strip-crawler', name: 'Strip Crawler', description: '5 different Strip casinos', category: 'location', domain: 'bloody', icon: 'dices', color: 'gold', effect: 'explode', tier: 'epic' },
  // Rating
  { id: 'five-star-find', name: 'Five Star Find', description: 'Log a 5-star bloody', category: 'rating', domain: 'bloody', icon: 'star', color: 'yellow', effect: 'confetti', tier: 'common' },
  { id: 'tough-crowd', name: 'Tough Crowd', description: 'Log a 1-star bloody', category: 'rating', domain: 'bloody', icon: 'thumbs-down', color: 'gray', effect: 'none', tier: 'common' },
  // Spice - these get fire effects!
  { id: 'cough-cough', name: 'Cough, Cough', description: 'Log a 5-fire spice rating', category: 'spice', domain: 'bloody', icon: 'flame', color: 'red', effect: 'fire', tier: 'uncommon' },
  { id: 'heat-seeker', name: 'Heat Seeker', description: 'Log five 5-fire bloodies', category: 'spice', domain: 'bloody', icon: 'pepper', color: 'orange', effect: 'explode', tier: 'rare' },
  { id: 'mild-mannered', name: 'Mild Mannered', description: 'Log a 1-fire bloody', category: 'spice', domain: 'bloody', icon: 'milk', color: 'blue', effect: 'none', tier: 'common' },
  { id: 'spice-spectrum', name: 'Spice Spectrum', description: 'Log all 5 spice levels', category: 'spice', domain: 'bloody', icon: 'rainbow', color: 'purple', effect: 'explode', tier: 'epic' },
  { id: 'playing-it-safe', name: 'Playing It Safe', description: '5 in a row at 1-2 spice', category: 'spice', domain: 'bloody', icon: 'shield', color: 'teal', effect: 'fire', tier: 'rare' },
  // Time
  { id: 'hair-of-the-dog', name: 'Hair of the Dog', description: 'First bloody before 9am', category: 'time', domain: 'bloody', icon: 'sunrise', color: 'amber', effect: 'confetti', tier: 'uncommon' },
  { id: 'night-owl', name: 'Night Owl', description: 'Bloody after midnight', category: 'time', domain: 'bloody', icon: 'moon', color: 'indigo', effect: 'confetti', tier: 'uncommon' },
  { id: 'happy-hour', name: 'Happy Hour', description: 'Bloody between 4-6pm', category: 'time', domain: 'bloody', icon: 'beer', color: 'yellow', effect: 'confetti', tier: 'common' },
  { id: 'weekend-warrior', name: 'Weekend Warrior', description: 'Log on both Sat & Sun', category: 'time', domain: 'bloody', icon: 'calendar', color: 'green', effect: 'explode', tier: 'uncommon' },
  // New badges from mockup
  { id: 'photo-op', name: 'Photo Op', description: 'Add a photo to any bloody', category: 'documentation', domain: 'bloody', icon: 'camera', color: 'blue', effect: 'confetti', tier: 'common' },
  { id: 'noted', name: 'Noted', description: 'Add a note to any bloody', category: 'documentation', domain: 'bloody', icon: 'sticky-note', color: 'yellow', effect: 'confetti', tier: 'common' },
  { id: 'garnished', name: 'Garnished', description: 'Rate all aspects of a bloody', category: 'documentation', domain: 'bloody', icon: 'award', color: 'gold', effect: 'confetti', tier: 'common' },
  { id: 'sunday-funday', name: 'Sunday Funday', description: 'Log 3 bloodies on Sunday', category: 'time', domain: 'bloody', icon: 'sparkles', color: 'pink', effect: 'explode', tier: 'rare' },
];
