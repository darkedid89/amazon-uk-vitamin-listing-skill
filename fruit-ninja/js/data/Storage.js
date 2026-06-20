/**
 * Storage.js
 * Single persistence gateway over LocalStorage. Everything the player owns
 * (coins, high scores, owned/equipped skins, achievements, daily streak) lives
 * in one versioned blob so we can migrate it safely in future releases.
 *
 * Abstracting persistence behind this class means swapping to Capacitor
 * Preferences / a cloud save later touches exactly one file.
 */
import { Config } from '../config/Config.js';

const DEFAULTS = () => ({
  version: 1,
  coins: 0,
  highScores: { classic: 0, arcade: 0, survival: 0 },
  leaderboard: { classic: [], arcade: [], survival: [] }, // [{score, date}]
  totalFruitSliced: 0,
  totalCombosMax: 0,
  achievements: {},      // id -> true
  ownedSkins: ['classic'],
  equippedSkin: 'classic',
  daily: { lastClaim: null, streak: 0 },
  settings: { sound: true, music: true },
});

export class Storage {
  constructor() {
    this.data = this._load();
  }

  _load() {
    try {
      const raw = localStorage.getItem(Config.STORAGE_KEY);
      if (!raw) return DEFAULTS();
      const parsed = JSON.parse(raw);
      return Object.assign(DEFAULTS(), parsed); // forward-compatible merge
    } catch (e) {
      console.warn('[Storage] load failed, resetting', e);
      return DEFAULTS();
    }
  }

  save() {
    try {
      localStorage.setItem(Config.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('[Storage] save failed', e);
    }
  }

  // --- Convenience accessors ---
  get coins() { return this.data.coins; }
  addCoins(n) { this.data.coins += n; this.save(); }
  spendCoins(n) {
    if (this.data.coins < n) return false;
    this.data.coins -= n; this.save(); return true;
  }

  getHighScore(mode) { return this.data.highScores[mode] || 0; }
  submitScore(mode, score) {
    const isHigh = score > (this.data.highScores[mode] || 0);
    if (isHigh) this.data.highScores[mode] = score;
    const board = this.data.leaderboard[mode];
    board.push({ score, date: new Date().toISOString() });
    board.sort((a, b) => b.score - a.score);
    this.data.leaderboard[mode] = board.slice(0, 10);
    this.save();
    return isHigh;
  }

  reset() {
    this.data = DEFAULTS();
    this.save();
  }
}
