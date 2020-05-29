import * as Chart from "chart.js";
import { GuiScene } from "./gui-scene";
import { TimeSubscriber } from "../util/timeSubscriber";
import { TimeController } from "../objects/controller/timeController";
import { UpgradeController } from "../objects/controller/upgradeController";
import { Stats } from "../objects/controller/stats";

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

    /** Singleton to access the current infection numbers */
    private stats: Stats;

    /** Singleton to access the upgrade controller */
    private upgradeController: UpgradeController;

    /** Container to change the size of the chart */
    private chartContainer: HTMLDivElement;

    /** Canvas element to render the chart */
    private canvas: HTMLCanvasElement;

    /** Dom element to add the chart to the scene */
    private canvasDomElement: Phaser.GameObjects.DOMElement;

    constructor() {
        super({
            key: 'ChartScene',
            active: false
        });
        TimeController.getInstance().subscribe(this);
    }

    init(): void {
        /** The game starts on day 0 with 0 infected people */
        this.day = 0;
        this.infected = 0;
        this.stats = Stats.getInstance();
        this.upgradeController = UpgradeController.getInstance();

        this.initialMoney = this.upgradeController.getBudget();
        this.initialInfected = 0;

        /** If the game is restarted, the current chart will be destroyed */
        if (this.chart != null) {
            this.chart.destroy();
        }
    }

    create(): void {
        /** Initialize the chart and create the form to customize the chart */
        this.initializeChart();
        this.createForm();
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
        const currentlyInfected = this.stats.getInfected();

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

        /** Create the form, which allows to customize the chart */
    createForm(): void {
        /** Create the form */
        const form = document.createElement('form');
        form.setAttribute('id', 'chart-form');

        const textNodeAxis = document.createTextNode('Choose axis:');
        form.appendChild(textNodeAxis);

        /** Create the dropdown menu and associated options to change between the linear and logarithmic scale */
        const selectChartAxis = document.createElement('select');
        selectChartAxis.setAttribute('id', 'chart-axis');
        form.appendChild(selectChartAxis);

        const optionLinearAxis = document.createElement('option');
        optionLinearAxis.setAttribute('value', 'linear');
        optionLinearAxis.appendChild(document.createTextNode('linear'));

        const optionLogarithmicAxis = document.createElement('option');
        optionLogarithmicAxis.setAttribute('value', 'logarithmic');
        optionLogarithmicAxis.appendChild(document.createTextNode('logarithmic'));

        selectChartAxis.appendChild(optionLinearAxis);
        selectChartAxis.appendChild(optionLogarithmicAxis);
        
        /** Create the button to submit the form */
        const updateButton = document.createElement('input');
        updateButton.setAttribute('id', 'update-button');
        updateButton.setAttribute('type', 'submit');
        updateButton.setAttribute('value', 'Update Chart');
        form.appendChild(updateButton);

        /** Change what happens when you submit the form */
        form.onsubmit = function(event): void {
            /** Prevent the default behaviour of the button */
            event.preventDefault();

            /** Change the scale and update the chart */
            this.chart.options.scales.yAxes[0].type = selectChartAxis.options[selectChartAxis.selectedIndex].value;
            this.chart.update();
        }.bind(this);

        /** Change the style of the form */
        const style = document.createElement('style');
        style.innerHTML = `
        #chart-axis {
            margin-left: 5px;
            margin-right: 30px;
        }`;
        document.head.appendChild(style);

        /** Add the form to the scene */
        const formDomElement = this.add.dom(10, this.canvas.clientHeight, form);
        formDomElement.setOrigin(0, 0);

        /** Append the form to the container in index.html, otherwise the form will not be displayed */
        document.getElementById('form-container').appendChild(form);
    }

    /** @see TimeSubscriber */
    public notify(): void {this.updateChart();}

    /** Function to initialize the chart at the start of the game */
    private initializeChart(): void {
        /** Create the chart container and set the attributes */
        this.chartContainer = document.createElement('div');
        this.chartContainer.setAttribute('id', 'chart-container');
        this.chartContainer.setAttribute('style', 'width: 50%');

        /** Create the canvas and set the attributes */
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'chart');
        this.canvas.setAttribute('aria-label', 'infection numbers');
        this.canvas.setAttribute('role', 'img');

        /** Append the canvas to the container */
        this.chartContainer.appendChild(this.canvas);

        /** Append the container to the parent container in index.html, otherwise the chart will not be displayed */
        document.getElementById('parent-chart-container').appendChild(this.chartContainer);

        /** Add the canvas to the scene */
        this.canvasDomElement = this.add.dom(0, 0, this.canvas);
        this.canvasDomElement.setOrigin(0, 0);

        /** Create new chart */
        this.chart = new Chart(this.canvas, {
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

                scales: {
                    yAxes: [{
                        /** Default type of the y-axis is linear */
                        type: 'linear',
                        display: true,
                        ticks: {
                            /** Minimum value of the scale is 0 */
                            min: 0,
                            /** The logarithmic scale uses the scientific notation for the labels on the y-axis,
                             * this callback function converts them to the normal notation */
                            callback: function (label): number {
                                return Number(label.toString());
                            },
                            /** Show a maximum of 10 labels on the y-axis */
                            maxTicksLimit: 10
                        }
                    }]
                },

                /** Resize the canvas when the size of chart-container changes */
                responsive: true,

                /** Do not maintain the aspect ratio when resizing */
                maintainApsectRatio: false
            }
        });
    }
}