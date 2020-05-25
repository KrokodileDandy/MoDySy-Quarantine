import 'phaser';
import { StartMenuScene } from './scenes/start-menu-scene';
import { PopupWindow} from './scenes/popupWindow';

const config: Phaser.Types.Core.GameConfig = {
    width: 1600,
    height: 800,
    backgroundColor: Phaser.Display.Color.GetColor(255, 255, 255),
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    dom: {
        createContainer: true // allow manipulation of dom elements within phaser (used by status bar in gui-scene.ts)
    },

    scene: [StartMenuScene, PopupWindow],
    physics: {
        default: 'arcade',
        arcade: {
            // set to true to display object collision bounding boxes
            debug: false
        }
    }
};

/** Program entry point */
export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.addEventListener("load", () => {
    new Game(config);
});
