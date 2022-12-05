import {
	ACCESS_TOKEN_EXPIRY,
	ACCESS_TOKEN_SECRET,
	APP_HOST,
	APP_NAME,
	APP_PORT,
	APP_VERSION,
	DB_DATABASE,
	DB_DIALECT,
	DB_HOST,
	DB_PASSWORD,
	DB_PORT,
	DB_SCHEMA,
	DB_USERNAME,
	NODE_ENV,
	REDIS_HOST,
	REDIS_PASSWORD,
	REDIS_PORT,
	REDIS_USERNAME,
	REFRESH_TOKEN_EXPIRY,
	REFRESH_TOKEN_SECRET,
} from "@/const";
import { EnvExtractorHelper } from "@/helpers";
import { ConfigType } from "@/types";
import { ConfigFactory as NestConfigFactory } from "@nestjs/config";

export const ConfigFactory: NestConfigFactory<ConfigType> = () => {
	return {
		env: EnvExtractorHelper.env(NODE_ENV),

		tokens: {
			accessTokenSecret: EnvExtractorHelper.env(ACCESS_TOKEN_SECRET),
			accessTokenExpiry: EnvExtractorHelper.env(ACCESS_TOKEN_EXPIRY),
			refreshTokenSecret: EnvExtractorHelper.env(REFRESH_TOKEN_SECRET),
			refreshTokenExpiry: EnvExtractorHelper.env(REFRESH_TOKEN_EXPIRY),
		},

		database: {
			dialect: EnvExtractorHelper.env(DB_DIALECT),
			username: EnvExtractorHelper.env(DB_USERNAME),
			password: EnvExtractorHelper.env(DB_PASSWORD),
			host: EnvExtractorHelper.env(DB_HOST),
			port: parseInt(EnvExtractorHelper.env(DB_PORT), 10),
			database: EnvExtractorHelper.env(DB_DATABASE),
			schema: EnvExtractorHelper.env(DB_SCHEMA),
		},

		redis: {
			hostname: EnvExtractorHelper.env(REDIS_HOST),
			port: parseInt(EnvExtractorHelper.env(REDIS_PORT), 10),
			username: EnvExtractorHelper.env(REDIS_USERNAME),
			password: EnvExtractorHelper.env(REDIS_PASSWORD),
		},

		app: {
			host: EnvExtractorHelper.env(APP_HOST),
			port: parseInt(EnvExtractorHelper.env(APP_PORT), 10),
			name: EnvExtractorHelper.env(APP_NAME),
			version: EnvExtractorHelper.env(APP_VERSION),
		},
	};
};
