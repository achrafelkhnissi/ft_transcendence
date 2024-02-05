import { Scene } from "phaser";

export default class Preloader extends Scene {
    constructor(){
        super('preloader');
    }
    preload(){
        // this.load.image('background', '../assets/background.png')
    }
    create() {
        // Additional setup after assets have been loaded

        // Proceed to the main game scene or menu scene
        this.scene.start('gamescene');
    }
};