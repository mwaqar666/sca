import type { BaseRedisEntity } from "../entities";
import type { RedisStorageRepository } from "./redis-storage.repository";
import type { Key, Nullable } from "@sca-shared/utils";
import type { IRedisEntityField, IRedisEntitySchemaProperties, IRedisEntityValue, IRedisRepository } from "../types";
import type { EntityData, Schema } from "redis-om";
import type { Observable } from "rxjs";
import { RedisRepositoryConst } from "../const";

export abstract class BaseRedisRepository<TEntity extends BaseRedisEntity<TEntity>> implements IRedisRepository {
	protected constructor(
		// Dependencies

		private readonly redisSchema: Schema<TEntity>,
		private readonly storageRepository: RedisStorageRepository<TEntity>,
	) {}

	public async initializeRepository(): Promise<void> {
		await this.storageRepository.initializeRepository(this.redisSchema);
	}

	public async fetchEntity<K extends Key<IRedisEntitySchemaProperties<TEntity>>, V extends TEntity[K]>(whereField: K, equalsValue: V): Promise<Nullable<TEntity>> {
		return await this.storageRepository.repository
			.search()
			.where(<IRedisEntityField>whereField)
			.equals(<IRedisEntityValue>equalsValue)
			.return.first();
	}

	public async fetchEntities<K extends Key<IRedisEntitySchemaProperties<TEntity>>, V extends TEntity[K]>(whereField: K, equalsValue: V): Promise<Array<TEntity>> {
		return await this.storageRepository.repository
			.search()
			.where(<IRedisEntityField>whereField)
			.equals(<IRedisEntityValue>equalsValue)
			.return.all();
	}

	public async persistEntity(entityId: string): Promise<boolean> {
		return await this.storageRepository.redisStorageConnection.redis.persist(`${this.redisSchema.entityCtor.name}:${entityId}`);
	}

	public async expireEntity(entityId: string): Promise<void> {
		return await this.storageRepository.repository.expire(entityId, RedisRepositoryConst.EntityExpiryTime);
	}

	public postExpiryListener(entityId: string): Observable<string> {
		return this.storageRepository.postExpiryListener(this.redisSchema.entityCtor.name, entityId);
	}

	public async createEntity(entityProperties: IRedisEntitySchemaProperties<TEntity>): Promise<TEntity> {
		return await this.storageRepository.repository.createAndSave(<EntityData>entityProperties);
	}

	public async updateEntity(updatedEntity: TEntity): Promise<TEntity> {
		const updatedEntityId = await this.storageRepository.repository.save(updatedEntity);
		return await this.storageRepository.repository.fetch(updatedEntityId);
	}
}
