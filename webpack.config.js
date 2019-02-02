const path = require("path");
const UnminifiedWebpackPlugin = require("unminified-webpack-plugin");
// const webpack = require("webpack");

const babelOptions = {
	presets: ["@babel/preset-env"]
};

module.exports = {
	target: "web",

	mode: "development",

	context: path.resolve(__dirname, "src"),

	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},

	entry: "./postprocessing.ts",

	output: {
		filename: "postprocessing.js",
		path: path.resolve(__dirname, "dist"),
		libraryTarget: "umd",
		library: "postprocessing"
	},

	externals: {
		three: "three"
	},

	devtool: "source-map",

	module: {
		rules: [
			{
				test: /\.(frag|vert)$/,
				use: "raw-loader"
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: babelOptions
					},
					{
						loader: "ts-loader"
					}
				]
			},
			{
				test: /\.js$/,
				use: {
					loader: "babel-loader",
					options: babelOptions
				}
			}
		]
	},
	plugins: [
		new UnminifiedWebpackPlugin({
		})
	]

	// optimization: {
	// 	minimize: true
	// }
	// plugins: [
	// 	new webpack.optimize.UglifyJsPlugin({
	// 		include: /\.min\.js$/,
	// 		sourceMap: true,
	// 		compressor: {
	// 			warnings: false
	// 		}
	// 	})
	// ]
};
