import * as Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor(){
        super({ key: "PreloadScene" });
    }

    preload(): void {
        // Load Spritesheet
        this.load.path = "src/Assets/";
        this.load.spritesheet("marble","bubblesprite.png", {
            frameWidth: 180,
            frameHeight: 180
        });
        this.load.image("arrow","arrow.png");
        this.load.image("panel","Panel.png");
        this.load.image("replay","Replay.png");
        this.load.image("pause","MenuButtons/Square Buttons/Colored Square Buttons/Pause col_Square Button.png");
        this.load.image("x","MenuButtons/Square Buttons/Colored Square Buttons/X col_Square Button.png");
        this.load.image("v","MenuButtons/Square Buttons/Colored Square Buttons/V col_Square Button.png");
        this.load.image("sound","MenuButtons/Square Buttons/Colored Square Buttons/Audio col_Square Button.png");
        this.load.image("continue","MenuButtons/Large Buttons/Colored Large Buttons/Continue  col_Button.png");

        this.load.audio("blop",["Audio/Blop.mp3","Audio/Blop.ogg"]);
    }

    create(): void {
        console.log('starting game...');
        this.scene.start("GameScene");
    }
}