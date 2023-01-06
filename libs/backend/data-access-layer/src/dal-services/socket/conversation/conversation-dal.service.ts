import { Injectable } from "@nestjs/common";
import { ConversationService } from "../../../domains";

@Injectable()
export class ConversationDalService {
	public constructor(
		// Dependencies

		private readonly conversationService: ConversationService,
	) {}
}
