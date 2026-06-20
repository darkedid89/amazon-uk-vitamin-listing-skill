# 1. Concept — Ninja Fruit

## Logline
A lightning-fast, tactile fruit-slicing arcade game where every swipe feels
satisfying, every combo escalates the tension, and "one more run" is irresistible.

## Vision
Recreate and modernise the genre-defining slice-em-up feel for the 2026 mobile
web: AAA presentation (juice, particles, screen shake, slow-mo), frictionless
pick-up-and-play, and a meta-game loop (coins → skins → daily streaks →
achievements) that drives day-1 / day-7 retention — all in a tiny,
dependency-free package that installs as a PWA or ships natively via Capacitor.

## Design pillars
1. **Tactile feedback first.** Every interaction has visual + audio + haptic-ready
   feedback. The blade trail, sliced halves and juice splatter are non-negotiable.
2. **Readable danger & reward.** Bombs glow red, frost bombs glow blue with a ❄,
   gold bombs glow gold with a ★ — the player never feels cheated.
3. **Escalating tension.** Difficulty ramps every 30s; combos reward aggression
   while bombs punish carelessness.
4. **Respect the player's time.** Sessions are 30–90s. The meta-loop rewards
   returning without ever gating fun behind payment.
5. **Performance is a feature.** 60 FPS on a mid-range phone is the baseline.

## Target audience
- Casual & mid-core mobile players, ages 9+.
- Web-portal and "instant game" audiences (no install friction).
- Nostalgia players of the original slice genre.

## Platforms
- **Primary:** Mobile web / PWA (portrait).
- **Secondary:** Native iOS & Android via Capacitor (same codebase).
- **Tertiary:** Desktop browser (mouse).

## Unique selling points
- Three distinct modes from one tight core.
- Frost (slow-mo) and Gold (reward) bombs add risk/reward depth beyond plain bombs.
- Fully procedural art + audio → <200 KB, instant load, no asset pipeline.
- Clean, documented, SOLID codebase that is genuinely production-extensible.

## Monetisation (designed-in, non-intrusive)
- **Soft currency (coins)** earned through play, spent on **cosmetic** blade skins
  (no pay-to-win).
- Hooks ready for: rewarded video (double coins / continue), a one-off "remove
  ads + coin pack" IAP, and seasonal cosmetic drops. See `docs/ROADMAP.md`.
