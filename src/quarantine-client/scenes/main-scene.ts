import { VisualAgent } from "../objects/visualAgent";
import { Citizen } from "../objects/Citizen";
import { State } from "../util/healthstates";
import { Police } from "../objects/Police";

export class MainScene extends Phaser.Scene {

    private agents: Phaser.GameObjects.Group;
    private police: Phaser.GameObjects.Group;
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
        this.load.spritesheet('police', 'assets/sprites/agent_g.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('infected', 'assets/sprites/agent_r.png', { frameWidth: 64, frameHeight: 64 });

    }

    create(): void {
        const border = this.add.sprite(900, 500, 'border');
        this.agents = this.add.group();
        this.police = this.add.group();
        
        this.counter = 0;
        this.physics.world.setBounds(432, 182, 933, 637);
        this.physics.world.setBoundsCollision();

        this.physics.add.collider(this.agents, this.agents, (a1: VisualAgent, a2: VisualAgent) => {
            a1.changeDirectionOnCollide();
            a2.changeDirectionOnCollide();
        });
        this.physics.add.collider(this.police, this.police, (p1: VisualAgent, p2: VisualAgent) => {
            p1.changeDirectionOnCollide();
            p2.changeDirectionOnCollide();
        });
        this.physics.add.collider(this.agents, this.police, (a: VisualAgent, p: VisualAgent) => {
            a.changeDirectionOnCollide();
            p.changeDirectionOnCollide();
        });
        
        this.anims.create({
            key: 'walk',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNames('citizen', { start: 0, end: 8 })
        });
        this.anims.create({
            key: 'patrol',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNames('police', { start: 0, end: 8 })
        });
        this.spawnCitizen();
        this.spawnPolice();
        this.agents.playAnimation('walk');
        this.police.playAnimation('patrol');

    }

    update(): void {
        this.agents.children.each(a => a.update());
        this.police.children.each(a => a.update());
    }

    spawnCitizen(): void {
        for (let i = 0; i < 50; i++) {
            const citizen = new VisualAgent(this, new Citizen(this, Phaser.Math.Between(430, 1365), Phaser.Math.Between(180, 820), State.HEALTHY), 'citizen');
            citizen.setSize(32, 32);
            citizen.setOffset(16, 16);
            this.agents.add(citizen);
        }
    }

    spawnPolice(): void {
        for (let i = 0; i < 5; i++) {
            const police = new VisualAgent(this, new Police(this, Phaser.Math.Between(430, 1365), Phaser.Math.Between(180, 820), State.HEALTHY), 'police');
            police.setSize(32, 32);
            police.setOffset(16, 16);
            this.police.add(police);
        }
    }

}
