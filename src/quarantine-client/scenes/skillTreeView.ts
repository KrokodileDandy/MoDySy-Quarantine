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
        //this.addGameObjects(this.addSkillButtons());
        this.addSkillButtons();
        this.scene.add.existing(this);
    }
    private addSkillButtons(): void {
        const medicalTreatmentButton = new Icon(this.scene, this.x + 960, this.y + 250, 'medical-treatment', this, true).setScale(0.75);  //.setInteractive();
        const policeButton = new Icon(this.scene, this.x + 1240, this.y + 400, 'police', this, true).setScale(0.75);  //.setInteractive();
        const testingButton = new Icon(this.scene, this.x + 1160, this.y + 700, 'testing', this, true).setScale(0.75);    //.setInteractive();
        const lockdownButton = new Icon(this.scene, this.x + 760, this.y + 700, 'lockdown', this, true).setScale(0.75);   //.setInteractive();
        const citizensButton = new Icon(this.scene, this.x + 680, this.y + 400, 'citizen', this, true).setScale(0.75);    //.setInteractive();

        this.add(medicalTreatmentButton);
        this.add(policeButton);
        this.add(testingButton);
        this.add(lockdownButton);
        this.add(citizensButton);
    }

    public openSubtree(key: string) {
        this.removeAt(2);
        this.removeAt(2);
        this.removeAt(2);
        this.removeAt(2);
        this.removeAt(2);
        if(key == 'medical-treatment') {
            const additionalMedicalSuppliesI = new Phaser.GameObjects.Image(this.scene, this.x + 960, this.y + 300, 'additional-medical-supplies').setScale(0.5);   //.setInteractive();
            const additionalMedicalSuppliesII = new Phaser.GameObjects.Image(this.scene, this.x + 760, this.y + 400, 'additional-medical-supplies').setScale(0.5);  //.setInteractive();
            const upgradeMedicalFacilitiesI = new Phaser.GameObjects.Image(this.scene, this.x + 1160, this.y + 400, 'upgrade-medical-facilities').setScale(0.5);    //.setInteractive();
            const upgradeMedicalFacilitiesII = new Phaser.GameObjects.Image(this.scene, this.x + 960, this.y + 500, 'upgrade-medical-facilities').setScale(0.5);    //.setInteractive();
            const upgradeMedicalFacilitiesIII = new Phaser.GameObjects.Image(this.scene, this.x + 760, this.y + 600, 'upgrade-medical-facilities').setScale(0.5);   //.setInteractive();
            const medicinI = new Phaser.GameObjects.Image(this.scene, this.x + 1360, this.y + 500, 'medicine').setScale(0.5);   //.setInteractive();
            const medicinII = new Phaser.GameObjects.Image(this.scene, this.x + 1160, this.y + 600, 'medicine').setScale(0.5);  //.setInteractive();
            const medicinIII = new Phaser.GameObjects.Image(this.scene, this.x + 960, this.y + 700, 'medicine').setScale(0.5);  //.setInteractive();

            this.add(additionalMedicalSuppliesI);
            this.add(additionalMedicalSuppliesII);
            this.add(upgradeMedicalFacilitiesI);
            this.add(upgradeMedicalFacilitiesII);
            this.add(upgradeMedicalFacilitiesIII);
            this.add(medicinI);
            this.add(medicinII);
            this.add(medicinIII);
        }
    }

    /*
    private addSkillButtons(): Phaser.GameObjects.GameObject[] {
        const medicalTreatmentButton = new Icon(this.scene, this.x + 960, this.y + 250, 'medical-treatment', 'medical-treatment', true).setScale(0.75).setInteractive()
        .on('pointerover', () => { medicalTreatmentButton.setScale(0.85) })
        .on('pointerout', () => { medicalTreatmentButton.setScale(0.75) })
        .on('pointerdown', () => { medicalTreatmentButton.setScale(0.75) })
        .on('pointerup', () => { medicalTreatmentButton.setScale(0.85); this.openMedicalTreatmentsSkillTree('medical-treatment') });
        const policeButton = new Icon(this.scene, this.x + 1240, this.y + 400, 'police', 'police', true).setScale(0.75).setInteractive()
        .on('pointerover', () => { policeButton.setScale(0.85) })
        .on('pointerout', () => { policeButton.setScale(0.75) })
        .on('pointerdown', () => { policeButton.setScale(0.75) })
        .on('pointerup', () => { policeButton.setScale(0.85); });
        const testingButton = new Icon(this.scene, this.x + 1160, this.y + 700, 'testing', 'testing', true).setScale(0.75).setInteractive()
        .on('pointerover', () => { testingButton.setScale(0.85) })
        .on('pointerout', () => { testingButton.setScale(0.75) })
        .on('pointerdown', () => { testingButton.setScale(0.75) })
        .on('pointerup', () => { testingButton.setScale(0.85); });
        const lockdownButton = new Icon(this.scene, this.x + 760, this.y + 700, 'lockdown', 'lockdown', true).setScale(0.75).setInteractive()
        .on('pointerover', () => { lockdownButton.setScale(0.85) })
        .on('pointerout', () => { lockdownButton.setScale(0.75) })
        .on('pointerdown', () => { lockdownButton.setScale(0.75) })
        .on('pointerup', () => { lockdownButton.setScale(0.85); });
        const citizensButton = new Icon(this.scene, this.x + 680, this.y + 400, 'citizen', 'citizen', true).setScale(0.75).setInteractive()
        .on('pointerover', () => { citizensButton.setScale(0.85) })
        .on('pointerout', () => { citizensButton.setScale(0.75) })
        .on('pointerdown', () => { citizensButton.setScale(0.75) })
        .on('pointerup', () => { citizensButton.setScale(0.85); });

        return [
            medicalTreatmentButton, policeButton, testingButton, lockdownButton, citizensButton
        ];
    }

    private openMedicalTreatmentsSkillTree(key: string): void {
        const medicalTreatmentSubTree = new Phaser.GameObjects.Container(this.scene, 0, 0, this.addSkills(key));
        this.scene.add.existing(medicalTreatmentSubTree);

    }

    private addSkills(key: string): Phaser.GameObjects.GameObject[] {
        if(key == 'medical-treatment') {
            const additionalMedicalSuppliesI = new Phaser.GameObjects.Image(this.scene, this.x + 960, this.y + 300, 'additional-medical-supplies').setScale(0.5).setInteractive()
            .on('pointerover', () => { additionalMedicalSuppliesI.setScale(0.6) })
            .on('pointerout', () => { additionalMedicalSuppliesI.setScale(0.5) })
            .on('pointerdown', () => { additionalMedicalSuppliesI.setScale(0.5) })
            .on('pointerup', () => { additionalMedicalSuppliesI.setScale(0.6); });
            const additionalMedicalSuppliesII = new Phaser.GameObjects.Image(this.scene, this.x + 760, this.y + 400, 'additional-medical-supplies').setScale(0.5).setInteractive()
            .on('pointerover', () => { additionalMedicalSuppliesII.setScale(0.6) })
            .on('pointerout', () => { additionalMedicalSuppliesII.setScale(0.5) })
            .on('pointerdown', () => { additionalMedicalSuppliesII.setScale(0.5) })
            .on('pointerup', () => { additionalMedicalSuppliesII.setScale(0.6); });
            const upgradeMedicalFacilitiesI = new Phaser.GameObjects.Image(this.scene, this.x + 1160, this.y + 400, 'upgrade-medical-facilities').setScale(0.5).setInteractive()
            .on('pointerover', () => { additionalMedicalSuppliesII.setScale(0.6) })
            .on('pointerout', () => { additionalMedicalSuppliesII.setScale(0.5) })
            .on('pointerdown', () => { additionalMedicalSuppliesII.setScale(0.5) })
            .on('pointerup', () => { additionalMedicalSuppliesII.setScale(0.6); });
            const upgradeMedicalFacilitiesII = new Phaser.GameObjects.Image(this.scene, this.x + 960, this.y + 500, 'upgrade-medical-facilities').setScale(0.5).setInteractive()
            .on('pointerover', () => { upgradeMedicalFacilitiesII.setScale(0.6) })
            .on('pointerout', () => { upgradeMedicalFacilitiesII.setScale(0.5) })
            .on('pointerdown', () => { upgradeMedicalFacilitiesII.setScale(0.5) })
            .on('pointerup', () => { upgradeMedicalFacilitiesII.setScale(0.6); });
            const upgradeMedicalFacilitiesIII = new Phaser.GameObjects.Image(this.scene, this.x + 760, this.y + 600, 'upgrade-medical-facilities').setScale(0.5).setInteractive()
            .on('pointerover', () => { upgradeMedicalFacilitiesIII.setScale(0.6) })
            .on('pointerout', () => { upgradeMedicalFacilitiesIII.setScale(0.5) })
            .on('pointerdown', () => { upgradeMedicalFacilitiesIII.setScale(0.5) })
            .on('pointerup', () => { upgradeMedicalFacilitiesIII.setScale(0.6); });
            const medicinI = new Phaser.GameObjects.Image(this.scene, this.x + 1360, this.y + 500, 'medicine').setScale(0.5).setInteractive()
            .on('pointerover', () => { medicinI.setScale(0.6) })
            .on('pointerout', () => { medicinI.setScale(0.5) })
            .on('pointerdown', () => { medicinI.setScale(0.5) })
            .on('pointerup', () => { medicinI.setScale(0.6); });
            const medicinII = new Phaser.GameObjects.Image(this.scene, this.x + 1160, this.y + 600, 'medicine').setScale(0.5).setInteractive()
            .on('pointerover', () => { medicinII.setScale(0.6) })
            .on('pointerout', () => { medicinII.setScale(0.5) })
            .on('pointerdown', () => { medicinII.setScale(0.5) })
            .on('pointerup', () => { medicinII.setScale(0.6); });
            const medicinIII = new Phaser.GameObjects.Image(this.scene, this.x + 960, this.y + 700, 'medicine').setScale(0.5).setInteractive()
            .on('pointerover', () => { medicinIII.setScale(0.6) })
            .on('pointerout', () => { medicinIII.setScale(0.5) })
            .on('pointerdown', () => { medicinIII.setScale(0.5) })
            .on('pointerup', () => { medicinIII.setScale(0.6); });
        }

        return [

        ]
        
    }*/

    /*private addRingColor(): Phaser.GameObjects.GameObject[] {
        return [
            this.scene.add.image(this.x + 960, this.y + 250, 'circle-green')
            /*this.setColor(SkillController.getInstance(), this.x + 960, this.y + 250),
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
        
    }*/

    /*private setColor(sC: SkillController, x: number, y: number, skill?: Function): Phaser.GameObjects.Image {
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
    }*/

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