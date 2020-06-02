import 'phaser';
import { Item } from './item';
import { GameObjects } from 'phaser';
import { UpgradeController } from '../objects/controller/upgradeController';

/**
 * Extends Phaser.GameObjects.Container and represents the ingame item menu.
 * 
 * It contains the single items as well as all relevant layout components like navigation buttons (@see arrow-button) and so on.
 * @author Marvin Kruber
 */
export class ItemMenu extends Phaser.GameObjects.Container {

    private budget: number;
    private income: number;
    private researchLv: number;
    private researchPrice: string;
    public researchText: Phaser.GameObjects.Text;
    public upgradeContr: UpgradeController;

    
    
    public measures = require("./../../../res/json/measures.json");

    /**
     * 
     * @param scene scene to which this GameObject belongs
     * @param x horizontal position of this menu
     * @param y vertical position of this menu
     */
    public constructor(scene: Phaser.Scene, x: number, y: number ) {
        super(scene, x, y);

        this.upgradeContr = UpgradeController.getInstance();
        this.budget = this.upgradeContr.getBudget();
        this.income = this.upgradeContr.getIncome();
        this.researchLv = this.measures['research']['current_level'];
        this.researchPrice = this.measures['research']['prices'][this.researchLv];

        //Create itembar which contains all items and scale it
        const itemBar = new Phaser.GameObjects.Container(this.scene, 100, -300, this.fillWithItems() );  //.setScale(1.05, 1);

        //this.setScale(1.8, 1);
        this.scene.add.existing(this);
        this.scene.add.existing(itemBar);
        
        //Add menu layout     
        this.add(this.scene.add.image(0 , 0, 'bar').setOrigin(0, 0));
        this.addStatistics();

        //Add navigation buttons
        //const nbrOfItems = itemBar.length; //1 has to be subracted if there is a background img for itemBar
        //this.add(new ArrowButton(this.scene, 325, 75, 'arrow-button-left', -1, nbrOfItems));
        //this.add(new ArrowButton(this.scene, 1000, 75, 'arrow-button-right', 1, nbrOfItems));
        
        //Add itembar
        this.add(itemBar);
    }

    /** Adds all items to the menu */
    private fillWithItems(): Phaser.GameObjects.GameObject[] {

        return [
        //new Item(this.scene, 175, -15, 'lockdown', 1000000 , 'bar-lockdown-white', this.buildClosure(this.upgradeContr.activateLockdown)),
        //new Item(this.scene, 325, -15, 'socialdistancing', 4000000, 'bar-socialdistancing-white', this.buildClosure(this.upgradeContr.activateSocialDistancing)),
        //new Item(this.scene, 475, -15, 'police', 2500000, 'bar-police-white', this.buildClosure(this.upgradeContr.buyPoliceOfficers)),
        new Phaser.GameObjects.Container(this.scene, 0, 100, [
            new Item(this.scene, 75, 0, 'research', 10, 'bar-research-white', this.buildClosure(this.upgradeContr.buyResearchLevel)).setScale(0.5),
            this.researchText = this.scene.add.text(50, 35, `${this.researchPrice} €`, {
                fontFamily:'Arial',
                color:'#000000',
            }),
            this.scene.add.text(110, -30, `Progress: `, {
                fontFamily:'Arial',
                color:'#000000',
            }),
            this.scene.add.text(110, 10, `${this.researchPrice} €/Day`, {
                fontFamily:'Arial',
                color:'#000000',
            }),
            this.scene.add.image(275, -25, '25percent').setScale(0.8),
            this.scene.add.image(275, 25, 'money')
        ])
        //new Item(this.scene, 625, -15, 'research', 10 , 'bar-research-white', this.buildClosure(this.upgradeContr.buyResearchLevel)),
        /*new Item(this.scene, 775, -15, 'police', 25, 'bar-police-white', console.log),
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
        const currLv = this.measures['research']['current_level'];
        const price = this.measures['research']['prices'][currLv];

        this.budget = this.upgradeContr.getBudget();
        this.income = this.upgradeContr.getIncome();
        (this.getAt(1) as GameObjects.Text).setText(`Budget: ${this.budget}\nIncome: ${this.income}`);
        this.researchText.setText(`${price} €`);
    }

    //-------------------------------------------------------------------------------------------------
    /** */
    private buildClosure(myFunction: Function): Function {
        const contr = this.upgradeContr;
        return function(): void {myFunction(contr)};
    }
}