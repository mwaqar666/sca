import {
	AgentConnectionDalService,
	ConversationDalService,
	CustomerBuilderDalService,
	CustomerConnectionDalService,
	CustomerProjectIdentityService,
	CustomerQueryDalService,
	CustomerTrackingDalService,
	UserProjectIdentityService,
} from "../dal-services";
import type { Type } from "@nestjs/common";

export const DomainDalServices: Array<Type> = [
	// 01. Identity
	UserProjectIdentityService,
	CustomerProjectIdentityService,

	// 02. Socket
	// 	02a. Builder
	CustomerBuilderDalService,

	// 	02b. Connection
	CustomerConnectionDalService,
	AgentConnectionDalService,

	// 	02c. Conversation
	ConversationDalService,

	// 	02d. Query
	CustomerQueryDalService,

	// 	02e. Tracking
	CustomerTrackingDalService,
];
