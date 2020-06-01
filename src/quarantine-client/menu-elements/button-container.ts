import 'phaser';

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
        this.dailyCost = this.measures[this.key]['daily_cost'];
        this.amount = this.measures[this.key]['amount'];

        this.buttonImage = this.scene.add.image(this.x + 150, this.y + 100, this.key);  //.setScale(1.25);
        this.priceText = this.scene.add.text(this.x + 105, this.y + 165, `${price} €`, {
            fontFamily:'Arial',
            color:'#000000',
        }).setScale(1.5);
        
        this.addEssentialItems(this.key);
        
        this.buttonAnimations(this.buttonImage);
        this.scene.add.existing(this);
    }

    private addEssentialItems(title: string): void {

        if(title == 'research') {
            this.scene.add.text(this.x + 210, this.y + 50, 'Progress: ', {
                fontFamily:'Arial',
                color:'#000000',
            }).setScale(1.5);
        }

        if(title == 'police' || title == 'healthworkers') {
            this.amountText = this.scene.add.text(this.x +215, this.y + 50, `${this.amount}`, {
                fontFamily:'Arial',
                color:'#000000',
            }).setScale(1.5);
            this.dailyCostText = this.scene.add.text(this.x + 215, this.y + 100, `${this.dailyCost} €/Day`, {
                fontFamily:'Arial',
                color:'#000000',
            }).setScale(1.5);
            this.scene.add.image(this.x + 475, this.y + 25, 'plus').setInteractive()
            .on('pointerup', () => {
                this.amount += 1000;
                this.dailyCost += 4000;
                this.setAmount();
             }).setScale(1.25);
            this.scene.add.image(this.x + 475, this.y + 65, 'minus').setInteractive()
            .on('pointerup', () => {
                if(this.amount > 0 && this.dailyCost > 0) {
                    this.amount -= 1000;
                    this.dailyCost -= 4000;
                    this.setAmount();
                }
            }).setScale(1.25);
        }
    }

    private buttonAnimations(image: Phaser.GameObjects.Image): void {
        image.setInteractive()
        .on('pointerover', () => { // increase scale on hover
            image.setScale(1.1);
        })
        .on('pointerout', () => { // decrease scale 
            image.setScale(1.0);
        })
        .on('pointerdown', () => { // decrease scale on click
            image.setScale(1.0);
        })
        .on('pointerup', () => { // "try to buy this item"
            image.setScale(1.1);
            this.eventListener();
            if(this.key == 'research') {
                this.updateText();
            }
        });
    }
    
    public updateText(): void {
        const currLv = this.measures['research']['current_level'];
        const currPrice = this.measures['research']['prices'][currLv];
        this.priceText.setText(`${currPrice} €`);
    }

    public setAmount(): void {
        this.amountText.setText(`${this.amount}`);
        this.dailyCostText.setText(`${this.dailyCost} €/Day`);
    }
}