import { vegasCasinos } from '../../data/casinos';

// Get casino info by ID or name
function getCasinoInfo(casinoIdOrName) {
  if (!casinoIdOrName) return null;
  const searchLower = casinoIdOrName.toLowerCase();
  return vegasCasinos.find(c =>
    c.id === casinoIdOrName ||
    c.name.toLowerCase() === searchLower ||
    c.name.toLowerCase().includes(searchLower)
  );
}

// Strip casino IDs
const STRIP_AREAS = ['Center Strip', 'South Strip', 'North Strip'];
const DOWNTOWN_AREA = 'Downtown';
const LOCALS_AREAS = ['West', 'Henderson', 'Boulder', 'Summerlin', 'Rancho', 'North LV'];

// Check which trip badges are earned
export function checkTripBadges(trips = [], tripMembers = [], checkIns = [], userId = null) {
  const earned = new Set();

  // === Trip-based badges ===

  // Count trips by role
  const ownerTrips = trips.filter(t => t.owner_id === userId);
  const memberTrips = trips.length;
  const joinedTrips = trips.filter(t => t.owner_id !== userId);

  // Trip Starter - created a trip
  if (ownerTrips.length >= 1) earned.add('trip-starter');
  if (ownerTrips.length >= 3) earned.add('trip-leader');

  // Team Player - joined someone else's trip
  if (joinedTrips.length >= 1) earned.add('team-player');

  // Frequent Flyer / Road Warrior - trip count
  if (memberTrips >= 3) earned.add('frequent-flyer');
  if (memberTrips >= 5) earned.add('road-warrior');

  // Check trip member counts for current/any trip
  trips.forEach(trip => {
    const members = tripMembers.filter(m => m.trip_id === trip.id);
    if (members.length >= 2) earned.add('plus-one'); // Invited someone
    if (members.length >= 3) earned.add('threes-company');
    if (members.length >= 5) earned.add('squad-goals');
  });

  // Vegas Regular - trips in consecutive months
  if (trips.length >= 2) {
    const tripDates = trips.map(t => new Date(t.created_at)).sort((a, b) => a - b);
    for (let i = 1; i < tripDates.length; i++) {
      const prev = tripDates[i - 1];
      const curr = tripDates[i];
      const prevMonth = prev.getFullYear() * 12 + prev.getMonth();
      const currMonth = curr.getFullYear() * 12 + curr.getMonth();
      if (currMonth - prevMonth === 1) {
        earned.add('vegas-regular');
        break;
      }
    }
  }

  // === Check-in based badges ===
  if (checkIns.length >= 1) earned.add('checked-in');

  // Home Base - same casino 3 times
  const casinoCheckInCount = {};
  checkIns.forEach(ci => {
    casinoCheckInCount[ci.casino_id] = (casinoCheckInCount[ci.casino_id] || 0) + 1;
  });
  if (Object.values(casinoCheckInCount).some(count => count >= 3)) {
    earned.add('home-base');
  }

  // Time-based check-in badges
  checkIns.forEach(ci => {
    const date = new Date(ci.created_at || ci.checked_in_at);
    const hour = date.getHours();

    if (hour < 8) earned.add('early-bird');
    if (hour >= 0 && hour < 5) earned.add('night-shift');
  });

  // Check-ins per day
  const checkInsByDay = {};
  checkIns.forEach(ci => {
    const day = new Date(ci.created_at || ci.checked_in_at).toDateString();
    if (!checkInsByDay[day]) checkInsByDay[day] = new Set();
    checkInsByDay[day].add(ci.casino_id);
  });

  Object.values(checkInsByDay).forEach(casinos => {
    if (casinos.size >= 2) earned.add('double-shift');
    if (casinos.size >= 3) earned.add('casino-crawl');
  });

  // Marathon - 4+ hours (would need checkout time, approximate for now)
  // This would require duration tracking, skip for initial implementation

  // === Casino ownership badges ===
  const uniqueCasinos = new Set(checkIns.map(ci => ci.casino_id));
  const mgmCasinos = new Set();
  const caesarsCasinos = new Set();
  const ownerCounts = {};

  uniqueCasinos.forEach(casinoId => {
    const casino = getCasinoInfo(casinoId);
    if (casino) {
      if (casino.owner === 'MGM') mgmCasinos.add(casinoId);
      if (casino.owner === 'Caesars') caesarsCasinos.add(casinoId);

      ownerCounts[casino.owner] = (ownerCounts[casino.owner] || 0) + 1;
    }
  });

  if (mgmCasinos.size >= 5) earned.add('mgm-loyalist');
  if (caesarsCasinos.size >= 5) earned.add('caesars-club');

  // Property Collector - all casinos of one owner
  const MAJOR_OWNERS = {
    'MGM': vegasCasinos.filter(c => c.owner === 'MGM' && c.slots !== '0'),
    'Caesars': vegasCasinos.filter(c => c.owner === 'Caesars'),
    'Station': vegasCasinos.filter(c => c.owner === 'Station'),
    'Boyd': vegasCasinos.filter(c => c.owner === 'Boyd'),
  };

  Object.entries(MAJOR_OWNERS).forEach(([owner, ownerCasinos]) => {
    if (ownerCasinos.length > 0) {
      const visitedOwnerCasinos = [...uniqueCasinos].filter(id => {
        const casino = getCasinoInfo(id);
        return casino && casino.owner === owner;
      });
      if (visitedOwnerCasinos.length >= ownerCasinos.length) {
        earned.add('property-collector');
      }
    }
  });

  // === Region badges ===
  const downtownVisits = new Set();
  const offStripVisits = new Set();
  const localsVisits = new Set();
  const stripVisits = new Set();
  const stripVisitsByTrip = {};

  checkIns.forEach(ci => {
    const casino = getCasinoInfo(ci.casino_id);
    if (!casino) return;

    if (casino.area === DOWNTOWN_AREA) {
      downtownVisits.add(ci.casino_id);
    }
    if (STRIP_AREAS.includes(casino.area)) {
      stripVisits.add(ci.casino_id);
      // Track by trip for Strip Sweep
      if (!stripVisitsByTrip[ci.trip_id]) stripVisitsByTrip[ci.trip_id] = new Set();
      stripVisitsByTrip[ci.trip_id].add(ci.casino_id);
    }
    if (!STRIP_AREAS.includes(casino.area) && casino.area !== DOWNTOWN_AREA) {
      offStripVisits.add(ci.casino_id);
    }
    if (LOCALS_AREAS.includes(casino.area)) {
      localsVisits.add(ci.casino_id);
    }
  });

  if (downtownVisits.size >= 3) earned.add('downtown-bound');
  if (offStripVisits.size >= 3) earned.add('off-strip-explorer');
  if (localsVisits.size >= 3) earned.add('locals-choice');

  // Strip Sweep - 10 strip casinos on one trip
  Object.values(stripVisitsByTrip).forEach(tripStripCasinos => {
    if (tripStripCasinos.size >= 10) earned.add('strip-sweep');
  });

  return earned;
}
