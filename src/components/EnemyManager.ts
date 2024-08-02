import Phaser from 'phaser';
import Enemy from './Enemy';
import Player from './Player';
import UIScene from './UIScene';
import EnemyFireHandler from './EnemyFireHandler';
import EnemyWingsAnimation from './EnemyWingsAnimation';

export default class EnemyManager extends Phaser.Physics.Arcade.Sprite {
    private enemies: Enemy[] = [];
    private enemyVelocities: number[] = [];
    private sineWaveOffsets: number[] = [];
    private playerGraphics: Player;
    private ui: UIScene;
    private fireHandler: EnemyFireHandler; 
    private wingAnimations: EnemyWingsAnimation[] = []; 
    
    constructor(scene: Phaser.Scene, playerGraphics: Player, ui: UIScene) {
        super(scene, -100, -100, 'enemyManager');
        this.playerGraphics = playerGraphics;
        this.ui = ui;
        this.scene.add.existing(this);

        this.createEnemies();
        this.fireHandler = new EnemyFireHandler(scene, playerGraphics, ui, this);
    }

    private createEnemies() {
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

            const enemy = new Enemy(this.scene, x, y);
            this.enemies.push(enemy);

            const velocity = Phaser.Math.Between(50, 100);
            const direction = Phaser.Math.Between(0, 1) ? 1 : -1;
            this.enemyVelocities.push(velocity * direction);
            this.sineWaveOffsets.push(Phaser.Math.FloatBetween(0, Math.PI * 2));

            const wingAnimation = new EnemyWingsAnimation(this.scene, enemy);
            this.wingAnimations.push(wingAnimation);
        }
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        const amplitude = 2;
        const frequency = 0.005;
        this.enemies.forEach((enemy, index) => {
            const offset = this.sineWaveOffsets[index];
            enemy.y += amplitude * Math.sin(frequency * time + offset);
            enemy.x += this.enemyVelocities[index] * (delta / 1000);

            // Обновляем позицию контейнера для крыльев
            this.wingAnimations[index].updatePosition(enemy.x, enemy.y);

            if (enemy.x < -50 || enemy.x > this.scene.scale.width + 50) {
                this.enemyVelocities[index] = -this.enemyVelocities[index];
                enemy.x = enemy.x < -50 ? -50 : this.scene.scale.width + 50;
            }
        });

        this.fireHandler.updateFireTracking();
    }

    getEnemies(): Enemy[] {
        return this.enemies;
    }
}
