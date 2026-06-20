/**
 * SpawnSystem.js
 * Decides WHAT and WHEN to throw. It owns the fruit pool and launches waves of
 * fruit (and occasionally bombs / special bombs) on ballistic arcs that peak in
 * the upper-middle of the play field, so they're always reachable.
 *
 * The mode object can override behaviour (e.g. Arcade has no bombs, Survival is
 * relentless) via the injected `policy` — Strategy pattern keeps modes decoupled
 * from spawn internals.
 */
import { ObjectPool } from '../core/ObjectPool.js';
import { Fruit } from '../entities/Fruit.js';
import { Config } from '../config/Config.js';
import { FruitTypes, FruitWeightedPool } from '../config/FruitTypes.js';
import { rand, randInt, chance, pick } from '../core/Mathx.js';

export class SpawnSystem {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.pool = new ObjectPool(() => new Fruit(), 60);
    this.timer = 0;
    this.policy = null;
    this.missedThisFrame = 0;   // fruit that fell uncut since last consume
  }

  setPolicy(policy) { this.policy = policy; }
  get live() { return this.pool.live; }
  clear() { this.pool.releaseAll(); this.timer = 0; this.missedThisFrame = 0; }

  /** Read-and-reset the count of fruit missed this frame (drives life loss). */
  consumeMissed() { const n = this.missedThisFrame; this.missedThisFrame = 0; return n; }

  update(dt, gravityScale) {
    // Update objects; capture "missed" before sweep() recycles them out of live.
    for (const f of this.pool.live) {
      if (!f.active) continue;
      f.update(dt, gravityScale);
      if (f.missed) { this.missedThisFrame++; f.missed = false; }
    }

    this.timer -= dt * 1000;
    if (this.timer <= 0) {
      this._spawnWave();
      const base = this.policy?.spawnInterval?.(this.difficulty) ?? this.difficulty.spawnInterval;
      this.timer = base * rand(0.8, 1.2);
    }
    this.pool.sweep();
  }

  /** Launch a batch of objects from the bottom edge. */
  _spawnWave() {
    const size = this.policy?.waveSize?.(this.difficulty) ?? this.difficulty.waveSize;
    const count = Math.max(1, size + randInt(-1, 1));
    for (let i = 0; i < count; i++) this._spawnOne();
  }

  _spawnOne() {
    const typeId = this._chooseType();
    const t = FruitTypes[typeId];

    // Launch position along the bottom, biased toward centre.
    const x = rand(Config.WORLD.WIDTH * 0.12, Config.WORLD.WIDTH * 0.88);
    const y = Config.WORLD.HEIGHT + t.radius;

    // Choose an apex height in the comfortable slicing band, then solve for the
    // launch velocity that reaches it (v = sqrt(2*g*h)).
    const apexY = rand(Config.WORLD.HEIGHT * 0.12, Config.WORLD.HEIGHT * 0.42);
    const rise = y - apexY;
    const vy = -Math.sqrt(2 * Config.PHYSICS.GRAVITY * rise);

    // Horizontal drift aimed gently toward the centre for reachability.
    const toCentre = (Config.WORLD.WIDTH / 2 - x) / Config.WORLD.WIDTH;
    const vx = rand(-220, 220) + toCentre * 420;

    this.pool.acquire(f => f.reset({
      typeId, x, y, vx, vy,
      spin: rand(Config.PHYSICS.SPIN_MIN, Config.PHYSICS.SPIN_MAX),
    }));
  }

  _chooseType() {
    const allowBombs = this.policy?.allowBombs !== false;
    if (allowBombs && chance(this.difficulty.bombChance)) {
      // Among hazards, mostly normal bombs; rarer frost & gold.
      const roll = Math.random();
      if (roll < 0.15) return 'goldbomb';
      if (roll < 0.35) return 'freezebomb';
      return 'bomb';
    }
    return pick(FruitWeightedPool);
  }

  /** Force-spawn a flurry of fruit (Arcade frenzy). */
  frenzy(count = 12) {
    for (let i = 0; i < count; i++) {
      const typeId = pick(FruitWeightedPool);
      const t = FruitTypes[typeId];
      const x = rand(Config.WORLD.WIDTH * 0.1, Config.WORLD.WIDTH * 0.9);
      const apexY = rand(Config.WORLD.HEIGHT * 0.1, Config.WORLD.HEIGHT * 0.35);
      const vy = -Math.sqrt(2 * Config.PHYSICS.GRAVITY * (Config.WORLD.HEIGHT + t.radius - apexY));
      this.pool.acquire(f => f.reset({
        typeId, x, y: Config.WORLD.HEIGHT + t.radius,
        vx: rand(-260, 260), vy, spin: rand(-5, 5),
      }));
    }
  }
}
