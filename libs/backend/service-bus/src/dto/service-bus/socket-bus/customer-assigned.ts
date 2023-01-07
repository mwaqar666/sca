import type { IOnlineCustomer } from "@sca-shared/dto";

export interface ICustomerAssigned {
	toAgentUuid: string;
	customer: IOnlineCustomer;
}
