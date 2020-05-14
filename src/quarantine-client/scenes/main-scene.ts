import { Controller } from "../objects/controller/controller";
import { TimeController } from "../objects/controller/timeController";

/**
 * Main phaser scene which manages the other game scene
 */
export class MainScene extends Phaser.Scene {

    /** Instance of the central coordinator */
    private controller: Controller;
    /** Instance of the central time coordinator */
    private timeController: TimeController;

    constructor() {
        super({
            key: 'MainScene',
            active: true
        });
    }

    preload(): void {

        /*this.load.pack(
            'preload',
            'assets/pack.json',
            'preload'
        );*/
    }

    init(): void {
        console.log('Init');
    }

    create(): void {
        console.log('Create');

        this.timeController = TimeController.getInstance();
        this.controller = Controller.getInstance();
    }

    update(): void {
        //Updates ingame time
        this.timeController.tic();
    }

}
