import { BaseEntityScopes, SequelizeBaseEntity } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { CustomerIdentifierEntity, type CustomerIdentifierEntity as CustomerIdentifierEntityType } from "./customer-identifier.entity";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => CustomerEntity),
}))
@Table({ tableName: CustomerEntity.entityTableName })
export class CustomerEntity extends SequelizeBaseEntity<CustomerEntity> {
	public static override entityTableName = "customers";
	public static override uuidColumnName = "customerUuid";
	public static override createdAtColumnName = "customerCreatedAt";
	public static override updatedAtColumnName = "customerUpdatedAt";
	public static override deletedAtColumnName = "customerDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public customerId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public customerUuid: string;

	@ForeignKey(() => CustomerIdentifierEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public customerCustomerIdentifierId: number;

	@AllowNull(true)
	@Column({ type: DataType.STRING(100) })
	public customerFullName: Nullable<string>;

	@AllowNull(true)
	@Column({ type: DataType.STRING(100) })
	public customerEmail: Nullable<string>;

	@AllowNull(true)
	@Column({ type: DataType.STRING(100) })
	public customerContact: Nullable<string>;

	@CreatedAt
	public customerCreatedAt: Date;

	@UpdatedAt
	public customerUpdatedAt: Date;

	@DeletedAt
	public customerDeletedAt: Nullable<Date>;

	@BelongsTo(() => CustomerEntity, {
		as: "customerCustomerIdentifier",
		foreignKey: "customerCustomerIdentifierId",
		targetKey: "customerIdentifierId",
	})
	public customerCustomerIdentifier: Array<CustomerIdentifierEntityType>;
}
