import * as Phaser from "phaser";
import Marble from "../Objects/Marble";
import MarbleManager from "../Manager/MarbleManager";

const TOUCH_BOUNDARY = 360;
const SHOOT_SPEED = 300;

function radToDeg(rad: number): number{
    return rad * (180/Math.PI);
}

export default class Touchpad extends Phaser.Geom.Rectangle{
    private pointer: Phaser.Input.Pointer;
    private arrow: Phaser.GameObjects.Image;
    private arrowBody: Phaser.Geom.Line;
    private arrowGraphics: Phaser.GameObjects.Graphics;
    private marbleShoot: Marble;
    private marbleManager: MarbleManager;
    private touchZone: Phaser.GameObjects.Zone;
    
    private onAim: boolean;

    constructor(scene: Phaser.Scene, marbleManager: MarbleManager){
        super(0,350,scene.cameras.main.width,100);
        this.marbleManager = marbleManager;
        
        var touchpadGraphics = scene.add.graphics({ fillStyle: { color: 0xef40c1 } });
        touchpadGraphics.fillRectShape(this);

        this.arrowBody = new Phaser.Geom.Line(scene.cameras.main.width/2,350);
        this.arrowGraphics = scene.add.graphics();
        this.arrowGraphics.setDepth(2);
        
        var random = Math.round(Math.random()*7);
        this.marbleShoot = this.marbleManager.getMarbleFromGroup(random);
        this.marbleShoot.setShootingMarbleSetting(scene, this.marbleShoot.colorList[random]);
        

        this.arrow = new Phaser.GameObjects.Image(scene,scene.cameras.main.width/2,350,"arrow");
        this.arrow.setScale(0.4);
        this.arrow.tint = 0x008000;
        this.arrow.depth = 2;
        scene.add.existing(this.arrow);

        this.pointer = scene.input.activePointer;
        var me = this;
        scene.input.on('pointerdown',function(){
            me.startAim(scene);
        },scene);

        scene.input.on('pointermove',function(){
            me.dragAim(scene);
        },scene);

        scene.input.on('pointerup',function(){
            if(me.onAim){
                me.onAim = false;
                me.arrowGraphics.clear();
                me.shootMarble(this);
            }
        },scene);
    }

    startAim(scene: Phaser.Scene): void{
        if(this.pointer.y < TOUCH_BOUNDARY){
            return;
        }
        this.onAim = true;
        this.aimingMarble(scene);
    }

    dragAim(scene: Phaser.Scene): void{

        if(this.onAim && this.pointer.y > TOUCH_BOUNDARY){
            this.arrowGraphics.clear();
            this.aimingMarble(scene);
            
        } else {
            this.onAim = false;
        }
    }

    shootMarble(scene: Phaser.Scene): void{
        var deltaX = (this.pointer.x-scene.cameras.main.width/2)*-1;
        var deltaY = (this.pointer.y-350)*-1;
        var vectorLength = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
        this.marbleShoot.setVelocity((deltaX/vectorLength)*SHOOT_SPEED,(deltaY/vectorLength)*SHOOT_SPEED);
    }

    aimingMarble(scene: Phaser.Scene): void {
        this.arrowBody.setTo(scene.cameras.main.width/2,350,this.pointer.x,this.pointer.y);
        var angle = Math.atan2(this.pointer.y-350,this.pointer.x-scene.cameras.main.width/2);
        this.arrow.setAngle(radToDeg(angle)-90);
        this.marbleShoot.setAngle(radToDeg(angle)-90);
        this.arrowGraphics.lineStyle(5, 0x008000, 1);
        this.arrowGraphics.strokeLineShape(this.arrowBody);
    }
}