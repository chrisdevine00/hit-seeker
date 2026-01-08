// VP Badge Checker

// Wild card games
const WILD_GAMES = ['deuces-wild', 'bonus-deuces-wild', 'loose-deuces', 'joker-poker-kings', 'joker-poker-twopair'];

// Check if game is Jacks or Better variant
function isJacksOrBetter(gameId) {
  return gameId && (
    gameId.includes('jacks-or-better') ||
    gameId.includes('jacks_or_better') ||
    gameId === 'jacks-or-better'
  );
}

// Check if game is a Bonus Poker variant
function isBonusPoker(gameId) {
  return gameId && (
    gameId.includes('bonus-poker') ||
    gameId.includes('bonus_poker') ||
    gameId.includes('double-bonus') ||
    gameId.includes('triple-double') ||
    gameId.includes('double-double')
  );
}

// Check if game is a wild card game
function isWildGame(gameId) {
  if (!gameId) return false;
  return WILD_GAMES.includes(gameId) || gameId.includes('deuces') || gameId.includes('joker');
}

// Check which VP badges are earned
export function checkVPBadges(vpNotes) {
  const earned = new Set();

  if (!vpNotes || vpNotes.length === 0) return earned;

  // Milestone badges
  if (vpNotes.length >= 1) earned.add('first-hand');
  if (vpNotes.length >= 3) earned.add('table-check');
  if (vpNotes.length >= 10) earned.add('card-counter');
  if (vpNotes.length >= 25) earned.add('vp-veteran');
  if (vpNotes.length >= 50) earned.add('table-master');

  // Quick win badges - Double Down (2 in one session/day)
  const notesByDay = {};
  vpNotes.forEach(n => {
    const day = new Date(n.created_at).toDateString();
    if (!notesByDay[day]) notesByDay[day] = [];
    notesByDay[day].push(n);
  });
  const hasDoubleDown = Object.values(notesByDay).some(dayNotes => dayNotes.length >= 2);
  if (hasDoubleDown) earned.add('double-down');

  // Notes in Hand - any with notes
  const hasNotes = vpNotes.some(n => n.state && n.state.trim().length > 0);
  if (hasNotes) earned.add('notes-in-hand');

  // Photo badges - check note.photo_path (1 photo per note)
  const notesWithPhotos = vpNotes.filter(n => n.photo_path);
  if (notesWithPhotos.length >= 1) earned.add('snap-the-table');
  if (notesWithPhotos.length >= 10) earned.add('table-shooter');
  if (notesWithPhotos.length >= 25) earned.add('paparazzi');

  // Casino Debut - VP at any casino
  const hasCasino = vpNotes.some(n => n.casino && n.casino.trim().length > 0);
  if (hasCasino) earned.add('casino-debut');

  // Location Logged
  const hasLocation = vpNotes.some(n => n.location && n.location.trim().length > 0);
  if (hasLocation) earned.add('location-logged');

  // Game-specific badges
  const hasJacks = vpNotes.some(n => isJacksOrBetter(n.vpGame));
  if (hasJacks) earned.add('jacks-starter');

  const hasBonus = vpNotes.some(n => isBonusPoker(n.vpGame));
  if (hasBonus) earned.add('bonus-round');

  const wildNotes = vpNotes.filter(n => isWildGame(n.vpGame));
  if (wildNotes.length >= 1) earned.add('wild-side');
  if (wildNotes.length >= 5) earned.add('wild-expert');

  // Game variety
  const uniqueGames = new Set(vpNotes.map(n => n.vpGame).filter(Boolean));
  if (uniqueGames.size >= 2) earned.add('game-hopper');
  if (uniqueGames.size >= 5) earned.add('variety-player');
  if (uniqueGames.size >= 10) earned.add('game-master');

  // Same Game - same game twice
  const gameCount = {};
  vpNotes.forEach(n => {
    if (n.vpGame) {
      gameCount[n.vpGame] = (gameCount[n.vpGame] || 0) + 1;
    }
  });
  const hasSameGame = Object.values(gameCount).some(count => count >= 2);
  if (hasSameGame) earned.add('same-game');

  // Time-based badges
  vpNotes.forEach(n => {
    const date = new Date(n.created_at);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek >= 1 && dayOfWeek <= 5) earned.add('weekday-warrior');
    if (dayOfWeek === 0 || dayOfWeek === 6) earned.add('weekend-scout');
  });

  // Return-based badges
  vpNotes.forEach(n => {
    const returnPct = parseFloat(n.vpReturn);

    // Full Pay Found - check for "Full Pay" or high return games
    if (n.vpPayTable && (
      n.vpPayTable.toLowerCase().includes('full pay') ||
      n.vpPayTable === '9/6' || // 9/6 Jacks is full pay
      n.vpPayTable === '10/7' // 10/7 Double Bonus is full pay
    )) {
      earned.add('full-pay-found');
    }

    // Check VP pay table rating
    if (n.vpPayTableRating === 'OK') earned.add('ok-is-ok');
    if (n.vpPayTableRating === 'AVOID') earned.add('avoided-one');

    // Return percentage badges
    if (returnPct && returnPct >= 99) earned.add('the-99-club');
    if (returnPct && returnPct >= 99 && n.vpPayTableRating === 'HUNT') earned.add('hunt-finder');
    if (returnPct && returnPct >= 100) earned.add('holy-grail');
  });

  // Edge Lord - 5 different 100%+ tables
  const hundredPlusTables = new Set();
  vpNotes.forEach(n => {
    const returnPct = parseFloat(n.vpReturn);
    if (returnPct && returnPct >= 100) {
      // Create unique key for this pay table
      hundredPlusTables.add(`${n.vpGame}:${n.vpPayTable}`);
    }
  });
  if (hundredPlusTables.size >= 5) earned.add('edge-lord');

  return earned;
}
