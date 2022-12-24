import { BaseEntityScopes, SequelizeBaseEntity } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, DeletedAt, HasMany, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { CustomerEntity, type CustomerEntity as CustomerEntityType } from "./customer.entity";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => CustomerIdentifierEntity),
}))
@Table({ tableName: CustomerIdentifierEntity.entityTableName })
export class CustomerIdentifierEntity extends SequelizeBaseEntity<CustomerIdentifierEntity> {
	public static override entityTableName = "customerIdentifiers";
	public static override uuidColumnName = "customerIdentifierUuid";
	public static override createdAtColumnName = "customerIdentifierCreatedAt";
	public static override updatedAtColumnName = "customerIdentifierUpdatedAt";
	public static override deletedAtColumnName = "customerIdentifierDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public customerIdentifierId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public customerIdentifierUuid: string;

	@Unique
	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public customerIdentifierCookie: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public customerIdentifierIp: string;

	@CreatedAt
	public customerIdentifierCreatedAt: Date;

	@UpdatedAt
	public customerIdentifierUpdatedAt: Date;

	@DeletedAt
	public customerIdentifierDeletedAt: Nullable<Date>;

	@HasMany(() => CustomerEntity, {
		as: "customerIdentifierCustomers",
		foreignKey: "customerCustomerIdentifierId",
		sourceKey: "customerIdentifierId",
	})
	public customerIdentifierCustomers: Array<CustomerEntityType>;
}
