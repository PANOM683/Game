const LEVELS = [
  {
    level: 1,
    waves: [
      { walkers: 4, chargers: 0, shooters: 0 },
      { walkers: 6, chargers: 0, shooters: 0 },
      { walkers: 6, chargers: 1, shooters: 0 },
    ],
    spawnInterval: 1.5,
    title: "LEVEL 1",
    subtitle: "THEY COME...",
    layout: {},
    theme: {
      floor: ["#1a1a2e", "#16213e", "#1a1a2e", "#12122a"],
      decal: ["#1e1e36", "#22223a"],
      ambiance: "none",
    },
  },
  {
    level: 2,
    waves: [
      { walkers: 6, chargers: 2, shooters: 0 },
      { walkers: 4, chargers: 2, shooters: 1 },
      { walkers: 8, chargers: 2, shooters: 1, splitters: 1 },
    ],
    spawnInterval: 1.2,
    title: "LEVEL 2",
    subtitle: "MORE INCOMING",
    layout: {
      pillars: [
        { x: 150, y: 150, w: 60, h: 60 },
        { x: 590, y: 390, w: 60, h: 60 },
      ],
    },
    theme: {
      floor: ["#1e1e28", "#242430", "#1e1e28", "#181822"],
      decal: ["#2a2a36", "#302f3c"],
      ambiance: "dust",
    },
  },
  {
    level: 3,
    waves: [
      { walkers: 8, chargers: 3, shooters: 2, splitters: 1 },
      { walkers: 6, chargers: 4, shooters: 3, splitters: 1, medics: 1 },
      { walkers: 10, chargers: 4, shooters: 3, splitters: 2, medics: 1 },
    ],
    spawnInterval: 1.0,
    title: "LEVEL 3",
    subtitle: "HOLD THE LINE",
    layout: {
      pillars: [
        { x: 120, y: 450, w: 50, h: 120 },
        { x: 630, y: 80, w: 50, h: 120 },
      ],
      hazards: [{ x: 400, y: 300, radius: 55 }],
    },
    theme: {
      floor: ["#0f2418", "#123020", "#0f2418", "#0a1c12"],
      decal: ["#164028", "#1a4a30"],
      ambiance: "acid",
    },
  },
  {
    level: 4,
    waves: [
      { walkers: 10, chargers: 4, shooters: 3, splitters: 1, assassins: 1 },
      { walkers: 8, chargers: 5, shooters: 4, splitters: 2, medics: 1, assassins: 1 },
      { walkers: 12, chargers: 5, shooters: 5, splitters: 2, medics: 2, assassins: 2 },
    ],
    spawnInterval: 0.9,
    title: "LEVEL 4",
    subtitle: "OVERWHELMED?",
    layout: {
      pillars: [
        { x: 250, y: 120, w: 70, h: 50 },
        { x: 480, y: 430, w: 70, h: 50 },
      ],
      hazards: [
        { x: 150, y: 480, radius: 50 },
        { x: 650, y: 120, radius: 50 },
      ],
      barrels: [{ x: 400, y: 150 }, { x: 400, y: 450 }],
    },
    theme: {
      floor: ["#2a1414", "#301818", "#2a1414", "#220f0f"],
      decal: ["#3a1c1c", "#402020"],
      ambiance: "embers",
    },
  },
  {
    level: 5,
    waves: [
      { walkers: 12, chargers: 6, shooters: 5, splitters: 2, medics: 2, assassins: 2 },
      { walkers: 10, chargers: 7, shooters: 6, splitters: 3, medics: 2, assassins: 3 },
      { walkers: 15, chargers: 8, shooters: 6, splitters: 3, medics: 3, assassins: 3 },
    ],
    spawnInterval: 0.7,
    title: "LEVEL 5",
    subtitle: "THE GATEKEEPER AWAITS",
    boss: true,
    bossTier: 1,
    layout: {
      pillars: [
        { x: 100, y: 300, w: 50, h: 140 },
        { x: 650, y: 300, w: 50, h: 140 },
        { x: 375, y: 80, w: 50, h: 50 },
      ],
      hazards: [
        { x: 250, y: 500, radius: 60 },
        { x: 550, y: 100, radius: 60 },
      ],
      barrels: [{ x: 250, y: 150 }, { x: 550, y: 450 }, { x: 400, y: 200 }],
    },
    theme: {
      floor: ["#1a1030", "#20143a", "#1a1030", "#140c26"],
      decal: ["#2a1c4a", "#301f52"],
      ambiance: "void",
    },
  },
  {
    level: 6,
    waves: [
      { walkers: 14, chargers: 7, shooters: 6, splitters: 2, medics: 2, assassins: 3 },
      { walkers: 12, chargers: 8, shooters: 7, splitters: 3, medics: 3, assassins: 3 },
      { walkers: 17, chargers: 9, shooters: 7, splitters: 4, medics: 3, assassins: 4 },
    ],
    spawnInterval: 0.65,
    title: "LEVEL 6",
    subtitle: "NO REST",
    layout: {
      pillars: [
        { x: 140, y: 140, w: 60, h: 60 },
        { x: 600, y: 140, w: 60, h: 60 },
        { x: 370, y: 480, w: 60, h: 60 },
      ],
      hazards: [{ x: 400, y: 300, radius: 55 }],
      barrels: [{ x: 200, y: 420 }, { x: 600, y: 420 }],
    },
    theme: {
      floor: ["#241c14", "#2a2118", "#241c14", "#1c150f"],
      decal: ["#332619", "#3a2c1d"],
      ambiance: "dust",
    },
  },
  {
    level: 7,
    waves: [
      { walkers: 16, chargers: 8, shooters: 7, splitters: 3, medics: 3, assassins: 3 },
      { walkers: 14, chargers: 9, shooters: 8, splitters: 4, medics: 3, assassins: 4 },
      { walkers: 19, chargers: 10, shooters: 9, splitters: 4, medics: 4, assassins: 4 },
    ],
    spawnInterval: 0.6,
    title: "LEVEL 7",
    subtitle: "SWARM RISING",
    layout: {
      pillars: [
        { x: 130, y: 460, w: 55, h: 120 },
        { x: 620, y: 460, w: 55, h: 120 },
      ],
      hazards: [
        { x: 250, y: 160, radius: 55 },
        { x: 550, y: 160, radius: 55 },
      ],
      barrels: [{ x: 400, y: 320 }],
    },
    theme: {
      floor: ["#0c2416", "#0f2c1a", "#0c2416", "#081c10"],
      decal: ["#134a28", "#175a30"],
      ambiance: "acid",
    },
  },
  {
    level: 8,
    waves: [
      { walkers: 18, chargers: 9, shooters: 8, splitters: 3, medics: 4, assassins: 4 },
      { walkers: 16, chargers: 10, shooters: 9, splitters: 4, medics: 4, assassins: 5 },
      { walkers: 21, chargers: 12, shooters: 10, splitters: 5, medics: 4, assassins: 5 },
    ],
    spawnInterval: 0.55,
    title: "LEVEL 8",
    subtitle: "BLACKOUT",
    layout: {
      pillars: [
        { x: 200, y: 200, w: 55, h: 55 },
        { x: 545, y: 200, w: 55, h: 55 },
        { x: 200, y: 400, w: 55, h: 55 },
        { x: 545, y: 400, w: 55, h: 55 },
      ],
      hazards: [{ x: 400, y: 300, radius: 65 }],
      barrels: [{ x: 400, y: 130 }, { x: 400, y: 470 }],
    },
    theme: {
      floor: ["#08080e", "#0b0b14", "#08080e", "#05050a"],
      decal: ["#12121e", "#161624"],
      ambiance: "embers",
    },
  },
  {
    level: 9,
    waves: [
      { walkers: 20, chargers: 10, shooters: 9, splitters: 4, medics: 4, assassins: 5 },
      { walkers: 18, chargers: 12, shooters: 10, splitters: 5, medics: 4, assassins: 6 },
      { walkers: 23, chargers: 14, shooters: 12, splitters: 6, medics: 5, assassins: 6 },
    ],
    spawnInterval: 0.5,
    title: "LEVEL 9",
    subtitle: "BREAKING POINT",
    layout: {
      pillars: [
        { x: 110, y: 300, w: 50, h: 160 },
        { x: 640, y: 300, w: 50, h: 160 },
      ],
      hazards: [
        { x: 300, y: 150, radius: 55 },
        { x: 500, y: 450, radius: 55 },
      ],
      barrels: [{ x: 250, y: 470 }, { x: 550, y: 130 }, { x: 400, y: 300 }],
    },
    theme: {
      floor: ["#2a0e0e", "#331111", "#2a0e0e", "#210a0a"],
      decal: ["#421515", "#4a1818"],
      ambiance: "embers",
    },
  },
  {
    level: 10,
    waves: [
      { walkers: 22, chargers: 12, shooters: 10, splitters: 4, medics: 5, assassins: 5 },
      { walkers: 20, chargers: 14, shooters: 12, splitters: 5, medics: 5, assassins: 6 },
      { walkers: 26, chargers: 16, shooters: 14, splitters: 6, medics: 5, assassins: 7 },
    ],
    spawnInterval: 0.45,
    title: "LEVEL 10",
    subtitle: "FINAL STAND",
    boss: true,
    bossTier: 2,
    layout: {
      pillars: [
        { x: 90, y: 300, w: 50, h: 150 },
        { x: 660, y: 300, w: 50, h: 150 },
        { x: 375, y: 90, w: 50, h: 50 },
        { x: 375, y: 460, w: 50, h: 50 },
      ],
      hazards: [
        { x: 220, y: 480, radius: 60 },
        { x: 580, y: 120, radius: 60 },
      ],
      barrels: [{ x: 220, y: 150 }, { x: 580, y: 450 }],
    },
    theme: {
      floor: ["#120818", "#170a1e", "#120818", "#0d0612"],
      decal: ["#220e30", "#281138"],
      ambiance: "void",
    },
  },
];

function getSpawnPosition() {
  const side = Math.floor(Math.random() * 4);
  const margin = 30;
  if (side === 0) return { x: Math.random() * 800, y: -margin };
  if (side === 1) return { x: 800 + margin, y: Math.random() * 600 };
  if (side === 2) return { x: Math.random() * 800, y: 600 + margin };
  return { x: -margin, y: Math.random() * 600 };
}

const WAVE_TYPE_KEYS = [
  ["walkers", "walker"],
  ["chargers", "charger"],
  ["shooters", "shooter"],
  ["splitters", "splitter"],
  ["medics", "medic"],
  ["assassins", "assassin"],
];

class WaveManager {
  constructor(levelData) {
    this.levelData = levelData;
    this.currentWave = 0;
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.spawnInterval = levelData.spawnInterval;
    this.allSpawned = false;
    this.buildQueue();
  }

  buildQueue() {
    const wave = this.levelData.waves[this.currentWave];
    if (!wave) return;
    const q = [];
    for (const [key, type] of WAVE_TYPE_KEYS) {
      const n = wave[key] || 0;
      for (let i = 0; i < n; i++) q.push(type);
    }
    for (let i = q.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [q[i], q[j]] = [q[j], q[i]];
    }
    this.spawnQueue = q;
    this.allSpawned = false;
    this.spawnTimer = 0;
  }

  update(dt, enemies) {
    if (this.allSpawned) return;
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.spawnQueue.length > 0) {
      const type = this.spawnQueue.shift();
      const pos = getSpawnPosition();
      const enemy = new Enemy(pos.x, pos.y, type);
      const mult = window.GameSettings ? GameSettings.hpMult() : 1;
      const dmult = window.GameSettings ? GameSettings.dmgMult() : 1;
      enemy.hp = Math.round(enemy.hp * mult);
      enemy.maxHp = enemy.hp;
      enemy.damage = Math.round(enemy.damage * dmult);
      enemies.push(enemy);
      const smult = window.GameSettings ? GameSettings.spawnMult() : 1;
      this.spawnTimer = this.spawnInterval * smult;
    }
    if (this.spawnQueue.length === 0) this.allSpawned = true;
  }

  isWaveClear(enemies) {
    return (
      this.allSpawned && enemies.every((e) => e.dead && e.isExplosionDone())
    );
  }

  nextWave() {
    this.currentWave++;
    if (this.currentWave < this.levelData.waves.length) {
      this.buildQueue();
      return true;
    }
    return false;
  }

  isLevelComplete(enemies) {
    return (
      this.currentWave >= this.levelData.waves.length &&
      enemies.every((e) => e.dead && e.isExplosionDone())
    );
  }

  getWaveInfo() {
    return {
      current: this.currentWave + 1,
      total: this.levelData.waves.length,
    };
  }
}
