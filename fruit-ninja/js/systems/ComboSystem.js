/**
 * ComboSystem.js
 * Tracks chained slices inside a rolling time window. The number of fruit cut
 * within COMBO_WINDOW_MS determines the combo multiplier (x2..x5+). A "perfect"
 * combo (3+ fruit in a single blade stroke) flags a bonus for the score system.
 */
import { Config } from '../config/Config.js';

export class ComboSystem {
  constructor(bus) {
    this.bus = bus;
    this.reset();
  }

  reset() {
    this.count = 0;
    this.windowMs = 0;
    this.best = 0;
    this.lastStrokeKills = 0;
  }

  /** Register one slice. Returns the current combo tier (>=1). */
  registerSlice(strokeKills) {
    this.count++;
    this.windowMs = Config.SCORE.COMBO_WINDOW_MS;
    this.lastStrokeKills = strokeKills;
    if (this.count > this.best) this.best = this.count;
    if (this.count >= 2) this.bus.emit('combo', { count: this.count, perfect: strokeKills >= 3 });
    return this.count;
  }

  /** Multiplier applied to score: x1 at combo 1, +50% per extra tier (capped). */
  get multiplier() {
    if (this.count <= 1) return 1;
    return 1 + (this.count - 1) * Config.SCORE.COMBO_BONUS;
  }

  update(dt) {
    if (this.windowMs > 0) {
      this.windowMs -= dt * 1000;
      if (this.windowMs <= 0) {
        if (this.count >= 2) this.bus.emit('combo:end', { count: this.count });
        this.count = 0;
      }
    }
  }
}
