import { Inject, Injectable } from "@nestjs/common";
import { CustomerRedisService } from "../../../domains";
import { DomainUtilitiesAggregateConst } from "../../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainUtilitiesAggregate } from "../../../types";
import type { ICustomerConnectionList } from "../../../interfaces";

@Injectable()
export class CustomerQueryDalService {
	public constructor(
		// Dependencies

		private readonly customerRedisService: CustomerRedisService,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async fetchCustomersForAgentOfProject(agentUuid: string, projectUuid: string): Promise<ICustomerConnectionList> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.customerRedisService.fetchCustomersForAgentOfProject(agentUuid, projectUuid);
			},
		});
	}
}
