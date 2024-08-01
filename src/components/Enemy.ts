import Phaser from 'phaser';
import Player from './Player';
import UIScene from './UIScene';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    [x: string]: any;
    enemyGraphics!: Phaser.GameObjects.Sprite;
    enemies: Phaser.GameObjects.Sprite[] = [];
    enemyVelocities: number[] = [];
    sineWaveOffsets: number[] = [];
    playerGraphics: Player;
    graphics!: Phaser.GameObjects.Graphics;
    progress: number = 0;
    isIncreasing: boolean = true;
    speed: number = 0.01;
    private isAnimating: boolean = false;
    private isFire: boolean = false;
    private trackingCircle!: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, playerGraphics: Player, ui: UIScene) {
        super(scene, -100, -100, 'enemy')
        this.create()
        this.playerGraphics = playerGraphics
        this.isAnimating = false
        this.scene.add.existing(this)
        this.trackingCircle
        this.UIScene = ui
    }

    create() {
        this.graphics = this.scene.add.graphics({ lineStyle: { width: 20, color: 0xff0000 } })

        for (let i = 0; i < 10; i++) {
            let x, y;
            let validPosition = false;

            while (!validPosition) {
                x = Phaser.Math.Between(100, this.scene.scale.width - 50);
                y = Phaser.Math.Between(50, 1000);
                validPosition = true;

                for (const enemy of this.enemies) {
                    const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
                    if (distance < 100) {
                        validPosition = false;
                        break;
                    }
                }
            }

            const enemy = this.scene.add.sprite(x, y, 'enemyCap');
            enemy.setScale(.15)

            this.scene.physics.world.enable(enemy);
            const body = enemy.body as Phaser.Physics.Arcade.Body;
            body.setImmovable(true);
            body.setAllowGravity(false);

            const velocity = Phaser.Math.Between(50, 100);
            const direction = Phaser.Math.Between(0, 1) ? 1 : -1;

            this.enemies.push(enemy);
            this.enemyVelocities.push(velocity * direction); 
            this.sineWaveOffsets.push(Phaser.Math.FloatBetween(0, Math.PI * 2));
        }

        this.scene.input.on('pointerdown', () => {
            this.graphics.clear(); 
            this.enemies.forEach((enemy) => {
                const playerBounds = this.playerGraphics.getPlayerBounds();
                const line = new Phaser.Geom.Line(
                    playerBounds.startPointX,
                    playerBounds.startPointY,
                    playerBounds.endPointX,
                    playerBounds.endPointY
                );
                this.graphics.strokeLineShape(line);
            });
        });

        this.scene.input.on('pointerdown', (pointer) => {
            this.isFire = true
        });

        this.trackingCircle = this.scene.add.graphics({ fillStyle: { color: 0xff0000 } })
        this.trackingCircle.fillCircle(0, 0, 10)
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        const amplitude = 5;
        const frequency = 0.01; 
        this.enemies.forEach((enemy, index) => {
            const offset = this.sineWaveOffsets[index];
            enemy.y += amplitude * Math.sin(frequency * time + offset);
            enemy.x += this.enemyVelocities[index] * (delta / 1000);

            if (enemy.x < -50 || enemy.x > this.scene.scale.width + 50) {
                this.enemyVelocities[index] = -this.enemyVelocities[index];
                enemy.x = enemy.x < -50 ? -50 : this.scene.scale.width + 50;
            }
        });

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

        if(this.playerGraphics){
            const playerBounds = this.playerGraphics.getPlayerBounds();
            const startX = playerBounds.startPointX;
            const startY = playerBounds.startPointY;
            const endX = playerBounds.endPointX;
            const endY = playerBounds.endPointY;

            if(this.progress < 0.05 && !this.isIncreasing){
                this.isAnimating = false;
                this.isFire = false;
            } 

            const currentX = Phaser.Math.Linear(startX, endX, this.progress)
            const currentY = Phaser.Math.Linear(startY, endY, this.progress)
            this.trackingCircle.clear()

            if(!this.isFire){
                this.trackingCircle.fillCircle(1000, 1000, 10)
            } else {
                this.trackingCircle.fillCircle(currentX, currentY, 10)
            }

            this.graphics.clear();
            const line = new Phaser.Geom.Line(startX, startY, currentX, currentY);
            this.graphics.strokeLineShape(line);

            this.enemies.forEach((enemy) => {
                const enemyBounds = enemy.getBounds();
                if (Phaser.Geom.Rectangle.Contains(enemyBounds, currentX, currentY)) {

                    this.showScoreText(enemy.x, enemy.y);

                    const xOffset = enemy.x < this.scene.scale.width / 2 ? -50 : this.scene.scale.width + 50;
                    enemy.x = xOffset;
                    const body = enemy.body as Phaser.Physics.Arcade.Body;
                    body.updateFromGameObject();
                    this.UIScene.increaseScore(1)
                    this.scene.events.emit('enemy-destroyed');
                }
            });
            this.playerGraphics.setFireState(this.isFire);
        }
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