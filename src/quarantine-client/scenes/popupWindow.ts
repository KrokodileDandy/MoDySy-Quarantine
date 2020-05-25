import "phaser";
import { MainScene } from "./main-scene";
import { ChartScene } from "./chart-scene";
import { MapScene } from "./map-scene";

/**
 * Modal scene to show popup in the game.
 * @author Vinh Hien Tran
 */
export class PopupWindow extends Phaser.GameObjects.Container {
    /**
     * @param scene scene to which this GameObject belongs
     * @param x x-index position of this modal
     * @param y y-index position of this modal
     * @param closeBtnX x-index position of this close btn
     * @param closeBtnY y-index position of this close btn
     * @param data list of objects
     * @param backgroundKey : key of background image
     */
    public constructor(scene: Phaser.Scene, x: number, y: number, backgroundKey: string, closeBtnX: number, closeBtnY: number, data: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y);
        //add background
        this.addBackground(backgroundKey);
        //add close btn
        this.addCloseBtn(closeBtnX, closeBtnY);
        //add object
        this.addGameObjects(data);
    }

    /** add all of inputing objected to container */ 
    public addGameObjects(objs: Phaser.GameObjects.GameObject[]): void {
        this.add(objs).setDepth(3);
    }

    /** set background  */ 
    private addBackground(backgroundImg: string): void {
        this.add(new Phaser.GameObjects.Image(this.scene, this.scene.game.renderer.width / 2, this.scene. game.renderer.height / 2, backgroundImg).setDepth(2));
    }

    /** add text :for popup info  */ 
    private addText(text: string, x: number, y: number): void {
        this.add(new Phaser.GameObjects.Text(this.scene, x, y, text, {fontSize: '30px', color: 'black'}).setDepth(4));
    }

    /** Add close button to close modal scene and back to parent scene  */
    private addCloseBtn(x: number, y: number): void {
        // add close button to top right of popup scene
        const cancelBtn = new Phaser.GameObjects.Image(this.scene, x, y, 'cancelButton').setOrigin(0).setDepth(1);

        // set Interactive
        cancelBtn.setInteractive();
        
        // button click event
        cancelBtn.on("pointerup", () => {
            //stop this modal scene
            this.setVisible(false);
            const chart = this.scene.scene.get('ChartScene') as ChartScene;
            chart.scene.wake();
            //remove destroy() later if needed
            this.destroy();
        });
        this.add(cancelBtn);
    }
    
    /**
    * This public method can callable from outside
    * For example: To show Modal
    * ```
    * const modal = new PopupWindow(this, 0, 0, 'log-background', 530, 130, [new Phaser.GameObjects.Text(this, 700, 300, 'hello from gui',{color:'red', fontSize: '50px'})]);
    * modal.createModal();
    * ```
    */
    public createModal(): void {
        // send the scenes to back
        const main = this.scene.scene.get('MainScene') as MainScene;
        const chart = this.scene.scene.get('ChartScene') as ChartScene;
        const map = this.scene.scene.get('MapScene') as MapScene;
        
        main.scene.sendToBack();
        chart.scene.sendToBack();
        map.scene.sendToBack();

        //chart scene sleeps
        chart.scene.sleep();

        this.scene.add.existing(this);
        this.setVisible(true);
    }
}