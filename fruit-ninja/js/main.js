/**
 * main.js
 * Composition root. Builds the dependency graph once and starts the game.
 * Everything is constructed here and injected downward (manual DI) — there is no
 * global singleton state, which keeps the code testable and the data flow clear.
 */
import { EventBus } from './core/EventBus.js';
import { Storage } from './data/Storage.js';
import { AudioSystem } from './systems/AudioSystem.js';
import { Shop } from './data/Shop.js';
import { Achievements } from './data/Achievements.js';
import { DailyRewards } from './data/DailyRewards.js';
import { Game } from './core/Game.js';
import { UIManager } from './ui/UIManager.js';

function boot() {
  const canvas = document.getElementById('game-canvas');
  const bus = new EventBus();
  const storage = new Storage();
  const audio = new AudioSystem(storage);
  const shop = new Shop(storage, bus);
  const achievements = new Achievements(storage, bus);
  const daily = new DailyRewards(storage, bus);

  const game = new Game({ canvas, bus, audio, storage, shop, achievements });
  // eslint-disable-next-line no-new
  new UIManager({ game, bus, storage, shop, achievements, daily, audio });

  // Pause automatically when the tab/app is backgrounded (battery + fairness).
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.running && !game.over && !game.paused) {
      game.pause();
      document.getElementById('screen-pause')?.classList.add('active');
      document.getElementById('screen-game')?.classList.remove('active');
    }
  });

  // Expose for debugging / e2e hooks (harmless in production).
  window.__ninja = { game, storage, bus, shop, achievements, daily };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
