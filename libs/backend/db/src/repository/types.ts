import { ExclusiveUnion } from "@sca-shared/utils";
import type { FindOptions, Transaction } from "sequelize";
import type { EntityScope, EntityTableColumnProperties, SequelizeBaseEntity } from "../entity";

export type EntityResolution<TEntity extends SequelizeBaseEntity<TEntity>> = TEntity | string | number;

export interface Transactional {
	transaction: Transaction;
}

export interface Scoped {
	scopes: EntityScope;
}

export interface ScopedFindOptions<TEntity extends SequelizeBaseEntity<TEntity>> extends Partial<Scoped> {
	findOptions: FindOptions<TEntity>;
}

export interface EntityFinderOptions<TEntity extends SequelizeBaseEntity<TEntity>> {
	findOptions: FindOptions<TEntity>;
}

export interface SingleEntityResolverOptions<TEntity extends SequelizeBaseEntity<TEntity>> {
	entity: EntityResolution<TEntity>;
}

export interface MultiEntityResolverOptions<TEntity extends SequelizeBaseEntity<TEntity>> {
	entities: Array<EntityResolution<TEntity>>;
}

export type SingleEntityFinderOrResolverOption<TEntity extends SequelizeBaseEntity<TEntity>> = ExclusiveUnion<[SingleEntityResolverOptions<TEntity>, EntityFinderOptions<TEntity>]>;

export type MultiEntityFinderOrResolverOption<TEntity extends SequelizeBaseEntity<TEntity>> = ExclusiveUnion<[MultiEntityResolverOptions<TEntity>, EntityFinderOptions<TEntity>]>;

export interface EntityUpdateBaseOptions<TEntity extends SequelizeBaseEntity<TEntity>> extends Transactional, Partial<Scoped> {
	valuesToUpdate: Partial<EntityTableColumnProperties<TEntity>>;
}

export type EntityFindOrCreateOptions<TEntity extends SequelizeBaseEntity<TEntity>> = Partial<SingleEntityFinderOrResolverOption<TEntity>> & Partial<Scoped> & SingleEntityCreateOptions<TEntity>;

export interface SingleEntityCreateOptions<TEntity extends SequelizeBaseEntity<TEntity>> extends Transactional {
	valuesToCreate: Partial<EntityTableColumnProperties<TEntity>>;
}

export interface MultipleEntityCreateOptions<TEntity extends SequelizeBaseEntity<TEntity>> extends Transactional {
	valuesToCreate: Array<Partial<EntityTableColumnProperties<TEntity>>>;
}

export type SingleEntityUpdateOptions<TEntity extends SequelizeBaseEntity<TEntity>> = SingleEntityFinderOrResolverOption<TEntity> & EntityUpdateBaseOptions<TEntity>;

export type MultipleEntityUpdateOptions<TEntity extends SequelizeBaseEntity<TEntity>> = MultiEntityFinderOrResolverOption<TEntity> & EntityUpdateBaseOptions<TEntity>;

export type EntityCreateOrUpdateOptions<TEntity extends SequelizeBaseEntity<TEntity>> = SingleEntityCreateOptions<TEntity> &
	Partial<SingleEntityFinderOrResolverOption<TEntity>> &
	EntityUpdateBaseOptions<TEntity>;

export interface EntityDeleteBaseOptions extends Transactional, Partial<Scoped> {
	force?: boolean;
}

export type EntityDeleteOptions<TEntity extends SequelizeBaseEntity<TEntity>> = SingleEntityFinderOrResolverOption<TEntity> & EntityDeleteBaseOptions;
