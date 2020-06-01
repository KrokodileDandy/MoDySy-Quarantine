import 'phaser';
import { UpgradeController } from "../objects/controller/upgradeController";



export class ButtonContainer extends Phaser.GameObjects.Container {

    private key: string;
    private dailyCost: number;
    private dailyCostText: Phaser.GameObjects.Text;
    private amount: number;
    private amountText: Phaser.GameObjects.Text;
    private priceText: Phaser.GameObjects.Text;
    private buttonImage: Phaser.GameObjects.Image;

    public measures = require("../objects/controller/measures.json");
    private eventListener: Function;

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, price: number, callback: Function) {
        super(scene, x, y);

        this.eventListener = callback;

        this.key = texture;
        this.dailyCost = this.measures[this.key]["daily_cost"];
        this.amount = this.measures[this.key]["amount"];

        this.buttonImage = this.scene.add.image(this.x + 150, this.y + 100, this.key).setScale(0.5);
        this.priceText = this.scene.add.text(this.x + 125, this.y + 140, `${price} €`, {
            fontFamily:'Arial',
            color:'#000000',
        });
        
        this.addEssentialItems(texture);
        
        this.buttonAnimations(this.buttonImage);
        this.scene.add.existing(this);
    }

    private addEssentialItems(title: string): void {

        if(title == 'research' || title == 'police' || title == 'healthworkers') {
            this.scene.add.image(this.x + 325, this.y + 125, 'money').setScale(0.8);

            if(title == 'research') {
                this.scene.add.text(this.x + 195, this.y + 75, 'Progress: ', {
                    fontFamily:'Arial',
                    color:'#000000',
                });
                this.scene.add.image(this.x + 325, this.y + 85, '25percent').setScale(0.7);

            } else {
                this.amountText = this.scene.add.text(this.x + 195, this.y + 75, `${this.amount}`, {
                    fontFamily:'Arial',
                    color:'#000000',
                });
                this.dailyCostText = this.scene.add.text(this.x + 195, this.y + 115, `${this.dailyCost} €/Day`, {
                    fontFamily:'Arial',
                    color:'#000000',
                });
                this.scene.add.image(this.x + 325, this.y + 75, 'plus').setInteractive()
                .on('pointerup', () => {
                    this.amount += 1000;
                    this.dailyCost += 4000;
                    this.updateText();
                });
                this.scene.add.image(this.x + 325, this.y + 95, 'minus').setInteractive()
                .on('pointerup', () => {
                    if(this.amount > 0) {
                        this.amount -= 1000;
                        this.dailyCost -= 4000;
                        this.updateText();
                    }
                });
                this.scene.add.image(this.x + 275, this.y + 85, 'man').setScale(0.3);
            }
        }
    }

    private buttonAnimations(image: Phaser.GameObjects.Image): void {
        image.setInteractive()
        .on('pointerover', () => { // increase scale on hover
            image.setScale(0.55);
        })
        .on('pointerout', () => { // decrease scale 
            image.setScale(0.5);
        })
        .on('pointerdown', () => { // decrease scale on click
            image.setScale(0.5);
        })
        .on('pointerup', () => { // "try to buy this item"
            image.setScale(0.55);
            this.eventListener();
            this.updateText();
        });
    }
    
    public updateText(): void {
        const currLv = this.measures["research"]["current_level"];
        const currPrice = this.measures["research"]["prices"][currLv];
        this.priceText.setText(`${currPrice} €`);
        this.amountText.setText(`${this.amount}`);
        this.dailyCostText.setText(`${this.dailyCost} €/Day`);
    }
}