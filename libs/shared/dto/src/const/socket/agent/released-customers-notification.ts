import type { IConnectedCustomer } from "../../../interfaces";

export const ReleasedCustomersNotification = "ReleasedCustomersNotification";

export interface IReleasedCustomersNotificationPayloadDto {
	releasedCustomers: Array<IConnectedCustomer>;
}
