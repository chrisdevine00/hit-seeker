# Badge Effects Strategy

## Core Effects (Applied to All Badges)
- **Entry Animation**: 3D Spin
- **Badge Style**: Levitating with shadow
- **Background**: Light rays (color matches badge/tier)

---

## Tier-Based Celebration Intensity

| Tier | Celebration | Light Rays | Glow Intensity | Duration |
|------|-------------|------------|----------------|----------|
| Common | None | Subtle, slow | Low | 0.8s |
| Uncommon | Confetti (light) | Medium, steady | Medium | 1.0s |
| Rare | Confetti (full) | Bright, rotating | High | 1.2s |
| Epic | Confetti (full) | Intense, pulsing | Very High | 1.5s |
| Legendary | Explode | Rainbow, fast | Maximum | 2.0s |

**Special Effect: Fire** - Reserved for spicy Bloody Mary badges only (set per-badge via `effect: 'fire'`)

---

## Category Color Themes

### Bloodies (Red)
- **Primary**: `#dc2626` (red-600)
- **Secondary**: `#991b1b` (red-800)
- **Accent**: `#fca5a5` (red-300)
- **Theme**: Warm, intense, celebratory (Bloody Mary vibes)

### Slots (Amber/Gold)
- **Primary**: `#d4a855` (gold)
- **Secondary**: `#b8860b` (dark gold)
- **Accent**: `#ffd700` (bright gold)
- **Theme**: Casino glamour, jackpot energy

### VP (Video Poker - Green)
- **Primary**: `#22c55e` (green-500)
- **Secondary**: `#15803d` (green-700)
- **Accent**: `#86efac` (green-300)
- **Theme**: Money, winning hands, success

### Trips (Rainbow)
- **Primary**: Multi-color rainbow
- **Secondary**: Multi-color rainbow
- **Accent**: Multi-color rainbow
- **Theme**: Adventure, variety, fun experiences

### Casinos (Purple)
- **Primary**: `#a855f7` (purple-500)
- **Secondary**: `#7c3aed` (violet-600)
- **Accent**: `#d8b4fe` (purple-300)
- **Theme**: VIP, exclusive, prestigious

---

## Badge Effect Assignments by Category & Tier

### BLOODIES (31 badges)

| Badge | Tier | Effect | Reasoning |
|-------|------|--------|-----------|
| First Bloody | Common | None | Entry-level achievement |
| Early Bird | Common | None | Simple time-based |
| Noted | Common | None | Basic documentation |
| **First Flame** | Common | Fire | First spicy bloody - intro to fire effect |
| **Jalapeño Starter** | Common | Fire | Try a mild-spicy bloody |
| **Morning Burn** | Common | Fire | Spicy bloody before 10am |
| **Capsaicin Curious** | Common | Fire | Spicy bloodies at 2 different venues |
| Brunch Bunch | Uncommon | Confetti | Social achievement |
| Weekend Warrior | Uncommon | Confetti | Dedication milestone |
| Sunday Funday | Uncommon | Confetti | Fun casual achievement |
| Garnished | Uncommon | Confetti | Style points |
| **Pepper Curious** | Uncommon | Fire | Log 3 spicy bloodies |
| **Heat Rising** | Uncommon | Fire | Log 5 spicy bloodies |
| **Double Dare** | Uncommon | Fire | Back-to-back spicy bloodies in one day |
| **Fire Starter** | Uncommon | Fire | Order the spiciest menu option |
| High Roller | Rare | Confetti | Significant spend |
| Mary Marathon | Rare | Confetti | Endurance achievement |
| Bloody Photographer | Rare | Confetti | Documentation effort |
| Strip Sipper | Rare | Confetti | Location coverage |
| Downtown Drinker | Rare | Confetti | Location coverage |
| Off-Strip Explorer | Rare | Confetti | Exploration |
| **Spice Lord** | Rare | Fire | Log 10 spicy bloodies |
| **Sweat Equity** | Rare | Fire | Log a 5-star heat rating bloody |
| Variety Pack | Epic | Confetti | 10 unique bloodies |
| Bloody Baron | Epic | Confetti | 25 bloodies milestone |
| Bloody Mary Connoisseur | Epic | Confetti | 50 bloodies mastery |
| Photo Collector | Epic | Confetti | Documentation mastery |
| **Heat Seeker** | Epic | Fire | Log 25 spicy bloodies |
| Bloody Royalty | Legendary | Explode | 100 bloodies - ultimate |

### SLOTS (23 badges)

| Badge | Tier | Effect | Reasoning |
|-------|------|--------|-----------|
| First Spot | Common | None | Entry-level |
| Note Taker | Common | None | Basic documentation |
| Quick Draw | Common | None | Speed achievement |
| Penny Pincher | Uncommon | Confetti | Denomination focus |
| High Stakes Spotter | Uncommon | Confetti | High denom focus |
| Multi-Denom Master | Uncommon | Confetti | Variety |
| Progressive Hunter | Rare | Confetti | Strategic spotting |
| MHB Specialist | Rare | Confetti | Category expertise |
| Linked Progressive Pro | Rare | Confetti | Category expertise |
| Photo Pro | Rare | Confetti | Documentation |
| Casino Hopper | Rare | Confetti | Coverage |
| Strip Scout | Rare | Confetti | Location mastery |
| Downtown Detective | Rare | Confetti | Location mastery |
| Slot Centurion | Epic | Confetti | 100 spots milestone |
| Category Completionist | Epic | Confetti | All categories |
| Playable Pioneer | Epic | Confetti | Playable focus |
| Slot Savant | Legendary | Explode | 500 spots - ultimate |

### VP (Video Poker - 27 badges)

| Badge | Tier | Effect | Reasoning |
|-------|------|--------|-----------|
| First Hand | Common | None | Entry-level |
| Pay Table Pupil | Common | None | Learning |
| Quick Spot | Common | None | Speed |
| Return Hunter | Uncommon | Confetti | Strategy focus |
| 99% Club | Uncommon | Confetti | Quality finds |
| Full Pay Finder | Rare | Confetti | Excellent finds |
| Unicorn Hunter | Rare | Confetti | 100%+ returns |
| Game Variety | Rare | Confetti | Multiple games |
| Deuces Wild Fan | Rare | Confetti | Game specialty |
| Jacks Expert | Rare | Confetti | Game specialty |
| Bonus Poker Pro | Rare | Confetti | Game specialty |
| Multi-Game Master | Epic | Confetti | Game mastery |
| VP Veteran | Epic | Confetti | 100 spots |
| Pay Table Scholar | Epic | Confetti | Rating expertise |
| VP Virtuoso | Legendary | Explode | 500 spots - ultimate |

### TRIPS (23 badges)

| Badge | Tier | Effect | Reasoning |
|-------|------|--------|-----------|
| Trip Starter | Common | None | First trip |
| Team Player | Common | None | Join a trip |
| First Check-In | Common | None | Basic action |
| Early Arrival | Uncommon | Confetti | Time achievement |
| Night Owl | Uncommon | Confetti | Time achievement |
| Home Base | Uncommon | Confetti | Loyalty |
| Trip Leader | Rare | Confetti | Leadership |
| Full House | Rare | Confetti | Team building |
| Multi-Trip Veteran | Rare | Confetti | Experience |
| Trip Organizer | Epic | Confetti | Multiple trips led |
| Road Warrior | Epic | Confetti | Many trips |
| Trip Legend | Legendary | Explode | Ultimate traveler |

### CASINOS (part of Trips - 11 badges)

| Badge | Tier | Effect | Reasoning |
|-------|------|--------|-----------|
| Casino Curious | Common | None | First visit |
| MGM Explorer | Uncommon | Confetti | Owner coverage |
| Caesars Conqueror | Uncommon | Confetti | Owner coverage |
| Station Local | Uncommon | Confetti | Owner coverage |
| Boyd Buddy | Uncommon | Confetti | Owner coverage |
| Strip Master | Rare | Confetti | Area coverage |
| Downtown Duke | Rare | Confetti | Area coverage |
| Off-Strip Adventurer | Rare | Confetti | Area coverage |
| Casino Collector | Epic | Confetti | Many casinos |
| Vegas Veteran | Epic | Confetti | Significant coverage |
| Casino Royale | Legendary | Explode | All casinos |

---

## Implementation Notes

### Light Ray Colors by Category
```javascript
const rayColors = {
  bloody: { primary: '#dc2626', secondary: '#fca5a5' },
  slot: { primary: '#d4a855', secondary: '#ffd700' },
  vp: { primary: '#22c55e', secondary: '#86efac' },
  trip: { rainbow: true }, // Uses rotating rainbow colors
  casino: { primary: '#a855f7', secondary: '#d8b4fe' },
};
```

### Tier Modifiers
- **Common**: Rays at 30% opacity, slow rotation (8s)
- **Uncommon**: Rays at 50% opacity, medium rotation (6s)
- **Rare**: Rays at 70% opacity, faster rotation (4s)
- **Epic**: Rays at 90% opacity, fast rotation (3s), pulsing
- **Legendary**: Rays at 100% opacity, rainbow shift, fastest (2s)

### Celebration Triggers
- `effect: 'none'` - Just the base animation (spin, shimmer, rays) - Common tier
- `effect: 'confetti'` - Add confetti burst + sparkles - Uncommon/Rare/Epic tiers
- `effect: 'fire'` - Add fire lottie + rising embers + bottom glow - Spicy Bloody badges ONLY (11 badges)
- `effect: 'explode'` - Add explosion lottie + nebula glow - Legendary tier only

---

## Badge Summary

**Total Badges: 95**

| Category | Count |
|----------|-------|
| Bloodies | 31 |
| Slots | 23 |
| VP | 27 |
| Trips | 23 |
| Casinos | 11 |

**Spicy Badges (Fire Effect): 11**
- Common: First Flame, Jalapeño Starter, Morning Burn, Capsaicin Curious (4)
- Uncommon: Pepper Curious, Heat Rising, Double Dare, Fire Starter (4)
- Rare: Spice Lord, Sweat Equity (2)
- Epic: Heat Seeker (1)
