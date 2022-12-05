import { APP_HOST, APP_PORT, DB_DIALECT, DB_HOST, DB_PORT, REDIS_HOST, REDIS_PORT } from "@/const/config.const";
import { Development } from "@/const/env.const";

export const ConfigDefaultsConst = {
	Environment: Development,
	Database: {
		[DB_HOST]: "localhost",
		[DB_DIALECT]: "mysql",
		[DB_PORT]: 3306,
	},
	Redis: {
		[REDIS_HOST]: "localhost",
		[REDIS_PORT]: 6379,
	},
	App: {
		[APP_HOST]: "localhost",
		[APP_PORT]: 3000,
	},
};
