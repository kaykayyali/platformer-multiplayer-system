import Phaser from "phaser";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import Scene_One from "Scenes/scene_one/scene.js";
import Scene_Two from "Scenes/scene_two/scene.js";

const config = {
	type: Phaser.HEADLESS,
	width: 800,
	height: 600,
	parent: "phaser",

	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
		},
	},
	audio: false,
	autoFocus: false,
	scene: [Scene_Two],
	plugins: {
		scene: [
			{
				key: "rexUI",
				plugin: RexUIPlugin,
				mapping: "rexUI",
			},
		],
	},
};

export default config;
