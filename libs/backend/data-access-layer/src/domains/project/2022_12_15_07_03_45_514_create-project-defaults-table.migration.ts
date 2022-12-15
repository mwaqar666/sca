import { BaseMigration, type SequelizeQueryInterface, TableHelpers } from "@sca/db";
import { DataTypes } from "sequelize";
import { UserEntity } from "../user";
import { ProjectDefaultEntity } from "./project-default.entity";
import { ProjectEntity } from "./project.entity";

export default class extends BaseMigration {
	private readonly projectDefaultsTableName = TableHelpers.createTableName(ProjectDefaultEntity);
	private readonly usersTableName = TableHelpers.createTableName(UserEntity);
	private readonly projectsTableName = TableHelpers.createTableName(ProjectEntity);
	private readonly projectDefaultUsersForeignKeyConstraint = TableHelpers.createForeignConstraintName(ProjectDefaultEntity, "projectDefaultUserId");
	private readonly projectDefaultProjectsForeignKeyConstraint = TableHelpers.createForeignConstraintName(ProjectDefaultEntity, "projectDefaultProjectId");

	public async up(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.createTable<ProjectDefaultEntity>(this.projectDefaultsTableName, {
			projectDefaultId: {
				primaryKey: true,
				autoIncrement: true,
				type: DataTypes.INTEGER,
			},
			projectDefaultUuid: {
				unique: true,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				type: DataTypes.UUID,
			},
			projectDefaultUserId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			projectDefaultProjectId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			projectDefaultCreatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			projectDefaultUpdatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			projectDefaultDeletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
			},
		});

		await queryInterface.addConstraint(this.projectDefaultsTableName, {
			type: "foreign key",
			name: this.projectDefaultUsersForeignKeyConstraint,
			fields: ["projectDefaultUserId"],
			references: {
				table: this.usersTableName,
				field: "userId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});

		await queryInterface.addConstraint(this.projectDefaultsTableName, {
			type: "foreign key",
			name: this.projectDefaultProjectsForeignKeyConstraint,
			fields: ["projectDefaultProjectId"],
			references: {
				table: this.projectsTableName,
				field: "projectId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});
	}

	public async down(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.removeConstraint(this.projectDefaultsTableName, this.projectDefaultProjectsForeignKeyConstraint);

		await queryInterface.removeConstraint(this.projectDefaultsTableName, this.projectDefaultUsersForeignKeyConstraint);

		await queryInterface.dropTable(this.projectDefaultsTableName);
	}
}
