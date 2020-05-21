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
        this.nbrPolice = this.population * 0.01;
        this.nbrHW = this.population * 0.01;
        this.happiness = 100.00;
        this.compliance = 100.00;

        // PROBABILITIES / VIRUS VARIABLES
        this.basicInteractionRate = 0.1;
        this.maxInteractionVariance = 0.05;

        // SALARIES
        this.avgSalaryPO = 114; // @see #79
        this.currentSalaryPO = this.avgSalaryPO;
        this.avgSalaryHW = 83; // @see #79
        this.currentSalaryHW = this.avgSalaryHW;

        // CONSUMPTION
        this.avgPriceTestKit = 44; // @see #79
        this.currentPriceTestKit = this.avgPriceTestKit;
        this.avgPriceVaccination = 51; // @see #79
        this.currentPriceVaccination = this.avgPriceVaccination;

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
    /** Scale factor to multiply with population numbers to simulate real population numbers */
    private readonly populationFactor = 50;  
    /** Population of the country the player is playing in */
    public population: number;
    /** Number of deceased people since the game started */
    public deceased = 0;
    /** 
     * Number of currently infected people (known cases). 
     * The game starts with 0 agents with the status INFECTED, but
     * a specific number of agents have the status UNKNOWINGLY_INFECTED.
     */
    public infected = 0;

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
    public basicInteractionRate: number;
    /** Upper bound of the randomly generated interaction variance. */
    public maxInteractionVariance: number;

    // -------------------------------------------------------------------------- SALARIES
    /** Average salary of a police officer per day in EURO (rounded) (month = 31 days) */
    public readonly avgSalaryPO: number;
    /** Current salary of a police officer per day in EURO (rounded) (month = 31 days) */
    public currentSalaryPO: number;
    /** Average salary of a health worker per day in EURO (rounded) (month = 31 days) */
    public readonly avgSalaryHW: number;
    /** Current salary of a health worker per day in EURO (rounded) (month = 31 days) */
    public currentSalaryHW: number;

    // ----------------------------------------------------------------------- CONSUMPTION
    /** Average price of a virus test kit in EURO (rounded) */
    public readonly avgPriceTestKit: number;
    /** Current price of a virus test kit in EURO (rounded) */
    public currentPriceTestKit: number;
    /** Used test kits since the stat of the day */
    private usedTestKitsThisDay = 0;
    /** Used test kits per week */
    public usedTestKits: Array<number>;
    /** Average price of a virus vaccination in EURO (rounded) */
    public readonly avgPriceVaccination: number;
    /** Current price of a virus vacination in EURO (rounded) */
    public currentPriceVaccination: number;
    /** Used vaccines per week */
    public usedVaccines: Array<number>;
    /** Used vaccines since the start of the day */
    private usedVaccinesThisDay = 0;

    // ----------------------------------------------------------------- FINANCE VARIABLES
    /** Available money in EURO */
    public budget: number;
    /** Maximum reachable income */
    public maxIncome: number;
    /** Current income per tic */
    public income: number;

    // -------------------------------------------------------------------- GETTER-METHODS
    /** @returns Current population number */
    public getPopulation(): number {return this.population * this.populationFactor;}

    /** @returns Number of deceased people since game start */
    public getDeceased(): number {return this.deceased * this.populationFactor;}

    /**
     * The number does not include agents with the state UNKNOWINGLY_INFECTED 
     * @returns Number of currently infected people
     */
    public getInfected(): number {return this.infected * this.populationFactor;}

    /** @returns Number of police officers */
    public getNumberOfPolice(): number {return this.nbrPolice * this.populationFactor;}

    /** @returns Number of health workers */
    public getNumberOfHealthWorkers(): number {return this.nbrHW * this.populationFactor;}

    /** @returns salary for all health workers */
    public getHWSalary(): number {return this.nbrHW * this.currentSalaryHW;}

    /** @returns salary for all police officers */
    public getPOSalary(): number {return this.nbrPolice * this.currentSalaryPO;}

    /** @returns prices for all bought test kits of the current week */
    public getTestKitsPrices(): number {return this.usedTestKits[this.usedTestKits.length - 1];}

    /** @returns prices for all bought vaccines of the current week */
    public getVaccinesPrices(): number {return this.usedVaccines[this.usedVaccines.length - 1];}

    // ------------------------------------------------------------------ SETTER-METHODS
    /** Increase deceased counter by one and decrease infected and population counter by one */
    public deceasedCitizen(): void {
        this.deceased++;
        this.population--;
        this.infected--;
    }

    /** Increase infected counter by one */
    public foundInfected(): void {
        this.infected++;
    }

    /** Increases the Stats variable nbrPolice
     * @param amt Number of new police officers
     */
    public increasePoliceOfficers(amt: number): void {this.nbrPolice += amt;}

    /** Increases the Stats variable nbrHW
     * @param amt Number of new health workers
     */
    public increaseHealthWorkers(amt: number): void {this.nbrHW += amt;}

    /** Increse the test kit counter for the current day by one */
    public testKitUsed(): void {this.usedTestKitsThisDay++;}

    /** Increse the vaccine counter for the current day by one */
    public vaccineUsed(): void {this.usedVaccinesThisDay++;}
    
}