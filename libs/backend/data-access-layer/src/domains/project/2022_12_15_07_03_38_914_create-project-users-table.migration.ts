import { BaseMigration, type SequelizeQueryInterface, TableHelpers } from "@sca-backend/db";
import { DataTypes } from "sequelize";
import { UserEntity } from "../user";
import { ProjectUserEntity } from "./project-user.entity";
import { ProjectEntity } from "./project.entity";

export default class extends BaseMigration {
	private readonly projectUsersTableName = TableHelpers.createTableName(ProjectUserEntity);
	private readonly projectsTableName = TableHelpers.createTableName(ProjectEntity);
	private readonly usersTableName = TableHelpers.createTableName(UserEntity);
	private readonly projectUserUserForeignKeyConstraint = TableHelpers.createForeignConstraintName(ProjectUserEntity, "projectUserUserId");
	private readonly projectUserProjectForeignKeyConstraint = TableHelpers.createForeignConstraintName(ProjectUserEntity, "projectUserProjectId");
	private readonly projectUserParentForeignKeyConstraint = TableHelpers.createForeignConstraintName(ProjectUserEntity, "projectUserParentId");

	public async up(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.createTable<ProjectUserEntity>(this.projectUsersTableName, {
			projectUserId: {
				primaryKey: true,
				autoIncrement: true,
				type: DataTypes.INTEGER,
			},
			projectUserUuid: {
				unique: true,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				type: DataTypes.UUID,
			},
			projectUserUserId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			projectUserProjectId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			projectUserParentId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			projectUserCreatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			projectUserUpdatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			projectUserDeletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
			},
		});

		await queryInterface.addConstraint(this.projectUsersTableName, {
			type: "foreign key",
			name: this.projectUserUserForeignKeyConstraint,
			fields: ["projectUserUserId"],
			references: {
				table: this.usersTableName,
				field: "userId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});

		await queryInterface.addConstraint(this.projectUsersTableName, {
			type: "foreign key",
			name: this.projectUserProjectForeignKeyConstraint,
			fields: ["projectUserProjectId"],
			references: {
				table: this.projectsTableName,
				field: "projectId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});

		await queryInterface.addConstraint(this.projectUsersTableName, {
			type: "foreign key",
			name: this.projectUserParentForeignKeyConstraint,
			fields: ["projectUserParentId"],
			references: {
				table: this.projectUsersTableName,
				field: "projectUserId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});
	}

	public async down(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.removeConstraint(this.projectUsersTableName, this.projectUserParentForeignKeyConstraint);

		await queryInterface.removeConstraint(this.projectUsersTableName, this.projectUserProjectForeignKeyConstraint);

		await queryInterface.removeConstraint(this.projectUsersTableName, this.projectUserUserForeignKeyConstraint);

		await queryInterface.dropTable(this.projectUsersTableName);
	}
}
