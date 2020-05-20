/**
 * Singleton controller which contains game variables (e.g. budget, population size)
 * @author Sebastian Führ
 * @author Marvin Kruber
 */
export class Stats {

    /** The only existing instance of Controller */
    private static instance: Stats;

    /**
     * Different difficulty levels can be reached through defining different
     * values for nbrPolice, budget, income...
     */
    private constructor() {
        // STATE VARIABLES
        this.population = 1_620_000; //83_149_300: german population in september 2019 (wikipedia)
        this.deceased = 0;
        this.infected = 0;
        this.nbrPolice = this.population * 0.01;
        this.nbrHW = this.population * 0.01;
        this.happiness = 100.00;
        this.compliance = 100.00;

        // PROBABILITIES / VIRUS VARIABLES
        this.basicInteractionRate = 0.1;
        this.maxInteractionVariance = 0.05;

        // FINANCE VARIABLES
        this.budget = 2_000_000_000; // allows to buy 2 upgrades immediately 
        this.maxIncome = 100_000_000; // allows to buy 1 upgrade every 5 days
        this.income = this.maxIncome;
    }

    /** @returns The singleton instance */
    public static getInstance(): Stats {
        if (!Stats.instance) Stats.instance = new Stats()
        return Stats.instance;
    }

    
    // ------------------------------------------------------------------- STATE VARIABLES    
    /** Population of the country the player is playing in */
    public population: number;
    /** Number of deceased people since the game started */
    public deceased;
    /** 
     * Number of currently infected people (known cases). 
     * The game starts with 0 agents with the status INFECTED, but
     * a specific number of agents have the status UNKNOWINGLY_INFECTED.
     */
    public infected;

    /** Number of police officers */
    public nbrPolice: number;
    /** Number of health workers */
    public nbrHW: number;

    /** Overall happiness of the population between 0 and 100.00 */
    public happiness: number;
    /** Compliance of the population between 0 and 100.00 */
    public compliance: number;


    // --------------------------------------------------- PROBABILITIES / VIRUS VARIABLES
    /** 
     * Basic interaction rate which is used to calculate the number of
     * interactions per tic.
     */
    public basicInteractionRate;
    /** Upper bound of the randomly generated interaction variance. */
    public maxInteractionVariance;


    // ----------------------------------------------------------------- FINANCE VARIABLES
    /** Available money in EURO */
    public budget: number;
    /** Maximum reachable income */
    public maxIncome: number;
    /** Current income per tic */
    public income: number;
    
}