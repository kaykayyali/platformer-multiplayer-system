// Webpack
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import * as config from "./webpack.config.cjs";
const compiler = webpack(config.default);
const webpackInstance = webpackDevMiddleware(compiler, {
	publicPath: "/",
	writeToDisk: true,
});

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

app.use(webpackInstance);
app.use(express.static("src"));

server.listen(3000);

io.on("connection", (socket) => {
	console.log("a user connected");
});

webpackInstance.waitUntilValid(() => {
	const filename = webpackInstance.getFilenameFromUrl("/server.bundle.js");

	console.log(`Filename is ${filename}`);
	console.log("Server Ready on http://localhost:3000");
	if (!process.env.PROD) {
		opener("http://localhost:3000");
	}
	setupAuthoritativePhaser();
});

const { JSDOM } = jsdom;
function setupAuthoritativePhaser() {
	JSDOM.fromFile(path.join(__dirname, "dist/engine.html"), {
		runScripts: "dangerously",
		resources: "usable",
		pretendToBeVisual: true,
		url: "http://localhost:3000",
	})
		.then((dom) => {
			console.log("location is", dom.window.location.href);
			dom.window.io = io;
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
