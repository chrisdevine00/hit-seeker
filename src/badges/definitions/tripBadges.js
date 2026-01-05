// Trip & Casino badge definitions - 23 badges

export const TRIP_BADGES = [
  // Trip Basics (9)
  { id: 'trip-starter', name: 'Trip Starter', description: 'Create your first trip', category: 'trip', domain: 'trip', icon: 'flag', color: 'green', effect: 'confetti', tier: 'common' },
  { id: 'team-player', name: 'Team Player', description: "Join someone else's trip", category: 'trip', domain: 'trip', icon: 'user-plus', color: 'blue', effect: 'confetti', tier: 'common' },
  { id: 'plus-one', name: 'Plus One', description: 'Invite someone (share code used)', category: 'trip', domain: 'trip', icon: 'share', color: 'teal', effect: 'confetti', tier: 'common' },
  { id: 'threes-company', name: "Three's Company", description: 'Have 3+ members on a trip', category: 'trip', domain: 'trip', icon: 'users', color: 'green', effect: 'confetti', tier: 'common' },
  { id: 'squad-goals', name: 'Squad Goals', description: 'Have 5+ members on a trip', category: 'trip', domain: 'trip', icon: 'users', color: 'green', effect: 'confetti', tier: 'uncommon' },
  { id: 'frequent-flyer', name: 'Frequent Flyer', description: 'Participate in 3 trips', category: 'trip', domain: 'trip', icon: 'plane', color: 'blue', effect: 'confetti', tier: 'uncommon' },
  { id: 'road-warrior', name: 'Road Warrior', description: 'Participate in 5 trips', category: 'trip', domain: 'trip', icon: 'luggage', color: 'blue', effect: 'explode', tier: 'rare' },
  { id: 'trip-leader', name: 'Trip Leader', description: 'Create 3 trips', category: 'trip', domain: 'trip', icon: 'crown', color: 'gold', effect: 'explode', tier: 'rare' },
  { id: 'vegas-regular', name: 'Vegas Regular', description: 'Trip in consecutive months', category: 'trip', domain: 'trip', icon: 'calendar-check', color: 'emerald', effect: 'explode', tier: 'epic' },

  // Check-In (7)
  { id: 'checked-in', name: 'Checked In', description: 'First check-in at any casino', category: 'check-in', domain: 'trip', icon: 'map-pinned', color: 'green', effect: 'confetti', tier: 'common' },
  { id: 'home-base', name: 'Home Base', description: 'Check into same casino 3 times', category: 'check-in', domain: 'trip', icon: 'home', color: 'teal', effect: 'confetti', tier: 'common' },
  { id: 'early-bird', name: 'Early Bird', description: 'Check in before 8am', category: 'check-in', domain: 'trip', icon: 'sunrise', color: 'amber', effect: 'confetti', tier: 'common' },
  { id: 'night-shift', name: 'Night Shift', description: 'Check in after midnight', category: 'check-in', domain: 'trip', icon: 'moon', color: 'indigo', effect: 'confetti', tier: 'common' },
  { id: 'double-shift', name: 'Double Shift', description: 'Check into 2 casinos in one day', category: 'check-in', domain: 'trip', icon: 'arrow-right-left', color: 'blue', effect: 'confetti', tier: 'common' },
  { id: 'casino-crawl', name: 'Casino Crawl', description: 'Check into 3 casinos in one day', category: 'check-in', domain: 'trip', icon: 'footprints', color: 'amber', effect: 'confetti', tier: 'uncommon' },
  { id: 'marathon', name: 'Marathon', description: 'Stay checked in for 4+ hours', category: 'check-in', domain: 'trip', icon: 'clock', color: 'teal', effect: 'confetti', tier: 'uncommon' },

  // Casino Ownership (3)
  { id: 'mgm-loyalist', name: 'MGM Loyalist', description: 'Visit 5 MGM properties', category: 'ownership', domain: 'trip', icon: 'crown', color: 'amber', effect: 'confetti', tier: 'uncommon' },
  { id: 'caesars-club', name: 'Caesars Club', description: 'Visit 5 Caesars properties', category: 'ownership', domain: 'trip', icon: 'landmark', color: 'pink', effect: 'confetti', tier: 'uncommon' },
  { id: 'property-collector', name: 'Property Collector', description: 'Visit all casinos of one ownership group', category: 'ownership', domain: 'trip', icon: 'building', color: 'gold', effect: 'explode', tier: 'epic' },

  // Vegas Regions (4)
  { id: 'downtown-bound', name: 'Downtown Bound', description: 'Visit 3 Downtown casinos', category: 'region', domain: 'trip', icon: 'building', color: 'indigo', effect: 'confetti', tier: 'uncommon' },
  { id: 'off-strip-explorer', name: 'Off-Strip Explorer', description: 'Visit 3 off-strip casinos', category: 'region', domain: 'trip', icon: 'compass', color: 'green', effect: 'confetti', tier: 'uncommon' },
  { id: 'locals-choice', name: "Local's Choice", description: 'Visit 3 locals casinos', category: 'region', domain: 'trip', icon: 'heart', color: 'emerald', effect: 'explode', tier: 'rare' },
  { id: 'strip-sweep', name: 'Strip Sweep', description: 'Visit 10 Strip casinos on one trip', category: 'region', domain: 'trip', icon: 'sparkles', color: 'red', effect: 'explode', tier: 'epic' },
];
