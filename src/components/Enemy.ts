import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'enemyCap');
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(0.15);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setImmovable(true);
        body.setAllowGravity(false);

        this.create();
    }

    private create() {

    }
}
