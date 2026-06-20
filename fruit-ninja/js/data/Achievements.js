/**
 * Achievements.js
 * Declarative achievement registry + a tracker that listens to gameplay events
 * and unlocks milestones, awarding coins. Adding an achievement is a data edit.
 */
export const ACHIEVEMENTS = [
  { id: 'first_blood',  name: 'First Slice',     desc: 'Slice your first fruit',        reward: 10,  check: (s) => s.totalFruitSliced >= 1 },
  { id: 'combo_5',      name: 'Combo Starter',   desc: 'Reach a 5x combo',              reward: 25,  check: (s) => s.bestComboEver >= 5 },
  { id: 'combo_10',     name: 'Combo Master',    desc: 'Reach a 10x combo',             reward: 60,  check: (s) => s.bestComboEver >= 10 },
  { id: 'slicer_100',   name: 'Fruit Salad',     desc: 'Slice 100 fruit total',         reward: 40,  check: (s) => s.totalFruitSliced >= 100 },
  { id: 'slicer_1000',  name: 'Greengrocer',     desc: 'Slice 1000 fruit total',        reward: 150, check: (s) => s.totalFruitSliced >= 1000 },
  { id: 'score_500',    name: 'Sharp',           desc: 'Score 500 in a single run',     reward: 50,  check: (s) => s.bestScoreEver >= 500 },
  { id: 'score_2000',   name: 'Blademaster',     desc: 'Score 2000 in a single run',    reward: 200, check: (s) => s.bestScoreEver >= 2000 },
  { id: 'goldrush',     name: 'Gold Rush',       desc: 'Hit a Gold Bomb',               reward: 30,  check: (s) => s.goldHit >= 1 },
  { id: 'survivor',     name: 'Survivor',        desc: 'Last 60s in Survival',          reward: 100, check: (s) => s.survivalTime >= 60 },
  { id: 'rich',         name: 'Tycoon',          desc: 'Hold 1000 coins',               reward: 0,   check: (s) => s.coins >= 1000 },
];

export class Achievements {
  constructor(storage, bus) {
    this.storage = storage;
    this.bus = bus;
    // Aggregate stats used by checks; merged from persistent + session data.
    this.stats = {
      totalFruitSliced: storage.data.totalFruitSliced,
      bestComboEver: storage.data.totalCombosMax,
      bestScoreEver: Math.max(...Object.values(storage.data.highScores), 0),
      coins: storage.coins,
      goldHit: 0, survivalTime: 0,
    };
  }

  /** Re-evaluate all locked achievements; emit + reward newly unlocked ones. */
  evaluate() {
    this.stats.coins = this.storage.coins;
    this.stats.totalFruitSliced = this.storage.data.totalFruitSliced;
    for (const a of ACHIEVEMENTS) {
      if (this.storage.data.achievements[a.id]) continue;
      if (a.check(this.stats)) {
        this.storage.data.achievements[a.id] = true;
        if (a.reward) this.storage.addCoins(a.reward);
        this.storage.save();
        this.bus.emit('achievement', a);
      }
    }
  }

  unlockedList() {
    return ACHIEVEMENTS.map(a => ({ ...a, unlocked: !!this.storage.data.achievements[a.id] }));
  }
}
