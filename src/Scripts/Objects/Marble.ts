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
    public colorList: string[] = ["red", "green", "blue", "orange", "yellow", "black", "white"];
    public checked: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, color: string){
        super(scene, x, y, "marble", 0);
        this.checked = false;

        this.scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setDefaultSetting(color);
    }

    setDefaultSetting(color: string): void{
        this.color = color;

        this.tint = COLOR_MAP[color];
        
        this.setScale(0.3);
        this.body.setCircle(this.width/3);
        this.body.setOffset(this.width/6,this.height/6);
        this.setVelocity(0);
        this.setTexture("marble",0);
    }
    
    setShootingMarbleSetting(scene: Phaser.Scene, color: string): void{
        this.setPosition(scene.cameras.main.width/2,400);
        this.depth = 1;
        this.setBounce(1,1);
        this.setCollideWorldBounds(true);

        this.setDefaultSetting(color);
        this.setPosition(scene.cameras.main.width/2,400);
    }

    updateColor(color: string): void{
        this.color = color;
        this.tint = COLOR_MAP[color];
    }

    getColor(): string{
        return this.color;
    }

    pop(): void{
        this.play('pop');
        this.on('animationcomplete',function(){
            this.setVisible(false);
            this.setActive(false);
            this.setPosition(0,0);
        });
    }

    drop(): void{
        this.setVelocity(0,50);
    }
}