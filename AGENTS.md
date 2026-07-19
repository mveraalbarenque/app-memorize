# app-memorize — Project Context for AI Agents

## Tech Stack
- **Runtime:** React 18, TypeScript 5, Vite 5
- **Styling:** CSS Modules (no Tailwind/CSS-in-JS)
- **Architecture:** Clean Architecture (core → application → infrastructure → ui)
- **Linting:** ESLint + Prettier (no semicolons)
- **Package manager:** Yarn 4 (but `package-lock.json` also present — use `npm run` commands)
- **Build commands:**
  - `npm run dev` — dev server
  - `npm run build` — `tsc && vite build`
  - `npm run lint` — ESLint (zero warnings)
  - `npm run preview` — preview build

## Directory Structure
```
src/
├── core/               # Types, constants (no framework deps)
│   ├── types.ts        # ImageData, PlayerConfig, LevelResult, PlayerResult
│   └── constants.ts    # LEVELS[6], DEFAULT_NAMES
├── application/        # Business logic, hooks, services
│   ├── useGame.ts              # Card matching logic & state
│   ├── useGameSession.ts       # Multiplayer session & level progression
│   ├── hooks/useTimer.ts       # Centiseconds timer (50ms interval)
│   ├── services/
│   │   ├── shuffle.ts          # Fisher-Yates shuffle
│   │   ├── format.ts           # formatTime(cs) → "m:ss.cc"
│   │   └── grid.ts             # (DEAD — delete if unused)
│   └── ports/dataService.ts    # Interface
├── infrastructure/
│   └── dataService.ts    # Fetches + caches data.json, shuffles selection
└── ui/
    ├── App.tsx               # Theme, FABs, category modal, screen router
    ├── styles.module.css     # .layout, .fab*, .catModal*, .overlay
    └── components/
        ├── Menu/             # Player config (solo / VS 2-4)
        ├── Game/             # Game board, timer, pause, bottom bar
        ├── Cards/            # Card grid (CSS Grid)
        ├── Card/             # Flip card (CSS 3D transform)
        ├── Categories/       # Category picker modal
        ├── Levels/           # Level selector (UNUSED — kept for future)
        ├── CompleteModal/    # End-game stats (multi/single, table, cards)
        ├── InfoModal/        # Level-complete stats → next level / restart
        ├── TurnModal/        # "Turno de X" between players
        └── Confetti/         # Falling image confetti
```

## Data (`public/data.json`)
Categories (7): `emojis`, `lenguages`, `frameworks`, `tools`, `pokers`, `mario`, `dices`
- Each has 10-14 images (SVGs in `public/categorias/<cat>/`)
- Cards are selected randomly via `shuffle(data[cat]).slice(0, count)`
- Image paths are relative to `public/`, used as `./data.json`

## Level System
- 6 levels defined in `core/constants.ts`:
  | Level | Grid   | Pairs |
  |-------|--------|-------|
  | 1     | 2×2    | 2     |
  | 2     | 2×3    | 3     |
  | 3     | 2×4    | 4     |
  | 4     | 3×4    | 6     |
  | 5     | 4×4    | 8     |
  | 6     | 4×5    | 10    |
- Each Category defines a `levelRange` (e.g. `[1,3]` for easy)
- On mobile (≤767px), certain levels swap columns↔rows: levels 2, 3, 4, 6

## Coding Conventions (CRITICAL for AI agents)
- **No comments** in source code
- **`memo`** wrapping every component (when beneficial — not strictly required for trivial components)
- **`interface Props`** local, destructuring at top
- **`useCallback`** for event handlers (when beneficial — not strictly required for every handler)
- **Props object + spread:** agrupar props normales (sin guión) en un objeto antes del return y esparcirlas con `<div {...propsObj}>`. Props con guión (`aria-label`, etc.), `children`, `ref` van directo en el elemento JSX
- **Classes array:** `[styles.a, cond ? styles.b : ''].filter(Boolean).join(' ')`
- **`handle` prefix** para event handlers (`handleClick`, `handleKeyDown`)
- **CSS Modules** (no inline styles except dynamic values)
- **Accessibility:** `aria-label`, `aria-*`, role attributes, keyboard handling
- **No semicolons** (Prettier)
- **No barrel imports** (import from specific file, not `index.ts`)
- **Default export** for every component
- **Self-closing tags** when no children
- **Orden de imports:** React → type imports → otros imports → CSS module (grupos separados por línea en blanco)

## State Flow
1. `App` renders `MenuScreen` → `Menu` → user selects mode (solo/VS)
2. User picks category via FAB → `Categories` modal
3. `onStart(players, category)` → `GameScreen` keyed to force remount
4. `GameScreen` creates `useGameSession` (level progression) + `Game` (per-level)
5. `Game` uses `useGame` (card logic) + `useTimer` (centiseconds)
6. Level complete → `InfoModal` → next level / turn modal → repeat
7. All levels done → `CompleteModal` with stats

## Key Patterns
- **`gameKey`** in App forces GameScreen remount on restart
- **`doneRef`** in Game prevents double-firing level complete
- **`cancelled` flag** in useGame's load effect prevents state-update-after-unmount
- **Timer** accrues centiseconds; `resetTimer` resets to 0
- **VS modal** allows 2-4 players with editable names
- **Confetti** uses all category images as falling pieces
- **`dataService`** caches `data.json` in module-level `dataCache`
- **Dark/light theme** persisted in localStorage + `data-theme` on `<html>`

## Scripts
- `scripts/split_svg.py` — extracts top-level `<g>` elements into individual SVGs
- `scripts/crop_svg.py` — crops SVG viewBox to content bounds + resizes to 200×200
