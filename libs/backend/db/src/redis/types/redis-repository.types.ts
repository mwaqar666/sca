import type { BaseRedisEntity } from "../entities";
import type { IEntityStatus, TAbsent, TCreated, TDisconnected, TExpiryAdded, TPreConnected, TPresent, TReconnected } from "./redis-entity.types";
import type { Observable } from "rxjs";

export interface IRedisRepository {
	initializeRepository(): Promise<void>;
}

export interface IExpiryObserver<TIncludeExpiry extends TAbsent | TPresent> {
	postExpiryTasks: TIncludeExpiry extends TPresent ? Observable<string> : null;
}

export type IRedisEntityField = string;

export type IRedisEntityValue = string | number | boolean | Date;

export type IEntityConnectionStatus<TEntity extends BaseRedisEntity<TEntity>> = IEntityStatus<TEntity, TCreated> | IEntityStatus<TEntity, TPreConnected> | IEntityStatus<TEntity, TReconnected>;

export type IEntityDisconnectionStatus<TEntity extends BaseRedisEntity<TEntity>> =
	| (IEntityStatus<TEntity, TAbsent> & IExpiryObserver<TAbsent>)
	| (IEntityStatus<TEntity, TDisconnected> & IExpiryObserver<TAbsent>)
	| (IEntityStatus<TEntity, TExpiryAdded> & IExpiryObserver<TPresent>);

export type IEntityRemovalStatus<TEntity extends BaseRedisEntity<TEntity>> = IEntityStatus<TEntity, TDisconnected> | IEntityStatus<TEntity, TExpiryAdded>;
