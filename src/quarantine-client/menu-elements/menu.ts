import 'phaser';
import { GameObjects } from 'phaser';
import { ArrowButton } from './arrow-button';
import { UpgradeController } from '../objects/controller/upgradeController';
import { Stats } from '../objects/controller/stats';
import { ButtonContainer } from './button-container';

/**
 * Extends Phaser.GameObjects.Container and represents the ingame item menu.
 * 
 * It contains the single items as well as all relevant layout components like navigation buttons (@see arrow-button) and so on.
 * @author Marvin Kruber
 */
export class ItemMenu extends Phaser.GameObjects.Container {

    private budget: number;
    private income: number;

    private currLv: number;
    private currPrice: number;
    public researchText: Phaser.GameObjects.Text;
    public upgradeContr: UpgradeController;
    
    public measures = require("../objects/controller/measures.json");

    /**
     * 
     * @param scene scene to which this GameObject belongs
     * @param x horizontal position of this menu
     * @param y vertical position of this menu
     */
    public constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.upgradeContr = UpgradeController.getInstance();
        this.budget = this.upgradeContr.getBudget();
        this.income = this.upgradeContr.getIncome();

        // Add menu bar
        this.add(this.scene.add.image(this.x + 600 , 0, 'bar').setOrigin(0, 0)).setAlpha(0.5);

        // Add button container
        new ButtonContainer(this.scene, 250, 850, 'research', this.measures['research']['prices'][0], this.buildClosure(this.upgradeContr.buyResearchLevel));
        new ButtonContainer(this.scene, 250, 1025, 'lockdown', this.measures['lockdown']['price'], this.buildClosure(this.upgradeContr.activateLockdown));
        new ButtonContainer(this.scene, 250, 1200, 'police', this.measures['police']['price'], this.buildClosure(this.upgradeContr.buyPoliceOfficers));
        new ButtonContainer(this.scene, 250, 1375, 'healthworkers', this.measures['healthworkers']['price'], this.buildClosure(this.upgradeContr.buyPoliceOfficers));

        this.scene.add.existing(this);

        this.addStatistics();
    }

    /** Creates the "profile". That means item menu relevant stats are visualized on the menu. */
    private addStatistics(): void {
        this.add(this.scene.add.text(this.x + 650, 30,`Budget: ${this.budget}\nIncome: ${this.income}`,{ // \n for line break and then setLineSpacing
            fontFamily:'Arial',
            color:'#000000',
          }).setFontSize(12).setScale(1, 3).setLineSpacing(10));
    }

    /** Updates all menu statistics i.e. budget and income. */
    public updateItemMenu(): void {
        this.budget = this.upgradeContr.getBudget();
        this.income = this.upgradeContr.getIncome();
        (this.getAt(1) as GameObjects.Text).setText(`Budget: ${this.budget}\nIncome: ${this.income}`);
    }

    //-------------------------------------------------------------------------------------------------
    /** */
    private buildClosure(myFunction: Function): Function {
        const contr = this.upgradeContr;
        return function(): void {myFunction(contr)};
    }
}