const { GetEnvVars: readEnvFile } = require("env-cmd");
const { resolve } = require("path");
const { DefinePlugin } = require("webpack");

const extractEnvFileVariables = async (configuration) => {
	const environmentFilePath = resolve(process.cwd(), "config", "frontend", `.env.${configuration}`);

	const environmentVariables = await readEnvFile({ envFile: { filePath: environmentFilePath } });
	environmentVariables["NODE_ENV"] = configuration;

	return { "process.env": environmentVariables };
};

module.exports = async (config, options, context) => {
	const environmentVariables = await extractEnvFileVariables(context.configuration);
	const definePlugin = new DefinePlugin(environmentVariables);

	config.mode = "none";
	config.stats.preset = "normal";
	config.plugins.push(definePlugin);

	return config;
};
