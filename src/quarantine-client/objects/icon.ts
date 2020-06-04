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

        this.button = this.scene.add.image(x, y, texture);
        //this.ringColor = this.setColor(SkillController.getInstance());
        //this.iconImage =  this.setIcon(key);
        this.addButtonAnimations();

        //this.scene.add.existing(this);
    }

    private addButtonAnimations(): void {
        this.setInteractive()
        .on('pointerover', () => {
            this.button.setScale(0.85);
        })
        .on('pointerout', () => {
            this.button.setScale(0.75);
        })
        .on('pointerdown', () => {
            this.button.setScale(0.75);
        })
        .on('pointerup', () => {
            this.button.setScale(0.85);

        });
    }
}