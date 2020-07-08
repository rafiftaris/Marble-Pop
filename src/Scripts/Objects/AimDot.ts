import * as Phaser from "phaser";


/**
 * Marble sprite configuration
 */
export default class Marble extends Phaser.GameObjects.Rectangle {

    constructor(scene: Phaser.Scene, x: number, y: number, color: string){
        super(scene, scene.cameras.main.width/2, 400,5,5,0x008000,1);
        
        
    }
}