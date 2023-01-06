import { BaseEntityScopes, SequelizeBaseEntity } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, HasMany, HasOne, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { ProjectUserEntity, type ProjectUserEntity as ProjectUserEntityType } from "../../project";
import { UserTypeEntity, type UserTypeEntity as UserTypeEntityType } from "./user-type.entity";
import type { IUser } from "@sca-shared/dto";
import { ConversationEntity, type ConversationEntity as ConversationEntityType } from "../../conversation";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => UserEntity),
}))
@Table({ tableName: UserEntity.entityTableName })
export class UserEntity extends SequelizeBaseEntity<UserEntity> implements IUser {
	public static override readonly entityTableName = "users";
	public static override readonly uuidColumnName = "userUuid";
	public static override readonly isActiveColumnName = "userIsActive";
	public static override readonly createdAtColumnName = "userCreatedAt";
	public static override readonly updatedAtColumnName = "userUpdatedAt";
	public static override readonly deletedAtColumnName = "userDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly userId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public readonly userUuid: string;

	@ForeignKey(() => UserTypeEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public userUserTypeId: number;

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
	@HasMany(() => ProjectUserEntity, {
		as: "userProjects",
		foreignKey: "projectUserUserId",
		sourceKey: "userId",
	})
	public userProjects: Array<ProjectUserEntityType>;

	@HasOne(() => ProjectUserEntity, {
		as: "userCurrentProject",
		foreignKey: "projectUserUserId",
		sourceKey: "userId",
	})
	public userCurrentProject: ProjectUserEntityType;

	@BelongsTo(() => UserTypeEntity, {
		as: "userUserType",
		foreignKey: "userUserTypeId",
		targetKey: "userTypeId",
	})
	public userUserType: UserTypeEntityType;

	@HasMany(() => ConversationEntity, {
		as: "userConversations",
		foreignKey: "conversationAgentId",
		sourceKey: "userId",
	})
	public userConversations: Array<ConversationEntityType>;
}
