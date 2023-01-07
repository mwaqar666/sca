import type { Nullable } from "@sca-shared/utils";

export interface ICustomerExpiry {
	customerUuid: string;
	projectUuid: string;
	agentUuid: Nullable<string>;
	trackingNumber: string;
}
