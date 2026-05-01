What's in the game:

Controls - Arrow keys / WASD to move, mouse to aim, click to shoot

Player - Pixel-art character with walk animation + rotating gun + muzzle flash

Enemies - 3 types: Walker (basic rush), Charger (charges at you), Shooter (keeps distance, fires back)

Levels - 5 levels, each with 3 waves, increasing enemy count and mix

Progression - Level banner + wave banner between fights, +30 HP bonus on level clear

Pickups - 20% chance enemies drop a health orb on death

Polish - Screen shake on hits, particle effects, scanline CRT overlay, glowing borders, high score
tracking

Screens - Animated menu, level/wave banners with fade in/out, game over / win screen

// Plan

Architecture:

- Single HTML file + vanilla JS (no build tools, runs directly in browser)
- HTML5 Canvas for rendering
- Pixel art drawn programmatically with Canvas 2D API (no external image files needed)

Files:

- index.html - entry point
- game.js - main engine, game loop, state management
- sprites.js - all pixel art drawing functions (player walk animation, enemy types, bullets, effects)
- entities.js - Player, Enemy, Bullet classes
- levels.js - wave definitions and level progression
- ui.js - menu, HUD, game over screen

Features:

- Arrow keys to move, mouse to aim, click to shoot
- Player has idle/walk animations, gun rotates toward cursor
- 3 enemy types: walker, charger, shooter
- Wave-based levels with increasing difficulty
- Retro pixel art style, scanline effect, screen shake
- Score, health bar, level display
