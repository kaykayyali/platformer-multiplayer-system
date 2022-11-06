const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	entry: {
		client: "./src/client.js",
		server: "./src/server.js",
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
		publicPath: "/",
	},
	devtool: "inline-source-map",
	devServer: {
		static: "./dist",
	},
	stats: "errors-warnings",
	plugins: [
		new HtmlWebpackPlugin({
			title: "Development",
		}),
	],
	resolve: {
		alias: {
			Scenes: path.resolve(__dirname, "src/scenes/"),
			GameObjects: path.resolve(__dirname, "src/gameobjects/"),
			Utilities: path.resolve(__dirname, "src/utilities/"),
		},
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
			},
			{
				test: /\.(csv|tsv)$/i,
				use: ["csv-loader"],
			},
		],
	},
};
