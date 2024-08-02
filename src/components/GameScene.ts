import Phaser from 'phaser';
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';
import Player from './Player';
import UIScene from './UIScene'
import EnemyManager from './EnemyManager';
import Enemy from './Enemy2';

export default class GameScene extends Phaser.Scene {

    [x: string]: any;
    path: { t: number; vec: Phaser.Math.Vector2; };
    private ui!: UIScene;    

    constructor() {
      super('hello-world')
      this.path = { t: 0, vec: new Phaser.Math.Vector2() }
    }

  preload()
    {
      this.load.image('background', 'assets/gameBg.png')
      this.load.spritesheet('enemyCap', 'assets/cap.png', { frameWidth: 420, frameHeight: 439 })
      this.load.spritesheet('player', 'assets/playerFrog.png', { frameWidth: 270, frameHeight: 270 })
      this.load.spritesheet('wing', 'assets/wing.png', { frameWidth: 30, frameHeight: 30 })
    }

    create()
    {
      this.ui = new UIScene(this);
      this.background = this.add.tileSprite(0, 0, 718, 1280, 'background').setOrigin(0.5)
      this.background.setPosition(this.scale.width / 2, this.scale.height / 2);

      this.player = new Player(this);
      // this.enemyClass = new Enemy(this, this.player, this.ui)
      this.enemyClass = new EnemyManager(this, this.player, this.ui);
      this.camera = this.cameras.main;      
    }

    resizeHandler() {        
      const windowWidth = this.scale.width;
      const windowHeight = this.scale.height;
      this.background.displayWidth = windowWidth
      this.background.displayHeight = windowHeight

      if (document.fullscreenElement) {
        this.scale.startFullscreen();
      } else {
        this.scale.stopFullscreen();
      }
    };

    update() {
        this.resizeHandler()

        if (this.player) {
            this.player.update();
          }
       }
}
