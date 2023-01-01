import { type CustomerRedisEntity, CustomerRedisSchema } from "../entities";
import { BaseRedisRepository, RedisStorageRepository } from "@sca-backend/db";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerRedisRepository extends BaseRedisRepository<CustomerRedisEntity> {
	public constructor(
		// Dependencies

		private readonly redisStorageRepository: RedisStorageRepository<CustomerRedisEntity>,
	) {
		super(CustomerRedisSchema, redisStorageRepository);
	}
}
