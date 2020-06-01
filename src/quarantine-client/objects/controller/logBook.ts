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
     * Creates a popup with information regarding the specified week.
     * @param week The current in-game time week.
     */
    private createLogBookView(week: number): LogBookView {
        const lbView = new LogBookView(this.scene, week);
        const info = Stats.getInstance().getWeeklyStats(week);

        const arr = [];
        arr.push(new Phaser.GameObjects.Text(
            this.scene,
            400, 
            160, 
            "Infected: " + info[0], 
            { color: 'Black', fontSize: '18px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        ));

        lbView.addGameObjects(arr);
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