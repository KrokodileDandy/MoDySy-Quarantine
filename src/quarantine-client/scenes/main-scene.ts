import { Controller } from "../objects/controller/controller";

export class MainScene extends Phaser.Scene {

    private controller: Controller;

    constructor() {
        super({
            key: 'MainScene',
            active: true
        });
    }

    preload(): void {

        this.load.pack(
            'preload',
            'assets/pack.json',
            'preload'
        );
    }

    init(): void {
        console.log('Init');
    }

    create(): void {
        console.log('Create');

        this.controller = Controller.getInstance();
    }

    update(): void {
        console.log("Update");
    }

}
