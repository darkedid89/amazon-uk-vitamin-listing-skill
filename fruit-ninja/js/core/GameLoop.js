/**
 * GameLoop.js
 * Fixed-timestep update + interpolated render loop. Decoupling simulation rate
 * (120 Hz) from render rate (display refresh) guarantees deterministic physics
 * and smooth slicing regardless of the device's actual frame rate.
 */
import { Config } from '../config/Config.js';

export class GameLoop {
  /**
   * @param {(dt:number)=>void} update  Fixed-step simulation callback (dt in seconds).
   * @param {(alpha:number)=>void} render  Render callback; alpha is interpolation factor.
   */
  constructor(update, render) {
    this._update = update;
    this._render = render;
    this._raf = 0;
    this._last = 0;
    this._acc = 0;
    this._running = false;
    this._stepMs = Config.SIM.STEP_MS;
    this._frame = this._frame.bind(this);

    // FPS metering for the debug overlay.
    this.fps = 0;
    this._fpsAcc = 0;
    this._fpsFrames = 0;
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._last = performance.now();
    this._raf = requestAnimationFrame(this._frame);
  }

  stop() {
    this._running = false;
    cancelAnimationFrame(this._raf);
  }

  _frame(now) {
    if (!this._running) return;
    this._raf = requestAnimationFrame(this._frame);

    let frameMs = now - this._last;
    this._last = now;
    if (frameMs > Config.SIM.MAX_FRAME_MS) frameMs = Config.SIM.MAX_FRAME_MS;

    this._acc += frameMs;
    const stepSec = this._stepMs / 1000;
    let steps = 0;
    while (this._acc >= this._stepMs && steps < 8) {
      this._update(stepSec);
      this._acc -= this._stepMs;
      steps++;
    }

    const alpha = this._acc / this._stepMs;
    this._render(alpha);

    // FPS metering (smoothed over ~0.5s).
    this._fpsAcc += frameMs;
    this._fpsFrames++;
    if (this._fpsAcc >= 500) {
      this.fps = Math.round((this._fpsFrames * 1000) / this._fpsAcc);
      this._fpsAcc = 0;
      this._fpsFrames = 0;
    }
  }
}
