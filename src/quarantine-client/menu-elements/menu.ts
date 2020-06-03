import 'phaser';
import { GameObjects } from 'phaser';
import { UpgradeController } from '../objects/controller/upgradeController';
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
    
    public measures = require("./../../../res/json/measures.json");

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
        // Add background
        this.scene.add.image(this.x + 350 , 700, 'notebook').setScale(0.6);  //.setAlpha(0.5); //dont work
        // Add menu bar
        this.add(this.scene.add.image(this.x + 500 , 50, 'note-pink').setScale(0.6));
        // Add button container
        new ButtonContainer(this.scene, 0, 450, 'research', this.measures['research']['prices'][0], this.buildClosure(this.upgradeContr.buyResearchLevel));
        new ButtonContainer(this.scene, 0, 550, 'lockdown', this.measures['lockdown']['price'], this.buildClosure(this.upgradeContr.activateLockdown));
        new ButtonContainer(this.scene, 0, 650, 'police', this.measures['police']['price'], this.buildClosure(this.upgradeContr.buyPoliceOfficers));
        new ButtonContainer(this.scene, 0, 750, 'healthworkers', this.measures['healthworkers']['price'], this.buildClosure(this.upgradeContr.buyHealthWorkers));

        this.scene.add.existing(this);

        this.addStatistics();
    }

    /** Creates the "profile". That means item menu relevant stats are visualized on the menu. */
    private addStatistics(): void {
        this.add(this.scene.add.text(this.x + 425, 0,`Budget: ${this.budget}\nIncome: ${this.income}`,{ // \n for line break and then setLineSpacing
            fontFamily:'Arial',
            color:'#000000',
        }))
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