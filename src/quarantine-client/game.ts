import 'phaser';
import { MainScene } from './scenes/main-scene';
import { GuiScene } from "./scenes/gui-scene";
import { ChartScene } from './scenes/chart-scene';
import { AgentScene } from './scenes/agent-scene';

const config: Phaser.Types.Core.GameConfig = {
    width: 1600,
    height: 800,
    backgroundColor: Phaser.Display.Color.GetColor(255, 255, 255),
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [MainScene, GuiScene, ChartScene, AgentScene],
    physics: {
        default: 'arcade',
        arcade: {
            // set to true to display object collision bounding boxes
            debug: false
        }
    }
};

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.addEventListener("load", () => {
    new Game(config);
});
