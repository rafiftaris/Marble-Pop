import * as Phaser from "phaser";

/**
 * Pause panel and settings
 */
export default class PausePanel{
    private panel: Phaser.GameObjects.Image;
    private pauseText: Phaser.GameObjects.Text;
    private settingsText: Phaser.GameObjects.Text;
    public aimAssistButton: Phaser.GameObjects.Image;
    public sfxButton: Phaser.GameObjects.Image;
    public continueButton: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene){
        this.panel = new Phaser.GameObjects.Image(scene,scene.cameras.main.width/2,scene.cameras.main.height/2,"panel");
        this.panel.setScale(0.5,0.6);
        this.panel.setDepth(4);
        this.pauseText = new Phaser.GameObjects.Text(scene,(scene.cameras.main.width/2)-50,(scene.cameras.main.height/2)-90,
            "GAME PAUSED", {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#fff',
            stroke: '#fff',
            align: 'center',
        });
        this.settingsText = new Phaser.GameObjects.Text(scene,(scene.cameras.main.width/2)-110,(scene.cameras.main.height/2)-50,
            "Settings\n\n\nAim Assist\n\nSFX", {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#fff',
            stroke: '#fff',
            align: 'left',
        });
        this.pauseText.setDepth(4);
        this.settingsText.setDepth(4);
        
        this.aimAssistButton = new Phaser.GameObjects.Image(scene,(scene.cameras.main.width/2)+90,(scene.cameras.main.height/2),"v");
        this.aimAssistButton.setDepth(4);
        this.aimAssistButton.setScale(0.1);
        this.aimAssistButton.setInteractive();
        this.sfxButton = new Phaser.GameObjects.Image(scene,(scene.cameras.main.width/2)+90,(scene.cameras.main.height/2)+25,"sound");
        this.sfxButton.setDepth(4);
        this.sfxButton.setScale(0.1);
        this.sfxButton.setInteractive();
        this.continueButton = new Phaser.GameObjects.Image(scene,(scene.cameras.main.width/2),(scene.cameras.main.height/2)+70,"continue");
        this.continueButton.setDepth(4);
        this.continueButton.setScale(0.2);
        this.continueButton.setInteractive();

        var me = this;
        this.continueButton.on('pointerover',function(){
            me.continueButton.setScale(0.22);
        },this);
        this.continueButton.on('pointerout',function(){
            me.continueButton.setScale(0.2);
        },this);

        scene.add.existing(this.panel);
        scene.add.existing(this.pauseText);
        scene.add.existing(this.settingsText);
        scene.add.existing(this.aimAssistButton);
        scene.add.existing(this.sfxButton);
        scene.add.existing(this.continueButton);

        this.panel.setActive(false);
        this.panel.setVisible(false);
        this.pauseText.setActive(false);
        this.pauseText.setVisible(false);
        this.settingsText.setActive(false);
        this.settingsText.setVisible(false);
        this.aimAssistButton.setActive(false);
        this.aimAssistButton.setVisible(false);
        this.sfxButton.setActive(false);
        this.sfxButton.setVisible(false);
        this.continueButton.setActive(false);
        this.continueButton.setVisible(false);
    }

    /**
     * Show pause panel to game scene
     * @param scene: Game Scene
     */
    show(): void{
        this.panel.setActive(true);
        this.panel.setVisible(true);
        this.pauseText.setActive(true);
        this.pauseText.setVisible(true);
        this.settingsText.setActive(true);
        this.settingsText.setVisible(true);
        this.aimAssistButton.setActive(true);
        this.aimAssistButton.setVisible(true);
        this.sfxButton.setActive(true);
        this.sfxButton.setVisible(true);
        this.continueButton.setActive(true);
        this.continueButton.setVisible(true);
    }

    /**
     * Hide pause panel to game scene
     * @param scene: Game Scene
     */
    hide(): void{
        this.panel.setActive(false);
        this.panel.setVisible(false);
        this.pauseText.setActive(false);
        this.pauseText.setVisible(false);
        this.settingsText.setActive(false);
        this.settingsText.setVisible(false);
        this.aimAssistButton.setActive(false);
        this.aimAssistButton.setVisible(false);
        this.sfxButton.setActive(false);
        this.sfxButton.setVisible(false);
        this.continueButton.setActive(false);
        this.continueButton.setVisible(false);
    }


}