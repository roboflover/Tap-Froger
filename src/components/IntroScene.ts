import Phaser from 'phaser';
import WebFont from 'webfontloader';

export class IntroScene extends Phaser.Scene {
    tickets: number;
  constructor() {
    super({ key: 'IntroScene' });
    this.tickets = 50
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
    // Добавляем фоновое изображение и центрируем его
    const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'startBg');
    bg.setOrigin(0.5);

    // Определяем соотношение размеров изображения и экрана
    const scaleX = this.scale.width / bg.width;
    const scaleY = this.scale.height / bg.height;
    const scale = Math.max(scaleX, scaleY);

    bg.setScale(scale);

    const textStyle = {
      fontSize: '150px',  
      color: '#fff',
      fontFamily: 'Carter One',
      fontStyle: 'normal'
    };

    const ticketStyle = {
        fontSize: '40px',  
        color: '#fff',
        fontFamily: 'Carter One',
        fontStyle: 'normal'
      };

    const tapText = this.add.text(this.scale.width / 2, this.scale.height / 2 +85, 'Froger', textStyle).setOrigin(0.5, 0.5);
    const frogerText = this.add.text(this.scale.width / 2, this.scale.height / 2 -85,'Tap', textStyle).setOrigin(0.5, 0.5);
    tapText.setStroke('#000', 8); 
    frogerText.setStroke('#000', 8); 

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
    
    const homeButton = this.add.text(buttonHomeBackground.x, buttonHomeBackground.y, 'Go to Home', {
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