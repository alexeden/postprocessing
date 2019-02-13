import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import string from "rollup-plugin-string";

export default [{
	input: "demo/src/index.js",
	output: {
		file: "public/demo/index.js",
		format: "iife",
		globals: { three: "THREE" }
	},
	external: ["three"],
	plugins: [
		resolve(),
		typescript({
			tsconfig: "./src/tsconfig.json",
			tsconfigOverride: {
				declaration: false
			}
		}),
		commonjs({ extensions: [".js", ".ts"] }),
		string({
			include: ["**/*.frag", "**/*.vert"]
		})
	].concat(process.env.NODE_ENV === "production" ? [babel()] : [])
}];
