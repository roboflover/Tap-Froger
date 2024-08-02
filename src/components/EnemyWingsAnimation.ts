import Phaser from 'phaser';

export default class EnemyWingsAnimation {
    private container: Phaser.GameObjects.Container;
    private leftWing: Phaser.GameObjects.Sprite;
    private rightWing: Phaser.GameObjects.Sprite;
    private enemy: Phaser.Physics.Arcade.Sprite;

    constructor(scene: Phaser.Scene, enemy: Phaser.Physics.Arcade.Sprite) {
        this.enemy = enemy;
        this.container = scene.add.container(enemy.x, enemy.y);

        const wingOffsetX = -20;  
        const wingOffsetY = 20;  

        this.leftWing = scene.add.sprite(wingOffsetX, -wingOffsetY, 'wing')
            .setOrigin(1, 1)  
            .setFlipX(true)
            .setScale(1.5)

        this.rightWing = scene.add.sprite(-wingOffsetX, -wingOffsetY, 'wing')
            .setOrigin(0, 1)  
            .setScale(1.5)

        this.container.add([this.leftWing, this.rightWing]);

        scene.tweens.add({
            targets: this.leftWing,
            angle: { from: -30, to: 30 },
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // this.leftWing
        // this.rightWing.setScale(1.5)

        scene.tweens.add({
            targets: this.rightWing,
            angle: { from: 30, to: -30 },
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    public updatePosition(enemyX: number, enemyY: number) {
        this.container.setPosition(enemyX, enemyY);
    }
}
