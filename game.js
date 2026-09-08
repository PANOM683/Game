const Game = (() => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const uiCanvas = document.getElementById("uiCanvas");
  const uiCtx = uiCanvas.getContext("2d");
  const W = 800,
    H = 600;

  const TILE = 40;
  const FLOOR_COLORS = ["#1a1a2e", "#16213e", "#1a1a2e", "#12122a"];
  const DECAL_COLORS = ["#1e1e36", "#22223a"];
  const BARREL_HP = 60;
  const BARREL_RADIUS = 18;
  const BARREL_BLAST = 75;
  const AMBIANCE_COLORS = { dust: "#8a8a7a", acid: "#5fd45f", embers: "#ff8844", void: "#aa66ff" };

  const State = {
    MENU: "menu",
    CHAR_SELECT: "char_select",
    SETTINGS: "settings",
    LEVEL_BANNER: "level_banner",
    WAVE_BANNER: "wave_banner",
    BOSS_BANNER: "boss_banner",
    PLAYING: "playing",
    LEVEL_STATS: "level_stats",
    GAME_OVER: "game_over",
    WIN: "win",
  };

  let state = State.MENU;
  let player = null;
  let enemies = [];
  let bullets = [];
  let pickups = [];
  let grenades = [];
  let laserBeams = [];
  let chainBolts = [];
  let explosionFx = [];
  let pillars = [];
  let hazards = [];
  let barrels = [];
  let ambientParticles = [];
  let currentTheme = null;
  let score = 0;
  let highScore = 0;
  let currentLevelIdx = 0;
  let waveManager = null;
  let bannerTimer = 0;
  let waveBannerTimer = 0;
  let bossBannerTimer = 0;
  let levelStatsTimer = 0;
  let levelStatsIsFinal = false;
  let pendingAfterStats = null;
  let bossActive = false;
  let bossSpawned = false;
  let currentBoss = null;
  let paused = false;
  let settingsFrom = "menu";
  let selectedSkin = "soldier";
  let lastHitBy = null;
  let runStartTime = 0;
  let stats = { shotsFired: 0, shotsHit: 0, killsByType: {}, totalKills: 0, elapsed: 0 };
  let screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
  let floorTiles = [];
  let particles = [];
  let lastTime = 0;
  let gameTime = 0;

  const input = {
    keys: {},
    mouseX: W / 2,
    mouseY: H / 2,
    mouseDown: false,
    mouseJustDown: false,
  };

  function initFloor(theme) {
    const floorColors = (theme && theme.floor) || FLOOR_COLORS;
    const decalColors = (theme && theme.decal) || DECAL_COLORS;
    floorTiles = [];
    for (let row = 0; row < Math.ceil(H / TILE) + 1; row++) {
      for (let col = 0; col < Math.ceil(W / TILE) + 1; col++) {
        const r = Math.floor(Math.random() * floorColors.length);
        const hasDecal = Math.random() < 0.15;
        floorTiles.push({
          x: col * TILE,
          y: row * TILE,
          color: floorColors[r],
          decal: hasDecal,
          decalColor: decalColors[Math.floor(Math.random() * decalColors.length)],
          decalSize: 4 + Math.floor(Math.random() * 6),
        });
      }
    }
  }

  function drawFloor() {
    for (const t of floorTiles) {
      ctx.fillStyle = t.color;
      ctx.fillRect(t.x, t.y, TILE, TILE);
      ctx.strokeStyle = "#111122";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(t.x, t.y, TILE, TILE);
      if (t.decal) {
        ctx.fillStyle = t.decalColor;
        ctx.fillRect(
          t.x + TILE / 2 - t.decalSize / 2,
          t.y + TILE / 2 - t.decalSize / 2,
          t.decalSize,
          t.decalSize,
        );
      }
    }
  }

  function drawBorder() {
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 10;
    ctx.strokeRect(2, 2, W - 4, H - 4);
    ctx.shadowBlur = 0;
  }

  function addParticle(x, y, color, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 80;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.4 + Math.random() * 0.3,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.9;
      p.vy *= 0.9;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function drawParticles() {
    for (const p of particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  function spawnAmbientParticle(type, randomY) {
    const color = AMBIANCE_COLORS[type] || "#ffffff";
    return {
      x: Math.random() * W,
      y: randomY ? Math.random() * H : type === "embers" ? H + 10 : -10,
      vx: (Math.random() - 0.5) * 8,
      vy: type === "embers" ? -(10 + Math.random() * 14) : 10 + Math.random() * 14,
      size: 1 + Math.random() * 2.5,
      color,
      alpha: 0.15 + Math.random() * 0.35,
    };
  }

  function initAmbiance(theme) {
    ambientParticles = [];
    const ambiance = theme && theme.ambiance;
    if (!ambiance || ambiance === "none") return;
    for (let i = 0; i < 26; i++) ambientParticles.push(spawnAmbientParticle(ambiance, true));
  }

  function updateAmbiance(dt) {
    const ambiance = currentTheme && currentTheme.ambiance;
    if (!ambiance || ambiance === "none") return;
    for (const p of ambientParticles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y > H + 15 || p.y < -15 || p.x < -15 || p.x > W + 15) {
        Object.assign(p, spawnAmbientParticle(ambiance, false));
      }
    }
  }

  function drawAmbiance() {
    for (const p of ambientParticles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function spawnExplosionFx(x, y, maxRadius) {
    explosionFx.push({ x, y, frame: 0, timer: 0, maxRadius });
  }

  function updateExplosionFx(dt) {
    for (let i = explosionFx.length - 1; i >= 0; i--) {
      const f = explosionFx[i];
      f.timer += dt;
      if (f.timer > 0.05) {
        f.timer = 0;
        f.frame++;
      }
      if (f.frame >= 6) explosionFx.splice(i, 1);
    }
  }

  function drawExplosionFx() {
    for (const f of explosionFx) {
      SPRITES.drawBigExplosion(ctx, f.x, f.y, f.frame, f.maxRadius);
    }
  }

  function doScreenShake(intensity, duration) {
    screenShake.intensity = intensity;
    screenShake.duration = duration;
  }

  function describeSource(type) {
    const names = {
      walker: "a Walker",
      charger: "a Charger",
      shooter: "a Shooter",
      splitter: "a Splitter",
      medic: "a Medic",
      assassin: "an Assassin",
      boss: "the Boss",
      hazard: "a Hazard Zone",
      barrel: "an Explosive Barrel",
    };
    return names[type] || "the enemy";
  }

  function bossNameForTier(tier) {
    return tier === 2 ? "VOIDBRINGER" : "THE GATEKEEPER";
  }

  function handleEnemyDeath(e) {
    score += e.score;
    stats.totalKills++;
    stats.killsByType[e.type] = (stats.killsByType[e.type] || 0) + 1;
    AudioEngine.playEnemyDeath();
    if (e.type === "splitter") {
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const nx = Math.max(11, Math.min(W - 11, e.x + Math.cos(ang) * 20));
        const ny = Math.max(11, Math.min(H - 11, e.y + Math.sin(ang) * 20));
        const child = new Enemy(nx, ny, "walker");
        child.hp = 12;
        child.maxHp = 12;
        child.speed *= 1.5;
        child.radius = 11;
        child.score = 4;
        enemies.push(child);
      }
    }
    rollDrop(e.x, e.y);
  }

  function rollDrop(x, y) {
    const r = Math.random();
    if (r < 0.14) pickups.push(new Pickup(x, y, "health"));
    else if (r < 0.18) pickups.push(new Pickup(x, y, "triple"));
    else if (r < 0.22) pickups.push(new Pickup(x, y, "rapid"));
    else if (r < 0.26) pickups.push(new Pickup(x, y, "chain"));
    else if (r < 0.3) pickups.push(new Pickup(x, y, "laser"));
    else if (r < 0.33) pickups.push(new Pickup(x, y, "grenade"));
    else if (r < 0.36) pickups.push(new Pickup(x, y, "shield"));
    else if (r < 0.375) pickups.push(new Pickup(x, y, "bomb"));
  }

  function performChainLightning(sourceEnemy, initialDamage) {
    const maxJumps = 3;
    const jumpRadius = 140;
    let currentSource = sourceEnemy;
    let currentDamage = initialDamage;
    const hitSet = new Set([sourceEnemy]);

    for (let jump = 0; jump < maxJumps; jump++) {
      currentDamage *= 0.65;
      let target = null;
      let bestDist = Infinity;
      for (const e of enemies) {
        if (e.dead || e.visible === false || hitSet.has(e)) continue;
        const d = Math.hypot(e.x - currentSource.x, e.y - currentSource.y);
        if (d < jumpRadius && d < bestDist) {
          bestDist = d;
          target = e;
        }
      }
      if (!target) break;
      hitSet.add(target);
      chainBolts.push({
        x1: currentSource.x,
        y1: currentSource.y,
        x2: target.x,
        y2: target.y,
        life: 0.18,
      });
      let dmg = currentDamage;
      if (target.shielded) dmg *= 0.5;
      const killed = target.takeDamage(dmg);
      addParticle(target.x, target.y, target.color, 4);
      if (killed) handleEnemyDeath(target);
      currentSource = target;
    }
  }

  function applyPickup(p, pl) {
    AudioEngine.playPickup();
    switch (p.type) {
      case "health":
        pl.heal(p.healAmount);
        addParticle(pl.x, pl.y, "#00ff88", 6);
        break;
      case "triple":
        pl.applyWeaponMode("triple", 10);
        addParticle(pl.x, pl.y, "#ffee44", 6);
        break;
      case "rapid":
        pl.applyWeaponMode("rapid", 10);
        addParticle(pl.x, pl.y, "#ff9944", 6);
        break;
      case "chain":
        pl.applyWeaponMode("chain", 10);
        addParticle(pl.x, pl.y, "#ffe066", 6);
        break;
      case "laser":
        pl.laserAmmo += 3;
        addParticle(pl.x, pl.y, "#00eaff", 6);
        break;
      case "grenade":
        pl.grenadeAmmo += 2;
        addParticle(pl.x, pl.y, "#88cc44", 6);
        break;
      case "shield":
        pl.addShield(50);
        addParticle(pl.x, pl.y, "#44ccff", 6);
        break;
      case "bomb":
        triggerBomb();
        break;
    }
  }

  function triggerBomb() {
    doScreenShake(12, 0.35);
    addParticle(player.x, player.y, "#ff4444", 10);
    AudioEngine.playExplosion();
    for (const e of enemies) {
      if (!e.dead) {
        const killed = e.takeDamage(999);
        addParticle(e.x, e.y, e.color, 6);
        if (killed) {
          score += e.score;
          stats.totalKills++;
          stats.killsByType[e.type] = (stats.killsByType[e.type] || 0) + 1;
        }
      }
    }
  }

  function explodeBarrel(bar) {
    if (bar.dead) return;
    bar.dead = true;
    doScreenShake(8, 0.25);
    spawnExplosionFx(bar.x, bar.y, BARREL_BLAST);
    addParticle(bar.x, bar.y, "#ff8800", 12);
    AudioEngine.playExplosion();

    for (const e of enemies) {
      if (!e.dead && e.visible !== false) {
        const d = Math.hypot(e.x - bar.x, e.y - bar.y);
        if (d < BARREL_BLAST + e.radius) {
          let dmg = 50;
          if (e.shielded) dmg *= 0.5;
          const killed = e.takeDamage(dmg);
          if (killed) handleEnemyDeath(e);
        }
      }
    }

    const pd = Math.hypot(player.x - bar.x, player.y - bar.y);
    if (pd < BARREL_BLAST + player.radius) {
      if (player.takeDamage(30)) {
        addParticle(player.x, player.y, "#ff4444", 8);
        AudioEngine.playPlayerHurt();
        lastHitBy = describeSource("barrel");
      }
    }

    for (const other of barrels) {
      if (other !== bar && !other.dead) {
        const d = Math.hypot(other.x - bar.x, other.y - bar.y);
        if (d < BARREL_BLAST) explodeBarrel(other);
      }
    }
  }

  function tryFireLaser() {
    if (state !== State.PLAYING || paused || !player) return;
    const laser = player.tryLaser(enemies);
    if (!laser) return;
    stats.shotsFired++;
    if (laser.hits.length > 0) stats.shotsHit++;
    laserBeams.push(laser);
    doScreenShake(4, 0.1);
    AudioEngine.playLaser();
    for (const e of laser.hits) {
      let dmg = 45;
      if (e.shielded) dmg *= 0.5;
      const killed = e.takeDamage(dmg);
      addParticle(e.x, e.y, e.color, 4);
      if (killed) handleEnemyDeath(e);
    }
  }

  function tryThrowGrenade() {
    if (state !== State.PLAYING || paused || !player) return;
    const g = player.tryGrenade();
    if (g) {
      grenades.push(g);
      AudioEngine.playGrenadeThrow();
    }
  }

  function togglePause() {
    if (state !== State.PLAYING) return;
    paused = !paused;
    if (paused) AudioEngine.stopMusic();
    else AudioEngine.startMusic();
  }

  function startGame() {
    currentLevelIdx = 0;
    score = 0;
    gameTime = 0;
    stats = { shotsFired: 0, shotsHit: 0, killsByType: {}, totalKills: 0, elapsed: 0 };
    runStartTime = performance.now();
    lastHitBy = null;
    player = new Player(W / 2, H / 2, selectedSkin);
    enemies = [];
    bullets = [];
    particles = [];
    paused = false;
    AudioEngine.startMusic();
    beginLevel();
  }

  function beginLevel() {
    const levelData = LEVELS[currentLevelIdx];
    waveManager = new WaveManager(levelData);
    enemies = [];
    bullets = [];
    pickups = [];
    grenades = [];
    laserBeams = [];
    chainBolts = [];
    explosionFx = [];
    bossActive = false;
    bossSpawned = false;
    currentBoss = null;

    const layout = levelData.layout || {};
    pillars = layout.pillars || [];
    hazards = layout.hazards || [];
    barrels = (layout.barrels || []).map((b) => ({
      x: b.x,
      y: b.y,
      hp: BARREL_HP,
      maxHp: BARREL_HP,
      radius: BARREL_RADIUS,
      dead: false,
    }));

    currentTheme = levelData.theme || null;
    initFloor(currentTheme);
    initAmbiance(currentTheme);

    state = State.LEVEL_BANNER;
    bannerTimer = 2.5;
  }

  function beginWave() {
    state = State.WAVE_BANNER;
    waveBannerTimer = 1.5;
  }

  function startPlaying() {
    state = State.PLAYING;
    if (waveManager.currentWave === 0) {
      waveManager.spawnTimer = 0;
    }
  }

  function spawnBoss(levelData) {
    const boss = new Boss(W / 2, -80, levelData.bossTier || 1);
    boss.hp = Math.round(boss.hp * GameSettings.hpMult());
    boss.maxHp = boss.hp;
    boss.damage = Math.round(boss.damage * GameSettings.dmgMult());
    boss.rangedDamage = Math.round(boss.rangedDamage * GameSettings.dmgMult());
    currentBoss = boss;
    bossActive = true;
    bossSpawned = true;
    enemies.push(boss);
    doScreenShake(10, 0.4);
    AudioEngine.playBossRoar();
  }

  function finishLevelClear() {
    currentLevelIdx++;
    if (currentLevelIdx >= LEVELS.length) {
      levelStatsIsFinal = true;
      pendingAfterStats = () => {
        state = State.WIN;
        if (score > highScore) {
          highScore = score;
          GameSettings.setHighScore(highScore);
        }
        AudioEngine.stopMusic();
      };
    } else {
      levelStatsIsFinal = false;
      pendingAfterStats = () => {
        player.hp = Math.min(player.maxHp, player.hp + 30);
        beginLevel();
      };
    }
    AudioEngine.playLevelUp();
    state = State.LEVEL_STATS;
    levelStatsTimer = 4;
  }

  function advanceFromLevelStats() {
    if (!pendingAfterStats) return;
    const fn = pendingAfterStats;
    pendingAfterStats = null;
    fn();
  }

  function update(dt) {
    if (state === State.MENU || state === State.CHAR_SELECT || state === State.SETTINGS) {
      return;
    }

    if (state === State.LEVEL_BANNER) {
      bannerTimer -= dt;
      if (bannerTimer <= 0) beginWave();
      return;
    }

    if (state === State.WAVE_BANNER) {
      waveBannerTimer -= dt;
      if (waveBannerTimer <= 0) startPlaying();
      return;
    }

    if (state === State.BOSS_BANNER) {
      bossBannerTimer -= dt;
      if (bossBannerTimer <= 0) {
        spawnBoss(LEVELS[currentLevelIdx]);
        state = State.PLAYING;
      }
      return;
    }

    if (state === State.LEVEL_STATS) {
      levelStatsTimer -= dt;
      if (levelStatsTimer <= 0) advanceFromLevelStats();
      return;
    }

    if (state !== State.PLAYING) return;
    if (paused) return;

    stats.elapsed = (performance.now() - runStartTime) / 1000;
    gameTime += dt;

    if (screenShake.duration > 0) {
      screenShake.duration -= dt;
      screenShake.x = (Math.random() - 0.5) * screenShake.intensity * 2;
      screenShake.y = (Math.random() - 0.5) * screenShake.intensity * 2;
    } else {
      screenShake.x = 0;
      screenShake.y = 0;
    }

    player.update(dt, input, { w: W, h: H }, pillars);
    updateAmbiance(dt);

    for (const hz of hazards) {
      const d = Math.hypot(player.x - hz.x, player.y - hz.y);
      if (d < hz.radius + player.radius * 0.5) {
        player.hp = Math.max(0, player.hp - 14 * dt);
        lastHitBy = describeSource("hazard");
        if (Math.random() < 0.3) addParticle(player.x, player.y, "#ff5500", 2);
      }
    }

    if (input.mouseDown) {
      const shots = player.tryShoot();
      if (shots.length > 0) {
        AudioEngine.playShoot();
        for (const b of shots) {
          bullets.push(b);
          addParticle(b.x, b.y, "#ffee44", 3);
          stats.shotsFired++;
        }
      }
    }

    waveManager.update(dt, enemies);

    for (const e of enemies) e.shielded = false;
    for (const m of enemies) {
      if (m.type === "medic" && !m.dead) {
        for (const e of enemies) {
          if (e !== m && !e.dead) {
            const d = Math.hypot(e.x - m.x, e.y - m.y);
            if (d < m.auraRadius) {
              e.shielded = true;
              e.hp = Math.min(e.maxHp, e.hp + m.healRate * dt);
            }
          }
        }
      }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].update(dt);
      if (bullets[i].dead) {
        bullets.splice(i, 1);
        continue;
      }

      if (!bullets[i].isEnemy) {
        let hitEnemy = false;
        for (const e of enemies) {
          if (e.dead || e.visible === false) continue;
          if (circleCollide(bullets[i], { x: e.x, y: e.y, radius: e.radius })) {
            let dmg = bullets[i].damage;
            if (e.shielded) dmg *= 0.5;
            const killed = e.takeDamage(dmg);
            bullets[i].dead = true;
            stats.shotsHit++;
            addParticle(e.x, e.y, e.color, 5);
            doScreenShake(3, 0.08);
            AudioEngine.playHit();
            if (killed) handleEnemyDeath(e);
            if (bullets[i].isChain) {
              performChainLightning(e, dmg);
              AudioEngine.playLaser();
            }
            hitEnemy = true;
            break;
          }
        }
        if (!hitEnemy) {
          for (const bar of barrels) {
            if (!bar.dead && circleCollide(bullets[i], bar)) {
              bar.hp -= bullets[i].damage;
              bullets[i].dead = true;
              addParticle(bar.x, bar.y, "#ff8800", 4);
              if (bar.hp <= 0) explodeBarrel(bar);
              break;
            }
          }
        }
      } else {
        if (
          !player.dead &&
          circleCollide(bullets[i], {
            x: player.x,
            y: player.y,
            radius: player.radius,
          })
        ) {
          if (player.takeDamage(bullets[i].damage)) {
            doScreenShake(5, 0.15);
            addParticle(player.x, player.y, "#ff4444", 8);
            AudioEngine.playPlayerHurt();
            lastHitBy = describeSource(bullets[i].sourceType);
          }
          bullets[i].dead = true;
        }
      }
    }

    for (let i = grenades.length - 1; i >= 0; i--) {
      grenades[i].update(dt, { w: W, h: H });
      if (grenades[i].dead) {
        const g = grenades[i];
        spawnExplosionFx(g.x, g.y, g.explosionRadius);
        doScreenShake(7, 0.2);
        AudioEngine.playExplosion();
        for (const e of enemies) {
          if (!e.dead && e.visible !== false) {
            const d = Math.hypot(e.x - g.x, e.y - g.y);
            if (d < g.explosionRadius + e.radius) {
              let dmg = g.damage;
              if (e.shielded) dmg *= 0.5;
              const killed = e.takeDamage(dmg);
              addParticle(e.x, e.y, e.color, 4);
              if (killed) handleEnemyDeath(e);
            }
          }
        }
        grenades.splice(i, 1);
      }
    }

    for (let i = laserBeams.length - 1; i >= 0; i--) {
      laserBeams[i].life -= dt;
      if (laserBeams[i].life <= 0) laserBeams.splice(i, 1);
    }

    for (let i = chainBolts.length - 1; i >= 0; i--) {
      chainBolts[i].life -= dt;
      if (chainBolts[i].life <= 0) chainBolts.splice(i, 1);
    }

    for (const e of enemies) {
      e.update(dt, player, bullets, pillars, enemies);
      if (
        !e.dead &&
        e.visible !== false &&
        circleCollide(e, { x: player.x, y: player.y, radius: player.radius })
      ) {
        if (player.takeDamage(e.damage)) {
          doScreenShake(6, 0.2);
          addParticle(player.x, player.y, "#ff4444", 10);
          AudioEngine.playPlayerHurt();
          lastHitBy = describeSource(e.type);
          const knockAngle = Math.atan2(player.y - e.y, player.x - e.x);
          player.x += Math.cos(knockAngle) * 20;
          player.y += Math.sin(knockAngle) * 20;
        }
      }
    }

    for (let i = pickups.length - 1; i >= 0; i--) {
      pickups[i].update(dt);
      if (
        circleCollide(pickups[i], {
          x: player.x,
          y: player.y,
          radius: player.radius,
        })
      ) {
        applyPickup(pickups[i], player);
        pickups.splice(i, 1);
      }
    }

    enemies = enemies.filter((e) => !e.isExplosionDone());

    updateParticles(dt);
    updateExplosionFx(dt);

    if (player.hp <= 0) {
      state = State.GAME_OVER;
      AudioEngine.playGameOver();
      AudioEngine.stopMusic();
      if (score > highScore) {
        highScore = score;
        GameSettings.setHighScore(highScore);
      }
      return;
    }

    if (bossActive) {
      if (currentBoss && currentBoss.dead && currentBoss.isExplosionDone()) {
        bossActive = false;
        finishLevelClear();
      }
    } else if (waveManager.isWaveClear(enemies)) {
      const hasNext = waveManager.nextWave();
      if (!hasNext) {
        const levelData = LEVELS[currentLevelIdx];
        if (levelData.boss && !bossSpawned) {
          state = State.BOSS_BANNER;
          bossBannerTimer = 2.4;
          screenShake.x = 0;
          screenShake.y = 0;
          screenShake.duration = 0;
        } else {
          finishLevelClear();
        }
      } else {
        beginWave();
      }
    }

    input.mouseJustDown = false;
  }

  function drawGame() {
    ctx.save();
    ctx.translate(screenShake.x, screenShake.y);

    drawFloor();
    for (const hz of hazards) SPRITES.drawHazard(ctx, hz.x, hz.y, hz.radius, gameTime);
    drawBorder();
    for (const p of pillars) SPRITES.drawPillar(ctx, p.x, p.y, p.w, p.h);
    for (const bar of barrels) {
      if (!bar.dead) SPRITES.drawBarrel(ctx, bar.x, bar.y, bar.hp / bar.maxHp);
    }
    drawAmbiance();

    for (const pk of pickups) pk.draw(ctx);
    for (const e of enemies) e.draw(ctx);
    for (const b of bullets) b.draw(ctx);
    for (const g of grenades) g.draw(ctx);
    for (const l of laserBeams) {
      SPRITES.drawLaser(ctx, l.x1, l.y1, l.x2, l.y2, l.life / 0.15);
    }
    for (const c of chainBolts) {
      SPRITES.drawChainBolt(ctx, c.x1, c.y1, c.x2, c.y2, c.life / 0.18);
    }
    drawExplosionFx();
    drawParticles();
    if (player) player.draw(ctx);

    UI.drawScanlines(ctx, W, H);
    ctx.restore();
  }

  function hoveredCharCard() {
    if (UI.pointInRect(input.mouseX, input.mouseY, UI.CHAR_SELECT_CARDS.soldier)) return "soldier";
    if (UI.pointInRect(input.mouseX, input.mouseY, UI.CHAR_SELECT_CARDS.chibi)) return "chibi";
    return null;
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    if (state === State.MENU) {
      UI.drawMenu(ctx, highScore);
      uiCtx.clearRect(0, 0, W, H);
      return;
    }

    if (state === State.CHAR_SELECT) {
      UI.drawCharSelect(ctx, hoveredCharCard());
      uiCtx.clearRect(0, 0, W, H);
      return;
    }

    if (state === State.SETTINGS) {
      UI.drawSettings(ctx, { volume: GameSettings.volume, difficulty: GameSettings.difficulty });
      uiCtx.clearRect(0, 0, W, H);
      return;
    }

    if (state === State.GAME_OVER || state === State.WIN) {
      drawGame();
      UI.drawGameOver(uiCtx, score, highScore, state === State.WIN, lastHitBy, stats);
      return;
    }

    if (state === State.LEVEL_STATS) {
      drawGame();
      UI.drawLevelStats(uiCtx, stats, levelStatsIsFinal);
      return;
    }

    drawGame();

    uiCtx.clearRect(0, 0, W, H);
    if (player) {
      UI.drawHUD(
        uiCtx,
        player,
        score,
        LEVELS[Math.min(currentLevelIdx, LEVELS.length - 1)].level,
        waveManager ? waveManager.getWaveInfo() : { current: 1, total: 1 },
        W,
        H,
      );
      UI.drawRadar(uiCtx, player, enemies, W, H, W, H);
      if (bossActive && currentBoss) UI.drawBossBar(uiCtx, currentBoss, W);
    }

    if (state === State.LEVEL_BANNER) {
      const alpha =
        bannerTimer > 2.0
          ? (2.5 - bannerTimer) / 0.5
          : bannerTimer < 0.5
            ? bannerTimer / 0.5
            : 1;
      UI.drawLevelBanner(
        uiCtx,
        LEVELS[Math.min(currentLevelIdx, LEVELS.length - 1)],
        alpha,
      );
    }

    if (state === State.WAVE_BANNER) {
      const alpha =
        waveBannerTimer > 1.0
          ? (1.5 - waveBannerTimer) / 0.5
          : waveBannerTimer < 0.5
            ? waveBannerTimer / 0.5
            : 1;
      UI.drawWaveBanner(
        uiCtx,
        waveManager ? waveManager.currentWave + 1 : 1,
        alpha,
      );
    }

    if (state === State.BOSS_BANNER) {
      const alpha =
        bossBannerTimer > 1.9
          ? (2.4 - bossBannerTimer) / 0.5
          : bossBannerTimer < 0.5
            ? bossBannerTimer / 0.5
            : 1;
      UI.drawBossBanner(
        uiCtx,
        bossNameForTier((LEVELS[currentLevelIdx] || {}).bossTier || 1),
        alpha,
      );
    }

    if (paused) UI.drawPause(uiCtx);
  }

  function loop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  function handleSettingsClick(mx, my) {
    const B = UI.SETTINGS_BUTTONS;
    for (let i = 0; i < B.volumePips.length; i++) {
      if (UI.pointInRect(mx, my, B.volumePips[i])) {
        GameSettings.setVolume((i + 1) / 5);
        AudioEngine.playUiClick();
        return;
      }
    }
    if (UI.pointInRect(mx, my, B.normal)) {
      GameSettings.setDifficulty("normal");
      AudioEngine.playUiClick();
      return;
    }
    if (UI.pointInRect(mx, my, B.hard)) {
      GameSettings.setDifficulty("hard");
      AudioEngine.playUiClick();
      return;
    }
    if (UI.pointInRect(mx, my, B.back)) {
      AudioEngine.playUiClick();
      if (settingsFrom === "pause") {
        state = State.PLAYING;
        paused = true;
      } else {
        state = State.MENU;
      }
    }
  }

  function handlePauseClick(mx, my) {
    const B = UI.PAUSE_BUTTONS;
    if (UI.pointInRect(mx, my, B.resume)) {
      AudioEngine.playUiClick();
      togglePause();
      return;
    }
    if (UI.pointInRect(mx, my, B.settings)) {
      AudioEngine.playUiClick();
      settingsFrom = "pause";
      state = State.SETTINGS;
      return;
    }
    if (UI.pointInRect(mx, my, B.quit)) {
      AudioEngine.playUiClick();
      paused = false;
      state = State.MENU;
      AudioEngine.stopMusic();
      uiCtx.clearRect(0, 0, W, H);
    }
  }

  function handleClick() {
    const mx = input.mouseX,
      my = input.mouseY;

    if (state === State.MENU) {
      if (UI.pointInRect(mx, my, UI.MENU_BUTTONS.settings)) {
        settingsFrom = "menu";
        state = State.SETTINGS;
        AudioEngine.playUiClick();
        return;
      }
      AudioEngine.playUiClick();
      state = State.CHAR_SELECT;
      return;
    }

    if (state === State.CHAR_SELECT) {
      const hover = hoveredCharCard();
      if (hover) {
        selectedSkin = hover;
        AudioEngine.playUiClick();
        startGame();
      }
      return;
    }

    if (state === State.SETTINGS) {
      handleSettingsClick(mx, my);
      return;
    }

    if (state === State.LEVEL_STATS) {
      advanceFromLevelStats();
      return;
    }

    if (state === State.LEVEL_BANNER) {
      bannerTimer = 0;
      return;
    }

    if (state === State.WAVE_BANNER) {
      waveBannerTimer = 0;
      return;
    }

    if (state === State.BOSS_BANNER) {
      bossBannerTimer = 0;
      return;
    }

    if (state === State.PLAYING) {
      if (paused) handlePauseClick(mx, my);
      return;
    }

    if (state === State.GAME_OVER || state === State.WIN) {
      state = State.MENU;
      uiCtx.clearRect(0, 0, W, H);
    }
  }

  function setupInput() {
    window.addEventListener("keydown", (e) => {
      const wasDown = input.keys[e.key];
      input.keys[e.key] = true;
      if (!wasDown && (e.key === "q" || e.key === "Q")) {
        tryThrowGrenade();
      }
      if (!wasDown && e.key === "Escape" && state === State.PLAYING) {
        togglePause();
      }
      e.preventDefault();
    });
    window.addEventListener("keyup", (e) => {
      input.keys[e.key] = false;
    });

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      input.mouseX = (e.clientX - rect.left) * scaleX;
      input.mouseY = (e.clientY - rect.top) * scaleY;
    });

    canvas.addEventListener("mousedown", (e) => {
      AudioEngine.resume();
      if (e.button === 0) {
        input.mouseDown = true;
        input.mouseJustDown = true;
        handleClick();
      } else if (e.button === 2) {
        tryFireLaser();
      }
    });

    canvas.addEventListener("mouseup", (e) => {
      if (e.button === 0) input.mouseDown = false;
    });

    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  function init() {
    setupInput();
    highScore = GameSettings.getHighScore();
    AudioEngine.setVolume(GameSettings.volume);
    initFloor(LEVELS[0].theme);
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  return { init };
})();

Game.init();
