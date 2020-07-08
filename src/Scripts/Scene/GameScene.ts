import * as Phaser from "phaser";
import * as Touchpad from "../Objects/Touchpad";
import MarbleManager from "../Manager/MarbleManager";

export default class GameScene extends Phaser.Scene {
    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text;

    private touchpad: Touchpad.default;
    private marbleManager: MarbleManager;
    private topBoundary: Phaser.GameObjects.Rectangle;

    private panel: Phaser.GameObjects.Image;
    private gameOverText: Phaser.GameObjects.Text;
    private restartButton: Phaser.Physics.Arcade.Image;

    private isGameOver: boolean = false;
    private disableGameplayInput: boolean = false;
    private panelDisplayed: boolean = false;


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
        this.physics.world.setBounds(0,0,this.cameras.main.width,this.cameras.main.height);
    }

    create(): void {
        // Setting up flags
        this.isGameOver = false;
        this.disableGameplayInput = false;
        this.panelDisplayed = false;

        // Top Boundary and Score text
        this.topBoundary = new Phaser.GameObjects.Rectangle(this,this.cameras.main.width/2,19,this.cameras.main.width,38);
        this.add.existing(this.topBoundary);
        this.physics.add.existing(this.topBoundary,true);
                
        this.scoreText = new Phaser.GameObjects.Text(this,0,0,"Score: " + this.score.toString(), {
            fontFamily: 'Courier',
            fontSize: '22px',
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
        this.scoreText.setDepth(1);
        this.add.existing(this.scoreText);
        
        // Marble manager and touchpad
        this.marbleManager = new MarbleManager(this);
        this.touchpad = new Touchpad.default(this, this.marbleManager);

        // Panel for game over
        this.panel = new Phaser.GameObjects.Image(this,this.cameras.main.width/2,this.cameras.main.height/2,"panel");
        this.panel.setScale(0.5,0.5);
        this.panel.setDepth(4);
        this.gameOverText = new Phaser.GameObjects.Text(this,(this.cameras.main.width/2)-100,(this.cameras.main.height/2)-75,
            "Game Over\n\nPress button to restart", {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#fff',
            stroke: '#fff',
            align: 'center',
        });
        this.gameOverText.setDepth(4);
        this.restartButton = new Phaser.Physics.Arcade.Image(this,this.cameras.main.width/2,(this.cameras.main.height/2)+30,"replay");
        this.physics.add.existing(this.restartButton);
        this.restartButton.body.setCircle(this.restartButton.body.width/2.4);
        this.restartButton.body.setOffset(18,18);
        this.restartButton.setDepth(4);
        this.restartButton.setScale(0.35);
        this.restartButton.setInteractive();
        
        // Input handling
        var me = this;
        this.input.on('pointerdown',function(){
            if(me.isGameOver || me.disableGameplayInput){ return; }
            me.touchpad.startAim(me);
        },this);

        this.input.on('pointermove',function(){
            if(me.isGameOver || me.disableGameplayInput){ return; }
            me.touchpad.dragAim(me);
        },this);

        this.input.on('pointerup',function(){
            if(me.isGameOver || me.disableGameplayInput){ return; }
            if(me.touchpad.onAim){
                me.touchpad.onAim = false;
                me.touchpad.shootMarble(me);
                me.disableGameplayInput = true;
            }
        },this);

        this.restartButton.on('pointerdown',function(){
            if(!me.isGameOver){ return; }
            me.scene.start("GameScene");
        },this);
        
        this.restartButton.on('pointerover',function(){
            if(!me.isGameOver){ return; }
            this.restartButton.setScale(0.45);
        },this);

        this.restartButton.on('pointerout',function(){
            if(!me.isGameOver){ return; }
            this.restartButton.setScale(0.35);
        },this);
    }

    update(): void {
        if(this.isGameOver){
            return;
        }
        this.touchpad.pointer = this.input.activePointer;
        this.physics.world.collide(this.touchpad.getMarbleShoot(),this.marbleManager.getMarbleGroup(),this.marbleSnap,null,this);
        this.physics.world.collide(this.touchpad.getMarbleShoot(),this.topBoundary,this.marbleSnap,null,this);
        
        this.isGameOver = this.marbleManager.checkGameOver();
        if(this.isGameOver){
            this.gameOver();
        }
        
    }

    /**
     * Snap marble to the marble tiles
     */
    marbleSnap(): void{
        var marble = this.touchpad.getMarbleShoot();
        marble.setVelocity(0);
        this.score += this.marbleManager.putOnTiles(marble);
        this.scoreText.text = "Score: " + this.score.toString();

        this.touchpad.resetMarbleShoot(this);
        this.disableGameplayInput = false;
    }

    /**
     * Set game over state
     */
    gameOver(): void{
        if(this.panelDisplayed){
            return;
        }
        this.add.existing(this.panel);
        this.add.existing(this.gameOverText);
        this.add.existing(this.restartButton);
        this.panelDisplayed = true;
        this.disableGameplayInput = true;
    }
}
  