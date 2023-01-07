import { Injectable } from "@nestjs/common";
import { CustomerRedisRepository } from "../repositories";
import type { CustomerRedisEntity } from "../entities";
import type { Nullable } from "@sca-shared/utils";
import type { IEntityRemovalStatus, IEntityStatus, IRedisEntitySchemaProperties, TCreated, TPreConnected, TReconnected } from "@sca-backend/db";
import type { Observable } from "rxjs";
import type { ICustomerConnectionList } from "../../../interfaces";

@Injectable()
export class CustomerRedisService {
	public constructor(
		// Dependencies

		private readonly customerRedisRepository: CustomerRedisRepository,
	) {}

	public async fetchCustomerFromCustomerAndProjectUuid(customerUuid: string, projectUuid: string): Promise<Nullable<CustomerRedisEntity>> {
		return await this.customerRedisRepository.fetchCustomerFromCustomerAndProjectUuid(customerUuid, projectUuid);
	}

	public async fetchCustomerFromConnectionId(connectionId: string): Promise<Nullable<CustomerRedisEntity>> {
		return await this.customerRedisRepository.fetchCustomerFromConnectionId(connectionId);
	}

	public async fetchCustomersForAgentOfProject(agentUuid: string, projectUuid: string): Promise<ICustomerConnectionList> {
		const assignedCustomers = await this.customerRedisRepository.fetchCustomersAssignedToAgentForProject(agentUuid, projectUuid);
		const unassignedCustomers = await this.customerRedisRepository.fetchCustomersUnassignedForProject(projectUuid);

		return { assignedCustomers, unassignedCustomers };
	}

	public async assignCustomerToAgent(customer: CustomerRedisEntity, agentUuid: string): Promise<CustomerRedisEntity> {
		customer.agentUuid = agentUuid;

		return await this.customerRedisRepository.updateEntity(customer);
	}

	public async releaseCustomersFromAgentOfProject(agentUuid: string, projectUuid: string): Promise<Array<CustomerRedisEntity>> {
		const customers = await this.customerRedisRepository.fetchCustomersAssignedToAgentForProject(agentUuid, projectUuid);

		return Promise.all(
			customers.map((customer: CustomerRedisEntity) => {
				customer.agentUuid = null;

				return this.customerRedisRepository.updateEntity(customer);
			}),
		);
	}

	public async removeOrExpireCustomerConnection(customer: CustomerRedisEntity, connectionId: string): Promise<IEntityRemovalStatus<CustomerRedisEntity>> {
		if (customer.connectionIds.length > 1) {
			customer = await this.customerRedisRepository.removeConnectionIdFromCustomerConnection(customer, connectionId);
			return { entity: customer, status: "Disconnected" };
		}

		await this.customerRedisRepository.expireEntity(customer.entityId);
		return { entity: customer, status: "ExpiryAdded" };
	}

	public postCustomerExpiryListener(customerRedisId: string): Observable<string> {
		return this.customerRedisRepository.postExpiryListener(customerRedisId);
	}

	public async removeCustomerExpiry(customerRedisId: string): Promise<boolean> {
		return await this.customerRedisRepository.persistEntity(customerRedisId);
	}

	public async createNewCustomerConnection(customerCreationProps: IRedisEntitySchemaProperties<CustomerRedisEntity>): Promise<IEntityStatus<CustomerRedisEntity, TCreated>> {
		const creationData: IRedisEntitySchemaProperties<CustomerRedisEntity> = {
			customerUuid: customerCreationProps.customerUuid,
			agentUuid: customerCreationProps.agentUuid,
			projectUuid: customerCreationProps.projectUuid,
			connectionIds: customerCreationProps.connectionIds,
			trackingNumber: customerCreationProps.trackingNumber,
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
