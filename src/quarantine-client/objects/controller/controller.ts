import { Agent } from '../agents/agent';
import { Police } from '../agents/police';
import { Citizen } from '../agents/citizen';
import { Role} from '../../util/roles';
import { State } from '../../util/healthStates';
import { Rule } from './rule';
import { HealthWorker } from '../agents/healthWorker';
import { TimeSubscriber } from '../../util/timeSubscriber';
import { TimeController } from './timeController';
import { Stats } from './stats';
import { UpgradeController } from './upgradeController';

/**
 * Singleton controller which should only simulates the population protocol.
 * This is achieved by finding defined transition rules of the protocol and applying
 * them to randomly selected agents.
 * It acts as the central coordinator of the application logic.
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class Controller implements TimeSubscriber {
    /** Singleton instance which holds game variables */
    private stats: Stats;
    /** The only existing instance of Controller */
    private static instance: Controller;
 
    /** All population protocol agents of the game */
    private agents: Agent[] = [];
    /** All transition rule currently defined in the population protocol */
    private rules: Rule[] = [];

    private constructor() {
        this.stats = Stats.getInstance();

        this.initiateRules();
        this.initiatePopulation();

        TimeController.getInstance().subscribe(this);

        this.distributeRandomlyInfected(1_000);
    }

    /** Initiate basic transition rules at gamestart. */
    private initiateRules(): void {
        this.rules = [
            new Rule(State.HEALTHY, State.INFECTED, State.UNKNOWINGLY_INFECTED, State.INFECTED),
            new Rule(State.HEALTHY, State.UNKNOWINGLY_INFECTED, State.UNKNOWINGLY_INFECTED, State.UNKNOWINGLY_INFECTED),
            new Rule(State.INFECTED, State.INFECTED, State.INFECTED, State.DECEASED, () => {
                Stats.getInstance().deceasedCitizen();
                return true;
            }),
            new Rule(State.TEST_KIT, State.UNKNOWINGLY_INFECTED, State.TEST_KIT, State.INFECTED, () => {
                if (UpgradeController.getInstance().isSolvent(this.stats.currentPriceTestKit)) {
                    const stats = Stats.getInstance();
                    stats.foundInfected();
                    stats.testKitUsed();
                    return true;
                } else return false;
            })
        ];
    }

    /**
     * On game start initiate a population which consists of citizens and some
     * police officers. The police officers are randomly distributed inside
     * the underlying array.
     */
    private initiatePopulation(): void {
        let remainingPolice = this.stats.nbrPolice;
        let remainingHW = this.stats.nbrHW;
        this.agents = new Array(this.stats.population);
        
        for (let i = 0; i < this.stats.population; i++) {
            if (remainingPolice > 0
                && (Math.random() > (this.stats.nbrPolice / this.stats.population) // random generation of agents OR
                    || remainingPolice === this.stats.population - i)) { // remaining number of agents has to be filled by police officers
                this.agents[i] = new Police(State.HEALTHY);
                remainingPolice--;
            } else if (remainingHW > 0
                && (Math.random() > (this.stats.nbrHW / this.stats.population)
                || remainingHW === this.stats.population - i)) {
                this.agents[i] = new HealthWorker(State.TEST_KIT);
                remainingHW--;
            } else {
                this.agents[i] = new Citizen(State.HEALTHY);
            }
        }
    }

    /**
     * Randomly assigns agents as 'UNKNOWINGLY_INFECTED'
     * @param amt Amount of agents to change the state
     */
    private distributeRandomlyInfected(amt: number): void {
        let i = 0;
        while (i < amt) {
            const idx = this.getRandomIndex();
            if (this.agents[idx].getHealthState() == State.HEALTHY) {
                this.agents[idx].setHealthState(State.UNKNOWINGLY_INFECTED);
                i++;
            }
        }
    }

    /**
     * Changes the role of the specified number of agents. The agents are chosen randomly.
     * Shouldn't be used with the rule CITIZEN.
     * @param amt Amount of new workers
     * @param role role to be distributed among the agents
     * @reurns If enough agents can be assigned that role
     */
    public distributeNewRoles(amt: number, role: Role, testKit = false): boolean {
        // There should be enough people left to be assigned the specific role
        if (this.stats.getPopulation() - this.stats.getNumberOfHealthWorkers() - this.stats.getNumberOfPolice() < amt) return false;

        let i = 0;
        /** 
         * Changes agents of the agents array to become health workers if they are not already health
         * workers or police officers.
         */
        while(i < amt) {
            const idx = this.getRandomIndex();
            if((this.agents[idx] instanceof HealthWorker) ||
                (this.agents[idx] instanceof Police)) continue;
            switch (role) {
                case Role.HEALTH_WORKER: {
                    if (testKit) this.agents[idx] = new HealthWorker(State.TEST_KIT);
                    else this.agents[idx] = new HealthWorker(State.CURE);
                    break;
                }
                case Role.POLICE: {
                    const tmp = this.agents[idx].getHealthState(); // infected agents can become police officers
                    this.agents[idx] = new Police(tmp);
                    break;
                }
                default: {
                    console.log("[WARNING] distributeNewRoles in controller.ts wasn't invoked with police or health worker role.");
                    break;
                }
            }
            i++;
        }
        return true;
    }

    /** Returns a random integer value between 0 and the current population number. */
    private getRandomIndex(): number {return Math.floor(Math.random() * this.stats.population);}

    /** @returns Partially randomized interaction rate. */
    private calculateInteractionRate(): number {
        const sign = (Math.random() > 0.5) ? 1 : -1;
        return this.stats.basicInteractionRate + sign * this.stats.maxInteractionVariance;
    }

    /**
     * Simulates the interaction of two agents by searching for an existing transition rule
     * of the population protocol. If there is no rule, no interaction of the agents takes
     * place.
     * @param agent1 
     * @param agent2 
     */
    private findRuleAndApply(agent1: Agent, agent2: Agent): void {
        this.rules.forEach(r => {
            if (r.inputState1 == agent1.getHealthState() && r.inputState2 == agent2.getHealthState()) {
                if (r.calculationRule()) {
                    agent1.setHealthState(r.outputState1);
                    agent2.setHealthState(r.outputState2);
                }
            } else if (r.inputState1 == agent2.getHealthState() && r.inputState2 == agent1.getHealthState()) {
                if (r.calculationRule()) {
                    agent1.setHealthState(r.outputState2);
                    agent2.setHealthState(r.outputState1);
                }
            }
        });
    }

    /** Implements the game logic. Select random pairs of agents to apply transition rules. */
    public update(): void {
        // number of interactions between agent pairs in the current tic
        const selections = Math.floor(this.calculateInteractionRate() * this.stats.population);
        
        let idxAgent1: number;
        let idxAgent2: number;
        // Generate two different random indexes for two agents of the agent array and call the method findRuleAndApply.
        for (let i = 0; i < selections; i++) {
            idxAgent1 = this.getRandomIndex();
            // Calculate new index until both indexes are different
            do {
                idxAgent2 = this.getRandomIndex();
            } while (idxAgent2 == idxAgent1)
            this.findRuleAndApply(this.agents[idxAgent1], this.agents[idxAgent2]);

            // Remove deceased agents from the agents array
            if (this.agents[idxAgent1].getHealthState() == State.DECEASED) {
                this.agents.splice(idxAgent1, 1);
            } else if (this.agents[idxAgent2].getHealthState() == State.DECEASED) {
                this.agents.splice(idxAgent2, 1);
            }
        }
    }

    /** @see TimeSubscriber */
    public notify(): void {this.update();}

    // ----------------------------------------------------------------- GETTER-METHODS
    /** @returns The singleton instance */
    public static getInstance(): Controller {
        if (!Controller.instance) Controller.instance = new Controller();
        return Controller.instance;
    }

    /** @returns Array of active rules */
    public getRules(): Rule[] {return this.rules;}

    // ------------------------------------------------------------------ SETTER-METHODS
    // ...

}