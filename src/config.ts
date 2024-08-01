import Phaser from 'phaser'
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';

import GameScene from './components/GameScene'
import { IntroScene } from './components/IntroScene';
import { EndScene } from './components/EndScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1080,
	height: 1920,
	parent: 'main',
	input: {
		keyboard: true
	  },
	scale: {
		mode: Phaser.Scale.RESIZE,
		parent: 'game-container',
		autoCenter: Phaser.Scale.CENTER_BOTH,
	  },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { x: 0, y: 200 }
		}
	},
	scene: [IntroScene, GameScene, EndScene],
	plugins: {
        global: [{
            key: 'rexMoveTo',
            plugin: MoveToPlugin,
            start: true
        }]
	}
}

export default config;