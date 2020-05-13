import * as Chart from "chart.js";
import { Controller } from "../objects/controller/controller";

/**
 * Scene for creating and updating the graphical
 * representation of infection numbers using Chart.js
 * @author Jakob Hartmann
 */
export class ChartScene extends Phaser.Scene {
    /** Number of days since the game started */
    private day: number;

    /** Number of tics since the start of the day */
    private ticAccumulator: number;

    /** Number of infected people */
    private infected: number;

    /** Chart to show the infection numbers */
    private chart;

    /** Controller to access the current infection numbers */
    private controller: Controller;

    constructor() {
        super({
            key: 'ChartScene',
            active: true
        });
    }

    init(): void {
        /** The game starts on day 0 with 0 infected people */
        this.day = 0;
        this.ticAccumulator = 0;
        this.infected = 0;
        this.controller = Controller.getInstance();

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
    update(): void {
        /** TODO: Change it when uniform day-by-day progression is available */
        if (this.ticAccumulator < (this.controller.getTicsPerDay() - 1)) {
            this.ticAccumulator += 0.1;
        } else {
            this.ticAccumulator = 0;
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

            /** Render the new chart in index.html */
            this.chart.update();
        }
    }

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