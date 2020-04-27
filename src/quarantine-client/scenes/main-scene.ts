import { Agent } from '../objects/Agent';
import { Citizen } from '../objects/citizen';
import { State } from '../util/healthstates';

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
        const border = this.add.image(900, 500, 'border');
        this.agents = this.add.group();
        this.spawnCitizen();
        this.counter = 0;

        this.anims.create({
            key: 'walk',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNames('citizen', { start: 0, end: 7 })
        });
        //if(citizen.gradient.x > 0 || citizen.gradient.y > 0) {
        this.agents.playAnimation('walk');
        //}
        this.physics.world.setBounds(432, 182, 933, 637);
        this.physics.world.setBoundsCollision();
        //this.physics.collide(this.agents, this.agents);
        this.physics.add.collider(this.agents, this.agents, (a1: Agent, a2: Agent) => {
            //meet();
            a1.oppositeDirection();
            a2.oppositeDirection();
        });
        this.physics.add.collider(this.agents, border, (a: Agent) => {
            //meet();
            a.oppositeDirection();
        });
        
    }

    update(): void {
        this.agents.children.each(a => a.update());
        if(this.input.mousePointer.isDown && this.counter < 0) {
            this.getMouseCoordinates();
        }
        this.counter -= 1;
    }

    spawnCitizen(): void {
        for (let i = 0; i < 100; i++) {
            const citizen = new Citizen(this, Phaser.Math.Between(430, 1365) , Phaser.Math.Between(180, 820), State.HEALTHY, 'citizen');
            citizen.setSize(32, 32);
            citizen.setOffset(16, 16);
            this.agents.add(citizen);
        }
    }

    getMouseCoordinates() {
        console.log('x: ' + this.input.x);
        console.log('y: ' + this.input.y);
        this.counter = 20;
    }

}
