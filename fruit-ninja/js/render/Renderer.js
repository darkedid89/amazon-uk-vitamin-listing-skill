/**
 * Renderer.js
 * Owns the canvas, the device-pixel-ratio handling, the world->screen transform
 * (letterboxed "fit" scaling so balance is identical on any aspect ratio) and
 * all draw calls. Keeping every ctx operation here means the rest of the game is
 * pure logic and trivially testable.
 */
import { Config } from '../config/Config.js';
import { SpriteFactory } from './SpriteFactory.js';
import { TAU } from '../core/Mathx.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.dpr = Math.min(window.devicePixelRatio || 1, Config.RENDER.MAX_DPR);
    this.sprites = new SpriteFactory(this.dpr);
    this.viewport = { scale: 1, offsetX: 0, offsetY: 0 };
    this.shake = 0;
    this.flash = 0;        // white/red full-screen flash intensity
    this.flashColor = '255,90,54';
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => this.resize());
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';

    // "Fit" the virtual world into the screen, centred (letterbox).
    const sx = this.canvas.width / Config.WORLD.WIDTH;
    const sy = this.canvas.height / Config.WORLD.HEIGHT;
    const scale = Math.max(sx, sy); // cover: fill screen, crop overflow
    this.viewport.scale = scale;
    this.viewport.offsetX = (this.canvas.width - Config.WORLD.WIDTH * scale) / 2;
    this.viewport.offsetY = (this.canvas.height - Config.WORLD.HEIGHT * scale) / 2;
  }

  getViewport() { return this.viewport; }

  triggerShake(amount) { this.shake = Math.min(this.shake + amount, 40); }
  triggerFlash(intensity, color) { this.flash = intensity; if (color) this.flashColor = color; }

  beginFrame(dtSeconds) {
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Background gradient (sky -> deep). Drawn in device space, no world transform.
    const g = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    g.addColorStop(0, Config.RENDER.BG_TOP);
    g.addColorStop(1, Config.RENDER.BG_BOTTOM);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this._vignette();

    // Apply world transform (+ screen shake).
    let shx = 0, shy = 0;
    if (this.shake > 0.1) {
      shx = (Math.random() - 0.5) * this.shake * this.dpr;
      shy = (Math.random() - 0.5) * this.shake * this.dpr;
      this.shake *= 0.86;
    } else this.shake = 0;

    ctx.setTransform(
      this.viewport.scale, 0, 0, this.viewport.scale,
      this.viewport.offsetX + shx, this.viewport.offsetY + shy
    );
  }

  _vignette() {
    const ctx = this.ctx;
    const cx = this.canvas.width / 2, cy = this.canvas.height / 2;
    const g = ctx.createRadialGradient(cx, cy, this.canvas.height * 0.3, cx, cy, this.canvas.height * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawFruit(f, alpha) {
    const set = this.sprites.get(f.typeId);
    const x = f.rx(alpha), y = f.ry(alpha), a = f.rAngle(alpha);
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    // Soft glow for bombs / gold to telegraph danger & reward.
    if (f.kind !== 'fruit') {
      ctx.shadowColor = f.type.juice;
      ctx.shadowBlur = f.kind === 'gold' ? 34 : 22;
    }
    const s = set.size;
    ctx.drawImage(set.full, -s / 2, -s / 2, s, s);
    ctx.restore();
  }

  drawParticle(p, alpha) {
    const ctx = this.ctx;
    const x = p.rx(alpha), y = p.ry(alpha);
    ctx.globalAlpha = p.alpha;
    if (p.kind === 'half' && p.halfType) {
      const set = this.sprites.get(p.halfType.id);
      const s = set.size;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(p.rAngle(alpha));
      ctx.drawImage(p.halfSide < 0 ? set.left : set.right, -s / 2, -s / 2, s, s);
      ctx.restore();
    } else if (p.kind === 'ring') {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      const r = (1 - p.alpha) * p.size;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(x, y, p.size * (0.4 + 0.6 * p.alpha), 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /** Draw the blade trail as a tapering, glowing ribbon. */
  drawBlade(points, bladeSkin) {
    if (points.length < 2) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = bladeSkin.glow;
    ctx.shadowBlur = 18;
    for (let pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const t = i / points.length;
        ctx.lineWidth = (pass === 0 ? Config.BLADE.WIDTH : Config.BLADE.WIDTH * 0.4) * t;
        ctx.strokeStyle = pass === 0 ? bladeSkin.outer : bladeSkin.inner;
        ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
      }
    }
    ctx.restore();
  }

  /** Full-screen flash overlay (bomb hit / frost). Drawn after world transform reset. */
  endFrame() {
    if (this.flash > 0.01) {
      const ctx = this.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = `rgba(${this.flashColor},${this.flash})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.flash *= 0.88;
    }
  }
}
