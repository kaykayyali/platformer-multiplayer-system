export default {
	IDLING: {
		key: "IDLING",
		animationConfig: {
			start: 0,
			end: 3,
			frameRate: 5,
			repeat: -1,
		},
		onEnter: (ctx) => {
			ctx.anims.play("IDLING");
			console.log(ctx);
		},
		onExit: (ctx) => {},
		updateFunction: (ctx, time, delta) => {},
	},
	MOVING: {
		key: "MOVING",
		animationConfig: {
			start: 4,
			end: 11,
			frameRate: 10,
			repeat: -1,
		},
		onEnter: (ctx) => {
			ctx.anims.play("MOVING");
			ctx.clearTarget();
		},
		onExit: (ctx) => {},
		updateFunction: (ctx, time, delta) => {},
	},
	DYING: {
		key: "DYING",
		animationConfig: {
			start: 32,
			end: 35,
			frameRate: 10,
			repeat: 0,
		},
		onEnter: (ctx) => {
			ctx.anims.play("DYING");
			ctx.dead = true;
			setTimeout(() => {
				ctx.destroy();
			}, 5000);
		},
		onExit: (ctx) => {},
		updateFunction: (ctx, time, delta) => {},
	},
	SHOOTING: {
		key: "SHOOTING",
		animationConfig: {
			start: 12,
			end: 15,
			frameRate: 10,
			repeat: -1,
		},
		onEnter: (ctx) => {
			ctx.anims.play("SHOOTING");
		},
		onExit: (ctx) => {},
		updateFunction: (ctx, time, delta) => {},
	},
};
