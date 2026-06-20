/**
 * Entity.js
 * Base class for everything that lives in the world and is pooled.
 * Holds previous position for render interpolation (smooth motion between the
 * fixed simulation steps).
 */
export class Entity {
  constructor() {
    this.active = false;
    this.x = 0; this.y = 0;
    this.px = 0; this.py = 0;   // previous position for interpolation
    this.vx = 0; this.vy = 0;
    this.angle = 0; this.pAngle = 0;
    this.spin = 0;
    this.radius = 1;
  }

  /** Interpolated X for rendering between fixed steps. */
  rx(alpha) { return this.px + (this.x - this.px) * alpha; }
  ry(alpha) { return this.py + (this.y - this.py) * alpha; }
  rAngle(alpha) { return this.pAngle + (this.angle - this.pAngle) * alpha; }
}
