import "phaser";


/**
 * Scene to show popup of the game.
 * Status: Bug by adding an object to content. I'm fixing
 * @author Vinh Hien
 */

export class PopupWindows extends Phaser.Scene{
    constructor(parent: Phaser.Scene){
        super({
            key: "modal"
        });
        this.parent = parent;
    }

    /** Save the parent scene */
    private parent: Phaser.Scene;
    /** Container saves the informations */
    private gameContain: Phaser.GameObjects.Container;
    /** List of gameObjects */
    //private gameObjs: [Phaser.GameObjects.GameObject];

    init(){
        console.log("init popupwindows ok");
       //this.gameContain = this.add.container(500,500);
    }

    create(){
        /** Add background and cancel button to back to parent scene*/
        var background = this.add.image(0,0, 'assets/sprites/popup.jpg').setOrigin(0).setDepth(0);
        var cancelBtn = this.add.image(380, 20 , 'assets/sprites/cancel.jpg').setOrigin(0).setDepth(1);

        /** Close and back to the parent scence when click cancel button*/
        cancelBtn.setInteractive();
        cancelBtn.on("pointerup", ()=>{
            //console.log("you click on cancel");
            this.scene.stop();
        });
       
        //console.log("create modal done");
    }

    /** to add objects to game content
     *  status: bugs [1. all of elements by input array must be same type. 
     *  2. Some speticifity are needed when container containts a scene suck as "an close button required for every scenes?" etc.-> general prob]
    */
    /*public addObj(objs: [Phaser.GameObjects.GameObject]){
        this.gameContain.add(objs);
    }
    */

    /** To show modal*/
    public createModal(){
        //console.log("i'm in function");
        this.parent.scene.run("modal");   
    }
}