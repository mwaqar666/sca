import { Inject, Injectable } from "@nestjs/common";
import { type CustomerEntity, type CustomerRedisEntity, CustomerRedisRepository, TrackerService } from "../domains";
import type { IEntityConnectionStatus, IEntityStatus, TCreated, TPreConnected, TReconnected } from "@sca-backend/db";
import { DomainUtilitiesAggregateConst } from "../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainUtilitiesAggregate } from "../types";
import type { HandleIncomingCustomerPayloadDto } from "@sca-shared/dto";

@Injectable()
export class ConnectedCustomerService {
	public constructor(
		// Dependencies

		private readonly trackerService: TrackerService,
		private readonly customerRedisRepository: CustomerRedisRepository,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async connectAndTrackCustomer(customer: CustomerEntity, connectionId: string, customerPayloadDto: HandleIncomingCustomerPayloadDto): Promise<IEntityConnectionStatus<CustomerRedisEntity>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<IEntityConnectionStatus<CustomerRedisEntity>> => {
				const redisCustomer = await this.customerRedisRepository.fetchEntity("customerUuid", customer.customerUuid);
				if (!redisCustomer) return await this.createNewCustomerConnection(customer, connectionId, customerPayloadDto);

				const customerPersisted = await this.customerRedisRepository.persistEntity(redisCustomer.entityId);
				if (customerPersisted) return await this.updateExistingCustomerConnection(redisCustomer, connectionId, customerPayloadDto);

				return await this.addAnotherCustomerConnection(redisCustomer, connectionId, customerPayloadDto);
			},
		});
	}

	private async createNewCustomerConnection(
		customer: CustomerEntity,
		connectionId: string,
		customerPayloadDto: HandleIncomingCustomerPayloadDto,
	): Promise<IEntityStatus<CustomerRedisEntity, TCreated>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const tracker = await this.trackerService.startTracker(customer.customerId, customer.customerCurrentProject.projectCustomerProjectId, connectionId, customerPayloadDto.currentLocation);

				return await this.customerRedisRepository.createNewCustomerConnection(customer, tracker.trackerTrackingNumber, connectionId);
			},
		});
	}

	private async updateExistingCustomerConnection(
		customer: CustomerRedisEntity,
		connectionId: string,
		customerPayloadDto: HandleIncomingCustomerPayloadDto,
	): Promise<IEntityStatus<CustomerRedisEntity, TReconnected>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				await this.trackerService.addPageArrivalTrack(customer.trackingNumber, connectionId, customerPayloadDto.currentLocation);

				return await this.customerRedisRepository.updateExistingCustomerConnection(customer, connectionId);
			},
		});
	}

	private async addAnotherCustomerConnection(
		customer: CustomerRedisEntity,
		connectionId: string,
		customerPayloadDto: HandleIncomingCustomerPayloadDto,
	): Promise<IEntityStatus<CustomerRedisEntity, TPreConnected>> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				await this.trackerService.addPageArrivalTrack(customer.trackingNumber, connectionId, customerPayloadDto.currentLocation);

				return await this.customerRedisRepository.addAnotherCustomerConnection(customer, connectionId);
			},
		});
	}
}
