import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { BaseEntityScopes, SequelizeBaseEntity } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { JsonHelper } from "@sca-shared/utils";
import type { ICustomerTrackingInfo } from "../types";
import { ProjectEntity, type ProjectEntity as ProjectEntityType } from "../../project";
import { CustomerEntity, type CustomerEntity as CustomerEntityType } from "../../customer";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => TrackerEntity),
}))
@Table({ tableName: TrackerEntity.entityTableName })
export class TrackerEntity extends SequelizeBaseEntity<TrackerEntity> {
	public static override entityTableName = "trackers";
	public static override uuidColumnName = "trackerUuid";
	public static override createdAtColumnName = "trackerCreatedAt";
	public static override updatedAtColumnName = "trackerUpdatedAt";
	public static override deletedAtColumnName = "trackerDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly trackerId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public readonly trackerUuid: string;

	@ForeignKey(() => ProjectEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public trackerProjectId: number;

	@ForeignKey(() => CustomerEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public trackerCustomerId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public readonly trackerTrackingNumber: string;

	@AllowNull(false)
	@Column({
		type: DataType.TEXT,
		get() {
			const json = this.getDataValue("trackingInfo");
			return JsonHelper.parse<ICustomerTrackingInfo>(json);
		},
		set(data: ICustomerTrackingInfo) {
			const parsedData = JsonHelper.stringify(data);
			this.setDataValue("trackingInfo", parsedData);
		},
	})
	public trackerTrackingInfo: ICustomerTrackingInfo;

	@CreatedAt
	public trackerCreatedAt: Date;

	@UpdatedAt
	public trackerUpdatedAt: Date;

	@DeletedAt
	public trackerDeletedAt: Nullable<Date>;

	// Relationships
	@BelongsTo(() => ProjectEntity, {
		as: "trackerProject",
		foreignKey: "trackerProjectId",
		targetKey: "projectId",
	})
	public trackerProject: ProjectEntityType;

	@BelongsTo(() => CustomerEntity, {
		as: "trackerCustomer",
		foreignKey: "trackerCustomerId",
		targetKey: "customerId",
	})
	public trackerCustomer: CustomerEntityType;
}
