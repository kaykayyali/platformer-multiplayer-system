import Phaser from "phaser";
import Background from "./bg.jpg";

class Scene_One extends Phaser.Scene {
	constructor() {
		super({
			key: "Scene_One",
		});
	}
	preload() {
		// This works because Webpack will resolve the imported image to its src
		this.load.image(`${this.scene.key}-Background`, Background);
	}
	create() {
		const screenCenter = new Phaser.Math.Vector2(
			this.cameras.main.centerX,
			this.cameras.main.centerY
		);
		this.add.image(
			screenCenter.x,
			screenCenter.y,
			`${this.scene.key}-Background`
		);

		this.primaryButton = this.add
			.rectangle(screenCenter.x, screenCenter.y, 400, 200, 0xff0000, 1)
			.setInteractive();
		this.primaryButton.on(Phaser.Input.Events.POINTER_DOWN, (event) => {
			this.scene.start("Scene_Two");
		});
	}
	update() {}
}
export default Scene_One;
