import Phaser from "phaser";
import States from "./states.js";

export default class Soldier extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, sprite) {
		super(scene, x, y, sprite);
		this.scene = scene;
		this.skin = sprite;
		this.onStart();
	}

	onStart() {
		this.STATES = States;
		this.setAnimations();
		this.nextState(this.STATES.IDLING);
	}
	ACTIONS = {
		goIDLE: () => {
			this.nextState(this.STATES.IDLING);
		},
		MOVE: () => {
			this.nextState(this.STATES.MOVING);
		},
		DIE: () => {
			this.nextState(this.STATES.DYING);
		},
	};

	nextState(state) {
		if (this.state) {
			this.state.onExit(this);
		}
		this.setState(state);
		this.state.onEnter(this);
	}

	handleDeath() {
		this.ACTIONS.DIE();
	}

	setAnimations() {
		for (const key in this.STATES) {
			let stateConfig = this.STATES[key];
			this.anims.create({
				key: stateConfig.key,
				frames: this.anims.generateFrameNumbers(this.skin, {
					start: stateConfig.animationConfig.start || 0,
					end: stateConfig.animationConfig.end || 0,
				}),
				frameRate: stateConfig.animationConfig.frameRate || 10,
				repeat: stateConfig.animationConfig.repeat || 0,
			});
		}
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		this.state.updateFunction(this, time, delta);
	}
}
