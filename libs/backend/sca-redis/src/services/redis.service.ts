import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisClientType, RedisFunctions, RedisModules, RedisScripts } from "@redis/client";
import { ConfigType, RedisConfig } from "@sca/config";
import { createClient, RedisDefaultModules } from "redis";
import { Client } from "redis-om";
import { IRedisConnection, IRedisConnections } from "../types";

@Injectable()
export class RedisService {
	private connections: IRedisConnections = {};
	private redisConfig: RedisConfig;

	public constructor(private readonly configService: ConfigService<ConfigType, true>) {
		this.prepareConfiguration();
	}

	public async getConnection(connectionName: string): Promise<IRedisConnection> {
		const existingConnection = this.connections[connectionName];
		if (existingConnection) return existingConnection;

		const redis = await this.createRedisClient();
		const client = await this.initializeRedisOmClient(redis);

		this.connections[connectionName] = { redis, client };
		return this.connections[connectionName];
	}

	private async createRedisClient(): Promise<RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>> {
		const redisClient = createClient({ url: this.prepareRedisConnectionUrl() });

		await redisClient.connect();

		return redisClient;
	}

	private async initializeRedisOmClient(redisConnection: RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>): Promise<Client> {
		return await new Client().use(redisConnection);
	}

	private prepareRedisConnectionUrl(): string {
		return `redis://${this.redisConfig.username}:${this.redisConfig.password}@${this.redisConfig.hostname}:${this.redisConfig.port}`;
	}

	private prepareConfiguration(): void {
		this.redisConfig = this.configService.get("redis");
	}
}
