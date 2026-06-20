/**
 * AudioSystem.js
 * Procedural sound via the Web Audio API. Generating SFX synthetically keeps the
 * bundle tiny (no .mp3/.wav downloads) and lets every effect scale with combo /
 * pitch. Swapping to sampled audio later means feeding AudioBuffers into the same
 * play* methods — call-sites don't change.
 *
 * Sound mapping (where each is triggered):
 *   sliceFruit()  -> SliceSystem on a successful fruit cut ('whoosh' + 'splat')
 *   bomb()        -> SliceSystem when a bomb is hit (explosion)
 *   combo(n)      -> ComboSystem when a combo tier is reached (rising arpeggio)
 *   score()       -> ScoreSystem coin/point pickups (bright blip)
 *   freeze()      -> frost bomb (downward sweep)
 *   gameOver()    -> Game on fail (descending tone)
 *   ui()          -> UI button taps
 */
export class AudioSystem {
  constructor(storage) {
    this.storage = storage;
    this.ctx = null;
    this.master = null;
    this.enabled = storage.data.settings.sound;
  }

  /** Lazily create the AudioContext on first user gesture (autoplay policy). */
  _ensure() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
  }

  setEnabled(on) {
    this.enabled = on;
    this.storage.data.settings.sound = on;
    this.storage.save();
  }

  _tone(freq, dur, type = 'sine', gain = 0.3, slideTo = null) {
    if (!this.enabled) return;
    this._ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(this.master);
    osc.start(t); osc.stop(t + dur);
  }

  _noise(dur, gain = 0.4, filterFreq = 1200) {
    if (!this.enabled) return;
    this._ensure();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const flt = this.ctx.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = filterFreq;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(flt); flt.connect(g); g.connect(this.master);
    src.start(t);
  }

  // --- Public SFX vocabulary ---
  sliceFruit() { this._tone(520 + Math.random() * 120, 0.12, 'triangle', 0.18, 180); this._noise(0.12, 0.12, 2600); }
  bomb()       { this._noise(0.5, 0.6, 600); this._tone(70, 0.5, 'sawtooth', 0.4, 30); }
  freeze()     { this._tone(900, 0.5, 'sine', 0.25, 160); }
  gold()       { this._tone(660, 0.1, 'square', 0.2, 990); this._tone(990, 0.18, 'square', 0.18); }
  combo(n)     { const base = 440 + n * 60; this._tone(base, 0.14, 'square', 0.18, base * 1.5); }
  score()      { this._tone(880, 0.06, 'sine', 0.12); }
  gameOver()   { this._tone(440, 0.7, 'sawtooth', 0.3, 110); }
  ui()         { this._tone(660, 0.05, 'sine', 0.12); }
}
