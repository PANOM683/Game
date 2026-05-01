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

  const State = {
    MENU: "menu",
    LEVEL_BANNER: "level_banner",
    WAVE_BANNER: "wave_banner",
    PLAYING: "playing",
    GAME_OVER: "game_over",
    WIN: "win",
  };

  let state = State.MENU;
  let player = null;
  let enemies = [];
  let bullets = [];
  let healthOrbs = [];
  let score = 0;
  let highScore = 0;
  let currentLevelIdx = 0;
  let waveManager = null;
  let bannerTimer = 0;
  let waveBannerTimer = 0;
  let screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };
  let floorTiles = [];
  let particles = [];
  let lastTime = 0;

  const input = {
    keys: {},
    mouseX: W / 2,
    mouseY: H / 2,
    mouseDown: false,
    mouseJustDown: false,
  };

  function initFloor() {
    floorTiles = [];
    for (let row = 0; row < Math.ceil(H / TILE) + 1; row++) {
      for (let col = 0; col < Math.ceil(W / TILE) + 1; col++) {
        const r = Math.floor(Math.random() * FLOOR_COLORS.length);
        const hasDecal = Math.random() < 0.15;
        floorTiles.push({
          x: col * TILE,
          y: row * TILE,
          color: FLOOR_COLORS[r],
          decal: hasDecal,
          decalColor:
            DECAL_COLORS[Math.floor(Math.random() * DECAL_COLORS.length)],
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

  function doScreenShake(intensity, duration) {
    screenShake.intensity = intensity;
    screenShake.duration = duration;
  }

  function startGame() {
    currentLevelIdx = 0;
    score = 0;
    player = new Player(W / 2, H / 2);
    enemies = [];
    bullets = [];
    healthOrbs = [];
    particles = [];
    initFloor();
    beginLevel();
  }

  function beginLevel() {
    waveManager = new WaveManager(LEVELS[currentLevelIdx]);
    enemies = [];
    bullets = [];
    healthOrbs = [];
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

  function update(dt) {
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

    if (state !== State.PLAYING) return;

    if (screenShake.duration > 0) {
      screenShake.duration -= dt;
      screenShake.x = (Math.random() - 0.5) * screenShake.intensity * 2;
      screenShake.y = (Math.random() - 0.5) * screenShake.intensity * 2;
    } else {
      screenShake.x = 0;
      screenShake.y = 0;
    }

    player.update(dt, input, { w: W, h: H });

    if (input.mouseDown) {
      const b = player.tryShoot();
      if (b) {
        bullets.push(b);
        addParticle(b.x, b.y, "#ffee44", 3);
      }
    }

    waveManager.update(dt, enemies);

    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].update(dt);
      if (bullets[i].dead) {
        bullets.splice(i, 1);
        continue;
      }

      if (!bullets[i].isEnemy) {
        for (const e of enemies) {
          if (
            !e.dead &&
            circleCollide(bullets[i], { x: e.x, y: e.y, radius: e.radius })
          ) {
            const killed = e.takeDamage(bullets[i].damage);
            bullets[i].dead = true;
            addParticle(e.x, e.y, e.color, 5);
            doScreenShake(3, 0.08);
            if (killed) {
              score += e.score;
              if (Math.random() < 0.2) healthOrbs.push(new HealthOrb(e.x, e.y));
            }
            break;
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
          }
          bullets[i].dead = true;
        }
      }
    }

    for (const e of enemies) {
      e.update(dt, player, bullets);
      if (
        !e.dead &&
        circleCollide(e, { x: player.x, y: player.y, radius: player.radius })
      ) {
        if (player.takeDamage(e.damage)) {
          doScreenShake(6, 0.2);
          addParticle(player.x, player.y, "#ff4444", 10);
          const knockAngle = Math.atan2(player.y - e.y, player.x - e.x);
          player.x += Math.cos(knockAngle) * 20;
          player.y += Math.sin(knockAngle) * 20;
        }
      }
    }

    for (let i = healthOrbs.length - 1; i >= 0; i--) {
      healthOrbs[i].update(dt);
      if (
        circleCollide(healthOrbs[i], {
          x: player.x,
          y: player.y,
          radius: player.radius,
        })
      ) {
        player.heal(healthOrbs[i].healAmount);
        healthOrbs.splice(i, 1);
        addParticle(player.x, player.y, "#00ff88", 6);
      }
    }

    enemies = enemies.filter((e) => !e.isExplosionDone());

    updateParticles(dt);

    if (player.hp <= 0) {
      state = State.GAME_OVER;
      if (score > highScore) highScore = score;
      return;
    }

    if (waveManager.isWaveClear(enemies)) {
      const hasNext = waveManager.nextWave();
      if (!hasNext) {
        currentLevelIdx++;
        if (currentLevelIdx >= LEVELS.length) {
          state = State.WIN;
          if (score > highScore) highScore = score;
        } else {
          player.hp = Math.min(player.maxHp, player.hp + 30);
          beginLevel();
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
    drawBorder();

    for (const orb of healthOrbs) orb.draw(ctx);
    for (const e of enemies) e.draw(ctx);
    for (const b of bullets) b.draw(ctx);
    drawParticles();
    player.draw(ctx);

    UI.drawScanlines(ctx, W, H);
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    if (state === State.MENU) {
      UI.drawMenu(ctx, highScore);
      uiCtx.clearRect(0, 0, W, H);
      return;
    }

    if (state === State.GAME_OVER || state === State.WIN) {
      drawGame();
      UI.drawGameOver(uiCtx, score, highScore, state === State.WIN);
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
  }

  function loop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  function setupInput() {
    window.addEventListener("keydown", (e) => {
      input.keys[e.key] = true;
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
      if (e.button === 0) {
        input.mouseDown = true;
        input.mouseJustDown = true;
        handleClick();
      }
    });

    canvas.addEventListener("mouseup", (e) => {
      if (e.button === 0) input.mouseDown = false;
    });

    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  function handleClick() {
    if (state === State.MENU) {
      startGame();
    } else if (state === State.GAME_OVER || state === State.WIN) {
      state = State.MENU;
      uiCtx.clearRect(0, 0, W, H);
    }
  }

  function init() {
    setupInput();
    initFloor();
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  return { init };
})();

Game.init();
