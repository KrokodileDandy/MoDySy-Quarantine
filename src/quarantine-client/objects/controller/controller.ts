import {Agent} from '../agent';
import {Citizen} from '../citizen';
import {Police} from '../police';
import {Role} from '../../util/roles';
import { State } from '../../util/healthStates';

/**
 * Singleton controller
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
class Controller {
    /** Nested class to encapsulate statistical information. */
    private stats = new class Stats {
        /** Available money in EURO */
        public budget: number;
        /** Income per tic */
        public income: number;
    
        /** Population of the country the player is playing in */
        public population: number;
    
        /** Amount of police officers. */
        public amtPolice: number;
        /** Amount of health workers */
        public amtHW: number;
    
        // --------------------------------------------------- PROBABILITIES
        /** Probability that two selected agents interact with each other. */
        public interactionProb: number;
    }

    /** The only existing instance of Controller */
    private static instance: Controller;

    /** Tics per day */
    private readonly ticsPerDay = 24;
 
    /** All population protocol agents of the game. */
    private agents: Agent[];

    /**
     * Different difficulty levels can be reached through defining different
     * values for amtPolice, budget, income...
     */
    private constructor() { // Place to import game options?
        this.stats.population = 83_149_300; // german population in september 2019 (wikipedia)
        this.stats.budget = 2_000_000;
        this.stats.income = 30_000;

        let remainingPolice = this.stats.amtPolice;
        for (let i = 0; i < this.stats.population; i++) {
            if (remainingPolice > 0
                && (Math.random() > (this.stats.amtPolice / this.stats.population) // random generation of agents OR
                    || remainingPolice === this.stats.population - i)) {     // remaining amount of agents has to be filled by police officers
                this.agents[i] = new Police();
                remainingPolice--;
            } else {
                this.agents[i] = new Citizen();
            }

            this.distributeRandomlyInfected(0.02 * this.stats.population); // TODO change starting amount of infected people
        }
    }

    /**
     * 
     */
    public introduceCure(price: number): Agent[] {
        return null; // TODO
    }

    /**
     * 
     * @param amt Amount of new workers
     */
    private distributeNewRoles(amt: number, role: Role): Agent[] {
        for (let i = 0; i < amt; i++) {
            const idx = this.getRandomIndex();
        }
        return this.agents;
    }

    /**
     * Randomly assigns agents as 'UNKNOWINGLY_INFECTED'
     * @param amt Amount of agents to change the state
     */
    private distributeRandomlyInfected(amt: number) {
        let i = 0;
        while (i < amt) {
            const idx = this.getRandomIndex();
            if (this.agents[idx].healthState == State.HEALTHY) {
                this.agents[idx].healthState = State.UNKNOWINGLY_INFECTED;
                i++;
            }
        }
    }

    /** Returns a random integer value between 0 and the current population number. */
    private getRandomIndex(): number {return Math.floor(Math.random() * this.stats.population);}

    /** Returns the single instance of Controller. */
    public static getInstance(): Controller {
        if (!Controller.instance) Controller.instance = new Controller();
        return Controller.instance;
    }

    /** Returns amount of budget currently available */
    public getBudget(): number {return this.stats.budget;}

    /** Returns current income per tic */
    public getIncome(): number {return this.stats.income;}
}