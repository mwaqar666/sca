import { Injectable } from "@nestjs/common";
import { AgentRedisRepository } from "../repositories";
import type { AgentRedisEntity } from "../entities";

@Injectable()
export class AgentRedisService {
	public constructor(
		// Dependencies

		private readonly agentRedisRepository: AgentRedisRepository,
	) {}

	public async fetchOnlineAgentsOfProject(projectUuid: string): Promise<Array<AgentRedisEntity>> {
		return await this.agentRedisRepository.fetchEntities("projectUuid", projectUuid);
	}
}
