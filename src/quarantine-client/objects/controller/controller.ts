import { Agent } from '../agent';
import { Police } from '../police';
import { Citizen } from '../citizen';
import { Role} from '../../util/roles';
import { State } from '../../util/healthStates';
import { Rule } from './rule';
import { HealthWorker } from '../healthWorker';
import { TimeSubscriber } from '../../util/timeSubscriber';
import { TimeController } from './timeController';
import { UpgradeController } from './upgradeController';

/**
 * Singleton controller which contains game variables (e.g. budget, population size)
 * and simulates the population protocol.
 * This is achieved by finding defined transition rules of the protocol and applying
 * them to randomly selected agents.
 * It acts as the central coordinator of the application logic.
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class Controller implements TimeSubscriber {
    /** Anonymous class to encapsulate game variables. */
    private stats = new class Stats {
        // ------------------------------------------------ GAME VARIABLES    
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

        /** 
         * Basic interaction rate which is used to calculate the number of
         * interactions per tic.
         */
        public basicInteractionRate = 0.01;
        /** Upper bound of the randomly generated interaction variance. */
        public maxInteractionVariance = 0.05;
    
        // --------------------------------------------------- PROBABILITIES
        // ...
    }

    /** The only existing instance of Controller */
    private static instance: Controller;
 
    /** All population protocol agents of the game */
    private agents: Agent[] = [];
   
    /** All transition rule currently defined in the population protocol */
    private rules: Rule[] = [];

    /** Scale factor to multiply with population numbers to simulate real population numbers */
    private readonly populationFactor = 50;

    /**
     * Different difficulty levels can be reached through defining different
     * values for nbrPolice, budget, income...
     */
    private constructor() {
        this.stats.population = 1_620_000; //83_149_300; // german population in september 2019 (wikipedia)
        this.stats.nbrPolice = 1_000;
        this.stats.nbrHW = 1_000;

        this.initiateRules();
        this.initiatePopulation();

        TimeController.getInstance().subscribe(this);

        this.distributeRandomlyInfected(1_000);
    }

    /** Initiate basic transition rules at gamestart. */
    private initiateRules(): void {
        this.rules = [
            new Rule(State.HEALTHY, State.INFECTED, State.UNKNOWINGLY_INFECTED, State.INFECTED, () => {
                //console.log("INFECTED");
                return true;
            }),
            new Rule(State.HEALTHY, State.UNKNOWINGLY_INFECTED, State.UNKNOWINGLY_INFECTED, State.UNKNOWINGLY_INFECTED),
            new Rule(State.INFECTED, State.INFECTED, State.INFECTED, State.DECEASED, () => {
                this.stats.deceased++;
                this.stats.population--;
                this.stats.infected--;
                //console.log("DECEASED");
                Controller.getInstance().death();
                return true;
            }),
            new Rule(State.TEST_KIT, State.UNKNOWINGLY_INFECTED, State.TEST_KIT, State.INFECTED, () => {
                this.stats.infected++;
                //console.log("TESTED");
                return true;
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
        if (this.getPopulation() - this.getNumberOfHealthWorkers() - this.getNumberOfPolice() < amt) return false;

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
                agent1.setHealthState(r.outputState1);
                agent2.setHealthState(r.outputState2);
            } else if (r.inputState1 == agent2.getHealthState() && r.inputState2 == agent1.getHealthState()) {
                agent1.setHealthState(r.outputState2);
                agent2.setHealthState(r.outputState1);
            }
            r.calculationRule();
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

        console.log("Pop.: "+this.stats.population+"; Infected: "+this.stats.infected);

        UpgradeController.getInstance().updateBudget();
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

    // ------------------------------------------------------- GETTER of Stats instance
    /** @returns Current population number */
    public getPopulation(): number {return this.stats.population * this.populationFactor;}

    /** @returns Number of deceased people since game start */
    public getDeceased(): number {return this.stats.deceased * this.populationFactor;}

    /**
     * The number does not include agents with the state UNKNOWINGLY_INFECTED 
     * @returns Number of currently infected people
     */
    public getInfected(): number {return this.stats.infected * this.populationFactor;}

    /** @returns Number of police officers */
    public getNumberOfPolice(): number {return this.stats.nbrPolice * this.populationFactor;}

    /** @returns Number of health workers */
    public getNumberOfHealthWorkers(): number {return this.stats.nbrHW * this.populationFactor;}



    // ------------------------------------------------------------------ SETTER-METHODS
    // allows encapsulation of application logic
    public death(): void {
        this.stats.population--;
    }

}