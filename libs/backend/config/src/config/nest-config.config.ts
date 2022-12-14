import type { ConfigModuleOptions } from "@nestjs/config";
import { PathHelpers } from "@sca-backend/utils";
import { EnvExtractor } from "@sca-shared/utils";
import { DEVELOPMENT, NODE_ENV } from "../const";
import { ConfigFactory } from "../factory";
import { ConfigValidation } from "../validation";

const nodeEnvironment = EnvExtractor.env(NODE_ENV) ?? DEVELOPMENT;
const environmentFilePath = PathHelpers.configPath(`backend/.env.${nodeEnvironment}`);

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
