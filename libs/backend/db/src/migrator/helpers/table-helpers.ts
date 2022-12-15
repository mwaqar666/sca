import { DB_SCHEMA, EnvExtractor } from "@sca/config";
import type { TableName } from "sequelize";
import type { EntityType, SequelizeBaseEntity } from "../../entity";

export class TableHelpers {
	/**
	 * Creates the `TableName` for the given table name in the provided schema
	 * @param entity Table name to assign
	 * @return TableName A TableName object with table information
	 */
	public static createTableName(entity: string): TableName;
	/**
	 * Creates the `TableName` for the given table name in the provided schema
	 * @param entity Table name to assign
	 * @param schema Schema in which to create table
	 * @return TableName A TableName object with table information
	 */
	public static createTableName(entity: string, schema: string): TableName;
	/**
	 * Creates the `TableName` for the given table name in the provided schema
	 * @param entity Entity model for the table
	 * @return TableName A TableName object with table information
	 */
	public static createTableName<TEntity extends SequelizeBaseEntity<TEntity>>(entity: EntityType<TEntity>): TableName;
	public static createTableName<TEntity extends SequelizeBaseEntity<TEntity>>(entity: string | EntityType<TEntity>, schema?: string): TableName {
		const [tableName, schemaName] =
			typeof entity !== "string" ? [entity.entityTableName, TableHelpers.schemaNameOrDefault(entity.entitySchemaName)] : [entity, TableHelpers.schemaNameOrDefault(schema)];

		return { tableName, schema: schemaName };
	}

	/**
	 * Creates the name to use on the foreign key constraint
	 * @param targetTable Table name to which foreign key is applied
	 * @param targetTableColumnName Name of target table foreign key column name
	 * @returns Unique foreign key constraint name
	 */
	public static createForeignConstraintName(targetTable: string, targetTableColumnName: string): string;
	public static createForeignConstraintName<Target extends SequelizeBaseEntity<Target>>(targetTable: EntityType<Target>, targetTableColumnName: keyof Target): string;
	public static createForeignConstraintName<Target extends SequelizeBaseEntity<Target>>(targetTable: EntityType<Target> | string, targetTableColumnName: keyof Target | string): string {
		const targetTableName = typeof targetTable === "string" ? targetTable : targetTable.entityTableName;

		return `${targetTableName}_${targetTableColumnName.toString()}_fkey`;
	}

	/**
	 * Creates the name for unique key constraint on multiple columns
	 * @param targetTable Entity on which unique key is applied
	 * @param columnNames Name of target table unique key column names
	 */
	public static createUniqueKeyConstraintName<TTarget extends SequelizeBaseEntity<TTarget>>(targetTable: EntityType<TTarget>, ...columnNames: Array<keyof TTarget>): string {
		return `${targetTable.entityTableName}_${columnNames.join("_")}_ukey`;
	}

	private static schemaNameOrDefault(schema?: string): string {
		return schema ?? EnvExtractor.env(DB_SCHEMA);
	}
}
