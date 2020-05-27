import { TimeSubscriber } from "../../util/timeSubscriber";
import { TimeController } from "./timeController";
import { EventRarity } from "../../util/enums/eventRarity";

/**
 * Singleton controller which implements application logic for events.
 * @author Sebastian Führ
 * @author Marvin Kruber
 */
export class EventController implements TimeSubscriber {

    /** The only existing instance of this controller */
    private static instance: EventController;

    private timeSpanCommon: number;
    private timeSpanRare: number;
    private timeSpanVeryRare: number;
    private timeSpanEpic: number;
    private timeSpanLegendary: number;

    private constructor() {
        TimeController.getInstance().subscribe(this);


    }

    /** @see TimeSubscriber */
    notify(): void {
        this.decreaseEventCounters();
        if (!this.timeSpanLegendary) {
            //
        } else if (!this.timeSpanEpic) {
            //
        } else if (!this.timeSpanVeryRare) {
            //
        } else if (!this.timeSpanRare) {
            //
        } else if (!this.timeSpanCommon) {
            //
        }
        this.resetTriggeredEventCounters();
    }

    /**
     * Reduces all event counters by one.
     */
    private decreaseEventCounters(): void {
        this.timeSpanLegendary--;
        this.timeSpanEpic--;
        this.timeSpanVeryRare--;
        this.timeSpanRare--;
        this.timeSpanCommon--;
    }

    /**
     * Checks wether there are event counters which
     * reached zero to recalculate them accordingly.
     */
    private resetTriggeredEventCounters(): void {
        if (!this.timeSpanLegendary) this.calcRanTimeSpan(EventRarity.LEGENDARY);
        if (!this.timeSpanEpic) this.calcRanTimeSpan(EventRarity.EPIC);
        if (!this.timeSpanVeryRare) this.calcRanTimeSpan(EventRarity.VERY_RARE);
        if (!this.timeSpanRare) this.calcRanTimeSpan(EventRarity.RARE);
        if (!this.timeSpanCommon) this.calcRanTimeSpan(EventRarity.COMMON);
    }

    /**
     * Generates a random integer between min and max (inclusive).
     * @param min 
     * @param max 
     * https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/math.random
     */
    private getRandomIntInclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; 
    } 

    /**
     * Calculates a semi-random timespan for the given event rarity level.
     * @param level event rarity level
     */
    private calcRanTimeSpan(level: EventRarity): void {
        switch (level) {
            case EventRarity.COMMON:
                this.timeSpanCommon = this.getRandomIntInclusive(3, 7);
                break;
            case EventRarity.RARE:
                this.timeSpanRare = this.getRandomIntInclusive(8, 13);
                break;
            case EventRarity.VERY_RARE:
                this.timeSpanVeryRare = this.getRandomIntInclusive(14, 20);
                break;
            case EventRarity.EPIC:
                this.timeSpanEpic = this.getRandomIntInclusive(21, 30);
                break;
            case EventRarity.LEGENDARY:
                this.timeSpanLegendary = this.getRandomIntInclusive(31, 40);
                break;
            default:
                throw new Error("Unknown EventRarity enum received. How did you do this?!?");
        }
    }

    // ----------------------------------------------------------------- GETTER-METHODS
    /** @returns The singleton instance */
    public static getInstance(): EventController {
        if (!EventController.instance) EventController.instance = new EventController();
        return EventController.instance;
    }

}