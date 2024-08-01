import Phaser from 'phaser'
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';
import EventListeners from './EventListeners';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    playerGraphics!: Phaser.GameObjects.Graphics;
    rectWidth: number;
    rectHeight: number;
    centerX: number;
    bottomY: number;
    targetX: number;
    targetY: number;
    eventListeners: any; 
    tooglePlayerScale: boolean;
    targetWidth: number;
    targetHeight: number;
    minWidth: number;
    maxWidth: number;
    newWidth: number;
    currentWidth: number; // Добавляем свойство currentWidth
    angle: number;
    endPointX: number;
    endPointY: number;
    private isFire: boolean = false;
    playerSprite!: any;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, 'player');
        this.rectWidth = 50;
        this.rectHeight = 50;
        this.centerX = scene.scale.width / 2;
        this.bottomY = scene.scale.height - this.rectHeight;
        this.targetX = 0;
        this.targetY = 0;
        this.endPointX = 0;
        this.endPointY = 0;
        this.tooglePlayerScale = false;
        this.targetWidth = 100; // Пример значения
        this.targetHeight = 20
        this.minWidth = 50; // Пример значения
        this.maxWidth = 2500
        this.newWidth = 50; // Пример значения
        this.currentWidth = 50; // Начальное значение текущей ширины
        this.angle = 0;
        this.create();
        this.isFire = false
        this.playerSprite 
    }

    setFireState(isFire: boolean): void {
        this.isFire = isFire;
    }

    updateFireState(isFire: boolean) {
        this.isFire = isFire;
    }

    create(){

        const windowWidth = this.scene.scale.width 
        const windowHeight = this.scene.scale.height 
        
        const rectWidth = 50  
        const rectHeight = 20 
        const offset = 10 

        this.centerX = (windowWidth - rectWidth) / 2;
        this.bottomY = windowHeight - rectHeight - offset;

        this.playerGraphics = this.scene.add.graphics({ fillStyle: { color: 0xff0000 } });
        this.playerGraphics.setPosition(this.centerX, this.bottomY);

        const config = {
            targetX: this.targetX,
            targetY: this.targetY,
            targetWidth: this.targetWidth,
            maxWidth: this.maxWidth,
            minWidth: this.minWidth,
            tooglePlayerScale: this.tooglePlayerScale
        };

        this.eventListeners = new EventListeners(this.scene, this.playerGraphics, config);

        this.targetWidth = 50;
        this.targetHeight = 20;
        this.maxWidth = 2500; 

        this.scene.input.on('pointerdown', (pointer) => {
            if(!this.isFire){
                const dx = pointer.x - this.playerGraphics.x;
                const dy = pointer.y - this.playerGraphics.y;
                // Вычисление угла направления
                const angle = Math.atan2(dy, dx);
                
                // Вычисление точки пересечения с краем экрана
                const distanceX = (dx > 0) ? windowWidth - this.playerGraphics.x : -this.playerGraphics.x;
                const distanceY = (dy > 0) ? windowHeight - this.playerGraphics.y : -this.playerGraphics.y;

                const distanceToEdgeX = Math.abs(distanceX / Math.cos(angle));
                const distanceToEdgeY = Math.abs(distanceY / Math.sin(angle));

                const distanceToEdge = Math.min(distanceToEdgeX, distanceToEdgeY);

                const endPointX = this.playerGraphics.x + distanceToEdge * Math.cos(angle);
                const endPointY = this.playerGraphics.y + distanceToEdge * Math.sin(angle);

                this.endPointX = endPointX;
                this.endPointY = endPointY;

                this.targetWidth = Math.min(distanceToEdge, this.maxWidth);
                this.tooglePlayerScale = true;
                setTimeout(() => { this.tooglePlayerScale = false }, 500);
            }
        });

        this.scene.input.on('pointerup', (pointer) => {
            this.playerGraphics.clear();
            // this.playerGraphics.fillRect(0, 0, this.minWidth, 20);
        });

        this.playerSprite = this.scene.add.sprite(this.playerGraphics.x, this.playerGraphics.y - 120, 'player');
        // 
        this.scene.anims.create({
            key: 'rotate_frog',
            frames: this.scene.anims.generateFrameNumbers('player', { frames: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }),
            frameRate: 1,
            repeat: -1
        });
        // const playerSprite = this.scene.add.sprite(this.playerGraphics.x, this.playerGraphics.y, 'player');
        this.playerSprite.play('rotate_frog');
        this.playerSprite.scale = 2;

        this.scene.anims.create({
            key: 'fire_right',
            frames: this.scene.anims.generateFrameNumbers('player', { frames: [0, 1] }),
            frameRate: 2,
            repeat: -1
        });
    
        this.scene.anims.create({
            key: 'fire_left',
            frames: this.scene.anims.generateFrameNumbers('player', { frames: [16, 17] }),
            frameRate: 2,
            repeat: -1
        });
    

    }

    getPlayerBounds() {
        return {
            startPointX: this.playerGraphics.x,
            startPointY: this.playerGraphics.y-170,
            lineDistance: this.targetWidth,
            angle: this.angle,
            endPointX: this.endPointX,
            endPointY: this.endPointY
        }
    }

    update() {
        if (this.isFire) {
            if (this.scene.input.activePointer.isDown) {
                if (this.scene.input.activePointer.x > this.scene.scale.width / 2) {
                    if (this.playerSprite.anims.currentAnim.key !== 'fire_right') {
                        this.playerSprite.play('fire_right');
                    }
                } else {
                    if (this.playerSprite.anims.currentAnim.key !== 'fire_left') {
                        this.playerSprite.play('fire_left');
                    }
                }
            } 
        } else {
            if (this.playerSprite.anims.currentAnim.key !== 'rotate_frog') {
                this.playerSprite.play('rotate_frog');
            }
        }
    }
    
     
  }
