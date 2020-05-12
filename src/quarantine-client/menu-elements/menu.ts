import 'phaser';
import { Item } from './item';
import { GameObjects } from 'phaser';
import { ArrowButton } from './arrow-button';
import { Controller } from '../objects/controller/controller'

/**
 * @author Marvin Kruber
 */
export class ItemMenu extends Phaser.GameObjects.Container {

    private budget = 0; // has to replaced by controller.getBudget() and controller.getIncome();
    private income = 5;
    //private controller = Controller.getInstance();

    public constructor(scene: Phaser.Scene, x: number, y: number ) {
        super(scene, x, y);

        const itemBar = new Phaser.GameObjects.Container(this.scene, 250, 100, this.fillWithItems() ).setScale(1.05, 1);
        this.setScale(1.8, 1);

        this.scene.add.existing(this);
        this.scene.add.existing(itemBar);
        
        this.add(this.scene.add.image(0 , 0, 'bar').setOrigin(0, 0));

        const nbrOfItems = itemBar.length; //-1; //1 has to be subracted because of the background img of itemBar
        this.add(new ArrowButton(this.scene, 325, 75, 'arrow-button-left', -1, nbrOfItems));
        this.add(new ArrowButton(this.scene, 1000, 75, 'arrow-button-right', 1, nbrOfItems)); //400
        
        this.add(itemBar);
        this.addStatistics();

        itemBar.setSize(100, 300);
    }

    private fillWithItems(): Phaser.GameObjects.GameObject[] {
        return [
        new Item(this.scene, 175, -15, 'lockdown', 10000 , 'bar-lockdown-white', console.log), //75 330
        new Item(this.scene, 325, -15, 'socialdistancing', 4000, 'bar-socialdistancing-white', console.log),
        new Item(this.scene, 475, -15, 'police', 2500, 'bar-police-white', console.log),
        new Item(this.scene, 625, -15, 'research', 5000 , 'bar-research-white', console.log),
        /*new Item(this.scene, 725, -15, 'comingSoon', 25, 'bar-police-black', console.log),
        new Item(this.scene, 825, -15, 'comingSoon', 25, 'bar-police-black', console.log),
        new Item(this.scene, 975, -15, 'comingSoon', 25, 'bar-police-black', console.log)*/
        ]
    }

    private addStatistics(): void {
        this.add(this.scene.add.text(50, 50,`Budget: ${this.budget}            Income: ${this.income}`,{ // \n for line break and then setLineSpacing
            fontFamily:'Arial',
            color:'#000000',
          }).setFontSize(12).setScale(1, 3).setLineSpacing(10));
    }

    public updateItemMenu(): void {
        //Update budget value and so on
        this.budget += this.income;
        (this.getAt(2) as GameObjects.Text).setText(`Budget: ${this.budget}            Income: ${this.income}`);
    }
}