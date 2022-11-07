import Phaser from "phaser";
import Background from "./bg.jpg";
import { uniqueNamesGenerator, starWars } from "unique-names-generator";

const customConfig = {
	dictionaries: [starWars],
};

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
		sessionStorage.setItem("name", uniqueNamesGenerator(customConfig));

		this.add.image(
			screenCenter.x,
			screenCenter.y,
			`${this.scene.key}-Background`
		);

		this.primaryHeading = this.add
			.text(screenCenter.x, screenCenter.y / 2, "Welcome to the Void", {
				fontSize: "32px",
				fontFamily: "Arial",
				color: "#ffffff",
				align: "center",
			})
			.setPadding(64, 16)
			.setOrigin(0.5);

		this.secondaryHeading = this.add
			.text(
				screenCenter.x,
				screenCenter.y / 1.5,
				`Your name is ${sessionStorage.getItem("name")}`,
				{
					fontSize: "32px",
					fontFamily: "Arial",
					color: "#ffffff",
					align: "center",
				}
			)
			.setPadding(64, 16)
			.setOrigin(0.5);

		this.primaryCTA = this.add
			.text(screenCenter.x, screenCenter.y * 1.5, "Enter Game", {
				fontSize: "16px",
				fontFamily: "Arial",
				color: "#ffffff",
				backgroundColor: "#ff0000",
				align: "center",
			})
			.setPadding(32, 16)
			.setOrigin(0.5)
			.setInteractive();

		this.primaryCTA.on(Phaser.Input.Events.POINTER_DOWN, (event) => {
			this.scene.start("Scene_Two");
		});
	}
	update() {}
}
export default Scene_One;
