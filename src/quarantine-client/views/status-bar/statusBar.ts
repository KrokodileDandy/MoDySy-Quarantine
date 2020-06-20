import { GuiElement } from "../guiElement";
import { GuiScene } from "../scenes/gui-scene";
import { Stats } from "../../controller/stats";

export class StatusBar extends GuiElement {

    private stats: Stats;

    private infected: Phaser.GameObjects.Text;
    private dailyIncome: Phaser.GameObjects.Text;
    private budget: Phaser.GameObjects.Text;

    public constructor(scene: GuiScene) {
        super(scene);

        this.stats = Stats.getInstance();
    }

    private init(): void {
        this.scene.add.image(480, 0, 'status-bar').setOrigin(0);
    }

    public create(): void {
        this.init();

        const style = {
            color: 'Black',
            fontSize: '22px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        };
        this.infected = this.scene.add.text(720, 5, "Infected: " + this.stats.getInfectedString(), style).setOrigin(0);
        this.dailyIncome = this.scene.add.text(960, 5, "Income: " + this.stats.getEarningsString(), style).setOrigin(0);
        this.budget = this.scene.add.text(1200, 5, "Budget: " + this.stats.getBudgetString(), style).setOrigin(0);
    }

    public update(): void {
        this.infected.setText("Infected: " + this.stats.getInfectedString());
        this.dailyIncome.setText("Income: " + this.stats.getEarningsString());
        this.budget.setText("Budget: " + this.stats.getBudgetString());
    }

}