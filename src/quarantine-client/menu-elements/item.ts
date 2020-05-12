import 'phaser';
import { ArrowButton } from './arrow-button';

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

        this.setScale(0.8, 1);

        this.title = title;
        this.price = price;
        this.eventListener = callback;

        this.setInteractive()
            .on('pointerover', () => {
                this.setTexture(`bar-${this.title}-black`);
            })
            .on('pointerout', () => {
                this.setTexture(`bar-${this.title}-white`);
            })
            .on('pointerdown', () => {
                this.eventListener(this.price);
            });
        ArrowButton.getEmitter().on('myButtonClick', (direction) => {
            this.updatePosition(direction);
        });
    }

    public getTitle(): string {
        return this.title;
    }

    public getPrice(): number {
        return this.price;
    }

    public updatePosition(direction: number): void {
        this.x += direction * 150; //150 => image size + space
        if (this.x < 75 || this.x > 625) { //border
            this.disableInteractive();
            this.setVisible(false);
        } else {
            this.setVisible(true);
            this.setInteractive();
        }
    }
}