import { GuiElement } from "../guiElement";
import { SkillTreeView } from "./skillTreeView";
import { TutorialComponent } from "../tutorial/tutorialComponent";

/**
 * Factory which generates the the skill tree button which opens the
 * skill tree sub scene.
 * @see GuiScene
 * @see SkillTreeView
 * @author Shao
 * @author Sebastian Führ
 */
export class SkillTreeButton extends GuiElement implements TutorialComponent {

    private yourSkills: Phaser.GameObjects.Image;

    /** Create and add a skill tree button to the GuiScene */
    public create(): SkillTreeButton {
        this.yourSkills = this.scene.add.sprite(1850, 550, 'your_skills').setInteractive()
            .on('pointerover', () => {
                this.yourSkills.setScale(0.6);
            })
            .on('pointerout', () => {
                this.yourSkills.setScale(0.5);
            })
            .on('pointerdown', () => {
                this.yourSkills.setScale(0.5);
            })
            .on('pointerup', () => {
                this.yourSkills.setScale(0.6);
                const skillTree = new SkillTreeView(this.scene);
                skillTree.createModal();
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }).setScale(0.5);

            this.hideComponent();

            return this;
    }

    public hideComponent(): void {
        this.yourSkills.disableInteractive();
        this.yourSkills.setVisible(false);
    }

    public activateComponent(): void {
        this.yourSkills.setInteractive();
        this.yourSkills.setVisible(true);
    }
}