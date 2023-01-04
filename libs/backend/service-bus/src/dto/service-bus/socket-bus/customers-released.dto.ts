import type { IConnectedCustomer } from "@sca-shared/dto";

export class CustomersReleasedDto {
	public projectUuid: string;
	public releasedCustomers: Array<IConnectedCustomer>;
}
