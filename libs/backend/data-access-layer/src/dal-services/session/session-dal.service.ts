import { Inject, Injectable } from "@nestjs/common";
import { DomainUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainUtilitiesAggregate } from "../../types";
import { type CustomerRedisEntity, CustomerRedisService } from "../../domains";

@Injectable()
export class SessionDalService {
	public constructor(
		// Dependencies

		private readonly customerRedisService: CustomerRedisService,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async assignAgentToCustomer(redisCustomer: CustomerRedisEntity, agentUuid: string): Promise<CustomerRedisEntity> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.customerRedisService.assignCustomerToAgent(redisCustomer, agentUuid);
			},
		});
	}

	public async unAssignAgentFromCustomer(redisCustomer: CustomerRedisEntity): Promise<CustomerRedisEntity> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.customerRedisService.unAssignCustomerFromAgent(redisCustomer);
			},
		});
	}

	public async unAssignAgentFromAllItsProjectCustomers(agentUuid: string, projectUuid: string): Promise<Array<CustomerRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.customerRedisService.unAssignAgentFromAllItsProjectCustomers(agentUuid, projectUuid);
			},
		});
	}
}
