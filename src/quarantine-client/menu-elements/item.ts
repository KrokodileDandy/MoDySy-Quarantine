import 'phaser';
import { ArrowButton } from './arrow-button';

/**
 * Represents an buyable item of the item menu and extends from Phaser.GameObjects.Image.
 * 
 * It establishes the connection to the controller by taking an callable upgrade-function, 
 * which should be implemented in and provided by controller.ts, as parameter.
 * @author Marvin Kruber
 */
export class Item extends Phaser.GameObjects.Image{

    /** Name of the item */
    private title: string;
    /** Price of the item */
    private price: number;
    /** Function which is invoked when the item is clicked (/"purchased").
     *  This function should be provided by controller.ts
     */
    private eventListener: Function;

    /**
     * 
     * @param scene scene to which this GameObject belongs
     * @param x horizontal position of the item
     * @param y vertical position of the item
     * @param title 
     * @param price price of the item
     * @param key texture key
     * @param callback upgrade function implemented in the controller
     */
    public constructor(scene: Phaser.Scene, x: number, y: number, title: string, price: number, key: string, callback: Function) {
        super(scene, x, y, key);

        this.scene.add.existing(this);

        this.setScale(0.8, 1); //scale the displayed image

        this.title = title;
        this.price = price;
        this.eventListener = callback;

        this.setInteractive()
            .on('pointerover', () => { // changes the texture on hover
                this.setTexture(`bar-${this.title}-black`);
            })
            .on('pointerout', () => { // switch back to the original texture
                this.setTexture(`bar-${this.title}-white`);
            })
            .on('pointerdown', () => { // "try to buy this item"
                console.log(typeof this.eventListener);
                this.eventListener(this.price);
            });
        ArrowButton.getEmitter().on('myButtonClick', (direction) => { //creates the link between Arrow-Button and Item by using an event (handler)
            this.updatePosition(direction);
        });

        this.updatePosition(0); //sets all items which could currently not be displayed in the item bar to invisible and interactive whithout affecting their position
    }
    /**
     * This method is used for the scrolling functionality (@see arrow-button.ts). It changes the position within the itembar. 
     * If specific dimensions are exceeded the item becomes temporarily invisible and non-interactive.
     * @param direction -1 to move this item to the left, 1 to move it to the right 
     */
    public updatePosition(direction: number): void {
        this.x += direction * 150; //150 => image size + space

        if (this.x < 75 || this.x > 625) { //borders
            this.disableInteractive();
            this.setVisible(false);
        } else {
            this.setVisible(true);
            this.setInteractive();
        }
    }

    //----------------------------------------------------------------- Getter
    /** @return  name of the item */
    public getTitle(): string {return this.title;}
    /** @return price of the item */
    public getPrice(): number {return this.price;}
}