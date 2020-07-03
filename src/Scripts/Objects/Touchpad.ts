import * as Phaser from "phaser";
import Marble from "../Objects/Marble";
import MarbleManager from "../Manager/MarbleManager";

function radToDeg(rad: number): number{
    return rad * (180/Math.PI);
}

export default class Touchpad extends Phaser.Geom.Rectangle{
    private pointer: Phaser.Input.Pointer;
    private arrow: Phaser.GameObjects.Image;
    private arrowBody: Phaser.Geom.Line;
    private arrowGraphics: Phaser.GameObjects.Graphics;
    private marbleShoot: Marble;
    private touchZone: Phaser.GameObjects.Zone;
    
    private onAim: boolean;

    constructor(scene: Phaser.Scene){
        super(0,350,scene.cameras.main.width,100);
        var me = this;
        
        var touchpadGraphics = scene.add.graphics({ fillStyle: { color: 0xef40c1 } });
        touchpadGraphics.fillRectShape(this);

        this.arrowBody = new Phaser.Geom.Line(scene.cameras.main.width/2,350);
        this.arrowGraphics = scene.add.graphics();
        this.arrowGraphics.setDepth(1);
        
        this.marbleShoot = new Marble(scene,scene.cameras.main.width/2,350,"green");
        this.arrow = new Phaser.GameObjects.Image(scene,scene.cameras.main.width/2,350,"arrow");
        this.arrow.setScale(0.4);
        this.arrow.tint = 0x008000;
        scene.add.existing(this.arrow);

        this.pointer = scene.input.activePointer;
        scene.input.on('pointerdown',function(){
            me.startAim(scene);
        },scene);

        scene.input.on('pointermove',function(){
            me.dragAim(scene);
        },scene);

        scene.input.on('pointerup',function(){
            me.onAim = false;
            me.arrowGraphics.clear();
        },scene);
    }

    startAim(scene: Phaser.Scene): void{
        if(this.pointer.y<360){
            return;
        }
        this.onAim = true;
        this.arrowBody.setTo(scene.cameras.main.width/2,350,this.pointer.x,this.pointer.y);
        var angle = Math.atan2(this.pointer.y-350,this.pointer.x-scene.cameras.main.width/2);
        this.arrow.setAngle(radToDeg(angle)-90);
        this.marbleShoot.setAngle(radToDeg(angle)-90);
        this.arrowGraphics.lineStyle(5, 0x008000, 1);
        this.arrowGraphics.strokeLineShape(this.arrowBody);
    }

    dragAim(scene: Phaser.Scene): void{
        if(this.onAim){
            this.arrowGraphics.clear();
            this.arrowBody.setTo(scene.cameras.main.width/2,350,this.pointer.x,this.pointer.y);
            var angle = Math.atan2(this.pointer.y-350,this.pointer.x-scene.cameras.main.width/2);
            this.arrow.setAngle(radToDeg(angle)-90);
            this.marbleShoot.setAngle(radToDeg(angle)-90);
            this.arrowGraphics.lineStyle(5, 0x008000, 1);
            this.arrowGraphics.strokeLineShape(this.arrowBody);
        }
    }
}