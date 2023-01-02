import { BaseRedisRepository, RedisStorageRepository } from "@sca-backend/db";
import { type AgentRedisEntity, AgentRedisSchema } from "../entities";
import { Injectable } from "@nestjs/common";
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
		return this.redisStorageRepository.repository.search().where("agentUuid").equals(agentUuid).and("projectUuid").equals(projectUuid).return.first();
	}
}
