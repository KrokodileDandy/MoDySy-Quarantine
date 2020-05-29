import { MainScene } from "./main-scene";
import { ItemMenu } from '../menu-elements/menu'
import { ChartScene } from "./chart-scene";
import { UpgradeController } from "../objects/controller/upgradeController";
import { MapScene } from "./map-scene";
import { TimeController } from "../objects/controller/timeController";
import { PopupWindow } from "./popupWindow";

/** Scene for user interface elements. */
export class GuiScene extends Phaser.Scene {

  private day: Phaser.GameObjects.Text;
  private popUpSprite: Phaser.GameObjects.Sprite;
  private showMoney: Phaser.GameObjects.Text;
  private showCases: Phaser.GameObjects.Text;
  private timeController: TimeController;



  private menu: ItemMenu;
  private mainSceneIsPaused = false;
  /** Only existing instance of UpgradeController */
  private uC: UpgradeController;
  /** Whether the upgrade introduceCure was already bought */
  private cureFound = false;

  constructor() {
    super({
      key: "GuiScene",
      active: false
    });
  }

  preload(): void {
    this.load.pack(
      'preload',
      'assets/guiPack.json',
      'preload'
    );
  }


  create(): void {
    //this.createMenuButtons();
    //this.createSettingsButtons();
    this.poseSprites();

    this.uC = UpgradeController.getInstance();
    this.timeController = TimeController.getInstance()

    // Creates Itemmenu and it to this scene
    this.menu = new ItemMenu(this, 0, 750);
    //this.add.image(1300, 400, 'background');


  }

  // -------------------------------------------------------------------------- GAME MENU
  createPauseButton(reset, resume): void {
    const main = this.scene.get('MainScene') as MainScene;
    const chart = this.scene.get('ChartScene') as ChartScene;
    const map = this.scene.get('MapScene') as MapScene;
    main.scene.pause();
    chart.scene.pause();
    map.scene.pause();
    this.mainSceneIsPaused = true;


    //when the button 'reset' is pressed, restart the main scene, the chart scene and reset the gui scene
    reset.on('pointerup', () => {
      //only restart the game if it is paused to avoid accidentally clicking on the invisible button
      if (this.mainSceneIsPaused) {
        main.scene.restart();
        chart.scene.restart();
        map.scene.restart();
        this.mainSceneIsPaused = false;
      }
    });

    //resume the game only if the scenes are already paused
    resume.on('pointerup', () => {
      if (this.mainSceneIsPaused) {
        main.scene.resume();
        chart.scene.resume();
        map.scene.resume();
        this.mainSceneIsPaused = false;
      }
    });
  }
  poseSprites(): void {
    const notebook = this.add.sprite(550, 1300, 'notebook').setInteractive();
    const tablet = this.add.sprite(750, 350, 'tablet').setInteractive();

    const researchButton = this.add.sprite(200, 825, 'flask-button').setInteractive();
    const lockdownButton = this.add.sprite(200, 1005, 'lockdown-button').setInteractive();
    const policeButton = this.add.sprite(200, 1180, 'police-button').setInteractive();
    const doctorButton = this.add.sprite(200, 1360, 'doctor-button').setInteractive();

    const pinkNote = this.add.sprite(800, 1300, 'note-pink').setInteractive();
    const noteOrange = this.add.sprite(820, 920, 'note').setInteractive();

    const per = this.add.sprite(500, 780, '25percent').setInteractive();
    const money = this.add.sprite(500, 870, 'money').setInteractive();



    const calendar = this.add.sprite(500, 1000, 'calendar').setInteractive();
    const person = this.add.sprite(500, 1140, 'man').setInteractive();
    const plusButton = this.add.sprite(580, 1115, 'plus').setInteractive();
    const minusButton = this.add.sprite(580, 1165, 'minus').setInteractive();
    const money1 = this.add.sprite(500, 1220, 'money').setInteractive();

    const person1 = this.add.sprite(500, 1300, 'man').setInteractive();
    const plusButton1 = this.add.sprite(580, 1275, 'plus').setInteractive();
    const minusButton1 = this.add.sprite(580, 1325, 'minus').setInteractive();
    const money2 = this.add.sprite(500, 1380, 'money').setInteractive();

    const money3 = this.add.sprite(900, 1180, 'money').setInteractive();

    const news = this.add.sprite(1800, 1150, 'news').setInteractive();
    const logBook = this.add.sprite(1800, 400, 'log').setInteractive();
    const grayBackground = this.add.sprite(2350, 400, 'gray-background').setInteractive();

    const letter = this.add.sprite(2750, 850, 'letter').setInteractive();
    const yourSkills = this.add.sprite(2750, 1075, 'your_skills').setInteractive();
    const rules = this.add.sprite(2750, 1300, 'rules').setInteractive();

    const info = this.add.sprite(2750, 70, 'information').setInteractive();
    const restart = this.add.sprite(2750, 190, 'restart').setInteractive();
    const music_on = this.add.sprite(2750, 310, 'music_on').setInteractive();
    const sound_on = this.add.sprite(2750, 430, 'sound_on').setInteractive();

    const pause = this.add.sprite(1600, 50, 'pause').setInteractive();
    const resume = this.add.sprite(1700, 50, 'resume-button').setInteractive();
    const speed1x = this.add.sprite(1800, 50, 'speed1x').setInteractive();
    const speed2x = this.add.sprite(1900, 50, 'speed2x').setInteractive();
    const speed3x = this.add.sprite(2000, 50, 'speed3x').setInteractive();

  }
  // Creates menu buttons
  createMenuButtons(): void {
    // Create and set the buttons to the right positions
    const menuWhite = this.add.sprite(1000, 570, 'menu-white').setInteractive();
    const menuBlack = this.add.sprite(1000, 570, 'menu-black').setInteractive();

    const stateWhite = this.add.sprite(1000, 620, 'statemeasure-white').setInteractive();
    const stateBlack = this.add.sprite(1000, 620, 'statemeasure-black').setInteractive();

    const investmentWhite = this.add.sprite(1000, 670, 'investment-white').setInteractive();
    const investmentBlack = this.add.sprite(1000, 670, 'investment-black').setInteractive();

    const lockdownWhite = this.add.sprite(875, 620, 'lockdown-white').setInteractive();
    const lockdownBlack = this.add.sprite(875, 620, 'lockdown-black').setInteractive();

    const socialdistancingWhite = this.add.sprite(750, 620, 'socialdistancing-white').setInteractive();
    const socialdistancingBlack = this.add.sprite(750, 620, 'socialdistancing-black').setInteractive().on('pointerdown', () => {
      this.uC.buyHealthWorkers(this.uC);
    });

    const policeWhite = this.add.sprite(875, 670, 'police-white').setInteractive();
    const policeBlack = this.add.sprite(875, 670, 'police-black').setInteractive().on('pointerdown', () => {
      this.uC.buyPoliceOfficers(this.uC);
    });

    const researchWhite = this.add.sprite(750, 670, 'research-white').setInteractive();
    const researchBlack = this.add.sprite(750, 670, 'research-black').setInteractive().on('pointerdown', () => {
      // can be left here as a test, because this menu will probably be removed later
      const modal = new PopupWindow(this, 0, 0, 'log-background', 530, 130, [new Phaser.GameObjects.Text(this, 700, 300, 'hello from gui',{color:'red', fontSize: '50px'})]);
      modal.createModal();
    });

    // Create a list of all measures, taking in consideration both of the colors
    const sprites = [menuWhite, menuBlack, stateWhite, stateBlack, investmentWhite, investmentBlack, lockdownWhite, lockdownBlack, socialdistancingWhite, socialdistancingBlack, policeWhite, policeBlack, researchWhite, researchBlack];
    // Create a list of state measures of white (default) color -> subbuttons
    const stateMeasures = [lockdownWhite, socialdistancingWhite];
    // Create a list of investment measures of white (default) color -> subbuttons
    const investmentMeasures = [policeWhite, researchWhite];
    // Create a list of all of the measures in black (ready to be clicked)
    const measures = [lockdownBlack, socialdistancingBlack, policeBlack, researchBlack];

    // Represent sprites on a smaller scale
    this.setSpriteScale(sprites, .4);

    // Set default visibility (only the menu button can be seen)
    this.setDefaultVisibility(sprites);

    // Change the color of the button from white to black if it is hovered over
    for (let i = 0; i < sprites.length; i = i + 2) {
      this.addOverOutListener(sprites[i], sprites[i + 1]);
    }

    let menuIsPressed = false;

    // Handle the visibility of the measure buttons
    menuBlack.on('pointerup', () => {
      // Check, whether menu button is already pressed
      if (menuIsPressed) {
        // Return to the default visibility: hide each button except for menu
        this.setDefaultVisibility(sprites);
        // Return to the default (false) value
        menuIsPressed = false;
      } else {
        // Show available measures
        stateWhite.visible = true;
        investmentWhite.visible = true;
        // Set value to 'pressed'
        menuIsPressed = true;
      }
    });

    // Handle the visibility of the subbuttons
    this.addOnListenerButton(stateBlack, stateMeasures, investmentMeasures);
    this.addOnListenerButton(investmentBlack, investmentMeasures, stateMeasures);

    // Prove that the subbuton was clicked
    measures.forEach(element => {
      this.addOnListenerSubButton(element);
    });

  }

  // create settings buttons
  createSettingsButtons(): void {
    // Create and set the buttons to the right positions
    const settingsWhite = this.add.sprite(1125, 570, 'settings-white').setInteractive();
    const settingsBlack = this.add.sprite(1125, 570, 'settings-black').setInteractive();

    const pauseWhite = this.add.sprite(1125, 620, 'pause-white').setInteractive();
    const pauseBlack = this.add.sprite(1125, 620, 'pause-black').setInteractive();

    const resetWhite = this.add.sprite(1250, 620, 'reset-white').setInteractive();
    const resetBlack = this.add.sprite(1250, 620, 'reset-black').setInteractive();

    const resumeWhite = this.add.sprite(1375, 620, 'resume-white').setInteractive();
    const resumeBlack = this.add.sprite(1375, 620, 'resume-black').setInteractive();

    const gamespeedWhite = this.add.sprite(1125, 670, 'gamespeed-white').setInteractive();
    const gamespeedBlack = this.add.sprite(1125, 670, 'gamespeed-black').setInteractive();

    const fasterWhite = this.add.sprite(1250, 670, 'faster-white').setInteractive();
    const fasterBlack = this.add.sprite(1250, 670, 'faster-black').setInteractive();

    const slowerWhite = this.add.sprite(1375, 670, 'slower-white').setInteractive();
    const slowerBlack = this.add.sprite(1375, 670, 'slower-black').setInteractive();

    // Create a list with all of the settings buttons
    const sprites = [settingsWhite, settingsBlack, pauseWhite, pauseBlack, resetWhite, resetBlack, resumeWhite, resumeBlack, gamespeedWhite, gamespeedBlack, slowerWhite, slowerBlack, fasterWhite, fasterBlack];

    // Create a list of buttons that are to appear when 'settings' is clicked
    const defaultButtons = [pauseWhite, gamespeedWhite];

    // Create a list of buttons that are to appear when 'pause' is clicked
    const pauseButtons = [resetWhite, resumeWhite];

    // Create a list of buttons that are to appear when 'game speed' is clicked
    const speedButtons = [fasterWhite, slowerWhite];

    // Create a list of buttons that are responsible for changing the speed of the game
    const speedSubbuttons = [fasterBlack, slowerBlack];

    // Represent sprites on a smaller scale
    this.setSpriteScale(sprites, .325);

    // Set default visibility (only the menu button can be seen)
    this.setDefaultVisibility(sprites);

    // Change the color of the button from white to black if it is hovered over
    for (let i = 0; i < sprites.length; i = i + 2) {
      this.addOverOutListener(sprites[i], sprites[i + 1]);
    }

    let settingsIsPressed = false;

    settingsBlack.on('pointerup', () => {
      // Check whether 'settings' has been already clicked
      if (settingsIsPressed) {
        // Hide every button except for 'settings'
        this.setDefaultVisibility(sprites);
        // Set 'settings' to not pressed
        settingsIsPressed = false;
      } else {
        // Show available settings
        this.setToVisible(defaultButtons);
        // Set 'settings' to pressed
        settingsIsPressed = true;
      }
    });

    // Pause the game when 'pause' was clicked
    pauseBlack.on('pointerup', () => {
      this.createPauseButton(resetBlack, resumeBlack);
    });

    // Handle the visibility of the subbuttons
    this.addOnListenerButton(pauseBlack, pauseButtons, speedButtons);
    this.addOnListenerButton(gamespeedBlack, speedButtons, pauseButtons);

    // Write 'clicked' if one of the speed buttons was pressed
    speedSubbuttons.forEach(element => {
      this.addOnListenerSubButton(element);
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
    })
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

  /** function that creates daily report */
  createPopUp(day: number, money: number, cases: number): void {

    this.popUpSprite = this.add.sprite(500, 650, 'popup-box');
    this.popUpSprite.displayWidth = 250;
    this.popUpSprite.displayHeight = 150;
    this.day = this.add.text(450, 590, `Day ${day}`, { fill: '#000000', font: '20px Arial' });
    this.showMoney = this.add.text(400, 640, `money = ${money}`, { fill: '#000000' });
    this.showCases = this.add.text(400, 690, `cases = ${cases}`, { fill: '#000000' });
    this.time.addEvent({ delay: 1000, callback: this.destroyPopUp, callbackScope: this });
  }

  /** TODO please add documentation */
  destroyPopUp(): void {
    if (this.showMoney || this.showCases || this.day) {
      this.showMoney.destroy();
      this.showCases.destroy();
      this.day.destroy();
      this.popUpSprite.destroy();
    }
  }


  update(): void {
    if (!this.mainSceneIsPaused) this.menu.updateItemMenu(); // has to be invoked each tic/ ingame hour TODO
  }
}
