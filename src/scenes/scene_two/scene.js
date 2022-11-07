import Phaser from "phaser";
import Background from "./bg.jpg";
import SoldierSprite from "./soldier.png";
import Soldier from "GameObjects/soldier/entity.js";
import _ from "lodash";

import { io } from "socket.io-client";
import { forIn } from "lodash";
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

class Scene_Two extends Phaser.Scene {
	constructor() {
		super({
			key: "Scene_Two",
		});
	}
	preload() {
		// This works because Webpack will resolve the imported image to its src
		this.load.image(`${this.scene.key}-Background`, Background);
		this.load.spritesheet(`soldier-sprite`, SoldierSprite, {
			frameWidth: 64,
			frameHeight: 32,
		});
	}
	handlePlayerInput(playerId, input) {
		this.serverGameObjects.getChildren().forEach((player) => {
			if (playerId === player.playerId) {
				this.serverPlayers[player.playerId].input = input;
			}
		});
	}
	addPlayer(playerInfo) {
		const player = this.physics.add
			.image(playerInfo.x, playerInfo.y, "ship")
			.setOrigin(0.5, 0.5)
			.setDisplaySize(53, 40);
		player.setDrag(100);
		player.setAngularDrag(100);
		player.setMaxVelocity(200);
		player.playerId = playerInfo.playerId;
		this.serverGameObjects.add(player);
	}
	removePlayer(playerId) {
		this.serverGameObjects.getChildren().forEach((player) => {
			if (playerId === player.playerId) {
				player.destroy();
			}
		});
	}
	handleServerCreate() {
		console.log("Game Server Starting");
		this.serverPlayers = {};
		this.serverGameObjects = this.physics.add.group();
		serverIO.on("connection", (socket) => {
			console.log(`${socket.id} connected`);

			socket.on("setup_user", (data) => {
				this.serverPlayers[socket.id] = {
					playerId: socket.id,
					name: data.name,
					x: Math.floor(Math.random() * 700) + 50,
					y: Math.floor(Math.random() * 500) + 50,
					rotation: 0,
					input: {
						left: false,
						right: false,
						up: false,
						down: false,
					},
				};
				this.addPlayer(this.serverPlayers[socket.id]);
				socket.emit("currentPlayers", this.serverPlayers);
				socket.broadcast.emit(
					"new_user_connected",
					this.serverPlayers[socket.id]
				);
				socket.broadcast.emit(
					"newPlayer",
					this.serverPlayers[socket.id]
				);
			});

			// send the star object to the new player
			socket.on("disconnect", () => {
				console.log(`${socket.id} disconnected`);
				serverIO.emit("disconnected", this.serverPlayers[socket.id]);
				this.removePlayer(socket.id);
				delete this.serverPlayers[socket.id];
			});
			socket.on("playerInput", (inputData) => {
				this.handlePlayerInput(socket.id, inputData);
			});
		});
		this.physics.add.collider(this.serverGameObjects);
	}
	handleClientCreate() {
		this.socket = io();
		this.gamePlayers = this.physics.add.group();
		this.socket.emit("setup_user", {
			name: sessionStorage.getItem("name"),
		});
		this.socket.on("new_user_connected", (player) => {
			console.table(player);
			this.toast.showMessage(`${player.name} joined`);
			this.displayPlayers(player);
		});
		this.socket.on("currentPlayers", (players) => {
			Object.keys(players).forEach((id) => {
				if (players[id].playerId === this.socket.id) {
					// Us!
					this.displayPlayers(players[id], "soldier-sprite");
				} else {
					this.displayPlayers(players[id], "soldier-sprite");
				}
			});
		});
		this.socket.on("newPlayer", (playerInfo) => {
			this.displayPlayers(playerInfo);
		});
		this.socket.on("disconnected", (player) => {
			this.toast.showMessage(`${player.name} left`);
		});
		this.socket.on("playerUpdates", (players) => {
			Object.keys(players).forEach((id) => {
				this.gamePlayers.getChildren().forEach((player) => {
					if (players[id].playerId === player.playerId) {
						player.setRotation(players[id].rotation);
						player.setPosition(players[id].x, players[id].y);
					}
				});
			});
		});
		this.add.image(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			`${this.scene.key}-Background`
		);
		this.toast = this.rexUI.add.toast({
			x: this.cameras.main.centerX,
			y: 50,
			duration: {
				in: 200,
				hold: 2000,
				out: 200,
			},

			background: this.rexUI.add.roundRectangle(
				0,
				0,
				2,
				2,
				20,
				COLOR_PRIMARY
			),
			text: this.add.text(0, 0, "", {
				fontSize: "24px",
			}),
			space: {
				left: 20,
				right: 20,
				top: 20,
				bottom: 20,
			},
		});
		this.cursors = this.input.keyboard.createCursorKeys();
		this.physics.add.collider(this.gamePlayers);
		// this.playerGameObject = new Soldier(this, 200, 200, "soldier-sprite");
		// this.playerGameObject = this.add.rectangle(200, 200, 200, 200, 0xff000);
	}

	displayPlayers(playerInfo) {
		const player = this.physics.add
			.sprite(playerInfo.x, playerInfo.y, "soldier-sprite")
			.setOrigin(0.5, 0.5);
		player.playerId = playerInfo.playerId;
		this.gamePlayers.add(player);
	}
	create() {
		if (window.isServer) {
			return this.handleServerCreate();
		} else {
			this.handleClientCreate();
		}
	}
	update() {
		if (window.isServer) {
			return this.handleServerUpdate();
		} else {
			this.handleClientUpdate();
		}
	}

	handleServerUpdate() {
		this.serverGameObjects.getChildren().forEach((player) => {
			const input = this.serverPlayers[player.playerId].input;
			if (input.left) {
				player.x -= 10;
			}
			if (input.right) {
				player.x += 10;
			}
			if (input.up) {
				player.y -= 10;
			}
			if (input.down) {
				player.y += 10;
			}

			this.serverPlayers[player.playerId].x = player.x;
			this.serverPlayers[player.playerId].y = player.y;
			this.serverPlayers[player.playerId].rotation = player.rotation;
		});
		this.physics.world.wrap(this.serverGameObjects, 5);
		serverIO.emit("playerUpdates", this.serverPlayers);
	}

	handleClientUpdate() {
		if (!this.localState) {
			this.localState = {};
		}
		let newInputState = {
			left: this.cursors.left.isDown,
			right: this.cursors.right.isDown,
			up: this.cursors.up.isDown,
			down: this.cursors.down.isDown,
		};
		if (!_.isEqual(newInputState, this.localState)) {
			debugger;
			this.localState = newInputState;
			this.socket.emit("playerInput", {
				left: this.cursors.left.isDown,
				right: this.cursors.right.isDown,
				up: this.cursors.up.isDown,
				down: this.cursors.down.isDown,
			});
		}
	}
}
export default Scene_Two;
