import { Scene } from "phaser";

export default class Preloader extends Scene {
    constructor(position: string, currentUserId: id, opponentId: id){
        super('preloader');
    }
    preload(){
    }
    create() {
        this.scene.start('gamescene');
    }
};