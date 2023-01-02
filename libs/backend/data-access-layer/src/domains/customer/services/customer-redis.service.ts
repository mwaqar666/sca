import { CustomerRedisRepository } from "../repositories";
import type { CustomerEntity, CustomerRedisEntity } from "../entities";
import type { Nullable } from "@sca-shared/utils";
import { Injectable } from "@nestjs/common";
import type { IEntityStatus, IRedisEntitySchemaProperties, TCreated, TPreConnected, TReconnected } from "@sca-backend/db";

@Injectable()
export class CustomerRedisService {
	public constructor(
		// Dependencies

		private readonly customerRedisRepository: CustomerRedisRepository,
	) {}

	public async fetchCustomerFromCustomerAndProjectUuid(customerUuid: string, projectUuid: string): Promise<Nullable<CustomerRedisEntity>> {
		return await this.customerRedisRepository.fetchCustomerFromCustomerAndProjectUuid(customerUuid, projectUuid);
	}

	public async removeCustomerExpiry(customerRedisId: string): Promise<boolean> {
		return await this.customerRedisRepository.persistEntity(customerRedisId);
	}

	public async createNewCustomerConnection(customer: CustomerEntity, trackingNumber: string, connectionId: string): Promise<IEntityStatus<CustomerRedisEntity, TCreated>> {
		const creationData: IRedisEntitySchemaProperties<CustomerRedisEntity> = {
			customerUuid: customer.customerUuid,
			agentUuid: null,
			projectUuid: customer.customerCurrentProject.projectCustomerProject.projectUuid,
			connectionIds: [connectionId],
			trackingNumber: trackingNumber,
		};

		const redisCustomer = await this.customerRedisRepository.createEntity(creationData);
		return { entity: redisCustomer, status: "Created" };
	}

	public async updateCustomerConnectionId(customer: CustomerRedisEntity, connectionId: string): Promise<IEntityStatus<CustomerRedisEntity, TReconnected>> {
		customer.connectionIds = [connectionId];
		customer = await this.customerRedisRepository.updateEntity(customer);

		return { entity: customer, status: "Reconnected" };
	}

	public async addAnotherCustomerConnection(customer: CustomerRedisEntity, connectionId: string): Promise<IEntityStatus<CustomerRedisEntity, TPreConnected>> {
		customer.connectionIds = [...customer.connectionIds, connectionId];
		customer = await this.customerRedisRepository.updateEntity(customer);

		return { entity: customer, status: "PreConnected" };
	}
}
