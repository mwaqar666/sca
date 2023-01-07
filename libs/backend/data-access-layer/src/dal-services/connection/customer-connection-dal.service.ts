import { Inject, Injectable } from "@nestjs/common";
import { type CustomerEntity, type CustomerRedisEntity, CustomerRedisService } from "../../domains";
import { DomainUtilitiesAggregateConst } from "../../const";
import type {
	IEntityConnectionStatus,
	IEntityDisconnectionStatus,
	IEntityStatus,
	IExpiryObserver,
	IRedisEntitySchemaProperties,
	TAbsent,
	TCreated,
	TDisconnected,
	TExpiryAdded,
	TPreConnected,
	TPresent,
	TReconnected,
} from "@sca-backend/db";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainUtilitiesAggregate } from "../../types";
import type { IIncomingCustomerRequestDto } from "@sca-shared/dto";
import { CustomerTrackingDalService } from "../tracking";

@Injectable()
export class CustomerConnectionDalService {
	public constructor(
		// Dependencies

		private readonly customerRedisService: CustomerRedisService,
		private readonly customerTrackingDalService: CustomerTrackingDalService,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async connectCustomer(customer: CustomerEntity, connectionId: string, incomingCustomerRequestDto: IIncomingCustomerRequestDto): Promise<IEntityConnectionStatus<CustomerRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityConnectionStatus<CustomerRedisEntity>> => {
				const redisCustomer = await this.customerRedisService.fetchCustomerFromCustomerAndProjectUuid(
					customer.customerUuid,
					customer.customerCurrentProject.projectCustomerProject.projectUuid,
				);
				if (!redisCustomer) return await this.createNewCustomerConnection(customer, connectionId, incomingCustomerRequestDto);

				const customerPersisted = await this.customerRedisService.removeCustomerExpiry(redisCustomer.entityId);
				if (customerPersisted) return await this.updateExistingCustomerConnection(redisCustomer, customer, connectionId, incomingCustomerRequestDto);

				return await this.addAnotherCustomerConnection(redisCustomer, customer, connectionId, incomingCustomerRequestDto);
			},
		});
	}

	public async disconnectCustomer(connectionId: string): Promise<IEntityDisconnectionStatus<CustomerRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityDisconnectionStatus<CustomerRedisEntity>> => {
				const redisCustomer = await this.customerRedisService.fetchCustomerFromConnectionId(connectionId);
				if (!redisCustomer) return { entity: null, postExpiryTasks: null, status: "Absent" };

				const customerRemoval = await this.customerRedisService.removeOrExpireCustomerConnection(redisCustomer, connectionId);
				if (customerRemoval.status === "ExpiryAdded") return await this.postCustomerExpiryListener(customerRemoval.entity);

				return await this.disconnectExtraCustomerConnection(customerRemoval.entity, connectionId);
			},
		});
	}

	private async postCustomerExpiryListener(expiredCustomer: CustomerRedisEntity): Promise<IEntityStatus<CustomerRedisEntity, TExpiryAdded> & IExpiryObserver<TPresent>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<CustomerRedisEntity, TExpiryAdded> & IExpiryObserver<TPresent>> => {
				const postExpiryTasks = this.customerRedisService.postCustomerExpiryListener(expiredCustomer.entityId);
				return { entity: expiredCustomer, postExpiryTasks, status: "ExpiryAdded" };
			},
		});
	}

	private async disconnectExtraCustomerConnection(
		disconnectedCustomer: CustomerRedisEntity,
		connectionId: string,
	): Promise<IEntityStatus<CustomerRedisEntity, TDisconnected> & IExpiryObserver<TAbsent>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<CustomerRedisEntity, TDisconnected> & IExpiryObserver<TAbsent>> => {
				await this.customerTrackingDalService.completePageTrack(disconnectedCustomer.trackingNumber, connectionId);

				return { entity: disconnectedCustomer, postExpiryTasks: null, status: "Disconnected" };
			},
		});
	}

	private async createNewCustomerConnection(
		customer: CustomerEntity,
		connectionId: string,
		incomingCustomerRequestDto: IIncomingCustomerRequestDto,
	): Promise<IEntityStatus<CustomerRedisEntity, TCreated>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<CustomerRedisEntity, TCreated>> => {
				const projectId = customer.customerCurrentProject.projectCustomerProject.projectId;
				const projectUuid = customer.customerCurrentProject.projectCustomerProject.projectUuid;
				customer.customerCurrentTracker = await this.customerTrackingDalService.startTracker(customer.customerId, projectId, connectionId, incomingCustomerRequestDto.currentLocation);

				const newCustomerProps: IRedisEntitySchemaProperties<CustomerRedisEntity> = {
					agentUuid: null,
					projectUuid,
					customerUuid: customer.customerUuid,
					connectionIds: [connectionId],
					trackingNumber: customer.customerCurrentTracker.trackerTrackingNumber,
				};
				return await this.customerRedisService.createNewCustomerConnection(newCustomerProps);
			},
		});
	}

	private async updateExistingCustomerConnection(
		redisCustomer: CustomerRedisEntity,
		customer: CustomerEntity,
		connectionId: string,
		incomingCustomerRequestDto: IIncomingCustomerRequestDto,
	): Promise<IEntityStatus<CustomerRedisEntity, TReconnected>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<CustomerRedisEntity, TReconnected>> => {
				customer.customerCurrentTracker = await this.customerTrackingDalService.addPageTrack(redisCustomer.trackingNumber, connectionId, incomingCustomerRequestDto.currentLocation);

				return await this.customerRedisService.updateCustomerConnectionId(redisCustomer, connectionId);
			},
		});
	}

	private async addAnotherCustomerConnection(
		redisCustomer: CustomerRedisEntity,
		customer: CustomerEntity,
		connectionId: string,
		incomingCustomerRequestDto: IIncomingCustomerRequestDto,
	): Promise<IEntityStatus<CustomerRedisEntity, TPreConnected>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<CustomerRedisEntity, TPreConnected>> => {
				customer.customerCurrentTracker = await this.customerTrackingDalService.addPageTrack(redisCustomer.trackingNumber, connectionId, incomingCustomerRequestDto.currentLocation);

				return await this.customerRedisService.addAnotherCustomerConnection(redisCustomer, connectionId);
			},
		});
	}
}
