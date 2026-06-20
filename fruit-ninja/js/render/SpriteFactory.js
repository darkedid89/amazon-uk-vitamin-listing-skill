/**
 * SpriteFactory.js
 * Renders each object type once to an offscreen canvas at spawn-time resolution,
 * then the renderer blits the cached bitmap every frame. This is the single most
 * important rendering optimisation: per-frame we only draw textured quads, never
 * re-execute the (expensive) gradient/vector art. Halves are cached too so the
 * sliced pieces match the whole fruit exactly.
 *
 * The art is fully procedural (gradients + paths) so the game has zero binary
 * asset dependencies. Designers can swap to the SVGs in /assets/sprites by
 * replacing _drawBody with an image blit.
 */
import { FruitTypes } from '../config/FruitTypes.js';
import { TAU } from '../core/Mathx.js';

export class SpriteFactory {
  constructor(dpr = 1) {
    this.dpr = dpr;
    this.cache = new Map(); // typeId -> {full, left, right, size}
  }

  /** Build (or fetch) the sprite set for a type at its native radius. */
  get(typeId) {
    if (this.cache.has(typeId)) return this.cache.get(typeId);
    const set = this._build(typeId);
    this.cache.set(typeId, set);
    return set;
  }

  _make(size) {
    const c = document.createElement('canvas');
    c.width = c.height = Math.ceil(size * this.dpr);
    const ctx = c.getContext('2d');
    ctx.scale(this.dpr, this.dpr);
    return { c, ctx, size };
  }

  _build(typeId) {
    const t = FruitTypes[typeId];
    const r = t.radius;
    const size = r * 2 + 24; // padding for leaf / shadow / fuse
    const cx = size / 2, cy = size / 2;

    const full = this._make(size);
    this._drawBody(full.ctx, cx, cy, r, t, 'full');

    // Two halves: same art clipped to left/right of the cut line, pulled apart
    // slightly and given a pale inner-flesh face.
    const left = this._make(size);
    this._drawHalf(left.ctx, cx, cy, r, t, -1);
    const right = this._make(size);
    this._drawHalf(right.ctx, cx, cy, r, t, 1);

    return { full: full.c, left: left.c, right: right.c, size };
  }

  _drawHalf(ctx, cx, cy, r, t, side) {
    ctx.save();
    ctx.beginPath();
    if (side < 0) ctx.rect(0, 0, cx, cy * 2);
    else ctx.rect(cx, 0, cx, cy * 2);
    ctx.clip();
    this._drawBody(ctx, cx, cy, r, t, 'half');
    ctx.restore();

    // Inner flesh face along the cut.
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, 0, TAU);
    ctx.clip();
    ctx.fillStyle = t.juice;
    ctx.globalAlpha = 0.55;
    const fx = side < 0 ? cx - 6 : cx + 6;
    ctx.fillRect(fx - 8, cy - r, 16, r * 2);
    ctx.restore();
  }

  _drawBody(ctx, cx, cy, r, t, mode) {
    const shape = t.shape || 'round';
    switch (shape) {
      case 'banana':     return this._banana(ctx, cx, cy, r, t);
      case 'melon':      return this._melon(ctx, cx, cy, r, t);
      case 'strawberry': return this._strawberry(ctx, cx, cy, r, t);
      case 'kiwi':       return this._kiwi(ctx, cx, cy, r, t);
      default:
        if (t.kind === 'bomb' || t.kind === 'gold' || t.kind === 'freeze')
          return this._bomb(ctx, cx, cy, r, t);
        return this._round(ctx, cx, cy, r, t);
    }
  }

  _radialBody(ctx, cx, cy, r, light, dark) {
    const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
    g.addColorStop(0, light);
    g.addColorStop(1, dark);
    return g;
  }

  _shine(ctx, cx, cy, r) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.32, cy - r * 0.42, r * 0.28, r * 0.18, -0.6, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  _leaf(ctx, cx, cy, r, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(cx, cy - r * 0.95);
    ctx.rotate(-0.5);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.32, r * 0.16, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  _round(ctx, cx, cy, r, t) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = this._radialBody(ctx, cx, cy, r, t.body, t.bodyDark);
    ctx.fill();
    if (t.id === 'orange') {
      ctx.save(); ctx.globalAlpha = 0.18; ctx.strokeStyle = '#7a3c00';
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke();
      }
      ctx.restore();
    }
    this._shine(ctx, cx, cy, r);
    this._leaf(ctx, cx, cy, r, t.leaf);
  }

  _melon(ctx, cx, cy, r, t) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = this._radialBody(ctx, cx, cy, r, '#3fbf57', '#176b28');
    ctx.fill();
    ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = '#0d4a1c'; ctx.lineWidth = r * 0.06;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 0.9, r * 0.3, a, 0, Math.PI);
      ctx.stroke();
    }
    ctx.restore();
    this._shine(ctx, cx, cy, r);
  }

  _banana(ctx, cx, cy, r, t) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.5);
    ctx.beginPath();
    ctx.moveTo(-r * 0.9, r * 0.2);
    ctx.quadraticCurveTo(0, -r * 1.1, r * 0.9, r * 0.2);
    ctx.quadraticCurveTo(r * 0.55, r * 0.55, 0, r * 0.45);
    ctx.quadraticCurveTo(-r * 0.55, r * 0.4, -r * 0.9, r * 0.2);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, -r, 0, r);
    g.addColorStop(0, '#ffe65c'); g.addColorStop(1, t.bodyDark);
    ctx.fillStyle = g; ctx.fill();
    ctx.fillStyle = '#5e4a18';
    ctx.fillRect(-r * 0.95, r * 0.12, r * 0.12, r * 0.14);
    ctx.restore();
    this._shine(ctx, cx - r * 0.1, cy - r * 0.2, r * 0.7);
  }

  _strawberry(ctx, cx, cy, r, t) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, r);
    ctx.bezierCurveTo(r * 1.1, r * 0.4, r * 0.9, -r * 0.7, 0, -r * 0.7);
    ctx.bezierCurveTo(-r * 0.9, -r * 0.7, -r * 1.1, r * 0.4, 0, r);
    ctx.closePath();
    const g = this._radialBody(ctx, 0, -r * 0.2, r, t.body, t.bodyDark);
    ctx.fillStyle = g; ctx.fill();
    ctx.fillStyle = '#ffe27a';
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * TAU, rr = Math.random() * r * 0.7;
      ctx.beginPath(); ctx.ellipse(Math.cos(a) * rr, Math.sin(a) * rr - r * 0.1, 2.2, 3.4, a, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = t.leaf;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU - 1.57;
      ctx.beginPath(); ctx.moveTo(0, -r * 0.65);
      ctx.lineTo(Math.cos(a) * r * 0.5, -r * 0.65 + Math.sin(a) * r * 0.4);
      ctx.lineTo(Math.cos(a + 0.4) * r * 0.3, -r * 0.5); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  _kiwi(ctx, cx, cy, r, t) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = this._radialBody(ctx, cx, cy, r, '#a9854f', t.bodyDark); ctx.fill();
    // Cross-section flesh (kiwis are usually shown sliced — gives instant read).
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.82, 0, TAU);
    ctx.fillStyle = '#9bd14e'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.3, 0, TAU);
    ctx.fillStyle = '#eef6d6'; ctx.fill();
    ctx.fillStyle = '#1d2b12';
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * TAU;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5, 2.2, 0, TAU); ctx.fill();
    }
    this._shine(ctx, cx, cy, r);
  }

  _bomb(ctx, cx, cy, r, t) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = this._radialBody(ctx, cx, cy, r, t.body, t.bodyDark);
    ctx.fill();
    // Outer glow ring tinted per bomb kind.
    ctx.save();
    ctx.globalAlpha = 0.5; ctx.lineWidth = 4; ctx.strokeStyle = t.juice;
    ctx.beginPath(); ctx.arc(cx, cy, r - 3, 0, TAU); ctx.stroke();
    ctx.restore();
    // Fuse cap + spark.
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(cx - r * 0.16, cy - r - r * 0.18, r * 0.32, r * 0.28);
    ctx.strokeStyle = '#b8862f'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx, cy - r - r * 0.1);
    ctx.quadraticCurveTo(cx + r * 0.4, cy - r - r * 0.5, cx + r * 0.2, cy - r - r * 0.7);
    ctx.stroke();
    ctx.fillStyle = t.kind === 'freeze' ? '#bdeaff' : t.kind === 'gold' ? '#fff3b0' : '#ff8a3c';
    ctx.beginPath(); ctx.arc(cx + r * 0.2, cy - r - r * 0.72, 4.5, 0, TAU); ctx.fill();
    // Symbol to disambiguate bomb variants.
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.85;
    ctx.font = `bold ${r * 0.7}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (t.kind === 'freeze') ctx.fillText('❄', cx, cy + 2);
    else if (t.kind === 'gold') ctx.fillText('★', cx, cy + 2);
    ctx.globalAlpha = 1;
    this._shine(ctx, cx, cy, r * 0.9);
  }
}
