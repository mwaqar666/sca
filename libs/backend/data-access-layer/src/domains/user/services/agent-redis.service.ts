import { Injectable } from "@nestjs/common";
import { AgentRedisRepository } from "../repositories";
import type { AgentRedisEntity } from "../entities";
import type { Nullable } from "@sca-shared/utils";
import type { IEntityStatus, IRedisEntitySchemaProperties, TCreated, TPreConnected, TReconnected } from "@sca-backend/db";

@Injectable()
export class AgentRedisService {
	public constructor(
		// Dependencies

		private readonly agentRedisRepository: AgentRedisRepository,
	) {}

	public async fetchAgentFromAgentAndProjectUuid(agentUuid: string, projectUuid: string): Promise<Nullable<AgentRedisEntity>> {
		return await this.agentRedisRepository.fetchAgentFromAgentAndProjectUuid(agentUuid, projectUuid);
	}

	public async removeAgentExpiry(agentRedisId: string): Promise<boolean> {
		return await this.agentRedisRepository.persistEntity(agentRedisId);
	}

	public async updateAgentConnectionId(agent: AgentRedisEntity, connectionId: string): Promise<IEntityStatus<AgentRedisEntity, TReconnected>> {
		agent.connectionIds = [connectionId];
		agent = await this.agentRedisRepository.updateEntity(agent);

		return { entity: agent, status: "Reconnected" };
	}

	public async createNewAgentConnection(agentUuid: string, projectUuid: string, connectionId: string): Promise<IEntityStatus<AgentRedisEntity, TCreated>> {
		const creationData: IRedisEntitySchemaProperties<AgentRedisEntity> = { agentUuid, projectUuid, connectionIds: [connectionId] };

		const redisAgent = await this.agentRedisRepository.createEntity(creationData);
		return { entity: redisAgent, status: "Created" };
	}

	public async fetchOnlineAgentsOfProject(projectUuid: string): Promise<Array<AgentRedisEntity>> {
		return await this.agentRedisRepository.fetchEntities("projectUuid", projectUuid);
	}

	public async addAnotherAgentConnection(agent: AgentRedisEntity, connectionId: string): Promise<IEntityStatus<AgentRedisEntity, TPreConnected>> {
		agent.connectionIds = [...agent.connectionIds, connectionId];
		agent = await this.agentRedisRepository.updateEntity(agent);

		return { entity: agent, status: "PreConnected" };
	}
}
