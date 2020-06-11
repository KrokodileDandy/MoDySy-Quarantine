import { GuiScene } from "../gui-scene";

/**
 * Abstract class of a gui element which is part of the GuiScene.
 * @author Sebastian Führ
 * @see GuiScene
 */
export abstract class GuiElement {

    /** The GuiScene where the element belongs to */
    protected scene: GuiScene;

    constructor(scene: GuiScene) {
        this.scene = scene;
    }

    /** Create and add an instance of the element to the GuiScene */
    public abstract create(): void;
}