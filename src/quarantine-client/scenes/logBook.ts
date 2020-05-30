import { PopupWindow } from "./popupWindow";
import { MainScene } from "./main-scene";
import { ChartScene } from "./chart-scene";

/**
 * @author Sebastian Führ
 */
export class LogBook extends PopupWindow {

    constructor(scene: Phaser.Scene) {
        super(
            scene, 
            0, 
            5, 
            'open-notebook', 
            1550, 
            50,
            true, 
            [
                new Phaser.GameObjects.Text(
                    scene,
                    400, 
                    50, 
                    'Log', 
                    { color: 'Black', fontSize: '70px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
                )
            ],
            false
        );

        this.addGameObjects(this.createFBBtns());
    }

    /**
     * Creates two buttons to allow to change the visible page in the log book.
     */
    private createFBBtns(): Phaser.GameObjects.Image[] {
        const nextBtn = new Phaser.GameObjects.Image(this.scene, 1600, 870, 'arrow-next');

        //confirm button interactive events
        nextBtn.setInteractive();

        nextBtn.on('pointerover', () => {
            // nextBtn.setTexture('arrow');
            nextBtn.scaleX = 1.2;
            nextBtn.scaleY = 1.2;
        });

        nextBtn.on('pointerout', () => {
            //nextBtn.setTexture('arrow');
            nextBtn.scaleX = 1;
            nextBtn.scaleY = 1;
        });

        //do restart the game when btn were clicked
        nextBtn.on('pointerup', () => {
            // view next week (if possible)
        });

        const prevBtn = new Phaser.GameObjects.Image(this.scene, 320, 870, 'arrow-next');
        prevBtn.angle = 180;

        return [nextBtn, prevBtn];
    }

}