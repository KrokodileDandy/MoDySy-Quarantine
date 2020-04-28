import {Agent} from '../agent';
import {Citizen} from '../citizen';
import {Police} from '../police';

/**
 * Singleton controller
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
class Controller {
    /** The only existing instance of Controller */
    private static instance: Controller;

    /** Tics per day */
    private readonly ticsPerDay = 24;

    // --------------------------------------------------------------- OPTIONS
    /** Available money in EURO */
    private budget: number;
    /** Income per tic */
    private income: number;
    /** Population of the country the player is playing in */
    private population: number;
    /** Amount of police officers. */
    private amtPolice: number;

    // PROBABILITIES
    /** Probability that two selected agents interact with each other. */
    private interactionProb: number;

    /** All population protocol agents of the game. */
    private agents: Agent;



    /**
     * Different difficulty levels can be reached through defining different
     * values for amtPolice, budget, income...
     */
    private constructor() { // Place to import game options?
        this.budget = 2_000_000;
        this.income = 30_000;

        let i: number;
        let remainingPolice = this.amtPolice;
        for (i = 0; i < this.population; i++) {
            if (remainingPolice > 0
                && (Math.random() > (this.amtPolice / this.population) // random generation of agents OR
                    || remainingPolice === this.population - i)) {     // remaining amount of agents has to be filled by police officers
                this.agents[i] = new Police();
                remainingPolice--;
            } else {
                this.agents[i] = new Citizen();
            }
        }
    }

    /** Returns the single instance of Controller. */
    public static getInstance(): Controller {
        if (!Controller.instance) Controller.instance = new Controller();
        return Controller.instance;
    }

    /** Returns amount of budget currently available */
    public getBudget(): number {return this.budget;}

    /** Returns current income per tic */
    public getIncome(): number {return this.income;}
}