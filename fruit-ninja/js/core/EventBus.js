/**
 * EventBus.js
 * Tiny pub/sub used to decouple systems from the UI and from one another.
 * Systems emit domain events ('fruit:sliced', 'combo', 'gameover', ...) and the
 * UI / audio / achievement layers subscribe — honouring the Dependency
 * Inversion principle (high-level UI never reaches into gameplay internals).
 */
export class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this._listeners = new Map();
  }

  on(event, fn) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(fn);
    return () => this.off(event, fn); // returns an unsubscribe handle
  }

  off(event, fn) {
    this._listeners.get(event)?.delete(fn);
  }

  emit(event, payload) {
    const set = this._listeners.get(event);
    if (!set) return;
    // Snapshot to allow listeners to unsubscribe during emission safely.
    for (const fn of [...set]) {
      try { fn(payload); }
      catch (err) { console.error(`[EventBus] listener for "${event}" threw`, err); }
    }
  }

  clear() { this._listeners.clear(); }
}
