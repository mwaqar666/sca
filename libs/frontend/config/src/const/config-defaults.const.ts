import { DEVELOPMENT, HTTP, LOCAL_STORAGE } from "./config-values.const";
import { API_PROTOCOL, STORAGE_DRIVER } from "./config.const";

export const ConfigDefaultsConst = {
	Environment: DEVELOPMENT,
	Api: {
		[API_PROTOCOL]: HTTP,
	},
	Storage: {
		[STORAGE_DRIVER]: LOCAL_STORAGE,
	},
};
