const AudioEngine = (() => {
  let ctx = null;
  let masterGain = null;
  let musicGain = null;
  let sfxGain = null;
  let musicTimer = null;
  let musicStep = 0;
  let musicOn = false;
  let volume = 0.6;

  function ensureCtx() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.3;
    musicGain.connect(masterGain);
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 1;
    sfxGain.connect(masterGain);
  }

  function resume() {
    ensureCtx();
    if (ctx && ctx.state === "suspended") ctx.resume();
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.value = volume;
  }

  function beep({ freq = 440, duration = 0.08, type = "square", gain = 0.2, slideTo = null, delay = 0, dest = null }) {
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t0 + duration);
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(g);
    g.connect(dest || sfxGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function noiseBurst({ duration = 0.2, gain = 0.25, delay = 0 }) {
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    src.connect(g);
    g.connect(sfxGain);
    src.start(t0);
  }

  function playShoot() {
    beep({ freq: 880, duration: 0.05, type: "square", gain: 0.1, slideTo: 600 });
  }
  function playLaser() {
    beep({ freq: 1400, duration: 0.15, type: "sawtooth", gain: 0.13, slideTo: 300 });
  }
  function playGrenadeThrow() {
    beep({ freq: 220, duration: 0.12, type: "triangle", gain: 0.15, slideTo: 120 });
  }
  function playHit() {
    beep({ freq: 180, duration: 0.06, type: "square", gain: 0.09, slideTo: 80 });
  }
  function playExplosion() {
    noiseBurst({ duration: 0.35, gain: 0.28 });
    beep({ freq: 100, duration: 0.3, type: "sine", gain: 0.18, slideTo: 40 });
  }
  function playPickup() {
    beep({ freq: 660, duration: 0.08, type: "sine", gain: 0.16, slideTo: 990 });
    beep({ freq: 990, duration: 0.08, type: "sine", gain: 0.13, delay: 0.06 });
  }
  function playPlayerHurt() {
    beep({ freq: 220, duration: 0.15, type: "sawtooth", gain: 0.18, slideTo: 80 });
  }
  function playEnemyDeath() {
    noiseBurst({ duration: 0.15, gain: 0.16 });
  }
  function playLevelUp() {
    [523, 659, 784, 1047].forEach((f, i) =>
      beep({ freq: f, duration: 0.12, type: "square", gain: 0.14, delay: i * 0.09 }),
    );
  }
  function playBossRoar() {
    beep({ freq: 80, duration: 0.6, type: "sawtooth", gain: 0.28, slideTo: 40 });
    noiseBurst({ duration: 0.5, gain: 0.22, delay: 0.05 });
  }
  function playGameOver() {
    [400, 350, 300, 220].forEach((f, i) =>
      beep({ freq: f, duration: 0.25, type: "sawtooth", gain: 0.18, delay: i * 0.18 }),
    );
  }
  function playUiClick() {
    beep({ freq: 500, duration: 0.05, type: "square", gain: 0.1, slideTo: 700 });
  }

  const MUSIC_BASS = [110, 110, 130.8, 110, 146.8, 110, 130.8, 98];
  function musicStepFn() {
    if (!musicOn || !ctx) return;
    const note = MUSIC_BASS[musicStep % MUSIC_BASS.length];
    beep({ freq: note, duration: 0.18, type: "triangle", gain: 0.4, dest: musicGain });
    if (musicStep % 4 === 2) {
      beep({ freq: note * 2, duration: 0.08, type: "square", gain: 0.14, dest: musicGain });
    }
    musicStep++;
  }

  function startMusic() {
    ensureCtx();
    resume();
    if (musicOn || !ctx) return;
    musicOn = true;
    musicStep = 0;
    musicTimer = setInterval(musicStepFn, 220);
  }

  function stopMusic() {
    musicOn = false;
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
  }

  return {
    resume,
    setVolume,
    playShoot,
    playLaser,
    playGrenadeThrow,
    playHit,
    playExplosion,
    playPickup,
    playPlayerHurt,
    playEnemyDeath,
    playLevelUp,
    playBossRoar,
    playGameOver,
    playUiClick,
    startMusic,
    stopMusic,
  };
})();
