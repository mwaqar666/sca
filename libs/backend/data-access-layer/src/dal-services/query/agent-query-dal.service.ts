import { Inject, Injectable } from "@nestjs/common";
import { type AgentRedisEntity, AgentRedisService } from "../../domains";
import { DomainUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainUtilitiesAggregate } from "../../types";
import type { Nullable } from "@sca-shared/utils";

@Injectable()
export class AgentQueryDalService {
	public constructor(
		// Dependencies

		private readonly agentRedisService: AgentRedisService,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async onlineAgentsOfProject(projectUuid: string): Promise<Array<AgentRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<Array<AgentRedisEntity>> => {
				return await this.agentRedisService.fetchOnlineAgentsOfProject(projectUuid);
			},
		});
	}

	public async fetchAgentOfProject(agentUuid: string, projectUuid: string): Promise<Nullable<AgentRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.agentRedisService.fetchAgentOfProject(agentUuid, projectUuid);
			},
		});
	}

	public async fetchAgentOfProjectExcept(agentUuid: string, projectUuid: string): Promise<Array<AgentRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.agentRedisService.fetchAgentsOfProjectExcept(agentUuid, projectUuid);
			},
		});
	}
}
