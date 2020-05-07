import 'phaser';

/**
 * 
 * @author Marvin Kruber
 */
export class Item extends Phaser.GameObjects.Image{

    private title: string;
    private price: number;
    private eventListener: Function;

    public constructor(scene: Phaser.Scene, x: number, y: number, title: string, price: number, key: string, callback: Function) {
        
        super(scene, x, y, key);

        this.scene.add.existing(this);

        this.setScale(0.125, 0.9);

        this.title = name;
        this.price = price;
        this.eventListener = callback;

        this.setInteractive();
        this.scene.input.setDraggable(this); //TODO Make a draggable list (container)of items. On drag => move all items of this list
        /*this.on('drag', (pointer, gameObject, dragX, dragY) => {
            //gameObject.x = dragX;
            //this.x = dragX;
            this.eventListener(dragY);
        })*/
        
    }

    public getTitle(): string {
        return this.title;
    }

    public getPrice(): number {
        return this.price;
    }

    public updatePosition(position: number): void {
        console.log(position);
    }
}