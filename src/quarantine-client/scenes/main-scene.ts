import { VisualAgent } from "../objects/visualAgent";
import { Citizen } from "../objects/Citizen";
import { State } from "../util/healthstates";

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
        const border = this.add.sprite(900, 500, 'border');
        this.agents = this.add.group();
        this.spawnCitizen();
        this.counter = 0;
        this.physics.world.setBounds(432, 182, 933, 637);
        this.physics.world.setBoundsCollision();

        this.physics.add.collider(this.agents, this.agents, (a1: VisualAgent, a2: VisualAgent) => {
            a1.changeDirectionOnCollide();
            a2.changeDirectionOnCollide();
        });
        this.physics.add.collider(this.agents, border, (a: VisualAgent) => {
            a.changeDirectionOnCollide();
        })

        this.anims.create({
            key: 'walk',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNames('citizen', { start: 0, end: 8 })
        });
        this.agents.playAnimation('walk');

    }

    update(): void {
        this.agents.children.each(a => a.update());
    }

    spawnCitizen(): void {
        for (let i = 0; i < 100; i++) {
            const citizen = new VisualAgent(this, new Citizen(this, Phaser.Math.Between(430, 1365), Phaser.Math.Between(180, 820), State.HEALTHY), 'citizen');
            citizen.setSize(32, 32);
            citizen.setOffset(16, 16);
            this.agents.add(citizen);
            
        }
    }

}
