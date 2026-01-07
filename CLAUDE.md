# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # Production build to dist/
npm run lint         # ESLint check
npm run preview      # Preview production build locally

# Mobile builds (Capacitor)
npm run cap:sync     # Build + sync to iOS/Android
npm run cap:ios      # Build, sync, and open Xcode
npm run cap:android  # Build, sync, and open Android Studio
```

## Architecture Overview

Hit Seeker is a React application for advantage slot machine scouting, built with Vite and deployed via Capacitor to iOS/Android.

### Tech Stack
- **React 19** with Vite 7
- **Tailwind CSS v4** (via @tailwindcss/vite plugin)
- **Supabase** for auth (Google OAuth) and database
- **Capacitor** for native iOS/Android builds
- **Lucide React** for icons

### Key Architecture Patterns

**Authentication Flow** (`src/context/AuthContext.jsx`):
- Google OAuth via Supabase
- Deep link handling for native apps (`hitseeker://auth/callback`)
- Uses `@capacitor/browser` to open OAuth in system browser on native
- Native platform detection via `window.Capacitor?.isNativePlatform?.()`

**Trip-Based Data Model** (`src/context/TripContext.jsx`):
- All data is scoped to "trips" (e.g., "Vegas January 2025")
- Users join trips via share codes
- Trips have owners and members with role-based access

**Realtime Features** (`src/hooks/useCheckIns.js`):
- Supabase realtime subscriptions for live updates
- Used for check-ins to track which trip members are at which casinos

**Main App Structure** (`src/App.jsx`):
- Orchestrates tab navigation and global modals (~545 lines after refactor)
- Tab components extracted to `src/features/` and `src/components/tabs/`
- Uses tab-based navigation (Hunt, VP, Trip, Bloodies tabs)

**Badge System** (`src/badges/`):
- 104 badges across 4 domains: bloody (31), slot (23), VP (27), trip (23)
- Checker functions compute earned badges from user data
- BadgeUnlockModal shows celebration effects on unlock
- HexBadge component for badge display in galleries

### Data Files

- `src/data/casinos.js` - Vegas casino database with locations, owners, slot counts
- `src/data/machines.js` - Slot machine categories and types
- `src/data/vpGames.js` - Video poker game variants and pay tables
- `src/data/vpStrategies.js` - Video poker strategy logic (Wizard of Odds-based)

### Supabase Tables
Key tables (inferred from code):
- `profiles` - User profiles
- `trips` - Trip metadata
- `trip_members` - User-trip relationships with roles
- `check_ins` - Casino check-in tracking
- Notes and photos attached to trips

### Mobile-Specific Considerations

- iOS safe area insets handled via CSS custom properties (`--sat`, `--sab`)
- Deep link scheme: `hitseeker://`
- iOS minimum version: 15.0
- App ID: `com.hitseeker.app`

## Roadmap

### ✅ Spotter Badges System (Completed)
Achievement badges for slot and VP spotting implemented in `src/badges/`:

**Implemented:**
- 23 Slot badges (milestones, tier-specific, coverage, photo documentation)
- 27 VP badges (milestones, game variety, high-return finds, denomination)
- 23 Trip badges (trip basics, check-ins, ownership, regions)
- Unified badge gallery in Trip tab with collapsible sections
- Celebration effects on unlock (confetti, fire, explosions based on tier)

### ✅ User Settings Screen (Completed)
Unified settings screen in `src/components/features/SettingsScreen.jsx`:

**Implemented:**
- Account info display (avatar, email, profile name)
- Sign out button
- Haptics toggle (enable/disable vibration feedback)
- Default view mode preference (cards vs list)
- Left-handed mode toggle
- Trip settings (share code, members, switch trip)

### Future Considerations
- Sync Bloodies to cloud (currently localStorage only - lost on device switch)
- Delete account option (GDPR/privacy compliance)
- TypeScript migration (optional)
- Code splitting for bundle size optimization

### iOS Testing Needed
- Test badge galleries and unlock celebrations on device
- Verify haptics toggle works with native vibration
- Test settings screen layout on various device sizes
