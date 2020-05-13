import 'phaser';
import { Item } from './item';
import { GameObjects } from 'phaser';
import { ArrowButton } from './arrow-button';
import { Controller } from '../objects/controller/controller'

/**
 * Extends Phaser.GameObjects.Container and represents the ingame item menu.
 * 
 * It contains the single items as well as all relevant layout components like navigation buttons (@see arrow-button) and so on.
 * @author Marvin Kruber
 */
export class ItemMenu extends Phaser.GameObjects.Container {

    private budget: number;
    private income: number;
    private controller: Controller;

    /**
     * 
     * @param scene scene to which this GameObject belongs
     * @param x horizontal position of this menu
     * @param y vertical position of this menu
     */
    public constructor(scene: Phaser.Scene, x: number, y: number ) {
        super(scene, x, y);

        this.controller = Controller.getInstance();
        this.budget = this.controller.getBudget();
        this.income = this.controller.getIncome();

        //Create itembar which contains all items and scale it
        const itemBar = new Phaser.GameObjects.Container(this.scene, 250, 100, this.fillWithItems() ).setScale(1.05, 1);

        this.setScale(1.8, 1);
        this.scene.add.existing(this);
        this.scene.add.existing(itemBar);
        
        //Add menu layout     
        this.add(this.scene.add.image(0 , 0, 'bar').setOrigin(0, 0));
        this.addStatistics();

        //Add navigation buttons
        const nbrOfItems = itemBar.length; //1 has to be subracted if there is a background img for itemBar
        this.add(new ArrowButton(this.scene, 325, 75, 'arrow-button-left', -1, nbrOfItems));
        this.add(new ArrowButton(this.scene, 1000, 75, 'arrow-button-right', 1, nbrOfItems));
        
        //Add itembar
        this.add(itemBar);
    }

    /** Adds all items to the menu */
    private fillWithItems(): Phaser.GameObjects.GameObject[] {
        return [
        new Item(this.scene, 175, -15, 'lockdown', 1000000 , 'bar-lockdown-white', console.log),
        new Item(this.scene, 325, -15, 'socialdistancing', 4000000, 'bar-socialdistancing-white', this.controller.upgrades.buyHealthWorkers),
        new Item(this.scene, 475, -15, 'police', 2500000, 'bar-police-white', this.controller.upgrades.buyPoliceOfficers),
        new Item(this.scene, 625, -15, 'research', 5000000 , 'bar-research-white', this.controller.upgrades.introduceCure),
        /*nnew Item(this.scene, 775, -15, 'police', 25, 'bar-police-white', console.log),
        new Item(this.scene, 925, -15, 'comingSoon', 25, 'bar-police-black', console.log),
        new Item(this.scene, 1075, -15, 'comingSoon', 25, 'bar-police-black', console.log)*/
        ]
    }

    /** Creates the "profile". That means item menu relevant stats are visualized on the menu. */
    private addStatistics(): void {
        this.add(this.scene.add.text(50, 30,`Budget: ${this.budget}\nIncome: ${this.income}`,{ // \n for line break and then setLineSpacing
            fontFamily:'Arial',
            color:'#000000',
          }).setFontSize(12).setScale(1, 3).setLineSpacing(10));
    }

    /** Updates all menu statistics i.e. budget and income. */
    public updateItemMenu(): void {
        this.budget = this.controller.getBudget();
        this.income = this.controller.getIncome();
        (this.getAt(1) as GameObjects.Text).setText(`Budget: ${this.budget}\nIncome: ${this.income}`);
    }
}