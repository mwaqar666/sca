import type { FilterWhereNot, Key } from "@sca-shared/utils";
import type { BaseRedisEntity } from "../entities";

export type TAbsent = "Absent"; // Entity not present
export type TPresent = "Present"; // Entity present
export type TCreated = "Created"; // Entity created
export type TUpdated = "Updated"; // Entity updated
export type TRemoved = "Removed"; // Entity removed

export type TReconnected = "Reconnected"; // Entity last connection persisted
export type TExpiryAdded = "ExpiryAdded"; // Entity last connection expiry started

export type TDisconnected = "Disconnected"; // Entity additional connection removed
export type TPreConnected = "PreConnected"; // Entity additional connection added

export type TEntityStatuses = TAbsent | TPresent | TCreated | TUpdated | TRemoved | TReconnected | TExpiryAdded | TDisconnected | TPreConnected;
export type TNullableEntityStatuses = TAbsent | TRemoved;
export type TNonNullableEntityStatuses = Exclude<TEntityStatuses, TNullableEntityStatuses>;

export interface IEntityStatus<TEntity extends BaseRedisEntity<TEntity>, TStatus extends TEntityStatuses> {
	entity: TStatus extends TNonNullableEntityStatuses ? TEntity : null;
	status: TStatus;
}

export type IRedisEntityKeyValues<TEntity extends BaseRedisEntity<TEntity>> = { [TProp in Key<TEntity>]: TEntity[TProp] };

export type IBaseRedisEntityKeyValues<TEntity extends BaseRedisEntity<TEntity>> = { [TProp in Key<BaseRedisEntity<TEntity>>]: BaseRedisEntity<TEntity>[TProp] };

export type IRedisEntityProperties<TEntity extends BaseRedisEntity<TEntity>> = Omit<IRedisEntityKeyValues<TEntity>, Key<IBaseRedisEntityKeyValues<TEntity>>>;

export type IRedisEntityNonSchemaProperties = (...params: any) => any;

export type IRedisEntitySchemaProperties<TEntity extends BaseRedisEntity<TEntity>> = FilterWhereNot<IRedisEntityProperties<TEntity>, IRedisEntityNonSchemaProperties>;
