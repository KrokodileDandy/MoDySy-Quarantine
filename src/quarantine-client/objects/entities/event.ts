import 'phaser';
import { PopupWindow } from "../../scenes/popupWindow";
import { GuiScene } from "../../scenes/gui-scene";

/**
 * An in-game event and opens a popup window.  
 * Represents the interface between the gui and the event
 * application logic {@see EventController}.
 * 
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class Event {

    /**
     * @param executeEventFunction Should Encapsulates game logic which is executed when the event is triggered. E.g. increment the death counter (removal) of a citizen.
     */
    public constructor(executeEventFunction: Function, title: string, description: string, imagePath = "letter") {
        const ppTitle = new Phaser.GameObjects.Text(GuiScene.instance, 550, 130, title, {});
        const ppDescription = new Phaser.GameObjects.Text(GuiScene.instance, 550, 130, description, {});
        const popup = new PopupWindow(GuiScene.instance, 0, 0, 'log-background', 800, 600, true, [ppTitle, ppDescription], true);

        executeEventFunction();
    }

}