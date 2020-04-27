import 'phaser';

import {State} from '../util/healthstates';

export abstract class Agent extends Phaser.Physics.Arcade.Sprite {

    //determine if agent ist quarantined
    protected quarantined: boolean;

    //current State of the agent
    protected currentState: State;

    //previous Status which ist necessary for interaction in meet()
    protected prevState: State;

    //100 update iterations
    protected counter = 200;

    //random velocity
    protected action = Phaser.Math.Between(0, 1);
    protected velocity = Phaser.Math.RND.realInRange(0.5, 1);

    public degree = Phaser.Math.Between(0, 360);
    public gradient = new Phaser.Math.Vector2();

    protected constructor(scene: Phaser.Scene, x: number, y: number, state: State, texture: string, frame?: string | number) {
        super(scene, x, y, texture);

        this.currentState = state;
        this.prevState = state;
        this.quarantined = false;

        this.setDisplaySize(32, 32);
        this.randomWalk();

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setImmovable(true);
        this.setCollideWorldBounds(true);
        //this.setBounce(0);
        //scene.physics.world.enableBody(this);
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
        return this.currentState;
    }

    public setCurrentState(status: State): void {
        this.currentState = status;
    }

    public isolate(): void {
        this.quarantined = true;
    }

    public leaveQuarantine(): void {
        this.quarantined = false;
    }

    public update(): void {

        if(this.isQuarantined()){
            return;
        }

        if(this.counter <= 0 && this.action == 0) {
            this.randomWalk();
        }
        /*if(this.counter <= 0) {
            /*while(this.action == 1 && this.counter > 0) {
                this.counter = Phaser.Math.Between(100, 300);
                this.velocity = 0;
                this.angle += 1;
                this.counter--;
            }
        }*/

        this.x += (this.velocity * this.gradient.x);
        this.y += (this.velocity * this.gradient.y);

        this.counter--;
    }

    public randomWalk(): void {
        this.counter = Phaser.Math.Between(200, 300);
        this.velocity = Phaser.Math.RND.realInRange(0.5, 1);
        this.degree = Phaser.Math.Between(0, 360);
        this.angle = this.degree + 90;
        this.gradient.x = Phaser.Math.RoundTo(Math.cos(Phaser.Math.DegToRad(this.degree)), -4);
        this.gradient.y = Phaser.Math.RoundTo(Math.sin(Phaser.Math.DegToRad(this.degree)), -4);
    }

    public oppositeDirection(): void {
        this.counter = Phaser.Math.Between(200, 300);
        this.velocity = Phaser.Math.RND.realInRange(0.5, 1);
        this.degree += 90;
        this.angle = this.degree + 90;
        this.gradient.x = Phaser.Math.RoundTo(Math.cos(Phaser.Math.DegToRad(this.degree)), -4);
        this.gradient.y = Phaser.Math.RoundTo(Math.sin(Phaser.Math.DegToRad(this.degree)), -4);
    }

}