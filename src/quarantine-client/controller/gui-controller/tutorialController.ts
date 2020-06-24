import { Stats } from "../stats";
import { TutorialView } from "../../views/tutorial/tutorialView";
import { TutorialComponent } from "../../views/tutorial/tutorialComponent";
import { TimedEvent } from "../entities/timedEvent";
import { LogBookButton } from "../../views/log-book/logBookButton";
import { MapScene } from "../../views/scenes/map-scene";
import { ChartScene } from "../../views/scenes/chart-scene";
import { ItemMenu } from "../../views/item-menu/menu";
import { SkillTreeButton } from "../../views/skill-tree/skillTreeButton";

/**
 * The tutorial which shows basic game introductions and
 * allows to be opened inside a popup.
 * This class is implemented as a singleton.
 * @author Sebastian Führ, Marvin Kruber
 */
export class TutorialController {

    /** The only existing instance of this singleton */
    private static instance: TutorialController;
    /** The scene in which the sub menu schould be displayed */
    private scene: Phaser.Scene;
    /** Instance of the Stats singleton */
    private stats: Stats;

    private virusName = "the virus";

    /** Array of all tutorial texts (see /res/json/tutorial-messages.json)*/
    private tutorial = require('../../../../res/json/tutorial-messages.json');

    private constructor() {
        this.stats = Stats.getInstance();
        this.virusName = this.stats.virusName;
    }

    /** 
     * @param scene Phaser scene where the sub menu should open
     * @returns the only existing instance of this singleton
     */
    public static getInstance(): TutorialController {
        if (!this.instance) this.instance = new TutorialController();
        return this.instance;
    }

    /**
     * Creates a popup with information regarding the game mechanics.
     * @param page The current page of the tutorial
     * @param x Coordinate of new TutorialView
     * @param y Coordinate of new TutorialView
     * @param closeBtnX Coordinate of close button
     * @param closeBtnY closeBtnY of new TutorialView
     * @param tutorialKey Key of the current tutorial (see /res/json/tutorial-messages.json)
     */
    private createTutorialView(page: number, x: number, y: number, closeBtnX: number, closeBtnY: number, tutorialKey: string): TutorialView {
        const tutView = new TutorialView(this.scene, page, x, y, closeBtnX, closeBtnY, tutorialKey);

        const styleDesc = { // description style
            color: 'Black',
            fontSize: '28px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        };

        const arr = [];
        const ppDescription = new Phaser.GameObjects.Text(this.scene, 300, 300, this.tutorial[tutorialKey][page], styleDesc);
        ppDescription.setWordWrapWidth(600);
        arr.push(ppDescription);

        const imgPolitician = new Phaser.GameObjects.Image(this.scene, 1200, 584, 'politician');
        imgPolitician.scale = 1.5;
        arr.push(imgPolitician);

        tutView.addGameObjects(arr)
          
        return tutView;
    }

    /**
     * Opens the respective tutorial which is set by the tutorialKey
     * @param scene The scene in which the sub scene should be displayed
     * @param tutorialKey Key of the current tutorial (see /res/json/tutorial-messages.json)
     * @param x Coordinate of new TutorialView
     * @param y Coordinate of new TutorialView
     * @param closeBtnX Coordinate of close button
     * @param closeBtnY Coordinate of close button
     */
    public open(scene: Phaser.Scene, tutorialKey: string, x = 0, y = 5, closeBtnX = 1550, closeBtnY = 200): void {
        this.scene = scene;
        this.createTutorialView(0, x, y, closeBtnX, closeBtnY, tutorialKey).createModal();
    }

    /**
     * @param currPage The current page of the tutorial
     * @param x Coordinate of new TutorialView
     * @param y Coordinate of new TutorialView
     * @param closeBtnX Coordinate of close button
     * @param closeBtnY Coordinate of close button
     * @param tutorialKey Key of the current tutorial (see /res/json/tutorial-messages.json) 
     * @returns wether the operation can be performed
     */
    public showNextPage(currPage: number, x: number, y: number, closeBtnX: number, closeBtnY: number, tutorialKey: string): boolean {
        this.createTutorialView(currPage + 1, x, y ,closeBtnX, closeBtnY, tutorialKey).createModal();
        return true;
    }

    /**
     * @param currPage The current page of the tutorial
     * @param x Coordinate of new TutorialView
     * @param y Coordinate of new TutorialView
     * @param closeBtnX Coordinate of close button
     * @param closeBtnY Coordinate of close button
     * @param tutorialKey Key of the current tutorial (see /res/json/tutorial-messages.json)
     * @returns wether the operation can be performed
     */
    public showPrevPage(currPage: number, x: number, y: number, closeBtnX: number, closeBtnY: number, tutorialKey: string): boolean {
        this.createTutorialView(currPage - 1, x, y,closeBtnX, closeBtnY, tutorialKey).createModal();
        return true;
    }

    /** 
     * 
     * @param key Tutorial key (see res/json/tutorial-messages.json)
     * @returns the number of pages of the tutorial 
     */
    public getNumberOfPages(key: string): number {return this.tutorial[key].length;}

    /**
     * 
     * @param scene 
     */
    public startTutorial(scene: Phaser.Scene): void {
        new TimedEvent(3, () => {
            this.open(scene, 'status-bar');
        });
        new TimedEvent(5, () => {
            this.open(scene, 'newspaper');
        });
        this.open(scene, 'start'); //the start tutorial
    }

    /**
     * 
     * @param component 
     * @param scene 
     */
    public createComponentTutorial(component: TutorialComponent, scene: Phaser.Scene): void {
        //
        if (component instanceof MapScene){
            new TimedEvent(7, () => { // display map
                component.activateComponent();
            });
            new TimedEvent(8, () => { // display chart/map tutorial
                this.open(scene, 'tablet');
            })
        } else if (component instanceof ChartScene) {
            new TimedEvent(7, () => { // display chart
                component.activateComponent();
            });
        } else if (component instanceof LogBookButton) {
            new TimedEvent(7, () => { // display logbook 
                component.activateComponent();
            });
            new TimedEvent(11, () => {
                this.open(scene, 'log');
            })
        } else if (component instanceof ItemMenu) {
            new TimedEvent (7, () => { // display police/healthworker button
                component.activateComponent();
                this.open(scene, 'measures');
            });

            new TimedEvent (14, () => { //display research button
                component.activateComponent();
            });
        } else if (component instanceof SkillTreeButton) {
            new TimedEvent (14, () => {
                component.activateComponent();
                this.open(scene, 'researchAndSkills');
            });
        } else {
            console.error("[WARNING] - THE PASSED COMPONENT IS NOT A REQUIRED TUTORIAL COMPONENT")
        }
        //this.open(scene);
    }
}