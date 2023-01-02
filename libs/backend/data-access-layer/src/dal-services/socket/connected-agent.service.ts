import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import { DomainUtilitiesAggregateConst } from "../../const";
import type { IDomainUtilitiesAggregate } from "../../types";
import { type AgentRedisEntity, AgentRedisService, type UserEntity } from "../../domains";
import type { IEntityConnectionStatus, IEntityStatus, TCreated, TPreConnected, TReconnected } from "@sca-backend/db";

@Injectable()
export class ConnectedAgentService {
	public constructor(
		// Dependencies

		private readonly agentRedisService: AgentRedisService,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async connectAgent(agent: UserEntity, connectionId: string): Promise<IEntityConnectionStatus<AgentRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityConnectionStatus<AgentRedisEntity>> => {
				const redisAgent = await this.agentRedisService.fetchAgentFromAgentAndProjectUuid(agent.userUuid, agent.userCurrentProject.projectUserProject.projectUuid);
				if (!redisAgent) return await this.createNewAgentConnection(agent, connectionId);

				const agentPersisted = await this.agentRedisService.removeAgentExpiry(redisAgent.entityId);
				if (agentPersisted) return await this.updateExistingAgentConnection(redisAgent, connectionId);

				return await this.addAnotherAgentConnection(redisAgent, connectionId);
			},
		});
	}

	public async onlineAgentsOfProject(projectUuid: string): Promise<Array<AgentRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<Array<AgentRedisEntity>> => {
				return await this.agentRedisService.fetchOnlineAgentsOfProject(projectUuid);
			},
		});
	}

	private async createNewAgentConnection(agent: UserEntity, connectionId: string): Promise<IEntityStatus<AgentRedisEntity, TCreated>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<AgentRedisEntity, TCreated>> => {
				return await this.agentRedisService.createNewAgentConnection(agent.userUuid, agent.userCurrentProject.projectUserProject.projectUuid, connectionId);
			},
		});
	}

	private async updateExistingAgentConnection(redisAgent: AgentRedisEntity, connectionId: string): Promise<IEntityStatus<AgentRedisEntity, TReconnected>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<AgentRedisEntity, TReconnected>> => {
				return await this.agentRedisService.updateAgentConnectionId(redisAgent, connectionId);
			},
		});
	}

	private async addAnotherAgentConnection(redisAgent: AgentRedisEntity, connectionId: string): Promise<IEntityStatus<AgentRedisEntity, TPreConnected>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<AgentRedisEntity, TPreConnected>> => {
				return await this.agentRedisService.addAnotherAgentConnection(redisAgent, connectionId);
			},
		});
	}
}
