import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import { DomainUtilitiesAggregateConst } from "../../const";
import type { IDomainUtilitiesAggregate } from "../../types";
import { type AgentRedisEntity, AgentRedisService } from "../../domains";

@Injectable()
export class ConnectedAgentService {
	public constructor(
		// Dependencies

		private readonly agentRedisService: AgentRedisService,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async onlineAgentsOfProject(projectUuid: string): Promise<Array<AgentRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.agentRedisService.fetchOnlineAgentsOfProject(projectUuid);
			},
		});
	}
}
