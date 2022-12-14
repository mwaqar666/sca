import type { CipherGCMTypes } from "crypto";
import type { DB2, DEVELOPMENT, ENTITIES, MARIA_DB, MIGRATIONS, MS_SQL, MY_SQL, POSTGRES, PRODUCTION, QUALITY_ASSURANCE, SNOWFLAKE, SQLITE, USER_ACCEPTANCE_TESTING } from "../const";

export type Env = typeof DEVELOPMENT | typeof QUALITY_ASSURANCE | typeof USER_ACCEPTANCE_TESTING | typeof PRODUCTION;

export type Dialect = typeof MY_SQL | typeof POSTGRES | typeof SQLITE | typeof MARIA_DB | typeof MS_SQL | typeof DB2 | typeof SNOWFLAKE;

export type DbGenerator = typeof MIGRATIONS | typeof ENTITIES;

export interface TokenConfig {
	accessTokenSecret: string;
	accessTokenExpiry: string;
	refreshTokenSecret: string;
	refreshTokenExpiry: string;
}

export interface DatabaseConfig {
	dialect: Dialect;
	username: string;
	password: string;
	host: string;
	port: number;
	database: string;
	schema: string;
	generator: DbGenerator;
}

export interface RedisConfig {
	hostname: string;
	port: number;
	username: string;
	password: string;
}

export interface CryptConfig {
	appKey: string;
	blockCipher: CipherGCMTypes;
	authTagByteLength: number;
	initializationVectorByteLength: number;
	encryptionKeyByteLength: number;
	saltByteLength: number;
	saltIterations: number;
	saltScheme: string;
}

export interface AppConfig {
	host: string;
	port: number;
	name: string;
	version: string;
}

export interface ConfigType {
	env: Env;

	tokens: TokenConfig;

	database: DatabaseConfig;

	redis: RedisConfig;

	crypt: CryptConfig;

	app: AppConfig;
}
