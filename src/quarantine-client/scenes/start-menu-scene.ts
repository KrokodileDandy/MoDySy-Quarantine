import { MainScene } from "./main-scene";
import { GuiScene } from "./gui-scene";
import { ChartScene } from "./chart-scene";
import { MapScene } from "./map-scene";
import { Stats } from "../objects/controller/stats";
import { DifficultyLevel } from "../util/enums/difficultyLevels";
import { GameObjects } from "phaser";

/**
 * Menu scene at the start of the game.
 * Player can start a new game from here.
 * @author Shao
 */
export class StartMenuScene extends Phaser.Scene {
    //** variables to save sound in */
    mainThemeMusic: any;
    buttonClickMusic: any;

    private attributesVisible: boolean;
    private budget: Phaser.GameObjects.Text;
    private income: Phaser.GameObjects.Text;
    private interactions: Phaser.GameObjects.Text;

    public easy = require('./../../../res/json/difficulty-levels/easy.json');
    public normal = require('./../../../res/json/difficulty-levels/normal.json');
    public hard = require('./../../../res/json/difficulty-levels/hard.json');

    constructor() {
        super({
            key: "StartMenuScene",
            active: true
        });

        this.attributesVisible = false;
    }

    preload(): void {
        // Main menu foreground     // TODO: background
        this.load.image('Logo', 'assets/sprites/start-menu/quarantine-logo-14.png');
        // New Game button
        this.load.image('NewGame', 'assets/sprites/start-menu/new-game-button-neutral.png');
        this.load.image('NewGameH', 'assets/sprites/start-menu/new-game-button-hovered.png');
        this.load.image('NewGameP', 'assets/sprites/start-menu/new-game-button-pressed.png');
        // Easy button
        this.load.image('Easy', 'assets/sprites/start-menu/easy-button-neutral.png');
        this.load.image('EasyH', 'assets/sprites/start-menu/easy-button-hovered.png');
        this.load.image('EasyA', 'assets/sprites/start-menu/easy-button-active.png');
        this.load.image('EasyP', 'assets/sprites/start-menu/easy-button-pressed.png');
        // Normal button
        this.load.image('Normal', 'assets/sprites/start-menu/normal-button-neutral.png');
        this.load.image('NormalH', 'assets/sprites/start-menu/normal-button-hovered.png');
        this.load.image('NormalA', 'assets/sprites/start-menu/normal-button-active.png');
        this.load.image('NormalP', 'assets/sprites/start-menu/normal-button-pressed.png');
        // Hard button
        this.load.image('Hard', 'assets/sprites/start-menu/hard-button-neutral.png');
        this.load.image('HardH', 'assets/sprites/start-menu/hard-button-hovered.png');
        this.load.image('HardA', 'assets/sprites/start-menu/hard-button-active.png');
        this.load.image('HardP', 'assets/sprites/start-menu/hard-button-pressed.png');
        // Start button
        this.load.image('Start', 'assets/sprites/start-menu/start-button-neutral.png');
        this.load.image('StartH', 'assets/sprites/start-menu/start-button-hovered.png');
        this.load.image('StartP', 'assets/sprites/start-menu/start-button-pressed.png');
        // Temporary skip button to allow faster development by skipping to choose the difficulty (delete later).
        this.load.image('Skip', 'assets/sprites/arrow-button-right.png');
        //** load audio files */
        this.load.audio("main_menu_audio_theme", ["assets/sounds/Main_Menu_Music.mp3", "assets/sounds/Main_Menu_Music.ogg"]);
        this.load.audio("button_click", ["assets/sounds/click-sound.mp3", "assets/sounds/click-sound.ogg"]);

    }

    create(): void {
        this.add.image(innerWidth/2, innerHeight/2, 'Logo')   // TODO: has to be centered all time 
        this.createMenuButtons();
        //** create sound objects */
        this.mainThemeMusic = this.sound.add("main_menu_audio_theme");
        this.buttonClickMusic = this.sound.add("button_click");
        
        const musicConfig = {
            mute: false,
            volume: 0.3,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay:0
        }
        this.mainThemeMusic.play(musicConfig);
    }

    createMenuButtons(): void {
        /**
         * Main menu buttons goes here.
         * At the moment only one button.
         * Eventually add additional buttons(options, exit, etc.).
         */
        const newGameButton = this.add.sprite(innerWidth/2, innerHeight/1.6, 'NewGame').setScale(0.9);

        // Change the button textures on hover, press, etc.
        newGameButton.setInteractive()
        .on('pointerover', () => {
            newGameButton.setTexture('NewGameH');
        })
        .on('pointerout', () => {
            newGameButton.setTexture('NewGame');
        })
        .on('pointerdown', () => {
            newGameButton.setTexture('NewGameP');
        })
        .on('pointerup', () => {
            newGameButton.setTexture('NewGameH');
            newGameButton.visible = false;
            this.buttonClickMusic.play();
            this.createDifficultyButtons();
        });
        // Delete later
        /*
        const skipButton = this.add.sprite(1800, 750, 'Skip').setScale(0.4);
        skipButton.setInteractive();
        skipButton.on('pointerdown', () => {
            //loads the "NORMAL" game stats @see{res/json/difficulty-levels/normal.json}
            Stats.getInstance(DifficultyLevel.NORMAL); 
            this.scene.setVisible(false);
            this.loadScenes();
        });
        */
    }

    createDifficultyButtons(): void {
        /**
         * Choose the difficulty of the game.
         * Currently the buttons does nothing else than starting the game.
         */
        const easyButton = this.add.sprite(innerWidth/2, innerHeight*0.5, 'Easy').setScale(0.75);
        const normalButton = this.add.sprite(innerWidth/2, innerHeight*0.65, 'Normal').setScale(0.75);
        const hardButton = this.add.sprite(innerWidth/2, innerHeight*0.8, 'Hard').setScale(0.75);

        // Change the button textures on hover, press, etc.
        easyButton.setInteractive()
        .on('pointerover', () => {
            easyButton.setTexture('EasyH');
        })
        .on('pointerout', () => {
            easyButton.setTexture('Easy');
        })
        .on('pointerdown', () => {
            easyButton.setTexture('EasyP');
        })
        .on('pointerup', () => {
            easyButton.setTexture('EasyA');
            easyButton.removeInteractive();
            normalButton.setInteractive().setTexture('Normal');
            hardButton.setInteractive().setTexture('Hard');
            this.buttonClickMusic.play();

            //loads the "EASY" game stats @see{res/json/difficulty-levels/easy.json}
            Stats.getInstance(DifficultyLevel.EASY);
            this.showDifficultyAttributes(this.easy);
            this.attributesVisible = true;
            this.createStartButton();
        });
        // Change the button textures on hover, press, etc.
        normalButton.setInteractive()
        .on('pointerover', () => {
            normalButton.setTexture('NormalH');
        })
        .on('pointerout', () => {
            normalButton.setTexture('Normal');
        })
        .on('pointerdown', () => {
            normalButton.setTexture('NormalP');
        })
        .on('pointerup', () => {
            normalButton.setTexture('NormalA');
            easyButton.setInteractive().setTexture('Easy');
            normalButton.removeInteractive();
            hardButton.setInteractive().setTexture('Hard');
            this.buttonClickMusic.play();

            //loads the "NORMAL" game stats @see{res/json/difficulty-levels/normal.json}
            Stats.getInstance(DifficultyLevel.NORMAL); 
            this.showDifficultyAttributes(this.normal);
            this.attributesVisible = true;
            this.createStartButton();
        });
        // Change the button textures on hover, press, etc.
        hardButton.setInteractive()
        .on('pointerover', () => {
            hardButton.setTexture('HardH');
        })
        .on('pointerout', () => {
            hardButton.setTexture('Hard');
        })
        .on('pointerdown', () => {
            hardButton.setTexture('HardP');
        })
        .on('pointerup', () => {
            hardButton.setTexture('HardA');
            easyButton.setInteractive().setTexture('Easy');
            normalButton.setInteractive().setTexture('Normal');
            hardButton.removeInteractive();
            this.buttonClickMusic.play();

            //loads the "HARD" game stats @see{res/json/difficulty-levels/hard.json}
            Stats.getInstance(DifficultyLevel.HARD);
            this.showDifficultyAttributes(this.hard);
            this.attributesVisible = true;
            this.createStartButton();
        });
    }

    createStartButton(): void {
        const startButton = this.add.sprite(innerWidth*0.8, innerHeight*0.8, 'Start').setScale(0.5);
        
        // Change the button textures on hover, press, etc.
        startButton.setInteractive()
        .on('pointerover', () => {
            startButton.setTexture('StartH');
        })
        .on('pointerout', () => {
            startButton.setTexture('Start');
        })
        .on('pointerdown', () => {
            startButton.setTexture('StartP');
        })
        .on('pointerup', () => {
            startButton.setTexture('StartH');
            this.scene.setVisible(false);
            this.buttonClickMusic.play();
            this.loadScenes();
        });
    }

    showDifficultyAttributes(difficulty: any): void {
        this.update();
        //load background
        //this.scene.add.image(this.x + 325, this.y + 85, 'progress').setScale(0.45);
        if(this.attributesVisible == false) {
            this.budget = this.add.text(innerWidth*0.75, innerHeight*0.5, `Start Budget: ${difficulty['budget']}`, {
                fontFamily: 'Arial',
                color: '#000000'
            });
            this.income = this.add.text(innerWidth*0.75, innerHeight*0.55, `Income: ${difficulty['income']}`, {
                fontFamily: 'Arial',
                color: '#000000'
            });
            this.interactions = this.add.text(innerWidth*0.75, innerHeight*0.6, `Basic Interaction Rate: ${difficulty['basicInteractionRate']}`, {
                fontFamily: 'Arial',
                color: '#000000'
            });
        } else {
            this.budget.setText(`Start Budget: ${difficulty['budget']}`);
            this.income.setText(`Income: ${difficulty['income']}`);
            this.interactions.setText(`Basic Interaction Rate: ${difficulty['basicInteractionRate']}`);
        }
        
    }

    update(): void {
        if(this.attributesVisible == false) {
            
        }
    }

    loadScenes(): void {
        // Load all scenes for the main game
        this.mainThemeMusic.stop();
        this.scene.add('MainScene', MainScene, true);
        this.scene.add('GuiScene', GuiScene, true);
        this.scene.add('ChartScene', ChartScene, true);
        //this.scene.add('AgentScene', AgentScene, false);
        this.scene.add('MapScene', MapScene, true);
    }
}
