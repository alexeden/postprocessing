module.exports = function(api) {

	api.cache.forever();

	return {
    comments: false,
    plugins: [
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
		presets: [
			["@babel/preset-env", {
				"modules": false
			}]
		]
	};

};
