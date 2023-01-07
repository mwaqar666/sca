import type { IOnlineCustomer } from "@sca-shared/dto";

export interface ICustomerReserved {
	byAgentUuid: string;
	customer: IOnlineCustomer;
}
