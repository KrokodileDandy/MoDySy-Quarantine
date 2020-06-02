import 'phaser';

/**
 * Represents a container which inherit all necessary items
 * depending on the type of button that its gonna contain.
 * 
 * @author Shao
 */
export class ButtonContainer extends Phaser.GameObjects.Container {

    // Key to determine which button is used
    private key: string;
    // The daily costs of smth
    private dailyCost: number;
    // Visual text representation of daily costs
    private dailyCostText: Phaser.GameObjects.Text;
    // The Amount of smth
    private amount: number;
    // Visual text representation of amount
    private amountText: Phaser.GameObjects.Text;
    // Visual text of price
    private priceText: Phaser.GameObjects.Text;
    // The Texture of the button
    private buttonImage: Phaser.GameObjects.Image;
    // Loading data of menu items
    public measures = require("../objects/controller/measures.json");

    private eventListener: Function;

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, price: number, callback: Function) {
        super(scene, x, y);

        this.eventListener = callback;

        this.key = texture;
        // Loading daily cost and amount from measures.json
        this.dailyCost = this.measures[this.key]['daily_cost'];
        this.amount = this.measures[this.key]['amount'];
        // Load 'key' as image and price as text to fixed position in the container
        this.buttonImage = this.scene.add.image(this.x + 150, this.y + 100, this.key);  //.setScale(1.25);
        this.priceText = this.scene.add.text(this.x + 105, this.y + 165, `${price} €`, {
            fontFamily:'Arial',
            color:'#000000',
        }).setScale(1.5);
        // Adding items depending on type of the button
        this.addEssentialItems(this.key);
        // Adding button animations
        this.buttonAnimations(this.buttonImage);

        this.scene.add.existing(this);
    }

    /**
     * Depening on which button (key),
     * loading other items belonging to that button
     * @param title name of the button as string
     */
    private addEssentialItems(title: string): void {
        // The research button includes the static text 'Progress:' -> it is static
        if(title == 'research') {
            this.scene.add.text(this.x + 210, this.y + 50, 'Progress: ', {
                fontFamily:'Arial',
                color:'#000000',
            }).setScale(1.5);
        }
        // Police and healthworkers buttons includes the amount, the daily costs and a plus/minus button
        if(title == 'police' || title == 'healthworkers') {
            // Text of amount
            this.amountText = this.scene.add.text(this.x +215, this.y + 50, `${this.amount}`, {
                fontFamily:'Arial',
                color:'#000000',
            }).setScale(1.5);
            // Text of daily costs
            this.dailyCostText = this.scene.add.text(this.x + 215, this.y + 100, `${this.dailyCost} €/Day`, {
                fontFamily:'Arial',
                color:'#000000',
            }).setScale(1.5);
            // Plus sign to increase amount and daily costs linear
            this.scene.add.image(this.x + 475, this.y + 25, 'plus').setInteractive()
            .on('pointerup', () => {
                this.amount += 1000;        // TODO: should be integrated with the const amt in the upgradecontroller
                this.dailyCost += 4000;
                this.setAmount();           // updates the text
             }).setScale(1.25);
             // Minus sign to decrease amount and daily costs linear
            this.scene.add.image(this.x + 475, this.y + 65, 'minus').setInteractive()
            .on('pointerup', () => {
                if(this.amount > 0 && this.dailyCost > 0) {
                    this.amount -= 1000;
                    this.dailyCost -= 4000;
                    this.setAmount();       // updates the text
                }
            }).setScale(1.25);
        }
    }

    /**
     * Adding button animations.
     * Increase on hover, decrease on pointerout.
     * Decrease on pointerdown, increase on pointerup.
     * @param image 
     */
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
            // Updates the text of research price, since it has different prices for each level
            if(this.key == 'research') {
                this.updateText();
                // Grayscales the button if ten levels has been bought
                if(this.measures[this.key]['current_level'] == 9) {
                    image.setTexture('research-gray');
                    image.setScale(1.0);
                    image.removeInteractive();
                }
            }
            this.eventListener();       // initiate the buy process of reasearch in the upgrade controller
        });
    }
    
    /**
     * Updates the text 
     */
    public updateText(): void {
        const currLv = this.measures['research']['current_level'];
        const currPrice = this.measures['research']['prices'][currLv];
        this.priceText.setText(`${currPrice} €`);
    }

    /**
     * Updates the amount and the daily costs
     */
    public setAmount(): void {
        this.amountText.setText(`${this.amount}`);
        this.dailyCostText.setText(`${this.dailyCost} €/Day`);
    }
}