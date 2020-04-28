import { Agent } from "./Agent";


export class VisualAgent extends Phaser.Physics.Arcade.Sprite {

    public action = Phaser.Math.Between(0, 1);
    public velocity = Phaser.Math.RND.realInRange(0.5, 1);
    public degree = Phaser. Math.Between(0, 360);
    public gradient = new Phaser.Math.Vector2(); 
    public counter = 200;

    public constructor(scene: Phaser.Scene, agent: Agent, texture?: string) {
        super(scene, agent.x, agent.y, texture);

        this.setDisplaySize(32, 32);
        this.randomWalk();

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setImmovable(true);
        this.setCollideWorldBounds(true);

    }

    public update(): void {

        if(this.counter <= 0 && this.action == 0) {
            this.randomWalk();
        }

        this.x += this.velocity * this.gradient.x;
        this.y += this.velocity * this.gradient.y;

        this.counter--;
    }

    public randomWalk(): void {
        this.action = Phaser.Math.Between(0, 1);
        this.velocity = Phaser.Math.RND.realInRange(0.5, 1);
        this.degree = Phaser.Math.Between(0, 360);
        this.gradient.x = Phaser.Math.RoundTo(Math.cos(Phaser.Math.DegToRad(this.degree)), -4);
        this.gradient.y = Phaser.Math.RoundTo(Math.sin(Phaser.Math.DegToRad(this.degree)), -4);
        this.counter = Phaser.Math.Between(200, 300);
        this.angle = this.degree + 90;
    }

    public changeDirectionOnCollide(): void {
        this.velocity = Phaser.Math.RND.realInRange(0.5, 1);
        this.degree += 90;
        this.gradient.x = Phaser.Math.RoundTo(Math.cos(Phaser.Math.DegToRad(this.degree)), -4);
        this.gradient.y = Phaser.Math.RoundTo(Math.sin(Phaser.Math.DegToRad(this.degree)), -4);
        this.counter = Phaser.Math.Between(200, 300);
        this.angle = this.degree + 90; 
    }



}