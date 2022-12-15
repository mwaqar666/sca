import { BaseEntityScopes, SequelizeBaseEntity } from "@sca/db";
import type { Nullable } from "@sca/utils";
import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, DeletedAt, HasMany, PrimaryKey, Scopes, Table, UpdatedAt } from "sequelize-typescript";
import { UserEntity, type UserEntity as UserEntityType } from "../user";
import type { UserTypeEnum } from "./user-type.enum";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => UserTypeEntity),
}))
@Table({ tableName: UserTypeEntity.entityTableName })
export class UserTypeEntity extends SequelizeBaseEntity<UserTypeEntity> {
	public static override entityTableName = "userTypes";
	public static override uuidColumnName = "userTypeUuid";
	public static override isActiveColumnName = "userTypeIsActive";
	public static override createdAtColumnName = "userTypeCreatedAt";
	public static override updatedAtColumnName = "userTypeUpdatedAt";
	public static override deletedAtColumnName = "userTypeDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly userTypeId: number;

	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public readonly userTypeUuid: string;

	@AllowNull(false)
	@Column({ type: DataType.SMALLINT })
	public userTypeIdentifier: UserTypeEnum;

	@Default(true)
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
	public userTypeIsActive: boolean;

	@CreatedAt
	public userTypeCreatedAt: Date;

	@UpdatedAt
	public userTypeUpdatedAt: Date;

	@DeletedAt
	public userTypeDeletedAt: Nullable<Date>;

	// Relationships
	@HasMany(() => UserEntity, {
		as: "userTypeUsers",
		foreignKey: "userUserTypeId",
		sourceKey: "userTypeId",
	})
	public userTypeUsers: Array<UserEntityType>;
}
