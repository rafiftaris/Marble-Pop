import * as Phaser from "phaser";

/**
 * Game over panel with restart button
 */
export default class GameOverPanel{
    private panel: Phaser.GameObjects.Image;
    private gameOverText: Phaser.GameObjects.Text;
    public restartButton: Phaser.Physics.Arcade.Image;

    constructor(scene: Phaser.Scene){
        this.panel = new Phaser.GameObjects.Image(scene,scene.cameras.main.width/2,scene.cameras.main.height/2,"panel");
        this.panel.setScale(0.5,0.5);
        this.panel.setDepth(4);
        this.gameOverText = new Phaser.GameObjects.Text(scene,(scene.cameras.main.width/2)-100,(scene.cameras.main.height/2)-75,
            "Game Over\n\nPress button to restart", {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#fff',
            stroke: '#fff',
            align: 'center',
        });
        this.gameOverText.setDepth(4);
        this.restartButton = new Phaser.Physics.Arcade.Image(scene,scene.cameras.main.width/2,(scene.cameras.main.height/2)+30,"replay");
        scene.physics.add.existing(this.restartButton);
        this.restartButton.body.setCircle(this.restartButton.body.width/2.4);
        this.restartButton.body.setOffset(18,18);
        this.restartButton.setDepth(4);
        this.restartButton.setScale(0.35);
        this.restartButton.setInteractive();
        
    }

    /**
     * Add game over panel to game scene
     * @param scene: Game Scene
     */
    addToScene(scene: Phaser.Scene): void{
        scene.add.existing(this.panel);
        scene.add.existing(this.gameOverText);
        scene.add.existing(this.restartButton);
    }


}