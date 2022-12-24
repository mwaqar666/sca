import type { CipherGCMTypes } from "crypto";
import * as Joi from "joi";
import type {
	ACCESS_TOKEN_EXPIRY,
	ACCESS_TOKEN_SECRET,
	APP_HOST,
	APP_NAME,
	APP_PORT,
	APP_VERSION,
	CRYPT_APP_KEY,
	CRYPT_AUTH_TAG_BYTE_LEN,
	CRYPT_BLOCK_CIPHER,
	CRYPT_ENCRYPTION_KEY_BYTE_LENGTH,
	CRYPT_HASH_SALT_ITERATIONS,
	CRYPT_INITIALIZATION_VECTOR_BYTE_LEN,
	CRYPT_SALT_BYTE_LEN,
	CRYPT_SALT_ITERATIONS,
	CRYPT_SALT_SCHEME,
	CUSTOMER_TOKEN_EXPIRY,
	CUSTOMER_TOKEN_SECRET,
	DB_DATABASE,
	DB_DIALECT,
	DB_GENERATOR,
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
	SOCKET_AGENT_PATH,
	SOCKET_AGENT_PORT,
	SOCKET_CUSTOMER_PATH,
	SOCKET_CUSTOMER_PORT,
} from "../const";
import { DbGenerator, Dialect, Env } from "./config.type";

export interface ConfigValidationType {
	[NODE_ENV]: Joi.StringSchema<Env>;

	[ACCESS_TOKEN_SECRET]: Joi.StringSchema;
	[ACCESS_TOKEN_EXPIRY]: Joi.StringSchema;
	[REFRESH_TOKEN_SECRET]: Joi.StringSchema;
	[REFRESH_TOKEN_EXPIRY]: Joi.StringSchema;
	[CUSTOMER_TOKEN_SECRET]: Joi.StringSchema;
	[CUSTOMER_TOKEN_EXPIRY]: Joi.StringSchema;

	[DB_USERNAME]: Joi.StringSchema;
	[DB_PASSWORD]: Joi.StringSchema;
	[DB_DATABASE]: Joi.StringSchema;
	[DB_HOST]: Joi.StringSchema;
	[DB_DIALECT]: Joi.StringSchema<Dialect>;
	[DB_PORT]: Joi.NumberSchema;
	[DB_SCHEMA]: Joi.StringSchema;
	[DB_GENERATOR]: Joi.StringSchema<DbGenerator>;

	[REDIS_HOST]: Joi.StringSchema;
	[REDIS_PORT]: Joi.NumberSchema;
	[REDIS_USERNAME]: Joi.StringSchema;
	[REDIS_PASSWORD]: Joi.StringSchema;

	[CRYPT_APP_KEY]: Joi.StringSchema;
	[CRYPT_BLOCK_CIPHER]: Joi.StringSchema<CipherGCMTypes>;
	[CRYPT_AUTH_TAG_BYTE_LEN]: Joi.NumberSchema;
	[CRYPT_INITIALIZATION_VECTOR_BYTE_LEN]: Joi.NumberSchema;
	[CRYPT_ENCRYPTION_KEY_BYTE_LENGTH]: Joi.NumberSchema;
	[CRYPT_SALT_BYTE_LEN]: Joi.NumberSchema;
	[CRYPT_SALT_ITERATIONS]: Joi.NumberSchema;
	[CRYPT_SALT_SCHEME]: Joi.StringSchema;
	[CRYPT_HASH_SALT_ITERATIONS]: Joi.NumberSchema;

	[SOCKET_AGENT_PORT]: Joi.NumberSchema;
	[SOCKET_AGENT_PATH]: Joi.StringSchema;
	[SOCKET_CUSTOMER_PORT]: Joi.NumberSchema;
	[SOCKET_CUSTOMER_PATH]: Joi.StringSchema;

	[APP_HOST]: Joi.StringSchema;
	[APP_PORT]: Joi.NumberSchema;
	[APP_NAME]: Joi.StringSchema;
	[APP_VERSION]: Joi.StringSchema;
}
