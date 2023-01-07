import type { IOnlineCustomer } from "@sca-shared/dto";

export interface IAgentAssigned {
	toAgentUuid: string;
	customer: IOnlineCustomer;
}

export interface IAgentUnAssigned {
	customer: IOnlineCustomer;
}
