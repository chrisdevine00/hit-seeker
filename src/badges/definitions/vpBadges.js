// Video Poker badge definitions - 27 badges

export const VP_BADGES = [
  // Quick Wins (17 Common)
  { id: 'first-hand', name: 'First Hand', description: 'Log your first VP find', category: 'milestone', domain: 'vp', icon: 'spade', color: 'blue', effect: 'confetti', tier: 'common' },
  { id: 'double-down', name: 'Double Down', description: 'Log 2 VP finds in one session', category: 'quick-win', domain: 'vp', icon: 'copy', color: 'blue', effect: 'confetti', tier: 'common' },
  { id: 'table-check', name: 'Table Check', description: 'Log 3 VP finds', category: 'quick-win', domain: 'vp', icon: 'club', color: 'blue', effect: 'confetti', tier: 'common' },
  { id: 'jacks-starter', name: 'Jacks Starter', description: 'Log any Jacks or Better find', category: 'game', domain: 'vp', icon: 'heart', color: 'red', effect: 'confetti', tier: 'common' },
  { id: 'notes-in-hand', name: 'Notes in Hand', description: 'Add notes to any VP find', category: 'quick-win', domain: 'vp', icon: 'sticky-note', color: 'yellow', effect: 'confetti', tier: 'common' },
  { id: 'snap-the-table', name: 'Snap the Table', description: 'Add a photo to a VP find', category: 'quick-win', domain: 'vp', icon: 'camera', color: 'blue', effect: 'confetti', tier: 'common' },
  { id: 'casino-debut', name: 'Casino Debut', description: 'Log VP at your first casino', category: 'quick-win', domain: 'vp', icon: 'building', color: 'teal', effect: 'confetti', tier: 'common' },
  { id: 'ok-is-ok', name: 'OK is OK', description: 'Log a VP with "OK" rating', category: 'rating', domain: 'vp', icon: 'check', color: 'green', effect: 'confetti', tier: 'common' },
  { id: 'avoided-one', name: 'Avoided One', description: 'Log a VP with "AVOID" rating', category: 'rating', domain: 'vp', icon: 'x', color: 'red', effect: 'none', tier: 'common' },
  { id: 'game-hopper', name: 'Game Hopper', description: 'Log 2 different game types', category: 'variety', domain: 'vp', icon: 'shuffle', color: 'purple', effect: 'confetti', tier: 'common' },
  { id: 'same-game', name: 'Same Game', description: 'Log the same game twice', category: 'variety', domain: 'vp', icon: 'repeat', color: 'teal', effect: 'confetti', tier: 'common' },
  { id: 'weekday-warrior', name: 'Weekday Warrior', description: 'Log VP on a weekday', category: 'time', domain: 'vp', icon: 'briefcase', color: 'gray', effect: 'confetti', tier: 'common' },
  { id: 'weekend-scout', name: 'Weekend Scout', description: 'Log VP on Sat or Sun', category: 'time', domain: 'vp', icon: 'palmtree', color: 'green', effect: 'confetti', tier: 'common' },
  { id: 'location-logged', name: 'Location Logged', description: 'Add location details', category: 'quick-win', domain: 'vp', icon: 'map-pinned', color: 'teal', effect: 'confetti', tier: 'common' },
  { id: 'full-pay-found', name: 'Full Pay Found', description: 'Find any "Full Pay" table', category: 'return', domain: 'vp', icon: 'award', color: 'gold', effect: 'confetti', tier: 'common' },
  { id: 'bonus-round', name: 'Bonus Round', description: 'Log any Bonus Poker game', category: 'game', domain: 'vp', icon: 'diamond', color: 'purple', effect: 'confetti', tier: 'common' },
  { id: 'wild-side', name: 'Wild Side', description: 'Log any wild card game', category: 'game', domain: 'vp', icon: 'asterisk', color: 'orange', effect: 'confetti', tier: 'common' },

  // Milestones & Returns (Uncommon+)
  { id: 'card-counter', name: 'Card Counter', description: 'Log 10 VP finds', category: 'milestone', domain: 'vp', icon: 'list-ordered', color: 'blue', effect: 'confetti', tier: 'uncommon' },
  { id: 'hunt-finder', name: 'HUNT Finder', description: 'Find a HUNT-rated pay table', category: 'return', domain: 'vp', icon: 'trending-up', color: 'green', effect: 'confetti', tier: 'uncommon' },
  { id: 'vp-veteran', name: 'VP Veteran', description: 'Log 25 VP finds', category: 'milestone', domain: 'vp', icon: 'hash', color: 'blue', effect: 'explode', tier: 'rare' },
  { id: 'the-99-club', name: 'The 99 Club', description: 'Find a 99%+ return table', category: 'return', domain: 'vp', icon: 'percent', color: 'gold', effect: 'explode', tier: 'rare' },
  { id: 'wild-expert', name: 'Wild Expert', description: 'Log 5 wild card game finds', category: 'game', domain: 'vp', icon: 'joystick', color: 'purple', effect: 'explode', tier: 'rare' },
  { id: 'variety-player', name: 'Variety Player', description: 'Log 5 different game types', category: 'game', domain: 'vp', icon: 'layers', color: 'emerald', effect: 'explode', tier: 'rare' },
  { id: 'table-master', name: 'Table Master', description: 'Log 50 VP finds', category: 'milestone', domain: 'vp', icon: 'trophy', color: 'blue', effect: 'explode', tier: 'epic' },
  { id: 'holy-grail', name: 'Holy Grail', description: 'Find a 100%+ return table', category: 'return', domain: 'vp', icon: 'gem', color: 'gold', effect: 'explode', tier: 'epic' },
  { id: 'game-master', name: 'Game Master', description: 'Log finds in 10 different games', category: 'game', domain: 'vp', icon: 'crown', color: 'purple', effect: 'explode', tier: 'epic' },
  { id: 'edge-lord', name: 'Edge Lord', description: 'Find 5 different 100%+ tables', category: 'return', domain: 'vp', icon: 'gem', color: 'gold', effect: 'explode', tier: 'legendary' },

  // Photo Badges (3) - photography puns!
  { id: 'table-shooter', name: 'Table Shooter', description: 'Add photos to 10 VP finds', category: 'photo', domain: 'vp', icon: 'image', color: 'teal', effect: 'confetti', tier: 'uncommon' },
  { id: 'paparazzi', name: 'Paparazzi', description: 'Add photos to 25 VP finds', category: 'photo', domain: 'vp', icon: 'aperture', color: 'purple', effect: 'explode', tier: 'rare' },
];
