import type { IConnectedCustomer } from "../../../interfaces";

export interface IIncomingCustomerNotification {
	incomingCustomer: IConnectedCustomer;
}

export interface IOutgoingCustomerNotification {
	outgoingCustomerUuid: string;
}

export interface IProjectCustomersResponse {
	assignedCustomers: Array<IConnectedCustomer>;
	unassignedCustomers: Array<IConnectedCustomer>;
}

export interface IReleasedCustomersNotification {
	releasedCustomers: Array<IConnectedCustomer>;
}

export interface ICustomerAssignedNotification {
	customerUuid: string;
}

export interface ICustomerReservedNotification {
	customerUuid: string;
}
