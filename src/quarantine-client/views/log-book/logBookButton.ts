import { GuiElement } from "../guiElement";
import { LogBookController } from "../../controller/gui-controller/logBookController";
import { TutorialComponent } from "../tutorial/tutorialComponent";

/**
 * Factory which generates the the log book button which opens the
 * log book sub scene.
 * @see GuiScene
 * @see LogBookController
 * @author Sebastian Führ
 */
export class LogBookButton extends GuiElement implements TutorialComponent {

    /** Log book button */
    private lbBtn: Phaser.GameObjects.Image;

    /** Create and add a log book button to the GuiScene */
    public create(): LogBookButton {
        this.lbBtn = this.scene.add.image(1000, 90, 'log').setOrigin(0);
        this.lbBtn.scale = 0.6;
        this.lbBtn.angle = 1;

        // hover effect
        this.lbBtn.on('pointerover', () => { this.lbBtn.scale = 0.65; });
        this.lbBtn.on('pointerout', () => { this.lbBtn.scale = 0.6; });

        this.lbBtn.on('pointerup', () => {
            LogBookController.getInstance().open(this.scene); // open log book sub scene
            if (this.scene.soundON) this.scene.buttonClickMusic.play();
        });

        this.hideComponent();

        return this;
    }

    public hideComponent(): void {
        this.lbBtn.disableInteractive();
        this.lbBtn.setVisible(false);
    }

    public activateComponent(): void {
        this.lbBtn.setVisible(true);
        this.lbBtn.setInteractive();
    }
}