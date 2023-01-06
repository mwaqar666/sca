import type { CustomerRedisEntity } from "../../domains";

export interface ICustomerConnectionList {
	assignedCustomers: Array<CustomerRedisEntity>;
	unassignedCustomers: Array<CustomerRedisEntity>;
}
