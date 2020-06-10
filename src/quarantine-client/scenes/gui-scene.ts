import { MainScene } from "./main-scene";
import { ItemMenu } from '../menu-elements/menu'
import { ChartScene } from "./chart-scene";
import { UpgradeController } from "../objects/controller/upgradeController";
import { MapScene } from "./map-scene";
import { PopupWindow } from "./popupWindow";
import { LogBook } from "../objects/controller/logBook";
import { TimeController } from "../objects/controller/timeController";
import { Tutorial } from "../objects/controller/tutorial";
import { SkillTreeView } from "./skillTreeView";
import { GameSpeedButtons } from "./gui-elements/speed-buttons";
import { RuleButton } from "./gui-elements/rulesButton";

/** Scene for user interface elements. */
export class GuiScene extends Phaser.Scene {

    private day: Phaser.GameObjects.Text;
    private popUpSprite: Phaser.GameObjects.Sprite;
    private showMoney: Phaser.GameObjects.Text;
    private showCases: Phaser.GameObjects.Text;
    private timeController: TimeController;
    //** variables to save sound in */
    inGameMusic: any;
    buttonClickMusic: any;


    /** Gui scene instance */
    public static instance: GuiScene;

    private menu: ItemMenu;
    public mainSceneIsPaused = false;
    public gameSpeed = 1;
    private soundON = true;
    private musicON = true;

    /** Only existing instance of UpgradeController */
    private uC: UpgradeController;
    /** Whether the upgrade introduceCure was already bought */
    private cureFound = false;

    constructor() {
        super({
            key: "GuiScene",
            active: false
        });
        GuiScene.instance = this;
    }

    preload(): void {
        this.load.pack(
            'preload',
            'assets/guiPack.json',
            'preload'
        );
        //** load audio files */
        this.load.audio("game_theme_music", "assets/sounds/In_Game_Music.mp3");
        this.load.audio("button_click", ["assets/sounds/click-sound.mp3", "assets/sounds/click-sound.ogg"]);

    }


    create(): void {
        //this.createMenuButtons();
        //this.createSettingsButtons();
        this.poseSprites();

        this.uC = UpgradeController.getInstance();

        // Creates Itemmenu and it to this scene
        this.menu = new ItemMenu(this, 0, 750);

        // Creates Skill Tree Button
        this.createSkillTreeBtn();

        //** create sound objects */
        this.inGameMusic = this.sound.add("game_theme_music");
        this.buttonClickMusic = this.sound.add("button_click");

        const musicConfig = {
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.inGameMusic.play(musicConfig);
        this.createLogBookBtn();

        this.createSkillTreeBtn();

        // Creates Reset button
        this.createResetBtn();

        // Creates Sound button for test, delete this function later
        this.createSoundButton();

        // adds pause, slow, normal, quicker and quickest game speed buttons
        new GameSpeedButtons(this).createGameSpeedButtons();
        // adds the rules button which opens the rules sub menu
        new RuleButton(this).createRulesButton();

        Tutorial.getInstance().open(this);
    }

    // -------------------------------------------------------------------------- GAME MENU

    poseSprites(): void {
        /** Position tablet */
        const tablet = this.add.sprite(35, 20, 'tablet').setInteractive();
        tablet.setOrigin(0, 0);
        tablet.scaleX = 0.57;
        tablet.scaleY = 0.7;

 

        const restart = this.add.sprite(3100, 190, 'restart').setInteractive();

        // hover, click event etc.
        restart.on('pointerover', () => {
            restart.setScale(0.7);
        });

        restart.on('pointerout', () => {
            restart.setScale(1);
        });

        restart.on('pointerup', () => {
            //creates popup messages
            const popupMss = new PopupWindow(this, 0, 0, 'note', this.game.renderer.width / 2 + 60, this.game.renderer.height / 2 - 70, true, [new Phaser.GameObjects.Text(this, this.game.renderer.width / 2 - 100, this.game.renderer.height / 2, 'Do you want to restart this game ?', { color: 'Black', fontSize: '14px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })], false);
            //creates confirm button
            const restartOKBtn = new Phaser.GameObjects.Image(this, this.game.renderer.width / 2, this.game.renderer.height / 2 + 50, 'restart-popup');

            //confirm button interactive events
            restartOKBtn.setInteractive();
            //hover, click event etc
            restartOKBtn.on('pointerover', () => {
                restartOKBtn.setTexture('restart-popup-hover');
            });

            restartOKBtn.on('pointerout', () => {
                restartOKBtn.setTexture('restart-popup');
            });

            //do restart the game when btn were clicked
            restartOKBtn.on('pointerup', () => {
                const main = this.scene.get('MainScene') as MainScene;
                const chart = this.scene.get('ChartScene') as ChartScene;
                const map = this.scene.get('MapScene') as MapScene;

                main.scene.restart();
                chart.scene.restart();
                map.scene.restart();

                //close modal
                popupMss.closeModal();
            });

            //add confirm to object container and show the popup
            popupMss.addGameObjects([restartOKBtn]);
            popupMss.createModal();

        });

        const musicOn = this.add.sprite(3100, 310, 'music_on').setInteractive();
        const soundOn = this.add.sprite(3100, 430, 'sound_on').setInteractive();

        musicOn.on('pointerover', () => {
            musicOn.setScale(0.7);
        });

        musicOn.on('pointerout', () => {
            musicOn.setScale(1);
        });

        soundOn.on('pointerover', () => {
            soundOn.setScale(0.7);
        });

        soundOn.on('pointerout', () => {
            soundOn.setScale(1);
        });

        musicOn.on('pointerup', () => {
            if (this.musicON) {
                // method to turn off music should be here

                // changes img and reset musicON atribute
                musicOn.setTexture('music_off');
                this.musicON = false;
            } else {
                // method to turn on music should be here

                // changes img and reset musicON atribute
                musicOn.setTexture('music_on');
                this.musicON = true;
            }
        });

        soundOn.on('pointerup', () => {
            if (this.soundON) {
                // method to turn off sound should be here

                // changes img and reset soundON atribute
                soundOn.setTexture('sound_off');
                this.soundON = false;
            } else {
                // method to turn on sound should be here

                // changes img and reset soundON atribute
                soundOn.setTexture('sound_on');
                this.soundON = true;
            }
        });
    }

    // Handles the visibility of the buttons
    addOnListenerButton(button, buttonsToShow, buttonsToHide): void {
        button.on('pointerup', () => {
            buttonsToShow.forEach(element => {
                element.visible = true;
            });
            buttonsToHide.forEach(element => {
                element.visible = false;
            });
            this.buttonClickMusic.play();
        });
    }

    // Sets to the default value (only menu button is to be seen)
    setDefaultVisibility(sprites): void {
        for (let i = 0; i < sprites.length; i++) {
            if (i === 0) {
                sprites[i].visible = true;
            } else {
                sprites[i].visible = false;
            }
        }
    }

    // Represents sprites on a smaller scale
    setSpriteScale(sprites, scale): void {
        sprites.forEach(element => {
            element.setScale(scale);
        });
    }

    // Writes 'clicked' if the button was clicked
    addOnListenerSubButton(button): void {
        button.on('pointerup', () => {
            //console.log("Clicked");
            this.buttonClickMusic.play();
        })
    }

    // Changes the color of the button from white to black, if the button is hovered over
    addOverOutListener(defaultButton, inverseButton): void {
        defaultButton.on('pointerover', () => {
            defaultButton.visible = false;
            inverseButton.visible = true;
        });
        inverseButton.on('pointerout', () => {
            defaultButton.visible = true;
            inverseButton.visible = false;
        });
    }

    // Sets the sprites to visible
    setToVisible(sprites): void {
        sprites.forEach(element => {
            element.visible = true;
        });
    }

    /*---------START: Skill-Tree button ---------- */
    createSkillTreeBtn(): void {
        const yourSkills = this.add.sprite(1850, 550, 'your_skills').setInteractive()
            .on('pointerover', () => {
                yourSkills.setScale(0.6);
            })
            .on('pointerout', () => {
                yourSkills.setScale(0.5);
            })
            .on('pointerdown', () => {
                yourSkills.setScale(0.5);
            })
            .on('pointerup', () => {
                yourSkills.setScale(0.6);
                const skillTree = new SkillTreeView(this);
                skillTree.createModal();
            }).setScale(0.5);
    }

    /*---------START: Reset button  ---------- */
    createResetBtn(): void {
        const resetBtn = this.add.image(this.game.renderer.width - 100, 150, 'restart');
        resetBtn.setInteractive();

        // hover, click event etc.
        resetBtn.on('pointerover', () => {
            resetBtn.setScale(0.7);
        });

        resetBtn.on('pointerout', () => {
            resetBtn.setScale(1);
        });

        resetBtn.on('pointerup', () => {
            //creates popup messages
            const popupMss = new PopupWindow(this, 0, 0, 'note', this.game.renderer.width / 2 + 60, this.game.renderer.height / 2 - 70, true, [new Phaser.GameObjects.Text(this, this.game.renderer.width / 2 - 100, this.game.renderer.height / 2, 'Do you want to restart this game ?', { color: 'Black', fontSize: '14px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })], false);
            //creates confirm button
            const restartOKBtn = new Phaser.GameObjects.Image(this, this.game.renderer.width / 2, this.game.renderer.height / 2 + 50, 'restart-popup');

            //confirm button interactive events
            restartOKBtn.setInteractive();
            //hover, click event etc
            restartOKBtn.on('pointerover', () => {
                restartOKBtn.setTexture('restart-popup-hover');
            });

            restartOKBtn.on('pointerout', () => {
                restartOKBtn.setTexture('restart-popup');
            });

            //do restart the game when btn were clicked
            restartOKBtn.on('pointerup', () => {
                const main = this.scene.get('MainScene') as MainScene;
                const chart = this.scene.get('ChartScene') as ChartScene;
                const map = this.scene.get('MapScene') as MapScene;

                main.scene.restart();
                chart.scene.restart();
                map.scene.restart();

                //close modal
                popupMss.closeModal();
                this.buttonClickMusic.play();
            });

            //add confirm to object container and show the popup
            popupMss.addGameObjects([restartOKBtn]);
            popupMss.createModal();
            this.buttonClickMusic.play();

        });
    }
    /*---------END: Reset button  ---------- */

    /**
       * Insert a log book into the gui scene. When clicked, a specific
       * sub menu opens.
       */
    private createLogBookBtn(): void {
        const lbBtn = this.add.image(1000, 90, 'log').setOrigin(0);
        lbBtn.scale = 0.6;
        lbBtn.angle = 1;
        lbBtn.setInteractive();

        // hover effect
        lbBtn.on('pointerover', () => { lbBtn.scale = 0.65; });
        lbBtn.on('pointerout', () => { lbBtn.scale = 0.6; });

        lbBtn.on('pointerup', () => {
            LogBook.getInstance().open(this); // open log book sub scene
            this.buttonClickMusic.play();
        });
    }

    /*---------START: Sound button  ---------- */
    createSoundButton(): void {
        const musicOn = this.add.sprite(this.game.renderer.width - 100, 250, 'music_on').setInteractive();
        const soundOn = this.add.sprite(this.game.renderer.width - 100, 350, 'sound_on').setInteractive();

        musicOn.on('pointerover', () => {
            musicOn.setScale(0.7);
        });

        musicOn.on('pointerout', () => {
            musicOn.setScale(1);
        });

        soundOn.on('pointerover', () => {
            soundOn.setScale(0.7);
        });

        soundOn.on('pointerout', () => {
            soundOn.setScale(1);
        });

        musicOn.on('pointerup', () => {
            if (this.musicON) {
                // method to turn off music should be here
                this.inGameMusic.setMute(true);
                // changes img and reset musicON atribute
                musicOn.setTexture('music_off');
                this.musicON = false;
            } else {
                // method to turn on music should be here
                this.inGameMusic.setMute(false);
                // changes img and reset musicON atribute
                musicOn.setTexture('music_on');
                this.musicON = true;
            }
        });

        soundOn.on('pointerup', () => {
            if (this.soundON) {
                // method to turn off sound should be here
                this.buttonClickMusic.setMute(true);
                // changes img and reset soundON atribute
                soundOn.setTexture('sound_off');
                this.soundON = false;
            } else {
                // method to turn on sound should be here
                this.buttonClickMusic.setMute(false);
                // changes img and reset soundON atribute
                soundOn.setTexture('sound_on');
                this.soundON = true;
            }
        });
    }
    /*---------END: Sound button  ---------- */

    update(): void {
        if (!this.mainSceneIsPaused) this.menu.updateItemMenu(); // has to be invoked each tic/ ingame hour TODO
    }
}
