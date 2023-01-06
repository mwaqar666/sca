import { Injectable } from "@nestjs/common";
import { ConversationRepository } from "../repositories";

@Injectable()
export class ConversationService {
	public constructor(
		// Dependencies

		private readonly conversationRepository: ConversationRepository,
	) {}
}
