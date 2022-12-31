import type { Nullable } from "@sca-shared/utils";
import type { BaseRedisEntity } from "./base-redis.entity";

export type TAbsent = "Absent"; // Entity not present
export type TPresent = "Present"; // Entity present
export type TCreated = "Created"; // Entity created
export type TUpdated = "Updated"; // Entity updated
export type TRemoved = "Removed"; // Entity removed

export type TReconnected = "Reconnected"; // Entity last connection persisted
export type TExpiryAdded = "ExpiryAdded"; // Entity last connection expiry started

export type TDisconnected = "Disconnected"; // Entity additional connection removed
export type TPreConnected = "PreConnected"; // Entity additional connection added

export interface IEntityStatus<TEntity extends BaseRedisEntity<TEntity>> {
	entity: Nullable<BaseRedisEntity<TEntity>>;
	status: TAbsent | TPresent | TCreated | TUpdated | TRemoved | TReconnected | TExpiryAdded | TDisconnected | TPreConnected;
}

export interface IEntityAbsent<TEntity extends BaseRedisEntity<TEntity>> extends IEntityStatus<TEntity> {
	entity: null;
	status: TAbsent;
}

export interface IEntityPresent<TEntity extends BaseRedisEntity<TEntity>> extends IEntityStatus<TEntity> {
	entity: TEntity;
	status: TPresent;
}

export interface IEntityCreated<TEntity extends BaseRedisEntity<TEntity>> extends IEntityStatus<TEntity> {
	entity: TEntity;
	status: TCreated;
}

export interface IEntityUpdated<TEntity extends BaseRedisEntity<TEntity>> extends IEntityStatus<TEntity> {
	entity: TEntity;
	status: TUpdated;
}

export interface IEntityRemoved<TEntity extends BaseRedisEntity<TEntity>> extends IEntityStatus<TEntity> {
	entity: null;
	status: TRemoved;
}

export interface IEntityReconnected<TEntity extends BaseRedisEntity<TEntity>> extends IEntityStatus<TEntity> {
	entity: TEntity;
	status: TReconnected;
}

export interface IEntityExpiryAdded<TEntity extends BaseRedisEntity<TEntity>> extends IEntityStatus<TEntity> {
	entity: TEntity;
	status: TExpiryAdded;
}

export interface IEntityDisconnected<TEntity extends BaseRedisEntity<TEntity>> extends IEntityStatus<TEntity> {
	entity: TEntity;
	status: TDisconnected;
}

export interface IEntityPreConnected<TEntity extends BaseRedisEntity<TEntity>> extends IEntityStatus<TEntity> {
	entity: TEntity;
	status: TPreConnected;
}
