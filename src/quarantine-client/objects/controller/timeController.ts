import 'phaser';
import { TimeSubscriber } from '../../util/timeSubscriber';

/**
 * Singleton controller which simulates ingame time. It acts as the central 
 * coordinator of the all time related logic and is a publisher (Pub/Sub) for
 * Phaser.GameObjects who want to get notfied about time changes.
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class TimeController {

    /** Tics per day */
    private readonly ticsPerDay = 24;

    /** Tics since  */
    private ticAccumulator = 0;

    /** Hours passed since game start */
    private hoursSinceGameStart = 0;

    /** Last day played */
    private lastDayPlayed = 0;

    /** All registered subscribers of this publisher (Pub/Sub) */
    private subscribers = [];

    /** The only existing instance of TimeController */
    private static instance: TimeController;

    private constructor() {
        // needed to allow singleton properties
    }

    /**
     * Gets called with every phaser3 tic and counts ingame hours since game start.
     * Calls the notify function on all subscribers of this controller when a whole
     * day has passed.
     * @see TimeSubscriber
     */
    public tic(): void {
        this.ticAccumulator += 1;
        if (this.ticAccumulator % 10 == 0) this.hoursSinceGameStart++;
        if (this.ticAccumulator == this.ticsPerDay*10) {
            this.ticAccumulator = 0.0;
            this.subscribers.forEach(s => s.notify());
        }
        console.log(this.ticAccumulator);
    }

    /**
     * Subscribe to the TimeController (Pub/Sub) to get notified about changes in time.
     * @param subscriber Expects a Phaser.GameObject if this object wants to be notfied about time changes
     */
    public subscribe(subscriber: TimeSubscriber): TimeController {
        this.subscribers.push(subscriber);
        return this;
    }

    // ----------------------------------------------------------------- GETTER-METHODS
    /** 
     * Returns the only existing singleton instance of this controller
     * @returns The singleton instance
     */
    public static getInstance(): TimeController {
        if (!TimeController.instance) TimeController.instance = new TimeController();
        return TimeController.instance;
    }

    /** @returns Tics per day */
    public getTicsPerDay(): number {return this.ticsPerDay;}

    /** @returns Hous passed since game start */
    public getHoursSinceGameStart(): number {return this.hoursSinceGameStart}

    /** @returns Days passed since game start */
    public getDaysSinceGameStart(): number {return Math.floor(this.hoursSinceGameStart / 24)}
}