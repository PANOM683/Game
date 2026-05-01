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

  function drawHealthOrb(ctx, x, y) {
    ctx.save();
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#00ff88";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("+", x, y);
    ctx.restore();
  }

  return {
    drawPlayerBody,
    drawGun,
    drawEnemyWalker,
    drawEnemyCharger,
    drawEnemyShooter,
    drawExplosion,
    drawBullet,
    drawMuzzleFlash,
    drawHealthOrb,
    PIXEL_SIZE: S,
  };
})();
