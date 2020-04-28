import * as Phaser from 'phaser';
import {SplashScreen} from './scenes/SplashScreen';
import {MainMenu} from './scenes/MainMenu';

var config = {
    width: 1400,
    height: 800,
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        matter: { debug: true }
    },
    backgroundColor: 0x000000,
    scene: [SplashScreen, MainMenu],
    preload: preload,
    create: create,
    update: update
}

var game = new Phaser.Game(config);

function preload() {}
function create() {}
function update() {}