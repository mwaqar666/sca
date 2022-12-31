import { BaseEntityScopes, SequelizeBaseEntity } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { CustomerEntity, type CustomerEntity as CustomerEntityType } from "../../customer";
import { ProjectEntity, type ProjectEntity as ProjectEntityType } from "./project.entity";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => ProjectCustomerEntity),
}))
@Table({ tableName: ProjectCustomerEntity.entityTableName })
export class ProjectCustomerEntity extends SequelizeBaseEntity<ProjectCustomerEntity> {
	public static override entityTableName = "projectCustomers";
	public static override uuidColumnName = "projectCustomerUuid";
	public static override createdAtColumnName = "projectCustomerCreatedAt";
	public static override updatedAtColumnName = "projectCustomerUpdatedAt";
	public static override deletedAtColumnName = "projectCustomerDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public projectCustomerId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public projectCustomerUuid: string;

	@ForeignKey(() => ProjectEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public projectCustomerProjectId: number;

	@ForeignKey(() => CustomerEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public projectCustomerCustomerId: number;

	@CreatedAt
	public projectCustomerCreatedAt: Date;

	@UpdatedAt
	public projectCustomerUpdatedAt: Date;

	@DeletedAt
	public projectCustomerDeletedAt: Nullable<Date>;

	@BelongsTo(() => ProjectEntity, {
		as: "projectCustomerProject",
		foreignKey: "projectCustomerProjectId",
		targetKey: "projectId",
	})
	public projectCustomerProject: ProjectEntityType;

	@BelongsTo(() => CustomerEntity, {
		as: "projectCustomerCustomer",
		foreignKey: "projectCustomerCustomerId",
		targetKey: "customerId",
	})
	public projectCustomerCustomer: CustomerEntityType;
}
