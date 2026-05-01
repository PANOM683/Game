class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.speed = 160;
    this.angle = 0;
    this.hp = 100;
    this.maxHp = 100;
    this.radius = 14;
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
  }

  update(dt, input, bounds) {
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
  }

  tryShoot() {
    if (this.shootCooldown <= 0) {
      this.shootCooldown = this.shootRate;
      this.muzzleFlash = 1;
      return new Bullet(
        this.gunX + Math.cos(this.angle) * 18,
        this.gunY + Math.sin(this.angle) * 18,
        this.angle,
        480,
        false,
        20,
      );
    }
    return null;
  }

  takeDamage(amount) {
    if (this.invincible > 0) return false;
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
    SPRITES.drawPlayerBody(ctx, this.animFrame, this.x, this.y);
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
    }
  }

  update(dt, player, bullets) {
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
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.angle = Math.atan2(dy, dx);

    if (this.type === "walker") {
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
          new Bullet(this.x, this.y, this.angle, 200, true, this.damage),
        );
      }
    }

    this.animTimer += dt;
    if (this.animTimer > 0.15) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 2;
    }

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
    return this.dead && this.explosionFrame >= 5;
  }

  draw(ctx) {
    if (this.dead) {
      if (this.explosionFrame >= 0 && this.explosionFrame < 5) {
        SPRITES.drawExplosion(ctx, this.x, this.y, this.explosionFrame);
      }
      return;
    }

    ctx.save();
    if (this.type === "charger" && this.charging) {
      ctx.shadowColor = "#ff00ff";
      ctx.shadowBlur = 14;
    }
    if (this.type === "walker") {
      SPRITES.drawEnemyWalker(ctx, this.x, this.y, this.animFrame);
    } else if (this.type === "charger") {
      SPRITES.drawEnemyCharger(ctx, this.x, this.y);
    } else if (this.type === "shooter") {
      SPRITES.drawEnemyShooter(ctx, this.x, this.y);
    }
    ctx.restore();

    const bw = 28;
    const bh = 4;
    const bx = this.x - bw / 2;
    const by = this.y - this.radius - 10;
    ctx.fillStyle = "#300000";
    ctx.fillRect(bx, by, bw, bh);
    const ratio =
      this.hp /
      (this.type === "walker" ? 30 : this.type === "charger" ? 50 : 25);
    ctx.fillStyle = this.color;
    ctx.fillRect(bx, by, bw * ratio, bh);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, bh);
  }
}

class Bullet {
  constructor(x, y, angle, speed, isEnemy, damage) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.isEnemy = isEnemy;
    this.damage = damage;
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
    SPRITES.drawBullet(ctx, this.x, this.y, this.angle, this.isEnemy);
  }
}

class HealthOrb {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.healAmount = 20;
    this.dead = false;
    this.bobTimer = Math.random() * Math.PI * 2;
    this.radius = 10;
  }

  update(dt) {
    this.bobTimer += dt * 2;
  }

  draw(ctx) {
    SPRITES.drawHealthOrb(ctx, this.x, this.y + Math.sin(this.bobTimer) * 3);
  }
}

function circleCollide(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < a.radius + b.radius;
}
