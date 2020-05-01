import { Agent } from "./agent";
import { Citizen } from "./citizen";
import { Police } from "./police";
import { State } from "../util/healthstates";

/**
 * Moving agent entities as VisualAgents.
 * Working as a visual interpretation of the agents
 * to show movement and collsion
 * to furthermore elucidate the spread of the virus.
 * @author Shao
 */

export class VisualAgent extends Phaser.Physics.Arcade.Sprite {

    // ------------------------------------------------ GAME VARIABLES 
    /** Randomly decides which action the agent do next */
    public action = Phaser.Math.Between(0, 1);
    /** Randomly define the moving-speed of the agent */
    public velocity = Phaser.Math.RND.realInRange(0.5, 1);
    /** Randomly define in which direction the body is pointing to */
    public degree = Phaser. Math.Between(0, 360);
    /** The gradient as 2 dimensional vector to determine in which direction of the body is moving to */
    public gradient = new Phaser.Math.Vector2(); 
    /** Sets the duration of the current action */
    public counter = 200;

    public turnRate: number;
    // ------------------------------------------------ GAME VARIABLES

    /**
     * The constructor generates a visual agent at position(x, y)
     * and inherits the role and health state from the param agent
     * which will simulate certain behavior visually.
     * 
     * @param scene the Phaser.Scene where the visual agent belongs to
     * @param x the x position of the visual agent
     * @param y the y position of the visual agent
     * @param agent call the constructor of a subclass of the agent
     * @param texture texture (or color) of the visual agent
     */
    public constructor(scene: Phaser.Scene, x: number, y: number, agent: Agent, texture: string) {
        super(scene, x, y, texture);

        this.state = agent.getHealthState();
        this.setDisplaySize(32, 32);    // original size is 64x64. 
        this.randomWalk();

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setImmovable(true);
        this.setCollideWorldBounds(true);

        // ------------------------------------------------ RUNNING-ANIMATIONS
        if(agent instanceof Police == true) {
            this.anims.play('patrol');
        }
        if(agent instanceof Citizen == true && this.state == State.HEALTHY) {
            this.anims.play('walk');
        }
        if(agent instanceof Citizen == true && this.state == State.INFECTED) {
            this.anims.play('infectedWalk');
        }
        // ------------------------------------------------ RUNNING-ANIMATIONS
        
    }

    /**
     * Updates the frames and position of visual agent.
     * Counting down and do certain behaviours when conditions met.
     */
    public update(): void {
        
        /** Sets the skin and animation of healthy citizen */
        if(this instanceof Citizen == true && this.state == State.HEALTHY) {
            this.anims.play('walk');
        }
        /**  */
        if(this instanceof Citizen == true && this.state == State.INFECTED) {
            this.anims.play('infectedWalk');
        }

        /** certain behaviours */
        if(this.counter == 0) {     // && this.action == 0) {       //:TODO add more movements and behaviors
            this.randomWalk();
        }

        this.randomTurn();

        /** Moving the body to the direction it is facing to */
        this.x += this.velocity * this.gradient.x;
        this.y += this.velocity * this.gradient.y;

        this.counter--;
    }

    /**
     * Implements the behaviour and events happening when the agents collide
     * @param agent 
     */
    public meet(agent: VisualAgent): void {
        /** healthy agent meets infected agent */
        if(this.state == State.INFECTED) {
            if(agent.state == State.HEALTHY) {
                agent.state = State.INFECTED;
            }
        }
        /** police meets infected agent */
        if(this instanceof Police == true) {
            // TODO: infected agent should get quarantined
            if(agent.state == State.INFECTED) {
                agent.x = 100;
                agent.y = 100;
                agent.velocity = 0;
                agent.counter = 10000;
            }
        }
    }

    /**
     * Implements random walking behaviour
     */
    public randomWalk(): void {
        this.action = Phaser.Math.Between(0, 1);
        this.velocity = Phaser.Math.RND.realInRange(0.5, 1);
        this.degree = Phaser.Math.Between(0, 360);
        this.gradient.x = Phaser.Math.RoundTo(Math.cos(Phaser.Math.DegToRad(this.degree)), -4);
        this.gradient.y = Phaser.Math.RoundTo(Math.sin(Phaser.Math.DegToRad(this.degree)), -4);
        this.counter = Phaser.Math.Between(200, 300);
        this.turnRate = Phaser.Math.RND.realInRange(-0.4, 0.4);
        this.angle = this.degree + 90;
    }

    /**
     * Change the direction when agents collide with each other
     * TODO: change direction when agent hits the wall
     */
    public changeDirectionOnCollide(): void {
        this.velocity = Phaser.Math.RND.realInRange(0.5, 1);
        this.degree += 90;
        this.gradient.x = Phaser.Math.RoundTo(Math.cos(Phaser.Math.DegToRad(this.degree)), -4);
        this.gradient.y = Phaser.Math.RoundTo(Math.sin(Phaser.Math.DegToRad(this.degree)), -4);
        this.counter = Phaser.Math.Between(200, 300);
        this.turnRate = Phaser.Math.RND.realInRange(-0.4, 0.4);
        this.angle = this.degree + 90; 
    }

    /**
     * Implements random turn behaviour
     */
    public randomTurn(): void {
        this.degree += this.turnRate;
        this.gradient.x = Phaser.Math.RoundTo(Math.cos(Phaser.Math.DegToRad(this.degree)), -4);
        this.gradient.y = Phaser.Math.RoundTo(Math.sin(Phaser.Math.DegToRad(this.degree)), -4);
        this.angle += this.turnRate;
    }
}