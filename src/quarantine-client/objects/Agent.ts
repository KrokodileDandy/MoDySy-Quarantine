import 'phaser';
import {State} from '../util/healthstates';

enum Direction {

    UP,
    RIGHT,
    DOWN,
    LEFT,
    IDLE
}   

export abstract class Agent extends Phaser.Physics.Arcade.Sprite {

    //determine if agent ist quarantined
    protected quarantined: boolean;

    //current State of the agent
    protected currentState: State;

    //previous Status which ist necessary for interaction in meet()
    protected prevState: State;

    //100 update iterations
    protected counter = 100;

    //random velocity
    protected velocity = 3* Math.random();

    //get random direction
    protected direction: Direction = this.getRandomDirection();

    protected constructor(scene, Phaser.scene, x: number, y: number, texture: string, state: State) {
        super(scene, x, y, texture);

        this.currentState = state;
        this.prevState = state;
        this.quarantined = false;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }

    public isQuarantined(): boolean {
        return this.quarantined;
    }

    public getPreviousState(): State {
        return this.prevState;
    }

    public setPreviousState(newState: State): void {
        this.prevState = newState;
    }

    public getCurrentState(): State {
        this.currentState;
    }

    public setCurrentState(status: State): void {
        this.currentState = status;
    }

    //E.g. self-isolation
    public isolate(): void {
        this.quarantined = true;
        this.direction = Direction.IDLE
    }

    public leaveQuarantine(): void {
        this.quarantined = false;
    }

    public meet(agent: Agent): void {

        const prevState = agent.getPreviousState();
        let newState = prevState;

        if(this.currentState == 'HEALTHY') {

            if(prevState === 'ACTIVE') {
                
                this.currentState = State.ACTIVE;
            }
        } else if(this.currentState === "ACTIVE"){

            if(prevState === "ACTIVE") {

                this.currentState = State.DECEASED;
                newState = State.DECEASED;
            } else if (prevState === "HEALTHY") {

                newState = State.ACTIVE;
            }
        }

        agent.setPreviousState(newState);
        if(newState === "DECEASED") {

            agent.destroy();
            this.destroy();
        }
        console.log(this.currentState);

    }

}