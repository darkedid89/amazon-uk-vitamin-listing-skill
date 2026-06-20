/**
 * Particle.js
 * Lightweight pooled particle for juice splatter, sparks and explosion debris.
 * Also doubles as a "fruit half" when `half` art data is present (the two
 * sliced halves of a fruit that fly apart).
 */
import { Entity } from './Entity.js';
import { Config } from '../config/Config.js';

export class Particle extends Entity {
  constructor() {
    super();
    this.life = 0; this.maxLife = 0;
    this.color = '#fff';
    this.size = 4;
    this.gravity = 1;
    this.kind = 'juice';     // 'juice' | 'spark' | 'half' | 'ring'
    this.alpha = 1;
    this.halfType = null;    // FruitType when kind === 'half'
    this.halfSide = 1;       // -1 / +1 which half
  }

  reset(cfg) {
    this.x = this.px = cfg.x;
    this.y = this.py = cfg.y;
    this.vx = cfg.vx; this.vy = cfg.vy;
    this.life = this.maxLife = cfg.life;
    this.color = cfg.color;
    this.size = cfg.size;
    this.gravity = cfg.gravity ?? 1;
    this.kind = cfg.kind ?? 'juice';
    this.spin = cfg.spin ?? 0;
    this.angle = this.pAngle = cfg.angle ?? 0;
    this.halfType = cfg.halfType ?? null;
    this.halfSide = cfg.halfSide ?? 1;
    this.alpha = 1;
    this.active = true;
    return this;
  }

  update(dt, gravityScale = 1) {
    this.px = this.x; this.py = this.y; this.pAngle = this.angle;
    const sdt = dt * gravityScale;
    this.vy += Config.PHYSICS.GRAVITY * this.gravity * sdt;
    this.x += this.vx * sdt;
    this.y += this.vy * sdt;
    this.angle += this.spin * sdt;
    this.life -= dt;
    this.alpha = Math.max(0, this.life / this.maxLife);
    if (this.life <= 0 || this.y - this.size > Config.WORLD.HEIGHT + 120) this.active = false;
  }
}
