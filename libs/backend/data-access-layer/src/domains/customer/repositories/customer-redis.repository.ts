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
		return await this.redisStorageRepository.repository.search().where("customerUuid").equals(customerUuid).and("projectUuid").equals(projectUuid).return.first();
	}

	public async fetchCustomerFromConnectionId(connectionId: string): Promise<Nullable<CustomerRedisEntity>> {
		return await this.redisStorageRepository.repository.search().where("connectionIds").contains(connectionId).return.first();
	}

	public async fetchCustomersOfSpecificAgentForProject(agentUuid: string, projectUuid: string): Promise<Array<CustomerRedisEntity>> {
		return await this.redisStorageRepository.repository.search().where("agentUuid").equals(agentUuid).and("projectUuid").equals(projectUuid).return.all();
	}

	public async removeConnectionIdFromCustomerConnection(customer: CustomerRedisEntity, connectionIdToRemove: string) {
		customer.connectionIds = customer.connectionIds.filter((connectionId: string) => connectionId !== connectionIdToRemove);
		const customerRedisId = await this.redisStorageRepository.repository.save(customer);
		return await this.redisStorageRepository.repository.fetch(customerRedisId);
	}
}
