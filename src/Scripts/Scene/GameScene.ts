import * as Phaser from "phaser";
import * as Touchpad from "../Objects/Touchpad";
import MarbleManager from "../Manager/MarbleManager";
import GameOverPanel from "../Objects/GameOverPanel";
import PausePanel from "../Objects/PausePanel";

export default class GameScene extends Phaser.Scene {
    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text;

    private touchpad: Touchpad.default;
    private marbleManager: MarbleManager;
    private topBoundary: Phaser.GameObjects.Rectangle;

    private gameOverPanel: GameOverPanel;
    private pauseButton: Phaser.GameObjects.Image;
    private pausePanel: PausePanel;

    private isGameOver: boolean = false;
    private isPaused: boolean = false;
    private sfxOn: boolean = true;
    private disableGameplayInput: boolean = false;
    private gameOverPanelDisplayed: boolean = false;


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
        this.isPaused = false;
        this.disableGameplayInput = false;
        this.gameOverPanelDisplayed = false;
        this.sfxOn = true;

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
        
        // Game over and pause panel
        this.gameOverPanel = new GameOverPanel(this);
        this.pauseButton = new Phaser.GameObjects.Image(this,this.cameras.main.width-25,20,"pause");
        this.pauseButton.setScale(0.15);
        this.pauseButton.setDepth(3);
        this.pauseButton.setInteractive();
        this.add.existing(this.pauseButton);
        this.pausePanel = new PausePanel(this);
        
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

        this.gameOverPanel.restartButton.on('pointerdown',function(){
            if(!me.isGameOver){ return; }
            me.scene.start("GameScene");
        },this);
        
        this.gameOverPanel.restartButton.on('pointerover',function(){
            if(!me.isGameOver){ return; }
            this.restartButton.setScale(0.45);
        },this);

        this.gameOverPanel.restartButton.on('pointerout',function(){
            if(!me.isGameOver){ return; }
            this.restartButton.setScale(0.35);
        },this);

        this.pauseButton.on('pointerover',function(){
            me.pauseButton.setScale(0.17);
        },this);
        this.pauseButton.on('pointerout',function(){
            me.pauseButton.setScale(0.15);
        },this);
        this.pauseButton.on('pointerdown',function(){
            me.pausePanel.show();
            me.isPaused = true;
            me.disableGameplayInput = true;
        },this);

        this.pausePanel.aimAssistButton.on('pointerdown',function(){
            if(me.touchpad.getAimAssist()){
                me.pausePanel.aimAssistButton.setTexture("x");
                me.touchpad.setAimAssist(false);
            } else {
                me.pausePanel.aimAssistButton.setTexture("v");
                me.touchpad.setAimAssist(true);
            }
        },this);
        this.pausePanel.sfxButton.on('pointerdown',function(){
            if(me.marbleManager.isSfxEnabled()){
                me.pausePanel.sfxButton.setTexture("x");
                me.marbleManager.enableSfx(false);
            } else {
                me.pausePanel.sfxButton.setTexture("sound");
                me.marbleManager.enableSfx(true);
            }
        },this);
        this.pausePanel.continueButton.on('pointerdown',function(){
            me.pausePanel.hide();
            me.isPaused = false;
            me.disableGameplayInput = false;
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
        if(this.gameOverPanelDisplayed){
            return;
        }
        this.gameOverPanel.addToScene(this);
        this.gameOverPanelDisplayed = true;
        this.disableGameplayInput = true;
    }
}
  