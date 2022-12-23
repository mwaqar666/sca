import { BaseMigration, type SequelizeQueryInterface, TableHelpers } from "@sca-backend/db";
import { DataTypes } from "sequelize";
import { ProjectEntity } from "../entities";

export default class extends BaseMigration {
	private readonly projectsTableName = TableHelpers.createTableName(ProjectEntity);

	public async up(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.createTable<ProjectEntity>(this.projectsTableName, {
			projectId: {
				primaryKey: true,
				autoIncrement: true,
				type: DataTypes.INTEGER,
			},
			projectUuid: {
				unique: true,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				type: DataTypes.UUID,
			},
			projectName: {
				allowNull: false,
				type: DataTypes.STRING(100),
			},
			projectImage: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			projectDomain: {
				allowNull: false,
				type: DataTypes.STRING(100),
			},
			projectIsDefault: {
				defaultValue: false,
				allowNull: false,
				type: DataTypes.BOOLEAN,
			},
			projectIsActive: {
				defaultValue: true,
				allowNull: false,
				type: DataTypes.BOOLEAN,
			},
			projectCreatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			projectUpdatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			projectDeletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
			},
		});
	}

	public async down(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.dropTable(this.projectsTableName);
	}
}
