import { BaseMigration, type SequelizeQueryInterface, TableHelpers } from "@sca/db";
import { DataTypes } from "sequelize";
import { UserTypeEntity } from "./user-type.entity";

export default class extends BaseMigration {
	private readonly userTypesTableName = TableHelpers.createTableName(UserTypeEntity);

	public async up(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.createTable<UserTypeEntity>(this.userTypesTableName, {
			userTypeId: {
				primaryKey: true,
				autoIncrement: true,
				type: DataTypes.INTEGER,
			},
			userTypeUuid: {
				unique: true,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				type: DataTypes.UUID,
			},
			userTypeIdentifier: {
				allowNull: false,
				type: DataTypes.SMALLINT,
			},
			userTypeIsActive: {
				defaultValue: true,
				allowNull: false,
				type: DataTypes.BOOLEAN,
			},
			userTypeCreatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			userTypeUpdatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			userTypeDeletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
			},
		});
	}

	public async down(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.dropTable(this.userTypesTableName);
	}
}
