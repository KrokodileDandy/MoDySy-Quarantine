import { Agent } from "./Agent";
import { State } from "../util/healthstates";


export class Police extends Agent {
    
    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, state: State) {
        super(scene, x, y, texture);

        this.state = state;
    }

    public update(): void {
        
    }

}