import { BaseMigration, type SequelizeQueryInterface, TableHelpers } from "@sca-backend/db";
import { ConversationEntity } from "../entities";
import { DataTypes } from "sequelize";
import { UserEntity } from "../../user";
import { TrackerEntity } from "../../tracker";

export default class extends BaseMigration {
	private readonly conversationsTableName = TableHelpers.createTableName(ConversationEntity);
	private readonly trackersTableName = TableHelpers.createTableName(TrackerEntity);
	private readonly agentsTableName = TableHelpers.createTableName(UserEntity);

	private readonly conversationTrackersForeignKeyConstraint = TableHelpers.createForeignConstraintName(ConversationEntity, "conversationTrackerId");
	private readonly conversationAgentsForeignKeyConstraint = TableHelpers.createForeignConstraintName(ConversationEntity, "conversationAgentId");

	public async up(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.createTable<ConversationEntity>(this.conversationsTableName, {
			conversationId: {
				primaryKey: true,
				autoIncrement: true,
				type: DataTypes.INTEGER,
			},
			conversationUuid: {
				unique: true,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				type: DataTypes.UUID,
			},
			conversationTrackerId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			conversationAgentId: {
				allowNull: true,
				type: DataTypes.INTEGER,
			},
			conversationDetails: {
				allowNull: false,
				type: DataTypes.TEXT,
			},
			conversationClosed: {
				defaultValue: false,
				allowNull: false,
				type: DataTypes.BOOLEAN,
			},
			conversationCreatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			conversationUpdatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			conversationDeletedAt: {
				allowNull: true,
				type: DataTypes.DATE,
			},
		});

		await queryInterface.addConstraint(this.conversationsTableName, {
			type: "foreign key",
			name: this.conversationTrackersForeignKeyConstraint,
			fields: ["conversationTrackerId"],
			references: {
				table: this.trackersTableName,
				field: "trackerId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});

		await queryInterface.addConstraint(this.conversationsTableName, {
			type: "foreign key",
			name: this.conversationAgentsForeignKeyConstraint,
			fields: ["conversationAgentId"],
			references: {
				table: this.agentsTableName,
				field: "userId",
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});
	}

	public async down(queryInterface: SequelizeQueryInterface): Promise<void> {
		await queryInterface.removeConstraint(this.conversationsTableName, this.conversationAgentsForeignKeyConstraint);

		await queryInterface.removeConstraint(this.conversationsTableName, this.conversationTrackersForeignKeyConstraint);

		await queryInterface.dropTable(this.conversationsTableName);
	}
}
