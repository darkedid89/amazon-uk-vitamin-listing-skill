/**
 * Fruit.js
 * Represents any spawnable object (fruit, bomb, frost bomb, gold bomb). One
 * class covers all "kinds" because they share identical ballistic behaviour;
 * the `kind` field (from FruitTypes) drives downstream scoring/effects. This
 * keeps the pool homogeneous and avoids branchy class hierarchies.
 */
import { Entity } from './Entity.js';
import { Config } from '../config/Config.js';
import { FruitTypes } from '../config/FruitTypes.js';

export class Fruit extends Entity {
  constructor() {
    super();
    this.typeId = 'apple';
    this.type = FruitTypes.apple;
    this.kind = 'fruit';
    this.sliced = false;
    this.missed = false;     // left the play field without being sliced
    this.bornAt = 0;
  }

  /**
   * @param {object} cfg  { typeId, x, y, vx, vy, spin, radius }
   */
  reset(cfg) {
    const type = FruitTypes[cfg.typeId];
    this.typeId = cfg.typeId;
    this.type = type;
    this.kind = type.kind;
    this.radius = cfg.radius ?? type.radius;
    this.x = this.px = cfg.x;
    this.y = this.py = cfg.y;
    this.vx = cfg.vx;
    this.vy = cfg.vy;
    this.spin = cfg.spin;
    this.angle = this.pAngle = 0;
    this.sliced = false;
    this.missed = false;
    this.active = true;
    this.bornAt = performance.now();
    return this;
  }

  /** @param {number} dt seconds @param {number} gravityScale time dilation (frost) */
  update(dt, gravityScale = 1) {
    this.px = this.x; this.py = this.y; this.pAngle = this.angle;
    const sdt = dt * gravityScale;
    this.vy += Config.PHYSICS.GRAVITY * sdt;
    this.x += this.vx * sdt;
    this.y += this.vy * sdt;
    this.angle += this.spin * sdt;

    // Deactivate once it falls well below the world; mark as missed if it was a
    // scorable fruit that the player failed to slice (drives Classic lives).
    if (this.y - this.radius > Config.WORLD.HEIGHT + 80) {
      if (!this.sliced && this.kind === 'fruit') this.missed = true;
      this.active = false;
    }
  }
}
