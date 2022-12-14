import { BaseEntityScopes, SequelizeBaseEntity } from "@sca/db";
import { type Nullable } from "@sca/utils";
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { UserEntity, type UserEntity as UserEntityType } from "../user";

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

	@ForeignKey(() => UserEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public projectUserId: number;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
	public projectName: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
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
	@BelongsTo(() => UserEntity, {
		as: "projectUser",
		foreignKey: "projectUserId",
		targetKey: "userId",
	})
	public projectUser: UserEntityType;
}
