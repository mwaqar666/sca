import type { IOnlineCustomer } from "@sca-shared/dto";

export interface ICustomerAssignment {
	toAgentUuid: string;
	customer: IOnlineCustomer;
}
