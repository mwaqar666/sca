import { BaseEntityScopes, SequelizeBaseEntity } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, DeletedAt, HasMany, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { ProjectCustomerEntity, type ProjectCustomerEntity as ProjectCustomerEntityType } from "./project-customer.entity";
import { ProjectUserEntity, type ProjectUserEntity as ProjectUserEntityType } from "./project-user.entity";
import { TrackerEntity, type TrackerEntity as TrackerEntityType } from "../../tracker";
import type { IProject } from "@sca-shared/dto";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => ProjectEntity),
}))
@Table({ tableName: ProjectEntity.entityTableName })
export class ProjectEntity extends SequelizeBaseEntity<ProjectEntity> implements IProject {
	public static override readonly entityTableName = "projects";
	public static override readonly uuidColumnName = "projectUuid";
	public static override readonly isActiveColumnName = "projectIsActive";
	public static override readonly createdAtColumnName = "projectCreatedAt";
	public static override readonly updatedAtColumnName = "projectUpdatedAt";
	public static override readonly deletedAtColumnName = "projectDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly projectId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public readonly projectUuid: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
	public projectName: string;

	@AllowNull(true)
	@Column({ type: DataType.STRING })
	public projectImage: Nullable<string>;

	@AllowNull(false)
	@Column({ type: DataType.STRING(100) })
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
	@HasMany(() => ProjectUserEntity, {
		as: "projectUsers",
		foreignKey: "projectUserProjectId",
		sourceKey: "projectId",
	})
	public projectUsers: Array<ProjectUserEntityType>;

	@HasMany(() => ProjectCustomerEntity, {
		as: "projectCustomers",
		foreignKey: "projectCustomerProjectId",
		sourceKey: "projectId",
	})
	public projectCustomers: Array<ProjectCustomerEntityType>;

	@HasMany(() => TrackerEntity, {
		as: "projectTrackers",
		foreignKey: "trackerProjectId",
		sourceKey: "projectId",
	})
	public projectTrackers: Array<TrackerEntityType>;
}
