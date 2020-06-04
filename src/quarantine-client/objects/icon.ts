import { SkillController } from "./controller/skillController";

export class Icon extends Phaser.GameObjects.Image {
    
    /** Number of currently available skill points */
    private availableSkillPoints: number; 

    /** Purchase price of the next skill point */
    private nextSkillPointPrice: number;

    private skillIsActive: boolean;

    private icon: string;

    private button: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, key: string, active: boolean) {
        super(scene, x, y, texture);

        this.availableSkillPoints = SkillController.getInstance().getAvailableSkillPoints();
        this.nextSkillPointPrice = SkillController.getInstance().getNextSkillPointPrice();
        this.skillIsActive = active;
        this.icon = key;

        this.button = this.scene.add.image(x, y, texture).setScale(0.85);
        this.addButtonAnimations(this.button);

        //this.scene.add.existing(this);
    }

    private addButtonAnimations(image: Phaser.GameObjects.Image): void {
        image.setInteractive()
        .on('pointerover', () => {
            image.setScale(0.85);
        })
        .on('pointerout', () => {
            image.setScale(0.75);
        })
        .on('pointerdown', () => {
            image.setScale(0.75);
        })
        .on('pointerup', () => {
            image.setScale(0.85);

        });
    }
}