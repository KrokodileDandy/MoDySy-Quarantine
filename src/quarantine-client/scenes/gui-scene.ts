import { ItemMenu } from '../menu-elements/menu'
import { UpgradeController } from "../objects/controller/upgradeController";
import { Tutorial } from "../objects/controller/tutorial";
import { GameSpeedButtons } from "./gui-elements/speed-buttons";
import { RuleButton } from "./gui-elements/rulesButton";
import { RestartButton } from "./gui-elements/restartButton";
import { SkillTreeButton } from "./gui-elements/skillTreeButton";
import { LogBookButton } from './gui-elements/logBookButton';

/** Scene for user interface elements. */
export class GuiScene extends Phaser.Scene {

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
        this.poseSprites();

        this.uC = UpgradeController.getInstance();

        // Creates Itemmenu and it to this scene
        this.menu = new ItemMenu(this, 0, 750);

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

        // Creates Sound button for test, delete this function later
        this.createSoundButton();

        // ------------------------------------------------------------------- GUI ELEMENTS
        // adds pause, slow, normal, quicker and quickest game speed buttons
        new GameSpeedButtons(this).create();
        // adds the rules button which opens the rules sub menu
        new RuleButton(this).create();
        // add the restart button
        new RestartButton(this).create();
        // add the skill tree button
        new SkillTreeButton(this).create();
        // add the log book button
        new LogBookButton(this).create();

        Tutorial.getInstance().open(this);
    }

    // -------------------------------------------------------------------------- GAME MENU

    poseSprites(): void {
        /** Position tablet */
        const tablet = this.add.sprite(35, 20, 'tablet').setInteractive();
        tablet.setOrigin(0, 0);
        tablet.scaleX = 0.57;
        tablet.scaleY = 0.7;
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
