import { State } from "../../util/healthStates";

/** Represents a transition rule of the population protocol. */
export class Rule {
    public readonly inputState1: State;
    public readonly inputState2: State;
    public readonly outputState1: State;
    public readonly outputState2: State;

    public calculationRule;

    constructor(inputState1, inputState2, outputState1, outputState2, calculationRule = function(): boolean {return true;}) {
        this.inputState1 = inputState1;
        this.inputState2  = inputState2;
        this.outputState1 = outputState1;
        this.outputState2 = outputState2;
        this.calculationRule = calculationRule;
    }
}