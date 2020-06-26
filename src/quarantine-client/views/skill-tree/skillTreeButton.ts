import { GuiElement } from "../guiElement";
import { SkillTreeView } from "./skillTreeView";
import { PopupWindow } from "../popupWindow";

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
    public create(): Phaser.GameObjects.Sprite {
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
                if(!this.scene.mainSceneIsPaused){
                    yourSkills.setScale(0.6);
                    const skillTree = new SkillTreeView(this.scene);
                    skillTree.createModal();
                    if (this.scene.soundON) this.scene.buttonClickMusic.play();
                }else{
                    const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                    const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                    const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                    popupMss.addGameObjects([blankNode, content]);
                    popupMss.createModal();
                }
            }).setScale(0.5);
        return yourSkills;
    }

}