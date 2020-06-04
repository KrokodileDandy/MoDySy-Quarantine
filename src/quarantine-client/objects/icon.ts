import { SkillController } from "./controller/skillController";
import { SkillTreeView } from "../scenes/skillTreeView";

export class Icon extends Phaser.GameObjects.Image {

    //private skillTree: SkillTreeView;
    
    /** Number of currently available skill points */
    private availableSkillPoints: number; 

    /** Purchase price of the next skill point */
    private nextSkillPointPrice: number;

    private skillIsActive: boolean;

    private button: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, skillTree: SkillTreeView, active: boolean) {
        super(scene, x, y, texture);

        this.availableSkillPoints = SkillController.getInstance().getAvailableSkillPoints();
        this.nextSkillPointPrice = SkillController.getInstance().getNextSkillPointPrice();
        this.skillIsActive = active;

        this.addButtonAnimations(texture, skillTree);

        //this.scene.add.existing(this);
    }

    private addButtonAnimations(key: string, skillTree: SkillTreeView): void {
        this.setInteractive()
        .on('pointerover', () => {
            this.setScale(0.85);
        })
        .on('pointerout', () => {
            this.setScale(0.75);
        })
        .on('pointerdown', () => {
            this.setScale(0.75);
        })
        .on('pointerup', () => {
            this.setScale(0.85);
            //this.destroy();
            skillTree.openSubtree(key);
        });
    }
}