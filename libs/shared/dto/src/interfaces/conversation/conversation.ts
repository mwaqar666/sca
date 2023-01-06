import type { Nullable } from "@sca-shared/utils";
import type { IConversationDetails } from "./conversation-detail";

export interface IConversation {
	conversationId: number;
	conversationUuid: string;
	conversationTrackerId: number;
	conversationAgentId: Nullable<number>;
	conversationDetails: IConversationDetails;
	conversationClosed: boolean;
	conversationCreatedAt: Date;
	conversationUpdatedAt: Date;
	conversationDeletedAt: Nullable<Date>;
}
