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
- Large single-file component (~57k tokens) containing most UI
- Uses tab-based navigation (Home, Casinos, Spots, Notes tabs)
- Contains SpotterForm for logging slot/video poker finds

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
