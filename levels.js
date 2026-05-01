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
  },
  {
    level: 2,
    waves: [
      { walkers: 6, chargers: 2, shooters: 0 },
      { walkers: 4, chargers: 2, shooters: 1 },
      { walkers: 8, chargers: 2, shooters: 1 },
    ],
    spawnInterval: 1.2,
    title: "LEVEL 2",
    subtitle: "MORE INCOMING",
  },
  {
    level: 3,
    waves: [
      { walkers: 8, chargers: 3, shooters: 2 },
      { walkers: 6, chargers: 4, shooters: 3 },
      { walkers: 10, chargers: 4, shooters: 3 },
    ],
    spawnInterval: 1.0,
    title: "LEVEL 3",
    subtitle: "HOLD THE LINE",
  },
  {
    level: 4,
    waves: [
      { walkers: 10, chargers: 4, shooters: 3 },
      { walkers: 8, chargers: 5, shooters: 4 },
      { walkers: 12, chargers: 5, shooters: 5 },
    ],
    spawnInterval: 0.9,
    title: "LEVEL 4",
    subtitle: "OVERWHELMED?",
  },
  {
    level: 5,
    waves: [
      { walkers: 12, chargers: 6, shooters: 5 },
      { walkers: 10, chargers: 7, shooters: 6 },
      { walkers: 15, chargers: 8, shooters: 6 },
    ],
    spawnInterval: 0.7,
    title: "LEVEL 5",
    subtitle: "LAST STAND",
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
    for (let i = 0; i < wave.walkers; i++) q.push("walker");
    for (let i = 0; i < wave.chargers; i++) q.push("charger");
    for (let i = 0; i < wave.shooters; i++) q.push("shooter");
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
      enemies.push(new Enemy(pos.x, pos.y, type));
      this.spawnTimer = this.spawnInterval;
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
