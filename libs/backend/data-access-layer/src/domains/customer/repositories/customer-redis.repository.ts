import { type CustomerRedisEntity, CustomerRedisSchema } from "../entities";
import { BaseRedisRepository, RedisStorageRepository } from "@sca-backend/db";
import { Injectable } from "@nestjs/common";
import type { Nullable } from "@sca-shared/utils";

@Injectable()
export class CustomerRedisRepository extends BaseRedisRepository<CustomerRedisEntity> {
	public constructor(
		// Dependencies

		private readonly redisStorageRepository: RedisStorageRepository<CustomerRedisEntity>,
	) {
		super(CustomerRedisSchema, redisStorageRepository);
	}

	public async fetchCustomerFromCustomerAndProjectUuid(customerUuid: string, projectUuid: string): Promise<Nullable<CustomerRedisEntity>> {
		return this.redisStorageRepository.repository.search().where("customerUuid").equals(customerUuid).and("projectUuid").equals(projectUuid).return.first();
	}
}
