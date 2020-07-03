import * as Phaser from "phaser";

const COLOR_MAP = {
    "red": 0xff0000,
    "green": 0x00ff00,
    "blue": 0x0000ff,
    "orange": 0xff8000,
    "yellow": 0xffff00,
    "black": 0x404040,
    "white": 0xffffff
};

export default class Marble extends Phaser.Physics.Arcade.Sprite {
    private color: string;

    constructor(scene: Phaser.Scene, x: number, y: number, color: string){
        super(scene, x, y, "marble", 0);

        this.scene.add.existing(this);

        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    
        this.color = color;

        this.tint = COLOR_MAP[color];
        
        this.setScale(0.3);
        this.body.setCircle(this.width/3);
        this.body.setOffset(this.width/6,this.height/6);
    }
    
    updateColor(color: string){
        this.color = color;
        this.tint = COLOR_MAP[color];
    }

    pop(): void{
        this.play('pop');
    }
}