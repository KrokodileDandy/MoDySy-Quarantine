import { MainScene } from "../scenes/main-scene";
import { ChartScene } from "../scenes/chart-scene";
import { MapScene } from "../scenes/map-scene";
import { PopupWindow } from "../popupWindow";
import { GuiElement } from "../guiElement";

/**
 * Factory which generates the reset game button which opens a popup and
 * asks the player if he/she really wants to restart the game.
 * @see GuiScene
 * @author Hien
 * @author Sebastian Führ
 */
export class RestartButton extends GuiElement {

    /** Create and add a restart button to the GuiScene */
    public create(): Phaser.GameObjects.Sprite {
        const resetBtn = this.scene.add.sprite(this.scene.game.renderer.width - 100, 150, 'restart');
        resetBtn.setInteractive();

        // hover, click event etc.
        resetBtn.on('pointerover', () => {
            resetBtn.setScale(0.7);
        });

        resetBtn.on('pointerout', () => {
            resetBtn.setScale(1);
        });

        resetBtn.on('pointerup', () => {
                if(!this.scene.mainSceneIsPaused){
                    //creates popup messages
                    const popupMss = new PopupWindow(this.scene, 0, 0, '', 1100, 350, true, [], false);
                    const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(500, 300);
                    const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 100, this.scene.game.renderer.height / 2, 'Do you want to reset the game?', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

                    //creates confirm button
                    const restartOKBtn = new Phaser.GameObjects.Image(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2 + 50, 'restart-popup');

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
                    const main = this.scene.scene.get('MainScene') as MainScene;
                    const chart = this.scene.scene.get('ChartScene') as ChartScene;
                    const map = this.scene.scene.get('MapScene') as MapScene;

                    main.scene.restart();
                    chart.scene.restart();
                    map.scene.restart();

                    //close modal
                    popupMss.closeModal();
                    if (this.scene.soundON) this.scene.buttonClickMusic.play();
                });

                    //add confirm to object container and show the popup
                    popupMss.addGameObjects([blankNode, content, restartOKBtn]);
                    popupMss.createModal();
                    if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }else{
                const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popupMss.addGameObjects([blankNode, content]);
                popupMss.createModal();
            }

        });
        return resetBtn;
    }

}