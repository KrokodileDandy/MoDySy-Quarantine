import {MainScene} from "./main-scene";
import { ItemMenu } from '../menu-elements/menu'
import { ChartScene } from "./chart-scene";

/** Scene for user interface elements. */
export class GuiScene extends Phaser.Scene {

  private menu: ItemMenu;
  private mainSceneIsPaused = false;

    constructor() {
        super({
            key: "GuiScene",
            active: true
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
        this.createMenuButtons();
        this.createSettingsButtons();

        // Creates Itemmenu and it to this scene
        this.menu = new ItemMenu(this, 0, 610);
    }

    createPauseButton(reset, resume): void{
      const main = this.scene.get('MainScene') as MainScene;
      const chart = this.scene.get('ChartScene') as ChartScene;
      main.scene.pause();
      chart.scene.pause();
      this.mainSceneIsPaused = true;
      

      //when the button 'reset' is pressed, restart the main scene, the chart scene and reset the gui scene
      reset.on('pointerup', ()=> {
        //only restart the game if it is paused to avoid accidentally clicking on the invisible button
        if(this.mainSceneIsPaused){
          main.scene.restart();
          chart.scene.restart();
          this.mainSceneIsPaused = false;
        }
      });

      //resume the game only if the scenes are already paused
      resume.on('pointerup', ()=> {
        if(this.mainSceneIsPaused){
          main.scene.resume();
          chart.scene.resume();
          this.mainSceneIsPaused = true;
      }});
    }

    // Creates menu buttons
    createMenuButtons(): void{
      // Create and set the buttons to the right positions
      const menuWhite = this.add.sprite(1000, 70, 'menu-white').setInteractive();
      const menuBlack = this.add.sprite(1000, 70, 'menu-black').setInteractive();

      const stateWhite = this.add.sprite(1000, 120, 'statemeasure-white').setInteractive();
      const stateBlack = this.add.sprite(1000, 120, 'statemeasure-black').setInteractive();

      const investmentWhite = this.add.sprite(1000, 170, 'investment-white').setInteractive();
      const investmentBlack = this.add.sprite(1000, 170, 'investment-black').setInteractive();

      const lockdownWhite = this.add.sprite(875, 120, 'lockdown-white').setInteractive();
      const lockdownBlack = this.add.sprite(875, 120, 'lockdown-black').setInteractive();

      const socialdistancingWhite = this.add.sprite(750, 120, 'socialdistancing-white').setInteractive();
      const socialdistancingBlack = this.add.sprite(750, 120, 'socialdistancing-black').setInteractive();

      const policeWhite = this.add.sprite(875, 170, 'police-white').setInteractive();
      const policeBlack = this.add.sprite(875, 170, 'police-black').setInteractive();

      const researchWhite = this.add.sprite(750, 170, 'research-white').setInteractive();
      const researchBlack = this.add.sprite(750, 170, 'research-black').setInteractive();

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
      for(let i = 0; i < sprites.length; i=i+2){
        this.addOverOutListener(sprites[i], sprites[i+1]);
      }

      let menuIsPressed = false;

      // Handle the visibility of the measure buttons
      menuBlack.on('pointerup', ()=> {
        // Check, whether menu button is already pressed
         if(menuIsPressed){
           // Return to the default visibility: hide each button except for menu
           this.setDefaultVisibility(sprites);
           // Return to the default (false) value
           menuIsPressed = false;
         }else{
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
      const settingsWhite = this.add.sprite(1125, 70, 'settings-white').setInteractive();
      const settingsBlack = this.add.sprite(1125, 70, 'settings-black').setInteractive();

      const pauseWhite = this.add.sprite(1125, 120, 'pause-white').setInteractive();
      const pauseBlack = this.add.sprite(1125, 120, 'pause-black').setInteractive();

      const resetWhite = this.add.sprite(1250, 120, 'reset-white').setInteractive();
      const resetBlack = this.add.sprite(1250, 120, 'reset-black').setInteractive();

      const resumeWhite = this.add.sprite(1375, 120, 'resume-white').setInteractive();
      const resumeBlack = this.add.sprite(1375, 120, 'resume-black').setInteractive();

      const gamespeedWhite = this.add.sprite(1125, 170, 'gamespeed-white').setInteractive();
      const gamespeedBlack = this.add.sprite(1125, 170, 'gamespeed-black').setInteractive();

      const fasterWhite = this.add.sprite(1250, 170, 'faster-white').setInteractive();
      const fasterBlack = this.add.sprite(1250, 170, 'faster-black').setInteractive();

      const slowerWhite = this.add.sprite(1375, 170, 'slower-white').setInteractive();
      const slowerBlack = this.add.sprite(1375, 170, 'slower-black').setInteractive();

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
      for(let i = 0; i < sprites.length; i=i+2){
        this.addOverOutListener(sprites[i], sprites[i+1]);
      }

      let settingsIsPressed = false;

      settingsBlack.on('pointerup', () => {
        // Check whether 'settings' has been already clicked
        if(settingsIsPressed){
          // Hide every button except for 'settings'
          this.setDefaultVisibility(sprites);
          // Set 'settings' to not pressed
          settingsIsPressed = false;
        }else{
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
      for(let i = 0; i < sprites.length; i++){
        if(i === 0){
          sprites[i].visible = true;
        }else{
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
        console.log("Clicked");
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

    update(): void {
      if (!this.mainSceneIsPaused) this.menu.updateItemMenu(); // has to be invoked each tic/ ingame hour TODO
    }
}
