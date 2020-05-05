import { Agent } from "./agent";
import { Role } from "../util/roles";
import { State } from "../util/healthstates";

/**
 * Health workers do some sort of 'cure' to infected agents.
 * Subclass of agent.
 * @author Shao
 */

export class HealthWorkers extends Agent {
    
    public constructor(role: Role, state: State) {
        super(role, state);
    }

}