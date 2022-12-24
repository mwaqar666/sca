import { BaseMigration, type SequelizeQueryInterface, TableHelpers } from "@sca-backend/db";
import { DataTypes } from "sequelize";
import { CustomerEntity, CustomerIdentifierEntity } from "../entities";

export default class extends BaseMigration {
	private customersTableName = TableHelpers.createTableName(CustomerEntity);
	private customerIdentifiersTableName = TableHelpers.createTableName(CustomerIdentifierEntity);

	private customerCustomerIdentifierForeignKeyConstraint = TableHelpers.createForeignConstraintName(CustomerEntity, "customerCustomerIdentifierId");

	public async up(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.createTable<CustomerEntity>(this.customersTableName, {
			customerId: {
				primaryKey: true,
				autoIncrement: true,
				type: DataTypes.INTEGER,
			},
			customerUuid: {
				unique: true,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				type: DataTypes.UUID,
			},
			customerCustomerIdentifierId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			customerFullName: {
				defaultValue: "Anonymous",
				allowNull: false,
				type: DataTypes.STRING(100),
			},
			customerEmail: {
				defaultValue: "Anonymous",
				allowNull: false,
				type: DataTypes.STRING(100),
			},
			customerContact: {
				defaultValue: "Anonymous",
				allowNull: false,
				type: DataTypes.STRING(100),
			},
			customerCreatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			customerUpdatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			customerDeletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
			},
		});

		await queryInterface.addConstraint(this.customersTableName, {
			type: "foreign key",
			name: this.customerCustomerIdentifierForeignKeyConstraint,
			fields: ["customerCustomerIdentifierId"],
			references: {
				table: this.customerIdentifiersTableName,
				field: "customerIdentifierId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});
	}

	public async down(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.removeConstraint(this.customersTableName, this.customerCustomerIdentifierForeignKeyConstraint);

		await queryInterface.dropTable(this.customersTableName);
	}
}
