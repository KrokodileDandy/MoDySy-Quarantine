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
        /**
         * Preload spritesheets
         */
        this.load.spritesheet('citizen', 'assets/sprites/agent_w.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('police', 'assets/sprites/agent_g.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('infected', 'assets/sprites/agent_r.png', { frameWidth: 64, frameHeight: 64 });
    }

    init(): void {
        console.log('Init');
    }

    create(): void {
        this.addAnimations();
        console.log('Create');

        this.controller = Controller.getInstance();
    }

    update(): void {
        console.log('Update');
    }

    /**
     * Adding running animations
     */
    addAnimations(): void {
        this.anims.create({
            key: 'walk',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNames('citizen', { start: 0, end: 8 })
        });
        this.anims.create({
            key: 'infectedWalk',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNames('infected', { start: 0, end: 8 })
        });
        this.anims.create({
            key: 'patrol',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNames('police', { start: 0, end: 8 })
        });
    }
}
