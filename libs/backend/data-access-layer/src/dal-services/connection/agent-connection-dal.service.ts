import { Inject, Injectable } from "@nestjs/common";
import { type AgentRedisEntity, AgentRedisService, type UserEntity } from "../../domains";
import type { IEntityConnectionStatus, IEntityDisconnectionStatus, IEntityStatus, IExpiryObserver, TCreated, TExpiryAdded, TPreConnected, TPresent, TReconnected } from "@sca-backend/db";
import { DomainUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainUtilitiesAggregate } from "../../types";

@Injectable()
export class AgentConnectionDalService {
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

	public async disconnectAgent(connectionId: string): Promise<IEntityDisconnectionStatus<AgentRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityDisconnectionStatus<AgentRedisEntity>> => {
				const redisAgent = await this.agentRedisService.fetchAgentFromConnectionId(connectionId);
				if (!redisAgent) return { entity: null, postExpiryTasks: null, status: "Absent" };

				const agentRemoval = await this.agentRedisService.removeOrExpireAgentConnection(redisAgent, connectionId);
				if (agentRemoval.status === "ExpiryAdded") return await this.postAgentExpiryListener(agentRemoval.entity);

				return { entity: agentRemoval.entity, postExpiryTasks: null, status: "Disconnected" };
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

	private async postAgentExpiryListener(expiredAgent: AgentRedisEntity): Promise<IEntityStatus<AgentRedisEntity, TExpiryAdded> & IExpiryObserver<TPresent>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<AgentRedisEntity, TExpiryAdded> & IExpiryObserver<TPresent>> => {
				const postExpiryTasks = this.agentRedisService.postAgentExpiryListener(expiredAgent.entityId);
				return { entity: expiredAgent, postExpiryTasks, status: "ExpiryAdded" };
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
