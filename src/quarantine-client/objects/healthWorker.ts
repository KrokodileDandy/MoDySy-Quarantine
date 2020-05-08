import { Agent } from "./agent";
import { Role } from "../util/roles";
import { State } from "../util/healthStates";

/**
 * Health workers do some sort of 'cure' to infected agents.
 * Subclass of agent.
 * @author Shao
 */
export class HealthWorker extends Agent {
    
    /**
     * Health workers have the role HEALTH_WORKER automatically.
     * @param state State of the new health worker
     */
    public constructor(state: State) {
        super(Role.HEALTH_WORKER, state);
    }

}