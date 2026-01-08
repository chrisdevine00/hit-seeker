// Slot spotter badge definitions - 23 badges

export const SLOT_BADGES = [
  // Quick Wins (7 Common)
  { id: 'first-spot', name: 'First Spot', description: 'Log your first slot spot', category: 'milestone', domain: 'slot', icon: 'target', color: 'amber', effect: 'confetti', tier: 'common' },
  { id: 'first-playable', name: 'First Playable', description: 'Mark a spot as Playable', category: 'playable', domain: 'slot', icon: 'check', color: 'green', effect: 'confetti', tier: 'common' },
  { id: 'note-taker', name: 'Note Taker', description: 'Add notes to any spot', category: 'quick-win', domain: 'slot', icon: 'sticky-note', color: 'yellow', effect: 'confetti', tier: 'common' },
  { id: 'snapshot-scout', name: 'Snapshot Scout', description: 'Add first photo to a slot spot', category: 'quick-win', domain: 'slot', icon: 'camera', color: 'blue', effect: 'confetti', tier: 'common' },
  { id: 'quick-scout', name: 'Quick Scout', description: 'Spot 3 machines in one session', category: 'quick-win', domain: 'slot', icon: 'zap', color: 'amber', effect: 'confetti', tier: 'common' },
  { id: 'detail-oriented', name: 'Detail Oriented', description: 'Fill location field on a spot', category: 'quick-win', domain: 'slot', icon: 'map-pinned', color: 'teal', effect: 'confetti', tier: 'common' },
  { id: 'second-opinion', name: 'Second Opinion', description: 'Spot same machine twice', category: 'quick-win', domain: 'slot', icon: 'refresh', color: 'blue', effect: 'confetti', tier: 'common' },

  // Milestones (4)
  { id: 'sharp-eye', name: 'Sharp Eye', description: 'Log 10 slot spots', category: 'milestone', domain: 'slot', icon: 'eye', color: 'amber', effect: 'confetti', tier: 'uncommon' },
  { id: 'quarter-century', name: 'Quarter Century', description: 'Log 25 slot spots', category: 'milestone', domain: 'slot', icon: 'hash', color: 'gold', effect: 'explode', tier: 'rare' },
  { id: 'half-ton', name: 'Half Ton', description: 'Log 50 slot spots', category: 'milestone', domain: 'slot', icon: 'trophy', color: 'gold', effect: 'explode', tier: 'epic' },
  { id: 'centurion', name: 'Centurion', description: 'Log 100 slot spots', category: 'milestone', domain: 'slot', icon: 'crown', color: 'gold', effect: 'explode', tier: 'legendary' },

  // Machine Category (5)
  { id: 'mhb-hunter', name: 'MHB Hunter', description: 'Spot 5 Must-Hit-By machines', category: 'machine', domain: 'slot', icon: 'gauge', color: 'amber', effect: 'confetti', tier: 'uncommon' },
  { id: 'coin-collector', name: 'Coin Collector', description: 'Spot 5 Banked Coins machines', category: 'machine', domain: 'slot', icon: 'coins', color: 'teal', effect: 'confetti', tier: 'uncommon' },
  { id: 'reel-expander', name: 'Reel Expander', description: 'Spot 5 Expanding Reels machines', category: 'machine', domain: 'slot', icon: 'expand', color: 'blue', effect: 'confetti', tier: 'uncommon' },
  { id: 'cycle-master', name: 'Cycle Master', description: 'Spot 5 Cycle Bonus machines', category: 'machine', domain: 'slot', icon: 'refresh', color: 'purple', effect: 'explode', tier: 'rare' },
  { id: 'category-king', name: 'Category King', description: 'Spot in all 5 categories', category: 'machine', domain: 'slot', icon: 'layers', color: 'purple', effect: 'explode', tier: 'epic' },

  // Coverage (2)
  { id: 'casino-hopper', name: 'Casino Hopper', description: 'Spot at 5 different casinos', category: 'coverage', domain: 'slot', icon: 'building', color: 'green', effect: 'confetti', tier: 'uncommon' },
  { id: 'floor-walker', name: 'Floor Walker', description: 'Spot at 10 different casinos', category: 'coverage', domain: 'slot', icon: 'map', color: 'emerald', effect: 'explode', tier: 'rare' },

  // Playable (2)
  { id: 'ten-playables', name: '10 Playables', description: 'Mark 10 spots as Playable', category: 'playable', domain: 'slot', icon: 'trophy', color: 'gold', effect: 'explode', tier: 'rare' },
  { id: 'golden-eye', name: 'Golden Eye', description: 'Mark 25 spots as Playable', category: 'playable', domain: 'slot', icon: 'sparkles', color: 'gold', effect: 'explode', tier: 'epic' },

  // Photo (4) - photography puns!
  { id: 'picture-perfect', name: 'Picture Perfect', description: 'Add photos to 10 slot spots', category: 'photo', domain: 'slot', icon: 'image', color: 'teal', effect: 'confetti', tier: 'uncommon' },
  { id: 'lens-master', name: 'Lens Master', description: 'Add photos to 25 slot spots', category: 'photo', domain: 'slot', icon: 'aperture', color: 'purple', effect: 'explode', tier: 'rare' },
  { id: 'full-exposure', name: 'Full Exposure', description: 'Add photos to 50 slot spots', category: 'photo', domain: 'slot', icon: 'film', color: 'gold', effect: 'explode', tier: 'epic' },
];
