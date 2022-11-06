import Phaser from "phaser";
import Background from "./bg.jpg";
import { io } from "socket.io-client";

class Scene_Two extends Phaser.Scene {
	constructor() {
		super({
			key: "Scene_Two",
		});
	}
	preload() {
		// This works because Webpack will resolve the imported image to its src
		this.load.image(`${this.scene.key}-Background`, Background);
	}
	create() {
		this.socket = io();
		this.add.image(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			`${this.scene.key}-Background`
		);
	}
	update() {}
}
export default Scene_Two;
