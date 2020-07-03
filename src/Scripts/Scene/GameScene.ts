import * as Phaser from "phaser";
import * as Touchpad from "../Objects/Touchpad";
import MarbleManager from "../Manager/MarbleManager";

export default class GameScene extends Phaser.Scene {
    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text;
    private touchpad: Touchpad.default;
    private marbleManager: MarbleManager;

    constructor() {
        super({ key: "GameScene" });
    }

    preload(): void {
        // Pop animation
        this.anims.create({
            key: 'pop',
            frames: this.anims.generateFrameNumbers("marble", {start: 0, end: 5}),
            frameRate: 10,
            repeat: 0
        });
    }

    create(): void {
        this.scoreText = new Phaser.GameObjects.Text(this,0,0,"Score: " + this.score.toString(), {
            fontFamily: 'Arial',
            fontSize: '15px',
            color: '#000',
            stroke: '#000',
            align: 'center',
            backgroundColor: "#f47ed6",
            fixedWidth: this.cameras.main.width,
            padding: {
                top: 10,
                bottom: 10
            }
        });
        this.add.existing(this.scoreText);

        this.touchpad = new Touchpad.default(this);

        this.physics.world.bounds.setSize(this.physics.world.bounds.width,500);
        this.physics.world.bounds.setPosition(0,100);
        
        this.marbleManager = new MarbleManager(this);

    }

    update(): void {
        
    }
}
  