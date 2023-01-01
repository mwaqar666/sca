import type { Nullable } from "@sca-shared/utils";
import type { ICustomer } from "./customer";

export interface IOnlineCustomer {
	agentUuid: Nullable<string>;
	projectUuid: string;
	customerUuid: string;
	connectionIds: string[];
	trackingNumber: string;
}

export interface IConnectedCustomer extends IOnlineCustomer {
	customer: ICustomer;
}
