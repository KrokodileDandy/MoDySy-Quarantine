export class MainScene extends Phaser.Scene {

    constructor() {
        super({
            key: "MainScene"
        });
    }

    preload(): void {

        this.load.pack(
            "preload",
            "assets/pack.json",
            "preload"
        );

    }

    init(): void {
        console.log("Init");
    }

    create(): void {
        console.log("Create");
    }

    update(): void {
        console.log("Update");
    }
}
