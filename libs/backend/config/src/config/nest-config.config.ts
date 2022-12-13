import { ConfigModuleOptions } from "@nestjs/config";
import * as process from "process";
import { DEVELOPMENT, NODE_ENV } from "../const";
import { ConfigFactory } from "../factory";
import { ConfigValidation } from "../validation";

const nodeEnvironment = process.env[NODE_ENV] ?? DEVELOPMENT;
const environmentFilePath = `${process.cwd()}/.env.${nodeEnvironment}`;

export const NestConfigConfig: ConfigModuleOptions = {
	envFilePath: [environmentFilePath],
	load: [ConfigFactory],
	isGlobal: true,
	validationSchema: ConfigValidation,
	expandVariables: true,
	validationOptions: {
		abortEarly: true,
	},
};
