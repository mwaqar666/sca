import { Injectable } from "@nestjs/common";
import type { IConnectedCustomer } from "@sca-shared/dto";
import { type CustomerEntity, type CustomerRedisEntity, CustomerService } from "../../domains";

@Injectable()
export class CustomerBuilderDalService {
	public constructor(
		// Dependencies

		private readonly customerService: CustomerService,
	) {}

	public async buildConnectedCustomer(redisCustomers: Array<CustomerRedisEntity>): Promise<Array<IConnectedCustomer>>;
	public async buildConnectedCustomer(redisCustomers: CustomerRedisEntity, customer: CustomerEntity): Promise<IConnectedCustomer>;
	public async buildConnectedCustomer(redisCustomers: CustomerRedisEntity | Array<CustomerRedisEntity>, customer?: CustomerEntity): Promise<IConnectedCustomer | Array<IConnectedCustomer>> {
		if (!Array.isArray(redisCustomers)) {
			customer = customer ?? (await this.customerService.findOrFailCustomerUsingUuid(redisCustomers.customerUuid));

			return this.mergeRedisCustomerWithDbCustomer(customer, redisCustomers);
		}

		return Promise.all(
			redisCustomers.map((redisCustomer: CustomerRedisEntity) => {
				return this.customerService
					.findOrFailCustomerUsingUuid(redisCustomer.customerUuid)
					.then((customer: CustomerEntity): IConnectedCustomer => this.mergeRedisCustomerWithDbCustomer(customer, redisCustomer));
			}),
		);
	}

	private mergeRedisCustomerWithDbCustomer(customer: CustomerEntity, redisCustomer: CustomerRedisEntity): IConnectedCustomer {
		const { agentUuid, connectionIds, customerUuid, projectUuid, trackingNumber } = redisCustomer;
		return { customer, agentUuid, connectionIds, customerUuid, projectUuid, trackingNumber };
	}
}
