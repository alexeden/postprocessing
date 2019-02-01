const path = require("path");
// const webpack = require("webpack");

const babelOptions = {
	presets: ["@babel/preset-env"]
};

module.exports = {
	target: "web",

	mode: "production",

	context: path.resolve(__dirname, "src"),

	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},

	entry: {
		postprocessing: "./postprocessing.ts"
	},

	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist"),
		libraryTarget: "umd",
		library: "postprocessing"
	},

	externals: {
		three: "THREE"
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

	optimization: {
		minimize: true
	}
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
