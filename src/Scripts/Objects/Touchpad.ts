import * as Phaser from "phaser";
import Marble from "../Objects/Marble";

const TOUCH_BOUNDARY = 410;
const SHOOT_SPEED = 500;

/**
 * Radian to Degree converter
 * @param rad: radian
 * @return: degree of the radian
 */
function radToDeg(rad: number): number{
    return rad * (180/Math.PI);
}

/**
 * Touchpad for handling input zone and aiming marble.
 * 
 * Its components consist of pointer, aim line, arrow,
 * shooting marble, and game over line.
 */
export default class Touchpad extends Phaser.Geom.Rectangle{
    public pointer: Phaser.Input.Pointer;
    private aimLine: Phaser.Geom.Line;
    private lineGraphics: Phaser.GameObjects.Graphics;
    private arrow: Phaser.GameObjects.Image;
    private arrowBody: Phaser.Geom.Line;
    private arrowGraphics: Phaser.GameObjects.Graphics;
    private marbleShoot: Marble;
    private gameOverLine: Phaser.Geom.Line;
        
    public onAim: boolean;

    constructor(scene: Phaser.Scene){
        super(0,400,scene.cameras.main.width,100);
        
        var touchpadGraphics = scene.add.graphics({ fillStyle: { color: 0xef40c1 } });
        touchpadGraphics.fillRectShape(this);
        
        // Marble Shooter
        var random = Math.floor(Math.random()*7);
        this.marbleShoot = new Marble(scene,0,0,"red");
        this.marbleShoot.setShootingMarbleSetting(scene, this.marbleShoot.colorList[random]);
    
        // Arrow Components
        this.arrow = new Phaser.GameObjects.Image(scene,scene.cameras.main.width/2,400,"arrow");
        this.arrow.setScale(0.4);
        this.arrow.tint = 0x008000;
        this.arrow.depth = 2;
        scene.add.existing(this.arrow);
        this.arrowBody = new Phaser.Geom.Line(scene.cameras.main.width/2,400);
        this.arrowGraphics = scene.add.graphics();
        this.arrowGraphics.setDepth(2);

        // Game over borderline
        this.gameOverLine = new Phaser.Geom.Line(0,350,scene.cameras.main.width,350);
        this.lineGraphics = scene.add.graphics();
        this.lineGraphics.lineStyle(1, 0xff0000, 1);
        this.lineGraphics.strokeLineShape(this.gameOverLine);

        // Aim line
        // this.aimLine = new Phaser.Geom.Line(scene.cameras.main.width/2,400);
        // this.lineGraphics.lineStyle(1,0x008000,1);
        // this.lineGraphics.setDepth(2);

        // Pointer
        this.pointer = scene.input.activePointer;
    }

    /**
     * Start aiming when pointer is just pressed down
     * @param scene: Game scene 
     */
    startAim(scene: Phaser.Scene): void{
        if(this.pointer.y < TOUCH_BOUNDARY){
            this.arrowGraphics.clear();
            return;
        }
        this.onAim = true;
        this.aimingMarble(scene);
    }

    /**
     * Drag aim position after aiming started
     * @param scene: Game scene 
     */
    dragAim(scene: Phaser.Scene): void{
        if(this.onAim && this.pointer.y > TOUCH_BOUNDARY){
            this.arrowGraphics.clear();
            this.aimingMarble(scene);
            
        } else {
            this.arrowGraphics.clear();
            this.onAim = false;
        }
    }

    /**
     * Shoot marble based on aim direction after pointer is up
     * @param scene: Game scene 
     */
    shootMarble(scene: Phaser.Scene): void{
        this.arrowGraphics.clear();
        var deltaX = (this.pointer.x-scene.cameras.main.width/2)*-1;
        var deltaY = (this.pointer.y-400)*-1;
        var vectorLength = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
        this.marbleShoot.setVelocity((deltaX/vectorLength)*SHOOT_SPEED,(deltaY/vectorLength)*SHOOT_SPEED);
    }

    /**
     * Adjust shooting marble and arrow components rotation when aiming
     * @param scene: Game scene 
     */
    aimingMarble(scene: Phaser.Scene): void {
        this.arrowBody.setTo(scene.cameras.main.width/2,400,this.pointer.x,this.pointer.y);
        var angle = Math.atan2(this.pointer.y-400,this.pointer.x-scene.cameras.main.width/2);
        this.arrow.setAngle(radToDeg(angle)-90);
        this.marbleShoot.setAngle(radToDeg(angle)-90);
        this.arrowGraphics.lineStyle(5, 0x008000, 1);
        this.arrowGraphics.strokeLineShape(this.arrowBody);
    }

    /**
     * Get current shooting marble
     * @return: Shooting marble
     */
    getMarbleShoot(): Marble{
        return this.marbleShoot;
    }

    /**
     * Reset shooting marble back to aiming position after the marble attached to the group
     * @param scene: Game scene
     */
    resetMarbleShoot(scene: Phaser.Scene): void{
        var random = Math.floor(Math.random() * 7);
        this.marbleShoot.body.reset(scene.cameras.main.width/2,400);
        this.marbleShoot.updateColor(this.marbleShoot.colorList[random]);
    }
}