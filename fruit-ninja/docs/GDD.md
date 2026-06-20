# 2. Game Design Document (GDD) — Ninja Fruit

Version 1.0 · Target: HTML5 (web + Capacitor native)

---

## 2.1 Core loop
1. Player selects a mode.
2. Objects are launched from the bottom on ballistic arcs.
3. Player swipes to slice fruit, building combos, while avoiding bombs.
4. Run ends (mode-specific). Score is banked; coins are awarded.
5. Coins → shop skins; play → achievements, daily streak, leaderboard.
6. Return → repeat (daily reward nudges re-engagement).

---

## 2.2 Objects

### Fruit (slice for points)
| Fruit | Radius (world px) | Base score | Spawn weight | Notes |
|-------|------|------|------|------|
| Apple | 70 | 10 | 22 | Most common |
| Orange | 72 | 10 | 20 | Segmented art |
| Banana | 74 | 10 | 16 | Curved shape |
| Watermelon | 92 | 15 | 14 | Big, juicy |
| Kiwi | 64 | 12 | 14 | Cross-section art |
| Strawberry | 60 | 12 | 14 | Small, agile |

### Hazards
| Object | Effect on correct interaction | Effect if mishandled |
|--------|-------------------------------|----------------------|
| **Bomb** 💣 | — (must be *avoided*) | Slicing it: instant fail (Classic/Survival) or −50 pts (Arcade) + shake/flash |
| **Frost Bomb** ❄ | Slicing it triggers **4 s slow-motion** (gravityScale 0.45) — easier slicing | None (it's beneficial; risk is mistaking it for a bomb under pressure) |
| **Gold Bomb** ★ | Slicing it awards **+50 pts & +5 coins** | Letting it fall wastes the bonus |

> **Readability:** bombs are dark with a red glow; frost bombs blue + ❄; gold
> bombs gold + ★. Glow intensity telegraphs them at distance.

---

## 2.3 Controls
- **Swipe** (touch) or **drag** (mouse) creates a blade segment each frame.
- A slice registers when the blade segment passes within a fruit's hit radius
  (segment-circle distance test).
- Multi-fruit in a single stroke ⇒ **perfect** combo bonus.
- `P` / `Esc` pause; auto-pause on tab/app background.

---

## 2.4 Scoring

```
points = baseScore
       × comboMultiplier          // +50% per combo tier above 1
       × (crit ? 2.0 : 1.0)       // critical hit = +100%
       × (perfect ? 3.0 : 1.0)    // 3+ in one stroke = +200% bonus pool
```

| Rule | Value |
|------|-------|
| Base fruit | 10 (watermelon 15, kiwi/strawberry 12) |
| Combo bonus | +50% per tier (x2 = 1.5×, x3 = 2.0×, x4 = 2.5×, x5 = 3.0× …) |
| Critical hit chance | 12% → ×2 |
| Perfect combo (≥3 in one swipe) | ×3 on those fruit |
| Combo window | 600 ms rolling |
| Gold bomb | +50 pts, +5 coins |

Coins: **1 per fruit sliced** (banked at run end) plus gold-bomb & achievement &
daily bonuses.

---

## 2.5 Game modes

### Classic
- **3 lives.** Miss a fruit → −1 life. Slice a bomb → instant game over.
- Win condition: none (endless); goal is high score / survival.

### Arcade
- **60-second** score rush, **no lives.**
- Bombs cost **−50 pts** + screen shake (no death).
- Periodic **frenzy** waves (10-fruit flurries) for big combos.
- "Win" screen on time-up (it's a score celebration, not a fail).

### Survival
- **One life.** A single miss *or* bomb ends the run.
- **20% faster** spawns and **+1** wave size vs. baseline.
- Tracks survival time (drives the "Survivor" achievement at 60 s).

---

## 2.6 Difficulty curve
Difficulty **level** = `floor(elapsedMs / 30000)`, capped at 12. Derived values
interpolate from level 0 → max:

| Parameter | Level 0 | Level 12 |
|-----------|---------|----------|
| Spawn interval | 1300 ms | 380 ms |
| Wave size | 1 | 5 (±1) |
| Bomb chance | 6% | 22% |

Survival multiplies pacing by 0.8 and wave size by +1 on top of this.

---

## 2.7 Economy

| Source | Coins |
|--------|-------|
| Fruit sliced | 1 each |
| Gold bomb | 5 |
| Daily reward (day 1→7) | 25, 40, 60, 90, 130, 180, 300 |
| Achievements | 10–200 (one-time) |

### Sinks — Blade skins (cosmetic only)
| Skin | Price |
|------|-------|
| Classic Steel | 0 (default) |
| Ember | 150 |
| Toxic | 200 |
| Frostbite | 250 |
| Plasma | 400 |
| Midas | 750 |
| Prismatic | 1200 |

Tuning intent: a focused player unlocks their first paid skin within ~3–5 runs,
the mid tier within a week of casual play, and the top skin as a long-term goal —
a healthy retention ladder without paywalls.

---

## 2.8 Meta systems
- **Achievements** (10): first slice, combo 5/10, slice 100/1000, score 500/2000,
  gold hit, survive 60 s, hold 1000 coins. Award coins on unlock.
- **Daily rewards:** 7-day streak ladder; missing a day resets to day 1.
- **Leaderboards:** top-10 local scores per mode, dated.
- **Persistence:** one versioned LocalStorage blob (`ninja_fruit_save_v1`).

---

## 2.9 Audio design
Procedural Web Audio. Mapping (see `AudioSystem.js`):
slice (whoosh+splat) · bomb (noise+sub boom) · frost (downward sweep) · gold
(bright arpeggio) · combo (rising tone scaled by tier) · score blip · game-over
(descending saw) · UI tap.

---

## 2.10 Visual design
- **Palette:** night-dojo navy (`#06101f`→`#0b1f3a`) background; neon-fruit
  accents (watermelon red `#ff4d6d`, gold `#ffce3a`, leaf green `#3fae5a`,
  frost blue `#3aa0d6`).
- **Effects:** glowing blade ribbon, sliced halves with inner flesh, juice
  particles, expanding rings, explosion debris, screen shake, full-screen flash,
  vignette, slow-mo desaturated feel.
- **UI:** glassmorphism panels, large tap targets (≥48 px), safe-area aware,
  fluid `clamp()` sizing from phone to Full HD, portrait-first with landscape
  fallback.
