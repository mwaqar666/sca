import { Injectable } from "@nestjs/common";
import { BaseRepository, type EntityType } from "@sca-backend/db";
import { ConversationEntity } from "../entities";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class ConversationRepository extends BaseRepository<ConversationEntity> {
	public constructor(
		// Dependencies

		@InjectModel(ConversationEntity) private readonly conversationEntity: EntityType<ConversationEntity>,
	) {
		super(conversationEntity);
	}
}
