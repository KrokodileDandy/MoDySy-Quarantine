import { Agent } from "./agent";
import { Role } from "../util/roles";
import { State } from "../util/healthStates";

/**
 * Generic citizen.
 * By default healthy. Can be infected by other citizen.
 * Subclass of agent.
 * @author Shao
 */

export class Citizen extends Agent {
    
    public constructor(role: Role, state: State) {
        super(role, state);
    }

}