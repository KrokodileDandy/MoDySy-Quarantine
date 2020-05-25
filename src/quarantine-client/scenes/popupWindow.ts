import "phaser";

/**
 * Modal scene to show popup in the game.
 * @author Vinh Hien Tran
 */
export class PopupWindow extends Phaser.GameObjects.Container {

    /**
     * @param scene scene to which this GameObject belongs
     * @param x horizontal position of this modal
     * @param y vertical position of this modal
     * background_key : key of background image
     */
    constructor(scene: Phaser.Scene, x: number, y: number, background_key: string, text?: string, data?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y);
        //add all Children
        this.addGameObjects(data);
        this.addText(text);
        this.addBackground(background_key);
        this.addCloseBtn();
    }

    /** add all of inputing objected to container */ 
    public addGameObjects(objs: Phaser.GameObjects.GameObject[]){
        this.add(objs);
    }

    /** set background  */ 
    private addBackground(background_img : string) : void {
        this.add(new Phaser.GameObjects.Image(this.scene, this.scene.game.renderer.width / 2, this.scene. game.renderer.height / 2, background_img));
    }

    /** add text :for popup info  */ 
    private addText(msg_text : string) : void {
        this.add(new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2, this.scene.game.renderer.height / 2, msg_text, {fontSize: '30px', color: 'black'}));
    }

    /** Add close button to close modal scene and back to parent scene  */
    private addCloseBtn(): void {
        // add close button to top right of popup scene
        const cancelBtn = new Phaser.GameObjects.Image(this.scene, this.scene.game.renderer.width / 2 - 80, 0, 'cancelButton').setOrigin(0).setDepth(1);

        // set Interactive
        cancelBtn.setInteractive();
        
        // button click event
        cancelBtn.on("pointerup", () => {
            //stop this modal scene
            this.setVisible(false);
            //remove destroy() later if needed
            this.destroy();
        });
        this.add(cancelBtn);
    }
    
    /**
    * This public method can callable from outside
    * For example: To show Modal
    * ```
    * let arr = [obj1, obj2, obj3];
    * let container = new PopupWindow(this, 0, 0, 'background_key', 'text?', arr);
    * container.createModal();
    * ```
    */
    public createModal(): void {
        this.scene.add.existing(this);
        this.setVisible(true);
    }
}