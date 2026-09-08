const UI = (() => {
  const MENU_BUTTONS = {
    settings: { x: 660, y: 560, w: 110, h: 28 },
  };

  const CHAR_SELECT_CARDS = {
    soldier: { x: 180, y: 210, w: 180, h: 230 },
    chibi: { x: 440, y: 210, w: 180, h: 230 },
  };

  const PAUSE_BUTTONS = {
    resume: { x: 300, y: 260, w: 200, h: 42 },
    settings: { x: 300, y: 314, w: 200, h: 42 },
    quit: { x: 300, y: 368, w: 200, h: 42 },
  };

  const SETTINGS_BUTTONS = {
    volumePips: [0, 1, 2, 3, 4].map((i) => ({ x: 280 + i * 42, y: 220, w: 34, h: 34 })),
    normal: { x: 250, y: 310, w: 140, h: 42 },
    hard: { x: 410, y: 310, w: 140, h: 42 },
    back: { x: 300, y: 400, w: 200, h: 42 },
  };

  function drawButton(ctx, rect, label, active) {
    ctx.save();
    ctx.fillStyle = active ? "rgba(0,255,136,0.18)" : "rgba(0,0,0,0.5)";
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeStyle = active ? "#00ff88" : "#557766";
    ctx.lineWidth = active ? 2 : 1;
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.fillStyle = active ? "#00ff88" : "#aaffcc";
    ctx.font = "bold 14px Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
    ctx.restore();
  }

  function pointInRect(px, py, rect) {
    return px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;
  }

  function drawMenu(ctx, highScore) {
    const W = 800,
      H = 600;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3 + 0.05})`;
      const x = Math.floor(Math.random() * W);
      const y = Math.floor(Math.random() * H);
      ctx.fillRect(x, y, 2, 2);
    }

    ctx.save();
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 30;
    ctx.fillStyle = "#00ff88";
    ctx.font = "bold 58px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("TOP-DOWN", W / 2, 160);
    ctx.fillText("SHOOTER", W / 2, 230);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(100, 260);
    ctx.lineTo(700, 260);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#aaffcc";
    ctx.font = "14px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("ARROW KEYS / WASD : MOVE", W / 2, 310);
    ctx.fillText("MOUSE : AIM    LEFT CLICK : SHOOT", W / 2, 335);
    ctx.fillText("RIGHT CLICK : LASER    Q : GRENADE    ESC : PAUSE", W / 2, 358);

    ctx.save();
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 400);
    ctx.globalAlpha = 0.5 + pulse * 0.5;
    ctx.shadowColor = "#ffee44";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#ffee44";
    ctx.font = "bold 22px Courier New";
    ctx.fillText("[ CLICK TO START ]", W / 2, 420);
    ctx.restore();

    if (highScore > 0) {
      ctx.fillStyle = "#ffaa44";
      ctx.font = "14px Courier New";
      ctx.fillText(`HIGH SCORE: ${highScore}`, W / 2, 470);
    }

    ctx.fillStyle = "#446644";
    ctx.font = "12px Courier New";
    ctx.fillText("10 LEVELS  |  6 ENEMY TYPES + BOSSES  |  HAZARDS & PICKUPS", W / 2, 540);

    drawButton(ctx, MENU_BUTTONS.settings, "SETTINGS", false);

    drawScanlines(ctx, W, H);
  }

  function drawCharSelect(ctx, hoverSkin) {
    const W = 800,
      H = 600;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#00ff88";
    ctx.font = "bold 32px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("CHOOSE YOUR FIGHTER", W / 2, 130);
    ctx.restore();

    const cards = [
      { key: "soldier", rect: CHAR_SELECT_CARDS.soldier, label: "SOLDIER", desc: ["BALANCED", "STANDARD ISSUE"] },
      { key: "chibi", rect: CHAR_SELECT_CARDS.chibi, label: "CHIBI KID", desc: ["FASTER, SMALLER", "HARDER TO HIT"] },
    ];

    for (const c of cards) {
      const r = c.rect;
      const active = hoverSkin === c.key;
      ctx.save();
      ctx.fillStyle = active ? "rgba(0,255,136,0.12)" : "rgba(20,20,30,0.6)";
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = active ? "#00ff88" : "#446644";
      ctx.lineWidth = active ? 3 : 1;
      ctx.shadowColor = active ? "#00ff88" : "transparent";
      ctx.shadowBlur = active ? 16 : 0;
      ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.restore();

      const cx = r.x + r.w / 2;
      const cy = r.y + 90;
      if (c.key === "chibi") {
        SPRITES.drawChibiBody(ctx, 0, cx, cy);
      } else {
        SPRITES.drawPlayerBody(ctx, 0, cx, cy);
      }

      ctx.fillStyle = active ? "#00ff88" : "#ffffff";
      ctx.font = "bold 16px Courier New";
      ctx.textAlign = "center";
      ctx.fillText(c.label, cx, r.y + 165);
      ctx.fillStyle = "#88aa99";
      ctx.font = "11px Courier New";
      ctx.fillText(c.desc[0], cx, r.y + 188);
      ctx.fillText(c.desc[1], cx, r.y + 204);
    }

    ctx.save();
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 400);
    ctx.globalAlpha = 0.5 + pulse * 0.5;
    ctx.fillStyle = "#ffee44";
    ctx.font = "bold 16px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("[ CLICK A FIGHTER TO BEGIN ]", W / 2, 490);
    ctx.restore();

    drawScanlines(ctx, W, H);
  }

  function drawHUD(ctx, player, score, levelNum, waveInfo, W, H) {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(10, 10, 180, 28);
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 180, 28);

    const hpRatio = player.hp / player.maxHp;
    const hpColor =
      hpRatio > 0.6 ? "#00ff88" : hpRatio > 0.3 ? "#ffee44" : "#ff4444";
    ctx.fillStyle = "#111";
    ctx.fillRect(14, 14, 172, 20);
    ctx.fillStyle = hpColor;
    ctx.shadowColor = hpColor;
    ctx.shadowBlur = 6;
    ctx.fillRect(14, 14, 172 * hpRatio, 20);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#00ff88";
    ctx.strokeRect(14, 14, 172, 20);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px Courier New";
    ctx.textAlign = "center";
    const hpText =
      player.shield > 0
        ? `HP ${player.hp}/${player.maxHp}  +${Math.round(player.shield)}SH`
        : `HP  ${player.hp} / ${player.maxHp}`;
    ctx.fillText(hpText, 100, 28);

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(10, 46, 180, 22);
    ctx.strokeStyle = "#ffee44";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 46, 180, 22);
    ctx.fillStyle = "#ffee44";
    ctx.font = "bold 13px Courier New";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${score}`, 16, 63);

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(10, 76, 180, 40);
    ctx.strokeStyle = "#44ccff";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 76, 180, 40);
    ctx.fillStyle = "#44ccff";
    ctx.font = "bold 11px Courier New";
    ctx.textAlign = "left";
    const wpnLabel =
      player.weaponMode === "triple"
        ? "TRIPLE SHOT"
        : player.weaponMode === "rapid"
          ? "RAPID FIRE"
          : player.weaponMode === "chain"
            ? "CHAIN LIGHTNING"
            : "BLASTER";
    ctx.fillText(`WPN: ${wpnLabel}`, 16, 91);
    ctx.fillText(`LASER x${player.laserAmmo}   GRENADE x${player.grenadeAmmo}`, 16, 108);

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(W - 160, 10, 150, 54);
    ctx.strokeStyle = "#aaaaff";
    ctx.lineWidth = 1;
    ctx.strokeRect(W - 160, 10, 150, 54);
    ctx.fillStyle = "#aaaaff";
    ctx.font = "bold 13px Courier New";
    ctx.textAlign = "right";
    ctx.fillText(`LEVEL  ${levelNum}`, W - 16, 28);
    ctx.fillText(`WAVE  ${waveInfo.current} / ${waveInfo.total}`, W - 16, 48);

    ctx.fillStyle = "#557766";
    ctx.font = "9px Courier New";
    ctx.textAlign = "left";
    ctx.fillText("ESC: PAUSE", 16, 132);
  }

  function drawRadar(ctx, player, enemies, W, H, arenaW, arenaH) {
    const rw = 120,
      rh = 90;
    const x = W - rw - 10,
      y = H - rh - 10;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(x, y, rw, rh);
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, rw, rh);
    ctx.fillStyle = "#557766";
    ctx.font = "9px Courier New";
    ctx.textAlign = "left";
    ctx.fillText("RADAR", x + 4, y + 11);

    const pad = 6;
    const innerW = rw - pad * 2;
    const innerH = rh - pad * 2 - 8;
    const ox = x + pad;
    const oy = y + pad + 8;
    const scaleX = innerW / arenaW;
    const scaleY = innerH / arenaH;

    ctx.fillStyle = "#00ff88";
    ctx.beginPath();
    ctx.arc(ox + player.x * scaleX, oy + player.y * scaleY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    for (const e of enemies) {
      if (e.dead || e.visible === false) continue;
      ctx.fillStyle = e.type === "boss" ? "#ff2266" : e.color || "#ffffff";
      ctx.beginPath();
      ctx.arc(
        ox + e.x * scaleX,
        oy + e.y * scaleY,
        e.type === "boss" ? 3 : 1.6,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.restore();
  }

  function drawLevelBanner(ctx, levelData, alpha) {
    const W = 800,
      H = 600;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, H / 2 - 80, W, 160);
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, H / 2 - 80, W, 160);
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#00ff88";
    ctx.font = "bold 42px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(levelData.title, W / 2, H / 2 - 15);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffee44";
    ctx.font = "20px Courier New";
    ctx.fillText(levelData.subtitle, W / 2, H / 2 + 30);
    ctx.restore();
  }

  function drawWaveBanner(ctx, waveNum, alpha) {
    const W = 800;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffee44";
    ctx.shadowColor = "#ffee44";
    ctx.shadowBlur = 10;
    ctx.font = "bold 18px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(`-- WAVE ${waveNum} --`, W / 2, 90);
    ctx.restore();
  }

  function drawBossBanner(ctx, bossName, alpha) {
    const W = 800,
      H = 600;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(20,0,10,0.8)";
    ctx.fillRect(0, H / 2 - 70, W, 140);
    ctx.strokeStyle = "#ff2266";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, H / 2 - 70, W, 140);
    ctx.shadowColor = "#ff2266";
    ctx.shadowBlur = 24;
    ctx.fillStyle = "#ff2266";
    ctx.font = "bold 30px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("!! BOSS INCOMING !!", W / 2, H / 2 - 10);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Courier New";
    ctx.fillText(bossName, W / 2, H / 2 + 30);
    ctx.restore();
  }

  function drawBossBar(ctx, boss, W) {
    const bw = 420,
      bh = 18;
    const bx = W / 2 - bw / 2,
      by = 16;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(bx - 4, by - 4, bw + 8, bh + 24);
    ctx.fillStyle = "#200010";
    ctx.fillRect(bx, by, bw, bh);
    const ratio = Math.max(0, boss.hp / boss.maxHp);
    ctx.fillStyle = ratio < 0.4 ? "#ff2266" : "#c060ff";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 8;
    ctx.fillRect(bx, by, bw * ratio, bh);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(boss.name || "BOSS", W / 2, by + bh + 16);
    ctx.restore();
  }

  function drawPause(ctx) {
    const W = 800,
      H = 600;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, W, H);
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#00ff88";
    ctx.font = "bold 36px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", W / 2, 190);
    ctx.shadowBlur = 0;
    ctx.restore();

    drawButton(ctx, PAUSE_BUTTONS.resume, "RESUME", true);
    drawButton(ctx, PAUSE_BUTTONS.settings, "SETTINGS", false);
    drawButton(ctx, PAUSE_BUTTONS.quit, "QUIT TO MENU", false);
  }

  function drawSettings(ctx, settings) {
    const W = 800,
      H = 600;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0, 0, W, H);
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#00ff88";
    ctx.font = "bold 30px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("SETTINGS", W / 2, 150);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#aaffcc";
    ctx.font = "13px Courier New";
    ctx.fillText("VOLUME", W / 2, 205);
    ctx.restore();

    const level = Math.round(settings.volume * 5);
    SETTINGS_BUTTONS.volumePips.forEach((rect, i) => {
      const filled = i < level;
      ctx.save();
      ctx.fillStyle = filled ? "rgba(0,255,136,0.35)" : "rgba(0,0,0,0.5)";
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.strokeStyle = filled ? "#00ff88" : "#557766";
      ctx.lineWidth = 1;
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    });

    ctx.save();
    ctx.fillStyle = "#aaffcc";
    ctx.font = "13px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("DIFFICULTY", W / 2, 295);
    ctx.restore();

    drawButton(ctx, SETTINGS_BUTTONS.normal, "NORMAL", settings.difficulty === "normal");
    drawButton(ctx, SETTINGS_BUTTONS.hard, "HARD", settings.difficulty === "hard");
    drawButton(ctx, SETTINGS_BUTTONS.back, "BACK", false);

    drawScanlines(ctx, W, H);
  }

  function drawLevelStats(ctx, stats, isFinal) {
    const W = 800,
      H = 600;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0, 0, W, H);

    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#00ff88";
    ctx.font = "bold 30px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(isFinal ? "RUN COMPLETE" : "LEVEL CLEARED", W / 2, 130);
    ctx.shadowBlur = 0;

    const accuracy = stats.shotsFired > 0 ? Math.round((stats.shotsHit / stats.shotsFired) * 100) : 0;
    const elapsed = Math.floor(stats.elapsed || 0);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");

    ctx.fillStyle = "#ffee44";
    ctx.font = "bold 16px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(`ACCURACY: ${accuracy}%    TIME: ${mm}:${ss}`, W / 2, 190);

    const order = ["walker", "charger", "shooter", "splitter", "medic", "assassin", "boss"];
    const labels = {
      walker: "WALKERS",
      charger: "CHARGERS",
      shooter: "SHOOTERS",
      splitter: "SPLITTERS",
      medic: "MEDICS",
      assassin: "ASSASSINS",
      boss: "BOSSES",
    };
    ctx.font = "13px Courier New";
    ctx.fillStyle = "#aaffcc";
    let ty = 240;
    ctx.fillText("KILLS", W / 2, ty);
    ty += 26;
    for (const key of order) {
      const n = stats.killsByType[key] || 0;
      if (n === 0) continue;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`${labels[key]}: ${n}`, W / 2, ty);
      ty += 20;
    }

    ctx.fillStyle = "#ffaa44";
    ctx.font = "bold 15px Courier New";
    ctx.fillText(`TOTAL KILLS: ${stats.totalKills}`, W / 2, ty + 10);

    ctx.save();
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 400);
    ctx.globalAlpha = 0.5 + pulse * 0.5;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Courier New";
    ctx.fillText("[ CLICK TO CONTINUE ]", W / 2, H - 60);
    ctx.restore();

    ctx.restore();
  }

  function drawGameOver(ctx, score, highScore, won, deathCause, stats) {
    const W = 800,
      H = 600;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(0,0,0,0.88)";
    ctx.fillRect(0, 0, W, H);

    const title = won ? "YOU WIN!" : "GAME OVER";
    const color = won ? "#00ff88" : "#ff4444";

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.fillStyle = color;
    ctx.font = "bold 64px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(title, W / 2, H / 2 - 110);
    ctx.restore();

    if (!won && deathCause) {
      ctx.fillStyle = "#ff8888";
      ctx.font = "16px Courier New";
      ctx.fillText(`KILLED BY: ${deathCause.toUpperCase()}`, W / 2, H / 2 - 68);
    }

    ctx.fillStyle = "#ffee44";
    ctx.font = "bold 26px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(`SCORE: ${score}`, W / 2, H / 2 - 30);

    if (score >= highScore && highScore > 0) {
      ctx.fillStyle = "#ffaa44";
      ctx.font = "18px Courier New";
      ctx.fillText("NEW HIGH SCORE!", W / 2, H / 2 + 4);
    } else if (highScore > 0) {
      ctx.fillStyle = "#888888";
      ctx.font = "16px Courier New";
      ctx.fillText(`HIGH SCORE: ${highScore}`, W / 2, H / 2 + 4);
    }

    if (stats) {
      const accuracy = stats.shotsFired > 0 ? Math.round((stats.shotsHit / stats.shotsFired) * 100) : 0;
      ctx.fillStyle = "#aaffcc";
      ctx.font = "13px Courier New";
      ctx.fillText(`TOTAL KILLS: ${stats.totalKills}   ACCURACY: ${accuracy}%`, W / 2, H / 2 + 34);
    }

    ctx.save();
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 400);
    ctx.globalAlpha = 0.5 + pulse * 0.5;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Courier New";
    ctx.fillText("[ CLICK TO RESTART ]", W / 2, H / 2 + 100);
    ctx.restore();

    drawScanlines(ctx, W, H);
  }

  function drawScanlines(ctx, W, H) {
    ctx.save();
    ctx.globalAlpha = 0.04;
    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, y, W, 1);
    }
    ctx.restore();
  }

  return {
    drawMenu,
    drawCharSelect,
    drawHUD,
    drawRadar,
    drawLevelBanner,
    drawWaveBanner,
    drawBossBanner,
    drawBossBar,
    drawPause,
    drawSettings,
    drawLevelStats,
    drawGameOver,
    drawScanlines,
    pointInRect,
    MENU_BUTTONS,
    CHAR_SELECT_CARDS,
    PAUSE_BUTTONS,
    SETTINGS_BUTTONS,
  };
})();
