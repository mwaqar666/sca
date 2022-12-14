import { BaseEntityScopes, SequelizeBaseEntity } from "@sca/db";
import { type Nullable } from "@sca/utils";
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, HasMany, HasOne, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { ProjectEntity, type ProjectEntity as ProjectEntityType } from "../project";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => UserEntity),
}))
@Table({ tableName: UserEntity.entityTableName })
export class UserEntity extends SequelizeBaseEntity<UserEntity> {
	public static override entityTableName = "users";
	public static override uuidColumnName = "userUuid";
	public static override isActiveColumnName = "userIsActive";
	public static override createdAtColumnName = "userCreatedAt";
	public static override updatedAtColumnName = "userUpdatedAt";
	public static override deletedAtColumnName = "userDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly userId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public readonly userUuid: string;

	@AllowNull(true)
	@ForeignKey(() => UserEntity)
	@Column({ type: DataType.INTEGER })
	public userParentId: Nullable<number>;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public userFirstName: string;

	@AllowNull(true)
	@Column({ type: DataType.STRING(100) })
	public userMiddleName: Nullable<string>;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public userLastName: string;

	@Unique
	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public userEmail: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
	public userPassword: string;

	@Default(true)
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
	public userIsActive: boolean;

	@CreatedAt
	public userCreatedAt: Date;

	@UpdatedAt
	public userUpdatedAt: Date;

	@DeletedAt
	public userDeletedAt: Nullable<Date>;

	// Relationships
	@HasMany(() => UserEntity, {
		as: "userChildren",
		foreignKey: "userParentId",
		sourceKey: "userId",
	})
	public userChildren: Array<UserEntity>;

	@BelongsTo(() => UserEntity, {
		as: "userParent",
		foreignKey: "userParentId",
		targetKey: "userId",
	})
	public userParent: Nullable<UserEntity>;

	@HasOne(() => ProjectEntity, {
		as: "userAuthenticatedProject",
		foreignKey: "projectUserId",
		sourceKey: "userId",
	})
	public userAuthenticatedProject: ProjectEntityType;

	@HasMany(() => ProjectEntity, {
		as: "userProjects",
		foreignKey: "projectUserId",
		sourceKey: "userId",
	})
	public userProjects: Array<ProjectEntityType>;
}
