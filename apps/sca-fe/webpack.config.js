// noinspection DuplicatedCode

const { GetEnvVars: readEnvFile } = require("env-cmd");
const { resolve } = require("path");
const { DefinePlugin } = require("webpack");

const extractEnvFileVariables = async (configuration) => {
	const environmentFilePath = resolve(process.cwd(), "config", "frontend", `.env.${configuration}`);

	const environmentVariables = await readEnvFile({ envFile: { filePath: environmentFilePath } });
	environmentVariables["NODE_ENV"] = configuration;

	const emptyFilteredEnvironmentVariables = {};

	for (const [variableKey, variableValue] of Object.entries(environmentVariables)) {
		if (variableValue === "") continue;

		emptyFilteredEnvironmentVariables[variableKey] = JSON.stringify(variableValue);
	}

	return { "process.env": emptyFilteredEnvironmentVariables };
};

module.exports = async (config, options, context) => {
	const environmentVariables = await extractEnvFileVariables(context.configuration);
	const definePlugin = new DefinePlugin(environmentVariables);

	config.mode = "none";
	config.plugins.push(definePlugin);

	return config;
};
