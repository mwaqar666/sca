import type { IConnectedCustomer } from "../../../interfaces";

export const ProjectCustomers = "ProjectCustomers";

export interface IProjectCustomersResponseDto {
	assignedCustomers: Array<IConnectedCustomer>;
	unassignedCustomers: Array<IConnectedCustomer>;
}
