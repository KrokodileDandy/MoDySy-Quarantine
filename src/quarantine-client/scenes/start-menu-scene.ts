import { MainScene } from "./main-scene";
import { GuiScene } from "./gui-scene";
import { ChartScene } from "./chart-scene";
import { AgentScene } from "./agent-scene";
import { MapScene } from "./map-scene";

/**
 * Menu scene at the start of the game.
 * Player can start a new game from here.
 * @author Shao
 */
export class StartMenuScene extends Phaser.Scene {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }

    init(): void {
        console.log('Init');
    }

    preload(): void {
        // Main menu foreground     // TODO: background
        this.load.image('Logo', 'assets/sprites/start-menu/quarantine-logo-14.png');
        // New Game Button
        this.load.image('NewGame', 'assets/sprites/start-menu/new-game-button-neutral.png');
        this.load.image('NewGameH', 'assets/sprites/start-menu/new-game-button-hovered.png');
        this.load.image('NewGameP', 'assets/sprites/start-menu/new-game-button-pressed.png');
        // Easy Button
        this.load.image('Easy', 'assets/sprites/start-menu/easy-button-neutral.png');
        this.load.image('EasyH', 'assets/sprites/start-menu/easy-button-hovered.png');
        this.load.image('EasyP', 'assets/sprites/start-menu/easy-button-pressed.png');
        // Normal Button
        this.load.image('Normal', 'assets/sprites/start-menu/normal-button-neutral.png');
        this.load.image('NormalH', 'assets/sprites/start-menu/normal-button-hovered.png');
        this.load.image('NormalP', 'assets/sprites/start-menu/normal-button-pressed.png');
        // Hard Button
        this.load.image('Hard', 'assets/sprites/start-menu/hard-button-neutral.png');
        this.load.image('HardH', 'assets/sprites/start-menu/hard-button-hovered.png');
        this.load.image('HardP', 'assets/sprites/start-menu/hard-button-pressed.png');
        // Start Button
        this.load.image('Start', 'assets/sprites/start-menu/start-button-neutral.png');
        this.load.image('StartH', 'assets/sprites/start-menu/start-button-hovered.png');
        this.load.image('StartP', 'assets/sprites/start-menu/start-button-pressed.png');
    }

    create(): void {
        this.add.image(960, 470, 'Logo')   // TODO: has to be centered all time 
        this.createMenuButtons();
    }

    update(): void {
        console.log('Update');
    }

    createMenuButtons(): void {
        /**
         * Main menu buttons goes here.
         * At the moment only one button.
         * Eventually add additional buttons(options, exit, etc.).
         */
        const newGameButton = this.add.sprite(960, 600, 'NewGame');
        newGameButton.setInteractive();

        // Change the button textures on hover, press, etc.
        newGameButton.on('pointerover', () => {
            newGameButton.setTexture('NewGameH');
        });
        newGameButton.on('pointerout', () => {
            newGameButton.setTexture('NewGame');
        });
        newGameButton.on('pointerdown', () => {
            newGameButton.setTexture('NewGameP');
        });
        newGameButton.on('pointerup', () => {
            newGameButton.setTexture('NewGameH');
            newGameButton.visible = false;
            this.createDifficultyButtons();
        });
    }

    createDifficultyButtons(): void {
        /**
         * Choose the difficulty of the game.
         * Currently the buttons does nothing else than starting the game.
         */
        const easyButton = this.add.sprite(960, 500, 'Easy').setScale(0.75);
        const normalButton = this.add.sprite(960, 650, 'Normal').setScale(0.75);
        const hardButton = this.add.sprite(960, 800, 'Hard').setScale(0.75);
        easyButton.setInteractive();
        normalButton.setInteractive();
        hardButton.setInteractive();

        // Change the button textures on hover, press, etc.
        easyButton.on('pointerover', () => {
            easyButton.setTexture('EasyH');
        });
        easyButton.on('pointerout', () => {
            easyButton.setTexture('Easy');
        });
        easyButton.on('pointerdown', () => {
            easyButton.setTexture('EasyP');
        });
        easyButton.on('pointerup', () => {
            easyButton.setTexture('EasyH');
            easyButton.visible = false;
            normalButton.visible = false;
            hardButton.visible = false;
            this.createStartButton();
        });
        // Change the button textures on hover, press, etc.
        normalButton.on('pointerover', () => {
            normalButton.setTexture('NormalH');
        });
        normalButton.on('pointerout', () => {
            normalButton.setTexture('Normal');
        });
        normalButton.on('pointerdown', () => {
            normalButton.setTexture('NormalP');
        });
        normalButton.on('pointerup', () => {
            normalButton.setTexture('NormalH');
            easyButton.visible = false;
            normalButton.visible = false;
            hardButton.visible = false;
            this.createStartButton();
        });
        // Change the button textures on hover, press, etc.
        hardButton.on('pointerover', () => {
            hardButton.setTexture('HardH');
        });
        hardButton.on('pointerout', () => {
            hardButton.setTexture('Hard');
        });
        hardButton.on('pointerdown', () => {
            hardButton.setTexture('HardP');
        });
        hardButton.on('pointerup', () => {
            hardButton.setTexture('HardH');
            easyButton.visible = false;
            normalButton.visible = false;
            hardButton.visible = false;
            this.createStartButton();
        });
    }

    createStartButton(): void {
        const startButton = this.add.sprite(960, 600, 'Start');
        startButton.setInteractive();
        // Change the button textures on hover, press, etc.
        startButton.on('pointerover', () => {
            startButton.setTexture('StartH');
        });
        startButton.on('pointerout', () => {
            startButton.setTexture('Start');
        });
        startButton.on('pointerdown', () => {
            startButton.setTexture('StartP');
        });
        startButton.on('pointerup', () => {
            startButton.setTexture('StartH');
            this.scene.setVisible(false);
            this.loadScenes();
        });
    }

    loadScenes(): void {
        // Load all scenes for the main game
        this.scene.add('MainScene', MainScene, true);
        this.scene.add('GuiScene', GuiScene, true);
        this.scene.add('ChartScene', ChartScene, true);
        this.scene.add('AgentScene', AgentScene, false);
        this.scene.add('MapScene', MapScene, true);
    }
}
