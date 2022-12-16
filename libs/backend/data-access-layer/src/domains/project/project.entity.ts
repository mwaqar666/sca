import { BaseEntityScopes, SequelizeBaseEntity } from "@sca-backend/db";
import type { Nullable } from "@sca-backend/utils";
import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, DeletedAt, HasMany, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { ProjectDefaultEntity } from "./project-default.entity";
import { ProjectUserEntity, type ProjectUserEntity as ProjectUserEntityType } from "./project-user.entity";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => ProjectEntity),
}))
@Table({ tableName: ProjectEntity.entityTableName })
export class ProjectEntity extends SequelizeBaseEntity<ProjectEntity> {
	public static override entityTableName = "projects";
	public static override uuidColumnName = "projectUuid";
	public static override isActiveColumnName = "projectIsActive";
	public static override createdAtColumnName = "projectCreatedAt";
	public static override updatedAtColumnName = "projectUpdatedAt";
	public static override deletedAtColumnName = "projectDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly projectId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public readonly projectUuid: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public projectName: string;

	@AllowNull(true)
	@Column({ type: DataType.STRING })
	public projectImage: Nullable<string>;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public projectDomain: string;

	@Default(false)
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
	public projectIsDefault: boolean;

	@Default(true)
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
	public projectIsActive: boolean;

	@CreatedAt
	public projectCreatedAt: Date;

	@UpdatedAt
	public projectUpdatedAt: Date;

	@DeletedAt
	public projectDeletedAt: Nullable<Date>;

	// Relationships
	@HasMany(() => ProjectUserEntity, {
		as: "projectUsers",
		foreignKey: "projectUserProjectId",
		sourceKey: "projectId",
	})
	public projectUsers: Array<ProjectUserEntityType>;

	@HasMany(() => ProjectDefaultEntity, {
		as: "projectDefaultUsers",
		foreignKey: "projectDefaultProjectId",
		sourceKey: "projectId",
	})
	public projectDefaultUsers: Array<ProjectDefaultEntity>;
}
