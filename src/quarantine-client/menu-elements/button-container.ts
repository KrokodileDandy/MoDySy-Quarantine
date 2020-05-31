import 'phaser';
import { UpgradeController } from "../objects/controller/upgradeController";
import { GameObjects } from 'phaser';



export class ButtonContainer extends Phaser.GameObjects.Container {

    private key: string;
    private price: number;

    private researchLv: number;
    private researchPrice: number;
    
    private researchText: Phaser.GameObjects.Text;
    private buttonImage: Phaser.GameObjects.Image;

    public measures = require("../objects/controller/measures.json");
    //private eventListener: Function;

    public constructor(scene: Phaser.Scene, x: number, y: number, key: string, price: number, callback: Function) {
        super(scene, x, y);

        this.researchLv = this.measures['research']['current_level'];
        this.researchPrice = this.measures['research']['prices'][this.researchLv];

        this.key = key;
        this.price = price;
        //this.eventListener = callback;

        this.buttonImage = this.scene.add.image(150, 600, this.key).setScale(0.5);
        this.researchText = this.scene.add.text(125, 640, `${this.price} €`, {
            fontFamily:'Arial',
            color:'#000000',
        });
        
        this.buttonAnimations(this.buttonImage);
        this.scene.add.existing(this);
    }

    public buttonAnimations(image: Phaser.GameObjects.Image): void {
        image.setInteractive()
        .on('pointerover', () => { // increase scale on hover
            image.setScale(0.6);
        })
        .on('pointerout', () => { // decrease scale 
            image.setScale(0.5);
        })
        .on('pointerdown', () => { // decrease scale on click
            image.setScale(0.45);
        })
        .on('pointerup', () => { // "try to buy this item"
            image.setScale(0.6);
            //this.eventListener(this.price);
            this.measures['research']['current_level'] += 1;
            this.updateText();
        });
    }
    
    public updateText(): void {
        this.researchLv = this.measures['research']['current_level'];
        this.researchPrice = this.measures['research']['prices'][this.researchLv];
        this.researchText.setText(`${this.researchPrice} €`);
    }
}