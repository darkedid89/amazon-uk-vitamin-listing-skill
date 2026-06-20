/**
 * ScoreSystem.js
 * Centralises all score arithmetic so the scoring rules live in exactly one
 * place (Single Responsibility). Implements the published table:
 *   base fruit           = type.score (10 default)
 *   combo bonus          = +50% per combo tier
 *   critical hit         = +100%
 *   perfect combo bonus  = +200% pool when 3+ cut in one stroke
 */
import { Config } from '../config/Config.js';
import { chance } from '../core/Mathx.js';

export class ScoreSystem {
  constructor(bus) {
    this.bus = bus;
    this.reset();
  }

  reset() { this.score = 0; this.coins = 0; }

  /**
   * Award points for slicing one fruit.
   * @returns {{points:number, crit:boolean}}
   */
  awardFruit(fruit, comboMultiplier, perfect) {
    const crit = chance(Config.SCORE.CRIT_CHANCE);
    let pts = fruit.type.score;
    pts *= comboMultiplier;                         // combo bonus
    if (crit) pts *= (1 + Config.SCORE.CRIT_BONUS); // critical hit
    if (perfect) pts *= (1 + Config.SCORE.PERFECT_COMBO_BONUS);
    pts = Math.round(pts);
    this.score += pts;
    this.coins += Config.ECONOMY.COINS_PER_FRUIT;
    this.bus.emit('score', { total: this.score, gained: pts, crit, x: fruit.x, y: fruit.y });
    return { points: pts, crit };
  }

  awardGold(fruit) {
    const pts = Config.SCORE.GOLD_BOMB_REWARD;
    this.score += pts;
    this.coins += Config.SCORE.GOLD_COIN_REWARD;
    this.bus.emit('score', { total: this.score, gained: pts, crit: true, x: fruit.x, y: fruit.y, gold: true });
    return pts;
  }
}
