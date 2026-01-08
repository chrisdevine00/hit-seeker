import { STRIP_CASINO_IDS } from '../definitions/bloodyBadges';

// Check which badges are earned based on bloodies history
export function checkBloodyBadges(bloodies) {
  const earned = new Set();

  if (bloodies.length === 0) return earned;

  // Milestone badges
  if (bloodies.length >= 1) earned.add('first-blood');
  if (bloodies.length >= 5) earned.add('getting-started');
  if (bloodies.length >= 10) earned.add('double-digits');

  // Location-based badges
  const locationCounts = {};
  const uniqueLocations = new Set();
  const stripLocations = new Set();

  bloodies.forEach(b => {
    if (b.location) {
      const locKey = b.location.toLowerCase().trim();
      locationCounts[locKey] = (locationCounts[locKey] || 0) + 1;
      uniqueLocations.add(locKey);

      // Check if it's a strip casino
      if (STRIP_CASINO_IDS.some(id => locKey.includes(id) || id.includes(locKey))) {
        stripLocations.add(locKey);
      }
    }
  });

  if (Object.values(locationCounts).some(count => count >= 3)) earned.add('regular');
  if (uniqueLocations.size >= 5) earned.add('explorer');
  if (uniqueLocations.size >= 10) earned.add('wanderer');
  if (stripLocations.size >= 5) earned.add('strip-crawler');

  // Rating badges
  if (bloodies.some(b => b.rating === 5)) earned.add('five-star-find');
  if (bloodies.some(b => b.rating === 1)) earned.add('tough-crowd');

  // Spice badges
  const spiceLevels = new Set(bloodies.map(b => b.spice).filter(s => s));
  const fiveFireCount = bloodies.filter(b => b.spice === 5).length;

  if (bloodies.some(b => b.spice === 5)) earned.add('cough-cough');
  if (fiveFireCount >= 5) earned.add('heat-seeker');
  if (bloodies.some(b => b.spice === 1)) earned.add('mild-mannered');
  if (spiceLevels.size === 5) earned.add('spice-spectrum');

  // Playing it safe - 5 in a row at 1-2 spice
  let safeStreak = 0;
  for (const b of bloodies) {
    if (b.spice && b.spice <= 2) {
      safeStreak++;
      if (safeStreak >= 5) {
        earned.add('playing-it-safe');
        break;
      }
    } else {
      safeStreak = 0;
    }
  }

  // Time-based badges
  const sundayBloodies = [];
  bloodies.forEach(b => {
    const date = new Date((b.created_at || b.timestamp));
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (hour < 9) earned.add('hair-of-the-dog');
    if (hour >= 0 && hour < 5) earned.add('night-owl'); // After midnight, before 5am
    if (hour >= 16 && hour < 18) earned.add('happy-hour');

    if (day === 0) sundayBloodies.push(b);
  });

  // Weekend Warrior - need both Sat and Sun
  const hasSaturday = bloodies.some(b => new Date((b.created_at || b.timestamp)).getDay() === 6);
  const hasSunday = bloodies.some(b => new Date((b.created_at || b.timestamp)).getDay() === 0);
  if (hasSaturday && hasSunday) earned.add('weekend-warrior');

  // Sunday Funday - 3 bloodies on a single Sunday
  const sundaysByDate = {};
  sundayBloodies.forEach(b => {
    const dateKey = new Date((b.created_at || b.timestamp)).toDateString();
    sundaysByDate[dateKey] = (sundaysByDate[dateKey] || 0) + 1;
  });
  if (Object.values(sundaysByDate).some(count => count >= 3)) {
    earned.add('sunday-funday');
  }

  // Frequency badges - group by day
  const byDay = {};
  bloodies.forEach(b => {
    const dayKey = new Date((b.created_at || b.timestamp)).toDateString();
    if (!byDay[dayKey]) byDay[dayKey] = [];
    byDay[dayKey].push(b);
  });

  Object.values(byDay).forEach(dayBloodies => {
    if (dayBloodies.length >= 3) earned.add('triple-threat');
    if (dayBloodies.length >= 5) earned.add('high-five');

    // Back to back - 2 within 30 minutes
    const sorted = [...dayBloodies].sort((a, b) => new Date(a.timestamp) - new Date((b.created_at || b.timestamp)));
    for (let i = 1; i < sorted.length; i++) {
      const diff = new Date(sorted[i].timestamp) - new Date(sorted[i-1].timestamp);
      if (diff <= 30 * 60 * 1000) { // 30 minutes in ms
        earned.add('back-to-back');
        break;
      }
    }
  });

  // Documentation badges
  if (bloodies.some(b => b.photos && b.photos.length > 0)) earned.add('photo-op');
  if (bloodies.some(b => b.notes && b.notes.trim().length > 0)) earned.add('noted');
  if (bloodies.some(b => b.rating > 0 && b.spice > 0 && b.location)) earned.add('garnished');

  return earned;
}
