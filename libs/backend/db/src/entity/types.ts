import type { Constructable, FilterWhereNot, Key, Nullable } from "@sca-shared/utils";
import type { ScopeOptions } from "sequelize";
import type { ScopesOptions } from "sequelize-typescript";
import type { SequelizeScopeConst } from "../const";
import { BaseEntity } from "./base.entity";

export class SequelizeBaseEntity<TEntity extends BaseEntity<TEntity>> extends BaseEntity<TEntity> {}

export type EntityScope = Array<string | ScopeOptions>;

export type EntityRelationshipPropertyTypes = Nullable<SequelizeBaseEntity<any>> | SequelizeBaseEntity<any> | Array<SequelizeBaseEntity<any>>;

export type EntityKeyValues<TEntity extends SequelizeBaseEntity<TEntity>> = { [TProp in Key<TEntity>]: TEntity[TProp] };

export type BaseEntityKeyValues<TEntity extends SequelizeBaseEntity<TEntity>> = { [TProp in Key<SequelizeBaseEntity<TEntity>>]: SequelizeBaseEntity<TEntity>[TProp] };

export type EntityProperties<TEntity extends SequelizeBaseEntity<TEntity>> = Omit<EntityKeyValues<TEntity>, Key<BaseEntityKeyValues<TEntity>>>;

export type EntityNonTableColumnProperties = EntityRelationshipPropertyTypes | ((...params: any) => any);

export type EntityTableColumnProperties<TEntity extends SequelizeBaseEntity<TEntity>> = FilterWhereNot<EntityProperties<TEntity>, EntityNonTableColumnProperties>;

export type Relationship<TEntity extends SequelizeBaseEntity<TEntity>> = {
	propertyKey: string;
	entityOrEntities: SequelizeBaseEntity<TEntity> | Array<SequelizeBaseEntity<TEntity>>;
};

export type AvailableScopes = Record<typeof SequelizeScopeConst[keyof typeof SequelizeScopeConst], ScopesOptions>;

export type EntityType<TEntity extends SequelizeBaseEntity<TEntity>> = Constructable<TEntity> & typeof SequelizeBaseEntity<TEntity>;
