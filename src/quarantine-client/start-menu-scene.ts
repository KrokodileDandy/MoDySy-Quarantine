import { MainScene } from "./scenes/main-scene";
import { GuiScene } from "./scenes/gui-scene";
import { ChartScene } from "./scenes/chart-scene";
import { AgentScene } from "./scenes/agent-scene";
import { StatusBar } from "./scenes/status-bar";
import { MapScene } from "./scenes/map-scene";

/**
 * Menu scene at the start of the game.
 * Player can start a new game from here.
 * @author Shao
 */
export class StartMenuScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'StartMenuScene',
            active: true,
        });
    }

    init(): void {
        console.log('Init');
    }

    preload(): void {
        this.load.image('Logo', 'assets/sprites/quarantine-logo.png');
        this.load.image('NewGame', 'assets/sprites/new-game-button.png');
        this.load.image('NewGameH', 'assets/sprites/new-game-button-hover.png');
        this.load.image('NewGameP', 'assets/sprites/new-game-button-pressed.png');
    }

    create(): void {
        this.add.image(960, 200, 'Logo').setScale(0.5).setZ(-1);
        const newGameButton = this.add.image(960, 425, 'NewGame');
        const newGameButtonH = this.add.image(960, 425, 'NewGameH');
        const newGameButtonP = this.add.image(960, 425, 'NewGameP');
        newGameButton.setInteractive();
        newGameButtonH.setInteractive();
        newGameButtonP.setInteractive();
        newGameButtonH.visible = false;
        newGameButtonP.visible = false;
        newGameButton.on('pointerover', () => {
            if(newGameButton.visible == true) {
                newGameButton.visible = false;
                newGameButtonH.visible = true;
            }
        });
        newGameButtonH.on('pointerout', () => {
            if(newGameButtonH.visible == true) {
                newGameButtonH.visible = false;
                newGameButton.visible = true;
            }
        });
        newGameButtonH.on('pointerdown', () => {
            if(newGameButtonH.visible == true) {
                newGameButtonH.visible = false;
                newGameButtonP.visible = true;
            }
        });
        newGameButtonP.on('pointerup', () => {
            if(newGameButtonP.visible == true) {
                newGameButtonP.visible = false;
                newGameButton.visible = true;
                //this.loadScenes();
                //this.scene.setVisible(false);
            }
        });
    }

    update(): void {
        console.log('Update');
    }

    loadScenes(): void {
        this.scene.add('MainScene', MainScene, true);
        this.scene.add('GuiScene', GuiScene, true);
        this.scene.add('ChartScene', ChartScene, true);
        this.scene.add('AgentScene', AgentScene, false);
        this.scene.add('StatusBar', StatusBar, true);
        this.scene.add('MapScene', MapScene, true);
    }
}
