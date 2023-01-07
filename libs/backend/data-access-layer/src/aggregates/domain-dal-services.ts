import {
	AgentBuilderDalService,
	AgentConnectionDalService,
	AgentQueryDalService,
	ConversationDalService,
	CustomerBuilderDalService,
	CustomerConnectionDalService,
	CustomerProjectIdentityService,
	CustomerQueryDalService,
	CustomerTrackingDalService,
	SessionDalService,
	UserProjectIdentityService,
} from "../dal-services";
import type { Type } from "@nestjs/common";

export const DomainDalServices: Array<Type> = [
	UserProjectIdentityService,
	CustomerProjectIdentityService,

	AgentBuilderDalService,
	CustomerBuilderDalService,

	AgentConnectionDalService,
	CustomerConnectionDalService,

	SessionDalService,
	ConversationDalService,

	AgentQueryDalService,
	CustomerQueryDalService,

	CustomerTrackingDalService,
];
