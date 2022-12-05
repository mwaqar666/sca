import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, APP_HOST, APP_NAME, APP_PORT, APP_VERSION, ConfigDefaultsConst, Db2, DB_DATABASE, DB_DIALECT, DB_HOST, DB_PASSWORD, DB_PORT, DB_SCHEMA, DB_USERNAME, Development, MariaDb, MsSQL, MySQL, NODE_ENV, Postgres, Production, QualityAssurance, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, Snowflake, Sqlite, UserAcceptanceTesting } from "@/const";
import { ConfigValidationType } from "@/types";
import * as Joi from "joi";

export const ConfigValidation: Joi.ObjectSchema<ConfigValidationType> = Joi.object<ConfigValidationType>({
	[NODE_ENV]: Joi.string().required().valid(Development, QualityAssurance, UserAcceptanceTesting, Production).default(ConfigDefaultsConst.Environment),

	[ACCESS_TOKEN_SECRET]: Joi.string().required(),
	[ACCESS_TOKEN_EXPIRY]: Joi.string().required(),
	[REFRESH_TOKEN_SECRET]: Joi.string().required(),
	[REFRESH_TOKEN_EXPIRY]: Joi.string().required(),

	[DB_USERNAME]: Joi.string().required(),
	[DB_PASSWORD]: Joi.string().required(),
	[DB_DATABASE]: Joi.string().required(),
	[DB_HOST]: Joi.string().optional().default(ConfigDefaultsConst.Database[DB_HOST]),
	[DB_DIALECT]: Joi.string().optional().valid(MySQL, Postgres, Sqlite, MariaDb, MsSQL, Db2, Snowflake).default(ConfigDefaultsConst.Database[DB_DIALECT]),
	[DB_PORT]: Joi.number().optional().default(ConfigDefaultsConst.Database[DB_PORT]),
	[DB_SCHEMA]: Joi.string().required(),

	[REDIS_HOST]: Joi.string().optional().default(ConfigDefaultsConst.Redis[REDIS_HOST]),
	[REDIS_PORT]: Joi.number().optional().default(ConfigDefaultsConst.Redis[REDIS_PORT]),
	[REDIS_USERNAME]: Joi.string().required(),
	[REDIS_PASSWORD]: Joi.string().required(),

	[APP_HOST]: Joi.string().optional().default(ConfigDefaultsConst.App[APP_HOST]),
	[APP_PORT]: Joi.number().optional().default(ConfigDefaultsConst.App[APP_PORT]),
	[APP_NAME]: Joi.string().required(),
	[APP_VERSION]: Joi.string().required(),
});
