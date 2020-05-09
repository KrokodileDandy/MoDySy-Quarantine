import { Agent } from "./agent";
import { Role } from "../util/roles";
import { State } from "../util/healthStates";

/**
 * Police detecting infected agents.
 * Subclass of agent.
 * @author Shao
 */

export class Police extends Agent {
    
    public constructor(role: Role, state: State) {
        super(role, state);

    }

    public update(): void {
        super.update();
    }

}