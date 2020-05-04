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

    create(): void {
        //cast to MainScene because otherwise TS won't find MainScene functions in the Scene superclass
        const main = this.scene.get('MainScene') as MainScene;

        let isPaused = false;
        const pause = this.add.text(700, 60, 'Pause', { fontFamily: '"Roboto Condensed"', color: "#000"});
        const restart = this.add.text(700, 100, 'Restart', { fontFamily: '"Roboto Condensed"', color: "#000" });
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

}
