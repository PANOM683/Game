function resolveRectCollision(entity, rect) {
  const closestX = Math.max(rect.x, Math.min(entity.x, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(entity.y, rect.y + rect.h));
  const dx = entity.x - closestX;
  const dy = entity.y - closestY;
  const distSq = dx * dx + dy * dy;
  if (distSq === 0) {
    entity.x += entity.radius;
    return;
  }
  if (distSq < entity.radius * entity.radius) {
    const dist = Math.sqrt(distSq);
    const overlap = entity.radius - dist;
    entity.x += (dx / dist) * overlap;
    entity.y += (dy / dist) * overlap;
  }
}

class Player {
  constructor(x, y, skin = "soldier") {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.skin = skin;
    this.speed = skin === "chibi" ? 175 : 160;
    this.angle = 0;
    this.hp = 100;
    this.maxHp = 100;
    this.radius = skin === "chibi" ? 12 : 14;
    this.animFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 0.12;
    this.isMoving = false;
    this.shootCooldown = 0;
    this.shootRate = 0.18;
    this.muzzleFlash = 0;
    this.invincible = 0;
    this.gunX = 0;
    this.gunY = 0;

    this.weaponMode = "normal";
    this.weaponModeTimer = 0;
    this.laserAmmo = 2;
    this.laserCooldown = 0;
    this.grenadeAmmo = 1;
    this.grenadeCooldown = 0;
    this.shield = 0;
    this.shieldMax = 100;
  }

  update(dt, input, bounds, pillars = []) {
    this.vx = 0;
    this.vy = 0;
    if (input.keys["ArrowLeft"] || input.keys["a"]) this.vx -= 1;
    if (input.keys["ArrowRight"] || input.keys["d"]) this.vx += 1;
    if (input.keys["ArrowUp"] || input.keys["w"]) this.vy -= 1;
    if (input.keys["ArrowDown"] || input.keys["s"]) this.vy += 1;

    const len = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (len > 0) {
      this.vx = (this.vx / len) * this.speed;
      this.vy = (this.vy / len) * this.speed;
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }

    this.x = Math.max(
      this.radius,
      Math.min(bounds.w - this.radius, this.x + this.vx * dt),
    );
    this.y = Math.max(
      this.radius,
      Math.min(bounds.h - this.radius, this.y + this.vy * dt),
    );

    for (const p of pillars) resolveRectCollision(this, p);
    this.x = Math.max(this.radius, Math.min(bounds.w - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(bounds.h - this.radius, this.y));

    const dx = input.mouseX - this.x;
    const dy = input.mouseY - this.y;
    this.angle = Math.atan2(dy, dx);

    this.gunX = this.x + Math.cos(this.angle) * 10;
    this.gunY = this.y + Math.sin(this.angle) * 10;

    if (this.isMoving) {
      this.animTimer += dt;
      if (this.animTimer > this.animSpeed) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 3;
      }
    } else {
      this.animFrame = 0;
    }

    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.muzzleFlash > 0) this.muzzleFlash -= dt * 6;
    if (this.invincible > 0) this.invincible -= dt;
    if (this.laserCooldown > 0) this.laserCooldown -= dt;
    if (this.grenadeCooldown > 0) this.grenadeCooldown -= dt;
    if (this.weaponModeTimer > 0) {
      this.weaponModeTimer -= dt;
      if (this.weaponModeTimer <= 0) this.weaponMode = "normal";
    }
  }

  applyWeaponMode(mode, duration) {
    this.weaponMode = mode;
    this.weaponModeTimer = duration;
  }

  addShield(amount) {
    this.shield = Math.min(this.shieldMax, this.shield + amount);
  }

  tryShoot() {
    const rate = this.weaponMode === "rapid" ? this.shootRate * 0.45 : this.shootRate;
    if (this.shootCooldown > 0) return [];
    this.shootCooldown = rate;
    this.muzzleFlash = 1;
    const bx = this.gunX + Math.cos(this.angle) * 18;
    const by = this.gunY + Math.sin(this.angle) * 18;

    if (this.weaponMode === "triple") {
      const spread = [-0.22, 0, 0.22];
      return spread.map(
        (off) => new Bullet(bx, by, this.angle + off, 480, false, 16),
      );
    }

    if (this.weaponMode === "rapid") {
      const perpX = Math.cos(this.angle + Math.PI / 2);
      const perpY = Math.sin(this.angle + Math.PI / 2);
      const offset = 6;
      return [
        new Bullet(bx + perpX * offset, by + perpY * offset, this.angle, 480, false, 14),
        new Bullet(bx - perpX * offset, by - perpY * offset, this.angle, 480, false, 14),
      ];
    }

    if (this.weaponMode === "chain") {
      const b = new Bullet(bx, by, this.angle, 460, false, 22);
      b.isChain = true;
      return [b];
    }

    return [new Bullet(bx, by, this.angle, 480, false, 20)];
  }

  tryLaser(enemies) {
    if (this.laserAmmo <= 0 || this.laserCooldown > 0) return null;
    this.laserAmmo--;
    this.laserCooldown = 0.5;

    const maxLen = 1000;
    const dirX = Math.cos(this.angle);
    const dirY = Math.sin(this.angle);
    const hits = [];

    for (const e of enemies) {
      if (e.dead || e.visible === false) continue;
      const ex = e.x - this.x;
      const ey = e.y - this.y;
      const t = ex * dirX + ey * dirY;
      if (t < 0 || t > maxLen) continue;
      const px = this.x + dirX * t;
      const py = this.y + dirY * t;
      const perpDist = Math.hypot(e.x - px, e.y - py);
      if (perpDist <= e.radius) hits.push(e);
    }

    return {
      x1: this.x,
      y1: this.y,
      x2: this.x + dirX * maxLen,
      y2: this.y + dirY * maxLen,
      life: 0.15,
      hits,
    };
  }

  tryGrenade() {
    if (this.grenadeAmmo <= 0 || this.grenadeCooldown > 0) return null;
    this.grenadeAmmo--;
    this.grenadeCooldown = 0.6;
    return new Grenade(this.gunX, this.gunY, this.angle, 260);
  }

  takeDamage(amount) {
    if (this.invincible > 0) return false;
    if (this.shield > 0) {
      this.shield = Math.max(0, this.shield - amount);
      this.invincible = 0.4;
      return true;
    }
    this.hp = Math.max(0, this.hp - amount);
    this.invincible = 0.6;
    return true;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  draw(ctx) {
    ctx.save();
    if (this.invincible > 0 && Math.floor(this.invincible * 10) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }
    if (this.skin === "chibi") {
      SPRITES.drawChibiBody(ctx, this.animFrame, this.x, this.y);
    } else {
      SPRITES.drawPlayerBody(ctx, this.animFrame, this.x, this.y);
    }
    SPRITES.drawGun(ctx, this.gunX, this.gunY, this.angle);
    if (this.muzzleFlash > 0) {
      const tipX = this.gunX + Math.cos(this.angle) * 36;
      const tipY = this.gunY + Math.sin(this.angle) * 36;
      SPRITES.drawMuzzleFlash(ctx, tipX, tipY, this.angle, this.muzzleFlash);
    }
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "#00ff88";
    ctx.shadowBlur = 8;
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    if (this.shield > 0) {
      ctx.save();
      ctx.shadowColor = "#44ccff";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#44ccff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.radius = 16;
    this.animFrame = 0;
    this.animTimer = 0;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.dead = false;
    this.explosionFrame = -1;
    this.explosionTimer = 0;
    this.shootTimer = 0;
    this.shielded = false;
    this.visible = true;

    if (type === "walker") {
      this.hp = 30;
      this.speed = 60 + Math.random() * 30;
      this.damage = 15;
      this.score = 10;
      this.color = "#c0392b";
    } else if (type === "charger") {
      this.hp = 50;
      this.speed = 40;
      this.damage = 25;
      this.score = 20;
      this.charging = false;
      this.chargeTimer = 0;
      this.chargeCooldown = 2 + Math.random() * 2;
      this.chargeSpeed = 200;
      this.color = "#8e44ad";
    } else if (type === "shooter") {
      this.hp = 25;
      this.speed = 40;
      this.damage = 10;
      this.score = 30;
      this.shootRate = 2.0;
      this.shootTimer = Math.random() * 2;
      this.preferredDist = 200;
      this.color = "#1a8a4a";
    } else if (type === "splitter") {
      this.hp = 70;
      this.speed = 45 + Math.random() * 10;
      this.damage = 18;
      this.score = 25;
      this.color = "#ff8800";
      this.radius = 22;
    } else if (type === "medic") {
      this.hp = 40;
      this.speed = 55;
      this.damage = 5;
      this.score = 35;
      this.color = "#33ccff";
      this.healRate = 8;
      this.auraRadius = 90;
    } else if (type === "assassin") {
      this.hp = 35;
      this.speed = 75;
      this.damage = 20;
      this.score = 40;
      this.color = "#aa00ff";
      this.teleportState = "idle";
      this.teleportTimer = 1.5 + Math.random();
      this.teleportHideTimer = 0;
      this.dodgeCooldown = 0;
    }
    this.maxHp = this.hp;
  }

  update(dt, player, bullets, pillars = [], enemies = []) {
    if (this.dead) {
      if (this.explosionFrame >= 0) {
        this.explosionTimer += dt;
        if (this.explosionTimer > 0.07) {
          this.explosionTimer = 0;
          this.explosionFrame++;
        }
      }
      return;
    }

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
    this.angle = Math.atan2(dy, dx);

    if (this.type === "walker" || this.type === "splitter") {
      const nx = dx / dist;
      const ny = dy / dist;
      this.x += nx * this.speed * dt;
      this.y += ny * this.speed * dt;
    } else if (this.type === "charger") {
      if (this.charging) {
        const nx = Math.cos(this.angle);
        const ny = Math.sin(this.angle);
        this.x += nx * this.chargeSpeed * dt;
        this.y += ny * this.chargeSpeed * dt;
        this.chargeCooldown -= dt;
        if (this.chargeCooldown <= 0) {
          this.charging = false;
          this.chargeCooldown = 2 + Math.random() * 2;
          this.speed = 40;
        }
      } else {
        const nx = dx / dist;
        const ny = dy / dist;
        this.x += nx * this.speed * dt;
        this.y += ny * this.speed * dt;
        this.chargeTimer += dt;
        if (this.chargeTimer >= this.chargeCooldown && dist < 250) {
          this.charging = true;
          this.chargeTimer = 0;
          this.speed = 0;
        }
      }
    } else if (this.type === "shooter") {
      if (dist > this.preferredDist + 20) {
        const nx = dx / dist;
        const ny = dy / dist;
        this.x += nx * this.speed * dt;
        this.y += ny * this.speed * dt;
      } else if (dist < this.preferredDist - 20) {
        const nx = dx / dist;
        const ny = dy / dist;
        this.x -= nx * this.speed * dt;
        this.y -= ny * this.speed * dt;
      }
      this.shootTimer -= dt;
      if (this.shootTimer <= 0) {
        this.shootTimer = this.shootRate;
        bullets.push(
          new Bullet(this.x, this.y, this.angle, 200, true, this.damage, "shooter"),
        );
      }
    } else if (this.type === "medic") {
      let nearestAlly = null;
      let nearestDist = Infinity;
      for (const other of enemies) {
        if (other === this || other.dead || other.type === "medic") continue;
        const d = Math.hypot(other.x - this.x, other.y - this.y);
        if (d < nearestDist) {
          nearestDist = d;
          nearestAlly = other;
        }
      }
      if (nearestAlly && nearestDist > 70) {
        const nx = (nearestAlly.x - this.x) / nearestDist;
        const ny = (nearestAlly.y - this.y) / nearestDist;
        this.x += nx * this.speed * dt;
        this.y += ny * this.speed * dt;
      } else if (dist < 160) {
        const nx = dx / dist;
        const ny = dy / dist;
        this.x -= nx * this.speed * 0.6 * dt;
        this.y -= ny * this.speed * 0.6 * dt;
      }
    } else if (this.type === "assassin") {
      if (this.dodgeCooldown > 0) this.dodgeCooldown -= dt;
      if (this.teleportState === "hidden") {
        this.teleportHideTimer -= dt;
        if (this.teleportHideTimer <= 0) {
          const behindAngle = player.angle + Math.PI + (Math.random() - 0.5) * 0.7;
          this.x = Math.max(
            this.radius,
            Math.min(800 - this.radius, player.x + Math.cos(behindAngle) * 75),
          );
          this.y = Math.max(
            this.radius,
            Math.min(600 - this.radius, player.y + Math.sin(behindAngle) * 75),
          );
          this.teleportState = "idle";
          this.visible = true;
          this.teleportTimer = 2 + Math.random() * 1.5;
        }
      } else {
        const nx = dx / dist;
        const ny = dy / dist;
        this.x += nx * this.speed * dt;
        this.y += ny * this.speed * dt;
        this.teleportTimer -= dt;
        if (this.teleportTimer <= 0) {
          this.teleportState = "hidden";
          this.visible = false;
          this.teleportHideTimer = 0.3;
        }
      }
    }

    for (const p of pillars) resolveRectCollision(this, p);

    this.animTimer += dt;
    if (this.animTimer > 0.15) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 2;
    }

    this.x = Math.max(this.radius, Math.min(800 - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(600 - this.radius, this.y));
  }

  takeDamage(amount) {
    if (
      this.type === "assassin" &&
      this.teleportState !== "hidden" &&
      this.dodgeCooldown <= 0 &&
      Math.random() < 0.35
    ) {
      amount *= 0.4;
      this.dodgeCooldown = 1.4;
      this.teleportState = "hidden";
      this.visible = false;
      this.teleportHideTimer = 0.3;
    }
    this.hp -= amount;
    if (this.hp <= 0 && !this.dead) {
      this.dead = true;
      this.explosionFrame = 0;
      this.explosionTimer = 0;
      return true;
    }
    return false;
  }

  isExplosionDone() {
    return this.dead && this.explosionFrame >= 5;
  }

  draw(ctx) {
    if (this.dead) {
      if (this.explosionFrame >= 0 && this.explosionFrame < 5) {
        SPRITES.drawExplosion(ctx, this.x, this.y, this.explosionFrame);
      }
      return;
    }

    if (this.visible === false) return;

    ctx.save();
    if (this.type === "charger" && this.charging) {
      ctx.shadowColor = "#ff00ff";
      ctx.shadowBlur = 14;
    }
    if (this.shielded) {
      ctx.shadowColor = "#33ccff";
      ctx.shadowBlur = 12;
    }
    if (this.type === "walker") {
      SPRITES.drawEnemyWalker(ctx, this.x, this.y, this.animFrame);
    } else if (this.type === "charger") {
      SPRITES.drawEnemyCharger(ctx, this.x, this.y);
    } else if (this.type === "shooter") {
      SPRITES.drawEnemyShooter(ctx, this.x, this.y);
    } else if (this.type === "splitter") {
      SPRITES.drawEnemySplitter(ctx, this.x, this.y);
    } else if (this.type === "medic") {
      SPRITES.drawEnemyMedic(ctx, this.x, this.y);
      if (this.auraRadius) {
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = "#33ccff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.auraRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    } else if (this.type === "assassin") {
      SPRITES.drawEnemyAssassin(ctx, this.x, this.y);
    }
    ctx.restore();

    const bw = this.type === "splitter" ? 36 : 28;
    const bh = 4;
    const bx = this.x - bw / 2;
    const by = this.y - this.radius - 10;
    ctx.fillStyle = "#300000";
    ctx.fillRect(bx, by, bw, bh);
    const ratio = this.hp / this.maxHp;
    ctx.fillStyle = this.color;
    ctx.fillRect(bx, by, bw * ratio, bh);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, bh);
  }
}

class Bullet {
  constructor(x, y, angle, speed, isEnemy, damage, sourceType = null) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.isEnemy = isEnemy;
    this.damage = damage;
    this.sourceType = sourceType;
    this.isChain = false;
    this.dead = false;
    this.radius = 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.x < -20 || this.x > 820 || this.y < -20 || this.y > 620) {
      this.dead = true;
    }
  }

  draw(ctx) {
    if (this.isChain) {
      SPRITES.drawChainBullet(ctx, this.x, this.y, this.angle);
    } else {
      SPRITES.drawBullet(ctx, this.x, this.y, this.angle, this.isEnemy);
    }
  }
}

class Grenade {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.timer = 1.1;
    this.dead = false;
    this.radius = 6;
    this.explosionRadius = 90;
    this.damage = 55;
  }

  update(dt, bounds) {
    this.vx *= 0.97;
    this.vy *= 0.97;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.x = Math.max(this.radius, Math.min(bounds.w - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(bounds.h - this.radius, this.y));
    this.timer -= dt;
    if (this.timer <= 0) this.dead = true;
  }

  draw(ctx) {
    SPRITES.drawGrenade(ctx, this.x, this.y);
  }
}

class Pickup {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.dead = false;
    this.bobTimer = Math.random() * Math.PI * 2;
    this.radius = 10;
    this.healAmount = 20;
  }

  update(dt) {
    this.bobTimer += dt * 2;
  }

  draw(ctx) {
    SPRITES.drawPickup(ctx, this.x, this.y + Math.sin(this.bobTimer) * 3, this.type);
  }
}

class Boss {
  constructor(x, y, tier) {
    this.x = x;
    this.y = y;
    this.type = "boss";
    this.tier = tier;
    this.name = tier === 2 ? "VOIDBRINGER" : "THE GATEKEEPER";
    this.radius = tier === 2 ? 42 : 34;
    this.hp = tier === 2 ? 3600 : 1800;
    this.maxHp = this.hp;
    this.speed = tier === 2 ? 65 : 50;
    this.dashSpeed = tier === 2 ? 320 : 260;
    this.damage = tier === 2 ? 35 : 25;
    this.rangedDamage = tier === 2 ? 18 : 14;
    this.score = tier === 2 ? 1200 : 500;
    this.color = tier === 2 ? "#3a1a5c" : "#9b30ff";
    this.dead = false;
    this.visible = true;
    this.shielded = false;
    this.explosionFrame = -1;
    this.explosionTimer = 0;
    this.angle = 0;
    this.enraged = false;
    this.attackTimer = 2 + Math.random();
    this.dashing = false;
    this.dashTimer = 0;
    this.dashAngle = 0;
    this.summonTimer = 6;
  }

  update(dt, player, bullets, pillars = [], enemies = []) {
    if (this.dead) {
      if (this.explosionFrame >= 0) {
        this.explosionTimer += dt;
        if (this.explosionTimer > 0.06) {
          this.explosionTimer = 0;
          this.explosionFrame++;
        }
      }
      return;
    }

    this.enraged = this.hp < this.maxHp * 0.4;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy) || 0.0001;
    this.angle = Math.atan2(dy, dx);

    if (this.dashing) {
      this.x += Math.cos(this.dashAngle) * this.dashSpeed * dt;
      this.y += Math.sin(this.dashAngle) * this.dashSpeed * dt;
      this.dashTimer -= dt;
      if (this.dashTimer <= 0) this.dashing = false;
    } else {
      const speed = this.enraged ? this.speed * 1.4 : this.speed;
      if (dist > 160) {
        this.x += (dx / dist) * speed * dt;
        this.y += (dy / dist) * speed * dt;
      }
    }

    this.attackTimer -= dt;
    const attackRate = this.enraged ? 1.4 : 2.2;
    if (this.attackTimer <= 0 && !this.dashing) {
      this.attackTimer = attackRate;
      if (Math.random() < 0.4 && dist < 300) {
        this.dashing = true;
        this.dashTimer = 0.4;
        this.dashAngle = this.angle;
      } else {
        const shots = this.enraged ? 5 : 3;
        const spread = 0.16;
        for (let i = 0; i < shots; i++) {
          const off = (i - (shots - 1) / 2) * spread;
          bullets.push(
            new Bullet(this.x, this.y, this.angle + off, 220, true, this.rangedDamage, "boss"),
          );
        }
      }
    }

    this.summonTimer -= dt;
    if (this.summonTimer <= 0) {
      this.summonTimer = this.enraged ? 5 : 8;
      const count = this.enraged ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sx = Math.max(20, Math.min(780, this.x + Math.cos(ang) * 60));
        const sy = Math.max(20, Math.min(580, this.y + Math.sin(ang) * 60));
        enemies.push(new Enemy(sx, sy, this.enraged ? "splitter" : "walker"));
      }
    }

    for (const p of pillars) resolveRectCollision(this, p);
    this.x = Math.max(this.radius, Math.min(800 - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(600 - this.radius, this.y));
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0 && !this.dead) {
      this.dead = true;
      this.explosionFrame = 0;
      this.explosionTimer = 0;
      return true;
    }
    return false;
  }

  isExplosionDone() {
    return this.dead && this.explosionFrame >= 8;
  }

  draw(ctx) {
    if (this.dead) {
      if (this.explosionFrame >= 0 && this.explosionFrame < 8) {
        SPRITES.drawBigExplosion(
          ctx,
          this.x,
          this.y,
          Math.min(this.explosionFrame, 5),
          this.radius * 1.8,
        );
      }
      return;
    }
    ctx.save();
    if (this.enraged) {
      ctx.shadowColor = "#ff0000";
      ctx.shadowBlur = 26;
    }
    SPRITES.drawBoss(ctx, this.x, this.y, this.tier);
    ctx.restore();
  }
}

function circleCollide(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < a.radius + b.radius;
}
