/**
 * DifficultySystem.js
 * Translates elapsed play time into a difficulty "level" and derives spawn
 * pacing, wave size and bomb probability from it. Difficulty steps up every 30s
 * (Config.DIFFICULTY.RAMP_MS) producing the classic escalating tension curve.
 */
import { Config } from '../config/Config.js';
import { clamp, lerp } from '../core/Mathx.js';

export class DifficultySystem {
  constructor() { this.reset(); }

  reset() { this.elapsed = 0; this.level = 0; }

  update(dt) {
    this.elapsed += dt;
    this.level = Math.min(
      Math.floor((this.elapsed * 1000) / Config.DIFFICULTY.RAMP_MS),
      Config.DIFFICULTY.MAX_LEVEL
    );
  }

  get t() { return this.level / Config.DIFFICULTY.MAX_LEVEL; } // 0..1 normalised

  get spawnInterval() {
    return lerp(Config.DIFFICULTY.BASE_SPAWN_INTERVAL_MS,
                Config.DIFFICULTY.MIN_SPAWN_INTERVAL_MS, this.t);
  }

  get waveSize() {
    // 1 fruit early, up to ~5 at peak; randomised ±1 at the call-site.
    return Math.round(lerp(Config.DIFFICULTY.BASE_WAVE_SIZE, 5, this.t));
  }

  get bombChance() {
    return clamp(lerp(Config.DIFFICULTY.BOMB_BASE_CHANCE,
                      Config.DIFFICULTY.BOMB_MAX_CHANCE, this.t), 0, 0.4);
  }
}
