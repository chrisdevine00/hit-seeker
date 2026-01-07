# Hit Seeker Refactoring Plan

> **Revised by Director** - Addresses gaps in original SR Developer proposal

## Overview

This plan addresses critical technical debt in the codebase, prioritized by impact and risk.

---

## Pre-Work: Safety Net (Do This First!)

### Why This Matters
You cannot safely refactor a 4,200-line file without automated checks. Period.

### Step 0.1: Add CI Pipeline (Day 1)

Create `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

### Step 0.2: Add Pre-commit Hook (Day 1)
```bash
npm install -D husky lint-staged
npx husky init
```

`.husky/pre-commit`:
```bash
npm run lint && npm run build
```

### Step 0.3: Add Vitest (Day 1)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Add smoke test that just verifies the app renders:
```jsx
// src/App.test.jsx
import { render } from '@testing-library/react';
import App from './App';

test('app renders without crashing', () => {
  // This will catch import errors after refactoring
  expect(() => render(<App />)).not.toThrow();
});
```

---

## Git Strategy

### Branch Naming Convention
```
refactor/phase-1-extract-{component-name}
refactor/phase-2-design-tokens
feature/{feature-name}
fix/{bug-description}
```

### The Golden Rule
> **Never refactor and add features in the same PR.**

### PR Size Limits
- Component extraction: 1 component per PR
- Max 400 lines changed per PR (aim for reviewable chunks)
- Each PR must pass CI before merge

### Workflow
```
main (production)
  └── refactor/extract-machine-carousel (PR #1)
       └── merge to main
  └── refactor/extract-photo-viewer (PR #2)
       └── merge to main
  └── refactor/extract-note-card (PR #3)
       └── merge to main
  ... and so on
```

### Rollback Strategy
- Each extraction is its own PR
- If something breaks: `git revert <commit>`
- Small PRs = easy reverts
- Never squash-merge during refactor (keep granular history)

---

## Timeline Estimate

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 0: Safety Net | 1 day | CI + Tests + Hooks |
| Phase 1: Extract Components | 2 weeks | 8 components extracted |
| Phase 2: Design Tokens | 3 days | Theme constants, Tailwind config |
| Phase 3: State Management | 1 week | Feature contexts |
| Phase 4: TypeScript (gradual) | Ongoing | New files only |
| Phase 5: Testing | Ongoing | Add with each extraction |

**Total: ~4 weeks for Phases 0-3**

---

## Business Continuity

### How to Handle Feature Requests During Refactor

1. **Small features (<2 hours):** Do them on main, then continue refactoring
2. **Medium features (2-8 hours):** Create feature branch from main, merge, then rebase refactor branch
3. **Large features (>8 hours):** Pause refactoring, complete feature, resume

### The 70/30 Rule
- Spend 70% of time on refactoring during active refactor phase
- Reserve 30% for urgent bugs and small features
- Adjust based on business needs

---

---

## Phase 1: Extract Components from App.jsx (High Impact, Low Risk)

### Goal: Break App.jsx from 4,207 lines to ~500 lines

#### Step 1.1: Create Feature Folders
```
src/
├── features/
│   ├── slots/
│   │   ├── components/
│   │   │   ├── MachineCarousel.jsx
│   │   │   ├── MachineDetail.jsx
│   │   │   └── MachineCard.jsx
│   │   ├── hooks/
│   │   │   └── useMachines.js
│   │   └── index.js
│   ├── video-poker/
│   │   ├── components/
│   │   │   ├── VideoPokerTab.jsx
│   │   │   ├── GameSelector.jsx
│   │   │   ├── PayTableSelector.jsx
│   │   │   └── HandAnalyzer.jsx
│   │   └── index.js
│   ├── bloodies/
│   │   ├── components/
│   │   │   ├── BloodiesTab.jsx
│   │   │   ├── LogBloodyModal.jsx
│   │   │   └── BloodyCard.jsx
│   │   └── index.js
│   ├── trip/
│   │   ├── components/
│   │   │   ├── TripOverview.jsx
│   │   │   ├── TeamSection.jsx
│   │   │   └── ActivityFeed.jsx
│   │   └── index.js
│   └── spotter/
│       ├── components/
│       │   ├── SpotterForm.jsx
│       │   └── SpotterModal.jsx
│       └── index.js
```

#### Step 1.2: Extract Each Component
Order of extraction (lowest risk first):
1. `MachineCarousel` - self-contained, pure presentational
2. `PhotoViewer` - self-contained modal
3. `NoteCard` - simple presentational component
4. `MachineDetail` - larger but isolated
5. `VideoPokerTab` - complex but isolated (760 lines)
6. `BloodiesTab` - has its own state
7. `SpotterForm` - form with validation
8. `LogBloodyModal` - modal form

---

## Phase 2: Design Tokens & Theme Constants

### Goal: Eliminate 312 hardcoded color values

#### Step 2.1: Create Theme Constants
```js
// src/lib/tokens.js
export const colors = {
  gold: {
    DEFAULT: '#d4a855',
    hover: '#c49745',
    gradient: {
      from: '#d4a855',
      to: '#d97706', // amber-600
    }
  },
  surface: {
    base: '#0d0d0d',
    raised: '#161616',
    elevated: '#1a1a1a',
  },
  border: {
    default: '#333',
    muted: '#222',
  },
  text: {
    primary: '#ffffff',
    secondary: '#aaaaaa',
    muted: '#888888',
    disabled: '#666666',
  },
  tier: {
    1: { color: 'emerald', ... },
    2: { color: 'amber', ... },
    3: { color: 'red', ... },
  }
};
```

#### Step 2.2: Tailwind Config Integration
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        gold: '#d4a855',
        'surface-base': '#0d0d0d',
        'surface-raised': '#161616',
        // etc
      }
    }
  }
}
```

#### Step 2.3: Find & Replace
Use regex to replace hardcoded values with tokens.

---

## Phase 3: State Management Refactor

### Goal: Reduce 74 useState calls, eliminate prop drilling

#### Step 3.1: Create Feature-Specific Contexts
```jsx
// src/features/slots/context/SlotsContext.jsx
const SlotsContext = createContext(null);

export function SlotsProvider({ children }) {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const [selectedCategory, setSelectedCategory] = useState('all');
  // ... grouped state

  return (
    <SlotsContext.Provider value={{ ... }}>
      {children}
    </SlotsContext.Provider>
  );
}
```

#### Step 3.2: Create Storage Abstraction
```js
// src/lib/storage.js
const KEYS = {
  BLOODIES: 'hitseeker_bloodies',
  ONBOARDED: 'hitseeker_onboarded',
  VIEW_MODE: 'hitseeker_view_mode',
  LEFT_HANDED: 'hitseeker_left_handed',
  EARNED_BADGES: 'hitseeker_earned_badges',
} as const;

export const storage = {
  get: (key) => {
    const value = localStorage.getItem(KEYS[key]);
    return value ? JSON.parse(value) : null;
  },
  set: (key, value) => {
    localStorage.setItem(KEYS[key], JSON.stringify(value));
  },
  // Migration support
  version: 1,
  migrate: () => { ... }
};

// Hook version
export function useStorage(key, defaultValue) {
  const [value, setValue] = useState(() => storage.get(key) ?? defaultValue);

  const setAndPersist = useCallback((newValue) => {
    setValue(newValue);
    storage.set(key, newValue);
  }, [key]);

  return [value, setAndPersist];
}
```

---

## Phase 4: TypeScript Migration

### Goal: Type safety for complex data structures

#### Step 4.1: Add TypeScript Configuration
```bash
npm install -D typescript @types/react @types/react-dom
npx tsc --init
```

#### Step 4.2: Priority Files to Type First
1. `src/data/machines.ts` - Machine types
2. `src/data/vpGames.ts` - VP game types
3. `src/badges/definitions.ts` - Badge types
4. `src/context/TripContext.tsx` - Trip/CheckIn types

#### Step 4.3: Create Core Types
```typescript
// src/types/index.ts
export interface Machine {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  category: MachineCategory;
  description?: string;
}

export interface VPGame {
  id: string;
  name: string;
  category: VPCategory;
  payTables: PayTable[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  domain: 'slot' | 'vp' | 'bloody' | 'trip';
  tier: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
}
```

---

## Phase 5: Testing Infrastructure

### Goal: Confidence in refactoring, prevent regressions

#### Step 5.1: Setup Testing Framework
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

#### Step 5.2: Priority Tests
1. **VP Strategy Logic** - Most complex, highest risk
   - `src/data/vpStrategies.test.ts`
   - `src/utils/vpAnalysis.test.ts`

2. **Badge Checkers** - Business logic
   - `src/badges/checkers/*.test.ts`

3. **Component Tests** - After extraction
   - `src/features/slots/components/*.test.tsx`

---

## Phase 6: Constants & Enums

### Goal: Eliminate magic strings

```typescript
// src/constants/index.ts
export const TAB_IDS = {
  HUNT: 'hunt',
  VP: 'vp',
  BLOODIES: 'bloodies',
  TRIP: 'trip',
} as const;

export const SPOT_TYPES = {
  SLOT: 'slot',
  VP: 'vp',
  BLOODY: 'bloody',
} as const;

export const STORAGE_KEYS = {
  BLOODIES: 'hitseeker_bloodies',
  ONBOARDED: 'hitseeker_onboarded',
  // ...
} as const;
```

---

## Implementation Priority

| Phase | Effort | Impact | Risk | Priority |
|-------|--------|--------|------|----------|
| 1. Extract Components | High | Very High | Low | 🔴 Do First |
| 2. Design Tokens | Medium | High | Low | 🟠 Second |
| 3. State Management | High | High | Medium | 🟡 Third |
| 4. TypeScript | High | Medium | Medium | 🟢 Fourth |
| 5. Testing | Medium | High | Low | 🟢 Fourth |
| 6. Constants | Low | Medium | Very Low | 🔵 Anytime |

---

## Quick Wins (Can Do Today)

1. **Move `tierColors` outside component** - Prevents recreation every render
2. **Create `src/constants/index.js`** - Start collecting magic strings
3. **Extract `MachineCarousel`** - Simplest component, good practice
4. **Add Vitest** - Setup testing infrastructure even if no tests yet

---

## Metrics to Track

Before refactoring, establish baselines:
- App.jsx line count: 4,207
- Total useState in App.jsx: 74
- Hardcoded colors: 312
- Test coverage: 0%
- Bundle size: 1,084 KB

Target after Phase 1-2:
- App.jsx line count: < 600
- useState in App.jsx: < 15
- Hardcoded colors: 0
- Test coverage: > 30%

---

## 📋 Action Plan Checklist

### Week 0: Safety Net (Day 1)
- [ ] Create `.github/workflows/ci.yml`
- [ ] Push and verify CI runs on GitHub
- [ ] `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] Create `vitest.config.js`
- [ ] Create `src/App.test.jsx` smoke test
- [ ] Add `"test": "vitest"` to package.json scripts
- [ ] Run tests locally, verify passing
- [ ] `npm install -D husky lint-staged`
- [ ] `npx husky init`
- [ ] Configure pre-commit hook
- [ ] Commit: "chore: add CI pipeline, testing, and pre-commit hooks"

### Week 1: Component Extraction (Part 1)
**Day 1-2: MachineCarousel**
- [ ] Create `src/features/slots/components/MachineCarousel.jsx`
- [ ] Move component code from App.jsx
- [ ] Add proper imports/exports
- [ ] Update App.jsx to import from new location
- [ ] Run tests, verify build
- [ ] Create PR: `refactor/extract-machine-carousel`
- [ ] Merge to main

**Day 3: PhotoViewer**
- [ ] Create `src/components/common/PhotoViewer.jsx`
- [ ] Move component code from App.jsx
- [ ] Run tests, verify build
- [ ] Create PR: `refactor/extract-photo-viewer`
- [ ] Merge to main

**Day 4: NoteCard & NoteForm**
- [ ] Create `src/features/notes/components/NoteCard.jsx`
- [ ] Create `src/features/notes/components/NoteForm.jsx`
- [ ] Move component code from App.jsx
- [ ] Run tests, verify build
- [ ] Create PR: `refactor/extract-note-components`
- [ ] Merge to main

**Day 5: MachineDetail**
- [ ] Create `src/features/slots/components/MachineDetail.jsx`
- [ ] Move component code from App.jsx
- [ ] Run tests, verify build
- [ ] Create PR: `refactor/extract-machine-detail`
- [ ] Merge to main

### Week 2: Component Extraction (Part 2)
**Day 1-2: VideoPokerTab (largest)**
- [ ] Create `src/features/video-poker/components/VideoPokerTab.jsx`
- [ ] Create `src/features/video-poker/components/GameSelector.jsx`
- [ ] Create `src/features/video-poker/components/PayTableGrid.jsx`
- [ ] Move component code, break into sub-components
- [ ] Run tests, verify build
- [ ] Create PR: `refactor/extract-video-poker-tab`
- [ ] Merge to main

**Day 3: BloodiesTab & LogBloodyModal**
- [ ] Create `src/features/bloodies/components/BloodiesTab.jsx`
- [ ] Create `src/features/bloodies/components/LogBloodyModal.jsx`
- [ ] Move component code from App.jsx
- [ ] Run tests, verify build
- [ ] Create PR: `refactor/extract-bloodies-components`
- [ ] Merge to main

**Day 4: SpotterForm**
- [ ] Create `src/features/spotter/components/SpotterForm.jsx`
- [ ] Move component code from App.jsx
- [ ] Run tests, verify build
- [ ] Create PR: `refactor/extract-spotter-form`
- [ ] Merge to main

**Day 5: Review & Cleanup**
- [ ] Review App.jsx line count (target: < 1500)
- [ ] Remove any dead code
- [ ] Update all barrel exports (index.js files)
- [ ] Document new folder structure in README
- [ ] Celebrate 🎉

### Week 3: Design Tokens & Constants
**Day 1: Constants File**
- [ ] Create `src/constants/index.js`
- [ ] Add TAB_IDS, SPOT_TYPES, STORAGE_KEYS
- [ ] Move `tierColors` from MainApp to constants
- [ ] Move `NAV_TABS` to constants
- [ ] Update imports across codebase
- [ ] Create PR: `refactor/add-constants`
- [ ] Merge to main

**Day 2-3: Design Tokens**
- [ ] Create `src/lib/tokens.js` with color definitions
- [ ] Update `tailwind.config.js` with theme colors
- [ ] Replace hardcoded colors in extracted components first
- [ ] Create PR: `refactor/design-tokens`
- [ ] Merge to main

**Day 4-5: Storage Abstraction**
- [ ] Create `src/lib/storage.js`
- [ ] Create `src/hooks/useStorage.js`
- [ ] Replace direct localStorage calls
- [ ] Create PR: `refactor/storage-abstraction`
- [ ] Merge to main

### Week 4: State Management
**Day 1-2: Slots Context**
- [ ] Create `src/features/slots/context/SlotsContext.jsx`
- [ ] Move slot-related state from MainApp
- [ ] Update components to use context
- [ ] Create PR: `refactor/slots-context`
- [ ] Merge to main

**Day 3-4: UI Context**
- [ ] Create `src/context/UIContext.jsx` for modals/navigation state
- [ ] Move modal visibility state from MainApp
- [ ] Update components to use context
- [ ] Create PR: `refactor/ui-context`
- [ ] Merge to main

**Day 5: Final Review**
- [ ] Review App.jsx line count (target: < 600)
- [ ] Review useState count (target: < 15)
- [ ] Run full test suite
- [ ] Update metrics in this document
- [ ] Plan next iteration if needed

---

## Revised Phase Priority

| Priority | Phase | Why This Order |
|----------|-------|----------------|
| 0 | Safety Net | Can't refactor safely without CI/tests |
| 1 | Extract Components | Biggest impact, enables everything else |
| 2 | Constants & Tokens | Quick wins, low risk, helps with extraction |
| 3 | State Management | Now that components are isolated |
| 4 | TypeScript | Add to new files as you create them |
| 5 | More Tests | Add as you go, not as a phase |

---

## Definition of Done

A component extraction is complete when:
- [ ] Component is in its own file in the correct feature folder
- [ ] All imports/exports work correctly
- [ ] App builds successfully (`npm run build`)
- [ ] Smoke test passes (`npm test`)
- [ ] No console errors in dev mode
- [ ] PR is reviewed and merged to main
- [ ] Old code is removed from App.jsx

---

## Emergency Rollback Procedure

If a refactoring PR breaks production:

```bash
# 1. Identify the bad commit
git log --oneline -10

# 2. Revert it
git revert <bad-commit-sha>

# 3. Push immediately
git push origin main

# 4. Investigate on a branch, not main
git checkout -b fix/investigate-broken-refactor
```

---

## Success Criteria

This refactoring project is successful when:

1. **App.jsx is under 600 lines** (currently 4,207)
2. **CI pipeline catches errors before deploy**
3. **Components are in feature folders**
4. **New developers can understand the codebase in < 1 hour**
5. **Adding a new feature doesn't require touching App.jsx**
6. **Test coverage is > 30%**
