import { MainScene } from "./main-scene";
import { ItemMenu } from '../menu-elements/menu'
import { ChartScene } from "./chart-scene";
import { UpgradeController } from "../objects/controller/upgradeController";
import { MapScene } from "./map-scene";
import { PopupWindow } from "./popupWindow";
import { Controller } from "../objects/controller/controller";
import { State } from "../util/enums/healthStates";
import { Rule } from "../objects/entities/rule";

/** Scene for user interface elements. */
export class GuiScene extends Phaser.Scene {

  private day: Phaser.GameObjects.Text;
  private popUpSprite: Phaser.GameObjects.Sprite;
  private showMoney: Phaser.GameObjects.Text;
  private showCases: Phaser.GameObjects.Text;

  /** Gui scene instance */
  public static instance: GuiScene;

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
    GuiScene.instance = this;
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

    // Creates Itemmenu and it to this scene
    this.menu = new ItemMenu(this, 0, 750);

    // Creates Rules button
    this.createRulesBtn();

    // Creates Reset button
    this.createResetBtn();

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
    const notebook = this.add.sprite(750, 1400, 'notebook').setInteractive();
    const tablet = this.add.sprite(750, 350, 'tablet').setInteractive();

    const researchButton = this.add.sprite(400, 925, 'flask-button').setInteractive();
    const lockdownButton = this.add.sprite(400, 1105, 'lockdown-button').setInteractive();
    const policeButton = this.add.sprite(400, 1280, 'police-button').setInteractive();
    const doctorButton = this.add.sprite(400, 1460, 'doctor-button').setInteractive();

    const pinkNote = this.add.sprite(1000, 1400, 'note-pink').setInteractive();
    const noteOrange = this.add.sprite(1020, 1020, 'note').setInteractive();

    const per = this.add.sprite(700, 880, 'progress').setInteractive();
    const money = this.add.sprite(700, 970, 'money').setInteractive();

    const calendar = this.add.sprite(700, 1100, 'calendar').setInteractive();
    const person = this.add.sprite(700, 1240, 'man').setInteractive();
    const plusButton = this.add.sprite(780, 1215, 'plus').setInteractive();
    const minusButton = this.add.sprite(780, 1265, 'minus').setInteractive();
    const money1 = this.add.sprite(700, 1320, 'money').setInteractive();

    const person1 = this.add.sprite(700, 1400, 'man').setInteractive();
    const plusButton1 = this.add.sprite(780, 1375, 'plus').setInteractive();
    const minusButton1 = this.add.sprite(780, 1425, 'minus').setInteractive();
    const money2 = this.add.sprite(700, 1480, 'money').setInteractive();

    const money3 = this.add.sprite(1100, 1280, 'money').setInteractive();

    const news = this.add.sprite(2300, 1250, 'news').setInteractive();
    const logBook = this.add.sprite(1950, 400, 'log').setInteractive();
    const grayBackground = this.add.sprite(2650, 400, 'gray-background').setInteractive();

    const letter = this.add.sprite(3100, 850, 'letter').setInteractive();
    const yourSkills = this.add.sprite(3100, 1075, 'your_skills').setInteractive();
    const rules = this.add.sprite(3100, 1300, 'rules').setInteractive();

    const info = this.add.sprite(3100, 70, 'information').setInteractive();
    const restart = this.add.sprite(3100, 190, 'restart').setInteractive();
    const musicOn = this.add.sprite(3100, 310, 'music_on').setInteractive();
    const soundOn = this.add.sprite(3100, 430, 'sound_on').setInteractive();

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

  /*---------START: Rules button ---------- */
  createRulesBtn(): void {
    const rulesBtn = this.add.image(this.game.renderer.width - 100, this.game.renderer.height -250, 'rules').setDepth(1);
    const popupRules = new PopupWindow(this, 0, 0, 'background', 1300, 130, true, [new Phaser.GameObjects.Text(this, 550, 130, 'The Rules',{color:'Black', fontSize: '50px',fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})],false);

    /*---------START: add Rules ---------- */
    const allRules = Controller.getInstance().getRules();
    let ruleIndex = 0;

    allRules.forEach(r => {
      this.addRuleToContainer(popupRules, r, ruleIndex);
      ruleIndex++;
    });
    /*---------END: add Rules ---------- */

    // popup info as a seconde popup
    const info = new Phaser.GameObjects.Image(this, 800, 150, 'information');
    info.setInteractive();

    info.on('pointerup', () => {
      const popupTitle = 'The Information';
      const popupStr = 'The Agents exchange their state when they are close together';
      const popupInfo = new PopupWindow(this, 0, 0, 'background', 1300, 130, true, [new Phaser.GameObjects.Text(this, 550, 130, popupTitle,{color:'Black', fontSize: '50px',fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})],true);

      popupInfo.add(new Phaser.GameObjects.Text(this,550, 220 , popupStr, {color:'Black', fontSize: '30px',fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'} ));

      popupInfo.createModal();
    });
    //add popup Info into popup Rules.
    popupRules.add(info);

    rulesBtn.setInteractive();

    // Change the button textures on hover, press, etc.
    rulesBtn.on('pointerover', () => {
      rulesBtn.setTexture('rules-hover');
    });
    rulesBtn.on('pointerout', () => {
      rulesBtn.setTexture('rules');
    });
    rulesBtn.on('pointerdown', () => {
      rulesBtn.setTexture('rules');
    });
    rulesBtn.on('pointerup', () => {
      rulesBtn.setTexture('rules_on_click');
      popupRules.createModal();
    });
  }

  addRuleToContainer(container: Phaser.GameObjects.Container, rule: Rule, ruleIndex: number): void {
    const x = 550;
    const y = 200 + ruleIndex * 170;
    const pos1 = new Phaser.GameObjects.Image(this, x, y, this.getTextures(rule.inputState1)).setOrigin(0);
    container.add(pos1);

    const pos2 = new Phaser.GameObjects.Image(this, x + 200, y, this.getTextures(rule.inputState2)).setOrigin(0);
    container.add(pos2);

    const pos3 = new Phaser.GameObjects.Image(this, x + 420, y, this.getTextures(rule.outputState1)).setOrigin(0);
    container.add(pos3);

    const pos4 = new Phaser.GameObjects.Image(this, x + 620, y, this.getTextures(rule.outputState2)).setOrigin(0);
    container.add(pos4);

    const arrow = new Phaser.GameObjects.Image(this, x + 340, y + 30, 'pprules-arrow').setOrigin(0);
    container.add(arrow);

  }

  getTextures(str: string): string {
    switch (str) {
      case State.HEALTHY:
        return 'healthy';

      case State.INFECTED:
        return 'infected';

      case State.UNKNOWINGLY_INFECTED:
        return 'unknowingly-infected';

      case State.CURE:
        return 'cure';

      case State.DECEASED:
        return 'deceased';

      case State.IMMUNE:
        return 'immune';

      case State.TEST_KIT:
        return 'test-kit';
    }

  }
  /*---------END: Rules button  ---------- */

  /*---------START: Reset button  ---------- */
  createResetBtn(): void {
    const resetBtn = this.add.image(this.game.renderer.width - 100, 60, 'restart').setOrigin(0);
    resetBtn.setInteractive();

    // hover, click event etc.
    resetBtn.on('pointerover', () => {
      resetBtn.setTexture('restart-hover');
    });

    resetBtn.on('pointerout', () => {
      resetBtn.setTexture('restart');
    });

    resetBtn.on('pointerup', () => {
      //creates popup messages
      const popupMss = new PopupWindow(this, 0, 0, 'note', this.game.renderer.width / 2 + 60, this.game.renderer.height / 2 - 70, true, [new Phaser.GameObjects.Text(this, this.game.renderer.width / 2 - 100, this.game.renderer.height / 2, 'Do you want to restart this game ?',{color:'Black', fontSize: '14px',fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})],false);
      //creates confirm button
      const restartOKBtn = new Phaser.GameObjects.Image(this,this.game.renderer.width / 2, this.game.renderer.height / 2 + 50, 'restart-popup');
      
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
  }
  /*---------END: Reset button  ---------- */

  update(): void {
    if (!this.mainSceneIsPaused) this.menu.updateItemMenu(); // has to be invoked each tic/ ingame hour TODO
  }
}
