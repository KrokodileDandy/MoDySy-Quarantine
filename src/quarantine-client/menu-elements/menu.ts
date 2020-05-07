import 'phaser';
import { Item } from './item';
import { GameObjects } from 'phaser';

/**
 * @author Marvin Kruber
 */
export class ItemMenu extends Phaser.GameObjects.Container {

    private budget = 0; // has to replaced by controller.getBudget() and controller.getIncome();
    private income = 5;

    public constructor(scene: Phaser.Scene, x: number, y: number ) {
        super(scene, x, y);

        const itemBar = new Phaser.GameObjects.Container(this.scene, 200, 100, this.fillWithItems() ).setScale(1.1, 1);
        this.setScale(1.5, 0.25);

        this.scene.add.existing(this);
        this.scene.add.existing(itemBar);
        
        this.add(this.scene.add.image(0 , 0, 'menuborder').setOrigin(0, 0));
        itemBar.add(this.scene.add.image(0, 0, 'blackborder').setOrigin(0, 0));
        
        this.add(itemBar);
        this.addStatistics();

        itemBar.setSize(100, 300);
        itemBar.setInteractive();
        itemBar.input.hitArea = new Phaser.GameObjects.Rectangle(this.scene, 50, 100 , 1000, 600); //hitArea of ItemMenu
        itemBar.on('pointerdown', () => console.log("Hello again"));
        /*itemBar.on('drag', (pointer, gameObject, dragX, dragY) => { //TODO change hit area of items -> setHitArea()
            itemBar.each(x => (x as Item).updatePosition(0));
        });*/
        
        //console.log(itemBar.input);
    }

    private fillWithItems(): Phaser.GameObjects.GameObject[] {
        return [
        new Item(this.scene, 75, 330, 'hallo', 23, 'blackborder', console.log),
        new Item(this.scene, 200, 330, 'hallo2', 25, 'blackborder', console.log),
        new Item(this.scene, 325, 330, 'hallo3', 25, 'blackborder', console.log),
        new Item(this.scene, 450, 330, 'hallo4', 25, 'blackborder', console.log),
        new Item(this.scene, 575, 330, 'hallo5', 25, 'blackborder', console.log),
        new Item(this.scene, 700, 330, 'hallo6', 25, 'blackborder', console.log),
        new Item(this.scene, 825, 330, 'hallo7', 25, 'blackborder', console.log)
        ]
    }

    private addStatistics(): void {
        this.add(this.scene.add.text(50,320,`Budget: ${this.budget} \nIncome: ${this.income}`,{
            fontFamily:'Arial',
            color:'#000000',
          }).setFontSize(20).setScale(1, 3).setLineSpacing(30));
    }

    public updateItemMenu(): void {
        //Update budget value and so on
        this.budget += this.income;
        (this.getAt(2) as GameObjects.Text).setText(`Budget: ${this.budget} \nIncome: ${this.income}`);
    }
}