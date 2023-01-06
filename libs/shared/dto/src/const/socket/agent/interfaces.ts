import type { IConnectedCustomer } from "../../../interfaces";

export interface IIncomingCustomerNotificationPayloadDto {
	incomingCustomer: IConnectedCustomer;
}

export interface IOutgoingCustomerNotificationPayloadDto {
	outgoingCustomerUuid: string;
}

export interface IProjectCustomersResponseDto {
	assignedCustomers: Array<IConnectedCustomer>;
	unassignedCustomers: Array<IConnectedCustomer>;
}

export interface IReleasedCustomersNotificationPayloadDto {
	releasedCustomers: Array<IConnectedCustomer>;
}
