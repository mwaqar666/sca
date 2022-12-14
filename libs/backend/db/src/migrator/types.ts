import { type ModelAttributes, QueryInterface, type QueryInterfaceCreateTableOptions, type TableName } from "sequelize";
import type { Umzug } from "umzug";
import type { EntityTableColumnProperties, SequelizeBaseEntity } from "../entity";

export abstract class SequelizeQueryInterface extends QueryInterface {
	public abstract override createTable<TEntity extends SequelizeBaseEntity<TEntity>>(
		tableName: TableName,
		attributes: ModelAttributes<TEntity, EntityTableColumnProperties<TEntity>>,
		options?: QueryInterfaceCreateTableOptions,
	): Promise<void>;
}

export interface MigrationCommandProviderData {
	umzug: Umzug<SequelizeQueryInterface>;
}
