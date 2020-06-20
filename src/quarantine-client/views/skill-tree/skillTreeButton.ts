import { GuiElement } from "../guiElement";
import { SkillTreeView } from "./skillTreeView";

/**
 * Factory which generates the the skill tree button which opens the
 * skill tree sub scene.
 * @see GuiScene
 * @see SkillTreeView
 * @author Shao
 * @author Sebastian Führ
 */
export class SkillTreeButton extends GuiElement {

    /** Create and add a skill tree button to the GuiScene */
    public create(): void {
        const yourSkills = this.scene.add.sprite(1850, 550, 'your_skills').setInteractive()
            .on('pointerover', () => {
                yourSkills.setScale(0.6);
            })
            .on('pointerout', () => {
                yourSkills.setScale(0.5);
            })
            .on('pointerdown', () => {
                yourSkills.setScale(0.5);
            })
            .on('pointerup', () => {
                yourSkills.setScale(0.6);
                const skillTree = new SkillTreeView(this.scene);
                skillTree.createModal();
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }).setScale(0.5);
    }

}