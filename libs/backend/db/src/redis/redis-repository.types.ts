import type { BaseRedisEntity } from "./base-redis.entity";
import type { IEntityStatus, TCreated, TPreConnected, TReconnected } from "./redis-entity.types";

export interface IRedisRepository {
	initializeRepository(): Promise<void>;
}

export type IRedisEntityField = string;

export type IRedisEntityValue = string | number | boolean | Date;

export type IEntityConnectionStatus<TEntity extends BaseRedisEntity<TEntity>> = IEntityStatus<TEntity, TCreated> | IEntityStatus<TEntity, TPreConnected> | IEntityStatus<TEntity, TReconnected>;
