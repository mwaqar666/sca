import { BaseMigration, SequelizeQueryInterface, TableHelpers } from "@sca/db";
import { DataTypes } from "sequelize";
import { UserEntity } from "./user.entity";

export default class extends BaseMigration {
	private usersTableName = TableHelpers.createTableName(UserEntity);
	private usersParentForeignKey = TableHelpers.createForeignConstraintName(UserEntity, UserEntity, "userParentId", "userId");

	public async up(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.createTable<UserEntity>(this.usersTableName, {
			userId: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			userUuid: {
				type: DataTypes.UUID,
				unique: true,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
			},
			userParentId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			userFirstName: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			userMiddleName: {
				type: DataTypes.STRING(100),
				allowNull: true,
			},
			userLastName: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			userEmail: {
				type: DataTypes.STRING(100),
				unique: true,
				allowNull: false,
			},
			userPassword: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			userIsActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
				allowNull: false,
			},
			userCreatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			userUpdatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			userDeletedAt: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		});

		await queryInterface.addConstraint(this.usersTableName, {
			type: "foreign key",
			name: this.usersParentForeignKey,
			fields: ["userParentId"],
			references: {
				table: this.usersTableName,
				field: "userId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});
	}

	public async down(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.removeConstraint(this.usersTableName, this.usersParentForeignKey);

		await queryInterface.dropTable(this.usersTableName);
	}
}
