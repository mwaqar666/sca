import { Inject, Injectable } from "@nestjs/common";
import { type CustomerRedisEntity, CustomerRedisService } from "../../domains";
import { DomainUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainUtilitiesAggregate } from "../../types";
import type { ICustomerConnectionList } from "../../interfaces";
import type { Nullable } from "@sca-shared/utils";

@Injectable()
export class CustomerQueryDalService {
	public constructor(
		// Dependencies

		private readonly customerRedisService: CustomerRedisService,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async fetchCustomerForAgentSession(customerUuid: string, projectUuid: string): Promise<Nullable<CustomerRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.customerRedisService.fetchCustomerFromCustomerAndProjectUuid(customerUuid, projectUuid);
			},
		});
	}

	public async fetchCustomersForAgentOfProject(agentUuid: string, projectUuid: string): Promise<ICustomerConnectionList> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.customerRedisService.fetchCustomersForAgentOfProject(agentUuid, projectUuid);
			},
		});
	}
}
