import * as Phaser from "phaser";
import Marble from "../Objects/Marble";
import AimDot from "../Objects/AimDot";
import MarbleManager from "../Manager/MarbleManager";

const TOUCH_BOUNDARY = 410;
const SHOOT_SPEED = 500;
const AIMDOT_STEP = 20;
let MIDPOINT_X = 0;

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
    private lineGraphics: Phaser.GameObjects.Graphics;
    private arrow: Phaser.GameObjects.Image;
    private arrowBody: Phaser.Geom.Line;
    private arrowGraphics: Phaser.GameObjects.Graphics;
    private marbleShoot: Marble;
    private gameOverLine: Phaser.Geom.Line;
    private marbleManager: MarbleManager;
    
    private aimDotGroup: Phaser.GameObjects.Group;
    public onAim: boolean;

    constructor(scene: Phaser.Scene, marbleManager: MarbleManager){
        super(0,400,scene.cameras.main.width,100);
        this.marbleManager = marbleManager;
        MIDPOINT_X = scene.cameras.main.width/2;

        var touchpadGraphics = scene.add.graphics({ fillStyle: { color: 0xef40c1 } });
        touchpadGraphics.fillRectShape(this);
        
        // Marble Shooter
        var random = Math.floor(Math.random()*7);
        this.marbleShoot = new Marble(scene,0,0,"red");
        this.marbleShoot.setShootingMarbleSetting(scene, this.marbleShoot.colorList[random]);
    
        // Arrow Components
        this.arrow = new Phaser.GameObjects.Image(scene,MIDPOINT_X,400,"arrow");
        this.arrow.setScale(0.4);
        this.arrow.tint = 0x008000;
        this.arrow.setDepth(2);
        scene.add.existing(this.arrow);
        this.arrowBody = new Phaser.Geom.Line(MIDPOINT_X,400);
        this.arrowGraphics = scene.add.graphics();
        this.arrowGraphics.setDepth(2);

        // Game over borderline
        this.gameOverLine = new Phaser.Geom.Line(0,350,scene.cameras.main.width,350);
        this.lineGraphics = scene.add.graphics();
        this.lineGraphics.lineStyle(1, 0xff0000, 1);
        this.lineGraphics.strokeLineShape(this.gameOverLine);

        // Aim line
        this.aimDotGroup = new Phaser.GameObjects.Group(scene,{
            classType: AimDot,
            defaultKey: 'aimDot',
            maxSize: 100,
            active: false,
            visible: false,
        });
        this.aimDotGroup.createMultiple({
            active: false,
            visible: false,
            quantity: 100,
            key: 'aimDot',
            repeat: this.aimDotGroup.maxSize-1,
            setDepth: {value: 2},
            setXY: {x: MIDPOINT_X, y:400}
        });

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
        console.log(this.marbleShoot.depth);
    }

    /**
     * Drag aim position after aiming started
     * @param scene: Game scene 
     */
    dragAim(scene: Phaser.Scene): void{
        if(this.onAim && this.pointer.y > TOUCH_BOUNDARY){
            this.arrowGraphics.clear();
            this.resetAimLine();
            this.aimingMarble(scene);
            
        } else {
            this.arrowGraphics.clear();
            this.resetAimLine();
            this.onAim = false;
        }
    }

    /**
     * Shoot marble based on aim direction after pointer is up
     * @param scene: Game scene 
     */
    shootMarble(scene: Phaser.Scene): void{
        this.arrowGraphics.clear();
        this.resetAimLine();
        var deltaX = (this.pointer.x-MIDPOINT_X)*-1;
        var deltaY = (this.pointer.y-400)*-1;
        var vectorLength = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
        this.marbleShoot.setVelocity((deltaX/vectorLength)*SHOOT_SPEED,(deltaY/vectorLength)*SHOOT_SPEED);
    }

    /**
     * Adjust shooting marble and arrow components rotation when aiming
     * @param scene: Game scene 
     */
    aimingMarble(scene: Phaser.Scene): void {
        var deltaX = this.pointer.x-MIDPOINT_X;
        var deltaY = this.pointer.y-400;
        var angle = Math.atan2(deltaY,deltaX);

        this.arrowBody.setTo(MIDPOINT_X,400,this.pointer.x,this.pointer.y);
        this.arrow.setAngle(radToDeg(angle)-90);
        this.marbleShoot.setAngle(radToDeg(angle)-90);
        this.arrowGraphics.lineStyle(5, 0x008000, 1);
        this.arrowGraphics.strokeLineShape(this.arrowBody);

        this.createAimLine(deltaX,deltaY);
    }

    /**
     * Reset aim dot group to initial position and set inactive
     */
    resetAimLine(): void{
        this.aimDotGroup.getChildren().forEach(dot => {
            dot.setActive(false);
        });
        this.aimDotGroup.setXY(MIDPOINT_X,400);
        this.aimDotGroup.setVisible(false);
        this.aimDotGroup.active = false;
    }

    /**
     * Create aim line based on aim angle
     * @param deltaX: horizontal distance between shooting marble and aiming pointer
     * @param deltaY: vertical distance between shooting marble and aiming pointer
     */
    createAimLine(deltaX: number, deltaY: number): void{
        var x = MIDPOINT_X;
        var y = 400;
        var deltaZ = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
        var stepX = AIMDOT_STEP*deltaX/deltaZ;
        var stepY = AIMDOT_STEP*deltaY/deltaZ;
        
        var reflected = false;
        var marbleMet = false;

        var coord = this.marbleManager.getCoordinate(x,y);

        while(y>=38){
            if(coord.row<11){
                if(this.marbleManager.getMarbleFromTile(coord)){
                    marbleMet = true;
                }
            }

            var aimDot: AimDot = this.aimDotGroup.get();

            // Check if aim line is exceeding wall
            if((x<=0 || x>=MIDPOINT_X*2) && !reflected){
                stepX = stepX*-1;
                if(x<0) { x=0; }
                else if(x>MIDPOINT_X*2) { x=MIDPOINT_X*2; }
                reflected = true;
            }

            // Create dot and update coordinate
            if(aimDot){
                aimDot.setActive(true);
                aimDot.setVisible(true);
                aimDot.setPosition(x,y);
                x -= stepX;
                y -= stepY;
                coord = this.marbleManager.getCoordinate(x,y);
            }

            if(marbleMet){ break; }
            
        }
        
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
        this.marbleShoot.body.reset(MIDPOINT_X,400);
        this.marbleShoot.updateColor(this.marbleShoot.colorList[random]);
    }
}