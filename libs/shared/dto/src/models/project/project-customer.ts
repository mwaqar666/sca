import type { Nullable } from "@sca-shared/utils";

export interface IProjectCustomer {
	projectCustomerId: number;
	projectCustomerUuid: string;
	projectCustomerProjectId: number;
	projectCustomerCustomerId: number;
	projectCustomerCreatedAt: Date;
	projectCustomerUpdatedAt: Date;
	projectCustomerDeletedAt: Nullable<Date>;
}
