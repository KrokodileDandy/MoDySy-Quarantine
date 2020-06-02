import { LogBookView } from "../../scenes/logBookView";
import { TimeController } from "./timeController";
import { Stats } from "./stats";

/**
 * The log book which stores statistical information about all passed
 * in-game weeks and allows to be opened inside a popup. This class
 * is implemented as a singleton.
 * @author Sebastian Führ
 */
export class LogBook {

    /** The only existing instance of this singleton */
    private static instance: LogBook;

    private textStatPosY;
    private textFinanceIncPosY;
    private textFinanceExpPosY;

    private scene: Phaser.Scene;

    private constructor() {
        //
    }

    /** 
     * @param scene Phaser scene where the sub menu should open
     * @returns the only existing instance of this singleton
     */
    public static getInstance(): LogBook {
        if (!this.instance) this.instance = new LogBook();
        return this.instance;
    }

    /**
     * Generates a phaser 3 text element which is positioned dynamically inside
     * the look book.
     * @param name The name of the position
     * @param value The value
     */
    private getStatTextEl(name: string, value: number): Phaser.GameObjects.Text {
        const temp = new Phaser.GameObjects.Text(
            this.scene,
            400, 
            this.textStatPosY, 
            name + ": " + value, 
            { color: 'Black', fontSize: '18px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        );
        this.textStatPosY += 32;
        return temp;
    }

    /**
     * Generates a phaser 3 text element which is positioned dynamically inside
     * the look book.
     * @param name The name of the position
     * @param value The value
     */
    private getFinanceTextEl(name: string, value: number, offset = 0): Phaser.GameObjects.Text {
        let posY: number;
        if (offset == 0) posY = this.textFinanceIncPosY;
        else posY = this.textFinanceExpPosY;
        const temp = new Phaser.GameObjects.Text(
            this.scene,
            1070 + offset, 
            posY, 
            name + ": " + value + " €", 
            { color: 'Black', fontSize: '18px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        );
        if (offset == 0) this.textFinanceIncPosY += 32;
        else this.textFinanceExpPosY += 32;
        return temp;
    }

    /**
     * Adds statistical information to the log book view.
     * @param lbView 
     * @param info 
     */
    private generateLogBookStats(lbView: LogBookView, info: (number | {[id: string]: {[id: string]: number}})[]): void {
        this.textStatPosY = 160;
        const arr = [];
        arr.push(this.getStatTextEl("Infected", Number(info[0])));
        arr.push(this.getStatTextEl("Cured", Number(info[1])));
        arr.push(this.getStatTextEl("Death", Number(info[2])));
        arr.push(this.getStatTextEl("Health Workers", Number(info[3])));
        arr.push(this.getStatTextEl("Police Officers", Number(info[4])));
        arr.push(this.getStatTextEl("Research Level", Number(info[5])));

        arr.push(this.getStatTextEl("Used Test Kits", Number(info[7])));
        arr.push(this.getStatTextEl("Used Vaccines", Number(info[8])));
        
        lbView.addGameObjects(arr);
    }

    private generateLogBookIncomeStatement(lbView: LogBookView, info: (number | {[id: string]: {[id: string]: number}})[]): void {
        // Reset y position counters
        this.textFinanceExpPosY = 160;
        this.textFinanceIncPosY = 160;

        const offset = 250;
        const arr = [];

        // headings
        arr.push(new Phaser.GameObjects.Text(
            this.scene,
            1050, 
            this.textFinanceIncPosY - 37, 
            "Income", 
            { color: 'Black', fontSize: '22px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        ));
        arr.push(new Phaser.GameObjects.Text(
            this.scene,
            1300, 
            this.textFinanceExpPosY - 37, 
            "Expenses", 
            { color: 'Black', fontSize: '22px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        ));

        // income statement
        arr.push(this.getFinanceTextEl("Taxes", Number(info[6]["inc"]["tax"])));
        arr.push(this.getFinanceTextEl("Salary Police Officers", Number(info[6]["exp"]["spo"]), offset));
        arr.push(this.getFinanceTextEl("Salary Health Workers", Number(info[6]["exp"]["shw"]), offset));
        arr.push(this.getFinanceTextEl("Test Kits Total", Number(info[6]["exp"]["tk"]), offset));
        arr.push(this.getFinanceTextEl("Vaccines Total", Number(info[6]["exp"]["v"]), offset));
        arr.push(this.getFinanceTextEl("Costs for Measures", Number(info[6]["exp"]["ms"]), offset));

        // total
        let tempY;
        if (this.textFinanceIncPosY > this.textFinanceExpPosY) tempY = this.textFinanceIncPosY;
        else tempY = this.textFinanceExpPosY;
        arr.push(new Phaser.GameObjects.Text(
            this.scene,
            1050, 
            tempY, 
            info[6]["inc"]["tax"], 
            { color: 'Black', fontSize: '22px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        ));
        arr.push(new Phaser.GameObjects.Text(
            this.scene,
            1300, 
            tempY, 
            info[6]["exp"]["spo"] + info[6]["exp"]["shw"] + info[6]["exp"]["tk"] + info[6]["exp"]["v"] + info[6]["exp"]["ms"], 
            { color: 'Black', fontSize: '22px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        ));

        lbView.addGameObjects(arr);
    }

    /**
     * Creates a popup with information regarding the specified week.
     * @param week The current in-game time week.
     */
    private createLogBookView(week: number): LogBookView {
        const lbView = new LogBookView(this.scene, week);
        const info = Stats.getInstance().getWeeklyStats(week);

        this.generateLogBookStats(lbView, info);
        this.generateLogBookIncomeStatement(lbView, info);
        
        return lbView;
    }

    /**
     * Opens the sub menu in the current week
     * @param scene The scene in which the sub scene should be displayed
     */
    public open(scene: Phaser.Scene): void {
        this.scene = scene;
        this.createLogBookView(TimeController.getInstance().getWeeksSinceGameStart()).createModal();
    }

    /**
     * @param currWeek The current in-game time week.
     * @returns wether the operation can be performed
     */
    public showNextWeek(currWeek: number): boolean {
        if (TimeController.getInstance().getWeeksSinceGameStart() == currWeek) return false;
        this.createLogBookView(currWeek + 1).createModal();
        return true;
    }

    /**
     * @param currWeek The current in-game time week.
     * @returns wether the operation can be performed
     */
    public showPrevWeek(currWeek: number): boolean {
        if (currWeek == 0) return false;
        this.createLogBookView(currWeek - 1).createModal();
        return true;
    }

}