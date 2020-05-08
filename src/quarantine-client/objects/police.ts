import { Agent } from "./agent";
import { Role } from "../util/roles";
import { State } from "../util/healthStates";

/**
 * Police detecting infected agents.
 * Subclass of agent.
 * @author Shao
 */
export class Police extends Agent {
    
    /**
     * Police officers have the role POLICE automatically.
     * @param state State of the new police officer
     */
    public constructor(state: State) {
        super(Role.POLICE, state);
    }

}