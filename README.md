Top-Down Shooter Game

How to Run:

This is a static HTML5/Canvas game with no build step or dependencies, so any local web server
works. From the project folder, in PowerShell:

    python -m http.server 8000

Then open http://localhost:8000 in your browser. If you don't have Python, use Node instead:

    npx serve .

and open the URL it prints (usually http://localhost:3000). A local server is recommended over
double-clicking index.html directly, since some browsers restrict canvas/script behavior on the
file:// protocol.

What's in the game:

Controls - Arrow keys / WASD to move, mouse to aim, left click to shoot, right click to fire the
laser, Q to throw a grenade, Esc to pause

Characters - Choose between the Soldier (balanced) or an original chibi-style kid (faster,
smaller hitbox) before each run, each with idle/walk animations, a rotating gun, and muzzle flash

Weapons - Blaster (default); Triple Shot, Rapid Fire (twin parallel bullet streams), and Chain
Lightning (bolt that arcs from the first enemy hit to nearby ones) as timed pickups; a hitscan
Laser (ammo-limited, fires an instant beam that pierces every enemy in its path); and Grenades
(ammo-limited, slow lobbed projectile with a timed area-of-effect blast)

Enemies - 6 regular types: Walker (basic rush), Charger (charges at you), Shooter (keeps
distance, fires back), Splitter (tanky, splits into 2-3 fast mini-Walkers on death), Medic
(avoids the player, heals and shields nearby enemies from 50% of incoming damage), Assassin
(teleports behind the player periodically and can teleport-dodge out of damage) - plus two
multi-phase Bosses (The Gatekeeper at level 5, Voidbringer at level 10) that dash, fire spread
shots, and summon minions, going enraged below 40% HP

Levels - 10 levels, each with 3 waves of increasing enemy count and mix, following the same
escalating formula throughout; each level has its own floor palette and ambient effect (dust,
acid, embers, or void wisps)

Environment - Levels 2 onward add static pillars that block player and enemy movement, damaging
hazard zones that bypass invincibility, and destructible explosive barrels that chain-react

Progression - Level banner + wave banner (or boss banner) between fights, a post-level stats
screen (accuracy, kills by type, time), +30 HP bonus on level clear

Pickups - Generalized drop pool on enemy death: Health Orb, Triple Shot, Rapid Fire, Chain
Lightning, Laser Ammo, Grenade Ammo, Shield Bubble (absorbs damage before HP), and a rare Bomb
(instantly damages every enemy on screen)

Screens - Animated menu, character select, settings (volume + Normal/Hard difficulty, saved
locally), pause menu, level/wave/boss banners with fade in/out, post-level stats, game over (with
"killed by" cause) / win screen

Polish - Screen shake on hits, particle effects, scanline CRT overlay, glowing borders,
procedurally generated sound effects and music (Web Audio, no audio files), a corner radar
showing enemy positions, and a high score saved locally

// Plan

Architecture:

- Single HTML file + vanilla JS (no build tools, runs directly in browser)
- HTML5 Canvas for rendering
- Pixel art drawn programmatically with Canvas 2D API (no external image or audio files needed)
- Settings and high score persisted via localStorage

Files:

- index.html - entry point
- settings.js - persisted volume/difficulty settings and high score
- audio.js - procedural sound effects and music via the Web Audio API
- game.js - main engine, game loop, state management (menu, char select, settings, pause,
  banners, boss encounters, level stats, game over), pickups/hazards/barrels/explosions wiring
- sprites.js - all pixel art and canvas-drawn effects (player skins, enemies, bosses, bullets,
  laser, chain lightning, grenade, pillars, hazards, barrels, pickup icons, explosions)
- entities.js - Player, Enemy, Boss, Bullet, Grenade, Pickup classes, and shared collision helpers
- levels.js - wave definitions, per-level themes and obstacle layouts, boss checkpoints, and level
  progression
- ui.js - menu, character select, HUD, radar, pause/settings/level-stats screens, banners, game
  over screen

Features:

- Arrow keys to move, mouse to aim, left click to shoot, right click for laser, Q for grenade,
  Esc to pause
- Two selectable player skins with idle/walk animations, gun rotates toward cursor
- 6 regular enemy types plus 2 multi-phase bosses (walker, charger, shooter, splitter, medic,
  assassin, boss)
- 10 wave-based levels with increasing difficulty, per-level visual themes, and evolving arena
  layouts
- Retro pixel art style, scanline effect, screen shake, procedural audio
- Score, health + shield bar, weapon/ammo readout, radar, level display, saved high score
