import { PopupWindow } from "./popupWindow";
import { SkillController } from "../objects/controller/skillController";
import { Icon } from "../objects/icon";

/**
 * 
 * @author Shao
 */
export class SkillTreeView extends PopupWindow {

     /** Number of currently available skill points */
     private availableSkillPoints: number; 

     /** Purchase price of the next skill point */
     private nextSkillPointPrice: number;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 5, 'open-notebook', 1550, 50, true, [
            new Phaser.GameObjects.Text(scene, 820, 50, 'Skill Tree', { 
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }),
        ], false);

        this.availableSkillPoints = SkillController.getInstance().getAvailableSkillPoints();
        this.nextSkillPointPrice = SkillController.getInstance().getNextSkillPointPrice();

        //this.addSkillTitles();
        this.addGameObjects(this.addSkillButtons());
        this.addGameObjects(this.addRingColor());
        this.scene.add.existing(this);
    }

    private addSkillButtons(): Phaser.GameObjects.GameObject[] {
        const medicalTreatmentButton = new Icon(this.scene, this.x + 960, this.y + 250, 'skill-button', 'medical-treatment', true);
        const policeButton = new Icon(this.scene, this.x + 1240, this.y + 400, 'skill-button', 'police', true);
        const testingButton = new Icon(this.scene, this.x + 1160, this.y + 700, 'skill-button', 'testing', true);
        const lockdownButton = new Icon(this.scene, this.x + 760, this.y + 700, 'skill-button', 'lockdown', true);
        const citizensButton = new Icon(this.scene, this.x + 680, this.y + 400, 'skill-button', 'citizen', true);

        return [
            medicalTreatmentButton, policeButton, testingButton, lockdownButton, citizensButton
        ];
    }

    private addRingColor(): Phaser.GameObjects.GameObject[] {
        return [
            this.setColor(SkillController.getInstance(), this.x + 960, this.y + 250),
            this.setColor(SkillController.getInstance(), this.x + 1240, this.y + 400),
            this.setColor(SkillController.getInstance(), this.x + 1160, this.y + 700),
            this.setColor(SkillController.getInstance(), this.x + 760, this.y + 700),
            this.setColor(SkillController.getInstance(), this.x + 680, this.y + 400),
            this.setIcon(this.x + 960, this.y + 250, 'medical-treatment'),
            this.setIcon(this.x + 1240, this.y + 400, 'police'),
            this.setIcon(this.x + 1160, this.y + 700, 'testing'),
            this.setIcon(this.x + 760, this.y + 700, 'lockdown'),
            this.setIcon(this.x + 680, this.y + 400, 'citizen'),
        ]
        
    }

    private setColor(sC: SkillController, x: number, y: number, skill?: Function): Phaser.GameObjects.Image {
        let color = '';
       
        if(skill() == true) {
            color = 'circle-green';
        } else {
            if(sC.skillBuyable(sC) == true) {
                color = 'circle-orange';
            } else {
                 color = 'circle-red';
            }
        }
        const iconColor = this.scene.add.image(x, y, color).setScale(0.75);

        return iconColor;
    }

    private setIcon(x: number, y: number, texture: string): Phaser.GameObjects.Image {
        const icon = this.scene.add.image(x, y, texture).setScale(0.75);
        return icon;
    }

    /*private addSkillTitles(): void {
        this.scene.add.text(960, 200, 'Medical Treatment', {
            color: 'Black',
            fontSize: '50px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }),
        this.scene.add.text(960, 200, 'Police', {
            color: 'Black',
            fontSize: '50px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }),
        this.scene.add.text(960, 200, 'Testing', {
            color: 'Black',
            fontSize: '50px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }),
        new Phaser.GameObjects.Text(this.scene, 960, 200, 'Lockdown', {
            color: 'Black',
            fontSize: '50px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }),
        new Phaser.GameObjects.Text(this.scene, 960, 200, 'Citizens', {
            color: 'Black',
            fontSize: '50px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
    }*/


}