# 15–16. Roadmap & Commercial Scaling — Ninja Fruit

## 15. Future improvements (prioritised)

### Near-term (polish & retention)
1. **Service worker** for full offline play + instant repeat loads.
2. **Haptics** (Capacitor) on slice / bomb / combo.
3. **Power-ups:** Freeze (manual), Frenzy, Double-points, Bomb-shield — spawn as
   collectibles; back them with the existing pool + EventBus.
4. **Special fruit:** rare bonus fruit, multi-hit pomegranate (splits into 5),
   negative "rotten" fruit.
5. **Settings screen:** music/SFX sliders, haptics toggle, colour-blind palette,
   left/right-hand HUD.
6. **Tutorial / first-time UX** with a guided first slice.

### Mid-term (depth & content)
7. **Mission / quest system** ("slice 50 watermelons", "3 perfect combos") on top
   of achievements for daily goals.
8. **Blade *trails* & fruit *skins*** as additional cosmetic tiers; seasonal sets.
9. **Background themes** (dojo, neon city, space) unlockable with coins.
10. **Online leaderboards** (replace local board via a backend; same `Storage`
    abstraction).
11. **Replay / share** a slow-mo clip of a best combo (Web Codecs / canvas
    capture).

### Long-term (platform)
12. **Multiplayer**: async score duels, then real-time "blade battle".
13. **Live-ops events** with time-limited modes & cosmetic drops.
14. **Cloud save** + account linking (Game Center / Play Games).

---

## 16. Scaling to a commercial product

### 16.1 Technical scaling
- **Asset pipeline:** swap procedural art for authored sprite atlases via the
  existing `SpriteFactory` seam; add a bundler (Vite/esbuild) for tree-shaking,
  hashing and a tiny minified payload. The module boundaries already map cleanly
  to chunks.
- **Rendering headroom:** an optional **WebGL/WebGPU** renderer can be added as a
  second `Renderer` implementation (same interface) for thousands of particles.
- **Determinism & anti-cheat:** the fixed-timestep sim already supports seeded RNG
  → enables verifiable replays and server-side score validation.
- **Telemetry:** route gameplay events (already on the EventBus) to an analytics
  sink to drive funnels (D1/D7 retention, mode mix, economy sources/sinks).

### 16.2 Live-ops & content cadence
- Weekly cosmetic drop, monthly themed event, seasonal pass. All are data-driven
  (`FruitTypes`, `Shop`, `Modes`) — content does not require engine changes.
- Remote config for balance (spawn rates, prices) to A/B-test without resubmitting.

### 16.3 Monetisation model
| Stream | Implementation | Notes |
|--------|----------------|-------|
| Rewarded video | Capacitor AdMob plugin; "double coins" / "continue once" | Opt-in, non-intrusive. |
| Interstitial | Between runs, frequency-capped | Optional; respect session length. |
| IAP — coin packs | Play Billing / StoreKit | Cosmetics remain the only sink. |
| IAP — "Remove ads + starter pack" | One-off | High-converting first purchase. |
| Battle/Season pass | Cosmetic tiers | Recurring revenue, no pay-to-win. |

**Guardrail:** all paid items stay cosmetic. The fun is free; spending is
expression. This protects ratings and long-term LTV.

### 16.4 Team & process at scale
- CI: lint + unit tests (pure systems are trivially testable) + Playwright e2e
  smoke (boot, start each mode, slice, game-over).
- Crash/error reporting (Sentry) wired through a global handler + EventBus.
- Feature flags + staged rollouts on both stores.

### 16.5 KPIs to instrument first
- D1 / D7 / D30 retention, average session length, sessions/day.
- Mode mix, average combo, bomb-death rate (difficulty tuning signal).
- Coin source/sink balance, skin unlock funnel, daily-reward claim rate.
- ARPDAU once monetisation is live.
