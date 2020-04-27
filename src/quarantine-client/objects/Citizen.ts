import {Agent} from './Agent';
import {State} from '../util/healthstates';

export class Citizen extends Agent {


    public constructor(scene: Phaser.Scene, x: number, y: number, state: State, texture: string, frame?: string | number) {
        super(scene, x, y, state, texture);
        
    }

}