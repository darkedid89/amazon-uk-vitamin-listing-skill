/**
 * UIManager.js
 * The presentation layer. It renders all menu/overlay screens as DOM (cheap,
 * accessible, crisp text) over the gameplay canvas, subscribes to the EventBus
 * to reflect game state, and forwards user intent back to the Game API.
 *
 * Keeping UI in the DOM (rather than canvas-drawn) gives us free accessibility,
 * easy theming via CSS, and pixel-perfect typography on every DPR.
 */
import { ACHIEVEMENTS } from '../data/Achievements.js';

export class UIManager {
  constructor({ game, bus, storage, shop, achievements, daily, audio }) {
    this.game = game;
    this.bus = bus;
    this.storage = storage;
    this.shop = shop;
    this.achievements = achievements;
    this.daily = daily;
    this.audio = audio;
    this.$ = (id) => document.getElementById(id);
    this.screens = {};
    this._cacheDom();
    this._bindButtons();
    this._bindBus();
    this._startHudLoop();
    this.showScreen('menu');
    this.refreshMenu();
    this._maybeShowDaily();
  }

  _cacheDom() {
    ['menu', 'game', 'pause', 'over', 'shop', 'achievements', 'leaderboard', 'daily', 'modeSelect']
      .forEach(id => this.screens[id] = this.$('screen-' + id));
  }

  showScreen(name) {
    for (const k in this.screens) this.screens[k]?.classList.toggle('active', k === name);
    this._current = name;
  }

  overlay(name, on) { this.screens[name]?.classList.toggle('active', on); }

  // --- Button wiring --------------------------------------------------------
  _bindButtons() {
    const click = (id, fn) => { const el = this.$(id); if (el) el.addEventListener('click', () => { this.audio.ui(); fn(); }); };

    click('btn-play', () => { this.showScreen('modeSelect'); });
    click('btn-shop', () => { this.renderShop(); this.showScreen('shop'); });
    click('btn-achievements', () => { this.renderAchievements(); this.showScreen('achievements'); });
    click('btn-leaderboard', () => { this.renderLeaderboard('classic'); this.showScreen('leaderboard'); });
    click('btn-daily-open', () => { this.renderDaily(); this.showScreen('daily'); });

    // Mode select
    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => { this.audio.ui(); this._startGame(btn.dataset.mode); });
    });
    click('btn-mode-back', () => this.showScreen('menu'));

    // In-game HUD
    click('btn-pause', () => { this.game.pause(); this.showScreen('pause'); });
    click('btn-resume', () => { this.game.resume(); this.showScreen('game'); });
    click('btn-pause-restart', () => { this._startGame(this.game.mode.id); });
    click('btn-pause-quit', () => { this.game.quit(); this.showScreen('menu'); this.refreshMenu(); });

    // Game over
    click('btn-retry', () => { this._startGame(this._lastMode); });
    click('btn-over-menu', () => { this.game.quit(); this.showScreen('menu'); this.refreshMenu(); });

    // Sub-screen backs
    ['shop', 'achievements', 'leaderboard', 'daily'].forEach(s =>
      click('btn-' + s + '-back', () => { this.showScreen('menu'); this.refreshMenu(); }));

    // Leaderboard tabs
    document.querySelectorAll('[data-board]').forEach(b =>
      b.addEventListener('click', () => { this.audio.ui(); this.renderLeaderboard(b.dataset.board); }));

    // Sound toggle
    click('btn-sound', () => {
      const on = !this.audio.enabled; this.audio.setEnabled(on); this.refreshMenu();
    });

    // Keyboard: P/Esc pause, R restart.
    window.addEventListener('keydown', (e) => {
      if (!this.game.running || this.game.over) return;
      if (e.key === 'p' || e.key === 'Escape') {
        if (this.game.paused) { this.game.resume(); this.showScreen('game'); }
        else { this.game.pause(); this.showScreen('pause'); }
      }
    });
  }

  _startGame(modeId) {
    this._lastMode = modeId;
    this.game.start(modeId);
    this.showScreen('game');
  }

  // --- EventBus reactions ---------------------------------------------------
  _bindBus() {
    this.bus.on('game:start', () => this._updateLives(this.game.lives));
    this.bus.on('game:over', (d) => this._showGameOver(d));
    this.bus.on('combo', (d) => this._popCombo(d));
    this.bus.on('score', (d) => this._popScore(d));
    this.bus.on('achievement', (a) => this._toast(`🏆 ${a.name}` + (a.reward ? `  +${a.reward}🪙` : ''), '#ffd84d'));
    this.bus.on('shop:bought', (s) => this._toast(`Unlocked ${s.name}!`, s.glow));
    this.bus.on('daily:claimed', (d) => this._toast(`Daily reward +${d.amount}🪙`, '#ffd84d'));
    this.bus.on('frost:start', () => this._toast('❄ FROST!', '#bdeaff'));
    this.bus.on('gold:hit', (d) => this._toast(`★ GOLD +${d.points}`, '#ffd84d'));
    this.bus.on('life:lost', (d) => this._updateLives(d.lives));
  }

  // --- HUD ------------------------------------------------------------------
  _startHudLoop() {
    const tick = () => {
      if (this._current === 'game' && this.game.running && !this.game.over) {
        this.$('hud-score').textContent = this.game.score.score;
        this.$('hud-coins').textContent = '🪙 ' + (this.storage.coins + this.game.score.coins);
        // Mode-specific HUD readout.
        const t = this.$('hud-timer');
        if (this.game.mode.timeLimitMs) {
          t.textContent = '⏱ ' + (this.game.modeTimer / 1000).toFixed(1) + 's';
          t.style.display = '';
        } else if (this.game.mode.id === 'survival') {
          t.textContent = '⏱ ' + Math.floor(this.game.survivalTime) + 's';
          t.style.display = '';
        } else t.style.display = 'none';
        this.$('hud-fps').textContent = this.game.loop.fps + ' FPS';
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  _updateLives(lives) {
    const wrap = this.$('hud-lives');
    if (!isFinite(lives)) { wrap.innerHTML = '∞'; return; }
    wrap.innerHTML = '';
    const max = this.game.mode.lives;
    for (let i = 0; i < (isFinite(max) ? max : 0); i++) {
      const s = document.createElement('span');
      s.className = 'life' + (i < lives ? '' : ' lost');
      s.textContent = '❤';
      wrap.appendChild(s);
    }
  }

  _popCombo(d) {
    const el = this.$('combo-pop');
    el.textContent = (d.perfect ? 'PERFECT ' : '') + d.count + 'x COMBO';
    el.style.color = d.perfect ? '#ffd84d' : '#fff';
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  }

  _popScore(d) {
    // Floating "+N" near the slice point, in screen space.
    const vp = this.game.renderer.getViewport();
    const sx = (d.x * vp.scale + vp.offsetX) / this.game.renderer.dpr;
    const sy = (d.y * vp.scale + vp.offsetY) / this.game.renderer.dpr;
    const el = document.createElement('div');
    el.className = 'float-score' + (d.crit ? ' crit' : '') + (d.gold ? ' gold' : '');
    el.textContent = (d.gold ? '★ ' : (d.crit ? 'CRIT ' : '+')) + d.gained;
    el.style.left = sx + 'px'; el.style.top = sy + 'px';
    this.$('float-layer').appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  _toast(msg, color = '#fff') {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    el.style.borderColor = color;
    el.style.color = color;
    this.$('toast-layer').appendChild(el);
    setTimeout(() => el.classList.add('out'), 1800);
    setTimeout(() => el.remove(), 2300);
  }

  // --- Screens content ------------------------------------------------------
  refreshMenu() {
    this.$('menu-coins').textContent = '🪙 ' + this.storage.coins;
    this.$('menu-hs-classic').textContent = this.storage.getHighScore('classic');
    this.$('menu-hs-arcade').textContent = this.storage.getHighScore('arcade');
    this.$('menu-hs-survival').textContent = this.storage.getHighScore('survival');
    this.$('btn-sound').textContent = this.audio.enabled ? '🔊' : '🔇';
    const ds = this.daily.status();
    const badge = this.$('daily-badge');
    if (badge) badge.style.display = ds.available ? '' : 'none';
  }

  _showGameOver(d) {
    this._lastMode = d.mode;
    this.$('over-title').textContent = d.win ? (d.mode === 'arcade' ? "TIME'S UP!" : 'YOU WIN!') : 'GAME OVER';
    this.$('over-title').className = d.win ? 'win' : 'lose';
    this.$('over-score').textContent = d.score;
    this.$('over-best').textContent = d.highScore;
    this.$('over-combo').textContent = d.bestCombo + 'x';
    this.$('over-coins').textContent = '+' + d.coins;
    this.$('over-highscore').style.display = d.isHighScore ? '' : 'none';
    const extra = this.$('over-extra');
    extra.textContent = d.mode === 'survival' ? `Survived ${d.survived}s` : '';
    this.showScreen('over');
  }

  renderShop() {
    const wrap = this.$('shop-list');
    wrap.innerHTML = '';
    this.$('shop-coins').textContent = '🪙 ' + this.storage.coins;
    for (const s of this.shop.catalogue()) {
      const card = document.createElement('div');
      card.className = 'shop-card' + (s.equipped ? ' equipped' : '');
      card.innerHTML = `
        <div class="blade-preview" style="--o:${s.outer};--i:${s.inner};--g:${s.glow}"></div>
        <div class="shop-name">${s.name}</div>
        <button class="shop-buy"></button>`;
      const btn = card.querySelector('.shop-buy');
      if (s.equipped) { btn.textContent = 'Equipped'; btn.disabled = true; }
      else if (s.owned) { btn.textContent = 'Equip'; btn.onclick = () => { this.audio.ui(); this.shop.equip(s.id); this.renderShop(); }; }
      else { btn.textContent = '🪙 ' + s.price; btn.onclick = () => {
        this.audio.ui();
        const res = this.shop.buy(s.id);
        if (!res.ok && res.reason === 'funds') this._toast('Not enough coins', '#ff6b6b');
        this.renderShop(); this.refreshMenu();
      }; }
      wrap.appendChild(card);
    }
  }

  renderAchievements() {
    const wrap = this.$('ach-list');
    wrap.innerHTML = '';
    const unlocked = this.achievements.unlockedList();
    this.$('ach-progress').textContent =
      `${unlocked.filter(a => a.unlocked).length} / ${ACHIEVEMENTS.length}`;
    for (const a of unlocked) {
      const row = document.createElement('div');
      row.className = 'ach-row' + (a.unlocked ? ' done' : '');
      row.innerHTML = `<span class="ach-ico">${a.unlocked ? '🏆' : '🔒'}</span>
        <div><div class="ach-name">${a.name}</div><div class="ach-desc">${a.desc}</div></div>
        <span class="ach-reward">${a.reward ? '+' + a.reward + '🪙' : ''}</span>`;
      wrap.appendChild(row);
    }
  }

  renderLeaderboard(mode) {
    document.querySelectorAll('[data-board]').forEach(b =>
      b.classList.toggle('active', b.dataset.board === mode));
    const wrap = this.$('lb-list');
    wrap.innerHTML = '';
    const board = this.storage.data.leaderboard[mode] || [];
    if (!board.length) { wrap.innerHTML = '<div class="lb-empty">No scores yet — go slice!</div>'; return; }
    board.forEach((e, i) => {
      const row = document.createElement('div');
      row.className = 'lb-row' + (i === 0 ? ' top' : '');
      const date = new Date(e.date).toLocaleDateString();
      row.innerHTML = `<span class="lb-rank">${i + 1}</span>
        <span class="lb-score">${e.score}</span><span class="lb-date">${date}</span>`;
      wrap.appendChild(row);
    });
  }

  renderDaily() {
    const wrap = this.$('daily-ladder');
    wrap.innerHTML = '';
    const status = this.daily.status();
    this.daily.ladder().forEach(d => {
      const cell = document.createElement('div');
      const isToday = status.available && d.day === status.day;
      cell.className = 'daily-cell' + (d.claimed ? ' claimed' : '') + (isToday ? ' today' : '');
      cell.innerHTML = `<div class="daily-day">Day ${d.day}</div>
        <div class="daily-amt">🪙${d.amount}</div>`;
      wrap.appendChild(cell);
    });
    const btn = this.$('btn-daily-claim');
    if (status.available) {
      btn.disabled = false; btn.textContent = `Claim Day ${status.day} (+${status.amount}🪙)`;
      btn.onclick = () => {
        this.audio.ui();
        const r = this.daily.claim();
        if (r.ok) { this.renderDaily(); this.refreshMenu(); }
      };
    } else { btn.disabled = true; btn.textContent = 'Come back tomorrow!'; }
  }

  _maybeShowDaily() {
    if (this.daily.status().available) {
      this.renderDaily();
      setTimeout(() => this.showScreen('daily'), 400);
    }
  }
}
