import { RedisClientType, RedisFunctions, RedisModules, RedisScripts } from "@redis/client";
import { RedisDefaultModules } from "redis";
import { Client } from "redis-om";

export interface IRedisConnection {
	client: Client;
	redis: RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;
}

export interface IRedisConnections {
	[connectionName: string]: IRedisConnection;
}
