import { Inject, Injectable } from "@nestjs/common";
import { type CustomerEntity, type CustomerRedisEntity, CustomerRedisService, CustomerService, TrackerService } from "../../domains";
import { DomainUtilitiesAggregateConst } from "../../const";
import type {
	IEntityConnectionStatus,
	IEntityDisconnectionStatus,
	IEntityStatus,
	IExpiryObserver,
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
import type { IncomingCustomerRequestDto } from "@sca-shared/dto";
import type { ConnectedCustomerDto } from "../../dto";
import type { CustomerExpiryDto } from "@sca-backend/service-bus";

@Injectable()
export class ConnectedCustomerService {
	public constructor(
		// Dependencies

		private readonly trackerService: TrackerService,
		private readonly customerService: CustomerService,
		private readonly customerRedisService: CustomerRedisService,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async connectAndTrackCustomer(
		customer: CustomerEntity,
		connectionId: string,
		incomingCustomerRequestDto: IncomingCustomerRequestDto,
	): Promise<IEntityConnectionStatus<CustomerRedisEntity>> {
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

	public async disconnectAndTrackCustomer(connectionId: string): Promise<IEntityDisconnectionStatus<CustomerRedisEntity>> {
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

	public async finishCustomerConversationsAndTrackers(customerExpiryDto: CustomerExpiryDto): Promise<void> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				// await this.customerChatService.closeConversations(customerDisconnection.entity, customerDisconnection.entity.agentUuid ?? undefined);
				await this.trackerService.finishTracker(customerExpiryDto.trackingNumber);
			},
		});
	}

	public prepareSingleConnectedCustomerDto(redisCustomer: CustomerRedisEntity, customer: CustomerEntity): ConnectedCustomerDto {
		return {
			customer,
			agentUuid: redisCustomer.agentUuid,
			connectionIds: redisCustomer.connectionIds,
			customerUuid: redisCustomer.customerUuid,
			projectUuid: redisCustomer.projectUuid,
			trackingNumber: redisCustomer.trackingNumber,
		};
	}

	public async releaseCustomersFromAgentOfProject(agentUuid: string, projectUuid: string): Promise<Array<CustomerRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				return await this.customerRedisService.releaseCustomersFromAgentOfProject(agentUuid, projectUuid);
			},
		});
	}

	public async prepareMultipleConnectedCustomerDto(redisCustomers: Array<CustomerRedisEntity>): Promise<Array<ConnectedCustomerDto>> {
		return Promise.all(
			redisCustomers.map((redisCustomer: CustomerRedisEntity) => {
				return this.customerService.findOrFailCustomerUsingUuid(redisCustomer.customerUuid).then(
					(customer: CustomerEntity): ConnectedCustomerDto => ({
						customer,
						agentUuid: redisCustomer.agentUuid,
						connectionIds: redisCustomer.connectionIds,
						customerUuid: redisCustomer.customerUuid,
						projectUuid: redisCustomer.projectUuid,
						trackingNumber: redisCustomer.trackingNumber,
					}),
				);
			}),
		);
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
				await this.trackerService.addPageDepartureTrack(disconnectedCustomer.trackingNumber, connectionId);

				return { entity: disconnectedCustomer, postExpiryTasks: null, status: "Disconnected" };
			},
		});
	}

	private async createNewCustomerConnection(
		customer: CustomerEntity,
		connectionId: string,
		incomingCustomerRequestDto: IncomingCustomerRequestDto,
	): Promise<IEntityStatus<CustomerRedisEntity, TCreated>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<CustomerRedisEntity, TCreated>> => {
				customer.customerCurrentTracker = await this.trackerService.startTracker(
					customer.customerId,
					customer.customerCurrentProject.projectCustomerProjectId,
					connectionId,
					incomingCustomerRequestDto.currentLocation,
				);

				return await this.customerRedisService.createNewCustomerConnection(customer, customer.customerCurrentTracker.trackerTrackingNumber, connectionId);
			},
		});
	}

	private async updateExistingCustomerConnection(
		redisCustomer: CustomerRedisEntity,
		customer: CustomerEntity,
		connectionId: string,
		incomingCustomerRequestDto: IncomingCustomerRequestDto,
	): Promise<IEntityStatus<CustomerRedisEntity, TReconnected>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<CustomerRedisEntity, TReconnected>> => {
				customer.customerCurrentTracker = await this.trackerService.addPageArrivalTrack(redisCustomer.trackingNumber, connectionId, incomingCustomerRequestDto.currentLocation);

				return await this.customerRedisService.updateCustomerConnectionId(redisCustomer, connectionId);
			},
		});
	}

	private async addAnotherCustomerConnection(
		redisCustomer: CustomerRedisEntity,
		customer: CustomerEntity,
		connectionId: string,
		incomingCustomerRequestDto: IncomingCustomerRequestDto,
	): Promise<IEntityStatus<CustomerRedisEntity, TPreConnected>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityStatus<CustomerRedisEntity, TPreConnected>> => {
				customer.customerCurrentTracker = await this.trackerService.addPageArrivalTrack(redisCustomer.trackingNumber, connectionId, incomingCustomerRequestDto.currentLocation);

				return await this.customerRedisService.addAnotherCustomerConnection(redisCustomer, connectionId);
			},
		});
	}
}
