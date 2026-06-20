/**
 * ParticleSystem.js
 * Owns the particle pool and the recipes for each effect (juice splatter, sliced
 * halves, sparks, explosion debris, score rings). All allocation goes through
 * the pool so sustained slicing never triggers GC pauses.
 */
import { ObjectPool } from '../core/ObjectPool.js';
import { Particle } from '../entities/Particle.js';
import { rand, randInt, TAU } from '../core/Mathx.js';

export class ParticleSystem {
  constructor() {
    this.pool = new ObjectPool(() => new Particle(), 400);
  }

  get live() { return this.pool.live; }

  update(dt, gravityScale) {
    for (const p of this.pool.live) if (p.active) p.update(dt, gravityScale);
    this.pool.sweep();
  }

  clear() { this.pool.releaseAll(); }

  // --- Effect recipes ---

  /** Two fruit halves flying apart along the cut direction. */
  halves(fruit, cutAngle) {
    const nx = Math.cos(cutAngle), ny = Math.sin(cutAngle);
    const perp = cutAngle + Math.PI / 2;
    const px = Math.cos(perp), py = Math.sin(perp);
    for (const side of [-1, 1]) {
      this.pool.acquire(p => p.reset({
        x: fruit.x + nx * 6 * side, y: fruit.y + ny * 6 * side,
        vx: fruit.vx * 0.4 + px * 160 * side,
        vy: fruit.vy * 0.4 + py * 160 * side - 60,
        life: 1.4, color: fruit.type.juice, size: fruit.radius,
        kind: 'half', halfType: fruit.type, halfSide: side,
        spin: rand(-3, 3), angle: fruit.angle, gravity: 1,
      }));
    }
  }

  /** Juice droplets in the fruit's colour. */
  juice(x, y, color, amount = 14) {
    for (let i = 0; i < amount; i++) {
      const a = rand(0, TAU), sp = rand(120, 520);
      this.pool.acquire(p => p.reset({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 80,
        life: rand(0.4, 0.9), color, size: rand(4, 11), kind: 'juice', gravity: 1.1,
      }));
    }
  }

  /** Sharp sparks (gold bomb / crit). */
  sparks(x, y, color, amount = 18) {
    for (let i = 0; i < amount; i++) {
      const a = rand(0, TAU), sp = rand(200, 700);
      this.pool.acquire(p => p.reset({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: rand(0.3, 0.6), color, size: rand(2, 5), kind: 'spark', gravity: 0.4,
      }));
    }
  }

  /** Big explosion debris for bombs. */
  explosion(x, y) {
    for (let i = 0; i < 34; i++) {
      const a = rand(0, TAU), sp = rand(200, 900);
      const col = ['#ff7a36', '#ffb84d', '#ffe08a', '#3a3a3a'][randInt(0, 3)];
      this.pool.acquire(p => p.reset({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: rand(0.4, 1.0), color: col, size: rand(4, 12), kind: 'spark', gravity: 0.8,
      }));
    }
    this.ring(x, y, '#ff8a3c', 260);
  }

  /** Expanding ring shockwave / score pop. */
  ring(x, y, color, size = 120) {
    this.pool.acquire(p => p.reset({
      x, y, vx: 0, vy: 0, life: 0.45, color, size, kind: 'ring', gravity: 0,
    }));
  }
}
