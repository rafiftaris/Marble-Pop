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

/**
 * Marble sprite configuration
 */
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

    /**
     * Set default setting for marble (used for marble in puzzle tiles)
     * @param color: Color of the marble
     */
    setDefaultSetting(color: string): void{
        this.color = color;

        this.tint = COLOR_MAP[color];
        
        this.setScale(0.3);
        this.body.setCircle(this.width/3);
        this.body.setOffset(this.width/6,this.height/6);
        this.setVelocity(0);
        this.setTexture("marble",0);
    }
    
    /**
     * Set setting for shooting marble
     * @param scene: Game scene
     * @param color: Color of the marble
     */
    setShootingMarbleSetting(scene: Phaser.Scene, color: string): void{
        this.setPosition(scene.cameras.main.width/2,400);
        this.depth = 1;
        this.setBounce(1,1);
        this.setCollideWorldBounds(true);

        this.setDefaultSetting(color);
        this.setPosition(scene.cameras.main.width/2,400);
    }

    /**
     * Change color on marble
     * @param color: new color
     */
    updateColor(color: string): void{
        this.color = color;
        this.tint = COLOR_MAP[color];
    }

    /**
     * Get color of marble
     * @returns: color in string
     */
    getColor(): string{
        return this.color;
    }

    /**
     * Pop marble
     */
    pop(): void{
        this.play('pop');
        this.on('animationcomplete',function(){
            this.hide();
        }, this);
    }

    /**
     * Drop marble
     */
    drop(): void{
        this.setVelocity(0,50);
        this.scene.time.delayedCall(
            750,
            this.hide,
            null, this
        )
    }

    /**
     * Hide marble
     */
    hide(): void{
        console.log('hide');
        this.setVisible(false);
        this.setActive(false);
        this.setPosition(0,0);
        this.setVelocity(0);
    }
}