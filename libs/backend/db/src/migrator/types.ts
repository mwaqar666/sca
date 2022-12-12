import { ModelAttributes, QueryInterface, QueryInterfaceCreateTableOptions, TableName } from "sequelize";
import { Umzug } from "umzug";
import { EntityTableColumnProperties, SequelizeBaseEntity } from "../entity";

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
