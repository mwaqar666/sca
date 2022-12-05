import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, APP_HOST, APP_NAME, APP_PORT, APP_VERSION, DB_DATABASE, DB_DIALECT, DB_HOST, DB_PASSWORD, DB_PORT, DB_SCHEMA, DB_USERNAME, NODE_ENV, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from "@/const";
import { Dialect, Env } from "@/types/config.type";
import * as Joi from "joi";

export interface ConfigValidationType {
	[NODE_ENV]: Joi.StringSchema<Env>;

	[ACCESS_TOKEN_SECRET]: Joi.StringSchema;
	[ACCESS_TOKEN_EXPIRY]: Joi.StringSchema;
	[REFRESH_TOKEN_SECRET]: Joi.StringSchema;
	[REFRESH_TOKEN_EXPIRY]: Joi.StringSchema;

	[DB_USERNAME]: Joi.StringSchema;
	[DB_PASSWORD]: Joi.StringSchema;
	[DB_DATABASE]: Joi.StringSchema;
	[DB_HOST]: Joi.StringSchema;
	[DB_DIALECT]: Joi.StringSchema<Dialect>;
	[DB_PORT]: Joi.NumberSchema;
	[DB_SCHEMA]: Joi.StringSchema;

	[REDIS_HOST]: Joi.StringSchema;
	[REDIS_PORT]: Joi.NumberSchema;
	[REDIS_USERNAME]: Joi.StringSchema;
	[REDIS_PASSWORD]: Joi.StringSchema;

	[APP_HOST]: Joi.StringSchema;
	[APP_PORT]: Joi.NumberSchema;
	[APP_NAME]: Joi.StringSchema;
	[APP_VERSION]: Joi.StringSchema;
}
