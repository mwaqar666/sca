import { BaseMigration, type SequelizeQueryInterface, TableHelpers } from "@sca-backend/db";
import { DataTypes } from "sequelize";
import { CustomerEntity } from "../entities";

export default class extends BaseMigration {
	private readonly customersTableName = TableHelpers.createTableName(CustomerEntity);

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
			customerPersonalInfo: {
				allowNull: false,
				type: DataTypes.TEXT,
			},
			customerIpInfo: {
				allowNull: false,
				type: DataTypes.TEXT,
			},
			customerCookie: {
				allowNull: false,
				type: DataTypes.STRING,
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
	}

	public async down(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.dropTable(this.customersTableName);
	}
}
