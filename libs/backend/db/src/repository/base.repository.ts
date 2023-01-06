import { NotFoundException } from "@nestjs/common";
import { DefaultScopedFindOptions } from "../const";
import type { EntityKeyValues, EntityScope, EntityType } from "../entity";
import { SequelizeBaseEntity } from "../entity";
import type { Key, Nullable } from "@sca-shared/utils";
import type { CreationAttributes, WhereOptions } from "sequelize";
import type {
	EntityCreateOrUpdateOptions,
	EntityDeleteOptions,
	EntityFindOrCreateOptions,
	EntityResolution,
	MultipleEntityCreateOptions,
	MultipleEntityUpdateOptions,
	ScopedFindOptions,
	SingleEntityCreateOptions,
	SingleEntityUpdateOptions,
} from "./types";

export class BaseRepository<TEntity extends SequelizeBaseEntity<TEntity>> {
	protected constructor(protected readonly concreteEntity: EntityType<TEntity>) {}

	public async findEntity(scopedFindOptions: ScopedFindOptions<TEntity>): Promise<Nullable<TEntity>> {
		scopedFindOptions = this.providedOrDefaultScopedFindOptions(scopedFindOptions);

		return await this.concreteEntity.applyScopes<TEntity>(scopedFindOptions.scopes).findOne<TEntity>(scopedFindOptions.findOptions);
	}

	public async findEntities(scopedFindOptions: ScopedFindOptions<TEntity>): Promise<Array<TEntity>> {
		scopedFindOptions = this.providedOrDefaultScopedFindOptions(scopedFindOptions);

		return await this.concreteEntity.applyScopes<TEntity>(scopedFindOptions.scopes).findAll<TEntity>(scopedFindOptions.findOptions);
	}

	public async findOrFailEntity(scopedFindOptions: ScopedFindOptions<TEntity>): Promise<TEntity> {
		scopedFindOptions = this.providedOrDefaultScopedFindOptions(scopedFindOptions);

		const foundEntity = await this.findEntity(scopedFindOptions);

		if (foundEntity) return foundEntity;

		throw new NotFoundException(`${this.concreteEntity.name} with key value pairs ${JSON.stringify(scopedFindOptions.findOptions)} not found!`);
	}

	public async resolveEntity(entity: EntityResolution<TEntity>, scopes?: EntityScope): Promise<Nullable<TEntity>> {
		if (typeof entity !== "string" && typeof entity !== "number") return entity;

		const scopedFindOptions = this.providedOrDefaultScopedFindOptions({ scopes });

		if (typeof entity === "string") {
			if (!this.concreteEntity.uuidColumnName) throw new Error(`Uuid column name not defined on ${this.concreteEntity.name}`);

			scopedFindOptions.findOptions = { where: { [this.concreteEntity.uuidColumnName]: entity } as WhereOptions<TEntity> };
			return await this.findEntity(scopedFindOptions);
		}

		scopedFindOptions.findOptions = { where: { [this.concreteEntity.primaryKeyAttribute]: entity } as WhereOptions<TEntity> };
		return await this.findEntity(scopedFindOptions);
	}

	public async resolveEntities(entities: Array<EntityResolution<TEntity>>, scopes?: EntityScope): Promise<Array<TEntity>> {
		if (this.isEntityArray(entities)) return entities;

		const scopedFindOptions = this.providedOrDefaultScopedFindOptions({ scopes });

		if (this.isUuidArray(entities)) {
			if (!this.concreteEntity.uuidColumnName) throw new Error(`Uuid column name not defined on ${this.concreteEntity.name}`);

			scopedFindOptions.findOptions = { where: { [this.concreteEntity.uuidColumnName]: entities } as WhereOptions<TEntity> };
			return await this.findEntities(scopedFindOptions);
		}

		scopedFindOptions.findOptions = { where: { [this.concreteEntity.primaryKeyAttribute]: entities } as WhereOptions<TEntity> };
		return await this.findEntities(scopedFindOptions);
	}

	public async resolveOrFailEntity(entity: EntityResolution<TEntity>, scopes?: EntityScope): Promise<TEntity> {
		const foundEntity = await this.resolveEntity(entity, scopes);

		if (foundEntity) return foundEntity;

		throw new NotFoundException(`${this.concreteEntity.name} not resolved with identifier ${entity}`);
	}

	public async createSingleEntity(singleEntityCreationOptions: SingleEntityCreateOptions<TEntity>): Promise<TEntity> {
		const { valuesToCreate, transaction } = singleEntityCreationOptions;

		return await this.concreteEntity.create<TEntity>(valuesToCreate as CreationAttributes<TEntity>, { transaction });
	}

	public async createMultipleEntities(multipleEntityCreateOptions: MultipleEntityCreateOptions<TEntity>): Promise<Array<TEntity>> {
		const { valuesToCreate, transaction } = multipleEntityCreateOptions;

		return await this.concreteEntity.bulkCreate<TEntity>(valuesToCreate as Array<CreationAttributes<TEntity>>, { transaction });
	}

	public async updateSingleEntity(singleEntityUpdateOptions: SingleEntityUpdateOptions<TEntity>): Promise<TEntity> {
		const { entity, findOptions, scopes, transaction } = singleEntityUpdateOptions;
		const foundEntity = findOptions ? await this.findOrFailEntity({ findOptions, scopes }) : await this.resolveOrFailEntity(entity, scopes);

		return foundEntity.update(singleEntityUpdateOptions.valuesToUpdate as EntityKeyValues<TEntity>, { transaction });
	}

	public async updateMultipleEntities(multipleEntityUpdateOptions: MultipleEntityUpdateOptions<TEntity>): Promise<Array<TEntity>> {
		const { entities, findOptions, scopes, transaction } = multipleEntityUpdateOptions;
		const foundEntities = findOptions ? await this.findEntities({ findOptions, scopes }) : await this.resolveEntities(entities, scopes);
		const foundEntitiesPrimaryKeys = foundEntities.map((foundEntity: TEntity) => foundEntity[this.concreteEntity.primaryKeyAttribute as Key<TEntity>]);

		const [, updatedEntities] = await this.concreteEntity.update(multipleEntityUpdateOptions.valuesToUpdate as EntityKeyValues<TEntity>, {
			where: { [this.concreteEntity.primaryKeyAttribute]: foundEntitiesPrimaryKeys } as WhereOptions<TEntity>,
			returning: true,
			transaction,
		});

		return updatedEntities;
	}

	public async findOrCreateEntity(entityFindOrCreateOptions: EntityFindOrCreateOptions<TEntity>): Promise<TEntity> {
		if ("entity" in entityFindOrCreateOptions && entityFindOrCreateOptions.entity) {
			const foundEntity = await this.resolveEntity(entityFindOrCreateOptions.entity, entityFindOrCreateOptions.scopes);

			if (foundEntity) return foundEntity;
		}

		if ("findOptions" in entityFindOrCreateOptions && entityFindOrCreateOptions.findOptions) {
			const foundEntity = await this.findEntity({ findOptions: entityFindOrCreateOptions.findOptions, scopes: entityFindOrCreateOptions.scopes });

			if (foundEntity) return foundEntity;
		}

		return await this.createSingleEntity({ transaction: entityFindOrCreateOptions.transaction, valuesToCreate: entityFindOrCreateOptions.valuesToCreate });
	}

	public async updateOrCreateEntity(entityCreateOrUpdateOptions: EntityCreateOrUpdateOptions<TEntity>): Promise<TEntity> {
		if ("entity" in entityCreateOrUpdateOptions && entityCreateOrUpdateOptions.entity) {
			const foundEntity = await this.resolveEntity(entityCreateOrUpdateOptions.entity, entityCreateOrUpdateOptions.scopes);

			if (foundEntity) return await foundEntity.update(entityCreateOrUpdateOptions.valuesToUpdate as EntityKeyValues<TEntity>, { transaction: entityCreateOrUpdateOptions.transaction });
		}

		if ("findOptions" in entityCreateOrUpdateOptions && entityCreateOrUpdateOptions.findOptions) {
			const foundEntity = await this.findEntity({ findOptions: entityCreateOrUpdateOptions.findOptions, scopes: entityCreateOrUpdateOptions.scopes });

			if (foundEntity) return await foundEntity.update(entityCreateOrUpdateOptions.valuesToUpdate as EntityKeyValues<TEntity>, { transaction: entityCreateOrUpdateOptions.transaction });
		}

		return await this.createSingleEntity({
			transaction: entityCreateOrUpdateOptions.transaction,
			valuesToCreate: { ...entityCreateOrUpdateOptions.valuesToCreate, ...entityCreateOrUpdateOptions.valuesToUpdate },
		});
	}

	public async deleteEntity(entityDeleteOptions: EntityDeleteOptions<TEntity>): Promise<boolean> {
		if (entityDeleteOptions.findOptions) {
			const foundEntity = await this.findEntity({ findOptions: entityDeleteOptions.findOptions, scopes: entityDeleteOptions.scopes });
			if (!foundEntity) return false;

			await foundEntity.destroy({ transaction: entityDeleteOptions.transaction, force: entityDeleteOptions.force ?? false });
			return true;
		}

		const foundEntity = await this.resolveEntity(entityDeleteOptions.entity, entityDeleteOptions.scopes);
		if (!foundEntity) return false;

		await foundEntity.destroy({ transaction: entityDeleteOptions.transaction, force: entityDeleteOptions.force ?? false });
		return true;
	}

	private providedOrDefaultScopedFindOptions(scopedFindOptions?: Partial<ScopedFindOptions<TEntity>>): ScopedFindOptions<TEntity> {
		const scopedEntityFindOptions = scopedFindOptions ?? DefaultScopedFindOptions;

		scopedEntityFindOptions.scopes = scopedEntityFindOptions.scopes ?? DefaultScopedFindOptions.scopes;
		scopedEntityFindOptions.findOptions = scopedEntityFindOptions.findOptions ?? DefaultScopedFindOptions.findOptions;

		return scopedFindOptions as ScopedFindOptions<TEntity>;
	}

	private isUuidArray(entities: Array<EntityResolution<TEntity>>): entities is Array<string> {
		return entities.every((entity: EntityResolution<TEntity>) => typeof entity === "string");
	}

	private isEntityArray(entities: Array<EntityResolution<TEntity>>): entities is Array<TEntity> {
		return entities.every((entity: EntityResolution<TEntity>) => entity instanceof SequelizeBaseEntity<TEntity>);
	}
}
