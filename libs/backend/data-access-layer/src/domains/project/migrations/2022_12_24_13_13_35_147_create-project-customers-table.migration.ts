import { BaseMigration, type SequelizeQueryInterface, TableHelpers } from "@sca-backend/db";
import { DataTypes } from "sequelize";
import { CustomerEntity } from "../../customer";
import { ProjectCustomerEntity, ProjectEntity } from "../entities";

export default class extends BaseMigration {
	private readonly projectCustomersTableName = TableHelpers.createTableName(ProjectCustomerEntity);
	private readonly projectsTableName = TableHelpers.createTableName(ProjectEntity);
	private readonly customersTableName = TableHelpers.createTableName(CustomerEntity);

	private readonly projectCustomerProjectForeignKeyConstraint = TableHelpers.createForeignConstraintName(ProjectCustomerEntity, "projectCustomerProjectId");
	private readonly projectCustomerCustomerForeignKeyConstraint = TableHelpers.createForeignConstraintName(ProjectCustomerEntity, "projectCustomerCustomerId");

	public async up(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.createTable<ProjectCustomerEntity>(this.projectCustomersTableName, {
			projectCustomerId: {
				primaryKey: true,
				autoIncrement: true,
				type: DataTypes.INTEGER,
			},
			projectCustomerUuid: {
				unique: true,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				type: DataTypes.UUID,
			},
			projectCustomerProjectId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			projectCustomerCustomerId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			projectCustomerCreatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			projectCustomerUpdatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			projectCustomerDeletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
			},
		});

		await queryInterface.addConstraint(this.projectCustomersTableName, {
			type: "foreign key",
			name: this.projectCustomerProjectForeignKeyConstraint,
			fields: ["projectCustomerProjectId"],
			references: {
				table: this.projectsTableName,
				field: "projectId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});

		await queryInterface.addConstraint(this.projectCustomersTableName, {
			type: "foreign key",
			name: this.projectCustomerCustomerForeignKeyConstraint,
			fields: ["projectCustomerCustomerId"],
			references: {
				table: this.customersTableName,
				field: "customerId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});
	}

	public async down(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.removeConstraint(this.projectCustomersTableName, this.projectCustomerCustomerForeignKeyConstraint);

		await queryInterface.removeConstraint(this.projectCustomersTableName, this.projectCustomerProjectForeignKeyConstraint);

		await queryInterface.dropTable(this.projectCustomersTableName);
	}
}
