import type { IOnlineCustomer } from "@sca-shared/dto";

export interface ICustomerReservation {
	byAgentUuid: string;
	customer: IOnlineCustomer;
}
