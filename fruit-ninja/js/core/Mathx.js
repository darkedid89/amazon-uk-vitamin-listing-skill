/**
 * Mathx.js
 * Small, allocation-free maths helpers shared across systems.
 */
export const TAU = Math.PI * 2;

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (min, max) => min + Math.random() * (max - min);
export const randInt = (min, max) => Math.floor(rand(min, max + 1));
export const pick = (arr) => arr[(Math.random() * arr.length) | 0];
export const chance = (p) => Math.random() < p;

/**
 * Shortest distance from point P to segment AB. Used by the slice system to
 * test whether a blade swing intersects a fruit's hit circle.
 */
export function distPointToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax, aby = by - ay;
  const apx = px - ax, apy = py - ay;
  const ab2 = abx * abx + aby * aby;
  let t = ab2 === 0 ? 0 : (apx * abx + apy * aby) / ab2;
  t = clamp(t, 0, 1);
  const cx = ax + abx * t, cy = ay + aby * t;
  const dx = px - cx, dy = py - cy;
  return Math.hypot(dx, dy);
}
