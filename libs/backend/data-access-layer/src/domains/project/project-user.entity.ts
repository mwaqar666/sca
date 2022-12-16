import { BaseEntityScopes, SequelizeBaseEntity } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, HasMany, PrimaryKey, Scopes, Table, UpdatedAt } from "sequelize-typescript";
import { UserEntity, type UserEntity as UserEntityType } from "../user";
import { ProjectEntity, type ProjectEntity as ProjectEntityType } from "./project.entity";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => ProjectUserEntity),
}))
@Table({ tableName: ProjectUserEntity.entityTableName })
export class ProjectUserEntity extends SequelizeBaseEntity<ProjectUserEntity> {
	public static override entityTableName = "projectUsers";
	public static override uuidColumnName = "projectUserUuid";
	public static override createdAtColumnName = "projectUserCreatedAt";
	public static override updatedAtColumnName = "projectUserUpdatedAt";
	public static override deletedAtColumnName = "projectUserDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly projectUserId: number;

	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public readonly projectUserUuid: string;

	@ForeignKey(() => UserEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public projectUserUserId: number;

	@ForeignKey(() => ProjectEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public projectUserProjectId: number;

	@ForeignKey(() => ProjectUserEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public projectUserParentId: number;

	@CreatedAt
	public projectUserCreatedAt: Date;

	@UpdatedAt
	public projectUserUpdatedAt: Date;

	@DeletedAt
	public projectUserDeletedAt: Nullable<Date>;

	// Relationships
	@BelongsTo(() => UserEntity, {
		as: "projectUserUser",
		foreignKey: "projectUserUserId",
		targetKey: "userId",
	})
	public projectUserUser: UserEntityType;

	@BelongsTo(() => ProjectEntity, {
		as: "projectUserProject",
		foreignKey: "projectUserProjectId",
		targetKey: "projectId",
	})
	public projectUserProject: ProjectEntityType;

	@BelongsTo(() => ProjectUserEntity, {
		as: "projectUserParent",
		foreignKey: "projectUserParentId",
		targetKey: "projectUserId",
	})
	public projectUserParent: ProjectUserEntity;

	@HasMany(() => ProjectUserEntity, {
		as: "projectUserChildren",
		foreignKey: "projectUserParentId",
		sourceKey: "projectUserId",
	})
	public projectUserChildren: Array<ProjectUserEntity>;
}
