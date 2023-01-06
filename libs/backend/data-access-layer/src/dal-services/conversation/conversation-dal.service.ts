import { Injectable } from "@nestjs/common";
import { ConversationService, TrackerService } from "../../domains";

@Injectable()
export class ConversationDalService {
	public constructor(
		// Dependencies

		private readonly trackerService: TrackerService,
		private readonly conversationService: ConversationService,
	) {}
}
