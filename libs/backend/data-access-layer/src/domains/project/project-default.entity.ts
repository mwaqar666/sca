import { BaseEntityScopes, SequelizeBaseEntity } from "@sca-backend/db";
import type { Nullable } from "@sca-backend/utils";
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { UserEntity, type UserEntity as UserEntityType } from "../user";
import { ProjectEntity, type ProjectEntity as ProjectEntityType } from "./project.entity";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => ProjectDefaultEntity),
}))
@Table({ tableName: ProjectDefaultEntity.entityTableName })
export class ProjectDefaultEntity extends SequelizeBaseEntity<ProjectDefaultEntity> {
	public static override entityTableName = "projectDefaults";
	public static override uuidColumnName = "projectDefaultUuid";
	public static override createdAtColumnName = "projectDefaultCreatedAt";
	public static override updatedAtColumnName = "projectDefaultUpdatedAt";
	public static override deletedAtColumnName = "projectDefaultDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly projectDefaultId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public readonly projectDefaultUuid: string;

	@ForeignKey(() => UserEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public projectDefaultUserId: number;

	@ForeignKey(() => ProjectEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public projectDefaultProjectId: number;

	@CreatedAt
	public projectDefaultCreatedAt: Date;

	@UpdatedAt
	public projectDefaultUpdatedAt: Date;

	@DeletedAt
	public projectDefaultDeletedAt: Nullable<Date>;

	// Relationships
	@BelongsTo(() => ProjectEntity, {
		as: "projectDefaultProject",
		foreignKey: "projectDefaultProjectId",
		targetKey: "projectId",
	})
	public projectDefaultProject: ProjectEntityType;

	@BelongsTo(() => UserEntity, {
		as: "projectDefaultUser",
		foreignKey: "projectDefaultUserId",
		targetKey: "userId",
	})
	public projectDefaultUser: UserEntityType;
}
