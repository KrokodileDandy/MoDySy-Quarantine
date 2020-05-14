import { Controller } from "../objects/controller/controller";
import { UpgradeController } from "../objects/controller/upgradeController";

/**
 * Scene which creates a small status bar which acts as an overlay on top of the normal game canvas.
 * @author Sebastian Führ
 */
export class StatusBar extends Phaser.Scene {

    /** Instance of the status bar to allow manipulation */
    private statBar: Phaser.GameObjects.DOMElement;
    /** Instance of the central controller */
    private controller: Controller;

    constructor() {
        super({
            key: 'StatusBarScene',
            active: true
        });
        this.controller = Controller.getInstance();
    }

    preload(): void {
        //this.load.
    }

    create(): void {
        this.initializeStatBar(); // Initialize the status bar
        console.log("Status bar loaded");
    }

    /**
     * Fill the div element of the index.html with more div elemens which have specific
     * IDs to allow manipulation later on. Basic css styling for the status bar also
     * happens here.
     */
    private initializeStatBar(): void {
        const statBarStyle = {
            'background-color': 'grey',
            'border-radius': '0 0 10px 0px',
            'padding': '5px 0px 5px 0px'
        };
        this.statBar = this.add.dom(500, 12, "#status-bar", statBarStyle); // for center: "+this.game.config.width / 2"
        this.statBar.setHTML(`
                <div class="stat" id="statbar-budget"></div>
                <div class="stat" id="statbar-population"></div>
                <div class="stat" id="statbar-infected"></div>
                <div class="stat" id="statbar-police"></div>
                <div class="stat" id="statbar-hw"></div>
                <div class="stat btn"><a href="#"><span class="icon"></span></a></div>
            `);
        this.update();
    }

    /** Fill the status bar with information from the central controller on each call */
    public update(): void {
        document.getElementById("statbar-budget").innerHTML = UpgradeController.getInstance().getBudget() + " €";
        document.getElementById("statbar-population").innerHTML = "Population: " + this.controller.getPopulation();
        document.getElementById("statbar-infected").innerHTML = "Infected: " + this.controller.getInfected();
        document.getElementById("statbar-police").innerHTML = "Police: " + this.controller.getNumberOfPolice();
        document.getElementById("statbar-hw").innerHTML = "Health Workers: " + this.controller.getNumberOfHealthWorkers();
    }

}