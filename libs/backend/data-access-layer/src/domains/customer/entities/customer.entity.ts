import { BaseEntityScopes, SequelizeBaseEntity } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { JsonHelper } from "@sca-shared/utils";
import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, DeletedAt, HasMany, HasOne, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { ProjectCustomerEntity, type ProjectCustomerEntity as ProjectCustomerEntityType } from "../../project";
import type { ICustomer, ICustomerIpInfo, ICustomerPersonalInfo } from "@sca-shared/dto";
import { TrackerEntity, type TrackerEntity as TrackerEntityType } from "../../tracker";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => CustomerEntity),
}))
@Table({ tableName: CustomerEntity.entityTableName })
export class CustomerEntity extends SequelizeBaseEntity<CustomerEntity> implements ICustomer {
	public static override readonly entityTableName = "customers";
	public static override readonly uuidColumnName = "customerUuid";
	public static override readonly createdAtColumnName = "customerCreatedAt";
	public static override readonly updatedAtColumnName = "customerUpdatedAt";
	public static override readonly deletedAtColumnName = "customerDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly customerId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public readonly customerUuid: string;

	@AllowNull(false)
	@Column({
		type: DataType.TEXT,
		get() {
			const json = this.getDataValue("customerPersonalInfo");
			return JsonHelper.parse<ICustomerPersonalInfo>(json);
		},
		set(data: ICustomerPersonalInfo) {
			const parsedData = JsonHelper.stringify(data);
			this.setDataValue("customerPersonalInfo", parsedData);
		},
	})
	public customerPersonalInfo: ICustomerPersonalInfo;

	@AllowNull(false)
	@Column({
		type: DataType.TEXT,
		get() {
			const json = this.getDataValue("customerIpInfo");
			return JsonHelper.parse<ICustomerIpInfo>(json);
		},
		set(data: ICustomerIpInfo) {
			const parsedData = JsonHelper.stringify(data);
			this.setDataValue("customerIpInfo", parsedData);
		},
	})
	public customerIpInfo: ICustomerIpInfo;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
	public customerCookie: string;

	@CreatedAt
	public customerCreatedAt: Date;

	@UpdatedAt
	public customerUpdatedAt: Date;

	@DeletedAt
	public customerDeletedAt: Nullable<Date>;

	// Relationships
	@HasOne(() => ProjectCustomerEntity, {
		as: "customerCurrentProject",
		foreignKey: "projectCustomerCustomerId",
		sourceKey: "customerId",
	})
	public customerCurrentProject: ProjectCustomerEntityType;

	@HasMany(() => ProjectCustomerEntity, {
		as: "customerProjects",
		foreignKey: "projectCustomerCustomerId",
		sourceKey: "customerId",
	})
	public customerProjects: Array<ProjectCustomerEntityType>;

	@HasMany(() => TrackerEntity, {
		as: "customerTrackers",
		foreignKey: "trackerCustomerId",
		sourceKey: "customerId",
	})
	public customerTrackers: Array<TrackerEntityType>;

	@HasOne(() => TrackerEntity, {
		as: "customerCurrentTracker",
		foreignKey: "trackerCustomerId",
		sourceKey: "customerId",
	})
	public customerCurrentTracker: TrackerEntityType;
}
