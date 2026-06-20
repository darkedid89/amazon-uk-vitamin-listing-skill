# 🥷 Ninja Fruit — HTML5 Arcade Slicer

A polished, **dependency-free** HTML5 / Canvas / ES6 fruit-slicing arcade game,
engineered to AAA-mobile production standards and ready to ship to the web or to
the App Store / Google Play via **Capacitor** or **Cordova**.

> Slice fruit with mouse or touch, build combos, dodge bombs, freeze time, and
> chase the high score across three game modes.

---

## ✨ Highlights

- **Zero runtime dependencies.** Pure ES6 modules, Canvas 2D, Web Audio. No build
  step required to play.
- **Three modes** — Classic (lives), Arcade (60s rush), Survival (one life).
- **Full game feel** — ballistic physics, fruit spin, sliced halves, juice
  particles, blade trail, screen shake, slow-mo frost, critical hits, combos x2–x5+.
- **Meta-progression** — coins, shop with 7 cosmetic blade skins, 10 achievements,
  7-day daily-reward ladder, per-mode leaderboards, LocalStorage save.
- **Performance-first** — fixed 120 Hz simulation, interpolated render, object
  pooling for fruit & particles, cached sprite bitmaps → stable 60 FPS on mobile.
- **Procedural everything** — art is drawn at runtime (SVG mirrors in
  `/assets/sprites`), SFX synthesised via Web Audio. Tiny footprint, no binaries.

---

## 🚀 Quick start

ES6 modules require an HTTP origin (they won't load from `file://`). Use any
static server:

```bash
cd fruit-ninja

# Option A — Node (no install)
npx serve . -l 5173

# Option B — Python
python3 -m http.server 5173

# Option C — npm script
npm start
```

Then open <http://localhost:5173>.

---

## 🎮 Controls

| Input | Action |
|------|--------|
| Mouse drag / finger swipe | Slice |
| `P` or `Esc` | Pause / resume |
| Pause menu | Restart / quit |

---

## 📚 Documentation

| Doc | Contents |
|-----|----------|
| [`docs/CONCEPT.md`](docs/CONCEPT.md) | Concept & pillars |
| [`docs/GDD.md`](docs/GDD.md) | Full Game Design Document (mechanics, economy, balance) |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Architecture, module map, data flow, SOLID notes |
| [`docs/DEPLOY.md`](docs/DEPLOY.md) | Web hosting + Capacitor/Cordova mobile builds |
| [`docs/PUBLISH.md`](docs/PUBLISH.md) | Google Play & App Store submission guide |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Future improvements & commercial scaling plan |
| [`docs/TESTING.md`](docs/TESTING.md) | QA test plan + release-readiness checklist |

---

## 🗂 Project structure

```
fruit-ninja/
├── index.html                 # App shell: canvas + all DOM screens
├── manifest.json              # PWA manifest (installable)
├── capacitor.config.json      # Capacitor native wrapper config
├── package.json               # Scripts + Capacitor CLI devDependency
├── css/
│   └── style.css              # Full UI theme (glassmorphism, responsive)
├── assets/
│   ├── sprites/*.svg          # Designer-swappable fruit/bomb art
│   └── icons/*.svg            # App / PWA icons
├── docs/                      # Concept, GDD, architecture, deploy, publish…
└── js/
    ├── main.js                # Composition root (dependency injection)
    ├── config/
    │   ├── Config.js          # All tunable balance values
    │   └── FruitTypes.js      # Data-driven object definitions
    ├── core/
    │   ├── Game.js            # Mediator: wires systems, owns run-state
    │   ├── GameLoop.js        # Fixed-timestep + interpolated render
    │   ├── InputManager.js    # Unified mouse/touch → world-space blade
    │   ├── ObjectPool.js      # Generic recycling pool (GC-free gameplay)
    │   ├── EventBus.js        # Pub/sub decoupling systems ↔ UI
    │   └── Mathx.js           # Allocation-free math helpers
    ├── entities/
    │   ├── Entity.js          # Base (interpolation-aware)
    │   ├── Fruit.js           # All spawnables (fruit + bomb kinds)
    │   └── Particle.js        # Juice / sparks / halves / rings
    ├── systems/
    │   ├── SpawnSystem.js     # What & when to throw
    │   ├── DifficultySystem.js# Time → difficulty curve
    │   ├── SliceSystem.js     # Collision + hit routing (game feel core)
    │   ├── ComboSystem.js     # Combo windows & multipliers
    │   ├── ScoreSystem.js     # All scoring arithmetic
    │   ├── ParticleSystem.js  # Effect recipes + particle pool
    │   └── AudioSystem.js     # Procedural Web Audio SFX
    ├── modes/
    │   └── Modes.js           # Classic / Arcade / Survival strategies
    ├── render/
    │   ├── Renderer.js        # Canvas, viewport scaling, all draw calls
    │   └── SpriteFactory.js   # Procedural art → cached bitmaps
    ├── data/
    │   ├── Storage.js         # LocalStorage gateway (versioned save)
    │   ├── Achievements.js    # Achievement registry + tracker
    │   ├── Shop.js            # Blade-skin catalogue + purchase/equip
    │   └── DailyRewards.js    # 7-day login streak ladder
    └── ui/
        └── UIManager.js       # All DOM screens, HUD, overlays
```

---

## 📱 Going mobile (Capacitor)

```bash
npm install
npx cap add android      # and/or: npx cap add ios
npx cap sync
npx cap open android     # opens Android Studio
```

Full step-by-step (signing, store assets, submission) in
[`docs/DEPLOY.md`](docs/DEPLOY.md) and [`docs/PUBLISH.md`](docs/PUBLISH.md).

---

## 🔊 Audio

All sound effects are **synthesised at runtime** with the Web Audio API
(`js/systems/AudioSystem.js`) — there are no audio files to download. Each effect
and its trigger point is documented in that file's header. To swap in sampled
audio, decode `AudioBuffer`s and feed them to the same `play*` methods; no
call-site changes are needed.

---

## 📄 License

MIT — see headers. Art and SFX are original/procedural and free to reuse.
