import Phaser from "phaser";
import Scene_One from "Scenes/scene_one/scene.js";
import Scene_Two from "Scenes/scene_two/scene.js";

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: "phaser",
	pixelArt: true,

	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [Scene_One, Scene_Two],
};

export default config;
