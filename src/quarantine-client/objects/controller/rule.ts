import { State } from "../../util/healthStates";

/** Represents a transition rule of the population protocol. */
export class Rule {
    private inputState1: State;
    private inputState2: State;
    private outputState1: State;
    private outputState2: State;

    constructor(inputState1, inputState2, outputState1, outputState2) {
        this.inputState1 = inputState1;
        this.inputState2  = inputState2;
        this.outputState1 = outputState1;
        this.outputState2 = outputState2;
    }
}