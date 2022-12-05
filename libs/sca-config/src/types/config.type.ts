import { Db2, Development, MariaDb, MsSQL, MySQL, Postgres, Production, QualityAssurance, Snowflake, Sqlite, UserAcceptanceTesting } from "@/const";

export type Env = typeof Development | typeof QualityAssurance | typeof UserAcceptanceTesting | typeof Production;

export type Dialect = typeof MySQL | typeof Postgres | typeof Sqlite | typeof MariaDb | typeof MsSQL | typeof Db2 | typeof Snowflake;

export type DatabaseConfig = {
	dialect: Dialect;
	username: string;
	password: string;
	host: string;
	port: number;
	database: string;
	schema: string;
};

export type AppConfig = {
	host: string;
	port: number;
	name: string;
	version: string;
};

export type TokenConfig = {
	accessTokenSecret: string;
	accessTokenExpiry: string;
	refreshTokenSecret: string;
	refreshTokenExpiry: string;
};

export type RedisConfig = {
	hostname: string;
	port: number;
	username: string;
	password: string;
};

export type ConfigType = {
	env: Env;

	tokens: TokenConfig;

	database: DatabaseConfig;

	redis: RedisConfig;

	app: AppConfig;
};
