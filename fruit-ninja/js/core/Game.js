/**
 * Game.js
 * The application root / composition layer. It wires every system together,
 * drives the fixed-timestep loop, owns run-state (lives, frost timer, pause)
 * and exposes a small imperative API (start/pause/resume/quit) for the UI.
 *
 * Architecture note: Game is a *mediator*. Systems never reference each other
 * directly; they're constructed here and communicate results upward through the
 * EventBus, which the UI/audio/achievements observe. This keeps the dependency
 * graph a shallow star rather than a tangle.
 */
import { Config } from '../config/Config.js';
import { GameLoop } from './GameLoop.js';
import { InputManager } from './InputManager.js';
import { Renderer } from '../render/Renderer.js';
import { DifficultySystem } from '../systems/DifficultySystem.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { ComboSystem } from '../systems/ComboSystem.js';
import { ScoreSystem } from '../systems/ScoreSystem.js';
import { SliceSystem } from '../systems/SliceSystem.js';
import { MODES } from '../modes/Modes.js';

export class Game {
  constructor({ canvas, bus, audio, storage, shop, achievements }) {
    this.bus = bus;
    this.audio = audio;
    this.storage = storage;
    this.shop = shop;
    this.achievements = achievements;

    this.renderer = new Renderer(canvas);
    this.input = new InputManager(canvas, () => this.renderer.getViewport());

    this.difficulty = new DifficultySystem();
    this.spawn = new SpawnSystem(this.difficulty);
    this.particles = new ParticleSystem();
    this.combo = new ComboSystem(bus);
    this.score = new ScoreSystem(bus);
    this.slicer = new SliceSystem({
      score: this.score, combo: this.combo, particles: this.particles,
      audio: this.audio, bus,
    });

    this.loop = new GameLoop((dt) => this.update(dt), (a) => this.render(a));

    this.running = false;
    this.paused = false;
    this.over = false;
    this.mode = null;
    this.lives = 0;
    this.frostTimer = 0;       // ms of remaining time-dilation
    this.modeTimer = 0;
    this.survivalTime = 0;
    this.elapsed = 0;

    // Context object handed to SliceSystem so hazards can mutate run-state
    // without the slicer importing Game (avoids a circular dependency).
    this._ctx = {
      onBomb: (f) => this._handleBomb(f),
      onFreeze: () => this._handleFreeze(),
    };

    this._bindAchievementStats();
    this.loop.start(); // loop always runs; render shows menu bg when idle
  }

  _bindAchievementStats() {
    this.bus.on('fruit:sliced', () => {
      this.storage.data.totalFruitSliced++;
      this.achievements.stats.totalFruitSliced = this.storage.data.totalFruitSliced;
    });
    this.bus.on('gold:hit', () => { this.achievements.stats.goldHit++; });
  }

  // --- Lifecycle ------------------------------------------------------------
  start(modeId) {
    this.mode = MODES[modeId]();
    this.spawn.setPolicy(this.mode);
    this.reset();
    this.mode.init(this);
    this.lives = this.mode.lives;
    this.running = true;
    this.paused = false;
    this.over = false;
    this.bus.emit('game:start', { mode: this.mode });
  }

  reset() {
    this.difficulty.reset();
    this.spawn.clear();
    this.particles.clear();
    this.combo.reset();
    this.score.reset();
    this.frostTimer = 0;
    this.elapsed = 0;
    this.modeTimer = this.mode?.timeLimitMs || 0;
    this.survivalTime = 0;
    this.input.points.length = 0;
  }

  pause() { if (this.running && !this.over) { this.paused = true; this.bus.emit('game:pause'); } }
  resume() { if (this.running && !this.over) { this.paused = false; this.bus.emit('game:resume'); } }

  quit() {
    this.running = false;
    this.paused = false;
    this.spawn.clear();
    this.particles.clear();
    this.bus.emit('game:quit');
  }

  loseLife(n) {
    this.lives -= n;
    this.renderer.triggerShake(12);
    this.bus.emit('life:lost', { lives: this.lives });
    if (this.lives <= 0) this._end(false);
  }

  _handleBomb(f) {
    this.renderer.triggerShake(28);
    this.renderer.triggerFlash(0.7, '255,90,54');
    this.combo.count = 0;
    this.mode.onBomb(this);
  }

  _handleFreeze() {
    this.frostTimer = 4000; // 4s of slow-motion
    this.renderer.triggerFlash(0.4, '160,220,255');
    this.bus.emit('frost:start');
  }

  _end(win) {
    if (this.over) return;
    this.over = true;
    this.running = false;

    const mode = this.mode.id;
    const finalScore = this.score.score;
    const isHigh = this.storage.submitScore(mode, finalScore);
    this.storage.addCoins(this.score.coins);

    // Feed achievement tracker with this run's peaks.
    this.achievements.stats.bestComboEver = Math.max(this.achievements.stats.bestComboEver, this.combo.best);
    this.achievements.stats.bestScoreEver = Math.max(this.achievements.stats.bestScoreEver, finalScore);
    this.achievements.stats.survivalTime = Math.max(this.achievements.stats.survivalTime, this.survivalTime);
    if (this.combo.best > this.storage.data.totalCombosMax) this.storage.data.totalCombosMax = this.combo.best;
    this.storage.save();
    this.achievements.evaluate();

    this.audio.gameOver();
    this.bus.emit('game:over', {
      win, score: finalScore, coins: this.score.coins, bestCombo: this.combo.best,
      isHighScore: isHigh, highScore: this.storage.getHighScore(mode),
      survived: Math.floor(this.survivalTime), mode,
    });
  }

  // --- Simulation -----------------------------------------------------------
  update(dt) {
    if (!this.running || this.paused || this.over) return;

    this.elapsed += dt;
    // Frost dilation slows simulated objects (not the loop itself, so input
    // stays responsive). gravityScale < 1 => slow motion.
    let gravityScale = 1;
    if (this.frostTimer > 0) {
      this.frostTimer -= dt * 1000;
      gravityScale = 0.45;
    }

    this.difficulty.update(dt);
    this.mode.onUpdate(this, dt);
    this.spawn.update(dt, gravityScale);
    this.particles.update(dt, gravityScale);
    this.combo.update(dt);

    // Slice resolution uses real (un-dilated) input.
    this.input.update();
    this.slicer.update(this.spawn.live, this.input, this._ctx);

    // Apply life loss for fruit that fell uncut this frame (captured by the
    // spawn system before its sweep recycled them).
    const missed = this.spawn.consumeMissed();
    for (let i = 0; i < missed && !this.over; i++) this.mode.onFruitMissed(this);

    // End conditions.
    if (this.mode.isWin(this)) this._end(true);
    else if (this.mode.isLose(this)) this._end(false);
  }

  // --- Render ---------------------------------------------------------------
  render(alpha) {
    const r = this.renderer;
    r.beginFrame();

    if (this.running && !this.over) {
      for (const f of this.spawn.live) if (f.active) r.drawFruit(f, alpha);
    }
    for (const p of this.particles.live) if (p.active) r.drawParticle(p, alpha);

    if (this.running && !this.over && this.input.points.length > 1) {
      r.drawBlade(this.input.points, this.shop.equippedSkin());
    }

    r.endFrame();
  }
}
