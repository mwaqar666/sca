import type { BaseRedisEntity } from "../entities";
import { RedisConnections } from "../const";
import { type IRedisConnection, RedisService } from "@sca-backend/redis";
import { Injectable, Scope } from "@nestjs/common";
import type { Repository, Schema } from "redis-om";
import { first, type Observable, Subject } from "rxjs";

@Injectable({ scope: Scope.TRANSIENT })
export class RedisStorageRepository<TEntity extends BaseRedisEntity<TEntity>> {
	public redisStorageConnection: IRedisConnection;
	public repository: Repository<TEntity>;

	private redisEventListenerConnection: IRedisConnection;
	private expirationEventPool$: Subject<string>;

	public constructor(
		// Dependencies

		private readonly redisService: RedisService,
	) {}

	public async initializeRepository(schema: Schema<TEntity>): Promise<void> {
		this.redisStorageConnection = await this.getRedisStorageConnection();
		this.repository = await this.getRepository(schema);

		this.redisEventListenerConnection = await this.getRedisEventListenerConnection();
		this.expirationEventPool$ = new Subject<string>();
		await this.keepListeningForKeyExpiryEvents();
	}

	public postExpiryListener(entityName: string, entityId: string): Observable<string> {
		return this.expirationEventPool$.pipe(
			first((expiredEntityKey: string) => {
				return expiredEntityKey === `${entityName}:${entityId}`;
			}),
		);
	}

	private async getRedisStorageConnection(): Promise<IRedisConnection> {
		return await this.redisService.getConnection(RedisConnections.StorageConnection);
	}

	private async getRedisEventListenerConnection(): Promise<IRedisConnection> {
		return await this.redisService.getConnection(RedisConnections.KeyEventsSubscriberConnection);
	}

	private async getRepository(schema: Schema<TEntity>): Promise<Repository<TEntity>> {
		const repository = this.redisStorageConnection.client.fetchRepository(schema);
		await repository.createIndex();

		return repository;
	}

	private async keepListeningForKeyExpiryEvents(): Promise<void> {
		await this.redisEventListenerConnection.redis.pSubscribe("__keyevent@0__:expired", (message: string) => {
			this.expirationEventPool$.next(message);
		});
	}
}
