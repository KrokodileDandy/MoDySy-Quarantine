import { Controller } from "./controller";
import { State } from "../../util/healthStates";
import { Rule } from "./rule";
import { Role } from "../../util/roles";
import { Stats } from "./stats";
import { TimeSubscriber } from "../../util/timeSubscriber";


/**
 * Singleton
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

    private constructor() {
        this.stats = Stats.getInstance();

        this.contr = Controller.getInstance();
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
            this.contr.increaseHealthWorkers(numberOfNewAgents);
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
            this.contr.increasePoliceOfficers(amt);
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
            this.contr.increaseHealthWorkers(amt);
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
            this.contr.increaseHealthWorkers(amt);
            return true;
        } else return false;
    }

    /** @see TimeSubscriber */
    public notify(): void {
        this.updateCompliance();
        this.updateBudget(this.calculateIncome(), this.calculateExpenses());
    }

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
     */
    private calculateIncome(): number {
        if (this.stats.compliance > 70) this.stats.income = 1;
        else if (this.stats.compliance < 20) this.stats.income = 0;
        else {
            this.stats.income = (this.stats.compliance - 20) * 2 * this.stats.maxIncome;
        }
        return this.stats.income;
    }

    private calculateExpenses(): number {
        const sals = this.stats.getHWSalary() + this.stats.getPOSalary();
        return sals;
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

    // ----------------------------------------------------------------- UPGRADE - PRIVATE
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