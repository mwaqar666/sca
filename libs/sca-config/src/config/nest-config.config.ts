import { Development, NODE_ENV } from "~/const";
import { ConfigFactory } from "~/factory";
import { ConfigValidation } from "~/validation";
import { ConfigModuleOptions } from "@nestjs/config";

const nodeEnvironment = process.env[NODE_ENV] ?? Development;

export const NestConfigConfig: ConfigModuleOptions = {
	envFilePath: [`.env.${nodeEnvironment}`],
	load: [ConfigFactory],
	isGlobal: true,
	validationSchema: ConfigValidation,
	expandVariables: true,
	validationOptions: {
		abortEarly: true,
	},
};
