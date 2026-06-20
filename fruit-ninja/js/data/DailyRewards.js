/**
 * DailyRewards.js
 * 7-day login-streak reward ladder — a proven retention mechanic. Claiming is
 * gated to once per calendar day; missing a day resets the streak to day 1.
 */
import { Config } from '../config/Config.js';

export class DailyRewards {
  constructor(storage, bus) {
    this.storage = storage;
    this.bus = bus;
  }

  _today() { return new Date().toISOString().slice(0, 10); }

  /** @returns {{available:boolean, day:number, amount:number}} */
  status() {
    const d = this.storage.data.daily;
    const today = this._today();
    if (d.lastClaim === today) {
      return { available: false, day: d.streak, amount: this._amount(d.streak) };
    }
    // Determine streak position for *today's* claim.
    let nextStreak;
    if (!d.lastClaim) nextStreak = 1;
    else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      nextStreak = d.lastClaim === yesterday ? Math.min(d.streak + 1, 7) : 1;
    }
    return { available: true, day: nextStreak, amount: this._amount(nextStreak) };
  }

  _amount(day) {
    const ladder = Config.ECONOMY.DAILY_REWARDS;
    return ladder[Math.min(day - 1, ladder.length - 1)];
  }

  claim() {
    const st = this.status();
    if (!st.available) return { ok: false };
    this.storage.data.daily.lastClaim = this._today();
    this.storage.data.daily.streak = st.day;
    this.storage.addCoins(st.amount);
    this.storage.save();
    this.bus.emit('daily:claimed', st);
    return { ok: true, amount: st.amount, day: st.day };
  }

  ladder() {
    return Config.ECONOMY.DAILY_REWARDS.map((amount, i) => ({
      day: i + 1, amount,
      claimed: this.storage.data.daily.streak >= i + 1 && this.storage.data.daily.lastClaim,
    }));
  }
}
