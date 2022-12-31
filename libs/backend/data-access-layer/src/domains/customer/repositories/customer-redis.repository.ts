import { CustomerRedisEntity, CustomerRedisSchema } from "../entities";
import { type IRedisRepository, RedisStorageRepository } from "@sca-backend/db";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerRedisRepository implements IRedisRepository {
	public constructor(
		// Dependencies

		private readonly redisStorageService: RedisStorageRepository<CustomerRedisEntity>,
	) {}

	public async initializeRepository(): Promise<void> {
		await this.redisStorageService.initializeRepository(CustomerRedisSchema);
	}
}
