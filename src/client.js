import _ from "lodash";
import "./style.css";
import Phaser from "phaser";
import PhaserConfig from "Utilities/client-phaserconfig.js";

function component() {
	const element = document.createElement("div");

	element.classList.add("phaser");

	return element;
}

document.body.appendChild(component());
let phaser = new Phaser.Game(PhaserConfig);
