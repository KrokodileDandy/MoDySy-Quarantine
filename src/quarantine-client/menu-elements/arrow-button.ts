import 'phaser';

/**
 * @author Marvin Kruber
 */
export class ArrowButton extends Phaser.GameObjects.Image{

    private direction: number
    private static readonly EMITTER = new Phaser.Events.EventEmitter(); //Emits events to the single items => see item.ts
    private static scrollCounter: number //Used to 

    constructor(scene: Phaser.Scene, x: number, y: number, key: string, direction: number, nbrItems: number) {
        super(scene, x, y, key);
        this.direction = direction;
        ArrowButton.scrollCounter = nbrItems;

        this.scene.add.existing(this);

        this.setScale(0.03, 0.2);

        this.setInteractive()
            .on('pointerdown', ()=> {
                const currentMenuPosition = ArrowButton.scrollCounter + this.direction;
                
                if(currentMenuPosition <= 3 || currentMenuPosition >= 11) return;

                ArrowButton.EMITTER.emit('myButtonClick', this.direction);
                ArrowButton.scrollCounter = currentMenuPosition;
             });

        
    }

    public static getEmitter(): Phaser.Events.EventEmitter {
        return ArrowButton.EMITTER;
    }
}