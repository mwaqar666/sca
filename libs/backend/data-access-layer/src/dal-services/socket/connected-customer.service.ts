import { Inject, Injectable } from "@nestjs/common";
import { type CustomerEntity, type CustomerRedisEntity, CustomerRedisService, TrackerService } from "../../domains";
import type { IEntityConnectionStatus, IEntityStatus, TCreated, TPreConnected, TReconnected } from "@sca-backend/db";
import { DomainUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainUtilitiesAggregate } from "../../types";
import type { IncomingCustomerRequestDto } from "@sca-shared/dto";
import type { ConnectedCustomerDto } from "../../dto";

@Injectable()
export class ConnectedCustomerService {
	public constructor(
		// Dependencies

		private readonly trackerService: TrackerService,
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

	public prepareConnectedCustomerDto(redisCustomer: CustomerRedisEntity, customer: CustomerEntity): ConnectedCustomerDto {
		return {
			customer,
			agentUuid: redisCustomer.agentUuid,
			connectionIds: redisCustomer.connectionIds,
			customerUuid: redisCustomer.customerUuid,
			projectUuid: redisCustomer.projectUuid,
			trackingNumber: redisCustomer.trackingNumber,
		};
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
