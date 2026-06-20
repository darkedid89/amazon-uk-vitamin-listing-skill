/**
 * SliceSystem.js
 * The heart of the game feel. Each frame it tests the latest blade segment(s)
 * against every live object's hit circle (segment-circle distance test). On a
 * hit it routes by kind: fruit -> score + halves + juice; bomb -> fail; frost ->
 * time dilation; gold -> bonus. It counts kills per blade stroke to detect
 * "perfect" multi-slices.
 *
 * Collaborators are injected (score, combo, particles, audio, bus) — this system
 * orchestrates them but owns none, keeping responsibilities crisp.
 */
import { Config } from '../config/Config.js';
import { distPointToSegment } from '../core/Mathx.js';

export class SliceSystem {
  constructor({ score, combo, particles, audio, bus }) {
    this.score = score;
    this.combo = combo;
    this.particles = particles;
    this.audio = audio;
    this.bus = bus;
    this.strokeKills = 0;       // kills since the blade went down
    this.lastSampleEmpty = true;
  }

  /**
   * @param {Fruit[]} fruits  live fruit list
   * @param {InputManager} input
   * @param {object} ctxState mutable game state (lives, frostTimer, etc.)
   */
  update(fruits, input, ctxState) {
    // Reset per-stroke kill counter when the blade is lifted.
    if (!input.active) { this.strokeKills = 0; this.lastSampleEmpty = true; return; }

    const seg = input.lastSegment;
    if (!seg) return;
    const [a, b] = seg;

    // Ignore micro-movements that aren't real swings.
    const speed = Math.hypot(b.x - a.x, b.y - a.y);
    if (speed < 2) return;

    const cutAngle = Math.atan2(b.y - a.y, b.x - a.x);

    for (const f of fruits) {
      if (!f.active || f.sliced) continue;
      const d = distPointToSegment(f.x, f.y, a.x, a.y, b.x, b.y);
      if (d <= f.radius) this._hit(f, cutAngle, ctxState);
    }
  }

  _hit(f, cutAngle, ctxState) {
    f.sliced = true;
    f.active = false;

    switch (f.kind) {
      case 'fruit':   return this._sliceFruit(f, cutAngle);
      case 'bomb':    return this._hitBomb(f, ctxState);
      case 'freeze':  return this._hitFreeze(f, ctxState);
      case 'gold':    return this._hitGold(f);
    }
  }

  _sliceFruit(f, cutAngle) {
    this.strokeKills++;
    const tier = this.combo.registerSlice(this.strokeKills);
    const perfect = this.strokeKills >= 3;
    const { crit } = this.score.awardFruit(f, this.combo.multiplier, perfect);

    this.particles.halves(f, cutAngle);
    this.particles.juice(f.x, f.y, f.type.juice, crit ? 26 : 16);
    if (crit) this.particles.sparks(f.x, f.y, '#fff0a0', 16);
    this.particles.ring(f.x, f.y, f.type.juice, crit ? 180 : 120);

    this.audio.sliceFruit();
    if (crit) this.audio.combo(tier);

    this.bus.emit('fruit:sliced', { fruit: f, crit, tier, perfect });
  }

  _hitBomb(f, ctxState) {
    this.particles.explosion(f.x, f.y);
    this.audio.bomb();
    this.bus.emit('bomb:hit', { fruit: f });
    ctxState.onBomb(f);
  }

  _hitFreeze(f, ctxState) {
    this.particles.sparks(f.x, f.y, '#bdeaff', 30);
    this.particles.ring(f.x, f.y, '#bdeaff', 240);
    this.audio.freeze();
    ctxState.onFreeze(f);
    this.bus.emit('freeze:hit', { fruit: f });
  }

  _hitGold(f) {
    const pts = this.score.awardGold(f);
    this.particles.sparks(f.x, f.y, '#ffe680', 40);
    this.particles.ring(f.x, f.y, '#ffd84d', 260);
    this.particles.juice(f.x, f.y, '#ffe680', 10);
    this.audio.gold();
    this.bus.emit('gold:hit', { fruit: f, points: pts });
  }
}
