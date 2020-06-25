import { GuiElement } from "../guiElement";
import { ChartScene } from "./chart-scene";
import { MapScene } from "./map-scene";

/**
 * Factory which generates the tablet and home button and 
 * allows the user to switch between the map scene and chart scene
 * @author Jakob Hartmann
 */
export class Tablet extends GuiElement {
    /** Tablet instance */
    public static instance: Tablet;

    /** Allows the pop-up window to decide whether the map scene should be woken up when the window is closed */
    private mapSceneIsSleeping: boolean;
    /** Allows the pop-up window to decide whether the chart scene should be woken up when the window is closed */
    private chartSceneIsSleeping: boolean;

    /** Create the tablet and the home button and manage their logic */
    public create(): void {
        Tablet.instance = this;

        /** Reference to the chart scene */
        const chartScene = this.scene.scene.get('ChartScene') as ChartScene;
        /** Reference to the map scene */
        const mapScene = this.scene.scene.get('MapScene') as MapScene;

        /** At the beginning of the game, the tablet shows the chart */
        mapScene.scene.sleep();
        this.mapSceneIsSleeping = true;
        this.chartSceneIsSleeping = false;

        /** Position the tablet */
        const tablet = this.scene.add.sprite(35, 20, 'tablet').setInteractive();
        tablet.setOrigin(0, 0);
        tablet.scaleX = 0.57;
        tablet.scaleY = 0.7;

        /** Create the info texts that are displayed when you hover over the home button */
        const showChart = this.scene.add.text(tablet.getBottomCenter().x + 25, tablet.getBottomCenter().y - 32, 'Show Chart', {fill: '#FFFFFF'});
        const showMap = this.scene.add.text(tablet.getBottomCenter().x + 25, tablet.getBottomCenter().y - 32, 'Show Map', {fill: '#FFFFFF'});
        showChart.setVisible(false);
        showMap.setVisible(false);

        /** Position the home button */
        const homeButton = this.scene.add.sprite(tablet.getBottomCenter().x, tablet.getBottomCenter().y - 26, 'home-button');
        homeButton.setOrigin(0.5, 0.5);
        homeButton.setScale(0.055);
        homeButton.setInteractive();
        
        /** 
         * Clicking the home button changes the scene in the tablet, 
         * updates the variables for the pop-up windows and 
         * adjusts the corresponding info texts
         */
        homeButton.on('pointerup', () => {
            if (!chartScene.scene.isSleeping()) {
                chartScene.scene.sleep();
                this.chartSceneIsSleeping = true;
                mapScene.scene.wake();
                this.mapSceneIsSleeping = false;
                showChart.setVisible(true);
                showMap.setVisible(false);
            } else {
                chartScene.scene.wake();
                this.chartSceneIsSleeping = false;
                mapScene.scene.sleep();
                this.mapSceneIsSleeping = true;
                showChart.setVisible(false);
                showMap.setVisible(true);
            }
        });

        /** When hovering over the home button, it becomes smaller and the corresponding info text is displayed */
        homeButton.on('pointerover', () => {
            homeButton.setScale(0.048);
            if (!chartScene.scene.isSleeping()) {
                showMap.setVisible(true);
            } else {
                showChart.setVisible(true);
            }
        })

        /** If the user´s mouse no longer points to the home button, 
         * its original size is restored and the info texts are hidden */
        homeButton.on('pointerout', () => {
            homeButton.setScale(0.055);
            showChart.setVisible(false);
            showMap.setVisible(false);
        })

    }

    /** Getter-function, which allows the pop-up window to determine whether the map scene is sleeping */
    public getMapSceneIsSleeping(): boolean {
        return this.mapSceneIsSleeping;
    }

    /** Getter-function, which allows the pop-up window to determine whether the chart scene is sleeping */
    public getChartSceneIsSleeping(): boolean {
        return this.chartSceneIsSleeping;
    }
    
}