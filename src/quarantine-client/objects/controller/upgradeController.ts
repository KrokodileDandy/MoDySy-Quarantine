import { Controller } from "./controller";
import { State } from "../../util/healthStates";
import { Rule } from "./rule";
import { Role } from "../../util/roles";
import { Stats } from "./stats";
import { TimeSubscriber } from "../../util/timeSubscriber";
import { TimeController } from "./timeController";


/**
 * Singleton controller to manage application logic which is linked to upgrades
 * and financial tasks.
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class UpgradeController implements TimeSubscriber {

    /** Anonymous class to encapsulate game variables. */
    private stats: Stats;

    /** The only existing instance of UpgradeController */
    private static instance: UpgradeController;
    /** Instance of central singleton controller */
    private contr: Controller;

    /**
     * Array of all available measures <name of measure> [<dictionary key of measure>]:
     * * Social Distancing [sc]
     * * Lock Down [ld]
     */
    public measures: {[id: string]: {[id: string]: boolean | string | number}} = {
        "sc": {
            "name": "Social Distancing",
            "active": false,
            "description": "SD description",
            "daily_cost": 100_000
        },
        "ld": {
            "name": "Lock Down",
            "active": false,
            "description": "LD description",
            "daily_cost": 100_000
        }
    };

    private constructor() {
        this.stats = Stats.getInstance();

        this.contr = Controller.getInstance();

        TimeController.getInstance().subscribe(this);
    }

    // ----------------------------------------------------------------- UPGRADE - PUBLIC
    /**
     * Inserts a number of health workers into the agents array and adds rules regarding the state 'CURE'.
     * This method is required to call before the buyHealthWorkers-method. Otherwise the agents array
     * will have health workers but they won't do anything. (Because the transition rules are not yet
     * defined.)
     * @param uC UpgradeController needed for closure {@see menu.ts#buildClosure}
     * @returns Boolean if the operation was successful, false if there are not enough people left to become health workers
     */
    public introduceCure(uC: UpgradeController): boolean {
        const numberOfNewAgents = 100_000;
        const price = numberOfNewAgents * 5_000; // = 500_000_000

        // There should be enough people left to become health workers
        if (this.stats.getPopulation() - this.stats.getNumberOfHealthWorkers() - this.stats.getNumberOfPolice() < numberOfNewAgents) return false;

        if(uC.isSolvent(price)) {
            uC.buyItem(price);

            const lastRule = uC.contr.getRules().length;
            uC.contr.getRules()[lastRule] = new Rule(State.HEALTHY, State.CURE, State.IMMUNE, State.CURE);
            uC.contr.getRules()[lastRule] = new Rule(State.INFECTED, State.CURE, State.IMMUNE, State.CURE);
            uC.contr.getRules()[lastRule] = new Rule(State.UNKNOWINGLY_INFECTED, State.CURE, State.IMMUNE, State.CURE);

            uC.contr.distributeNewRoles(numberOfNewAgents, Role.HEALTH_WORKER);
            this.stats.increaseHealthWorkers(numberOfNewAgents);
            return true;
        } else return false;
    }

    /**
     * Insert a number of police officers into the agents array
     * @param uC UpgradeController needed for closure {@see menu.ts#buildClosure}
     */
    public buyPoliceOfficers(uC: UpgradeController): boolean {
        const amt = 100_000;
        const price = amt * 5_000; // = 500_000_000
        if(uC.isSolvent(price) && uC.contr.distributeNewRoles(amt, Role.POLICE)) {
            uC.buyItem(price);
            this.stats.increasePoliceOfficers(amt);
            return true;
        } else return false;
    }

    /**
     * Insert a number of health workers into the agents array
     * @param uC UpgradeController needed for closure {@see menu.ts#buildClosure}
     */
    public buyHealthWorkers(uC: UpgradeController): boolean {
        const amt = 100_000;
        const price = amt * 5_000; // = 500_000_000
        if(uC.isSolvent(price) && uC.contr.distributeNewRoles(amt, Role.HEALTH_WORKER)) {
            uC.buyItem(price);
            this.stats.increaseHealthWorkers(amt);
            return true;
        } else return false;
    }

    /**
     * Insert a number of health workers into the agents array with the state
     * TEST_KIT to allow detection of UNKNOWINGLY_INFECTED agents.
     * @param uC UpgradeController needed for closure {@see menu.ts#buildClosure}
     */
    public buyTestKitHWs(uC: UpgradeController): boolean {
        const amt = 100_000;
        const price = amt * 5_000; // = 500_000_000
        if(uC.isSolvent(price) && uC.contr.distributeNewRoles(amt, Role.HEALTH_WORKER, true)) {
            uC.buyItem(price);
            this.stats.increaseHealthWorkers(amt);
            return true;
        } else return false;
    }

    /** @see TimeSubscriber */
    public notify(): void {
        this.updateCompliance();
        this.updateBudget(this.calculateIncome(), this.calculateExpenses());

        this.printDailyIncomeStatement();

        this.stats.resetConsumptionCounters();
    }

    /**
     * Returns the income statement of the current day as a dictionary consisting of two dictionaries.
     * 
     * ---
     * __Key-value pairs:__  
     * * inc: <income dictionary>
     *   * tax: <taxes>
     * * exp: <expenses dictionary>
     *   * spo: <salary police officer>
     *   * shw: <salary health workers>
     *   * tk: <bought test kits>
     *   * v: <bought vaccines>
     *   * ms: <costs of all active measures>
     * 
     * ---
     * __Example usage:__  
     * Acces to the money spend for the salary of police officers through 
     * `getIncomeStatement()["exp"]["spo"];`
     * 
     * ---
     * @returns Dictionary of two dictionaries "Earnings" and "Expenses"
     * @see #calculateMeasureExpenses()
     */
    public getIncomeStatement(): {[id: string]: {[id: string]: number}} { // .toLocaleString("es-ES") + " €"
        return {
            "inc": {
                "tax": this.stats.income
            },
            "exp": {
                "spo": this.stats.getPOSalary(),
                "shw": this.stats.getHWSalary(),
                "tk": this.stats.getDailyTestKitsExpense(),
                "v": this.stats.getDailyVaccinesExpense(),
                "ms": this.calculateMeasureExpenses()
            }
        };
    }

    /**
     * Print the income statement of the current day onto the console.
     */
    public printDailyIncomeStatement(): void {
        console.log("Day: " + TimeController.getInstance().getDaysSinceGameStart());
        const dict = this.getIncomeStatement();

        for (const key in dict) {
            const value = dict[key];
            console.log(`${key}----------------------------------`);
            for (const k2 in value) {
                const v2 = value[k2];
                console.log(`    ${k2}: ${v2.toLocaleString("es-ES")} €`);
            }
        }
        console.log("Total: " + (this.calculateIncome() - this.calculateExpenses()).toLocaleString("es-ES") + " €");
    }

     // ----------------------------------------------------------------- UPGRADE - PRIVATE
    /**
     * Calculate the compliance depending on the populations happiness
     * 
     * | Happiness | Compliance|  
     * | ----- | ----- |
     * |       100 |       100 |  
     * |        50 |      45.4 |  
     * |         0 |        10 |
     */
    private updateCompliance(): number {
        return this.stats.compliance = 19/4950 * Math.pow(this.stats.happiness, 2) + 511/990 * this.stats.happiness + 10;
    }

    /**
     * Calculate the income depending on the population compliance.
     * When the compliance sinks below 20% the state generates 0 income,
     * while above 70% 100% of the income are generated.
     * @income earnings in EURO
     */
    private calculateIncome(): number {
        if (this.stats.compliance > 70) this.stats.income = 1 * this.stats.maxIncome;
        else if (this.stats.compliance < 20) this.stats.income = 0;
        else {
            this.stats.income = (this.stats.compliance - 20) * 2 * this.stats.maxIncome;
        }
        return this.stats.income;
    }

    /**
     * Calculate the sum of all expenses of the day
     * @returns expenses in EURO
     */
    private calculateExpenses(): number {
        const sals = this.stats.getHWSalary() + this.stats.getPOSalary()
        const consumption = this.stats.getDailyTestKitsExpense() + this.stats.getDailyVaccinesExpense();
        return sals + consumption + this.calculateMeasureExpenses();
    }

    /** @returns sum of all active measure expenses (daily costs) */
    private calculateMeasureExpenses(): number {
        let result = 0;
        for (const key in this.measures) {
            const value = this.measures[key];
            if (value["active"]) result += Number(value["daily_cost"]);
        }
        return result;
    }

    /**
     * Budget = Budget + Income - Expenses
     * @param income
     * @param expenses
     * @see #calculateIncome
     * @see #calculateExpenses
     */
    private updateBudget(income: number, expenses: number): void {
        this.stats.budget += income - expenses;
    }

    /**
     * Reduces the current budget by the given price
     * @param price Price of respective item
     */
    private buyItem(price: number): void {
        this.setBudget(this.getBudget() - price);
    }

    /**
     * @param price Purchase price  
     * @returns Wether the player is solvent
    */
    private isSolvent(price: number): boolean {
        return this.getBudget() >= price;
    }

    // ----------------------------------------------------------------- GETTER-METHODS
    /** @returns The singleton instance */
    public static getInstance(): UpgradeController {
        if (!UpgradeController.instance) UpgradeController.instance = new UpgradeController();
        return UpgradeController.instance;
    }

    // ------------------------------------------------------- GETTER of Stats instance
    /** @returns Currently available budget */
    public getBudget(): number {return this.stats.budget;}

    /** @returns Current income per tic */
    public getIncome(): number {return this.stats.income;}

    // ------------------------------------------------------------------ SETTER-METHODS
    // allows encapsulation of application logic
    // private setIncome(amt: number) {}

    /** @param newBudget New Budget (overrides old budget) */
    private setBudget(newBudget: number): void {
        this.stats.budget = newBudget;
    }

}