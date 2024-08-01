import Phaser from 'phaser';
import WebFont from 'webfontloader';

export class EndScene extends Phaser.Scene {
    private tickets: number;
    private score: number | null;
  constructor() {
    super({ key: 'EndScene' });
    this.tickets = 50
    this.score = null;
  }
    init(data: any) {
    this.score = data.score;
  }

  preload() {
    this.load.image('startBg', 'assets/startBg.png');
    this.load.image('buttonBlue', 'assets/button_blue.png');
    this.load.image('buttonOrng', 'assets/button_orng.png');  
    this.load.image('ticket', 'assets/ticket.png');  
  }

  create() {

    // Загрузка шрифтов с использованием WebFont Loader
    WebFont.load({
      google: {
        families: ['Carter One']
      },
      active: () => {
        this.addContent();
      }
    });
  }

  addContent() {

    const displayScore = this.score !== null ? this.score : 0;
    // Добавляем фоновое изображение и центрируем его
    const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'startBg');
    bg.setOrigin(0.5);

    // Определяем соотношение размеров изображения и экрана
    const scaleX = this.scale.width / bg.width;
    const scaleY = this.scale.height / bg.height;
    const scale = Math.max(scaleX, scaleY);

    bg.setScale(scale);

    const textStyle = {
      fontSize: '75px',  
      color: '#fff',
      fontFamily: 'Carter One',
      fontStyle: 'normal'
    };

    const tapText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 300, 'Time is up', textStyle).setOrigin(0.5, 0.5);
    tapText.setStroke('#000', 8);    

    const yougotStyle = {
        fontSize: '45px',  
        color: 'orange',
        fontFamily: 'Carter One',
        fontStyle: 'normal'
      };

    const yougotText = this.add.text(this.scale.width / 2, this.scale.height / 2 -50, 'you got', yougotStyle).setOrigin(0.5, 0.5);
    yougotText.setStroke('#000', 8); 

    const scoreStyle = {
        fontSize: '120px',  
        color: '#fff',
        fontFamily: 'Carter One',
        fontStyle: 'normal'
      };

    const scoreText = this.add.text(this.scale.width / 2, this.scale.height / 2 +50 , `${this.score} CP`, scoreStyle).setOrigin(0.5, 0.5);
    scoreText.setStroke('#000', 8); 
 
    const ticketStyle = {
        fontSize: '40px',  
        color: '#fff',
        fontFamily: 'Carter One',
        fontStyle: 'normal'
      };



    this.tickets = 0
    const ticketText = this.add.text(40, 40,'50', ticketStyle).setOrigin(0.5, 0.5);
    ticketText.setStroke('#000', 4); 
    const ticketImage = this.add.image(100, 40, 'ticket')
    ticketImage.setScale(0.25)

    const buttonMarginBottom = 85;
    const buttonSpacing = 30;

    const buttonBackground = this.add.image(this.scale.width / 2, this.scale.height-315, 'buttonOrng');
    const buttonY = this.scale.height - buttonMarginBottom; 
    const buttonHomeY = buttonY - buttonSpacing - buttonBackground.height; 

    // 1. Кнопка "Play"
    buttonBackground.setOrigin(0.5);
    buttonBackground.setScale(0.9); // Масштабирую кнопку по необходимости
    
    const startButton = this.add.text(buttonBackground.x, buttonBackground.y, 'Play', {
      color: '#fff',
      fontSize: '40px',
      fontFamily: 'Tahoma',
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive();

    startButton.on('pointerdown', () => {
      this.scene.start('hello-world');
    });

    // 2. Кнопка "Go to Home"
    const buttonHomeBackground = this.add.image(this.scale.width / 2, this.scale.height-185, 'buttonBlue');
    buttonHomeBackground.setOrigin(0.5);
    buttonHomeBackground.setScale(0.9); // Масштабирую кнопку по необходимости
    
    const homeButton = this.add.text(buttonHomeBackground.x, buttonHomeBackground.y, 'By tickets', {
      color: '#fff',
      fontSize: '40px',
      fontFamily: 'Tahoma',
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive();

    homeButton.on('pointerdown', () => {
      this.scene.start('home-scene'); // Измените на вашу сцену домашней страницы
    });
  }
}

// import Phaser from 'phaser';

// export class EndScene extends Phaser.Scene {
//   private score: number | null;

//   constructor() {
//     super({ key: 'EndScene' });
//     this.score = null;
//   }

//   init(data: any) {
//     this.score = data.score;
//   }

//   preload() {
//     // Загрузите ресурсы, если необходимо
//   }

//   create() {
//     const displayScore = this.score !== null ? this.score : 0;

//     this.add.text(400, 300, `Game Over! Your score: ${displayScore}`, { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    
//     const restartButton = this.add.text(400, 400, 'Restart', { fontSize: '32px', color: '#0f0' }).setOrigin(0.5).setInteractive();

//     restartButton.on('pointerdown', () => {
//       this.scene.start('hello-world');
//     });
//   }
// }