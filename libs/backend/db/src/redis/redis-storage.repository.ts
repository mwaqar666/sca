import type { BaseRedisEntity } from "./base-redis.entity";
import { RedisConnections } from "./redis-connection.const";
import { type IRedisConnection, RedisService } from "@sca-backend/redis";
import { Injectable, Scope } from "@nestjs/common";
import type { Repository, Schema } from "redis-om";

@Injectable({ scope: Scope.TRANSIENT })
export class RedisStorageRepository<TEntity extends BaseRedisEntity<TEntity>> {
	public redisConnection: IRedisConnection;
	public repository: Repository<TEntity>;

	public constructor(
		// Dependencies

		private readonly redisService: RedisService,
	) {}

	public async initializeRepository(schema: Schema<TEntity>): Promise<void> {
		this.redisConnection = await this.getRedisConnection();
		this.repository = await this.getRepository(schema);
	}

	private async getRedisConnection(): Promise<IRedisConnection> {
		return await this.redisService.getConnection(RedisConnections.StorageConnection);
	}

	private async getRepository(schema: Schema<TEntity>): Promise<Repository<TEntity>> {
		const repository = this.redisConnection.client.fetchRepository(schema);
		await repository.createIndex();

		return repository;
	}
}
