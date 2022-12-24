import { BaseMigration, type SequelizeQueryInterface, TableHelpers } from "@sca-backend/db";
import { DataTypes } from "sequelize";
import { CustomerIdentifierEntity } from "../entities";

export default class extends BaseMigration {
	private customerIdentifiersTableName = TableHelpers.createTableName(CustomerIdentifierEntity);

	public async up(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.createTable<CustomerIdentifierEntity>(this.customerIdentifiersTableName, {
			customerIdentifierId: {
				primaryKey: true,
				autoIncrement: true,
				type: DataTypes.INTEGER,
			},
			customerIdentifierUuid: {
				unique: true,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				type: DataTypes.UUID,
			},
			customerIdentifierCookie: {
				allowNull: false,
				type: DataTypes.STRING(100),
			},
			customerIdentifierIp: {
				allowNull: false,
				type: DataTypes.STRING(100),
			},
			customerIdentifierCreatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			customerIdentifierUpdatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			customerIdentifierDeletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
			},
		});
	}

	public async down(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.dropTable(this.customerIdentifiersTableName);
	}
}
