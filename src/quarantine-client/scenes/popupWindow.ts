import "phaser";

/**
 * Modal scene to show popup in the game.
 * @author Vinh Hien Tran
 */
export class PopupWindow extends Phaser.Scene {
    
    /** @param parent is parent scene, who call popupWindow  */ 
    constructor(parent: Phaser.Scene) {
        super({
            key: "modal"
        });
        this.parent = parent;
    }

    /** Parent scene */
    private parent: Phaser.Scene;

    preload(){
        this.load.image('cancel', 'assets/sprites/cancel.jpg');
    }

    create(popupContainer: Phaser.GameObjects.Container): void {
        this.addCloseBtn();
        this.addContainer(popupContainer);
    }

    /** Add close button to close modal scene and back to parent scene */
    private addCloseBtn(): void {
        // add close button to top right of popup scene
        const cancelBtn = this.add.image(this.game.renderer.width - 80, 0, 'cancel').setOrigin(0).setDepth(1);

        // set Interactive
        cancelBtn.setInteractive();
        
        // button click event
        cancelBtn.on("pointerup", () => {
            //stop this modal scene
            this.scene.stop();
        });
    }

    /**
    * Add existing Container to Modal-scene
    * @param popupContainer Phaser.GameObjects.Container
    */
    private addContainer(popupContainer: Phaser.GameObjects.Container): void {
        //center the Container
        popupContainer.setX(this.game.renderer.width / 2);
        popupContainer.setY(this.game.renderer.height / 2);

        // add container to scene
        this.add.existing(popupContainer);
    }

    /**
    * This public method can callable from outside
    * For example: To show Modal
    * 
    * ```
    * var modal_example = new PopupWindow( parent_scene );
    * modal_example.createModal( popupContainer );
    * ```
    * 
    * @param popupContainer Phaser.GameObjects.Container
    */
    public createModal(popupContainer: Phaser.GameObjects.Container): void {
        this.parent.scene.launch( "modal", popupContainer);
    }
}