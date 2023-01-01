import { BaseRedisRepository, RedisStorageRepository } from "@sca-backend/db";
import { type AgentRedisEntity, AgentRedisSchema } from "../entities";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AgentRedisRepository extends BaseRedisRepository<AgentRedisEntity> {
	public constructor(
		// Dependencies

		private readonly redisStorageRepository: RedisStorageRepository<AgentRedisEntity>,
	) {
		super(AgentRedisSchema, redisStorageRepository);
	}
}
