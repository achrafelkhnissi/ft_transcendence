import { Scene } from "phaser";

export default class Preloader extends Scene {
    constructor(){
        super('preloader');
    }
    preload(){
        this.load.image('background', './assets/background.png')
    }
    create() {
        this.scene.start('gamescene');
    }
};