import {MainScene} from "./main-scene";

/** Scene for user interface elements. */
export class GuiScene extends Phaser.Scene {

    constructor() {
        super({
            key: "GuiScene",
            active: true
        });
        console.log('GuiConstructor')
    }

    preload(): void {

        this.load.pack(
            'buttons',
            'assets/pack.json',
            'buttons'
        );
    }

    create(): void {
        this.createPauseButton();
        this.createMenuButtons();
    }

    // Creates a pause button
    createPauseButton(): void {
      //cast to MainScene because otherwise TS won't find MainScene functions in the Scene superclass
      const main = this.scene.get('MainScene') as MainScene;
      let isPaused = false;
      const pause = this.add.text(1300, 60, 'Pause', { fontFamily: '"Roboto Condensed"', color: "#000"});
      const restart = this.add.text(1300, 100, 'Restart', { fontFamily: '"Roboto Condensed"', color: "#000" });
      //restart button only set to visible when the game is paused
      restart.visible = false;
      pause.setInteractive();
      restart.setInteractive();

      //when the button 'restart' is pressed, restart the main scene and reset the gui scene
      restart.on('pointerup', ()=> {
        //only restart the game if it is paused to avoid accidentally clicking on the invisible button
        if(isPaused){
          main.scene.restart();
          isPaused = false;
          pause.setText('Pause');
          //reset the restart button to invisible for the new game
          restart.visible = false;
        }
      });

      //when the button 'pause' is pressed, check whether the scene is already paused
      pause.on('pointerup', ()=> {
        if(!isPaused){
          main.scene.pause();
          //change text of the button from 'pause' to 'resume'
          pause.setText('Resume');
          //set restart button to visible
          restart.visible = true;
          isPaused = true;
        } else {
          main.scene.resume();
          pause.setText('Pause');
          restart.visible = false;
          isPaused = false;
        }
      });
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
      sprites.forEach(element => {
        this.setSpriteScale(element);
      });

      // Set default visibility (only the menu button can be seen)
      this.setDefaultVisibility(sprites);

      // Change the color of the button from white to black if it is hovered over
      for(let i = 0; i < sprites.length; i=i+2){
        this.addOverOutListener(sprites[i], sprites[i+1]);
      }

      var menuIsPressed = false;

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

    // Handles the visibility of the measures
    addOnListenerButton(button, measuresToShow, measuresToHide): void{
      button.on('pointerup', () => {
        measuresToShow.forEach(element => {
          element.visible = true;
        });
        measuresToHide.forEach(element => {
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
    setSpriteScale(sprite): void {
      sprite.setScale(.4);
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


}
