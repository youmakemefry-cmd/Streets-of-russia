// HUD - Health bar, lives, score, weapon indicator, boss health
class HUD {
    constructor(scene) {
        this.scene = scene;
        const ui = scene.add.container(0, 0).setScrollFactor(0).setDepth(5000);
        
        // Player name
        this.nameText = scene.add.text(10, 6, 'СЕРЁГА', {
            fontSize: '10px', fontFamily: 'monospace', fill: '#fff',
            stroke: '#000', strokeThickness: 2
        });
        ui.add(this.nameText);
        
        // HP bar background
        this.hpBg = scene.add.rectangle(10, 20, 80, 8, COLOR_HP_BG).setOrigin(0, 0);
        ui.add(this.hpBg);
        
        // HP bar fill
        this.hpFill = scene.add.rectangle(10, 20, 80, 8, COLOR_HP_GREEN).setOrigin(0, 0);
        ui.add(this.hpFill);
        
        // HP bar border
        this.hpBorder = scene.add.rectangle(10, 20, 80, 8).setOrigin(0, 0);
        this.hpBorder.setStrokeStyle(1, 0xffffff);
        ui.add(this.hpBorder);
        
        // Lives
        this.livesText = scene.add.text(10, 32, '❤❤❤', {
            fontSize: '10px', fill: '#ff4444'
        });
        ui.add(this.livesText);
        
        // Score
        this.scoreText = scene.add.text(GAME_WIDTH - 10, 6, 'ОЧКИ: 0', {
            fontSize: '10px', fontFamily: 'monospace', fill: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(1, 0);
        ui.add(this.scoreText);
        
        // Weapon indicator
        this.weaponText = scene.add.text(10, 44, '', {
            fontSize: '9px', fontFamily: 'monospace', fill: '#ffff00',
            stroke: '#000', strokeThickness: 1
        });
        ui.add(this.weaponText);
        
        // Level name
        this.levelText = scene.add.text(GAME_WIDTH / 2, 6, '', {
            fontSize: '10px', fontFamily: 'monospace', fill: '#aaa',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5, 0);
        ui.add(this.levelText);
        
        // Boss health (hidden by default)
        this.bossNameText = scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 30, '', {
            fontSize: '10px', fontFamily: 'monospace', fill: '#ff4444',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5, 0);
        this.bossNameText.visible = false;
        ui.add(this.bossNameText);
        
        this.bossHpBg = scene.add.rectangle(GAME_WIDTH / 2 - 60, GAME_HEIGHT - 18, 120, 8, COLOR_HP_BG).setOrigin(0, 0);
        this.bossHpBg.visible = false;
        ui.add(this.bossHpBg);
        
        this.bossHpFill = scene.add.rectangle(GAME_WIDTH / 2 - 60, GAME_HEIGHT - 18, 120, 8, COLOR_HP_RED).setOrigin(0, 0);
        this.bossHpFill.visible = false;
        ui.add(this.bossHpFill);
        
        // GO arrow
        this.goArrow = scene.add.text(GAME_WIDTH - 30, GAME_HEIGHT / 2, '▶', {
            fontSize: '20px', fill: '#ffff00',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5, 0.5);
        this.goArrow.visible = false;
        ui.add(this.goArrow);
        scene.tweens.add({
            targets: this.goArrow,
            x: GAME_WIDTH - 20,
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        
        // Mobile controls (touch)
        this.setupMobileControls(scene, ui);
        
        this.ui = ui;
    }

    setupMobileControls(scene, ui) {
        if (!scene.sys.game.device.input.touch) return;
        
        // D-pad
        const padX = 60, padY = GAME_HEIGHT - 50;
        const padSize = 28;
        const padAlpha = 0.3;
        
        // Создаем кнопки
        this.btnUp = scene.add.rectangle(padX, padY - padSize, padSize, padSize, 0xffffff, padAlpha).setInteractive().setScrollFactor(0);
        this.btnDown = scene.add.rectangle(padX, padY + padSize, padSize, padSize, 0xffffff, padAlpha).setInteractive().setScrollFactor(0);
        this.btnLeft = scene.add.rectangle(padX - padSize, padY, padSize, padSize, 0xffffff, padAlpha).setInteractive().setScrollFactor(0);
        this.btnRight = scene.add.rectangle(padX + padSize, padY, padSize, padSize, 0xffffff, padAlpha).setInteractive().setScrollFactor(0);
        
        this.btnAttack = scene.add.circle(GAME_WIDTH - 50, GAME_HEIGHT - 50, 22, 0xff4444, padAlpha).setInteractive().setScrollFactor(0);
        scene.add.text(GAME_WIDTH - 50, GAME_HEIGHT - 50, 'A', { fontSize: '14px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0).setDepth(5001);
        
        this.btnSpecial = scene.add.circle(GAME_WIDTH - 90, GAME_HEIGHT - 35, 18, 0x4444ff, padAlpha).setInteractive().setScrollFactor(0);
        scene.add.text(GAME_WIDTH - 90, GAME_HEIGHT - 35, 'S', { fontSize: '12px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0).setDepth(5001);
        
        this.btnPickup = scene.add.circle(GAME_WIDTH - 90, GAME_HEIGHT - 70, 18, 0x44ff44, padAlpha).setInteractive().setScrollFactor(0);
        scene.add.text(GAME_WIDTH - 90, GAME_HEIGHT - 70, 'P', { fontSize: '12px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0).setDepth(5001);
        
        // Virtual input state
        scene.virtualInput = { up: false, down: false, left: false, right: false, attack: false, special: false, pickup: false };
        
        // Массив для компактной и надежной привязки событий
        const buttons = [
            { btn: this.btnUp, key: 'up' },
            { btn: this.btnDown, key: 'down' },
            { btn: this.btnLeft, key: 'left' },
            { btn: this.btnRight, key: 'right' },
            { btn: this.btnAttack, key: 'attack' },
            { btn: this.btnSpecial, key: 'special' },
            { btn: this.btnPickup, key: 'pickup' }
        ];

        buttons.forEach(item => {
            ui.add(item.btn);
            item.btn.setDepth(5001);

            // Нажатие
            item.btn.on('pointerdown', () => { scene.virtualInput[item.key] = true; });
            
            // Универсальная функция сброса при любом виде отпускания
            const release = () => { scene.virtualInput[item.key] = false; };
            
            item.btn.on('pointerup', release);
            item.btn.on('pointerout', release);
            item.btn.on('pointercancel', release); // Спасает от зависаний на тачскрине
        });
    }

    update(player, boss) {
        // HP
        const hpRatio = player.hp / player.maxHp;
        this.hpFill.width = 80 * hpRatio;
        this.hpFill.fillColor = hpRatio > 0.5 ? COLOR_HP_GREEN : (hpRatio > 0.25 ? COLOR_YELLOW : COLOR_HP_RED);
        
        // Lives
        this.livesText.setText('❤'.repeat(player.lives));
        
        // Score
        this.scoreText.setText('ОЧКИ: ' + player.score);
        
        // Weapon
        if (player.weapon) {
            const names = { knife: 'НОЖ', bat: 'БИТА', pistol: 'ПИСТОЛЕТ' };
            this.weaponText.setText('🔪 ' + (names[player.weapon] || player.weapon));
        } else {
            this.weaponText.setText('');
        }
        
        // Boss HP
        if (boss && boss.state !== STATE_DEAD) {
            this.bossNameText.visible = true;
            this.bossHpBg.visible = true;
            this.bossHpFill.visible = true;
            const bossNames = {
                skinhead: 'БАНДА СКИНОВ',
                ment: 'УЧАСТКОВЫЙ',
                omon: 'ОМОНОВЕЦ'
            };
            this.bossNameText.setText(bossNames[boss.type] || 'БОСС');
            this.bossHpFill.width = 120 * (boss.hp / boss.maxHp);
        } else {
            this.bossNameText.visible = false;
            this.bossHpBg.visible = false;
            this.bossHpFill.visible = false;
        }
    }

    showGo(visible) {
        this.goArrow.visible = visible;
    }

    setLevelName(name) {
        this.levelText.setText(name);
    }
}