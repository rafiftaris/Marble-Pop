import "phaser";
import GameScene from "./Scripts/Scene/GameScene";
import PreloadScene from "./Scripts/Scene/PreloadScene";

type GameConfig = Phaser.Types.Core.GameConfig;

const DEFAULT_WIDTH = 292;
const DEFAULT_HEIGHT = 500;

const config: GameConfig = {
  title: "Marble Pop",
  scale:{
    parent: "game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  physics: {
    default: "arcade",
    arcade:{
        debug: false
    }
  },
  audio: {
    disableWebAudio: false,
    noAudio: false
  },
  backgroundColor: "#FAC0EB",
  scene: [PreloadScene, GameScene],
};
export class MarblePopGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
    
  }
  
}
window.onload = () => {
  var game = new MarblePopGame(config);
};