/**
 * Singleton controller
 */
class Controller {
    /** The only existing instance of Controller */
    private static instance: Controller;

    /** Available money */
    private money: number;

    private constructor() { // Place to import game options?

    }

    /** Returns the single instance of Controller. */
    public static getInstance(): Controller {
        if (!Controller.instance) Controller.instance = new Controller();
        return Controller.instance;
    }

    /** Returns amount of money currently available */
    public getMoney(): number {return this.money;}
}