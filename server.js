// Webpack
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const config = require("./webpack.config.js");
const compiler = webpack(config);
const webpackInstance = webpackDevMiddleware(compiler, {
	publicPath: config.output.publicPath,
	writeToDisk: true,
});

// Util to open the browser for you on start
const opener = require("opener");

const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");

const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(webpackInstance);
// app.use(express.static("dist"));

io.on("connection", (socket) => {
	console.log("a user connected");
});

webpackInstance.waitUntilValid(() => {
	const filename = webpackInstance.getFilenameFromUrl("/server.bundle.js");

	console.log(`Filename is ${filename}`);
});

server.listen(3000, function () {
	console.log("Server Ready on http://localhost:3000");
	if (!process.env.PROD) {
		opener("http://localhost:3000");
	}
});

const { JSDOM } = jsdom;
function setupAuthoritativePhaser() {
	JSDOM.fromFile(path.join(__dirname, "dist/engine.html"), {
		runScripts: "dangerously",
		resources: "usable",
		pretendToBeVisual: true,
	})
		.then((dom) => {
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
setupAuthoritativePhaser();
