import { BaseMigration, type SequelizeQueryInterface, TableHelpers } from "@sca-backend/db";
import { DataTypes } from "sequelize";
import { UserTypeEntity } from "../../user-type";
import { UserEntity } from "../entities";

export default class extends BaseMigration {
	private readonly usersTableName = TableHelpers.createTableName(UserEntity);
	private readonly userTypesTableName = TableHelpers.createTableName(UserTypeEntity);
	private readonly userUserTypeForeignKeyConstraint = TableHelpers.createForeignConstraintName(UserEntity, "userUserTypeId");

	public async up(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.createTable<UserEntity>(this.usersTableName, {
			userId: {
				primaryKey: true,
				autoIncrement: true,
				type: DataTypes.INTEGER,
			},
			userUuid: {
				unique: true,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				type: DataTypes.UUID,
			},
			userUserTypeId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			userFirstName: {
				allowNull: false,
				type: DataTypes.STRING(100),
			},
			userMiddleName: {
				allowNull: true,
				type: DataTypes.STRING(100),
			},
			userLastName: {
				allowNull: false,
				type: DataTypes.STRING(100),
			},
			userEmail: {
				unique: true,
				allowNull: false,
				type: DataTypes.STRING(100),
			},
			userPassword: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			userIsActive: {
				defaultValue: true,
				allowNull: false,
				type: DataTypes.BOOLEAN,
			},
			userCreatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			userUpdatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			userDeletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
			},
		});

		await queryInterface.addConstraint(this.usersTableName, {
			type: "foreign key",
			name: this.userUserTypeForeignKeyConstraint,
			fields: ["userUserTypeId"],
			references: {
				table: this.userTypesTableName,
				field: "userTypeId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});
	}

	public async down(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.removeConstraint(this.usersTableName, this.userUserTypeForeignKeyConstraint);

		await queryInterface.dropTable(this.usersTableName);
	}
}
