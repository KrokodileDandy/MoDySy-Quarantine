import { ItemMenu } from '../item-menu/menu'
import { Tutorial } from "../../controller/gui-controller/tutorial";
import { GameSpeedButtons } from "../general-gui-buttons/speedButtons";
import { RuleButton } from "../general-gui-buttons/rulesButton";
import { RestartButton } from "../general-gui-buttons/restartButton";
import { SkillTreeButton } from "../skill-tree/skillTreeButton";
import { LogBookButton } from '../log-book/logBookButton';
import { SoundButtons } from '../general-gui-buttons/soundButtons';
import { StatusBar } from '../status-bar/statusBar';
import { Tablet } from '../tablet/tablet';

/** Scene for user interface elements. */
export class GuiScene extends Phaser.Scene {

    //** variables to save sound in */
    public inGameMusic: Phaser.Sound.BaseSound;
    public buttonClickMusic: Phaser.Sound.BaseSound;
    public itemBoughtSound: Phaser.Sound.BaseSound;

    /** Gui scene instance */
    public static instance: GuiScene;

    private menu: ItemMenu;
    private statusBar: StatusBar;
    public mainSceneIsPaused = false;
    public gameSpeed = 1;
    public soundON = true;
    public musicON = true;

    private buttons: Phaser.GameObjects.Sprite[];
    private backgroundImgs: Phaser.GameObjects.Sprite[];

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

        this.load.plugin('tooltipPlugin', 'Phasetips.js');

        //** load audio files */
        this.load.audio("game_theme_music", "assets/sounds/In_Game_Music.mp3");
        this.load.audio("button_click", ["assets/sounds/click-sound.mp3", "assets/sounds/click-sound.ogg"]);
        this.load.audio("buy_sound", "assets/sounds/cash-register.mp3");
    }

    create(): void {
        // Creates Itemmenu and it to this scene
        this.menu = new ItemMenu(this, 0, 750);

        //** create sound objects */
        this.inGameMusic = this.sound.add("game_theme_music");
        this.buttonClickMusic = this.sound.add("button_click");
        this.itemBoughtSound = this.sound.add("buy_sound");
        

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

        // ------------------------------------------------------------------- GUI ELEMENTS
        // adds pause, slow, normal, quicker and quickest game speed buttons
        const arr = [];
        new GameSpeedButtons(this).create().forEach(b =>{
            arr.push(b);
        });
        // adds the rules button which opens the rules sub menu
        arr.push(new RuleButton(this).create());
        // add the restart button
        arr.push(new RestartButton(this).create());
        // add the skill tree button
        arr.push(new SkillTreeButton(this).create());
        // add the log book button
        arr.push(new LogBookButton(this).create());
        // add the sound buttons
        new SoundButtons(this).create().forEach(b => {
            arr.push(b);
        });
        // add the tablet
        arr.push(new Tablet(this).create());
        // add the status bar
        this.statusBar = new StatusBar(this);
        this.statusBar.create();

        this.setButtons(arr);
        this.addBackground();
        this.showBtns();

        Tutorial.getInstance().open(this);
    }

    update(): void {
        if (!this.mainSceneIsPaused) this.menu.updateItemMenu(); // has to be invoked each tic/ ingame hour TODO
        if (!this.mainSceneIsPaused) this.statusBar.update();
    }

    //-----Hide/show the buttons while pause/resume
    public showBtns(): void {
        this.buttons.forEach(b => {
            b.setVisible(true);
        });
        this.backgroundImgs.forEach(i =>{
            i.setVisible(false);
        });
    }

    public hideBtns(): void {
        this.buttons.forEach(b => {
            b.setVisible(false);
        });
        this.backgroundImgs.forEach(i =>{
            i.setVisible(true);
        });
    }

    private setButtons(btns: Phaser.GameObjects.Sprite[]): void {
        this.buttons = btns;
    }

    private setBackgroundImgs(imgs: Phaser.GameObjects.Sprite[]): void {
        this.backgroundImgs = imgs;
    }

    private addBackground(): void {
        const arr = [];
        arr.push(this.add.sprite(this.game.renderer.width / 2 + 150, 50, 'pause'));
        arr.push(this.add.sprite(this.game.renderer.width / 2 + 250, 50, 'resume-button'));
        arr.push(this.add.sprite(this.game.renderer.width / 2 + 350, 50, 'speed1x'));
        arr.push(this.add.sprite(this.game.renderer.width / 2 + 450, 50, 'speed2x'));
        arr.push(this.add.sprite(this.game.renderer.width / 2 + 550, 50, 'speed3x'));
        arr.push(this.add.sprite(this.game.renderer.width - 100, this.game.renderer.height - 250, 'rules'));
        arr.push(this.add.sprite(this.game.renderer.width - 100, 150, 'restart'));
        arr.push(this.add.sprite(1850, 550, 'your_skills'));
        arr.push(this.add.sprite(1000, 90, 'log').setOrigin(0));
        arr.push(this.add.sprite(this.game.renderer.width - 100, 250, 'music_on'));
        arr.push(this.add.sprite(this.game.renderer.width - 100, 350, 'sound_on'));

        this.setBackgroundImgs(arr);
    }
}
