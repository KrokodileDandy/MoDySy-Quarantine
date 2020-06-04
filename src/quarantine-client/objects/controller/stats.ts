import { TimeController } from "./timeController";
import { UpgradeController } from "./upgradeController";
import { DifficultyLevel} from "../../util/enums/difficultyLevels";

/**
 * Singleton controller which contains game variables (e.g. budget, population size)
 * and allows manipulation of the same.
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
    private constructor(difficulty: DifficultyLevel) {
        let values;
        if(difficulty == DifficultyLevel.EASY) values = require("./../../../../res/json//difficulty-levels/easy.json");
        else if (difficulty == DifficultyLevel.NORMAL) values = require("./../../../../res/json//difficulty-levels/normal.json");
        else values = require("./../../../../res/json/difficulty-levels/hard.json");
        // STATE VARIABLES
        this.population = values["population"]; //83_149_300: german population in september 2019 (wikipedia)
        this.nbrPolice = this.population * values["portion_of_police"];
        this.nbrHW = this.population * values["portion_of_healthworkers"];
        this.happiness = values["happiness"];
        this.happinessRate = values["happinessRate"];
        this.compliance = values["compliance"];

        // PROBABILITIES / VIRUS VARIABLES
        this.basicInteractionRate = values["basicInteractionRate"];
        this.maxInteractionVariance = values["maxInteractionVariance"];

        // SALARIES
        this.avgSalaryPO = values["avgSalaryPO"]; // @see #79
        this.currentSalaryPO = this.avgSalaryPO;
        this.avgSalaryHW = values["avgSalaryHW"]; // @see #79
        this.currentSalaryHW = this.avgSalaryHW;

        // CONSUMPTION
        this.avgPriceTestKit = values["avgPriceTestKit"]; // @see #79
        this.currentPriceTestKit = this.avgPriceTestKit;
        this.avgPriceVaccination = values["avgPriceVaccination"]; // @see #79
        this.currentPriceVaccination = this.avgPriceVaccination;

        // FINANCE VARIABLES
        this.budget = values["budget"]; // allows to buy 2 upgrades immediately 
        this.maxIncome = values["maxIncome"]; // allows to buy 1 upgrade every 5 days
        this.income = values["income"];
        this.lowerBoundBankruptcy = -200_000;
    }

    /** 
     * @param difficultyLvl Used to instantiate the stats object with different values 
     *                      depending on the difficulty level. This parameter is OPTIONAL!!!
     * @returns The singleton instance 
     */
    public static getInstance(difficultyLvl: DifficultyLevel = null): Stats {
        if (!Stats.instance) Stats.instance = new Stats(difficultyLvl)
        return Stats.instance;
    }

    /**
     * Expands all arrays which store weekly information:  
     * * used vaccines
     * * used test kits
     * * people who died
     * * people who got cured
     * * people who got infected
     * * hired health workers
     * * hired police officers
     * * current level of research
     * * income / expenses at the end of the week
     */
    public updateWeek(incomeStatement: {[id: string]: {[id: string]: number}}): void {
        const currWeek = TimeController.getInstance().getWeeksSinceGameStart();
        this.weeklyVaccines[currWeek] += this.usedVaccinesThisDay;
        this.weeklyTestKits[currWeek] += this.usedTestKitsThisDay;
        
        if (TimeController.getInstance().getDaysSinceGameStart() % 7 == 0) { // one week has passed
            this.weeklyResearch[currWeek] = UpgradeController.getInstance().getCurrentResearchLevel();

            this.weeklyDead.push(0);
            this.weeklyInfected.push(0);
            this.weeklyCured.push(0);
            this.weeklyHW.push(0);
            this.weeklyPolice.push(0);
            this.weeklyResearch.push(0);
            this.weeklyTestKits.push(0);
            this.weeklyVaccines.push(0);

            this.weeklyIncomeStatement.push({
                "inc": {
                    "tax": 0
                },
                "exp": {
                    "spo": 0,
                    "shw": 0,
                    "tk": 0,
                    "v": 0,
                    "ms": 0
                }
            });
        }
        
        this.resetConsumptionCounters();
        this.addIncomeStatement(incomeStatement);
    }

    /** Add the given income statement to the current week of the weekly income statement array */
    private addIncomeStatement(incomeStatement: {[id: string]: {[id: string]: number}}): void {
        const week = TimeController.getInstance().getWeeksSinceGameStart();
        console.log("Week " + week)
        this.weeklyIncomeStatement[week]["inc"]["tax"] += incomeStatement["inc"]["tax"];
        this.weeklyIncomeStatement[week]["exp"]["spo"] += incomeStatement["exp"]["spo"];
        this.weeklyIncomeStatement[week]["exp"]["shw"] += incomeStatement["exp"]["shw"];
        this.weeklyIncomeStatement[week]["exp"]["tk"] += incomeStatement["exp"]["tk"];
        this.weeklyIncomeStatement[week]["exp"]["v"] += incomeStatement["exp"]["v"];
        this.weeklyIncomeStatement[week]["exp"]["ms"] += incomeStatement["exp"]["ms"];
    }

    /**
     * Accumulate the posts of all given income statements and return a new
     * income statement with the accumulated values.
     * @param incomeStatements 
     */
    private accumlateIncomeStatements(incomeStatements: {[id: string]: {[id: string]: number}}[]): void {
        let taxes = 0;
        let poSalary = 0;
        let hwSalary = 0;
        let tks = 0;
        let vs = 0;
        let ms = 0;

        for (let i = 0; i < 7; i++) {
            taxes += incomeStatements[i]["inc"]["tax"];
            poSalary += incomeStatements[i]["exp"]["spo"];
            hwSalary += incomeStatements[i]["exp"]["shw"];
            tks += incomeStatements[i]["exp"]["tk"];
            vs += incomeStatements[i]["exp"]["v"];
            ms += incomeStatements[i]["exp"]["ms"];
        }

        this.weeklyIncomeStatement.push({
            "inc": {
                "tax": taxes
            },
            "exp": {
                "spo": poSalary,
                "shw": hwSalary,
                "tk": tks,
                "v": vs,
                "ms": ms
            }
        });
    }

    /**
     * Store the numbers of used test kits and vaccines of the day into the respective
     * arrays and reset the counters. If a week has passed, a new field is generated in
     * each array.
     */
    private resetConsumptionCounters(): void {
        this.usedVaccinesThisDay = 0;
        this.usedTestKitsThisDay = 0;
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
    /**
     * Number of currently, unknowingly infected citizens.
     */
    public unknowinglyInfected = 0;
    /** Wether the first infected citizen was detected (with a test kit) or not */
    public firstCaseFound = false;

    /** Number of police officers */
    public nbrPolice: number;
    /** Number of health workers */
    public nbrHW: number;

    /** Overall happiness of the population between 0 and 100.00 */
    public happiness: number;
    /** Current happiness tendency (by default the value is 0) */
    public happinessRate: number;
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
    /** Average price of a virus vaccination in EURO (rounded) */
    public readonly avgPriceVaccination: number;
    /** Current price of a virus vacination in EURO (rounded) */
    public currentPriceVaccination: number;
    /** Used vaccines since the start of the day */
    private usedVaccinesThisDay = 0;

    // ----------------------------------------------------------------- FINANCE VARIABLES
    /** Available money in EURO */
    public budget: number;
    /** Maximum reachable income */
    public maxIncome: number;
    /** Current income per tic */
    public income: number;

    /** Income statement of the current week */
    private incomeStatements = [{
        "inc": {
            "tax": 0
        },
        "exp": {
            "spo": 0,
            "shw": 0,
            "tk": 0,
            "v": 0,
            "ms": 0
        }
    }];

    // ----------------------------------------------------------------------- WEEKLY LOGS
    /** Number of infected people each week */
    private weeklyInfected = [0];
    /** Number of cured people each week */
    private weeklyCured = [0];
    /** Number of people who died each week */
    private weeklyDead = [0];
    /** Number of hired health workers each week */
    private weeklyHW = [0];
    /** Number of hired police officers each week */
    private weeklyPolice = [0];
    /** The level of research at the end of the week */
    private weeklyResearch = [0];
    /** The income statement each week */
    private weeklyIncomeStatement = [{
        "inc": {
            "tax": 0
        },
        "exp": {
            "spo": 0,
            "shw": 0,
            "tk": 0,
            "v": 0,
            "ms": 0
        }
    }];
    /** Number of used test kits each week */
    private weeklyTestKits = [0];
    /** Number of used vaccines each week */
    private weeklyVaccines = [0];
    /** When this lower bound is reached, the game should be lost */
    public lowerBoundBankruptcy: number;


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

    /** @returns prices for all bought test kits of the current day */
    public getDailyTestKitsExpense(): number {return this.usedTestKitsThisDay * this.currentPriceTestKit;}

    /** @returns prices for all bought vaccines of the current day */
    public getDailyVaccinesExpense(): number {return this.usedVaccinesThisDay * this.currentPriceVaccination;}

    /** @returns prices for all bought test kits of the current week */
    public getWeeklyTestKitsExpense(): number {return this.weeklyTestKits[this.weeklyTestKits.length - 1] * this.currentPriceTestKit;}

    /** @returns prices for all bought vaccines of the current week */
    public getWeeklyVaccinesExpense(): number {return this.weeklyVaccines[this.weeklyVaccines.length - 1] * this.currentPriceVaccination;}

    /**
     * Returns an array of all weekly stats for the given week in the following order:  
     * 1. Infected
     * 2. Cured  
     * 3. Dead  
     * 4. Hired health workers
     * 5. Hired police officers
     * 6. Research level
     * 7. Income statement
     * 8. Used test kits
     * 9. Used vaccines
     * @param week The week for which to return the information
     * @returns Array of numbers
     */
    public getWeeklyStats(week: number): (number | {[id: string]: {[id: string]: number}})[] {
        return [
            this.weeklyInfected[week] * this.populationFactor,
            this.weeklyCured[week] * this.populationFactor,
            this.weeklyDead[week] * this.populationFactor,
            this.weeklyHW[week] * this.populationFactor,
            this.weeklyPolice[week] * this.populationFactor,
            this.weeklyResearch[week],
            this.weeklyIncomeStatement[week], // ATTENTION! this is a dictionary, not a number!
            this.weeklyTestKits[week],
            this.weeklyVaccines[week]
        ];
    }


    // ------------------------------------------------------------------ SETTER-METHODS
    /** Increase deceased counter by one and decrease infected and population counter by one */
    public deceasedCitizen(): void {
        this.weeklyDead[TimeController.getInstance().getWeeksSinceGameStart()]++;
        this.deceased++;
        this.population--;
        this.infected--;
    }

    /** Increase infected counter by one */
    public foundInfected(): void {
        this.weeklyInfected[TimeController.getInstance().getWeeksSinceGameStart()]++;
        this.infected++;
        this.unknowinglyInfected--;
    }

    /** Decrease infected counter by one and consume one vaccine */
    public cureInfected(): void {
        this.infected--;
        this.vaccineUsed();
    }

    /** Increase unknowingly infected counter by one */
    public addUnknowinglyInfected(): void {
        this.unknowinglyInfected++;
    }

    /** Decrease unknowingly infected counter by one and consume one vaccine */
    public cureUnknowinglyInfected(): void {
        this.unknowinglyInfected--;
        this.vaccineUsed();
    }

    /** Increases the Stats variable nbrPolice
     * @param amt Number of new police officers
     */
    public increasePoliceOfficers(amt: number): void {
        this.weeklyPolice[TimeController.getInstance().getWeeksSinceGameStart()] += amt;
        this.nbrPolice += amt;
    }

    /** Increases the Stats variable nbrHW
     * @param amt Number of new health workers
     */
    public increaseHealthWorkers(amt: number): void {
        this.weeklyHW[TimeController.getInstance().getWeeksSinceGameStart()] += amt;
        this.nbrHW += amt;
    }

    /** Increse the test kit counter for the current day by one */
    public testKitUsed(): void {
        this.weeklyTestKits[TimeController.getInstance().getWeeksSinceGameStart()] += this.populationFactor;
        this.usedTestKitsThisDay += this.populationFactor;
    }

    /** Increse the vaccine counter for the current day by one */
    public vaccineUsed(): void {
        this.weeklyVaccines[TimeController.getInstance().getWeeksSinceGameStart()] += this.populationFactor;
        this.usedVaccinesThisDay += this.populationFactor;
    }
    
}