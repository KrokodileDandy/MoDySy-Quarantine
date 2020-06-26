import { GuiElement } from "../guiElement";
import { LogBook } from "../../controller/gui-controller/logBook";
import { PopupWindow } from "../popupWindow";

/**
 * Factory which generates the the log book button which opens the
 * log book sub scene.
 * @see GuiScene
 * @see LogBook
 * @author Sebastian Führ
 */
export class LogBookButton extends GuiElement {

    /** Create and add a log book button to the GuiScene */
    public create(): Phaser.GameObjects.Sprite {
        const lbBtn = this.scene.add.sprite(1000, 90, 'log').setOrigin(0);
        lbBtn.scale = 0.6;
        lbBtn.angle = 1;
        lbBtn.setInteractive();

        // hover effect
        lbBtn.on('pointerover', () => { lbBtn.scale = 0.65; });
        lbBtn.on('pointerout', () => { lbBtn.scale = 0.6; });

        lbBtn.on('pointerup', () => {
            if(!this.scene.mainSceneIsPaused){
                LogBook.getInstance().open(this.scene); // open log book sub scene
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }else{
                const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popupMss.addGameObjects([blankNode, content]);
                popupMss.createModal();
            }
        });
        return lbBtn;
    }

}