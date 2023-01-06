import type { ModelStatic } from "sequelize";
import { Model } from "sequelize-typescript";
import type { EntityScope } from "./types";

export abstract class BaseEntity<TEntity extends BaseEntity<TEntity>> extends Model<TEntity> {
	// Table & Column Name Information
	public static readonly entityTableName: string;
	public static readonly entitySchemaName: string;
	public static readonly uuidColumnName: string;
	public static readonly isActiveColumnName: string;

	// Column Exposure Information
	public static readonly exposePrimaryKey = false;
	public static readonly exposeForeignKeys: Array<string> = [];

	// Timestamps Information
	public static readonly createdAtColumnName: string;
	public static readonly updatedAtColumnName: string;
	public static readonly deletedAtColumnName: string;

	public static applyScopes<TEntityStatic extends BaseEntity<TEntityStatic>>(this: ModelStatic<TEntityStatic>, providedScopes?: EntityScope): ModelStatic<TEntityStatic> {
		let scopesToApply: EntityScope = ["defaultScope"];

		if (providedScopes) scopesToApply = scopesToApply.concat(providedScopes);

		return this.scope(scopesToApply);
	}

	public removeDataValue(this: TEntity, key: keyof TEntity) {
		this.changed(key, true);

		delete this.dataValues[key];
	}
}
