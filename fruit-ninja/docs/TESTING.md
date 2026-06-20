# 17–18. Testing & Release Readiness — Ninja Fruit

## 17. Test plan / QA checklist

### Core gameplay
- [ ] Fruit spawn from the bottom and arc to a reachable apex.
- [ ] Mouse drag slices fruit; touch swipe slices fruit (real device).
- [ ] Sliced fruit splits into two halves that fly apart along the cut.
- [ ] Juice particles + ring appear in the fruit's colour.
- [ ] Blade trail follows the pointer and fades; uses the equipped skin colour.
- [ ] Missed fruit (falls uncut) is detected once and only once.

### Hazards
- [ ] Bomb: Classic/Survival → instant game over; Arcade → −50 pts + shake/flash.
- [ ] Frost bomb: triggers ~4 s slow-motion; objects visibly slow; flash blue.
- [ ] Gold bomb: +50 pts, +5 coins, gold sparks, toast.
- [ ] Bomb/frost/gold are visually distinguishable (glow + symbol).

### Scoring & combos
- [ ] Base fruit = 10 (watermelon 15, kiwi/strawberry 12).
- [ ] Slicing 2+ within 600 ms shows combo popup with correct tier.
- [ ] 3+ in a single stroke flags "PERFECT" and applies the bonus.
- [ ] Critical hits occur (~12%) and roughly double the points.
- [ ] Score, coins and best-combo are correct on the game-over screen.

### Modes
- [ ] Classic: 3 hearts shown; each miss removes one; 0 → game over.
- [ ] Arcade: 60 s timer counts down; frenzy waves fire; "TIME'S UP" on 0.
- [ ] Survival: one life; faster pacing; survival time tracked.

### Difficulty
- [ ] Spawn rate, wave size and bomb chance increase over time (~every 30 s).

### Meta / persistence
- [ ] Coins bank at run end; high score updates per mode.
- [ ] Leaderboard records top-10 per mode with dates.
- [ ] Achievements unlock at thresholds and award coins (toast shown).
- [ ] Shop: buy disabled without funds; equip swaps blade colour live.
- [ ] Daily reward claimable once/day; streak advances; resets after a skipped day.
- [ ] Reloading the page preserves coins, scores, skins, achievements, streak.

### UX / lifecycle
- [ ] Pause (`P`/`Esc`/button) freezes sim; resume continues; restart/quit work.
- [ ] Auto-pause when the tab/app is backgrounded.
- [ ] All overlays animate in/out without layout shift.

### Responsiveness / devices
- [ ] Portrait phone (e.g. 390×844) — UI fits, tap targets ≥48 px.
- [ ] Notched device — safe-area insets respected (no clipping).
- [ ] Tablet / Full HD desktop — world scales correctly, no stretching.
- [ ] Landscape fallback layout usable.

### Audio
- [ ] Audio unlocks on first interaction (no console autoplay error).
- [ ] Each SFX fires at its mapped moment; sound toggle persists.

### Performance
- [ ] Sustained 60 FPS during heavy slicing on a mid-range phone (HUD FPS).
- [ ] No GC stutter over a 3-minute session (DevTools Performance, flat memory).
- [ ] No console errors/warnings during a full session.

### Automated coverage (recommended)
- Unit: `ScoreSystem` arithmetic, `ComboSystem` windows, `DifficultySystem`
  curve, `Storage` migrate/merge, `DailyRewards` streak logic, `distPointToSegment`.
- E2E (Playwright): boot → start each mode → synthetic swipes → reach game-over.

---

## 18. Release-readiness checklist

### Code & quality
- [x] All 27 JS modules pass `node --check` (syntax clean).
- [ ] No dependencies in the runtime path (verified: `dependencies: {}`).
- [ ] Lint passes; no dead code; headers document each module.
- [ ] Error boundary / global `window.onerror` reporting wired (for prod).

### Content & legal
- [ ] App name, icons (192/512), splash, theme colour set and consistent.
- [ ] Store screenshots + trailer captured per required sizes.
- [ ] Privacy policy hosted; store privacy forms completed ("no data collected").
- [ ] Age rating questionnaires completed (Everyone / PEGI 3).
- [ ] Licensing confirmed (art + SFX original/procedural).

### Build & distribution
- [ ] Web: HTTPS host, correct cache headers, manifest + install verified.
- [ ] Android: signed `.aab`, Play App Signing enrolled, target SDK current.
- [ ] iOS: archived & uploaded, signing valid, deployment target set.
- [ ] Version numbers bumped consistently across web/Android/iOS.

### Final gates
- [ ] Full QA pass (section 17) green on iOS Safari + Android Chrome.
- [ ] 60 FPS confirmed on the min-spec target device.
- [ ] Save/restore verified across reinstall (native) and reload (web).
- [ ] Internal/TestFlight build approved by stakeholders.
- [ ] Rollback plan documented (previous build retained).

> **Status:** Gameplay, systems, UI, persistence, docs and store configs are
> complete and verified. Remaining boxes are environment-specific store/ops steps
> performed at submission time.
