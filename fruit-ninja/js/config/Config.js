/**
 * Config.js
 * Single source of truth for tunable game parameters.
 * Centralising balance values here keeps systems free of magic numbers and
 * makes the game easy to retune for live-ops (events, A/B tests, difficulty curves).
 */
export const Config = Object.freeze({
  // --- Reference resolution. The world is simulated in this virtual space and
  // scaled to the device viewport, guaranteeing identical balance on every screen. ---
  WORLD: { WIDTH: 1080, HEIGHT: 1920 },

  // --- Rendering ---
  RENDER: {
    MAX_DPR: 2,            // cap devicePixelRatio for performance on retina phones
    TARGET_FPS: 60,
    BG_TOP: '#0b1f3a',
    BG_BOTTOM: '#06101f',
  },

  // --- Fixed-timestep simulation ---
  SIM: {
    STEP_MS: 1000 / 120,   // physics ticks at 120 Hz for crisp slicing
    MAX_FRAME_MS: 250,     // clamp huge frame gaps (tab switch) to avoid spiral of death
  },

  // --- Physics (units are world-px and seconds) ---
  PHYSICS: {
    GRAVITY: 2100,
    AIR_DRAG: 0.0,
    SPIN_MIN: -4.5,
    SPIN_MAX: 4.5,
  },

  // --- Blade / input ---
  BLADE: {
    MAX_POINTS: 18,        // trail length
    POINT_LIFETIME_MS: 90,
    MIN_SLICE_SPEED: 250,  // world-px/s required for a swing to count as a slice
    COLOR: '#ffffff',
    WIDTH: 14,
  },

  // --- Scoring ---
  SCORE: {
    BASE_FRUIT: 10,
    COMBO_BONUS: 0.5,      // +50% per combo tier above 1
    CRIT_BONUS: 1.0,       // +100% on critical hit
    PERFECT_COMBO_BONUS: 2.0, // +200% bonus pool when a perfect (full wave) combo lands
    CRIT_CHANCE: 0.12,
    COMBO_WINDOW_MS: 600,  // slices within this window chain into a combo
    GOLD_BOMB_REWARD: 50,  // bonus points for correctly hitting a golden bomb
    GOLD_COIN_REWARD: 5,   // soft currency from golden bomb
  },

  // --- Lives / fail conditions ---
  LIVES: {
    CLASSIC: 3,
    ARCADE: Infinity,      // arcade is time-limited, not life-limited
    SURVIVAL: 1,
    BOMB_PENALTY_CLASSIC: 'gameover',
  },

  // --- Difficulty ramp: every RAMP_MS the wave pacing tightens. ---
  DIFFICULTY: {
    RAMP_MS: 30000,        // increase difficulty every 30 seconds
    MAX_LEVEL: 12,
    BASE_SPAWN_INTERVAL_MS: 1300,
    MIN_SPAWN_INTERVAL_MS: 380,
    BASE_WAVE_SIZE: 1,
    BOMB_BASE_CHANCE: 0.06,
    BOMB_MAX_CHANCE: 0.22,
  },

  // --- Mode-specific tuning ---
  MODES: {
    ARCADE_DURATION_MS: 60000,   // 60-second arcade rush
    ARCADE_FRENZY_MS: 5000,      // frenzy banana spawns a flurry
  },

  // --- Economy ---
  ECONOMY: {
    COINS_PER_FRUIT: 1,
    DAILY_REWARDS: [25, 40, 60, 90, 130, 180, 300], // 7-day login streak ladder
  },

  // --- Persistence ---
  STORAGE_KEY: 'ninja_fruit_save_v1',
});
