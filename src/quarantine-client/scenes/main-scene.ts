export class MainScene extends Phaser.Scene {

    private agents: Phaser.GameObjects.Group;
    public counter: number;

    constructor() {
        super({
            key: 'MainScene',
            active: true
        });
    }

    preload(): void {
        this.load.image('border', 'assets/sprites/blackborder.png');
        this.load.spritesheet('citizen', 'assets/sprites/agent_w.png', { frameWidth: 64, frameHeight: 64 });

    }

    create(): void {
    }

    update(): void {
        
    }

}
