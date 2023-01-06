import type { IConnectedCustomer } from "../../../interfaces";

export const IncomingCustomerNotification = "IncomingCustomerNotification";

export interface IIncomingCustomerNotificationPayloadDto {
	incomingCustomer: IConnectedCustomer;
}
