const SPRITES = (() => {
  const S = 4;

  function px(ctx, data, ox, oy, palette) {
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[row].length; col++) {
        const c = data[row][col];
        if (c === 0) continue;
        ctx.fillStyle = palette[c];
        ctx.fillRect(ox + col * S, oy + row * S, S, S);
      }
    }
  }

  const PLAYER_PALETTE = {
    1: "#e8d5b0",
    2: "#c8b89a",
    3: "#3a3a5c",
    4: "#2a2a4a",
    5: "#5c8a3c",
    6: "#4a7030",
    7: "#d4a843",
    8: "#b08030",
    9: "#f0f0f0",
    10: "#cccccc",
    11: "#e05050",
    12: "#303030",
  };

  const PLAYER_BODY_IDLE = [
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 2, 1, 1, 2, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 3, 3, 3, 3, 0, 0, 0],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [0, 3, 4, 3, 3, 3, 3, 4, 3, 0],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [0, 0, 3, 3, 3, 3, 3, 3, 0, 0],
    [0, 0, 5, 5, 0, 0, 5, 5, 0, 0],
    [0, 0, 5, 5, 0, 0, 5, 5, 0, 0],
    [0, 0, 6, 6, 0, 0, 6, 6, 0, 0],
    [0, 0, 6, 6, 0, 0, 6, 6, 0, 0],
  ];

  const PLAYER_WALK1 = [
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 2, 1, 1, 2, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 3, 3, 3, 3, 0, 0, 0],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [0, 3, 4, 3, 3, 3, 3, 4, 3, 0],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [0, 0, 3, 3, 3, 3, 3, 3, 0, 0],
    [0, 5, 5, 0, 0, 0, 0, 5, 5, 0],
    [0, 5, 5, 0, 0, 0, 5, 5, 0, 0],
    [0, 6, 6, 0, 0, 0, 6, 6, 0, 0],
    [0, 0, 6, 0, 0, 0, 6, 0, 0, 0],
  ];

  const PLAYER_WALK2 = [
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 2, 1, 1, 2, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 3, 3, 3, 3, 0, 0, 0],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [0, 3, 4, 3, 3, 3, 3, 4, 3, 0],
    [0, 3, 3, 3, 3, 3, 3, 3, 3, 0],
    [0, 0, 3, 3, 3, 3, 3, 3, 0, 0],
    [0, 5, 5, 0, 0, 0, 5, 5, 0, 0],
    [0, 0, 5, 5, 0, 5, 5, 0, 0, 0],
    [0, 0, 6, 6, 0, 6, 6, 0, 0, 0],
    [0, 0, 0, 6, 0, 6, 0, 0, 0, 0],
  ];

  const CHIBI_PALETTE = {
    1: "#2a2a2a",
    2: "#ffd9b3",
    3: "#1a1a1a",
    4: "#ff6b35",
    5: "#2255cc",
    6: "#ffffff",
    7: "#663300",
  };

  const CHIBI_BODY_IDLE = [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 3, 2, 2, 3, 2, 1, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
    [0, 0, 4, 4, 6, 6, 4, 4, 0, 0],
    [0, 0, 4, 4, 4, 4, 4, 4, 0, 0],
    [0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
    [0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
    [0, 0, 7, 7, 0, 0, 7, 7, 0, 0],
  ];

  const CHIBI_WALK1 = [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 3, 2, 2, 3, 2, 1, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
    [0, 0, 4, 4, 6, 6, 4, 4, 0, 0],
    [0, 0, 4, 4, 4, 4, 4, 4, 0, 0],
    [0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
    [0, 7, 7, 0, 0, 0, 0, 7, 7, 0],
    [0, 7, 0, 0, 0, 0, 0, 0, 7, 0],
  ];

  const CHIBI_WALK2 = [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 3, 2, 2, 3, 2, 1, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 0, 4, 4, 4, 4, 0, 0, 0],
    [0, 0, 4, 4, 6, 6, 4, 4, 0, 0],
    [0, 0, 4, 4, 4, 4, 4, 4, 0, 0],
    [0, 0, 0, 5, 5, 5, 5, 0, 0, 0],
    [0, 0, 0, 7, 0, 0, 7, 0, 0, 0],
    [0, 0, 0, 0, 7, 7, 0, 0, 0, 0],
  ];

  const BOSS_BODY = [
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 0, 0],
    [0, 1, 1, 2, 2, 1, 4, 4, 1, 2, 2, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1],
    [1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0],
    [0, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 6, 6, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0],
    [0, 0, 6, 6, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0],
  ];

  const BOSS_PALETTE_1 = {
    1: "#9b30ff",
    2: "#6a1fb0",
    3: "#2a0a4a",
    4: "#ff2266",
    5: "#c080ff",
    6: "#1a0530",
  };

  const BOSS_PALETTE_2 = {
    1: "#3a1a5c",
    2: "#220f3d",
    3: "#000000",
    4: "#00eaff",
    5: "#6a3a9c",
    6: "#0a0515",
  };

  const GUN = [
    [0, 0, 0, 0, 8, 8, 8, 8, 8, 8],
    [7, 7, 7, 7, 7, 7, 8, 8, 8, 8],
    [7, 7, 7, 7, 7, 7, 7, 7, 8, 12],
    [7, 7, 7, 7, 7, 7, 8, 8, 8, 8],
    [0, 0, 0, 0, 8, 8, 8, 8, 8, 8],
  ];

  const ENEMY_WALKER_PALETTE = {
    1: "#c0392b",
    2: "#922b21",
    3: "#7b241c",
    4: "#e74c3c",
    5: "#f0a0a0",
    6: "#800000",
  };

  const ENEMY_WALKER = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 1, 1, 2, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 1, 1, 1, 1, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 6, 6, 0, 0, 6, 6, 0],
    [0, 6, 6, 0, 0, 6, 6, 0],
  ];

  const ENEMY_WALKER_WALK1 = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 1, 1, 2, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 1, 1, 1, 1, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [1, 6, 0, 0, 0, 0, 6, 1],
    [6, 6, 0, 0, 0, 0, 6, 6],
  ];

  const ENEMY_CHARGER_PALETTE = {
    1: "#8e44ad",
    2: "#6c3483",
    3: "#5b2c6f",
    4: "#a569bd",
    5: "#d7bde2",
    6: "#4a235a",
  };

  const ENEMY_CHARGER = [
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 2, 1, 4, 4, 1, 2, 1],
    [1, 1, 4, 4, 4, 4, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 1, 1, 1, 1, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 6, 6, 0, 0, 6, 6, 0],
  ];

  const ENEMY_SHOOTER_PALETTE = {
    1: "#1a8a4a",
    2: "#0d5c30",
    3: "#16a05a",
    4: "#f1c40f",
    5: "#d4ac0d",
    6: "#0a3d20",
    7: "#e74c3c",
  };

  const ENEMY_SHOOTER = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 1, 1, 2, 1, 0],
    [0, 1, 3, 1, 1, 3, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 4, 4, 4, 4, 1, 1],
    [1, 1, 4, 5, 5, 4, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 6, 6, 0, 0, 6, 6, 0],
  ];

  const ENEMY_SPLITTER_PALETTE = {
    1: "#ff8800",
    2: "#cc6600",
    3: "#331100",
    4: "#ffcc00",
    5: "#803300",
    6: "#1a0800",
  };

  const ENEMY_SPLITTER = [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 1, 1, 1, 1, 2, 1, 0],
    [1, 1, 1, 4, 1, 1, 4, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 1, 1, 1, 1, 1, 1, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 3, 1, 1, 1, 1, 3, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
    [0, 5, 5, 0, 0, 0, 0, 5, 5, 0],
    [0, 6, 6, 0, 0, 0, 0, 6, 6, 0],
  ];

  const ENEMY_MEDIC_PALETTE = {
    1: "#2ec4ff",
    2: "#1a86b3",
    3: "#ffffff",
    4: "#0a4a66",
    5: "#0d3a4d",
  };

  const ENEMY_MEDIC = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 1, 1, 2, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 3, 3, 1, 1, 1],
    [1, 1, 3, 3, 3, 3, 1, 1],
    [1, 1, 1, 3, 3, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 4, 4, 0, 0, 4, 4, 0],
    [0, 5, 5, 0, 0, 5, 5, 0],
  ];

  const ENEMY_ASSASSIN_PALETTE = {
    1: "#aa00ff",
    2: "#6600aa",
    3: "#1a0033",
    4: "#ee88ff",
    5: "#330055",
  };

  const ENEMY_ASSASSIN = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 4, 4, 2, 1, 0],
    [0, 1, 1, 3, 3, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 5, 1, 1, 5, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 5, 5, 0, 0, 5, 5, 0],
    [0, 3, 3, 0, 0, 3, 3, 0],
  ];

  const EXPLOSION_FRAMES = [];
  for (let f = 0; f < 5; f++) {
    const frame = [];
    for (let r = 0; r < 8; r++) {
      const row = [];
      for (let c = 0; c < 8; c++) {
        const d = Math.sqrt((r - 3.5) ** 2 + (c - 3.5) ** 2);
        row.push(d < f * 0.9 + 0.5 ? (d < f * 0.5 ? 1 : 2) : 0);
      }
      frame.push(row);
    }
    EXPLOSION_FRAMES.push(frame);
  }
  const EXPLOSION_PALETTE = { 1: "#fff7aa", 2: "#ff8800" };

  function drawPlayerBody(ctx, frame, x, y) {
    const data =
      frame === 0
        ? PLAYER_BODY_IDLE
        : frame === 1
          ? PLAYER_WALK1
          : PLAYER_WALK2;
    px(ctx, data, x - 5 * S, y - 6 * S, PLAYER_PALETTE);
  }

  function drawChibiBody(ctx, frame, x, y) {
    const data =
      frame === 0 ? CHIBI_BODY_IDLE : frame === 1 ? CHIBI_WALK1 : CHIBI_WALK2;
    px(ctx, data, x - 5 * S, y - 6 * S, CHIBI_PALETTE);
  }

  function drawBoss(ctx, x, y, tier) {
    const palette = tier === 2 ? BOSS_PALETTE_2 : BOSS_PALETTE_1;
    const scale = tier === 2 ? 1.15 : 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.translate(-x, -y);
    px(ctx, BOSS_BODY, x - 7 * S, y - 8 * S, palette);
    ctx.restore();
  }

  function drawGun(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    px(ctx, GUN, 0, -2 * S, PLAYER_PALETTE);
    ctx.restore();
  }

  function drawEnemyWalker(ctx, x, y, frame) {
    const data = frame === 0 ? ENEMY_WALKER : ENEMY_WALKER_WALK1;
    px(ctx, data, x - 4 * S, y - 5 * S, ENEMY_WALKER_PALETTE);
  }

  function drawEnemyCharger(ctx, x, y) {
    px(ctx, ENEMY_CHARGER, x - 4 * S, y - 5 * S, ENEMY_CHARGER_PALETTE);
  }

  function drawEnemyShooter(ctx, x, y) {
    px(ctx, ENEMY_SHOOTER, x - 4 * S, y - 5 * S, ENEMY_SHOOTER_PALETTE);
  }

  function drawEnemySplitter(ctx, x, y) {
    px(ctx, ENEMY_SPLITTER, x - 5 * S, y - 6 * S, ENEMY_SPLITTER_PALETTE);
  }

  function drawEnemyMedic(ctx, x, y) {
    px(ctx, ENEMY_MEDIC, x - 4 * S, y - 5 * S, ENEMY_MEDIC_PALETTE);
  }

  function drawEnemyAssassin(ctx, x, y) {
    px(ctx, ENEMY_ASSASSIN, x - 4 * S, y - 5 * S, ENEMY_ASSASSIN_PALETTE);
  }

  function drawExplosion(ctx, x, y, frameIdx) {
    if (frameIdx >= EXPLOSION_FRAMES.length) return;
    px(
      ctx,
      EXPLOSION_FRAMES[frameIdx],
      x - 4 * S,
      y - 4 * S,
      EXPLOSION_PALETTE,
    );
  }

  function drawBigExplosion(ctx, x, y, frame, maxRadius) {
    const t = frame / 6;
    const r = maxRadius * Math.min(1, t * 1.4);
    const alpha = 1 - t;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = frame < 2 ? "#fff7aa" : "#ff8800";
    ctx.shadowColor = "#ff8800";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ff4400";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function drawBullet(ctx, x, y, angle, isEnemy) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = isEnemy ? "#ff4444" : "#ffee44";
    ctx.shadowColor = isEnemy ? "#ff0000" : "#ffff00";
    ctx.shadowBlur = 6;
    ctx.fillRect(-8, -2, 16, 4);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-8, -1, 6, 2);
    ctx.restore();
  }

  function drawChainBullet(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = "#ffe066";
    ctx.shadowColor = "#ffe066";
    ctx.shadowBlur = 10;
    ctx.fillRect(-8, -2, 16, 4);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-8, -1, 6, 2);
    ctx.restore();
  }

  function drawChainBolt(ctx, x1, y1, x2, y2, alpha) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.strokeStyle = "#ffe066";
    ctx.shadowColor = "#ffe066";
    ctx.shadowBlur = 14;
    ctx.lineWidth = 3;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = -dy / dist;
    const ny = dx / dist;
    const segments = 5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const jitter = (Math.random() - 0.5) * 14;
      ctx.lineTo(x1 + dx * t + nx * jitter, y1 + dy * t + ny * jitter);
    }
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function drawMuzzleFlash(ctx, x, y, angle, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = "#ffffa0";
    ctx.shadowColor = "#ffff00";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(20, -5);
    ctx.lineTo(28, 0);
    ctx.lineTo(20, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawGrenade(ctx, x, y) {
    ctx.save();
    ctx.shadowColor = "#7c9c3c";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "#3a4a1a";
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1a2a0a";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(x - 2, y - 10, 4, 4);
    ctx.restore();
  }

  function drawLaser(ctx, x1, y1, x2, y2, alpha) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.strokeStyle = "#00eaff";
    ctx.shadowColor = "#00eaff";
    ctx.shadowBlur = 16;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function drawPillar(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = "#3a3a44";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#1a1a22";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#55555f";
    ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
    ctx.strokeStyle = "#20202a";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y + (h / 3) * i);
      ctx.lineTo(x + w, y + (h / 3) * i);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHazard(ctx, x, y, radius, pulseT) {
    const p = 0.5 + 0.5 * Math.sin(pulseT * 4);
    ctx.save();
    ctx.globalAlpha = 0.35 + p * 0.25;
    ctx.fillStyle = "#ff5500";
    ctx.shadowColor = "#ff2200";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffaa00";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.restore();
  }

  function drawBarrel(ctx, x, y, hpRatio) {
    ctx.save();
    ctx.fillStyle = "#8a5a1a";
    ctx.fillRect(x - 12, y - 16, 24, 32);
    ctx.strokeStyle = "#3a2408";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 12, y - 16, 24, 32);
    ctx.fillStyle = "#c0821a";
    ctx.fillRect(x - 12, y - 10, 24, 4);
    ctx.fillRect(x - 12, y + 4, 24, 4);
    ctx.fillStyle = "#ff4400";
    ctx.font = "bold 10px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("!", x, y - 18);
    ctx.restore();

    ctx.fillStyle = "#300000";
    ctx.fillRect(x - 14, y - 30, 28, 3);
    ctx.fillStyle = "#ff8800";
    ctx.fillRect(x - 14, y - 30, 28 * hpRatio, 3);
  }

  const PICKUP_COLORS = {
    health: "#00ff88",
    triple: "#ffee44",
    rapid: "#ff9944",
    chain: "#ffe066",
    laser: "#00eaff",
    grenade: "#88cc44",
    shield: "#44ccff",
    bomb: "#ff4444",
  };
  const PICKUP_LABELS = {
    health: "+",
    triple: "T",
    rapid: "R",
    chain: "C",
    laser: "L",
    grenade: "G",
    shield: "S",
    bomb: "B",
  };

  function drawPickup(ctx, x, y, type) {
    ctx.save();
    const c = PICKUP_COLORS[type] || "#ffffff";
    ctx.shadowColor = c;
    ctx.shadowBlur = 10;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#111";
    ctx.font = "bold 10px Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(PICKUP_LABELS[type] || "?", x, y);
    ctx.restore();
  }

  return {
    drawPlayerBody,
    drawChibiBody,
    drawBoss,
    drawGun,
    drawEnemyWalker,
    drawEnemyCharger,
    drawEnemyShooter,
    drawEnemySplitter,
    drawEnemyMedic,
    drawEnemyAssassin,
    drawExplosion,
    drawBigExplosion,
    drawBullet,
    drawChainBullet,
    drawChainBolt,
    drawMuzzleFlash,
    drawGrenade,
    drawLaser,
    drawPillar,
    drawHazard,
    drawBarrel,
    drawPickup,
    PIXEL_SIZE: S,
  };
})();
