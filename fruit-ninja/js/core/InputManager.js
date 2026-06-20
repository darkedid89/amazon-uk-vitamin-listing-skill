/**
 * InputManager.js
 * Unifies mouse, touch and pointer input into a single stream of world-space
 * blade points. It owns coordinate transforms (screen -> world) so gameplay
 * code is resolution- and device-agnostic.
 */
import { Config } from '../config/Config.js';

export class InputManager {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {() => {scale:number, offsetX:number, offsetY:number}} viewportFn
   */
  constructor(canvas, viewportFn) {
    this.canvas = canvas;
    this._viewport = viewportFn;
    this.active = false;            // is a swipe currently down
    this.points = [];               // recent world points {x,y,t}
    this.justMoved = false;

    this._onDown = this._onDown.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);

    // Pointer Events cover mouse + touch + pen uniformly where supported.
    canvas.addEventListener('pointerdown', this._onDown, { passive: false });
    canvas.addEventListener('pointermove', this._onMove, { passive: false });
    window.addEventListener('pointerup', this._onUp, { passive: false });
    window.addEventListener('pointercancel', this._onUp, { passive: false });

    // Prevent the page from scrolling / zooming while slicing on mobile.
    canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  _toWorld(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const vp = this._viewport();
    const px = (clientX - rect.left) * (this.canvas.width / rect.width);
    const py = (clientY - rect.top) * (this.canvas.height / rect.height);
    return { x: (px - vp.offsetX) / vp.scale, y: (py - vp.offsetY) / vp.scale };
  }

  _push(clientX, clientY) {
    const w = this._toWorld(clientX, clientY);
    this.points.push({ x: w.x, y: w.y, t: performance.now() });
    if (this.points.length > Config.BLADE.MAX_POINTS) this.points.shift();
    this.justMoved = true;
  }

  _onDown(e) {
    this.active = true;
    this.points.length = 0;
    this._push(e.clientX, e.clientY);
  }

  _onMove(e) {
    if (!this.active) return;
    e.preventDefault();
    // Coalesced events give sub-frame precision on high-rate touch panels.
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs) this._push(ev.clientX, ev.clientY);
  }

  _onUp() {
    this.active = false;
  }

  /** Expire old trail points; called once per frame. Returns live segment list. */
  update() {
    const now = performance.now();
    const life = Config.BLADE.POINT_LIFETIME_MS;
    while (this.points.length && now - this.points[0].t > life) this.points.shift();
    const moved = this.justMoved;
    this.justMoved = false;
    return moved;
  }

  /** The latest swipe segment [a,b] in world space, or null. */
  get lastSegment() {
    const n = this.points.length;
    if (n < 2) return null;
    return [this.points[n - 2], this.points[n - 1]];
  }
}
