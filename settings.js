const GameSettings = (() => {
  const STORAGE_KEY = "topdownshooter_settings";
  const HIGHSCORE_KEY = "topdownshooter_highscore";

  let volume = 0.6;
  let difficulty = "normal";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.volume === "number") volume = parsed.volume;
        if (parsed.difficulty === "hard" || parsed.difficulty === "normal") {
          difficulty = parsed.difficulty;
        }
      }
    } catch (e) {
      /* localStorage unavailable; fall back to defaults */
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume, difficulty }));
    } catch (e) {
      /* ignore */
    }
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    save();
    if (window.AudioEngine) AudioEngine.setVolume(volume);
  }

  function setDifficulty(d) {
    difficulty = d === "hard" ? "hard" : "normal";
    save();
  }

  function hpMult() {
    return difficulty === "hard" ? 1.3 : 1;
  }

  function dmgMult() {
    return difficulty === "hard" ? 1.25 : 1;
  }

  function spawnMult() {
    return difficulty === "hard" ? 0.85 : 1;
  }

  function getHighScore() {
    try {
      return parseInt(localStorage.getItem(HIGHSCORE_KEY) || "0", 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function setHighScore(v) {
    try {
      localStorage.setItem(HIGHSCORE_KEY, String(v));
    } catch (e) {
      /* ignore */
    }
  }

  load();

  return {
    get volume() {
      return volume;
    },
    get difficulty() {
      return difficulty;
    },
    setVolume,
    setDifficulty,
    hpMult,
    dmgMult,
    spawnMult,
    getHighScore,
    setHighScore,
  };
})();
