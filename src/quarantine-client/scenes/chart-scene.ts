import * as Chart from "chart.js";
import { Controller } from "../objects/controller/controller";
import { GuiScene } from "./gui-scene";
import { TimeSubscriber } from "../util/timeSubscriber";
import { TimeController } from "../objects/controller/timeController";
import { UpgradeController } from "../objects/controller/upgradeController";

/**
 * Scene for creating and updating the graphical
 * representation of infection numbers using Chart.js
 * @author Jakob Hartmann
 */
export class ChartScene extends Phaser.Scene implements TimeSubscriber {
    /** initial population */
    private initialInfected: number;

    /** initial amount of money */
    private initialMoney: number;

    /** Number of days since the game started */
    private day: number;

    /** Number of infected people */
    private infected: number;

    /** Chart to show the infection numbers */
    private chart;

    /** Controller to access the current infection numbers */
    private controller: Controller;

    private upgradeController: UpgradeController;

    constructor() {
        super({
            key: 'ChartScene',
            active: true
        });
        TimeController.getInstance().subscribe(this);
    }

    init(): void {
        /** The game starts on day 0 with 0 infected people */
        this.day = 0;
        this.infected = 0;
        this.controller = Controller.getInstance();
        this.upgradeController = UpgradeController.getInstance();

        this.initialMoney = this.upgradeController.getBudget();
        this.initialInfected = 0;

        /** If the game is restarted, the current chart will be destroyed */
        if (this.chart != null) {
            this.chart.destroy();
        }
    }

    create(): void {
        /** Initialize the chart */
        this.initializeChart();
    }

    /** 
     * Update function to get the current infection numbers
     * and update the chart accordingly 
    */
    updateChart(): void {
        this.day += 1;

        /** Update the labels */
        this.chart.data.labels.push('Day ' + this.day);

        /** Get current infection numbers */
        const currentlyInfected = this.controller.getInfected();

        /** Update both datasets */
        this.chart.data.datasets.forEach((dataset) => {
            if (dataset.label == 'Total Cases') {
                /** Add a new datapoint with the total number of people infected */
                dataset.data.push(currentlyInfected);
            } else {
                /** Calculate the number of infected people today and add a new bar */
                dataset.data.push(currentlyInfected - this.infected);
            }
        });

        /** Update current infection numbers */
        this.infected = currentlyInfected;

        /** difference between today and yesterday */
        if(this.day > 0) {
            const chngesInCases = this.infected - this.initialInfected;
            this.initialInfected = this.infected;

            const changesInBudget = this.upgradeController.getBudget() - this.initialMoney;
            this.initialMoney = this.upgradeController.getBudget();

            /** Call of function that creates daily report of cases and all money  */
            const guiScene = this.scene.get('GuiScene') as GuiScene;
            guiScene.createPopUp(this.day, changesInBudget, chngesInCases);
        }
        
        /** Render the new chart in index.html */
        this.chart.update();
    }

    /** @see TimeSubscriber */
    public notify(): void {this.updateChart();}

    /** Function to initialize the chart at the start of the game */
    private initializeChart(): void {
        /** Get canvas from index.html to render the chart */
        const canvas = document.getElementById('chart');

        /** Create new chart */
        this.chart = new Chart(canvas, {
            /** Line chart to show the total number of people infected */
            type: 'line',

            data: {
                labels: ['Day 0'],
                datasets: [{
                    label: 'Total Cases',
                    backgroundColor: 'transparent',
                    borderColor: '#FF0000',
                    /** Start with 0 cases */
                    data: [0],
                }, {
                    label: 'New Cases',
                    backgroundColor: '#FF8000',
                    borderColor: '#FF8000',
                    /** Start with 0 cases */
                    data: [0],
                    /** Bar chart to show the number of people infected every day */
                    type: 'bar',
                }]
            },

            options: {
                /** Display the title of the chart */
                title: {
                    display: true,
                    text: 'Infection Numbers'
                },

                /** Resize the canvas when the size of chart-container changes */
                responsive: true,

                /** Do not maintain the aspect ratio when resizing */
                maintainApsectRatio: false
            }
        });
    }
}