import { machines } from '../../data/machines';

// Helper to get machine category from machine name
function getMachineCategory(machineName) {
  if (!machineName) return null;
  const machineNameLower = machineName.toLowerCase();
  const machine = machines.find(m =>
    machineNameLower.includes(m.name.toLowerCase()) ||
    machineNameLower.includes(m.shortName?.toLowerCase()) ||
    m.name.toLowerCase().includes(machineNameLower)
  );
  return machine?.category || null;
}

// Check which slot badges are earned based on slot notes
export function checkSlotBadges(slotNotes, photos = {}) {
  const earned = new Set();

  if (!slotNotes || slotNotes.length === 0) return earned;

  // Milestone badges
  if (slotNotes.length >= 1) earned.add('first-spot');
  if (slotNotes.length >= 10) earned.add('sharp-eye');
  if (slotNotes.length >= 25) earned.add('quarter-century');
  if (slotNotes.length >= 50) earned.add('half-ton');
  if (slotNotes.length >= 100) earned.add('centurion');

  // Quick win badges
  const hasPlayable = slotNotes.some(n => n.playable);
  if (hasPlayable) earned.add('first-playable');

  const hasNotes = slotNotes.some(n => n.state && n.state.trim().length > 0);
  if (hasNotes) earned.add('note-taker');

  const hasLocation = slotNotes.some(n => n.location && n.location.trim().length > 0);
  if (hasLocation) earned.add('detail-oriented');

  // Photo Evidence - check if any slot has photos
  const notesWithPhotos = slotNotes.filter(n => {
    const machinePhotos = photos[n.machine] || [];
    return machinePhotos.length > 0;
  });
  if (notesWithPhotos.length >= 1) earned.add('photo-evidence');
  if (notesWithPhotos.length >= 20) earned.add('photographer');

  // Multi-photo - single spot with 3+ photos
  const hasMultiPhoto = slotNotes.some(n => {
    const machinePhotos = photos[n.machine] || [];
    return machinePhotos.length >= 3;
  });
  if (hasMultiPhoto) earned.add('multi-photo');

  // Quick Scout - 3 in one day
  const notesByDay = {};
  slotNotes.forEach(n => {
    const day = new Date(n.created_at).toDateString();
    if (!notesByDay[day]) notesByDay[day] = [];
    notesByDay[day].push(n);
  });
  const hasQuickScout = Object.values(notesByDay).some(dayNotes => dayNotes.length >= 3);
  if (hasQuickScout) earned.add('quick-scout');

  // Second Opinion - same machine twice
  const machineCount = {};
  slotNotes.forEach(n => {
    if (n.machine) {
      machineCount[n.machine] = (machineCount[n.machine] || 0) + 1;
    }
  });
  const hasDuplicate = Object.values(machineCount).some(count => count >= 2);
  if (hasDuplicate) earned.add('second-opinion');

  // Machine category badges
  const categoryCount = {
    'must-hit-by': 0,
    'banked-coins': 0,
    'expanding-reels': 0,
    'cycle-bonus': 0,
    'persistent-state': 0,
  };

  slotNotes.forEach(n => {
    const category = getMachineCategory(n.machine);
    if (category && Object.hasOwn(categoryCount, category)) {
      categoryCount[category]++;
    }
  });

  if (categoryCount['must-hit-by'] >= 5) earned.add('mhb-hunter');
  if (categoryCount['banked-coins'] >= 5) earned.add('coin-collector');
  if (categoryCount['expanding-reels'] >= 5) earned.add('reel-expander');
  if (categoryCount['cycle-bonus'] >= 5) earned.add('cycle-master');

  // Category King - at least one from each main category
  const mainCategories = ['must-hit-by', 'banked-coins', 'expanding-reels', 'cycle-bonus', 'persistent-state'];
  const hasAllCategories = mainCategories.every(cat => categoryCount[cat] >= 1);
  if (hasAllCategories) earned.add('category-king');

  // Casino coverage
  const uniqueCasinos = new Set(slotNotes.map(n => n.casino).filter(Boolean));
  if (uniqueCasinos.size >= 5) earned.add('casino-hopper');
  if (uniqueCasinos.size >= 10) earned.add('floor-walker');

  // Playable count
  const playableCount = slotNotes.filter(n => n.playable).length;
  if (playableCount >= 10) earned.add('ten-playables');
  if (playableCount >= 25) earned.add('golden-eye');

  return earned;
}
