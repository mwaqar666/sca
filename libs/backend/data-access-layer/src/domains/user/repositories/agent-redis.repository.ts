import { Injectable } from "@nestjs/common";
import { type AgentRedisEntity, AgentRedisSchema } from "../entities";
import { BaseRedisRepository, RedisStorageRepository } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";

@Injectable()
export class AgentRedisRepository extends BaseRedisRepository<AgentRedisEntity> {
	public constructor(
		// Dependencies

		private readonly redisStorageRepository: RedisStorageRepository<AgentRedisEntity>,
	) {
		super(AgentRedisSchema, redisStorageRepository);
	}

	public async fetchAgentFromAgentAndProjectUuid(agentUuid: string, projectUuid: string): Promise<Nullable<AgentRedisEntity>> {
		return await this.redisStorageRepository.repository.search().where("agentUuid").equals(agentUuid).and("projectUuid").equals(projectUuid).return.first();
	}

	public async fetchAgentsOfProjectUuidExceptAgentUuid(agentUuid: string, projectUuid: string): Promise<Array<AgentRedisEntity>> {
		return await this.redisStorageRepository.repository.search().where("agentUuid").not.equals(agentUuid).and("projectUuid").equals(projectUuid).return.all();
	}

	public async fetchAgentFromConnectionId(connectionId: string): Promise<Nullable<AgentRedisEntity>> {
		return await this.redisStorageRepository.repository.search().where("connectionIds").contains(connectionId).return.first();
	}

	public async removeConnectionIdFromAgentConnection(agent: AgentRedisEntity, connectionIdToRemove: string) {
		agent.connectionIds = agent.connectionIds.filter((connectionId: string) => connectionId !== connectionIdToRemove);
		const agentRedisId = await this.redisStorageRepository.repository.save(agent);
		return await this.redisStorageRepository.repository.fetch(agentRedisId);
	}
}
