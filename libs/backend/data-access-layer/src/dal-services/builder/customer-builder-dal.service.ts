import { Inject, Injectable } from "@nestjs/common";
import type { IConnectedCustomer, ICustomer, IOnlineCustomer } from "@sca-shared/dto";
import { CustomerService } from "../../domains";
import { DomainUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainUtilitiesAggregate } from "../../types";

@Injectable()
export class CustomerBuilderDalService {
	public constructor(
		// Dependencies

		private readonly customerService: CustomerService,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async buildConnectedCustomer(redisCustomers: IOnlineCustomer): Promise<IConnectedCustomer>;
	public async buildConnectedCustomer(redisCustomers: Array<IOnlineCustomer>): Promise<Array<IConnectedCustomer>>;
	public async buildConnectedCustomer(redisCustomers: IOnlineCustomer, customer: ICustomer): Promise<IConnectedCustomer>;
	public async buildConnectedCustomer(redisCustomers: IOnlineCustomer | Array<IOnlineCustomer>, customer?: ICustomer): Promise<IConnectedCustomer | Array<IConnectedCustomer>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				if (!Array.isArray(redisCustomers)) {
					customer = customer ?? (await this.customerService.findOrFailCustomerUsingUuid(redisCustomers.customerUuid));

					return this.mergeRedisCustomerWithDbCustomer(customer, redisCustomers);
				}

				return Promise.all(
					redisCustomers.map((redisCustomer: IOnlineCustomer) => {
						return this.customerService
							.findOrFailCustomerUsingUuid(redisCustomer.customerUuid)
							.then((customer: ICustomer) => this.mergeRedisCustomerWithDbCustomer(customer, redisCustomer));
					}),
				);
			},
		});
	}

	private mergeRedisCustomerWithDbCustomer(customer: ICustomer, redisCustomer: IOnlineCustomer): Promise<IConnectedCustomer> {
		return this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const { agentUuid, connectionIds, customerUuid, projectUuid, trackingNumber } = redisCustomer;
				return { customer, agentUuid, connectionIds, customerUuid, projectUuid, trackingNumber };
			},
		});
	}
}
