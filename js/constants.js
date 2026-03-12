// Game constants
const GAME_WIDTH = 480;
const GAME_HEIGHT = 270;
const SCALE = 2;
const GROUND_Y = 180; // top of walkable area
const GROUND_BOTTOM = 250; // bottom of walkable area
const SCROLL_SPEED = 1;

// Player
const PLAYER_SPEED = 120;
const PLAYER_HP = 100;
const PLAYER_ATTACK_DMG = 10;
const PLAYER_COMBO_WINDOW = 400; // ms
const PLAYER_SPECIAL_COST = 20; // hp cost for special

// Enemy base
const ENEMY_AGGRO_RANGE = 200;

// Colors
const COLOR_HP_GREEN = 0x00ff00;
const COLOR_HP_RED = 0xff0000;
const COLOR_HP_BG = 0x333333;
const COLOR_WHITE = 0xffffff;
const COLOR_YELLOW = 0xffff00;

// Directions
const DIR_LEFT = -1;
const DIR_RIGHT = 1;

// States
const STATE_IDLE = 'idle';
const STATE_WALK = 'walk';
const STATE_ATTACK = 'attack';
const STATE_HURT = 'hurt';
const STATE_DEAD = 'dead';
const STATE_SPECIAL = 'special';
const STATE_PICKUP = 'pickup';
