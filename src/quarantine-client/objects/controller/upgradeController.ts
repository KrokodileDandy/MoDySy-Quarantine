import { Controller } from "./controller";
import { State } from "../../util/healthStates";
import { Rule } from "./rule";
import { Role } from "../../util/roles";


/**
 * Singleton
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class UpgradeController {

    /** Anonymous class to encapsulate game variables. */
    private stats = new class Stats {
        // ------------------------------------------------ GAME VARIABLES
        /** Available money in EURO */
        public budget: number;
        /** Income per tic */
        public income: number;
    }

    /** The only existing instance of UpgradeController */
    private static instance: UpgradeController;
    /** Instance of central singleton controller */
    private contr: Controller;

    private constructor() {
        this.contr = Controller.getInstance();
        this.stats.budget = 2_000_000;
        this.stats.income = 30_000;
    }

    // ----------------------------------------------------------------- UPGRADE - PUBLIC
    /**
     * Inserts a number of health workers into the agents array and adds rules regarding the state 'CURE'.
     * This method is required to call before the buyHealthWorkers-method. Otherwise the agents array
     * will have health workers but they won't do anything. (Because the transition rules are not yet
     * defined.)
     * @param price Price of the upgrade
     * @param numberOfNewAgents Number of new health workers
     * @returns Boolean if the operation was successful, false if there are not enough people left to become health workers
     */
    public introduceCure(uC: UpgradeController): boolean {
        const price = 100_000;
        const numberOfNewAgents = 10_000;
        // There should be enough people left to become health workers
        if (uC.contr.getPopulation() - uC.contr.getNumberOfHealthWorkers() - uC.contr.getNumberOfPolice() < numberOfNewAgents) return false;

        uC.buyItem(price);

        const lastRule = uC.contr.getRules().length;
        uC.contr.getRules()[lastRule] = new Rule(State.HEALTHY, State.CURE, State.IMMUNE, State.CURE);
        uC.contr.getRules()[lastRule] = new Rule(State.INFECTED, State.CURE, State.IMMUNE, State.CURE);
        uC.contr.getRules()[lastRule] = new Rule(State.UNKNOWINGLY_INFECTED, State.CURE, State.IMMUNE, State.CURE);

        uC.contr.distributeNewRoles(numberOfNewAgents, Role.HEALTH_WORKER);
        return true;
    }

    /**
     * Insert a number of police officers into the agents array
     * @param price Price of this upgrade
     * @param amt Number of new police officers
     */
    public buyPoliceOfficers(uC: UpgradeController): boolean {
        const price = 100_000;
        const amt = 10_000;
        if (uC.contr.distributeNewRoles(amt, Role.POLICE)) {
            uC.buyItem(price);
            return true;
        }
        return false;
    }

    /**
     * Insert a number of health workers into the agents array
     * @param price Price of this upgrade
     * @param amt Number of new health workers
     */
    public buyHealthWorkers(uC: UpgradeController): boolean {
        const price = 100_000;
        const amt = 10_000;
        if (uC.contr.distributeNewRoles(amt, Role.HEALTH_WORKER)) {
            uC.buyItem(price);
            return true;
        }
        return false;
    }

    /**
     * Insert a number of health workers into the agents array with the state
     * TEST_KIT to allow detection of UNKNOWINGLY_INFECTED agents.
     * @param price Price of this upgrade
     * @param amt Number of new health workers
     */
    public buyTestKitHWs(uC: UpgradeController): boolean {
        const price = 100_000;
        const amt = 10_000;
        if (uC.contr.distributeNewRoles(amt, Role.HEALTH_WORKER, true)) {
            uC.buyItem(price);
            return true;
        }
        return false;
    }

    // ----------------------------------------------------------------- UPGRADE - PRIVATE
    /**
     * Reduces the current budget by the given price
     * @param price Price of respective item
     * @returns If budget is high enough
     */
    private buyItem(price: number): boolean {
        if (this.getBudget() < price) return false;
        this.setBudget(this.getBudget() - price);
        return true;
    }

    /** Increases budget by income rate. */
    public updateBudget(): void {this.stats.budget += this.getIncome()}

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