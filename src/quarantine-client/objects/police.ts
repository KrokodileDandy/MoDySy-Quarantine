import { Agent } from "./Agent";
import { Role } from "../util/roles";
import { State } from "../util/healthstates";

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
        
    }

}