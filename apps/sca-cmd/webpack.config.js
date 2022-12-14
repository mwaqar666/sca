const { merge } = require("webpack-merge");
const { IgnorePlugin } = require("webpack");

const WebpackIgnorePlugin = new IgnorePlugin({ resourceRegExp: /\.txt/ });

module.exports = (config) => {
	return merge(config, {
		plugins: [WebpackIgnorePlugin],
		node: {
			global: false,
			__filename: false,
			__dirname: false,
		},
	});
};
