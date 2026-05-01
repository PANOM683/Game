const UI = (() => {
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
    ctx.fillText("5 LEVELS  |  3 ENEMY TYPES  |  WAVE-BASED", W / 2, 540);

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
    ctx.fillText(`HP  ${player.hp} / ${player.maxHp}`, 100, 28);

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
    ctx.fillRect(W - 160, 10, 150, 54);
    ctx.strokeStyle = "#aaaaff";
    ctx.lineWidth = 1;
    ctx.strokeRect(W - 160, 10, 150, 54);
    ctx.fillStyle = "#aaaaff";
    ctx.font = "bold 13px Courier New";
    ctx.textAlign = "right";
    ctx.fillText(`LEVEL  ${levelNum}`, W - 16, 28);
    ctx.fillText(`WAVE  ${waveInfo.current} / ${waveInfo.total}`, W - 16, 48);
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

  function drawGameOver(ctx, score, highScore, won) {
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
    ctx.fillText(title, W / 2, H / 2 - 80);
    ctx.restore();

    ctx.fillStyle = "#ffee44";
    ctx.font = "bold 26px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(`SCORE: ${score}`, W / 2, H / 2 - 10);

    if (score >= highScore && highScore > 0) {
      ctx.fillStyle = "#ffaa44";
      ctx.font = "18px Courier New";
      ctx.fillText("NEW HIGH SCORE!", W / 2, H / 2 + 30);
    } else if (highScore > 0) {
      ctx.fillStyle = "#888888";
      ctx.font = "16px Courier New";
      ctx.fillText(`HIGH SCORE: ${highScore}`, W / 2, H / 2 + 30);
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
    drawHUD,
    drawLevelBanner,
    drawWaveBanner,
    drawGameOver,
    drawScanlines,
  };
})();
