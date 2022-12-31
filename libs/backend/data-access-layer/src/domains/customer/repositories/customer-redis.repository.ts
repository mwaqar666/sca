import { type CustomerEntity, type CustomerRedisEntity, CustomerRedisSchema } from "../entities";
import type { IEntityStatus, IRedisEntitySchemaProperties, TCreated, TPreConnected, TReconnected } from "@sca-backend/db";
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

	public async createNewCustomerConnection(customer: CustomerEntity, trackingNumber: string, connectionId: string): Promise<IEntityStatus<CustomerRedisEntity, TCreated>> {
		const creationData: IRedisEntitySchemaProperties<CustomerRedisEntity> = {
			customerUuid: customer.customerUuid,
			agentUuid: null,
			projectUuid: customer.customerCurrentProject.projectCustomerProject.projectUuid,
			connectionIds: [connectionId],
			trackingNumber: trackingNumber,
		};

		const redisCustomer = await this.createEntity(creationData);
		return { entity: redisCustomer, status: "Created" };
	}

	public async updateExistingCustomerConnection(customer: CustomerRedisEntity, connectionId: string): Promise<IEntityStatus<CustomerRedisEntity, TReconnected>> {
		customer.connectionIds = [connectionId];
		customer = await this.updateEntity(customer);

		return { entity: customer, status: "Reconnected" };
	}

	public async addAnotherCustomerConnection(customer: CustomerRedisEntity, connectionId: string): Promise<IEntityStatus<CustomerRedisEntity, TPreConnected>> {
		customer.connectionIds = [...customer.connectionIds, connectionId];
		customer = await this.updateEntity(customer);

		return { entity: customer, status: "PreConnected" };
	}
}
