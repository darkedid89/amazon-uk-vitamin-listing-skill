# 3. Architecture — Ninja Fruit

## 3.1 Goals
- **Clean separation** of simulation, rendering, input, data and presentation.
- **SOLID** throughout; easy to extend (new fruit, mode, skin, achievement =
  data edits, not engine surgery).
- **Deterministic, smooth, GC-quiet** runtime for stable 60 FPS on mobile.

## 3.2 Layered overview

```
                ┌──────────────────────────────┐
                │            main.js            │  Composition root (DI)
                └──────────────┬───────────────┘
        constructs & injects   │
   ┌───────────────┬───────────┴───────────┬────────────────┐
   ▼               ▼                       ▼                ▼
 Game            UIManager              Storage          AudioSystem
(mediator)      (DOM screens)         (LocalStorage)    (Web Audio)
   │  owns                                ▲ used by Shop / Achievements / Daily
   ▼
 ┌─────────────────────────────────────────────────────────┐
 │  Systems (pure logic, talk via results + EventBus)       │
 │  Difficulty · Spawn · Slice · Combo · Score · Particle   │
 └─────────────────────────────────────────────────────────┘
   │ act on
   ▼
 Entities (Fruit, Particle) ── pooled via ObjectPool
   │ drawn by
   ▼
 Renderer + SpriteFactory  (Canvas 2D, cached bitmaps)
```

All cross-cutting notifications flow through the **EventBus** (`fruit:sliced`,
`combo`, `score`, `bomb:hit`, `game:over`, `achievement`, …). The UI, audio and
achievement layers *observe*; gameplay never reaches into them.

## 3.3 Key patterns
| Pattern | Where | Why |
|---------|-------|-----|
| **Composition root / DI** | `main.js` | One place builds the graph; no global singletons → testable. |
| **Mediator** | `Game` | Wires systems into a shallow star, not a web of cross-refs. |
| **Strategy** | `modes/Modes.js` | Each mode is a swappable policy; engine is mode-agnostic (Open/Closed). |
| **Object Pool** | `core/ObjectPool.js` | Recycle fruit & particles → no GC spikes during intense play. |
| **Pub/Sub (Observer)** | `core/EventBus.js` | Decouple producers (systems) from consumers (UI/audio/meta). |
| **Data-driven config** | `config/*` | Fruit, balance, economy are data; adding content ≠ touching logic. |
| **Flyweight / sprite cache** | `SpriteFactory` | Render expensive art once, blit cached bitmaps each frame. |

## 3.4 The loop (`GameLoop.js`)
Fixed-timestep accumulator at **120 Hz** simulation, decoupled from the display
refresh. The renderer interpolates entity positions with `alpha` for smoothness
at any FPS. Frame gaps are clamped (`MAX_FRAME_MS`) to avoid the "spiral of
death" after a tab switch. This guarantees identical physics/balance on a 60 Hz
phone and a 144 Hz desktop.

## 3.5 Coordinate system
The world is simulated in a fixed **1080×1920** virtual space. `Renderer.resize()`
computes a *cover* transform (scale + centre offset) to fill any viewport, so
balance (sizes, gravity, reachable apex) is identical on every device.
`InputManager` inverts this transform to map pointer events back into world space.

## 3.6 Slicing (game-feel core, `SliceSystem.js`)
Each frame the latest blade segment is tested against every live object using a
segment-to-circle distance test. Hits are routed by `kind`:
- `fruit` → score (combo × crit × perfect) + halves + juice + ring + SFX
- `bomb` → explosion + fail/penalty (mode decides)
- `freeze` → 4 s slow-motion (gravityScale)
- `gold` → bonus points/coins + sparks

`strokeKills` (kills since the blade went down) detects **perfect** multi-slices.

## 3.7 Memory & rendering optimisation
- **Pools** for `Fruit` (60 pre-alloc) and `Particle` (400 pre-alloc); `sweep()`
  compacts live arrays in place — no per-frame allocations in the hot path.
- **SpriteFactory** pre-renders each object (and its two sliced halves) to an
  offscreen canvas at DPR; the per-frame cost is a textured `drawImage`, never
  re-running gradients/paths.
- **DPR capped** at 2 to bound fill-rate on retina phones.
- **Single context, batched transforms**; full-screen effects (flash, vignette)
  are cheap rect fills.

## 3.8 Extensibility cookbook
- **New fruit:** add one entry to `FruitTypes.js` (+ optional `shape` branch in
  `SpriteFactory`). Done.
- **New mode:** add a Strategy class in `Modes.js` and register it; UI button via
  `data-mode`.
- **New skin:** one entry in `Shop.js#BLADE_SKINS`.
- **New achievement:** one entry in `Achievements.js#ACHIEVEMENTS`.
- **Cloud save:** reimplement `Storage` over your backend; nothing else changes.

## 3.9 SOLID notes
- **S** — each system has one reason to change (scoring vs. spawning vs. combos…).
- **O** — modes/fruit/skins/achievements extend via data/strategy, not edits.
- **L** — all modes honour the same Mode contract; all entities the Entity API.
- **I** — systems receive only the collaborators they need (constructor injection).
- **D** — high-level UI depends on EventBus abstractions, not gameplay internals.
