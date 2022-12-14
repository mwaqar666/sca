import type { RedisClientType, RedisFunctions, RedisModules, RedisScripts } from "@redis/client";
import type { RedisDefaultModules } from "redis";
import type { Client } from "redis-om";

export interface IRedisConnection {
	client: Client;
	redis: RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;
}

export interface IRedisConnections {
	[connectionName: string]: IRedisConnection;
}
