import { EnvExtractor } from "@sca-shared/utils";
import { API_BASE_URL, API_PROTOCOL, NODE_ENV, STORAGE_DRIVER } from "../const";
import type { ConfigSchemaType, ConfigValidationType } from "../types";

export const ConfigSchema: ConfigSchemaType = (validatedConfig: ConfigValidationType) => ({
	env: EnvExtractor.env(validatedConfig, NODE_ENV),
	api: {
		protocol: EnvExtractor.env(validatedConfig, API_PROTOCOL),
		baseUrl: EnvExtractor.env(validatedConfig, API_BASE_URL),
	},
	storage: {
		driver: EnvExtractor.env(validatedConfig, STORAGE_DRIVER),
	},
});
