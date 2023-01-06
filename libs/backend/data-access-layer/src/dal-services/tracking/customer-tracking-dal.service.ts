import { Inject, Injectable } from "@nestjs/common";
import { DomainUtilitiesAggregateConst } from "../../const";
import { type TrackerEntity, TrackerService } from "../../domains";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainUtilitiesAggregate } from "../../types";

@Injectable()
export class CustomerTrackingDalService {
	public constructor(
		// Dependencies

		private readonly trackerService: TrackerService,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async startTracker(customerId: number, projectId: number, connectionId: string, currentLocation: string): Promise<TrackerEntity> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<TrackerEntity> => {
				return await this.trackerService.startTracker(customerId, projectId, connectionId, currentLocation);
			},
		});
	}

	public async addPageTrack(trackingNumber: string, connectionId: string, currentLocation: string): Promise<TrackerEntity> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<TrackerEntity> => {
				return await this.trackerService.addPageArrivalTrack(trackingNumber, connectionId, currentLocation);
			},
		});
	}

	public async completePageTrack(trackingNumber: string, connectionId: string): Promise<TrackerEntity> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<TrackerEntity> => {
				return await this.trackerService.addPageDepartureTrack(trackingNumber, connectionId);
			},
		});
	}

	public async completeTracker(trackingNumber: string): Promise<TrackerEntity> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async (): Promise<TrackerEntity> => {
				return await this.trackerService.finishTracker(trackingNumber);
			},
		});
	}
}
