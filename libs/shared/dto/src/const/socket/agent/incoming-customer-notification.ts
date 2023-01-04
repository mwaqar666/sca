import type { IConnectedCustomer } from "../../../models";

export const IncomingCustomerNotification = "IncomingCustomerNotification";
export const IncomingCustomersNotification = "IncomingCustomersNotification";

export class IncomingCustomerNotificationPayloadDto {
	incomingCustomer: IConnectedCustomer;
}

export class IncomingCustomersNotificationPayloadDto {
	incomingCustomers: Array<IConnectedCustomer>;
}
