/**
 * Modes.js
 * Each mode is a small Strategy object that configures rules and reacts to
 * lifecycle hooks. The Game engine stays identical across modes; only these
 * policies differ. This is the Open/Closed principle in action — new modes plug
 * in without editing the engine.
 *
 * Mode contract:
 *   id, label, description
 *   lives                       -> starting lives
 *   allowBombs                  -> SpawnSystem honours this
 *   timeLimitMs (optional)      -> Arcade
 *   init(game)                  -> one-time setup
 *   onUpdate(game, dt)          -> per-frame mode logic
 *   onFruitMissed(game)         -> fruit fell uncut
 *   onBomb(game)                -> bomb sliced
 *   isWin(game) / isLose(game)  -> end conditions
 */
import { Config } from '../config/Config.js';

class BaseMode {
  spawnInterval(diff) { return diff.spawnInterval; }
  waveSize(diff) { return diff.waveSize; }
  init() {}
  onUpdate() {}
  onFruitMissed() {}
  onBomb() {}
  isWin() { return false; }
}

/** CLASSIC — lose a life per missed fruit, instant fail on bomb. */
export class ClassicMode extends BaseMode {
  constructor() { super(); this.id = 'classic'; this.label = 'Classic'; this.description = '3 lives. Miss fruit or hit a bomb and it\'s over.'; this.lives = Config.LIVES.CLASSIC; this.allowBombs = true; }
  onFruitMissed(game) { game.loseLife(1); }
  onBomb(game) { game.loseLife(game.lives); } // instant game over
  isLose(game) { return game.lives <= 0; }
}

/** ARCADE — 60-second rush, no lives, bombs only cost points & shake. */
export class ArcadeMode extends BaseMode {
  constructor() { super(); this.id = 'arcade'; this.label = 'Arcade'; this.description = '60 seconds. No lives — slice everything, bombs cost points.'; this.lives = Infinity; this.allowBombs = true; this.timeLimitMs = Config.MODES.ARCADE_DURATION_MS; }
  init(game) { this.remaining = this.timeLimitMs; this.frenzyTimer = Config.MODES.ARCADE_FRENZY_MS; }
  onUpdate(game, dt) {
    this.remaining -= dt * 1000;
    game.modeTimer = Math.max(0, this.remaining);
    this.frenzyTimer -= dt * 1000;
    if (this.frenzyTimer <= 0) { game.spawn.frenzy(10); this.frenzyTimer = Config.MODES.ARCADE_FRENZY_MS + Math.random() * 4000; }
  }
  onBomb(game) {
    game.score.score = Math.max(0, game.score.score - 50); // penalty, not death
    game.renderer.triggerShake(18);
    game.renderer.triggerFlash(0.5, '255,90,54');
  }
  isWin(game) { return this.remaining <= 0; } // time up = run complete (always "win" screen w/ score)
  isLose() { return false; }
}

/** SURVIVAL — one life, bombs and misses both kill, relentless pacing. */
export class SurvivalMode extends BaseMode {
  constructor() { super(); this.id = 'survival'; this.label = 'Survival'; this.description = 'One life. One mistake. How long can you last?'; this.lives = Config.LIVES.SURVIVAL; this.allowBombs = true; }
  init(game) { this.survived = 0; }
  onUpdate(game, dt) { this.survived += dt; game.survivalTime = this.survived; }
  spawnInterval(diff) { return diff.spawnInterval * 0.8; } // 20% faster than baseline
  waveSize(diff) { return diff.waveSize + 1; }
  onFruitMissed(game) { game.loseLife(1); }
  onBomb(game) { game.loseLife(game.lives); }
  isLose(game) { return game.lives <= 0; }
}

export const MODES = {
  classic: () => new ClassicMode(),
  arcade: () => new ArcadeMode(),
  survival: () => new SurvivalMode(),
};
