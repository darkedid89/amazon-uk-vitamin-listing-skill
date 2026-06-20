/**
 * ObjectPool.js
 * Generic pool that recycles entity instances to keep the GC quiet during
 * intense slicing sessions (critical for a stable 60 FPS on mobile). Entities
 * implement reset(...) for re-initialisation and an `active` flag for liveness.
 */
export class ObjectPool {
  /**
   * @param {() => object} factory  Creates a fresh instance when the pool is empty.
   * @param {number} preallocate    Number of instances to build up front.
   */
  constructor(factory, preallocate = 0) {
    this._factory = factory;
    this._free = [];
    this._live = [];
    for (let i = 0; i < preallocate; i++) this._free.push(factory());
  }

  /** Acquire an instance; `initFn` runs to (re)initialise it before activation. */
  acquire(initFn) {
    const obj = this._free.pop() || this._factory();
    obj.active = true;
    if (initFn) initFn(obj);
    this._live.push(obj);
    return obj;
  }

  /** Compact the live list, returning dead instances to the free pool. */
  sweep() {
    const live = this._live;
    let w = 0;
    for (let r = 0; r < live.length; r++) {
      const obj = live[r];
      if (obj.active) {
        live[w++] = obj;
      } else {
        this._free.push(obj);
      }
    }
    live.length = w;
  }

  get live() { return this._live; }
  get liveCount() { return this._live.length; }
  get freeCount() { return this._free.length; }

  releaseAll() {
    for (const obj of this._live) { obj.active = false; this._free.push(obj); }
    this._live.length = 0;
  }
}
