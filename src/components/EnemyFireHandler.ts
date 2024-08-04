// EnemyFireHandler.ts
import Phaser from 'phaser';
import Player from './Player';
import UIScene from './UIScene';
import EnemyManager from './EnemyManager';
import Enemy from './Enemy';

export default class EnemyFireHandler {
    private scene: Phaser.Scene;
    private playerGraphics: Player;
    private ui: UIScene;
    private enemyManager: EnemyManager;
    private graphics!: Phaser.GameObjects.Graphics;
    private progress: number = 0;
    private isIncreasing: boolean = true;
    private speed: number = 0.02;
    private isAnimating: boolean = false;
    private isFire: boolean = false;
    private trackingCircle!: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, playerGraphics: Player, ui: UIScene, enemyManager: EnemyManager) {
        this.scene = scene;
        this.playerGraphics = playerGraphics;
        this.ui = ui;
        this.enemyManager = enemyManager;

        this.graphics = this.scene.add.graphics({ lineStyle: { width: 20, color: 0xff0000 } });
        this.trackingCircle = this.scene.add.graphics({ fillStyle: { color: 0xff0000 } });
        this.trackingCircle.fillCircle(0, 0, 10);

        this.setupInputListeners();
    }

    private setupInputListeners() {
        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.isFire = true;
        });
    }

    public updateFireTracking() {
        const playerBounds = this.playerGraphics.getPlayerBounds();
        const startX = playerBounds.startPointX;
        const startY = playerBounds.startPointY;
        const endX = playerBounds.endPointX;
        const endY = playerBounds.endPointY;
    
        if (this.isIncreasing && this.isFire) {
            this.progress += this.speed;
            if (this.progress >= 1) {
                this.progress = 1;
                this.isIncreasing = false;
            }
        } else {
            this.progress -= this.speed;
            if (this.progress <= 0) {
                this.progress = 0;
                this.isIncreasing = true;
            }
        }
    
        if (this.progress < 0.05 && !this.isIncreasing) {
            this.isAnimating = false;
            this.isFire = false;
        }
    
        const currentX = Phaser.Math.Linear(startX, endX, this.progress);
        const currentY = Phaser.Math.Linear(startY, endY, this.progress);
        const collisionRadius = 90; // Adjust the value for greater or smaller radius
    
        this.trackingCircle.clear();
    
        if (!this.isFire) {
            this.trackingCircle.fillCircle(1000, 1000, 10);
        } else {
            this.trackingCircle.fillCircle(currentX, currentY, 10);
        }
    
        this.graphics.clear();
        const line = new Phaser.Geom.Line(startX, startY, currentX, currentY);
        this.graphics.strokeLineShape(line);
    
        const enemies = this.enemyManager.getEnemies();
    
        enemies.forEach((enemy) => {
            const enemyBounds = enemy.getBounds();
            const enemyCenterX = enemyBounds.x + enemyBounds.width / 2;
            const enemyCenterY = enemyBounds.y + enemyBounds.height / 2;
    
            const collisionCircle = new Phaser.Geom.Circle(currentX, currentY, collisionRadius);
    
            if (Phaser.Geom.Circle.Contains(collisionCircle, enemyCenterX, enemyCenterY)) {
                this.showScoreText(enemy.x, enemy.y);
    
                const randomSide = Math.random() < 0.5 ? -90 : this.scene.scale.width + 90;
                enemy.x = randomSide;
    
                const body = enemy.body as Phaser.Physics.Arcade.Body;
                body.updateFromGameObject();
                this.ui.increaseScore(1);
                this.scene.events.emit('enemy-destroyed');
            }
        });
    
        this.playerGraphics.setFireState(this.isFire);
    }
    
    
    private showScoreText(x: number, y: number): void {
        const scoreText = this.scene.add.text(x, y, '+1', {
            fontSize: '82px',
            color: '#ffffff',
            fontStyle: 'bold'
        });

        this.scene.tweens.add({
            targets: scoreText,
            alpha: 0,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                scoreText.destroy();
            }
        });
    }
}
