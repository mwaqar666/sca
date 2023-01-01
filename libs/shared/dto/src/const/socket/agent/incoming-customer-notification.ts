import type { IConnectedCustomer } from "../../../models";

export const IncomingCustomerNotification = "IncomingCustomerNotification";

export class IncomingCustomerNotificationPayloadDto {
	incomingCustomer: IConnectedCustomer;
}
