// Webpack
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import * as config from "./webpack.config.cjs";

// Fix for __dirname
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// Util to open the browser for you on start
import opener from "opener";

import express from "express";
import { createServer } from "http";
import path from "path";
import jsdom from "jsdom";

import DataURIParser from "datauri/parser.js";
const parser = new DataURIParser();

const app = express();
const server = createServer(app);
import { Server } from "socket.io";
const io = new Server(server);

if (process.env.NODE_ENV !== "production") {
	const compiler = webpack(config.default);
	const webpackInstance = webpackDevMiddleware(compiler, {
		publicPath: "/",
		writeToDisk: true,
	});
	app.use(webpackInstance);
	webpackInstance.waitUntilValid(() => {
		const filename =
			webpackInstance.getFilenameFromUrl("/server.bundle.js");

		console.log(`Filename is ${filename}`);
		console.log("Server Ready on http://localhost:3000");
		setupAuthoritativePhaser();
	});
} else {
	app.use(express.static("dist"));
	setupAuthoritativePhaser();
}

server.listen(process.env.PORT || 3000);

function setupAuthoritativePhaser() {
	const { JSDOM } = jsdom;
	JSDOM.fromFile(path.join(__dirname, "dist/engine.html"), {
		runScripts: "dangerously",
		resources: "usable",
		pretendToBeVisual: true,
		url: `http://localhost:${process.env.PORT || 3000}`,
	})
		.then((dom) => {
			dom.window.serverIO = io;
			dom.window.isServer = true;
			dom.window.URL.createObjectURL = (blob) => {
				if (blob) {
					return parser.format(
						blob.type,
						blob[Object.getOwnPropertySymbols(blob)[0]]._buffer
					).content;
				}
			};
			dom.window.URL.revokeObjectURL = (objectURL) => {};
		})
		.catch((error) => {
			console.log(error.message);
		});
}
