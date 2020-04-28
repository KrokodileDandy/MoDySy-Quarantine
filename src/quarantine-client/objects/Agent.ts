import 'phaser';
import { State } from '../util/healthstates';

export abstract class Agent extends Phaser.Physics.Arcade.Sprite {

    protected quarantined: boolean;
    protected socialDistancing: boolean;
    protected healthState: State; 
    protected token: integer;
    protected velocity: number;
    protected timer: number;

    protected constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        this.quarantined = false;
        this.socialDistancing = false;
        this.healthState = State.HEALTHY;
        this.token = 0;
        this.velocity = 1;
    }

    public update(): void {

    }

    public isQuarantined(): boolean {
        return this.quarantined;
    }

    public quarantine(): void {
        this.quarantined = true;
    }

    public leaveQuarantine(): void {
        this.quarantined = false;
    }

    public isSocialDistancingActive(): boolean {
        return this.socialDistancing;
    }

    public activateSocialDistancing(): void {
        this.socialDistancing = true;
    }

    public deactivateSocialDistancing(): void {
        this.socialDistancing = false;
    }

    public getHealthState(): State {
        return this.healthState;
    }

    public setHealthState(newState: State): void {
        this.healthState = newState;
    }




}

