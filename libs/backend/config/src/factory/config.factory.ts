import type { ConfigFactory as NestConfigFactory } from "@nestjs/config";
import { EnvExtractor } from "@sca-shared/utils";
import {
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
import type { ConfigType } from "../types";

export const ConfigFactory: NestConfigFactory<ConfigType> = () => {
	return {
		env: EnvExtractor.env(NODE_ENV),

		tokens: {
			accessTokenSecret: EnvExtractor.env(ACCESS_TOKEN_SECRET),
			accessTokenExpiry: EnvExtractor.env(ACCESS_TOKEN_EXPIRY),
			refreshTokenSecret: EnvExtractor.env(REFRESH_TOKEN_SECRET),
			refreshTokenExpiry: EnvExtractor.env(REFRESH_TOKEN_EXPIRY),
		},

		database: {
			dialect: EnvExtractor.env(DB_DIALECT),
			username: EnvExtractor.env(DB_USERNAME),
			password: EnvExtractor.env(DB_PASSWORD),
			host: EnvExtractor.env(DB_HOST),
			port: parseInt(EnvExtractor.env(DB_PORT), 10),
			database: EnvExtractor.env(DB_DATABASE),
			schema: EnvExtractor.env(DB_SCHEMA),
			generator: EnvExtractor.env(DB_GENERATOR),
		},

		redis: {
			hostname: EnvExtractor.env(REDIS_HOST),
			port: parseInt(EnvExtractor.env(REDIS_PORT), 10),
			username: EnvExtractor.env(REDIS_USERNAME),
			password: EnvExtractor.env(REDIS_PASSWORD),
		},

		crypt: {
			appKey: EnvExtractor.env(CRYPT_APP_KEY),
			blockCipher: EnvExtractor.env(CRYPT_BLOCK_CIPHER),
			authTagByteLength: parseInt(EnvExtractor.env(CRYPT_AUTH_TAG_BYTE_LEN), 10),
			initializationVectorByteLength: parseInt(EnvExtractor.env(CRYPT_INITIALIZATION_VECTOR_BYTE_LEN), 10),
			encryptionKeyByteLength: parseInt(EnvExtractor.env(CRYPT_ENCRYPTION_KEY_BYTE_LENGTH), 10),
			saltByteLength: parseInt(EnvExtractor.env(CRYPT_SALT_BYTE_LEN), 10),
			saltIterations: parseInt(EnvExtractor.env(CRYPT_SALT_ITERATIONS), 10),
			saltScheme: EnvExtractor.env(CRYPT_SALT_SCHEME),
			hashSaltIterations: parseInt(EnvExtractor.env(CRYPT_HASH_SALT_ITERATIONS), 10),
		},

		socket: {
			agentSocketPort: parseInt(EnvExtractor.env(SOCKET_AGENT_PORT), 10),
			agentSocketPath: EnvExtractor.env(SOCKET_AGENT_PATH),
			customerSocketPort: parseInt(EnvExtractor.env(SOCKET_CUSTOMER_PORT), 10),
			customerSocketPath: EnvExtractor.env(SOCKET_CUSTOMER_PATH),
		},

		app: {
			host: EnvExtractor.env(APP_HOST),
			port: parseInt(EnvExtractor.env(APP_PORT), 10),
			name: EnvExtractor.env(APP_NAME),
			version: EnvExtractor.env(APP_VERSION),
		},
	};
};
