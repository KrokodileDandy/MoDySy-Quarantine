import { VisualAgent } from "../objects/visualAgent";
import { Citizen } from "../objects/citizen";
import { State } from "../util/healthStates";
import { Police } from "../objects/police";
import { Role } from "../util/roles";
import { World } from "matter";

export class MainScene extends Phaser.Scene {

    private agents: Phaser.GameObjects.Group;
    private police: Phaser.GameObjects.Group;
    public tmpDegree: number;

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
        this.agents = this.add.group();
        this.police = this.add.group();
        
        this.physics.world.setBounds(432, 182, 933, 637);
        //this.physics.world.setBoundsCollision();
        
        this.addCollision();
        this.addAnimations();
        
        this.spawnCitizen();
        this.spawnPolice();
        this.spawnInfectedCitizen();
        console.log('Create');
    }

    update(): void {
        this.agents.children.each(a => a.update());
        this.police.children.each(a => a.update());
        console.log('Update');
    }

    spawnCitizen(): void {
        for (let i = 0; i < 50; i++) {
            const citizen = new VisualAgent(this, Phaser.Math.Between(430, 1365), Phaser.Math.Between(180, 820), new Citizen(Role.CITIZEN, State.HEALTHY), 'citizen');
            citizen.setSize(38, 38);
            citizen.setOffset(16, 16);
            citizen.body.isCircle = true;
            this.agents.add(citizen);
        }
    }

    spawnPolice(): void {
        for (let i = 0; i < 5; i++) {
            const police = new VisualAgent(this, Phaser.Math.Between(430, 1365), Phaser.Math.Between(180, 820), new Police(Role.POLICE, State.HEALTHY), 'police');
            police.setSize(38, 38);
            police.setOffset(16, 16);
            police.body.isCircle = true;
            this.police.add(police);
        }
    }

    spawnInfectedCitizen(): void {
        for (let i = 0; i < 1; i++) {
            const infected = new VisualAgent(this, Phaser.Math.Between(430, 1365), Phaser.Math.Between(180, 820), new Citizen(Role.CITIZEN, State.INFECTED), 'infected');
            infected.setSize(38, 38);
            infected.setOffset(16, 16);
            infected.body.isCircle = true;
            this.agents.add(infected);
        }
    }

    addCollision(): void {
        this.physics.add.collider(this.agents, this.agents, (a1: VisualAgent, a2: VisualAgent) => {
            a1.setCollided();
            a1.changeDirectionOnCollide();
            a1.meet(a2);
        });
        this.physics.add.collider(this.police, this.police, (p1: VisualAgent, p2: VisualAgent) => {
            p1.setCollided();
            p1.changeDirectionOnCollide();
        });
        this.physics.add.collider(this.agents, this.police, (a: VisualAgent, p: VisualAgent) => {
            a.setCollided();
            p.setCollided();
            a.changeDirectionOnCollide();
            p.changeDirectionOnCollide();
            a.meet(p);
            p.meet(a);
        });
        this.physics.add.overlap(this.agents, this.agents, (a1: VisualAgent, a2: VisualAgent) => {
            a1.correctPositionWhenOverlap(a2.x, a2.y);
        })
        this.physics.add.overlap(this.police, this.police, (p1: VisualAgent, p2: VisualAgent) => {
            p1.correctPositionWhenOverlap(p2.x, p2.y);
        })
        this.physics.add.overlap(this.agents, this.police, (a: VisualAgent, p: VisualAgent) => {
            a.correctPositionWhenOverlap(p.x, p.y);
            p.correctPositionWhenOverlap(a.x, a.y);
        })
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
        this.anims.create({
            key: 'citizenIdle',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNames('citizen', { start: 0, end: 0 })
        });
    }
}
