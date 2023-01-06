import type { IConversation, IConversationDetails, ICustomerTrackingInfo } from "@sca-shared/dto";
import type { Nullable } from "@sca-shared/utils";
import { JsonHelper } from "@sca-shared/utils";
import { BaseEntityScopes, SequelizeBaseEntity } from "@sca-backend/db";
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, PrimaryKey, Scopes, Table, Unique, UpdatedAt } from "sequelize-typescript";
import { TrackerEntity, type TrackerEntity as TrackerEntityType } from "../../tracker";
import { UserEntity, type UserEntity as UserEntityType } from "../../user";

@Scopes(() => ({
	...BaseEntityScopes.commonScopes(() => ConversationEntity),
}))
@Table({ tableName: ConversationEntity.entityTableName })
export class ConversationEntity extends SequelizeBaseEntity<ConversationEntity> implements IConversation {
	public static override readonly entityTableName = "conversations";
	public static override readonly uuidColumnName = "conversationUuid";
	public static override readonly createdAtColumnName = "conversationCreatedAt";
	public static override readonly updatedAtColumnName = "conversationUpdatedAt";
	public static override readonly deletedAtColumnName = "conversationDeletedAt";

	@PrimaryKey
	@AutoIncrement
	@Column({ type: DataType.INTEGER })
	public readonly conversationId: number;

	@Unique
	@Default(DataType.UUIDV4)
	@AllowNull(false)
	@Column({ type: DataType.UUID })
	public readonly conversationUuid: string;

	@ForeignKey(() => TrackerEntity)
	@AllowNull(false)
	@Column({ type: DataType.INTEGER })
	public conversationTrackerId: number;

	@ForeignKey(() => UserEntity)
	@AllowNull(true)
	@Column({ type: DataType.INTEGER })
	public conversationAgentId: Nullable<number>;

	@AllowNull(false)
	@Column({
		type: DataType.TEXT,
		get() {
			const json = this.getDataValue("conversationDetails");
			return JsonHelper.parse<ICustomerTrackingInfo>(json);
		},
		set(data: IConversationDetails) {
			const parsedData = JsonHelper.stringify(data);
			this.setDataValue("conversationDetails", parsedData);
		},
	})
	public conversationDetails: IConversationDetails;

	@Default(false)
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
	public conversationClosed: boolean;

	@CreatedAt
	public conversationCreatedAt: Date;

	@UpdatedAt
	public conversationUpdatedAt: Date;

	@DeletedAt
	public conversationDeletedAt: Nullable<Date>;

	// Relationships
	@BelongsTo(() => TrackerEntity, {
		as: "conversationTracker",
		foreignKey: "conversationTrackerId",
		targetKey: "trackerId",
	})
	public conversationTracker: TrackerEntityType;

	@BelongsTo(() => UserEntity, {
		as: "conversationAgent",
		foreignKey: "conversationAgentId",
		targetKey: "userId",
	})
	public conversationAgent: UserEntityType;
}
